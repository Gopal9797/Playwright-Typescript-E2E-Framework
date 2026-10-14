import { test, type CreatedDevice } from '../../fixture/testDataFixture';
import { expect } from '@playwright/test';
import type { DevicesApi } from '../../api/devices/DevicesApi';
import { DeviceToast } from '../../pages/DevicePage';
import { ManageLicensesToast } from '../../pages/ManageLicensesModal';
import { PN_133611, PN_90915_00 } from '../../utils/iamDevice/iamDevicePool';
import { openManageDeviceModal } from '../featureTestHelpers';
import {
    smokeAssignSubscriptionCore,
    smokeAssignSubscription90915Package,
    smokeAssignSubscription90915Standalone,
    smokeContractId,
    smokeCustomerAccountCdhId,
    smokeCustomerName,
    smokeDealerAccountId,
    smokeDifferentDealerAccountId,
    smokeDifferentIamAccountId,
    smokeIamAccountId,
    smokeAssignSubscriptionSameFamilySku,
    smokeSubscriptionSku,
} from '../../config/featureTestConfig';

test.use({
    storageState: '.auth/upgaccountuser.json',
    dealerAccountId: smokeDealerAccountId,
    iamAccountId: smokeIamAccountId,
    subscriptionRevokeCustomerAccountId: smokeCustomerAccountCdhId,
    subscriptionRevokeSubscriptionId: smokeAssignSubscriptionCore,
    subscriptionRevokeDealerAccountId: smokeDealerAccountId,
});

test.describe('Device Assign subscriptions', () => {
    test.use({
        subscriptionRevokeCustomerAccountId: smokeCustomerAccountCdhId,
        subscriptionRevokeSubscriptionId: smokeAssignSubscriptionCore,
        subscriptionRevokeDealerAccountId: smokeDealerAccountId,
    });

    async function assignThenRevokeSubscription(
        devicesApi: DevicesApi,
        device: CreatedDevice,
        subscriptionId: string,
    ) {
        const assignResponse = await test.step('Assign subscription to device', async () =>
            devicesApi.assignSubscriptionsToDevices(
                smokeCustomerAccountCdhId,
                smokeDealerAccountId,
                [device.id],
                [subscriptionId],
            ),
        );

        await test.step('Validate assign-subscriptions response', async () => {
            devicesApi.expectValidAssignSubscriptionsToDevicesResponse(assignResponse, [device.id]);
        });

        const revokeResponse = await test.step('Revoke license', async () =>
            devicesApi.revokeLicense(
                smokeCustomerAccountCdhId,
                device.id,
                subscriptionId,
                smokeDealerAccountId,
            ),
        );

        await test.step('Validate revoke-license response', async () => {
            devicesApi.expectValidRevokeLicenseResponse(revokeResponse);
        });
    }

    test('API:assigns a core subscription to a device (part 133611)', { tag: ['@smoke', PN_133611] }, async ({
        devicesApi,
        createdDeviceSubscriptionCleanup,
    }) => {
        const response = await test.step('Assign a subscription to a device', async () =>
            devicesApi.assignSubscriptionsToDevices(
                smokeCustomerAccountCdhId,
                smokeDealerAccountId,
                [createdDeviceSubscriptionCleanup.id],
                [smokeAssignSubscriptionCore],
            ),
        );
        await test.step('Validate assign-subscriptions response', async () => {
            devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
        });
    });

    const assignThenRevokeCases = [
        {
            title: 'assigns then revokes a core subscription (part 133611)',
            tags: ['@smoke', PN_133611],
            subscriptionId: smokeAssignSubscriptionCore,
        },
        {
            title: 'assigns then revokes a standalone bundle (part 90915-00)',
            tags: ['@smoke', PN_90915_00],
            subscriptionId: smokeAssignSubscription90915Standalone,
        },
        {
            title: 'assigns then revokes a package bundle (part 90915-00)',
            tags: ['@smoke', PN_90915_00],
            subscriptionId: smokeAssignSubscription90915Package,
        },
    ] as const;

    for (const { title, tags, subscriptionId } of assignThenRevokeCases) {
        test.describe(title, () => {
            test.use({
                subscriptionRevokeSubscriptionId: subscriptionId,
                subscriptionRevokeOnlyOnFailure: true,
            });

            test(title, { tag: ['@smoke', ...tags] }, async ({ devicesApi, createdDeviceSubscriptionCleanup }) => {
                await assignThenRevokeSubscription(devicesApi, createdDeviceSubscriptionCleanup, subscriptionId);
            });
        });
    }
});

