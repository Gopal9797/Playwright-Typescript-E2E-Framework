import { expect } from '@playwright/test';
import { test } from '../../src/fixture/TestFixture';
import {
    BLOCK_COMMENT,
    BLOCK_REASON,
    DevicePage,
    type DeviceStatus,
    type SelectedDevice,
    UNBLOCK_COMMENT,
} from '../../src/pages/DevicePage';

let selectedDevice: SelectedDevice | undefined;
let currentDeviceStatus: DeviceStatus = 'ACTIVE';

test.describe.serial('Block/Unblock devices', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ request, homePage, devicePage }) => {
        DevicePage.logStep('Starting beforeEach setup');
        selectedDevice = await devicePage.initializeSelectableDevice(request, homePage, selectedDevice);
    });

    test.afterAll(async ({ request }) => {
        if (selectedDevice && currentDeviceStatus === 'BLOCKED') {
            DevicePage.logStep('afterAll cleanup: resetting device to ACTIVE', {
                deviceId: selectedDevice.deviceId,
                serialNumber: selectedDevice.serialNumber,
            });
            await DevicePage.updateDeviceStatus(request, selectedDevice.authorization, selectedDevice.deviceId, 'ACTIVE');
        }
    });

    test('Block device and validate device tabs @DXP-T921 @DXP-T936 @DXP-T925', async ({ request, devicePage }) => {
        expect(selectedDevice, 'Expected selected device details from setup').toBeTruthy();
        DevicePage.logStep('Test started: block device and validate device tabs', {
            deviceId: selectedDevice!.deviceId,
            serialNumber: selectedDevice!.serialNumber,
        });

        await DevicePage.updateDeviceStatus(request, selectedDevice!.authorization, selectedDevice!.deviceId, 'BLOCKED');
        currentDeviceStatus = 'BLOCKED';

        await devicePage.validateDeviceAcrossTabs(selectedDevice!.serialNumber, selectedDevice!.accountId, 'BLOCKED');
        DevicePage.logSuccess('Device blocked and validated across device tabs', {
            serialNumber: selectedDevice!.serialNumber,
        });
    });

    test('Block device app notification @DXP-T938 @DXP-T933', async ({ devicePage }) => {
        expect(selectedDevice, 'Expected selected device details from setup').toBeTruthy();
        DevicePage.logStep('Test started: block device app notification', {
            serialNumber: selectedDevice!.serialNumber,
        });
        await devicePage.assertNotification(selectedDevice!.accountId, selectedDevice!.serialNumber, 'blocked');
        DevicePage.logSuccess('Blocked device notification validated', {
            serialNumber: selectedDevice!.serialNumber,
        });
    });

    test('Block device audit log @DXP-T932', async ({ devicePage }) => {
        expect(selectedDevice, 'Expected selected device details from setup').toBeTruthy();
        DevicePage.logStep('Test started: block device audit log', {
            serialNumber: selectedDevice!.serialNumber,
        });
        await devicePage.assertAuditLog(selectedDevice!.accountId, selectedDevice!.serialNumber, /^Device blocked$/i, 'Device blocked by Trimble support', BLOCK_COMMENT, BLOCK_REASON);
        DevicePage.logSuccess('Blocked device audit log validated', {
            serialNumber: selectedDevice!.serialNumber,
        });
    });

    test('Unblock device and validate device tabs @DXP-T926 @DXP-T927 @DXP-T933 @DXP-T934', async ({ request, devicePage }) => {
        expect(selectedDevice, 'Expected selected device details from setup').toBeTruthy();
        DevicePage.logStep('Test started: unblock device and validate device tabs', {
            deviceId: selectedDevice!.deviceId,
            serialNumber: selectedDevice!.serialNumber,
        });

        await DevicePage.updateDeviceStatus(request, selectedDevice!.authorization, selectedDevice!.deviceId, 'ACTIVE');
        currentDeviceStatus = 'ACTIVE';

        await devicePage.validateDeviceAcrossTabs(selectedDevice!.serialNumber, selectedDevice!.accountId, 'ACTIVE');
        DevicePage.logSuccess('Device unblocked and validated across device tabs', {
            serialNumber: selectedDevice!.serialNumber,
        });
    });

    test('Unblock device app notification @DXP-T938', async ({ devicePage }) => {
        expect(selectedDevice, 'Expected selected device details from setup').toBeTruthy();
        DevicePage.logStep('Test started: unblock device app notification', {
            serialNumber: selectedDevice!.serialNumber,
        });
        await devicePage.assertNotification(selectedDevice!.accountId, selectedDevice!.serialNumber, 'unblocked');
        DevicePage.logSuccess('Unblocked device notification validated', {
            serialNumber: selectedDevice!.serialNumber,
        });
    });

    test('Unblock device audit log @DXP-T932', async ({ devicePage }) => {
        expect(selectedDevice, 'Expected selected device details from setup').toBeTruthy();
        DevicePage.logStep('Test started: unblock device audit log', {
            serialNumber: selectedDevice!.serialNumber,
        });
        await devicePage.assertAuditLog(selectedDevice!.accountId, selectedDevice!.serialNumber, /^Device Unblocked$/i, 'Device unblocked by Trimble support', UNBLOCK_COMMENT);
        DevicePage.logSuccess('Unblocked device audit log validated', {
            serialNumber: selectedDevice!.serialNumber,
        });
    });
});