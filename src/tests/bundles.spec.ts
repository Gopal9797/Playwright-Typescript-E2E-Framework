import { test } from '../../src/fixture/TestFixture';
import { expect } from "@playwright/test";
import dealercustomers from '../pages/dealercustomers.json'

test.describe.serial('Bundles - Contract Creation', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("upg");
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.upg);
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength("1", "year");
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.toggleAutoRenew(true);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.continueToProductsPage();
    });

    test('Verify Contract creation with Bundles @DXP-T768 @DXP-T769 @DXP-T770 @DXP-T771 @dailysanity', async ({ productsPage, summaryScreenPage, termsPage, contractsPage, promoCodesPage, amendmentSummaryPage }) => {
        await productsPage.selectProductBySKUAndQuantity("BN-TRM-TBC-SPO-TCBP", "5");
        await productsPage.productDetailsPageAssertionForBundle();
        await productsPage.selectRowCheckbox.check();
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.summaryScreenAssertionForBundle();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPOBundles');
        const contractID = await summaryScreenPage.getContractIDFromHeader();
        await summaryScreenPage.convertToContract();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
        await contractsPage.searchTextBox.clear();
    });

    test('Validate mapped products under a bundle and check expand and collapse @DXP-T772 @DXP-T774', async ({ productsPage, summaryScreenPage, termsPage, contractsPage }) => {
        await productsPage.selectProductBySKUAndQuantity("BN-TRM-TBC-SCR-TCBP", "5");
        await productsPage.productDetailsPageAssertionForBundle();
        await productsPage.expandAndCollapseBundleAndValidateProductsInBundle();
    });

    test('Validate Rename "License" label to "Quantity" on contract page @DXP-T773', async ({ page, productsPage, summaryScreenPage, termsPage, contractsPage }) => {
        await expect(page.locator('text=Quantity')).toBeVisible();
        await expect(page.locator('text=License')).not.toBeVisible();
    });

    test('Validate Contract contains bundle and non-bundle subscriptions @DXP-T775', async ({ productsPage, summaryScreenPage, termsPage, contractsPage }) => {
        await productsPage.selectProductBySKUAndQuantity("BN-TRM-TBC-SCR-TCBP", "5");
        await productsPage.productDetailsPageAssertionForBundle();
        await productsPage.selectRowCheckbox.check();
        await productsPage.selectProductBySKUAndQuantity("BS-CAT-SM", "5");
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.summaryScreenAssertionForBundle();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPOBundles');
        const contractID = await summaryScreenPage.getContractIDFromHeader();
        await summaryScreenPage.convertToContract();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
        await contractsPage.searchTextBox.clear();
    });

    test('Verify promo code/KPI discount/Volume for Bundles @DXP-T782 @DXP-T784 @DXP-T799 @DXP-T780', async ({ productsPage, summaryScreenPage, contractsPage, promoCodesPage, page }) => {
        //promo code
        await productsPage.selectProductBySKUAndQuantity("BN-TRM-TBC-SPO-TCBP", "5");
        await productsPage.selectRowCheckbox.check();
        await productsPage.generatePricing();
        await expect(page.getByText(/KPI Discount/).filter({ visible: true })).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/Volume Discount/).filter({ visible: true })).toBeVisible({ timeout: 10000 });
        await promoCodesPage.enterPromoCode("50OFF_REPO");
        await promoCodesPage.clickOnApplyButton();
        await promoCodesPage.placeOrderButtonIsEnabled();
        await promoCodesPage.removeButtonIsVisible();
        await promoCodesPage.verifyPromoCodeIconIsDisplayedOnSuccessfulApplyOfCode();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPOBundles');
        const contractID = await summaryScreenPage.getContractIDFromHeader();
        await summaryScreenPage.convertToContract();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
        await contractsPage.searchTextBox.clear({ timeout: 5000 });
    });
});

test.describe.serial('Bundles - Midterm amendment', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("dxpAutomation");
        await contractsPage.assertContractsPage();
    });

    test('Validate upgrade for bundles @DXP-T776', async ({ contractsPage, createAmendmentPage, amendmentSummaryPage, summaryScreenPage, page }) => {
        const bundleSku = 'BN_TRM_TBC_SCR_TCBP';
        const bundleSku1 = 'BN_TRM_TBC_SPO_TCBP';

        await contractsPage.activeTab.click();
        await contractsPage.searchAndClickFirstContract('DataPack');
        await page.waitForTimeout(40000); // Wait for 40 seconds (adjust the time as needed)
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectUpgradeOption();
        await createAmendmentPage.selectTheProduct(bundleSku);
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct(bundleSku1);
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
        await amendmentSummaryPage.verifyAmendmentProgressStatus("Amendment in Progress");
        await amendmentSummaryPage.discardDraftButton.click();
        await amendmentSummaryPage.completeDiscardDraftInAmendmentSummary();
        await page.waitForTimeout(10000); 
    });

    test('Validate downgrade for bundles @DXP-T777', async ({ contractsPage, createAmendmentPage, amendmentSummaryPage, summaryScreenPage, page }) => {
        const bundleSku = 'BN_TRM_TBC_SPO_TCBP';
        const bundleSku1 = 'BN_TRM_TBC_SCR_TCBP';

        await contractsPage.activeTab.click();
        await contractsPage.searchAndClickFirstContract('DataPack');
        await page.waitForTimeout(40000); // Wait for 40 seconds (adjust the time as needed)
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.selectTheProduct(bundleSku);
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct(bundleSku1);
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.deleteIcon.click();
     
    });
});

test.describe.serial('Bundles - Contract Creation - monthly', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("upg");
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.upg);
        await termsPage.termsPageAssertion();
    });

    test('Verify Contract creation monthly/EUR/futuredate/autorenew OFF @DXP-T796 @DXP-T797 @DXP-T798 @DXP-T801', async ({ productsPage, summaryScreenPage, contractsPage, termsPage }) => {
        await termsPage.enterTermLength("1", "month");
        await termsPage.toggleAutoRenew(false);
        await termsPage.setAFutureDate();
        const { day, month, year } = await termsPage.selectStartDateBasedOnFutureUsingCalendarPickerAndReturnDate();
        const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('en-GB', { month: 'short' });
        const formattedStartDate = `${parseInt(day)} ${monthName} ${year}`;
        await termsPage.chooseCurrencyDropdown('EUR');
        await termsPage.continueToProductsPage(); await productsPage.selectProductBySKUAndQuantity("BN-TRM-TBC-SPO-TCBP", "5");
        await productsPage.productDetailsPageAssertionForBundle();
        await productsPage.selectRowCheckbox.check();
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.summaryScreenAssertionForBundle();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPOBundles');
        const contractID = await summaryScreenPage.getContractIDFromHeader();
        await summaryScreenPage.convertToContract();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
        await contractsPage.searchTextBox.clear();
    });

});
