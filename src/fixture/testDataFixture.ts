import { expect, type TestInfo } from '@playwright/test';
import { test as base } from './TestFixture';
import { GraphQLClient } from '../api/GraphQLClient';
import { createIamDevice, type CreatedDevice } from '../utils/iamDevice/iamDeviceApi';
import { partNumberFromTestTags } from '../utils/iamDevice/iamDevicePool';
import type { DevicesApi } from '../api/devices/DevicesApi';

export type { CreatedDevice };

async function createSyncedIamDevice(args: {
    request: Parameters<typeof createIamDevice>[0];
    devicesApi: DevicesApi;
    dealerAccountId: string;
    iamAccountId: string;
    testInfo: TestInfo;
}): Promise<CreatedDevice> {
    const { request, devicesApi, dealerAccountId, iamAccountId, testInfo } = args;
    expect(dealerAccountId, 'Set dealerAccountId via test.use(...)').toBeTruthy();
    expect(iamAccountId, 'Set iamAccountId via test.use(...)').toBeTruthy();

    const partNumber = partNumberFromTestTags(testInfo.tags);
    const created = await createIamDevice(request, '', testInfo, dealerAccountId, iamAccountId, partNumber);
    const catalogDevice = await devicesApi.waitForDealerDeviceBySerial(dealerAccountId, created.serialNumber);

    console.log(
        `Fixture: Created IAM device for test "${testInfo.title}". id:`,
        catalogDevice.id,
        'serial number:',
        catalogDevice.serialNumber,
        'partNumber:',
        catalogDevice.partNumber ?? partNumber,
    );

    return {
        id: catalogDevice.id,
        serialNumber: catalogDevice.serialNumber,
        partNumber: catalogDevice.partNumber ?? partNumber,
    };
}

