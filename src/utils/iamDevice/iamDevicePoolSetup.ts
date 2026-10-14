import { expect } from '@playwright/test';
import { test as setup } from '../../fixture/TestFixture';
import type { CreatedDevice } from './iamDeviceApi';
import {
    IAM_DEVICE_POOL_PART_NUMBER_TAGS,
    getIamDevicePoolPath,
    initIamDevicePoolFile,
    partNumberFromPnTag,
    poolShardLabel,
    resolveIamDevicePoolSize,
} from './iamDevicePool';
import { smokeDealerAccountId, smokeIamAccountId } from '../../config/featureTestConfig';

setup.describe.configure({ mode: 'serial' });

setup('Feature: provision IAM device pool for checkout fixtures', async ({ devicesApi }, testInfo) => {
    expect(smokeDealerAccountId, 'Pool setup dealer id').toBeTruthy();
    expect(smokeIamAccountId, 'Pool setup IAM account id').toBeTruthy();

    const config = testInfo.config;
    const n = resolveIamDevicePoolSize(config);
    const shardCurrent = config.shard?.current ?? 1;
    const shardTotal = config.shard && config.shard.total > 1 ? config.shard.total : 1;
    const poolPath = getIamDevicePoolPath(smokeDealerAccountId, config.shard);
    const first = Math.max(n * shardTotal, n);
    const start = (shardCurrent - 1) * n;

    console.log(
        `[iamDevicePoolSetup] shard=${poolShardLabel(config.shard)} poolSize=${n} first=${first} poolPath=${poolPath}`,
    );

    const availableByPartNumber: Record<string, CreatedDevice[]> = {};

    for (const tag of IAM_DEVICE_POOL_PART_NUMBER_TAGS) {
        const partNumber = partNumberFromPnTag(tag);
        expect(partNumber, `Expected a part number in tag ${tag}`).toBeTruthy();

        const response = await devicesApi.getDealerDevices(smokeDealerAccountId, true, first, partNumber);
        const sorted = [...response.dealerDevicesV2.nodes].sort((a, b) => a.serialNumber.localeCompare(b.serialNumber));
        const devices: CreatedDevice[] = sorted.slice(start, start + n).map((device) => {
            expect(device.partNumber, `Device ${device.serialNumber} missing partNumber in catalog response`).toBeTruthy();
            expect(device.partNumber, `Device ${device.serialNumber} partNumber mismatch`).toBe(partNumber);
            return {
                id: device.id,
                serialNumber: device.serialNumber,
                partNumber: device.partNumber,
            };
        });

        expect(
            devices,
            `Expected ${n} unassigned devices with partNumber=${partNumber} for shard ${shardCurrent}/${shardTotal} (sorted serials, offset ${start}); got ${devices.length} of ${sorted.length} returned`,
        ).toHaveLength(n);

        availableByPartNumber[partNumber!] = devices;
        console.log(
            `[iamDevicePoolSetup] partNumber=${partNumber} reserved ${devices.length} device(s):`,
            devices.map((device) => `${device.serialNumber} (${device.partNumber})`).join(', '),
        );
    }

    await initIamDevicePoolFile(poolPath, smokeDealerAccountId, smokeIamAccountId, availableByPartNumber);
    console.log(`[iamDevicePoolSetup] wrote pool for partNumbers: ${Object.keys(availableByPartNumber).join(', ')}`);
});
