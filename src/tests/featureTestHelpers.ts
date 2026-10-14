import type { Page } from '@playwright/test';
import type { DevicePage } from '../pages/DevicePage';
import type { HomePage } from '../pages/HomePage';
import { smokeDealerAccountId } from '../config/featureTestConfig';

export async function openManageDeviceModal(
    page: Page,
    homePage: HomePage,
    devicePage: DevicePage,
    serialNumber: string,
): Promise<void> {
    await page.goto('/' + smokeDealerAccountId);
    await homePage.navigateToDevicesPage();
    await devicePage.searchForDevice(serialNumber);
    await devicePage.validateDeviceRowVisible(serialNumber);
    await devicePage.manageDevice(serialNumber);
    await devicePage.validateDeviceActionMenu();
    await devicePage.clickOnManageDevice();
}
