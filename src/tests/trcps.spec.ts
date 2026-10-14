import { test } from '../fixture/AxpFixture';
import type { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContractsPage } from '../pages/ContractsPage';
import { SummaryScreenPage } from '../pages/ContractSummaryScreenPage';
import { AmendmentSummaryPage } from '../pages/AmendmentSummaryPage';
import { TrcpsPage } from '../pages/TrcpsPage';
import { RenewalPlanningTab } from '../pages/RenewalPlanningTab';
import { closeAxpBrowserIfOpen } from '../utils/axpTestHelpers';

import dealercustomers from '../pages/dealercustomers.json'

let cleanupContractNumber: string | undefined;
let cleanupDealerAccount: string | undefined;

function normalizeSku(sku: string): string {
    return sku.trim().replace(/\s+/g, '').replace(/_/g, '-').toUpperCase();
}

test.describe('TRCPS - Contract Creation with storage based product', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage }) => {
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

    test('Create Contract-TRCPS storage multiplies with quantity, max quantity is capped at 999 and storage is shown after Generate Pricing @DXP-T1201 @DXP-T1195 @DXP-T1196 @DXP-T1197 @DXP-T1200', async ({ trcpsPage, productsPage, summaryScreenPage }) => {
        // Initially 1 quantity -> Storage: 200GB (200GB x 1)
        await trcpsPage.searchAndSelectTrcpsProduct("1");
        await trcpsPage.verifyStorageForQuantityInProductRow(1);

        // Quantity 2 -> storage multiplied by 2 -> Storage: 400GB (200GB x 2)
        await trcpsPage.setQuantity("2");
        await trcpsPage.verifyStorageForQuantityInProductRow(2);

        // Entering 1000 clamps to the maximum 999 -> Storage: 199800GB (200GB x 999)
        await trcpsPage.verifyMaxQuantityIsCappedAt999();

        // Continue with quantity 2 and generate pricing
        await trcpsPage.setQuantity("2");
        await trcpsPage.verifyStorageForQuantityInProductRow(2);
        await productsPage.generatePricing();

        // Verify the storage is displayed in the draft contract summary screen
        await summaryScreenPage.summaryScreenPageAssertion();
        await trcpsPage.verifyStorageDisplayed(2);

        // Cleanup - delete the draft contract
        await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
    });
});

test.describe('TRCPS - Midterm Amendment - Add Product with storage', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage }, testInfo) => {
        const dealerAccount = 'dxpautomation';
        cleanupContractNumber = undefined;
        cleanupDealerAccount = undefined;

        await page.goto('/');
        await homePage.navigateToContracts(dealerAccount);
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
        cleanupContractNumber = selectedContract.toString();
        cleanupDealerAccount = dealerAccount;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
        await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
    });

    test('Add TRCPS product in amendment and verify storage in Additional Products of amendment summary @DXP-T1206 @DXP-T1198', async ({ createAmendmentPage, amendmentSummaryPage, productsPage, trcpsPage }) => {
        const existingProducts = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();
        test.skip(
            existingProducts.map(normalizeSku).includes(TrcpsPage.SKU),
            `Contract already contains ${TrcpsPage.SKU}, so it cannot be added again via Add Product.`
        );

        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.clickAddProductButton();
        await productsPage.verifyAddProductUI();

        // Select TRCPS with quantity 2 and verify the storage caption in the Add Product modal
        await trcpsPage.searchAndSelectTrcpsProduct("2");
        await trcpsPage.verifyStorageForQuantityInProductRow(2);
        await productsPage.submitButtonInAddProduct();

        await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
        await amendmentSummaryPage.visibilityOfBackToContractButton();

        // Verify the added product and its storage ("Add storage: 400GB (200GB x 2)") in the Additional Products section
        await amendmentSummaryPage.verifyProductSKUAddedIsDisplayedInAmendmentSummaryScreen(TrcpsPage.SKU);
        await trcpsPage.verifyStorageDisplayed(2);

        // Cleanup - discard the amendment draft
        await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
    });

    test('Verify only storage and cancellation amendments are available for TRCPS in an active contract amendment @DXPT-1199 @DXP-T1204 @DXP-T1208', async ({ createAmendmentPage }) => {
        const existingProducts = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();
        test.skip(
            !existingProducts.map(normalizeSku).includes(TrcpsPage.SKU),
            `Contract does not contain ${TrcpsPage.SKU}, so TRCPS amendment options cannot be verified.`
        );

        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModifyBySku(TrcpsPage.SKU);
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.verifyTrcpsAmendmentOptions();
    });

    test('Remove all TRCPS storage and delete the renewal planning product cancellation @DXPT-1207', async ({ createAmendmentPage, renewalPlanningTab }) => {
        const existingProducts = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();
        test.skip(
            !existingProducts.map(normalizeSku).includes(TrcpsPage.SKU),
            `Contract does not contain ${TrcpsPage.SKU}, so TRCPS storage removal cannot be verified.`
        );

        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModifyBySku(TrcpsPage.SKU);
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectRemoveStorageOption();
        await createAmendmentPage.reduceTrcpsStorageToZero();
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.confirmTrcpsStorageRemoval();
        await createAmendmentPage.clickSaveButton();

        await renewalPlanningTab.assertRenewalPlanningSectionsVisible(['Product Cancellation']);
        await renewalPlanningTab.deleteProductCancellation();
    });
});