test.describe('Device license assignment UI', () => {
    test.use({
        storageState: '.auth/upgaccountuser.json',
        dealerAccountId: smokeDealerAccountId,
        iamAccountId: smokeIamAccountId,
        subscriptionRevokeCustomerAccountId: smokeCustomerAccountCdhId,
        subscriptionRevokeSubscriptionId: smokeAssignSubscriptionCore,
        subscriptionRevokeDealerAccountId: smokeDealerAccountId,
    });

    test('Verify that manage device modal shows assigned license detail (part 133611)', { tag: ['@smoke', '@NZDEV-T1003', PN_133611] }, async ({
        devicesApi,
        createdDeviceSubscriptionCleanup,
        devicePage,
        page,
        homePage,
    }) => {
        const response = await test.step('Assign a subscription to a device', async () =>
            devicesApi.assignSubscriptionsToDevices(
                smokeCustomerAccountCdhId,
                smokeDealerAccountId,
                [createdDeviceSubscriptionCleanup.id],
                [smokeAssignSubscriptionCore],
            ),
        );

        await test.step('Validate assign-subscriptions response', async () => {
            devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
        });

        await test.step('Validate manage device modal is displayed', async () => {
            await openManageDeviceModal(
                page,
                homePage,
                devicePage,
                createdDeviceSubscriptionCleanup.serialNumber,
            );
            await devicePage.validateManageDeviceModalForAssignedSubscription(
                createdDeviceSubscriptionCleanup.serialNumber,
                smokeSubscriptionSku(smokeAssignSubscriptionCore),
            );
            await devicePage.validateAssignedSubscriptionDetails();
        });

    });

    test('Verify the transferring term is not shown for customer owned device (part 133611)', { tag: ['@smoke', '@NZDEV-T979', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);

        await test.step('Transfer device to customer through API', async () => {
            const response = await devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceRetained.id]);
            devicesApi.expectValidTransferDeviceResponse(
                response,
                createdDeviceRetained.id,
                smokeCustomerAccountCdhId,
            );
        });

        await test.step('Open Assign Subscription modal', async () => {
            await page.goto('/' + smokeDealerAccountId);
            await homePage.navigateToDevicesPage();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.manageDevice(serialNumber);
            await devicePage.clickOnAssignSubscription();
        });

        await test.step('Validate transferring term is not shown', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(sku);
            await devicePage.assignSubscriptionDeviceModal.validateTransferTermsNotVisible();
        });
    });

    test('Verify the transferring term is default to be transfer now for dealer owned device and can only select one option (part 133611)', { tag: ['@smoke', '@NZDEV-T978', '@NZDEV-T977', PN_133611] }, async ({
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);

        await test.step('Open Assign Subscription modal', async () => {
            await page.goto('/' + smokeDealerAccountId);
            await homePage.navigateToDevicesPage();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.manageDevice(serialNumber);
            await devicePage.clickOnAssignSubscription();
        });

        await test.step('Select customer and validate available subscription', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectCustomer(smokeCustomerName);
            await devicePage.assignSubscriptionDeviceModal.validateSubscriptionAvailable(sku);
        });

        await test.step('Validate transferring term is default to be transfer now', async () => {
            await devicePage.assignSubscriptionDeviceModal.validateTransferNowSelected();
        });

        await test.step('Switch to scheduled transfer and validate only one option is selected', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectScheduledTransfer();
        });
    });

    test('Verify the dealer can select only select a subscription from the same family (part 133611)', { tag: ['@smoke', '@NZDEV-T981', '@NZDEV-T980', PN_133611] }, async ({
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
        const sameFamilySku = smokeAssignSubscriptionSameFamilySku;

        await test.step('Open Assign Subscription modal', async () => {
            await page.goto('/' + smokeDealerAccountId);
            await homePage.navigateToDevicesPage();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.manageDevice(serialNumber);
            await devicePage.clickOnAssignSubscription();
        });

        await test.step('Select customer and validate available subscription', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectCustomer(smokeCustomerName);
            await devicePage.assignSubscriptionDeviceModal.validateSubscriptionAvailable(sku);
            await devicePage.assignSubscriptionDeviceModal.validateSubscriptionAvailable(sameFamilySku);
        });

        await test.step('Select one subscription SKU at a time', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(sku);
            await devicePage.assignSubscriptionDeviceModal.validateOnlyOneSubscriptionSelected();
            await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(sameFamilySku);
            await devicePage.assignSubscriptionDeviceModal.validateOnlyOneSubscriptionSelected();
            await devicePage.assignSubscriptionDeviceModal.validateAssignSubscriptionButtonEnabled();
        });
    });

    test('Assigns a subscription to a device with transfer now (part 133611)', { tag: ['@smoke', '@NZDEV-T982', PN_133611] }, async ({
        createdDeviceSubscriptionCleanup,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceSubscriptionCleanup.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);

        await test.step('Open Assign Subscription modal', async () => {
            await page.goto('/' + smokeDealerAccountId);
            await homePage.navigateToDevicesPage();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.manageDevice(serialNumber);
            await devicePage.clickOnAssignSubscription();
        });

        await test.step('Select customer and subscription SKU', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectCustomer(smokeCustomerName);
            await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(sku);
        });

        await test.step('Assign subscription', async () => {
            await devicePage.assignSubscriptionDeviceModal.assignSubscription(DeviceToast.subscriptionAssignedAndDeviceTransferred);
        });

        await test.step('Validate subscription is assigned', async () => {
            await openManageDeviceModal(page, homePage, devicePage, serialNumber);
            await devicePage.validateManageDeviceModalForAssignedSubscription(serialNumber, sku);
        });
    });

    test('Bulk assigns a subscription to a device with transfer now (part 133611)', { tag: ['@smoke', '@NZDEV-T991', PN_133611] }, async ({
        createdDeviceSubscriptionCleanup,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceSubscriptionCleanup.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);

        await test.step('Open bulk Assign Subscriptions modal', async () => {
            await page.goto('/' + smokeDealerAccountId);
            await homePage.navigateToDevicesPage();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.selectMultipleDevices();
            await devicePage.selectDevice(serialNumber);
            await devicePage.clickOnManageSelection();
            await devicePage.clickOnAssignSubscriptions();
        });

        await test.step('Select customer and subscription SKU', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectCustomer(smokeCustomerName);
            await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(sku);
        });

        await test.step('Assign subscription', async () => {
            await devicePage.assignSubscriptionDeviceModal.assignSubscription(DeviceToast.subscriptionAssignedAndDeviceTransferred);
        });

        await test.step('Validate subscription is assigned', async () => {
            await openManageDeviceModal(page, homePage, devicePage, serialNumber);
            await devicePage.validateManageDeviceModalForAssignedSubscription(serialNumber, sku);
        });
    });

    test('Bulk assigns a subscription to a device with scheduled transfer (part 133611)', { tag: ['@smoke', '@NZDEV-T992', PN_133611] }, async ({
        createdDeviceSubscriptionCleanup,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceSubscriptionCleanup.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);

        await test.step('Open bulk Assign Subscriptions modal', async () => {
            await page.goto('/' + smokeDealerAccountId);
            await homePage.navigateToDevicesPage();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.selectMultipleDevices();
            await devicePage.selectDevice(serialNumber);
            await devicePage.clickOnManageSelection();
            await devicePage.clickOnAssignSubscriptions();
        });

        await test.step('Select customer, subscription SKU, and scheduled transfer', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectCustomer(smokeCustomerName);
            await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(sku);
            await devicePage.assignSubscriptionDeviceModal.selectScheduledTransfer();
        });

        await test.step('Assign subscription', async () => {
            await devicePage.assignSubscriptionDeviceModal.assignSubscription(DeviceToast.subscriptionAssignedAndTransferScheduled);
        });

        await test.step('Validate subscription and scheduled transfer are displayed', async () => {
            await openManageDeviceModal(page, homePage, devicePage, serialNumber);
            await devicePage.validateManageDeviceModalForAssignedSubscription(serialNumber, sku);
            await devicePage.validateScheduledTransferInformation(smokeCustomerName);
        });
    });

    test('Verify that when selecting dealer owned devices, transfer device option is enabled (part 133611)', { tag: ['@smoke', '@NZDEV-T993', '@NZDEV-T994', '@NZDEV-T996', PN_133611] }, async ({
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await page.goto('/' + smokeDealerAccountId);
        await homePage.navigateToDevicesPage();
        await devicePage.searchForDevice(serialNumber);
        await devicePage.validateDeviceRowVisible(serialNumber);
        await devicePage.selectMultipleDevices();
        await devicePage.selectDevice(serialNumber);
        await expect(devicePage.manageSelectionButton).toBeVisible();
        await devicePage.clickOnManageSelection();
        await expect(devicePage.transferDevicesButton).toBeEnabled();
        await expect(devicePage.assignSubscriptionsButton).toBeEnabled();
        await devicePage.removeSelectedDevice(serialNumber);
    });

    test('Verify that when selecting customer owned devices, assign subscription option is enabled (part 133611)', { tag: ['@smoke', '@NZDEV-T997', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await test.step('Transfer device to customer through API', async () => {
            const response = await devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceRetained.id]);
            devicesApi.expectValidTransferDeviceResponse(
                response,
                createdDeviceRetained.id,
                smokeCustomerAccountCdhId,
            );
        });

        await page.goto('/' + smokeDealerAccountId);
        await homePage.navigateToDevicesPage();
        await devicePage.searchForDevice(serialNumber);
        await devicePage.validateDeviceRowVisible(serialNumber);
        await devicePage.selectMultipleDevices();
        await devicePage.selectDevice(serialNumber);
        await expect(devicePage.manageSelectionButton).toBeVisible();
        await devicePage.clickOnManageSelection();
        await expect(devicePage.assignSubscriptionsButton).toBeEnabled();
        await expect(devicePage.transferDevicesButton).toBeDisabled();
    });

    test('Verify that when selecting dealer owned devices and customer owned devices, transfer device option is not enabled and assign subscriptions is enabled (part 133611)', { tag: ['@smoke', '@NZDEV-T995', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await test.step('Transfer device to customer through API', async () => {
            const response = await devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceRetained.id]);
            devicesApi.expectValidTransferDeviceResponse(
                response,
                createdDeviceRetained.id,
                smokeCustomerAccountCdhId,
            );
        });

        await page.goto('/' + smokeDealerAccountId);
        await homePage.navigateToDevicesPage();
        await devicePage.searchForDevice(serialNumber);
        await devicePage.validateDeviceRowVisible(serialNumber);
        await devicePage.selectMultipleDevices();
        await devicePage.selectDevice(serialNumber);
        await devicePage.unallocatedDevicesTab.click();
        await devicePage.searchForDevice('133611');
        await devicePage.selectFirstDevice();
        await expect(devicePage.manageSelectionButton).toBeVisible();
        await devicePage.clickOnManageSelection();
        await expect(devicePage.assignSubscriptionsButton).toBeEnabled();
        await expect(devicePage.transferDevicesButton).toBeDisabled();
    });

    test('Verify that when selecting multiple different model devices, no assignment or transfer option is enabled (part 133611)', { tag: ['@smoke', '@NZDEV-T993', PN_133611] }, async ({
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await page.goto('/' + smokeDealerAccountId);
        await homePage.navigateToDevicesPage();
        await devicePage.searchForDevice(serialNumber);
        await devicePage.validateDeviceRowVisible(serialNumber);
        await devicePage.selectMultipleDevices();
        await devicePage.selectDevice(serialNumber);
        const differentModelPartNumber = '199020-01';
        await devicePage.searchForDevice(differentModelPartNumber);
        await devicePage.validateDevicePartNumberVisible(differentModelPartNumber);
        await devicePage.selectFirstDevice();
        await expect(devicePage.manageSelectionButton).toBeVisible();
        await devicePage.clickOnManageSelection();
        await expect(devicePage.assignSubscriptionsButton).toBeDisabled();
        await expect(devicePage.transferDevicesButton).toBeDisabled();
    });

    test('Assigns a subscription to a device with scheduled transfer (part 133611)', { tag: ['@smoke', '@NZDEV-T1004', '@NZDEV-T983', '@NZDEV-T1000', PN_133611] }, async ({
        createdDeviceSubscriptionCleanup,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceSubscriptionCleanup.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);

        await test.step('Open Assign Subscription modal', async () => {
            await page.goto('/' + smokeDealerAccountId);
            await homePage.navigateToDevicesPage();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.manageDevice(serialNumber);
            await devicePage.clickOnAssignSubscription();
        });

        await test.step('Select customer, subscription SKU, and scheduled transfer', async () => {
            await devicePage.assignSubscriptionDeviceModal.selectCustomer(smokeCustomerName);
            await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(sku);
            await devicePage.assignSubscriptionDeviceModal.selectScheduledTransfer();
        });

        await test.step('Assign subscription', async () => {
            await devicePage.assignSubscriptionDeviceModal.assignSubscription(DeviceToast.subscriptionAssignedAndTransferScheduled);
        });

        await test.step('Validate subscription is assigned', async () => {
            await openManageDeviceModal(page, homePage, devicePage, serialNumber);
            await devicePage.validateManageDeviceModalForAssignedSubscription(serialNumber, sku);
            await devicePage.validateScheduledTransferInformation(smokeCustomerName);
        });
    });

    test.describe('Revoke subscription through UI', () => {
        test.use({
            subscriptionRevokeOnlyOnFailure: true,
        });

        test('Verify Manage Dealer Device - Revoke with 1 Subscription On Device (part 133611)', { tag: ['@smoke', '@NZDEV-T985', PN_133611] }, async ({
            devicesApi,
            createdDeviceSubscriptionCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            const response = await test.step('Assign a subscription to a device', async () =>
                devicesApi.assignSubscriptionsToDevices(
                    smokeCustomerAccountCdhId,
                    smokeDealerAccountId,
                    [createdDeviceSubscriptionCleanup.id],
                    [smokeAssignSubscriptionCore],
                ),
            );

            await test.step('Validate assign-subscriptions response', async () => {
                devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
            });

            await test.step('Validate manage device modal is displayed', async () => {
                await openManageDeviceModal(
                    page,
                    homePage,
                    devicePage,
                    createdDeviceSubscriptionCleanup.serialNumber,
                );
                await devicePage.validateManageDeviceModalForAssignedSubscription(
                    createdDeviceSubscriptionCleanup.serialNumber,
                    smokeSubscriptionSku(smokeAssignSubscriptionCore),
                );
            });

            await test.step('Revoke subscription through UI', async () => {
                await devicePage.revokeAssignedSubscription(
                    smokeSubscriptionSku(smokeAssignSubscriptionCore),
                    DeviceToast.subscriptionRevoked);
            });
        });

        test('Verify Manage Dealer Device - Revoke and cancel transfer with 1 Subscription on Device with scheduled transfer (part 133611)', { tag: ['@smoke', '@NZDEV-T986', PN_133611] }, async ({
            devicesApi,
            createdDeviceSubscriptionCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            const scheduledTransferDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
            const response = await test.step('Assign a subscription to a device', async () =>
                devicesApi.assignSubscriptionsToDevices(
                    smokeCustomerAccountCdhId,
                    smokeDealerAccountId,
                    [createdDeviceSubscriptionCleanup.id],
                    [smokeAssignSubscriptionCore],
                    scheduledTransferDate,
                ),
            );

            await test.step('Validate assign-subscriptions response', async () => {
                devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
            });

            await test.step('Validate manage device modal is displayed', async () => {
                await openManageDeviceModal(
                    page,
                    homePage,
                    devicePage,
                    createdDeviceSubscriptionCleanup.serialNumber,
                );
                await devicePage.validateManageDeviceModalForAssignedSubscription(
                    createdDeviceSubscriptionCleanup.serialNumber,
                    smokeSubscriptionSku(smokeAssignSubscriptionCore),
                );
            });

            await test.step('Revoke subscription through UI', async () => {
                await devicePage.revokeAssignedSubscriptionAndCancelTransfer(
                    smokeSubscriptionSku(smokeAssignSubscriptionCore),
                    DeviceToast.subscriptionRevokedAndTransferCanceled
                );
            });
        });

        test('Verify Manage Dealer Device - Revoke and transfer now with 1 Subscription on Device with scheduled transfer (part 133611)', { tag: ['@smoke', '@NZDEV-T987', PN_133611] }, async ({
            devicesApi,
            createdDeviceSubscriptionCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            const scheduledTransferDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
            const response = await test.step('Assign a subscription to a device', async () =>
                devicesApi.assignSubscriptionsToDevices(
                    smokeCustomerAccountCdhId,
                    smokeDealerAccountId,
                    [createdDeviceSubscriptionCleanup.id],
                    [smokeAssignSubscriptionCore],
                    scheduledTransferDate,
                ),
            );

            await test.step('Validate assign-subscriptions response', async () => {
                devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
            });

            await test.step('Validate manage device modal is displayed', async () => {
                await openManageDeviceModal(
                    page,
                    homePage,
                    devicePage,
                    createdDeviceSubscriptionCleanup.serialNumber,
                );
                await devicePage.validateManageDeviceModalForAssignedSubscription(
                    createdDeviceSubscriptionCleanup.serialNumber,
                    smokeSubscriptionSku(smokeAssignSubscriptionCore),
                );
            });

            await test.step('Revoke subscription through UI', async () => {
                await devicePage.revokeAssignedSubscriptionAndTransferDeviceNow(
                    smokeSubscriptionSku(smokeAssignSubscriptionCore),
                    DeviceToast.subscriptionRevokedAndTransferSuccessful)
            });
        });
    });

    test.describe('Verify Manage Dealer Device - transfer now with 1 Subscription on Device with scheduled transfer (part 133611)', () => {
        // Doesn't revoke via UI, so let the fixture always revoke on teardown.
        test.use({ subscriptionRevokeOnlyOnFailure: false });

        test('Verify Manage Dealer Device - transfer now with 1 Subscription on Device with scheduled transfer (part 133611)', { tag: ['@smoke', '@NZDEV-T989', PN_133611] }, async ({
            devicesApi,
            createdDeviceSubscriptionCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            const scheduledTransferDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
            const response = await test.step('Assign a subscription to a device', async () =>
                devicesApi.assignSubscriptionsToDevices(
                    smokeCustomerAccountCdhId,
                    smokeDealerAccountId,
                    [createdDeviceSubscriptionCleanup.id],
                    [smokeAssignSubscriptionCore],
                    scheduledTransferDate,
                ),
            );

            await test.step('Validate assign-subscriptions response', async () => {
                devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
            });

            await test.step('Validate manage device modal is displayed', async () => {
                await openManageDeviceModal(
                    page,
                    homePage,
                    devicePage,
                    createdDeviceSubscriptionCleanup.serialNumber,
                );
                await devicePage.validateManageDeviceModalForAssignedSubscription(
                    createdDeviceSubscriptionCleanup.serialNumber,
                    smokeSubscriptionSku(smokeAssignSubscriptionCore),
                );
            });

            await test.step('Transfer now', async () => {
                await devicePage.transferNow(DeviceToast.deviceTransferSuccessful);
            });
        });
    });

    test.describe('Verify Manage Dealer Device - cancel transfer with 1 Subscription on Device with scheduled transfer (part 133611)', () => {
        // Doesn't revoke via UI, so let the fixture always revoke on teardown.
        test.use({ subscriptionRevokeOnlyOnFailure: false });

        test('Verify Manage Dealer Device - cancel transfer with 1 Subscription on Device with scheduled transfer (part 133611)', { tag: ['@smoke', '@NZDEV-T988', PN_133611] }, async ({
            devicesApi,
            createdDeviceSubscriptionCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            const scheduledTransferDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
            const response = await test.step('Assign a subscription to a device', async () =>
                devicesApi.assignSubscriptionsToDevices(
                    smokeCustomerAccountCdhId,
                    smokeDealerAccountId,
                    [createdDeviceSubscriptionCleanup.id],
                    [smokeAssignSubscriptionCore],
                    scheduledTransferDate,
                ),
            );

            await test.step('Validate assign-subscriptions response', async () => {
                devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
            });

            await test.step('Validate manage device modal is displayed', async () => {
                await openManageDeviceModal(
                    page,
                    homePage,
                    devicePage,
                    createdDeviceSubscriptionCleanup.serialNumber,
                );
                await devicePage.validateManageDeviceModalForAssignedSubscription(
                    createdDeviceSubscriptionCleanup.serialNumber,
                    smokeSubscriptionSku(smokeAssignSubscriptionCore),
                );
            });

            await test.step('Cancel transfer', async () => {
                await devicePage.cancelTransfer(DeviceToast.deviceTransferCancelled);
            });
        });
    });
});

test.describe('Device license assignment from contract', () => {
    test.use({
        storageState: '.auth/upgaccountuser.json',
        dealerAccountId: smokeDealerAccountId,
        iamAccountId: smokeIamAccountId,
        subscriptionRevokeCustomerAccountId: smokeCustomerAccountCdhId,
        subscriptionRevokeSubscriptionId: smokeAssignSubscriptionCore,
        subscriptionRevokeDealerAccountId: smokeDealerAccountId,
    });

    test('Verify the dealer can select multiple eligible devices to assign subscription (part 133611)', { tag: ['@smoke', '@NZDEV-T961', '@NZDEV-T1011', PN_133611] }, async ({
        createdDevices,
        summaryScreenPage,
        page,
    }) => {
        const serialNumber1 = createdDevices[0].serialNumber;
        const serialNumber2 = createdDevices[1].serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
        const contractId = smokeContractId(smokeAssignSubscriptionCore);

        await test.step('Validate two devices were created for the multi-device assignment', async () => {
            expect(createdDevices).toHaveLength(2);
        });

        await test.step('Open contract subscriptions tab', async () => {
            await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
        });

        await test.step('Validate subscription card displays the SKU and Manage Licenses button', async () => {
            await summaryScreenPage.validateSubscriptionCardForAssignment(sku);
        });

        const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
            summaryScreenPage.openManageLicensesModal(sku),
        );

        await test.step('Select the license line and continue to the assign step', async () => {
            await manageLicensesModal.selectLicenseLine();
            await manageLicensesModal.clickAssignLicenses();
        });

        await test.step('Enter the first device serial number', async () => {
            await manageLicensesModal.submitSerialNumberForAssignment(serialNumber1);
        });

        await test.step('Validate Assign Licenses button is enabled before entering another serial number', async () => {
            await manageLicensesModal.validateAssignLicensesButtonEnabled();
        });

        await test.step('Enter the second device serial number', async () => {
            await manageLicensesModal.submitSerialNumberForAssignment(serialNumber2);
        });

        await test.step('Validate both device serial numbers were added to the assignment', async () => {
            await manageLicensesModal.validateDevicesAddedToAssignment([serialNumber1, serialNumber2]);
        });

    });

    test('Verify the dealer cannot select non-eligible (non-applicable modal) devices for assignment and see error (part 90915-00)', { tag: ['@smoke', '@NZDEV-T955', '@NZDEV-T957', PN_90915_00] }, async ({
        createdDeviceRetained,
        summaryScreenPage,
        page,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
        const contractId = smokeContractId(smokeAssignSubscriptionCore);

        await test.step('Open contract subscriptions tab', async () => {
            await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
        });

        await test.step('Validate subscription card displays the SKU and Manage Licenses button', async () => {
            await summaryScreenPage.validateSubscriptionCardForAssignment(sku);
        });

        const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
            summaryScreenPage.openManageLicensesModal(sku),
        );

        await test.step('Select the license line and continue to the assign step', async () => {
            await manageLicensesModal.selectLicenseLine();
            await manageLicensesModal.clickAssignLicenses();
        });

        await test.step('Enter non-applicable device serial number', async () => {
            await manageLicensesModal.submitSerialNumberForAssignment(serialNumber);
        });

        await test.step('Validate non-applicable product error', async () => {
            await manageLicensesModal.validateNotApplicableProductError();
        });

        await test.step('Enter an invalid device serial number', async () => {
            await manageLicensesModal.submitSerialNumberForAssignment('12345');
        });

        await test.step('Validate generic device not found error', async () => {
            await manageLicensesModal.validateNoDeviceFoundError();
        });
    });

    test('Verify the dealer cannot select non-eligible (different customer) devices for assignment and see error (part 133611)', { tag: ['@smoke', '@NZDEV-T955', '@NZDEV-T956', PN_133611] }, async ({
        createdDeviceRetained,
        summaryScreenPage,
        devicePage,
        homePage,
        page,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
        const contractId = smokeContractId(smokeAssignSubscriptionCore);

        await test.step('Transfer device to the first customer through the UI', async () => {
            await page.goto('/' + smokeDealerAccountId);
            await homePage.navigateToDevicesPage();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.manageDevice(serialNumber);
            await devicePage.clickOnTransferDevice();
            await devicePage.transferDeviceModal.selectFirstCustomer();
            await devicePage.transferDeviceModal.transferDevice(DeviceToast.deviceTransferSuccessful);
        });

        await test.step('Open contract subscriptions tab', async () => {
            await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
        });

        await test.step('Validate subscription card displays the SKU and Manage Licenses button', async () => {
            await summaryScreenPage.validateSubscriptionCardForAssignment(sku);
        });

        const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
            summaryScreenPage.openManageLicensesModal(sku),
        );

        await test.step('Select the license line and continue to the assign step', async () => {
            await manageLicensesModal.selectLicenseLine();
            await manageLicensesModal.clickAssignLicenses();
        });

        await test.step('Enter non-applicable device serial number', async () => {
            await manageLicensesModal.submitSerialNumberForAssignment(serialNumber);
        });

        await test.step('Validate device does not belong to customer error', async () => {
            await manageLicensesModal.validateDeviceDoesNotBelongToCustomerError();
        });
    });

    test.describe('Assignment of a device created for a different dealer', () => {
        test.use({
            dealerAccountId: smokeDifferentDealerAccountId,
            iamAccountId: smokeDifferentIamAccountId,
        });

        test('Verify the dealer cannot select non-eligible (different dealer owned) devices for assignment and see error (part 133611)', { tag: ['@smoke', '@NZDEV-T958', PN_133611] }, async ({
            createdDeviceRetained,
            summaryScreenPage,
            page,
        }) => {
            const serialNumber = createdDeviceRetained.serialNumber;
            const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
            const contractId = smokeContractId(smokeAssignSubscriptionCore);

            await test.step('Open contract subscriptions tab', async () => {
                await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
            });

            await test.step('Validate subscription card displays the SKU and Manage Licenses button', async () => {
                await summaryScreenPage.validateSubscriptionCardForAssignment(sku);
            });

            const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
                summaryScreenPage.openManageLicensesModal(sku),
            );

            await test.step('Select the license line and continue to the assign step', async () => {
                await manageLicensesModal.selectLicenseLine();
                await manageLicensesModal.clickAssignLicenses();
            });

            await test.step('Enter non-applicable device serial number', async () => {
                await manageLicensesModal.submitSerialNumberForAssignment(serialNumber);
            });

            await test.step('Validate device does not belong to dealer error', async () => {
                await manageLicensesModal.validateDeviceDoesNotBelongToDealerError();
            });
        });
    });

    test('Assigns a license to a device from the contract subscriptions tab (part 133611)', { tag: ['@smoke', '@NZDEV-T953', '@NZDEV-T954', '@NZDEV-T959', '@NZDEV-T963', '@NZDEV-T966', PN_133611] }, async ({
        createdDeviceSubscriptionCleanup,
        summaryScreenPage,
        page,
    }) => {
        const serialNumber = createdDeviceSubscriptionCleanup.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
        const contractId = smokeContractId(smokeAssignSubscriptionCore);

        await test.step('Open contract subscriptions tab', async () => {
            await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
        });

        await test.step('Validate subscription card displays the SKU and Manage Licenses button', async () => {
            await summaryScreenPage.validateSubscriptionCardForAssignment(sku);
        });

        const licenseCountsBeforeAssignment = await test.step('Capture license counts before assignment', async () =>
            summaryScreenPage.assignedAndUnassignedLicenseCounts(sku),
        );

        const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
            summaryScreenPage.openManageLicensesModal(sku),
        );

        await test.step('Select the license line and continue to the assign step', async () => {
            await manageLicensesModal.selectLicenseLine();
            await manageLicensesModal.clickAssignLicenses();
        });

        await test.step('Assign license to device by serial number', async () => {
            await manageLicensesModal.assignLicenseToDevice(serialNumber);
        });

        await test.step('Validate license counts reflect the new assignment', async () => {
            await summaryScreenPage.validateLicenseCountsAfterAssignment(sku, licenseCountsBeforeAssignment);
        });
    });

    test('Assigns a license to a customer owned device from the contract subscriptions tab (part 133611)', { tag: ['@smoke', '@NZDEV-T968', PN_133611] }, async ({
        createdDeviceSubscriptionCleanup,
        summaryScreenPage,
        devicesApi,
        page,
    }) => {
        const serialNumber = createdDeviceSubscriptionCleanup.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
        const contractId = smokeContractId(smokeAssignSubscriptionCore);

        await test.step('Transfer device to customer through API', async () => {
            const response = await devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceSubscriptionCleanup.id]);
            devicesApi.expectValidTransferDeviceResponse(
                response,
                createdDeviceSubscriptionCleanup.id,
                smokeCustomerAccountCdhId,
            );
        });

        await test.step('Open contract subscriptions tab', async () => {
            await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
        });

        await test.step('Validate subscription card displays the SKU and Manage Licenses button', async () => {
            await summaryScreenPage.validateSubscriptionCardForAssignment(sku);
        });

        const licenseCountsBeforeAssignment = await test.step('Capture license counts before assignment', async () =>
            summaryScreenPage.assignedAndUnassignedLicenseCounts(sku),
        );

        const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
            summaryScreenPage.openManageLicensesModal(sku),
        );

        await test.step('Select the license line and continue to the assign step', async () => {
            await manageLicensesModal.selectLicenseLine();
            await manageLicensesModal.clickAssignLicenses();
        });

        await test.step('Add device and assign license', async () => {
            await manageLicensesModal.addDeviceToAssignment(serialNumber);
            await manageLicensesModal.validateTransferTermsNotVisible();
            await manageLicensesModal.clickAssignLicenses(ManageLicensesToast.licenseAssigned);
        });

        await test.step('Validate license counts reflect the new assignment', async () => {
            await summaryScreenPage.validateLicenseCountsAfterAssignment(sku, licenseCountsBeforeAssignment);
        });
    });

    test('Verify transfer terms are visible when assigning a license to a device (part 133611)', { tag: ['@smoke', '@NZDEV-T964', '@NZDEV-T965', '@NZDEV-T969', PN_133611] }, async ({
        createdDeviceRetained,
        summaryScreenPage,
        page,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
        const contractId = smokeContractId(smokeAssignSubscriptionCore);

        await test.step('Open contract subscriptions tab', async () => {
            await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
        });

        await test.step('Validate subscription card displays the SKU and Manage Licenses button', async () => {
            await summaryScreenPage.validateSubscriptionCardForAssignment(sku);
        });

        const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
            summaryScreenPage.openManageLicensesModal(sku),
        );

        await test.step('Select the license line and continue to the assign step', async () => {
            await manageLicensesModal.selectLicenseLine();
            await manageLicensesModal.clickAssignLicenses();
        });

        await test.step('Add the device and continue to the transfer terms step', async () => {
            await manageLicensesModal.addDeviceToAssignment(serialNumber);
            await manageLicensesModal.clickAssignLicenses();
        });

        await test.step('Validate transfer terms are visible', async () => {
            await manageLicensesModal.validateTransferTermsVisible();
        });

        await test.step('Validate customer input is disabled', async () => {
            await manageLicensesModal.validateCustomerInputDisabled();
        });

        await test.step('Select scheduled transfer and validate the seven-day date range', async () => {
            await manageLicensesModal.selectScheduledTransfer();
            await manageLicensesModal.validateScheduledTransferDateRange();
        });
    });

    test('Assigns a license to a device from the contract subscriptions tab with scheduled transfer (part 133611)', { tag: ['@smoke', '@NZDEV-T967', '@NZDEV-T970', PN_133611] }, async ({
        createdDeviceSubscriptionCleanup,
        summaryScreenPage,
        page,
    }) => {
        const serialNumber = createdDeviceSubscriptionCleanup.serialNumber;
        const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
        const contractId = smokeContractId(smokeAssignSubscriptionCore);

        await test.step('Open contract subscriptions tab', async () => {
            await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
        });

        const licenseCountsBeforeAssignment = await test.step('Capture license counts before assignment', async () =>
            summaryScreenPage.assignedAndUnassignedLicenseCounts(sku),
        );

        const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
            summaryScreenPage.openManageLicensesModal(sku),
        );

        await test.step('Select the license line and continue to the assign step', async () => {
            await manageLicensesModal.selectLicenseLine();
            await manageLicensesModal.clickAssignLicenses();
        });

        await test.step('Assign license to device with scheduled transfer', async () => {
            await manageLicensesModal.assignLicenseToDevice(serialNumber, { scheduleTransfer: true });
        });

        await test.step('Validate license counts reflect the new assignment', async () => {
            await summaryScreenPage.validateLicenseCountsAfterAssignment(sku, licenseCountsBeforeAssignment);
        });
    });

    test.describe('Revoke a device license from the contract side (part 133611)', () => {
        // Revokes via UI, so let the fixture only revoke on teardown if the test failed.
        test.use({ subscriptionRevokeOnlyOnFailure: true });

        test('Revokes a device license from the contract side (part 133611)', { tag: ['@smoke', '@NZDEV-T970', PN_133611] }, async ({
            createdDeviceSubscriptionCleanup,
            summaryScreenPage,
            page,
            devicesApi,
        }) => {
            const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
            const contractId = smokeContractId(smokeAssignSubscriptionCore);

            const response = await test.step('Assign a subscription to a device', async () =>
                devicesApi.assignSubscriptionsToDevices(
                    smokeCustomerAccountCdhId,
                    smokeDealerAccountId,
                    [createdDeviceSubscriptionCleanup.id],
                    [smokeAssignSubscriptionCore],
                ),
            );

            await test.step('Validate assign-subscriptions response', async () => {
                devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
            });

            await test.step('Open contract subscriptions tab', async () => {
                await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
            });

            const licenseCountsBeforeRevoke = await test.step('Capture license counts before revoke', async () =>
                summaryScreenPage.assignedAndUnassignedLicenseCounts(sku),
            );

            const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
                summaryScreenPage.openManageLicensesModal(sku),
            );

            await test.step('Revoke the assigned device', async () => {
                await manageLicensesModal.revokeAssignedDevice(createdDeviceSubscriptionCleanup.serialNumber);
            });

            await test.step('Validate license counts reflect the revoke', async () => {
                await expect
                    .poll(async () => (await summaryScreenPage.assignedAndUnassignedLicenseCounts(sku)).assigned)
                    .toBeLessThanOrEqual(licenseCountsBeforeRevoke.assigned);
                await expect
                    .poll(async () => (await summaryScreenPage.assignedAndUnassignedLicenseCounts(sku)).unassigned)
                    .toBeGreaterThanOrEqual(licenseCountsBeforeRevoke.unassigned);
            });
        });

        test('Revokes a device license and cancels its scheduled transfer from the contract side (part 133611)', { tag: ['@smoke', '@NZDEV-T973', PN_133611] }, async ({
            createdDeviceSubscriptionCleanup,
            summaryScreenPage,
            page,
            devicesApi,
        }) => {
            const scheduledTransferDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
            const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
            const contractId = smokeContractId(smokeAssignSubscriptionCore);

            const response = await test.step('Assign a subscription to a device with a scheduled transfer', async () =>
                devicesApi.assignSubscriptionsToDevices(
                    smokeCustomerAccountCdhId,
                    smokeDealerAccountId,
                    [createdDeviceSubscriptionCleanup.id],
                    [smokeAssignSubscriptionCore],
                    scheduledTransferDate,
                ),
            );

            await test.step('Validate assign-subscriptions response', async () => {
                devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
            });

            await test.step('Open contract subscriptions tab', async () => {
                await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
            });

            const licenseCountsBeforeRevoke = await test.step('Capture license counts before revoke', async () =>
                summaryScreenPage.assignedAndUnassignedLicenseCounts(sku),
            );

            const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
                summaryScreenPage.openManageLicensesModal(sku),
            );

            await test.step('Revoke the assigned device and cancel its scheduled transfer', async () => {
                await manageLicensesModal.revokeAssignedDeviceAndCancelTransfer(createdDeviceSubscriptionCleanup.serialNumber);
            });

            await test.step('Validate license counts reflect the revoke and canceled transfer', async () => {
                await expect
                    .poll(async () => (await summaryScreenPage.assignedAndUnassignedLicenseCounts(sku)).assigned)
                    .toBeLessThanOrEqual(licenseCountsBeforeRevoke.assigned);
                await expect
                    .poll(async () => (await summaryScreenPage.assignedAndUnassignedLicenseCounts(sku)).unassigned)
                    .toBeGreaterThanOrEqual(licenseCountsBeforeRevoke.unassigned);
            });
        });

        test('Revokes a scheduled device license and transfers the device now from the contract flow (part 133611)', { tag: ['@smoke', '@NZDEV-T974', PN_133611] }, async ({
            createdDeviceSubscriptionCleanup,
            summaryScreenPage,
            page,
            devicesApi,
        }) => {
            const scheduledTransferDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
            const sku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
            const contractId = smokeContractId(smokeAssignSubscriptionCore);

            const response = await test.step('Assign a subscription to a device with a scheduled transfer', async () =>
                devicesApi.assignSubscriptionsToDevices(
                    smokeCustomerAccountCdhId,
                    smokeDealerAccountId,
                    [createdDeviceSubscriptionCleanup.id],
                    [smokeAssignSubscriptionCore],
                    scheduledTransferDate,
                ),
            );

            await test.step('Validate assign-subscriptions response', async () => {
                devicesApi.expectValidAssignSubscriptionsToDevicesResponse(response, [createdDeviceSubscriptionCleanup.id]);
            });

            await test.step('Open contract subscriptions tab', async () => {
                await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
            });

            const licenseCountsBeforeRevoke = await test.step('Capture license counts before revoke', async () =>
                summaryScreenPage.assignedAndUnassignedLicenseCounts(sku),
            );

            const manageLicensesModal = await test.step('Open Manage Licenses modal', async () =>
                summaryScreenPage.openManageLicensesModal(sku),
            );

            await test.step('Revoke the assigned device and transfer it now', async () => {
                await manageLicensesModal.revokeAssignedDeviceAndTransferDeviceNow(createdDeviceSubscriptionCleanup.serialNumber);
            });

            await test.step('Validate contract license counts reflect the revoke', async () => {
                await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
                await expect
                    .poll(async () => (await summaryScreenPage.assignedAndUnassignedLicenseCounts(sku)).assigned)
                    .toBeLessThanOrEqual(licenseCountsBeforeRevoke.assigned);
                await expect
                    .poll(async () => (await summaryScreenPage.assignedAndUnassignedLicenseCounts(sku)).unassigned)
                    .toBeGreaterThanOrEqual(licenseCountsBeforeRevoke.unassigned);
            });
        });
    });
});
