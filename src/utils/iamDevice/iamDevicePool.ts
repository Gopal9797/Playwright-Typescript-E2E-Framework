import { execFileSync } from 'child_process';
import { expect, type FullConfig, type TestInfo } from '@playwright/test';
import { mkdir, readFile, rename, writeFile } from 'fs/promises';
import lock from 'proper-lockfile';
import { join } from 'path';
import type { CreatedDevice } from './iamDeviceApi';

export const IAM_DEVICE_POOL_DIR = join(process.cwd(), '.playwright-iam-pool');

export type IamDevicePoolState = {
    version: 2;
    dealerAccountId: string;
    iamAccountId: string;
    /** Unassigned devices reserved per catalog part number. */
    availableByPartNumber: Record<string, CreatedDevice[]>;
    /** Lease key → device still checked out */
    leases: Record<string, CreatedDevice>;
};

function sanitizeForPath(id: string): string {
    return id.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export function poolShardLabel(shard: FullConfig['shard']): string {
    if (!shard || shard.total <= 1) {
        return '1-of-1';
    }
    return `${shard.current}-of-${shard.total}`;
}

/** Optional marker retained for pool-size counting when a suite opts into tag-based sizing. */
export const IAM_DEVICE_POOL_TEST_TAG = '@iamDevicePool';

/** Part number tag for pooled tests that need model/part 133611. */
export const PN_133611 = '@pn-133611';

/** Part number tag for pooled tests that need part 90915-00. */
export const PN_90915_00 = '@pn-90915-00';

/** Part number tag for pooled tests that need part 199020-01. */
export const PN_199020_01 = '@pn-199020-01';

/** Part-number tags to reserve in pool setup (`@pn-<partNumber>`). */
export const IAM_DEVICE_POOL_PART_NUMBER_TAGS = [PN_133611, PN_90915_00, PN_199020_01];

const PN_TAG_PREFIX = '@pn-';

/** `@pn-133611` → `133611`. */
export function partNumberFromPnTag(tag: string): string | undefined {
    if (!tag.startsWith(PN_TAG_PREFIX)) {
        return undefined;
    }
    const partNumber = tag.slice(PN_TAG_PREFIX.length).trim();
    return partNumber || undefined;
}

export function partNumberFromTestTags(tags: readonly string[]): string {
    const partNumbers = tags.map(partNumberFromPnTag).filter((value): value is string => Boolean(value));
    if (partNumbers.length === 0) {
        throw new Error(
            `Pooled-device test is missing a part-number tag (${PN_TAG_PREFIX}<partNumber>). Example: ${PN_133611}`,
        );
    }
    return partNumbers[0];
}

/** Used when `--list` fails or no tests carry the optional pool-size marker. */
const IAM_DEVICE_POOL_TAGGED_COUNT_FALLBACK = 6;

/** Optional override for pool size (e.g. filtered runs). Skips `--list` sizing when set to a valid non‑negative integer. */
export const IAM_DEVICE_POOL_SIZE_ENV = 'IAM_DEVICE_POOL_SIZE';

const FEATURE_TESTS_PROJECT = 'featureTests';

function parseIamDevicePoolSizeFromEnv(): number | null {
    const raw = process.env[IAM_DEVICE_POOL_SIZE_ENV];
    if (raw === undefined || raw.trim() === '') {
        return null;
    }
    const n = Number.parseInt(raw.trim(), 10);
    if (!Number.isFinite(n) || n < 0) {
        console.warn(
            `[iamDevicePool] Invalid ${IAM_DEVICE_POOL_SIZE_ENV}="${raw}". Expected a non-negative integer. Ignoring.`,
        );
        return null;
    }
    return n;
}

/** Count optionally marked pool tests on this shard using the same shard split as the current run. */
export function countIamDevicePoolTaggedTestsForShard(config: FullConfig): number {
    const configPath = join(process.cwd(), 'playwright.config.ts');
    const shard = config.shard;
    const playwrightArgs = [
        'playwright',
        'test',
        '--config',
        configPath,
        `--project=${FEATURE_TESTS_PROJECT}`,
        '--grep',
        IAM_DEVICE_POOL_TEST_TAG,
        '--list',
    ];
    if (shard && shard.total > 1) {
        playwrightArgs.push(`--shard=${shard.current}/${shard.total}`);
    }

    const command = process.platform === 'win32' ? 'cmd.exe' : 'npx';
    const commandArgs = process.platform === 'win32' ? ['/c', 'npx', ...playwrightArgs] : playwrightArgs;

    try {
        const out = execFileSync(command, commandArgs, {
            encoding: 'utf-8',
            cwd: process.cwd(),
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe'],
            maxBuffer: 10 * 1024 * 1024,
        });

        // `Total:` includes the matched spec tests plus a handful of dependency/teardown project tests
        // (e.g. featureApiAuthSetup, featureIamDevicePoolSetup, featureIamDevicePoolTeardown).
        // Over-provisioning the pool by a few devices is fine; under-provisioning is what breaks tests,
        // so we keep this simple and just trust the reported total.
        const m = out.match(/Total:\s*(\d+)\b/i);
        if (m) {
            const n = Number.parseInt(m[1], 10);
            if (Number.isFinite(n) && n >= 0) {
                console.log(`[iamDevicePool] playwright --list reported ${n} test(s) for pool sizing.`);
                return n;
            }
        }
    } catch (e: unknown) {
        console.warn('[iamDevicePool] playwright --list --grep failed; using fallback count.', e);
    }
    return 0;
}

/** Pool size = count of optionally marked tests on this shard, or a small fallback if no marker matches. */
export function resolveIamDevicePoolSize(config: FullConfig): number {
    const fromEnv = parseIamDevicePoolSizeFromEnv();
    if (fromEnv !== null) {
        console.log(`[iamDevicePool] Pool size = ${fromEnv} (${IAM_DEVICE_POOL_SIZE_ENV} override)`);
        return fromEnv;
    }

    const tagged = countIamDevicePoolTaggedTestsForShard(config);
    if (tagged > 0) {
        console.log(`[iamDevicePool] Pool size = tagged @iamDevicePool tests on this shard: ${tagged}`);
        return tagged;
    }

    console.warn(
        `[iamDevicePool] No tests matched optional marker ${IAM_DEVICE_POOL_TEST_TAG} for this shard (or --list failed). Using fallback ${IAM_DEVICE_POOL_TAGGED_COUNT_FALLBACK}; set ${IAM_DEVICE_POOL_SIZE_ENV} for an explicit pool size.`,
    );
    return IAM_DEVICE_POOL_TAGGED_COUNT_FALLBACK;
}

export function getIamDevicePoolPath(dealerAccountId: string, shard: FullConfig['shard']): string {
    const dealerPart = sanitizeForPath(dealerAccountId);
    const shardPart = poolShardLabel(shard);
    return join(IAM_DEVICE_POOL_DIR, `dealer-${dealerPart}_shard-${shardPart}.json`);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readPoolState(path: string): Promise<IamDevicePoolState> {
    const raw = await readFile(path, 'utf-8');
    return JSON.parse(raw) as IamDevicePoolState;
}

async function writePoolAtomic(path: string, state: IamDevicePoolState): Promise<void> {
    await mkdir(IAM_DEVICE_POOL_DIR, { recursive: true });
    const tmp = `${path}.${process.pid}.tmp`;
    await writeFile(tmp, `${JSON.stringify(state, null, 2)}\n`, 'utf-8');
    await rename(tmp, path);
}

async function withPoolLock<T>(poolPath: string, fn: () => Promise<T>): Promise<T> {
    await mkdir(IAM_DEVICE_POOL_DIR, { recursive: true });
    const release = await lock.lock(poolPath, {
        retries: {
            retries: 30,
            factor: 2,
            minTimeout: 50,
            maxTimeout: 500,
        },
    });
    try {
        return await fn();
    } finally {
        await release();
    }
}

export async function writeIamDevicePoolState(poolPath: string, state: IamDevicePoolState): Promise<void> {
    await writePoolAtomic(poolPath, state);
}

/**
 * Save pool after setup project populated devices.
 */
export async function initIamDevicePoolFile(
    poolPath: string,
    dealerAccountId: string,
    iamAccountId: string,
    availableByPartNumber: Record<string, CreatedDevice[]>,
): Promise<void> {
    const state: IamDevicePoolState = {
        version: 2,
        dealerAccountId,
        iamAccountId,
        availableByPartNumber: Object.fromEntries(
            Object.entries(availableByPartNumber).map(([partNumber, devices]) => [partNumber, [...devices]]),
        ),
        leases: {},
    };
    await writePoolAtomic(poolPath, state);
}

function leaseKeyFromTestInfo(testInfo: TestInfo): string {
    return `${testInfo.testId}-retry${testInfo.retry}`;
}

const CHECKOUT_POLL_MS = 200;
const CHECKOUT_TIMEOUT_MS = 120_000;

/**
 * Pop one device for this test's `@pn-*` tag from `availableByPartNumber` into `leases`.
 */
export async function checkoutPooledDevice(poolPath: string, testInfo: TestInfo): Promise<CreatedDevice> {
    const leaseKey = leaseKeyFromTestInfo(testInfo);
    const partNumber = partNumberFromTestTags(testInfo.tags);
    const deadline = Date.now() + CHECKOUT_TIMEOUT_MS;

    while (Date.now() < deadline) {
        let device: CreatedDevice | null = null;
        try {
            device = await withPoolLock(poolPath, async () => {
                const state = await readPoolState(poolPath);
                const bucket = state.availableByPartNumber[partNumber] ?? [];
                const next = bucket.shift();
                if (!next) {
                    return null;
                }
                state.availableByPartNumber[partNumber] = bucket;
                state.leases[leaseKey] = next;
                await writePoolAtomic(poolPath, state);
                return next;
            });
        } catch (e: unknown) {
            const code = e && typeof e === 'object' && 'code' in e ? (e as NodeJS.ErrnoException).code : undefined;
            if (code === 'ENOENT') {
                throw new Error(
                    `IAM device pool file missing at ${poolPath}. Run featureIamDevicePoolSetup after featureApiAuthSetup.`,
                );
            }
            throw e;
        }
        if (device) {
            const resolvedPartNumber = device.partNumber ?? partNumber;
            expect(
                resolvedPartNumber,
                `Checked-out device ${device.serialNumber} partNumber=${device.partNumber ?? '(missing)'} does not match test tag @pn-${partNumber}`,
            ).toBe(partNumber);
            console.log(
                `[iamDevicePool] Checked out device for "${testInfo.title}": serial=${device.serialNumber}, id=${device.id}, partNumber=${resolvedPartNumber}`,
            );
            return { ...device, partNumber: resolvedPartNumber };
        }
        await sleep(CHECKOUT_POLL_MS);
    }

    throw new Error(
        `checkoutPooledDevice: timed out after ${CHECKOUT_TIMEOUT_MS}ms waiting for a free device with partNumber=${partNumber} in ${poolPath}. Re-run pool setup for this shard, lower --workers, or split shards so fewer @iamDevicePool tests run together.`,
    );
}

/**
 * Remove lease after device has been deleted from IAM (consumed from pool).
 */
export async function releasePooledLease(poolPath: string, testInfo: TestInfo): Promise<void> {
    const leaseKey = leaseKeyFromTestInfo(testInfo);
    await withPoolLock(poolPath, async () => {
        let state: IamDevicePoolState;
        try {
            state = await readPoolState(poolPath);
        } catch (e: unknown) {
            const code = e && typeof e === 'object' && 'code' in e ? (e as NodeJS.ErrnoException).code : undefined;
            if (code === 'ENOENT') {
                return;
            }
            throw e;
        }
        delete state.leases[leaseKey];
        await writePoolAtomic(poolPath, state);
    });
}

export async function loadPoolStateIfExists(poolPath: string): Promise<IamDevicePoolState | null> {
    try {
        return await readPoolState(poolPath);
    } catch (e: unknown) {
        const code = e && typeof e === 'object' && 'code' in e ? (e as NodeJS.ErrnoException).code : undefined;
        if (code === 'ENOENT') {
            return null;
        }
        throw e;
    }
}

/**
 * Atomically remove all devices from `available` and return them so callers can delete them from IAM.
 * Does not modify `leases` (devices still checked out when this runs should be handled by test teardown).
 */
export async function popAllAvailableDevicesFromPool(poolPath: string): Promise<CreatedDevice[]> {
    return withPoolLock(poolPath, async () => {
        let state: IamDevicePoolState;
        try {
            state = await readPoolState(poolPath);
        } catch (e: unknown) {
            const code = e && typeof e === 'object' && 'code' in e ? (e as NodeJS.ErrnoException).code : undefined;
            if (code === 'ENOENT') {
                return [];
            }
            throw e;
        }
        const devices = Object.values(state.availableByPartNumber).flat();
        if (devices.length === 0) {
            return [];
        }
        state.availableByPartNumber = Object.fromEntries(
            Object.keys(state.availableByPartNumber).map((partNumber) => [partNumber, []]),
        );
        await writePoolAtomic(poolPath, state);
        return devices;
    });
}
