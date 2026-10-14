import { test, type CreatedDevice } from '../../fixture/testDataFixture';
import { expect, type Page } from '@playwright/test';
import { DeviceToast, type DevicePage } from '../../pages/DevicePage';
import type { HomePage } from '../../pages/HomePage';
import type { DevicesApi } from '../../api/devices/DevicesApi';
import { PN_133611 } from '../../utils/iamDevice/iamDevicePool';
import {
    smokeCustomerAccountCdhId,
    smokeCustomerName,
    smokeDealerAccountId,
    smokeIamAccountId,
} from '../../config/featureTestConfig';
import { executeQuery } from '../../utils/postgresDBUtils';

test.use({
    storageState: '.auth/upgaccountuser.json',
    dealerAccountId: smokeDealerAccountId,
    iamAccountId: smokeIamAccountId,
});

async function openDeviceActions(
    page: Page,
    homePage: HomePage,
    devicePage: DevicePage,
    serialNumber: string,
) {
    await page.goto(`/${smokeDealerAccountId}`);
    await homePage.navigateToDevicesPage();
    await devicePage.searchForDevice(serialNumber);
    await devicePage.validateDeviceRowVisible(serialNumber);
    await devicePage.manageDevice(serialNumber);
}

async function markTransferFailed(deviceId: string) {
    const result = await executeQuery(
        `UPDATE device.transfer_status
         SET transfer_status = $1
         WHERE device_id = $2`,
        ['FAILED', deviceId],
    );

    expect(result.rowCount, `Expected transfer status row for device ${deviceId}`).toBe(1);
}

async function transferDeviceAndMarkFailed(devicesApi: DevicesApi, device: CreatedDevice) {
    const response = await devicesApi.transferDevice(smokeCustomerAccountCdhId, [device.id]);
    devicesApi.expectValidTransferDeviceResponse(response, device.id, smokeCustomerAccountCdhId);
    await markTransferFailed(device.id);
}

