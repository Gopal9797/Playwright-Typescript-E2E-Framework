import { test } from '../fixture/TestFixture';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotificationsSettingsPage } from '../pages/NotificationsSettingsPage';

 test.describe.serial('Notification Settings', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.accountSwitcherButton.click();
        await expect(homePage.dxpAutomationMenuItem).toBeVisible();
        await homePage.dxpAutomationMenuItem.click();
    });

    test('Verify Settings General, In-App and Email notification UI', async ({ notificationsSettings }) => {
        await notificationsSettings.openSettings();
        await notificationsSettings.verifyGeneralAndNotificationsTabs();
        await notificationsSettings.clickNotificationsTab();
        await notificationsSettings.verifyNotificationSubTabs();
        await notificationsSettings.verifyInAppNotificationSettings();
        await notificationsSettings.clickEmailTab();
        await notificationsSettings.verifyEmailNotificationSettings();
    });

    test('Verify Restore defaults flow on In-App and Email tabs', async ({ notificationsSettings }) => {
        await notificationsSettings.openSettings();
        await notificationsSettings.clickNotificationsTab();
        await notificationsSettings.verifyRestoreDefaultsIsDisabled();
        await notificationsSettings.clickDisableAllOnFirstCategory();
        await notificationsSettings.verifyRestoreDefaultsIsEnabled();
        await notificationsSettings.clickRestoreDefaults();
        await notificationsSettings.verifyRestoreDefaultsPopup();
        await notificationsSettings.confirmRestoreDefaultsPopup();
        await notificationsSettings.verifySettingsResetToDefaults();
        await notificationsSettings.clickEmailTab();
        await notificationsSettings.verifyRestoreDefaultsIsDisabled();
        await notificationsSettings.clickDisableAllOnFirstCategory();
        await notificationsSettings.verifyRestoreDefaultsIsEnabled();
        await notificationsSettings.clickRestoreDefaults();
        await notificationsSettings.verifyRestoreDefaultsPopup();
        await notificationsSettings.confirmRestoreDefaultsPopup();
        await notificationsSettings.verifySettingsResetToDefaults();
    });

    test('Verify In-App enable and disable all actions for every notification category', async ({ notificationsSettings }) => {
        await notificationsSettings.openSettings();
        await notificationsSettings.clickNotificationsTab();
        await notificationsSettings.verifyInAppCategoryBulkToggleBehavior();
    });

    test('Verify Email enable and disable all actions for every notification category', async ({ notificationsSettings }) => {
        await notificationsSettings.openSettings();
        await notificationsSettings.clickNotificationsTab();
        await notificationsSettings.clickEmailTab();
        await notificationsSettings.verifyCategoryBulkToggleBehavior();
    });

    test('Verify Required tag is shown for the correct notification types on In-App and Email tabs', async ({ notificationsSettings }) => {
        await notificationsSettings.openSettings();
        await notificationsSettings.clickNotificationsTab();
        await notificationsSettings.verifyRequiredTagsAcrossAllCategories();
    });

    test('Verify email category setting is shared between primary and secondary users', async ({ browser, page, notificationsSettings }) => {
        test.skip(
            !process.env.SECONDARY_USER_EMAIL || !process.env.SECONDARY_USER_PASSWORD,
            'Set SECONDARY_USER_EMAIL and SECONDARY_USER_PASSWORD to run the secondary-user notification test',
        );

        await notificationsSettings.openSettings();
        await notificationsSettings.clickNotificationsTab();
        await notificationsSettings.clickEmailTab();
        await notificationsSettings.disableFirstVisibleCategory();

        const secondaryContext = await browser.newContext({ baseURL: new URL('/', page.url()).toString() });
        try {
            const secondaryPage = await secondaryContext.newPage();
            const secondaryLoginPage = new LoginPage(secondaryPage);
            const secondaryHomePage = new HomePage(secondaryPage);
            const secondaryNotificationsSettings = new NotificationsSettingsPage(secondaryPage);

            await secondaryPage.goto('/');
            await secondaryLoginPage.loginIntoApplication(
                process.env.SECONDARY_USER_EMAIL,
                process.env.SECONDARY_USER_PASSWORD,
            );
            await secondaryHomePage.assertHomePage();
            await secondaryHomePage.accountSwitcherButton.click();
            await secondaryHomePage.dxpAutomationMenuItem.click();
            await secondaryNotificationsSettings.openSettings();
            await secondaryNotificationsSettings.clickNotificationsTab();
            await secondaryNotificationsSettings.clickEmailTab();
            await secondaryNotificationsSettings.verifyFirstVisibleCategoryState(false);
            await secondaryNotificationsSettings.enableFirstVisibleCategory();
        } finally {
            await secondaryContext.close();
        }

        await page.reload();
        await notificationsSettings.verifyFirstVisibleCategoryState(true);
    });
});