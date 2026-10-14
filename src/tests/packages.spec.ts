import { test } from '../../src/fixture/TestFixture';
import { expect } from "@playwright/test";
import dealercustomers from '../pages/dealercustomers.json'

test.describe.serial('Packages - Contract Creation', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage }) => {
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
        await productsPage.selectProductBySKUAndQuantity("BS-CAT-PACKAGE", "5");
        await productsPage.selectRowCheckbox.check();
    });

    test('Verify Contract creation with Packages @DXP-T749 @DXP-T750 @DXP-T751 @DXP-T794 @dailysanity', async ({ productsPage, summaryScreenPage, contractsPage, }) => {
        await productsPage.productDetailsPageAssertionForPackage();
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.summaryScreenAssertionForPackage();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPOPackages');
        const contractID = await summaryScreenPage.getContractIDFromHeader();
        await summaryScreenPage.convertToContract();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
        await contractsPage.searchTextBox.clear();
    });

    test('Validate mapped products under a package and check expand and collapse @DXP-T752 @DXP-T753 @DXP-T754', async ({ productsPage, page }) => {
        await productsPage.expandAndCollapsePackageAndValidateProductsInPackage();
        //Rename "License" label to "Quantity" on contract page
        await expect(page.locator('text=Quantity')).toBeVisible();
        await expect(page.locator('text=License')).not.toBeVisible();
    });

    test('Validate Contract contains Packages and non-packages subscriptions @DXP-T755', async ({ productsPage, summaryScreenPage, contractsPage, contractHistoryPage }) => {
        await productsPage.selectProductBySKUAndQuantity("BS-CAT-SM", "5");
        await productsPage.generatePricing();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPOPackages+NonP');
        const contractID = await summaryScreenPage.getContractIDFromHeader();
        await summaryScreenPage.convertToContract();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
        await contractsPage.searchTextBox.clear();
    });

      test('Verify that promo code/discretionary discount/Volume/KPI are not applicable for Packages @DXP-T760 @DXP-T762 @DXP-T763 @DXP-T764', async ({ productsPage, summaryScreenPage, contractsPage, promoCodesPage, page }) => {
        //promo code
        await productsPage.generatePricing();
        await expect(page.getByText(/KPI Discount/).filter({ visible: true })).toBeVisible({ timeout: 100000 });
        await expect(page.getByText(/Volume Discount/).filter({ visible: true })).not.toBeVisible({ timeout: 100000 });
        await expect(page.getByText('Discretionary Discount', { exact: true })).toBeVisible();
        await expect(page.getByText(/Dealer Discount/).filter({ visible: true })).not.toBeVisible({ timeout: 100000 });
        await promoCodesPage.enterPromoCode("50OFF_REPO");
        await promoCodesPage.clickOnApplyButton();  
        await contractsPage.placeOrderInCreateContractWorkflowEnabled();
    });
});

test.describe.serial('Packages - Amendment', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("upg");
        const results = await contractsPage.selectActiveStatusContractFromDBPackage(dealercustomers.upg);
        if (!results || results.length === 0) {
            throw new Error('Database returned no valid active contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selectedContract = results[safeIndex].contract_number;
        console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    test('Validate amendment is not applicable for packages @DXP-T756 @DXP-T757 @DXP-T758', async ({ createAmendmentPage }) => {
        await createAmendmentPage.createAmendmentPackage();
        await createAmendmentPage.onHoverPackageTooltipTextInCreateAmendment();
    });
});

test.describe.serial('Packages - Contract Creation - monthly', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("upg");
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.upg);
        await termsPage.termsPageAssertion();
    });

    test('Verify Contract creation for Packages with monthly/EUR/futuredate/autorenew OFF @DXP-T792 @DXP-T793 @DXP-T795 @DXP-T800 @DXP-T765', async ({ productsPage, summaryScreenPage, contractsPage, termsPage, contractHistoryPage }) => {
        await termsPage.enterTermLength("1", "month");
        await termsPage.toggleAutoRenew(false);
        await termsPage.setAFutureDate();
        const { day, month, year } = await termsPage.selectStartDateBasedOnFutureUsingCalendarPickerAndReturnDate();
        await termsPage.chooseCurrencyDropdown('EUR');
        await termsPage.continueToProductsPage(); await productsPage.selectProductBySKUAndQuantity("BS-CAT-PACKAGE", "5");
        await productsPage.selectRowCheckbox.check();
        await productsPage.generatePricing();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPOPackagesMonthly');
        const contractID = await summaryScreenPage.getContractIDFromHeader();
         await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_ContractDraftCreated();
        await summaryScreenPage.clickSubscriptionTab()
        await summaryScreenPage.convertToContract();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
        await contractsPage.searchTextBox.clear();
    });
});