test.describe('Transfer a device', () => {
    // skip the two tests as it requires DEV db access on CI(NZDEV-2190), once it is done, we can unskip them.
    test.skip('Verify that user can retry transfer if transfer failed (part 133611)', { tag: ['@smoke', '@NZDEV-T1015', '@NZDEV-T1017', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await test.step('Transfer the device to a customer and mark the transfer as FAILED', async () => {
            await transferDeviceAndMarkFailed(devicesApi, createdDeviceRetained);
        });

        await test.step('Verify Retry and Cancel options are available', async () => {
            await openDeviceActions(page, homePage, devicePage, serialNumber);
            await devicePage.validateFailedTransferActions();
        });

        await test.step('Retry and complete the device transfer', async () => {
            await devicePage.clickRetryTransfer();
            await devicePage.transferDeviceModal.validateCustomerInputDisabled();
            await devicePage.transferDeviceModal.transferDevice(DeviceToast.deviceTransferSuccessful);
            await devicePage.validateDeviceRowVisible(serialNumber);
        });
    });

    test.skip('Verify that user can cancel transfer if transfer failed (part 133611)', { tag: ['@smoke', '@NZDEV-T1016', '@NZDEV-T1018', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await test.step('Transfer the device to a customer and mark the transfer as FAILED', async () => {
            await transferDeviceAndMarkFailed(devicesApi, createdDeviceRetained);
        });

        await test.step('Verify the failed device cannot be selected for bulk transfer', async () => {
            await page.goto(`/${smokeDealerAccountId}`);
            await homePage.navigateToDevicesPage();
            await devicePage.selectMultipleDevices();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.validateDeviceRowSelectionDisabled(serialNumber);
        });

        await test.step('Cancel the failed device transfer', async () => {
            await openDeviceActions(page, homePage, devicePage, serialNumber);
            await devicePage.validateFailedTransferActions();
            await devicePage.cancelFailedTransfer();
            await devicePage.validateToast(DeviceToast.deviceTransferCancelledSuccessfully);
        });
    });

    test('Verify that transfer device option shows only dealer owned device (part 133611)', { tag: ['@smoke', '@NZDEV-T1010', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await test.step('Verify Transfer Device is available for the dealer-owned device', async () => {
            await openDeviceActions(page, homePage, devicePage, serialNumber);
            await devicePage.validateTransferDeviceAvailable();
        });

        await test.step('Transfer the device to a customer through the API', async () => {
            const response = await devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceRetained.id]);
            devicesApi.expectValidTransferDeviceResponse(response, createdDeviceRetained.id, smokeCustomerAccountCdhId);
        });

        await test.step('Verify Transfer Device is unavailable for the customer-owned device', async () => {
            await openDeviceActions(page, homePage, devicePage, serialNumber);
            await devicePage.validateTransferDeviceUnavailable();
        });
    });

    test('Verify customer owned device has an owner link (part 133611)', { tag: ['@smoke', '@NZDEV-T1012', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await test.step('Transfer the device to a customer through the API', async () => {
            const response = await devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceRetained.id]);
            devicesApi.expectValidTransferDeviceResponse(response, createdDeviceRetained.id, smokeCustomerAccountCdhId);
        });

        await test.step('Verify the customer-owned device owner is a Customers page link', async () => {
            await page.goto(`/${smokeDealerAccountId}`);
            await homePage.navigateToDevicesPage();
            await devicePage.allDevicesTab.click();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
            await devicePage.validateDeviceOwnerLink(serialNumber);
        });
    });

    test('Verify device list has all devices, unallocated devices view (part 133611)', { tag: ['@smoke', '@NZDEV-T1009', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumber = createdDeviceRetained.serialNumber;

        await test.step('Open the Device List and verify device tabs', async () => {
            await page.goto(`/${smokeDealerAccountId}`);
            await homePage.navigateToDevicesPage();
            await expect(devicePage.allDevicesTab).toBeVisible();
            await expect(devicePage.unallocatedDevicesTab).toBeVisible();
        });

        await test.step('Verify the device is listed under Unallocated Devices', async () => {
            await devicePage.unallocatedDevicesTab.click();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
        });

        await test.step('Transfer the device to a customer through the API', async () => {
            const response = await devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceRetained.id]);
            devicesApi.expectValidTransferDeviceResponse(response, createdDeviceRetained.id, smokeCustomerAccountCdhId);
        });

        await test.step('Verify the device is no longer listed under Unallocated Devices', async () => {
            await page.reload();
            await homePage.navigateToDevicesPage();
            await expect(devicePage.unallocatedDevicesTab).toBeVisible();
            await devicePage.unallocatedDevicesTab.click();
            await devicePage.searchForDevice(serialNumber);
            await expect(devicePage.noRowsFoundText).toBeVisible();
        });

        await test.step('Verify the device is listed under All Devices', async () => {
            await page.reload();
            await homePage.navigateToDevicesPage();
            await devicePage.allDevicesTab.click();
            await devicePage.searchForDevice(serialNumber);
            await devicePage.validateDeviceRowVisible(serialNumber);
        });
    });

    test('transfers a device to a customer and displays a success toast (part 133611)', { tag: ['@smoke', '@NZDEV-T1013', PN_133611] }, async ({
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        await test.step('Open Transfer Device modal', async () => {
            await openDeviceActions(page, homePage, devicePage, createdDeviceRetained.serialNumber);
            await devicePage.clickOnTransferDevice();
        });

        await test.step('Transfer device to customer', async () => {
            await devicePage.transferDeviceModal.selectCustomer(smokeCustomerName);
            await devicePage.transferDeviceModal.transferDevice(DeviceToast.deviceTransferSuccessful);
            await devicePage.validateDeviceRowVisible(createdDeviceRetained.serialNumber);
        });
    });

    test('bulk transfers two devices to a customer and displays a success toast (part 133611)', { tag: ['@smoke', '@NZDEV-T1014', PN_133611] }, async ({
        createdDevices,
        devicePage,
        page,
        homePage,
    }) => {
        const serialNumbers = createdDevices.map(({ serialNumber }) => serialNumber);

        await test.step('Open bulk Transfer Devices modal', async () => {
            await page.goto(`/${smokeDealerAccountId}`);
            await homePage.navigateToDevicesPage();
            await devicePage.selectMultipleDevices();
            for (const serialNumber of serialNumbers) {
                await devicePage.searchForDevice(serialNumber);
                await devicePage.validateDeviceRowVisible(serialNumber);
                await devicePage.selectDevice(serialNumber);
            }
            await devicePage.clickOnManageSelection();
            await devicePage.clickOnTransferDevices();
        });

        await test.step('Transfer device to customer', async () => {
            await devicePage.transferDeviceModal.selectCustomer(smokeCustomerName);
            await devicePage.transferDeviceModal.transferDevice(DeviceToast.devicesTransferSuccessful(serialNumbers.length));
            for (const serialNumber of serialNumbers) {
                await devicePage.searchForDevice(serialNumber);
                await devicePage.validateDeviceRowVisible(serialNumber);
            }
        });
    });
});
