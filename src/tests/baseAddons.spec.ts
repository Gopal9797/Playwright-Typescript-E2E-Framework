import { test } from '../../src/fixture/TestFixture';
import { expect } from "@playwright/test";
import dealercustomers from '../pages/dealercustomers.json'
let contract_number: number | undefined;

test.describe.serial('Base+Addons - Contract Creation', () => {
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

    //pre-requisite: Base - BS-CAT-SM, Addon - BS-CAT-1M, BS-CAT-DM, BS-CAT-PRECISION
    test('Verify add-on warning when add-on is added without base product @DXP-T1048 @DXP-T1049 @DXP-T1061', async ({ productsPage, page, contractsPage }) => {
        await productsPage.selectProductBySKUAndQuantity("BS-CAT-1M", "5");
        await productsPage.selectRowCheckbox.check();
        await productsPage.generatePricingWithoutAddonDialog();
        await productsPage.assertMissingBaseProductWarning();
        await productsPage.generatePricingInAddonDialog();
        await contractsPage.verifyTermsAndConditionAtPlaceOrder();
        await contractsPage.placeOrderInCreateContractWorkflow();
    });

    test('Validate warning is not displayed when Base Product exists @DXP-T1060', async ({ productsPage, page, contractsPage }) => {
        await productsPage.selectProductBySKUAndQuantity("BS-CAT-1M", "5");
        await productsPage.selectRowCheckbox.check();
        await productsPage.selectProductBySKUAndQuantity("BS-CAT-SM", "5");
        await productsPage.selectRowCheckbox.check();
        await productsPage.generatePricing();
        await productsPage.missingBaseProductWarningNotToBeVisible();
        await contractsPage.placeOrderInCreateContractWorkflowEnabled;
    });
});

test.describe.serial('Base+Addons - Amendment', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("ac");
        const results = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.ac);
        if (!results || results.length === 0) {
            throw new Error('Database returned no valid active contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selectedContract = results[safeIndex].contract_number;
        console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    //pre-requisite: Base - BS-SB-TCBP, Addon - BS-TBC-ANZ
    test('Validate warning in positive amendment for add-on without base @DXP-T1050', async ({ createAmendmentPage, productsPage, amendmentSummaryPage }) => {
        await createAmendmentPage.createAmendmentAddProductBaseAddon();
        await productsPage.assertMissingBaseProductWarning();
        await productsPage.clickWarningOkayButtonInAddonDialog();
        await amendmentSummaryPage.clickPlaceOrderButton();
    });

    test('Validate warning when removing base product but keeping dependent add-on @DXP-T1051 @DXP-T1053 @DXP-T1054 @DXP-T1055', async ({ createAmendmentPage }) => {
        await createAmendmentPage.createAmendmentCancellationBaseAddon();
        await createAmendmentPage.assertRemovingBaseProductWarning();
        //Validate Suppress warning when user opts out
        await createAmendmentPage.clickCancelButtonInAddonDialogAmendment();
    });
});