test.describe('TRCPS - Renewal Draft - Edit Subscription Add Product with storage', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("dxprenewalsgk");
        let selectedDealerCDHAccountID = dealercustomers.dxprenewalsgk_cdhID;
        let results = await contractsPage.selectRenewalInitiatedContracts(selectedDealerCDHAccountID);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID);
            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectRenewalInitiatedContracts(dealerCDHAccountID);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerCDHAccountID = dealerCDHAccountID;
                    const dealerName = key.replace('_cdhID', '');
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no Renewal Initiated contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selectedContract = results[safeIndex].contract_number_search;
        const billToCDHAccountID = results[safeIndex].bill_to_cdh_account_id;
        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID);
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }
        console.log(`Worker ID: ${workerIdx} | Using Renewal Draft Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    test('Add TRCPS product via Edit Subscription in renewal draft and verify storage after Generate Pricing @DXP-T1201', async ({ page, renewalSummaryPage, productsPage, trcpsPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await renewalSummaryPage.clickOnEditSubscription();

        // If a previous run left TRCPS on this renewal draft, remove it first to verify add product trcps here
        const trcpsAlreadyPresent = await page.getByText(TrcpsPage.SKU, { exact: true }).first()
            .isVisible({ timeout: 3000 })
            .catch(() => false);
        if (trcpsAlreadyPresent) {
            console.log(`[Data Cleanup] ${TrcpsPage.SKU} already present on renewal draft; deleting it before re-adding.`);
            await renewalSummaryPage.deleteProduct(TrcpsPage.PRODUCT_NAME);
        }

        // Add TRCPS with quantity 2 and verify the storage caption in the Add Product modal
        await renewalSummaryPage.addProductsInEditRenewal();
        await trcpsPage.searchAndSelectTrcpsProduct("2");
        await trcpsPage.verifyStorageForQuantityInProductRow(2);
        await productsPage.submitButtonInAddProduct();

        // Verify the storage on the newly added subscription card in the Edit Subscription view
        await trcpsPage.verifyStorageDisplayed(2);

        await renewalSummaryPage.clickOnGeneratePricingInEditRenewal();
        await renewalSummaryPage.summaryScreenPageAssertion();

        // Verify the storage is displayed in the renewal draft summary screen after pricing
        await trcpsPage.verifyStorageDisplayed(2);

        // Cleanup - remove the added TRCPS product so the shared renewal draft is restored
        await renewalSummaryPage.clickOnEditSubscription();
        await renewalSummaryPage.deleteProduct(TrcpsPage.PRODUCT_NAME);
        await renewalSummaryPage.clickOnGeneratePricingInEditRenewal();
        await renewalSummaryPage.summaryScreenPageAssertion();
    });
});

