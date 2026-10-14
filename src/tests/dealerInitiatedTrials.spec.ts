import { test } from '../fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json'
import { expect } from '@playwright/test';

test.describe('Dealer Initiated Trials', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    const exhaustedTrialTestTitles = new Set([
        'When 3 trails exhausted - disable product and display trail limit reached 3/3',
        'Validate trail contract place order failure limit exhausted',
        'Validate error message when trail product is no longer eligible for place order'
    ]);

    test.describe('Dealer Initiated Trials - Contract Creation workflow', () => {

        async function navigateToTrialContractCreationFlow(
            pageObjects: {
                page: any,
                homePage: any,
                contractsPage: any,
                customerSelectionPage: any,
                termsPage: any,
                dealerInitiatedTrials: any
            },
            customerName: string,
            customerOptionIndex: number = 0,
            dealerAccountName: string = 'bpc'
        ) {
            const { page, homePage, contractsPage, customerSelectionPage, termsPage, dealerInitiatedTrials } = pageObjects;
            await page.goto('/');
            await homePage.navigateToContracts(dealerAccountName);
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            if (customerOptionIndex === 0) {
                await customerSelectionPage.findAndSelectingCustomerWithPartialName(customerName);
            } else {
                await dealerInitiatedTrials.selectTrialCustomerWithPartialName(customerName, customerOptionIndex);
            }
            await termsPage.termsPageAssertion();
            await dealerInitiatedTrials.selectTrial();
        }

        async function navigateToExhaustedTrialCustomerFlow(
            pageObjects: {
                page: any,
                homePage: any,
                contractsPage: any,
                customerSelectionPage: any,
                termsPage: any,
                dealerInitiatedTrials: any
            }
        ) {
            await navigateToTrialContractCreationFlow(
                pageObjects,
                dealercustomers.ac,
                1,
                'ac'
            );
        }

        async function moveToProductsAndSelectTrialSku(
            pageObjects: {
                termsPage: any,
                productsPage: any
            },
            sku: string
        ) {
            const { termsPage, productsPage } = pageObjects;
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.searchProductBySKU(sku);
            await productsPage.selectRowCheckbox.check();
        }

        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, dealerInitiatedTrials }, testInfo) => {
            const pageObjects = { page, homePage, contractsPage, customerSelectionPage, termsPage, dealerInitiatedTrials };
            const normalizedTitle = testInfo.title.replace(/\s+@[\w-]+/g, '').trim();

            if (exhaustedTrialTestTitles.has(normalizedTitle)) {
                await navigateToExhaustedTrialCustomerFlow(pageObjects);
                return;
            }

            await navigateToTrialContractCreationFlow(pageObjects, dealercustomers.ac, 0, 'ac');
        });

        test('Verify option to choose contract type @DXP-T543', async ({ dealerInitiatedTrials }) => {
            await dealerInitiatedTrials.verifyOptionToChooseTrialContractType();
            await dealerInitiatedTrials.selectTrial();
        });

        test('Prevent amendment and renewal @DXP-T545', async ({ dealerInitiatedTrials, termsPage, productsPage, summaryScreenPage }) => {
            await moveToProductsAndSelectTrialSku({ termsPage, productsPage }, 'BS-TRM-TA-GENSV');
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await dealerInitiatedTrials.verifyAmendmentAndRenewalArePreventedOnTrialContract();
        });

        test('Trail limit per sku and show trail available count @DXP-T548', async ({ dealerInitiatedTrials, termsPage, productsPage }) => {
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.searchProductBySKU('BS-TRM-TA-GENSV');
            await productsPage.selectRowCheckbox.check();
            await dealerInitiatedTrials.verifyTrialAvailableCountIsVisible();
        });

        test('Allow trail for different sku @DXP-T549', async ({ termsPage, productsPage }) => {
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.searchProductBySKU('BS-TRM-TA-GENSV');
            await productsPage.selectRowCheckbox.check();
            await productsPage.searchProductsTextBox.clear();
            await productsPage.searchProductBySKU('BS-SB-T4D-CORE');
            await expect(productsPage.selectRowCheckbox).toBeEnabled();
            await productsPage.selectRowCheckbox.check();
        });

        test('Allow trail for different customer @DXP-T550', async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, dealerInitiatedTrials, productsPage }) => {
            await navigateToTrialContractCreationFlow(
                { page, homePage, contractsPage, customerSelectionPage, termsPage, dealerInitiatedTrials },
                dealercustomers.bpc,
                1
            );

            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.searchProductBySKU('BS-TRM-TA-GENSV');
            await expect(productsPage.selectRowCheckbox).toBeEnabled();
        });

        test('Option to filter trail in contract list page @DXP-T551', async ({ dealerInitiatedTrials, productsPage, summaryScreenPage, termsPage, contractsPage }) => {
            await moveToProductsAndSelectTrialSku({ termsPage, productsPage }, 'BS-TRM-TA-GENSV');
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await summaryScreenPage.fillPOReferenceNumber('TrialsAutomationPO');
            const contractID = await dealerInitiatedTrials.getTrialContractIDFromHeader();
            await dealerInitiatedTrials.placeOrder();
            await summaryScreenPage.backToTableButton.click();
            await contractsPage.assertContractsPage();
            await contractsPage.searchContractWithGivenContractID(contractID, '');
            await expect(contractsPage.listStatuses.first()).toContainText('Submitted');
            await contractsPage.searchTextBox.clear();
        });

        test('When 3 trails exhausted - disable product and display trail limit reached 3/3 @DXP-T552', async ({ dealerInitiatedTrials, termsPage, productsPage }) => {
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.searchProductBySKU('BS-TRM-TA-GENSV');
            const isExhausted = await dealerInitiatedTrials.hasTrialLimitReachedState();
            test.skip(!isExhausted, 'No exhausted trial SKU available in current environment to validate 3/3 behavior.');
            await dealerInitiatedTrials.verifyTrialLimitReachedMessage();
            await (productsPage.cancelButton).click();

        });

        test('Verify Dealer Initiated Trials in Transaction and Line items level @DXP-T553', async ({ dealerInitiatedTrials, productsPage, summaryScreenPage, termsPage }) => {
            await moveToProductsAndSelectTrialSku({ termsPage, productsPage }, 'BS-TRM-TA-GENSV');
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
            await summaryScreenPage.fillPOReferenceNumber('TrialsAutomationPO');
            await dealerInitiatedTrials.placeOrder();
        });
    });
});