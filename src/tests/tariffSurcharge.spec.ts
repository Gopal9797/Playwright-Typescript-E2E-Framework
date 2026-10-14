import { test } from '../fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json'

test.describe('Tariff Surcharge', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.describe.configure({ timeout: 400000 });
    /* Test suite for verifying Tariff Surcharge in contract creation */
    test.describe('Tariff Surcharge - Contract Creation workflow', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts("fp");
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.fp);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength("1", "month");
        });

        test('Verify Tariff Surcharge in Transaction and Line items level @DXP-T428 @DXP-T427', async ({ tariffSurcharge, productsPage, summaryScreenPage, termsPage }) => {
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductBySKU("BS-CAT-PRECISION");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await tariffSurcharge.verifyTariffSurchargeLineItems();
            await tariffSurcharge.verifyTariffSurchargeUIElements();
            await tariffSurcharge.placeOrder();
        });

        test('Verify Tariff Surcharge UI Elements for contract with future start date @DXP-T429', async ({ tariffSurcharge, termsPage, productsPage, summaryScreenPage }) => {
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectCustomFutureStartDate(6);
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductBySKU("BS-TA-ROADS");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await tariffSurcharge.verifyTariffSurchargeUIElements();
            await tariffSurcharge.placeOrder();
        });
    });
    /* Test suite for verifying Tariff Surcharge in contract creation for non US accounts */
    test.describe('Tariff Surcharge - Non US Contract Creation workflow', () => {
        test.use({ storageState: '.auth/upgaccountuser.json' });
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts("bpc");
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.bpc);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength("1", "month");
        });

        test('Verify Tariff Surcharge UI Elements in EUR @DXP-T434', async ({ tariffSurcharge, termsPage, productsPage, summaryScreenPage }) => {
            await termsPage.chooseCurrencyDropdown('EUR');
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductBySKU("BS-TA-ROADS");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await tariffSurcharge.verifyTariffSurchargeNotPresent();
            await tariffSurcharge.placeOrder();
        });

        test('Verify Tariff Surcharge UI Elements for non US Account @DXP-T434', async ({ tariffSurcharge, productsPage, summaryScreenPage, termsPage }) => {
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductBySKU("BS-CAT-PRECISION");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await tariffSurcharge.verifyTariffSurchargeNotPresent();
            await tariffSurcharge.deleteDraft();
        });
    });
    /* Test suite for verifying Tariff Surcharge in contract amendment */
    test.describe('Amendment - Add Seats', () => {
        test.use({ storageState: '.auth/upgaccountuser.json' });
        test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
            await page.goto('/');
            await homePage.navigateToContracts("kuk");
            const results = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.kuk);
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
        });

        test('Verify Tariff Surcharge in Amendment UI Elements @DXP-T431', async ({ tariffSurcharge, createAmendmentPage }) => {
            await createAmendmentPage.clickAmendContractButton();
            await createAmendmentPage.createAmendmentByAddingSeatsAndGeneratePricing("1", "1");
            await tariffSurcharge.verifyTariffSurchargeInAmendment();
            await tariffSurcharge.deleteDraft();
        });
    });
});
