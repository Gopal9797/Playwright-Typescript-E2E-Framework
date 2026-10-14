import { test } from '../fixture/TestFixture';
import { expect } from '@playwright/test';
import dealercustomers from '../pages/dealercustomers.json';

let promoContractNumber: string | undefined;

test.describe('Roles and Permissions - Technician', () => {
    test.use({ storageState: '.auth/upgaccountusertechnician.json' });

    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.assertHomePage();
        await homePage.navigateToContracts('dxpautomation');
    });

    test('Contract Create - Create contract button is not visible for technician', async ({ rolesAndPermissions }) => {
        await rolesAndPermissions.verifyCreateContractButtonIsNotVisible();
    });

    test('Amendment screen - Verify amend contract button is not visible for active state contract', async ({ contractsPage, rolesAndPermissions }, testInfo) => {
        const results = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.dxpAutomation);
        if (!results || results.length === 0) {
            throw new Error('Database returned no valid active contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selectedRow = results[safeIndex];
        if (!selectedRow || selectedRow.contract_number == null) {
            throw new Error(`Database returned an active contract row without a contract_number at index ${safeIndex}.`);
        }
        const selectedContract = selectedRow.contract_number;
        console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
        await contractsPage.verifyContractDetailsScreenStatus('Active');
        await rolesAndPermissions.verifyAmendContractButtonIsNotVisible();
    });

    test('Draft state contract - Verify place order, promo codes, and discretionary discount are not available for draft state contract', async ({ contractsPage, rolesAndPermissions, promoCodesPage, lockRateDiscretionaryDiscount }, testInfo) => {
        const results = await contractsPage.selectDraftStatusContractFromDB(dealercustomers.dxpAutomation);
        if (!results || results.length === 0) {
            throw new Error('Database returned no valid draft contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selectedRow = results[safeIndex];
        if (!selectedRow || selectedRow.contract_number == null) {
            throw new Error(`Database returned a draft contract row without a contract_number at index ${safeIndex}.`);
        }
        const selectedContract = selectedRow.contract_number;
        console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
        await contractsPage.verifyContractDetailsScreenStatus('Draft');
        await rolesAndPermissions.verifyPlaceOrderButtonIsNotVisible();
        await promoCodesPage.verifyPromoCodeIsNotAvailableForDraftContract();
        await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountIsNotAvailableForDraftContract();
    });

    test('Contract Details - Verify auto-renewal toggle is not visible for technician in contract details', async ({ contractsPage, autorenewalPage }, testInfo) => {
        const results = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.dxpAutomation);
        if (!results || results.length === 0) {
            throw new Error('Database returned no valid active contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selectedRow = results[safeIndex];
        if (!selectedRow || selectedRow.contract_number == null) {
            throw new Error(`Database returned an active contract row without a contract_number at index ${safeIndex}.`);
        }
        const selectedContract = selectedRow.contract_number;
        console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
        await contractsPage.verifyContractDetailsScreenStatus('Active');
        await contractsPage.contractDetailsTab.click();
        await autorenewalPage.verifyAutoRenewalToggleIsNotVisible();
    });

    test('Notifications Settings - Restore defaults, Disable all and Select User are restricted for technician on notifications', async ({ notificationsSettings }) => {
        await notificationsSettings.openSettings();
        await notificationsSettings.verifyGeneralAndNotificationsTabs();
        await notificationsSettings.clickNotificationsTab();
        await notificationsSettings.verifyRestoreDefaultsAndDisableAllAreNotVisible();
        await notificationsSettings.clickEmailTab();
        await notificationsSettings.verifySelectUserIsDisabled();
    });

    test('Customer screen - Verify customer actions and adding members for technician', async ({ customersPage }) => {
        await customersPage.openCustomersPage();
        await customersPage.openFirstCustomerFromGrid();
        await customersPage.verifyRequestCustomerOptInIsVisibleFromThreeDotMenu();
        await customersPage.verifyManageMembersButtonIsVisible();
        await customersPage.verifyAddMembersOptionIsVisible();
    });

    test('Regenerate Pricing - Verify regenerate pricing banner permissions for technician', async ({ homePage, contractsPage, regeneratePricingPage, commonSqlQueries }) => {
        await homePage.navigateToContracts('dxpautomation');
        const priceChangeContract = await commonSqlQueries.getFirstPriceChangeAmendmentDraftContract(dealercustomers.dxpAutomation_cdhID);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(priceChangeContract.contractNumberSearch);
        await expect(regeneratePricingPage.bannerAlert).toBeVisible();
        await expect(regeneratePricingPage.regenerateAlertText).toContainText('Mid-term amendment pricing is adjusted with proration over time.');
        await expect(regeneratePricingPage.goToAmendmentButtonInBanner).toBeVisible();
        await regeneratePricingPage.assertRegeneratePriceButtonIsNotVisibleInContractsScreen();
    });


    test('Renewals - Verify renewal draft restrictions for technician', async ({ contractsPage, renewalSummaryPage }) => {
        const results = await contractsPage.selectRenewalInitiatedContracts(dealercustomers.dxpAutomation_cdhID);
        if (!results || results.length === 0) {
            throw new Error('Database returned no R1 draft renewal contracts.');
        }

        const selectedContract = results[0]?.contract_number_search;
        if (!selectedContract) {
            throw new Error('Database returned a renewal draft without a contract_number_search.');
        }

        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
        await expect(renewalSummaryPage.renewalQuoteAlertTitle).toBeVisible();
        await expect(renewalSummaryPage.renewalQuoteAlertMessage).toBeVisible();
        await renewalSummaryPage.verifyRenewalEditOptionsAreNotVisible();
    });

    test('Verify D-country hold banners and Review Terms restrictions for technician', async ({ homePage, contractsPage, dCountryPage }) => {
        await homePage.navigateToContracts('chinadealer');
        await contractsPage.issuesWithOrdersTab.click();
        await contractsPage.searchTextBox.fill('CHINA CUSTOMER');
        await expect(contractsPage.ContractIDText.first()).toBeVisible();
        await contractsPage.ContractIDText.first().click();
        await contractsPage.verifyContractDetailsScreenStatus('On Hold');
        await dCountryPage.verificationOfHoldBannerCopyForD_COUNTRY_HOLD_DEALER_AND_CUSTOMER();
        await dCountryPage.verifyReviewTermsButtonsAreNotVisibleForTechnician();
    });

    test('Invoice verification for technician', async ({ invoicePage }) => {
        await invoicePage.assertInvoicePage();
    });

    test('Verify Dealer Dashboard Permissions for Technician @DXP-T1242 @DXP-T1243', async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.assertHomePage();
        await homePage.assertDealerDashboardEditPermissionforTechnician();
        await homePage.selectDevicesTab();
        //Technician will have edit permission for devices
        await homePage.assertDealerDashboardEditPermission();
    });

});

test.describe.serial('Promo Codes - Technician contract details verification', () => {
    test.describe.configure({ timeout: 400000 });

    test.describe('Create discounted contract as UPG account user', () => {
        test.use({ storageState: '.auth/upgaccountuser.json' });

        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('upg');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.upg);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('1', 'month');
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductByName('Catalyst 60');
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Create a contract with a valid promo code', async ({ promoCodesPage, summaryScreenPage }) => {
            await promoCodesPage.enterPromoCode('50OFF_REPO');
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.placeOrderButtonIsEnabled();
            await promoCodesPage.removeButtonIsVisible();
            await promoCodesPage.verifyPromoCodeIconIsDisplayedOnSuccessfulApplyOfCode();

            promoContractNumber = await summaryScreenPage.getContractIDFromHeader();
            await summaryScreenPage.clickPlaceOrderButton();
        });
    });

    test.describe('Verify promo discount is displayed for technician', () => {
        test.use({ storageState: '.auth/upgaccountusertechnician.json' });

        test('Promo Discount is displayed for the created contract', async ({ page, homePage, contractsPage, promoCodesPage }) => {
            if (!promoContractNumber) {
                throw new Error('The discounted contract number was not created by the UPG account user test.');
            }

            await page.goto('/');
            await homePage.navigateToContracts('upg');
            await contractsPage.searchContractWithGivenContractIDAndClickContract(promoContractNumber);
            await contractsPage.verifyContractDetailsScreenIsVisible();
            await promoCodesPage.verifyPromoDiscountIsDisplayed();
        });
    });
});

test.describe('Devices - Roles and Permissions for technician device actions', () => {
    test.use({ storageState: '.auth/upgaccountusertechnician.json' });

    test('BPC technician can view all actions for an unallocated device', async ({ page, homePage, devicePage }) => {
        await page.goto('/');
        await homePage.navigateToDashboard('bpc');
        await homePage.selectDevicesTab();
        await homePage.navigateToDevicesPage();
        await devicePage.unallocatedDevicesTab.click();
        await devicePage.openFirstUnallocatedDeviceActions();
        await devicePage.verifyUnallocatedDeviceActionsForTechnician();
    });
});