import { test } from '../fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json'

test.describe('Volume Discount', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.describe.configure({ timeout: 400000 });
    /* Test suite for verifying Volume Discount in contract creation */
    test.describe('Volume Discount - Contract Creation workflow', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts("bpc");
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.bpc);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength("1", "month");
        });

        test('Verify Volume Discount in Transaction and Line items level @DXP-T440 @DXP-T451', async ({ volumeDiscount, productsPage, summaryScreenPage, termsPage }) => {
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductBySKU("BS-TA-ROADS");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await volumeDiscount.verifyVolumeDiscountLineItems();
            await volumeDiscount.verifyVolumeDiscountUIElements();
            await volumeDiscount.placeOrder();
        });

        test('Verify Volume Discount UI Elements for non volume discount contracts @DXP-T440', async ({ volumeDiscount, productsPage, summaryScreenPage, termsPage }) => {
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductBySKU("BS-CAT-PRECISION");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await volumeDiscount.verifyVolumeDiscountNotPresent();
            await volumeDiscount.deleteDraft();
        });

        test('Verify Volume Discount UI Elements for contract with future start date @DXP-T447', async ({ volumeDiscount, termsPage, productsPage, summaryScreenPage }) => {
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectCustomFutureStartDate(6);
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductBySKU("BS-TA-ROADS");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await volumeDiscount.verifyVolumeDiscountUIElements();
            await volumeDiscount.placeOrder();
        });

        test('Verify Volume Discount UI Elements in EUR @DXP-T443', async ({ volumeDiscount, termsPage, productsPage, summaryScreenPage }) => {
            await termsPage.chooseCurrencyDropdown('EUR');
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductBySKU("BS-TA-ROADS");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await volumeDiscount.verifyVolumeDiscountUIElements();
            await volumeDiscount.placeOrder();
        });
    });

    test.describe('Add Products - Amendments Validations', () => {
        test.use({ storageState: '.auth/upgaccountuser.json' });
        test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage }, testInfo) => {
            await page.goto('/');
            await homePage.navigateToContracts("srm");
            const results = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.srm);
            if (!results[0].contract_number) {
                throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % results.length;
            const selectedContract = results[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
            let contract_number = Number(selectedContract);
            console.log('Selected Active Contract:', contract_number);
            await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
            await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
        });

        test('Verify Volume Discount in Amendment UI Elements @DXP-T441', async ({ volumeDiscount, createAmendmentPage, productsPage }) => {
            await createAmendmentPage.clickAmendContractButton();
            await createAmendmentPage.verificationOfCreateAmendmentPage();
            await createAmendmentPage.clickAddProductButton();
            await productsPage.searchProductBySKU("BS-TA-ROADS");
            await productsPage.selectRowCheckbox.check();
            await productsPage.addProductSubmitButton.click();
            await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
            await volumeDiscount.verifyVolumeDiscountInAmendment();
            await volumeDiscount.deleteDraft();
        });
    });
});