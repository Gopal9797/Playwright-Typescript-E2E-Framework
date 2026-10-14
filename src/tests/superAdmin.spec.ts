import { test } from '../fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json';

test.describe('Support Admin Mode - Super Admin', () => {
    test.use({ storageState: '.auth/superadmin.json' });

    test.beforeEach(async ({ page, superAdminPage }) => {
        await page.goto('/');
        await superAdminPage.assertSearchForDealerScreen();
    });

    test('Search for a Dealer - search by CDH ID, IAM ID, email and invalid data @DXP-T1246 @DXP-T1247 @DXP-T1245 @DXP-T1259 ', async ({ superAdminPage }) => {
        // a) Search using CDH ID and verify the account is displayed
        await superAdminPage.searchDealer(dealercustomers.upg_cdhID);
        await superAdminPage.verifyAccountIsDisplayed(`CDH ID: ${dealercustomers.upg_cdhID}`);

        // b) Search using IAM ID and verify the account is displayed
        await superAdminPage.searchDealer(dealercustomers.upg_iamID);
        await superAdminPage.verifyAccountIsDisplayed(`IAM ID: ${dealercustomers.upg_iamID}`);

        // c) Search using email and verify the list is not empty
        await superAdminPage.searchDealer(process.env.UPG_ACCOUNT_EMAIL!);
        await superAdminPage.verifySearchResultsListIsNotEmpty();

        // d) Search invalid data and verify no results found
        await superAdminPage.searchDealer('invalidsearchdata123');
        await superAdminPage.verifyNoResultsFound();
    });

    test('Support admin screen - role selection, reason validation, enter and exit support mode @DXP-T1255 @DXP-T1251 @DXP-T1294 @DXP-T1249', async ({ superAdminPage }) => {
        // Search with CDH ID and open the account
        await superAdminPage.searchDealer(dealercustomers.upg_cdhID);
        await superAdminPage.verifyAccountIsDisplayed(`CDH ID: ${dealercustomers.upg_cdhID}`);
        await superAdminPage.clickAccountFromList(`CDH ID: ${dealercustomers.upg_cdhID}`);

        // Verify account view screen UI elements and Enter Support mode is disabled
        await superAdminPage.assertAccountViewScreen(dealercustomers.upg_cdhID, dealercustomers.upg_iamID);
        await superAdminPage.verifyEnterSupportModeIsDisabled();

        if (await superAdminPage.selectRoleDropdown.isVisible().catch(() => false)) {
            await superAdminPage.verifyRoleOptions(['Owner', 'Secondary Owner', 'Technician']);
            await superAdminPage.selectRole('Owner', { optional: true });
        }

        await superAdminPage.selectReason('Review Contract');
        await superAdminPage.verifyEnterSupportModeIsEnabled();

        await superAdminPage.unselectReason('Review Contract');
        await superAdminPage.selectReason('Other (please specify)');
        await superAdminPage.verifyReasonTextBoxIsMandatory();
        await superAdminPage.enterReason('UI Automation testing');
        await superAdminPage.verifyEnterSupportModeIsEnabled();

        // Enter support mode and verify the banner shows CDH ID, IAM ID and the selected role
        await superAdminPage.clickEnterSupportMode();
        await superAdminPage.verifySupportModeBanner(dealercustomers.upg_cdhID, dealercustomers.upg_iamID, 'Owner');

        // Select another account takes back to the Search for a Dealer screen
        await superAdminPage.clickSelectAnotherAccount();
    });

    test('Impersonate as View like a User - impersonate primary, secondary and technician users @DXP-T1254 @DXP-T1264 @DXP-T1258', async ({ superAdminPage }) => {
        const users = [
            { email: process.env.SUPPORT_PRIMARY_USER_EMAIL!, displayName: 'primary owner' },
            { email: process.env.SUPPORT_SECONDARY_USER_EMAIL!, displayName: 'Vaish Secondary acc' },
            { email: process.env.SUPPORT_TECHNICIAN_USER_EMAIL!, displayName: 'Vaish technician acc' },
        ];

        for (const user of users) {
            await superAdminPage.impersonateDealerAsUser(dealercustomers.upg_cdhID, user.email, 'Access Issue');
            await superAdminPage.verifySupportModeBannerForUser(dealercustomers.upg_cdhID, dealercustomers.upg_iamID, user.displayName);
            await superAdminPage.clickSelectAnotherAccount();
        }
    });

    test('Technician impersonation - view-only restrictions on dashboard, customers,notifications, devices and contracts @DXP-T1251 @DXP-T1248 @DXP-T1250', async ({ superAdminPage, homePage, customersPage, devicePage, contractsPage, rolesAndPermissions, notificationsSettings, orderNotificationsPage }) => {
        // Enter support mode as Technician
        await superAdminPage.impersonateDealerAs(dealercustomers.upg_cdhID, 'Technician', 'Access Issue');
        await superAdminPage.verifySupportModeBanner(dealercustomers.upg_cdhID, dealercustomers.upg_iamID, 'Technician');

        // Dashboard - alert edit (three dot) options are not available, same as technician role
        await homePage.assertHomePage();
        await homePage.assertDealerDashboardEditPermissionforTechnician();

        // Customers - verify view only access
        await customersPage.openCustomersPage();
        await customersPage.clickRequestCustomerOptInFromFirstRow();
        await superAdminPage.verifyViewOnlyModePopupAndClose();

        // Devices - first available device action shows the View-only mode popup
        // (menu options vary per device state, so click the first action instead of a named one)
        await homePage.navigateToDevicesPage();
        await devicePage.clickFirstDeviceAction();
        await superAdminPage.verifyViewOnlyModePopupAndClose();

        // Contracts - create contract button is not visible
        await homePage.navigateToContractsPage();
        await rolesAndPermissions.verifyCreateContractButtonIsNotVisible();

        // Open first active contract and verify amend contract button is not visible
        await contractsPage.activeTab.click();
        await contractsPage.ContractIDText.first().click();
        await contractsPage.verifyContractDetailsScreenStatus('Active');
        await rolesAndPermissions.verifyAmendContractButtonIsNotVisible();

        // Open first draft contract and verify place order button is not visible
        await contractsPage.navigateToContractsList();
        await contractsPage.assertContractsPage();
        await contractsPage.draftTab.click();
        await contractsPage.ContractIDText.first().click();
        await contractsPage.verifyContractDetailsScreenStatus('Draft');
        await rolesAndPermissions.verifyPlaceOrderButtonIsNotVisible();

        // Notifications Settings - same restrictions as technician role:
        // In-App: Restore defaults and Disable all are not shown; Email: Restore defaults disabled and Select User is disabled
        await notificationsSettings.openSettings();
        await notificationsSettings.verifyGeneralAndNotificationsTabs();
        await notificationsSettings.clickNotificationsTab();
        await notificationsSettings.verifyRestoreDefaultsAndDisableAllAreNotVisible();
        await notificationsSettings.clickEmailTab();
        await notificationsSettings.verifyRestoreDefaultsIsDisabled();
        await notificationsSettings.verifySelectUserIsDisabled();

        // Notifications bell - Mark all as read shows the View-only mode popup
        await orderNotificationsPage.clickOnNotificationBellIcon();
        await orderNotificationsPage.markAllAsReadButton.click();
        await superAdminPage.verifyViewOnlyModePopupAndClose();
    });

    // One parameterized block generates a test per role - for Owner / Secondary Owner
    for (const role of ['Owner', 'Secondary Owner']) {
        test(`${role} impersonation - view-only popup on create, edit and delete actions across the app @DXP-T1252 @DXP-T1253`, async ({ superAdminPage, homePage, customersPage, devicePage, contractsPage, summaryScreenPage, notificationsSettings, autorenewalPage, orderNotificationsPage }) => {
            // Enter support mode as the given role
            await superAdminPage.impersonateDealerAs(dealercustomers.upg_cdhID, role, 'Access Issue');
            await superAdminPage.verifySupportModeBanner(dealercustomers.upg_cdhID, dealercustomers.upg_iamID, role);

            // Contracts - Create new contract shows the View-only mode popup
            await homePage.navigateToContractsPage();
            await contractsPage.assertContractsPage();
            await contractsPage.createANewContractButton.click();
            await superAdminPage.verifyViewOnlyModePopupAndClose();

            // Draft contract - Delete Draft and Place Order show the View-only mode popup
            await contractsPage.draftTab.click();
            await contractsPage.ContractIDText.first().click();
            await contractsPage.verifyContractDetailsScreenStatus('Draft');
            await summaryScreenPage.discardDraftButtonInContractSummaryScreen.click();
            await superAdminPage.verifyViewOnlyModePopupAndClose();
            await summaryScreenPage.placeOrderButton.click();
            await superAdminPage.verifyViewOnlyModePopupAndClose();

            // General settings - toggling Auto-Renewal shows the View-only mode popup
            await notificationsSettings.openSettings();
            await autorenewalPage.clickAutoRenewalToggle();
            await superAdminPage.verifyViewOnlyModePopupAndClose();

            // Customers - open first customer and any three dot menu action shows the View-only mode popup
            await customersPage.openCustomersPage();
            await customersPage.openFirstCustomerFromGrid();
            await customersPage.clickFirstCustomerDetailsMenuAction();
            await superAdminPage.verifyViewOnlyModePopupAndClose();

            // Devices - first device three dot action shows the View-only mode popup
            await homePage.navigateToDevicesPage();
            await devicePage.clickFirstDeviceAction();
            await superAdminPage.verifyViewOnlyModePopupAndClose();

            // Notifications bell - Mark all as read shows the View-only mode popup
            await orderNotificationsPage.clickOnNotificationBellIcon();
            await orderNotificationsPage.markAllAsReadButton.click();
            await superAdminPage.verifyViewOnlyModePopupAndClose();
        });
    }
});