export const test = base.extend<{
    /** Dealer account id for pool path and sync — set via `test.use` (GraphQL `dealerAccountId`, CDH-style id). */
    dealerAccountId: string;
    /** Trimble IAM `accountId` (UUID); set via `test.use` where tests or API clients require it. */
    iamAccountId: string;
    /** Number of devices created by the `createdDevices` fixture. */
    createdDeviceCount: number;
    /** Set via `test.use` for `createdDeviceSubscriptionCleanup` — customer account id for `revokeLicense`. */
    subscriptionRevokeCustomerAccountId: string;
    /** Set via `test.use` — subscription line id for `revokeLicense` (e.g. `uuid::SKU`). */
    subscriptionRevokeSubscriptionId: string;
    /** Set via `test.use` — dealer account id for `revokeLicense`. */
    subscriptionRevokeDealerAccountId: string;
    /**
     * Set via `test.use` for `createdDeviceSubscriptionCleanup`.
     * When true, `revokeLicense` runs only if the test failed or timed out (tests that already revoke in-body).
     */
    subscriptionRevokeOnlyOnFailure: boolean;
    /** Set via `test.use` for `userLicenseAssignmentCleanup` — customer account id for `revokeUserLicense`. */
    userLicenseRevokeCustomerAccountId: string;
    /** Set via `test.use` for `userLicenseAssignmentCleanup` — dealer account id for `revokeUserLicense`. */
    userLicenseRevokeDealerAccountId: string;
    /** Set via `test.use` — subscription ids (e.g. `uuid::SKU`) to revoke from each user on test failure. */
    userLicenseRevokeSubscriptionIds: string[];
    /** Set via `test.use` — user ids whose licenses should be revoked on test failure. */
    userLicenseRevokeUserIds: string[];
    /**
     * Set via `test.use` for `userLicenseAssignmentCleanup`. Defaults to true.
     * When true, `revokeUserLicense` runs only if the test failed or timed out. Set false to always revoke on teardown.
     */
    userLicenseRevokeOnlyOnFailure: boolean;
    /** Set via `test.use` for `createdDeviceSuperkeyCleanup` — SKUs passed to `revokeSuperKey`. */
    superkeyRevokeSkus: { id: string; type: string }[];
    /**
     * Set via `test.use` for `createdDeviceSuperkeyCleanup`.
     * When true, `revokeSuperKey` runs only if the test failed or timed out (tests that already revoke in-body).
     */
    superkeyRevokeOnlyOnFailure: boolean;
    /** IAM create + catalog sync by serial; device is not deleted after the test. */
    createdDevice: CreatedDevice;
    /** Two independent IAM devices created with the current test's dealer, IAM account, and part number. */
    createdDevices: CreatedDevice[];
    createdDeviceRetained: CreatedDevice;
    /** Same as `createdDevice`, then optional `revokeLicense` on teardown. */
    createdDeviceSubscriptionCleanup: CreatedDevice;
    /** Same as `createdDevice`, then optional `revokeSuperKey` on teardown. */
    createdDeviceSuperkeyCleanup: CreatedDevice;
    /** Auto-fixture: revokes `userLicenseRevoke*` subscriptions/users on teardown, per `userLicenseRevokeOnlyOnFailure`. */
    userLicenseAssignmentCleanup: void;
}>({
    graphQLClient: async ({ request, dealerAccountId }, use) => {
        await use(new GraphQLClient(request, dealerAccountId));
    },
    dealerAccountId: ['', { option: true }],
    iamAccountId: ['', { option: true }],
    createdDeviceCount: [2, { option: true }],
    subscriptionRevokeCustomerAccountId: ['', { option: true }],
    subscriptionRevokeSubscriptionId: ['', { option: true }],
    subscriptionRevokeDealerAccountId: ['', { option: true }],
    subscriptionRevokeOnlyOnFailure: [false, { option: true }],
    userLicenseRevokeCustomerAccountId: ['', { option: true }],
    userLicenseRevokeDealerAccountId: ['', { option: true }],
    userLicenseRevokeSubscriptionIds: [[], { option: true }],
    userLicenseRevokeUserIds: [[], { option: true }],
    userLicenseRevokeOnlyOnFailure: [true, { option: true }],
    superkeyRevokeSkus: [[], { option: true }],
    superkeyRevokeOnlyOnFailure: [false, { option: true }],
    createdDevice: async ({ request, devicesApi, dealerAccountId, iamAccountId }, use, testInfo) => {
        const device = await createSyncedIamDevice({ request, devicesApi, dealerAccountId, iamAccountId, testInfo });
        await use(device);
    },
    createdDevices: async ({ request, devicesApi, dealerAccountId, iamAccountId, createdDeviceCount }, use, testInfo) => {
        expect(createdDeviceCount, 'createdDeviceCount must be greater than zero').toBeGreaterThan(0);
        const devices: CreatedDevice[] = [];
        for (let index = 0; index < createdDeviceCount; index++) {
            devices.push(await createSyncedIamDevice({ request, devicesApi, dealerAccountId, iamAccountId, testInfo }));
        }
        await use(devices);
    },
    createdDeviceRetained: async ({ createdDevice }, use) => {
        await use(createdDevice);
    },
    createdDeviceSubscriptionCleanup: async (
        {
            createdDevice,
            devicesApi,
            subscriptionRevokeCustomerAccountId,
            subscriptionRevokeSubscriptionId,
            subscriptionRevokeDealerAccountId,
            subscriptionRevokeOnlyOnFailure,
        },
        use,
        testInfo,
    ) => {
        await use(createdDevice);

        if (subscriptionRevokeOnlyOnFailure && testInfo.status !== 'failed' && testInfo.status !== 'timedOut') {
            return;
        }

        console.log('Fixture: Teardown revokeLicense for device. id:', createdDevice.id, 'serial number:', createdDevice.serialNumber);

        if (subscriptionRevokeCustomerAccountId && subscriptionRevokeSubscriptionId && subscriptionRevokeDealerAccountId) {
            try {
                await devicesApi.revokeLicense(
                    subscriptionRevokeCustomerAccountId,
                    createdDevice.id,
                    subscriptionRevokeSubscriptionId,
                    subscriptionRevokeDealerAccountId,
                );
            } catch (error) {
                console.warn(
                    `Fixture: revokeLicense cleanup failed (device=${createdDevice.id}, subscription=${subscriptionRevokeSubscriptionId}):`,
                    error,
                );
            }
        } else {
            console.warn(
                'Fixture: skipped revokeLicense — set subscriptionRevokeCustomerAccountId, subscriptionRevokeSubscriptionId, and subscriptionRevokeDealerAccountId via test.use(...) when using createdDeviceSubscriptionCleanup',
            );
        }
    },
    createdDeviceSuperkeyCleanup: async (
        {
            createdDevice,
            devicesApi,
            dealerAccountId,
            superkeyRevokeSkus,
            superkeyRevokeOnlyOnFailure,
        },
        use,
        testInfo,
    ) => {
        await use(createdDevice);

        if (superkeyRevokeOnlyOnFailure && testInfo.status !== 'failed' && testInfo.status !== 'timedOut') {
            return;
        }

        console.log('Fixture: Teardown revokeSuperKey for device. id:', createdDevice.id, 'serial number:', createdDevice.serialNumber);

        if (dealerAccountId && superkeyRevokeSkus.length > 0) {
            try {
                await devicesApi.revokeSuperKey(createdDevice.id, superkeyRevokeSkus, dealerAccountId);
            } catch (error) {
                console.warn(`Fixture: revokeSuperKey cleanup failed (device=${createdDevice.id}):`, error);
            }
        } else {
            console.warn(
                'Fixture: skipped revokeSuperKey — set superkeyRevokeSkus via test.use(...) when using createdDeviceSuperkeyCleanup',
            );
        }
    },
    userLicenseAssignmentCleanup: async (
        {
            customerUsersApi,
            userLicenseRevokeCustomerAccountId,
            userLicenseRevokeDealerAccountId,
            userLicenseRevokeSubscriptionIds,
            userLicenseRevokeUserIds,
            userLicenseRevokeOnlyOnFailure,
        },
        use,
        testInfo,
    ) => {
        await use();

        if (userLicenseRevokeOnlyOnFailure && testInfo.status !== 'failed' && testInfo.status !== 'timedOut') {
            return;
        }

        if (
            !userLicenseRevokeCustomerAccountId ||
            !userLicenseRevokeDealerAccountId ||
            userLicenseRevokeSubscriptionIds.length === 0 ||
            userLicenseRevokeUserIds.length === 0
        ) {
            console.warn(
                'Fixture: skipped userLicenseAssignmentCleanup — set userLicenseRevokeCustomerAccountId, userLicenseRevokeDealerAccountId, userLicenseRevokeSubscriptionIds, and userLicenseRevokeUserIds via test.use(...) to enable failure cleanup',
            );
            return;
        }

        console.log(
            `Fixture: Test "${testInfo.title}" ${testInfo.status} — revoking user licenses for cleanup. users:`,
            userLicenseRevokeUserIds,
            'subscriptions:',
            userLicenseRevokeSubscriptionIds,
        );

        for (const userId of userLicenseRevokeUserIds) {
            for (const subscriptionId of userLicenseRevokeSubscriptionIds) {
                try {
                    await customerUsersApi.revokeUserLicense(
                        userLicenseRevokeCustomerAccountId,
                        userLicenseRevokeDealerAccountId,
                        subscriptionId,
                        userId,
                    );
                } catch (error) {
                    console.warn(
                        `Fixture: revokeUserLicense cleanup failed (user=${userId}, subscription=${subscriptionId}):`,
                        error,
                    );
                }
            }
        }
    },
});

export default test;
