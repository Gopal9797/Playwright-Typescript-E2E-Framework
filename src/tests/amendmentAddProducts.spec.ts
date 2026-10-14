import { test } from '../fixture/TestFixture';
import type { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContractsPage } from '../pages/ContractsPage';
import { SummaryScreenPage } from '../pages/ContractSummaryScreenPage';
import { AmendmentSummaryPage } from '../pages/AmendmentSummaryPage';

import dealercustomers from '../pages/dealercustomers.json'

let cleanupContractNumber: string | undefined;
let cleanupDealerAccount: string | undefined;

async function discardAmendmentDraftForFailedTest(page: Page): Promise<void> {
  if (!cleanupContractNumber || !cleanupDealerAccount) {
    console.log('[Failure Cleanup] Skipping draft cleanup because no contract context was captured.');
    return;
  }

  const homePage = new HomePage(page);
  const contractsPage = new ContractsPage(page);
  const summaryScreenPage = new SummaryScreenPage(page);
  const amendmentSummaryPage = new AmendmentSummaryPage(page);

  await page.goto('/');
  await homePage.navigateToContracts(cleanupDealerAccount);
  await contractsPage.searchContractWithGivenContractIDAndClickContract(cleanupContractNumber);

  const summaryDiscardVisible = await summaryScreenPage.discardDraftButtonInContractSummaryScreen
    .isVisible()
    .catch(() => false);

  if (summaryDiscardVisible) {
    await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
    return;
  }

  await summaryScreenPage.clickOnAmendmentDraftReadyFromBanner();
  await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
}

test.afterEach(async ({ page }, testInfo) => {
  const status = testInfo.status;
  if (status !== 'failed' && status !== 'timedOut' && status !== 'interrupted') {
    return;
  }

  try {
    await discardAmendmentDraftForFailedTest(page);
    console.log(`[Failure Cleanup] Draft cleanup completed for contract ${cleanupContractNumber}.`);
  } catch (error) {
    console.warn(`[Failure Cleanup] Draft cleanup failed for contract ${cleanupContractNumber}.`, error);
  }
});

test.describe('Add Products - Amendments Validations', () => {

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

  test('@NZDEV-T267 Addproduct - Search by sku & product, Invalid Search', async ({ createAmendmentPage, productsPage }) => {
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.verificationOfCreateAmendmentPage();
    await createAmendmentPage.clickAddProductButton();
    await productsPage.verifyAddProductUI();

    //search by valid product name and sku
    await productsPage.searchProductByName("Catalyst 60");
    await productsPage.searchProductBySKU("BS-CAT-1M");

    //search by invalid product name
    await productsPage.searchWithInvalidProductName("invalidproduct123");

    //close addproduct dialog should take to create amendment page
    await productsPage.closeButtonInAddproduct();
    await createAmendmentPage.verificationOfCreateAmendmentPage();
  });

  test.skip('@NZDEV-T264 Verification of clearing the search field and verify all product list is returned', async ({ createAmendmentPage, productsPage }) => {
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.verificationOfCreateAmendmentPage();
    await createAmendmentPage.clickAddProductButton();
    await productsPage.searchProductBySKU("BS-CAT-1M");
    await productsPage.clearProductSearch();
  });


  test('Search existing contract products and verify it is disabled in Add Product', async ({ createAmendmentPage, productsPage }) => {
    const existingProducts = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();
    console.log("Existing Contract Products: ", existingProducts);
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.verificationOfCreateAmendmentPage();
    await createAmendmentPage.clickAddProductButton();
    for (const product of existingProducts) {
      await productsPage.searchProductBySKU(product);
      await productsPage.verifySearchedProductDisabled();
      await productsPage.clearProductSearch()
    }
  });

  test('Verify Pricing Breakdown is displayed for every product and contract totals match on an active contract', async ({ amendmentSummaryPage }) => {
    await amendmentSummaryPage.verifyPricingBreakdownDisplayedForAllIndexesAndContractTotalsMatch();
  });
});

test.describe('MidTerm Amendments - Add Products to a contract', () => {
  test.use({ storageState: '.auth/upgaccountuser.json' });
  test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage }, testInfo) => {
    const dealerAccount = 'upg';
    cleanupContractNumber = undefined;
    cleanupDealerAccount = undefined;

    await page.goto('/');
    await homePage.navigateToContracts(dealerAccount);
    const results = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.upg);
    if (!results || results.length === 0) {
      throw new Error('Database returned no valid active contracts.');
    }
    const workerIdx = testInfo.workerIndex;
    const safeIndex = workerIdx % results.length;
    const selectedContract = results[safeIndex].contract_number;
    console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
    cleanupContractNumber = selectedContract.toString();
    cleanupDealerAccount = dealerAccount;
    await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
  });

  test('Add a new product without license increment or decrement', async ({ createAmendmentPage, amendmentSummaryPage, productsPage, summaryScreenPage }) => {
    const existing = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.clickAddProductButton();
    const chosen = await productsPage.pickAndSelectNewProduct(existing);
    console.log("Selected product:", chosen);
    await productsPage.submitButtonInAddProduct();
    await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    await amendmentSummaryPage.verifyProductSKUAddedIsDisplayedInAmendmentSummaryScreen(chosen);
    await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
  });

  test('Add multiple products without license and verify it in amendment summary', async ({ createAmendmentPage, amendmentSummaryPage, productsPage, summaryScreenPage }) => {

    const existing = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();

    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.clickAddProductButton();

    const available = await productsPage.getAvailableProducts(existing);

    const numberToAdd = 3;   // pick first 3 currently available products from UI
    const chosenProducts = available.slice(0, numberToAdd);

    for (const product of chosenProducts) {
      await productsPage.searchProductBySKU(product);
      await productsPage.verifySelectAndUnselectAllFunctionality();
      await productsPage.selectRowCheckbox.check();
      await productsPage.clearProductSearch()
    }

    await productsPage.submitButtonInAddProduct();

    await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    await amendmentSummaryPage.visibilityOfBackToContractButton();
    await amendmentSummaryPage.verifyTotalChangesCountInAmendmentSummaryScreen(3);

    for (const product of chosenProducts) {
      await amendmentSummaryPage.verifyProductSKUAddedIsDisplayedInAmendmentSummaryScreen(product);
    }
    await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
  });

  test('@NZDEV-T260 Add multiple products with license and verify it in amendment summary', async ({ createAmendmentPage, amendmentSummaryPage, productsPage, summaryScreenPage }) => {

    const existing = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();

    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.clickAddProductButton();

    const available = await productsPage.getAvailableProducts(existing);

    const numberToAdd = 2;   // pick first 2 currently available products from UI
    const chosenProducts = available.slice(0, numberToAdd);

    for (const product of chosenProducts) {
      await productsPage.selectProductBySKUAndQuantityWithIncrementAndDecrementScenariosCovered(product, "5");
      await productsPage.selectRowCheckbox.check();
      await productsPage.clearProductSearch()
    }
    await productsPage.submitButtonInAddProduct();
    await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    await amendmentSummaryPage.visibilityOfBackToContractButton();
    await amendmentSummaryPage.verifyTotalChangesCountInAmendmentSummaryScreen(2);

    for (const product of chosenProducts) {
      await amendmentSummaryPage.verifyProductSKUAddedIsDisplayedInAmendmentSummaryScreen(product);
    }
    await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();

  });

  test('@NZDEV-T261 @NZDEV-T262 @NZDEV-T263 Multiple positive motions, ADD SEATS, ADD PRODUCTS, UPGRADE SEATS and verify the summary of changes', async ({ createAmendmentPage, amendmentSummaryPage, productsPage, summaryScreenPage }) => {

    // 1: ADD PRODUCTS ---
    const existing = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.clickAddProductButton();
    const chosen = await productsPage.pickAndSelectNewProduct(existing);
    console.log("Selected product:", chosen);
    await productsPage.submitButtonInAddProduct();

    // 2: ADD SEATS ---
    await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
    await createAmendmentPage.clickAmendmentTypeDropdown();
    await createAmendmentPage.selectAddSeatOption();
    await createAmendmentPage.EnterTheLicenseAndAssertTheValue("1", "1");
    await createAmendmentPage.clickAddToCartButton();

    // 3: UPGRADE SEATS ---
    await createAmendmentPage.selectSubscriptionToModify();
    await createAmendmentPage.selectTheProduct('BS_CAT_1M');
    await createAmendmentPage.clickAmendmentTypeDropdown();
    await createAmendmentPage.selectUpgradeOption();
    await createAmendmentPage.verifyTargetSubscriptionText();
    await createAmendmentPage.clickTargetSubscriptionDropdown();
    await createAmendmentPage.selectTheProduct('BS_CAT_DM');
    const totalAvailableLicenseCount = await createAmendmentPage.getAvailableLicenseCountInLicenseSelection();
    await createAmendmentPage.enterLicenseCount(1);
    await createAmendmentPage.clickAddToCartButton();

    // --- Generate Pricing & Verify Summary ---
    await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    await amendmentSummaryPage.assertAllElementsTextAndVisibilityInAmendmentSummaryPage();
    await amendmentSummaryPage.verifyAmendmentDraftStatus();
    await amendmentSummaryPage.verifyProductSKUAddedIsDisplayedInAmendmentSummaryScreen(chosen);
    await amendmentSummaryPage.verifyTotalChangesCountInAmendmentSummaryScreen(3);

    // --- Discard the draft ---
    await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
  });


  test('Add more than 5 products and Verify expand button is shown for additonal products in amendment summary screen @dailysanity', async ({ createAmendmentPage, amendmentSummaryPage, productsPage }) => {
    const existing = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.clickAddProductButton();
    await productsPage.verifyAddProductUI();

    const available = await productsPage.getAvailableProducts(existing);

    const numberToAdd = 6;   // pick first 6 currently available products from UI
    if (available.length < numberToAdd) {
      throw new Error(`Need at least ${numberToAdd} selectable products to validate additional-products expansion, but found ${available.length}.`);
    }
    const chosenProducts = available.slice(0, numberToAdd);

    for (const product of chosenProducts) {
      await productsPage.searchProductBySKU(product);
      await productsPage.selectRowCheckbox.check();
      await productsPage.clearProductSearch();
    }
    await productsPage.submitButtonInAddProduct();
    await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    await amendmentSummaryPage.visibilityOfBackToContractButton();
    await amendmentSummaryPage.clickExpandButtonInAdditionalproducts();

    for (const product of chosenProducts) {
      await amendmentSummaryPage.verifyProductSKUAddedIsDisplayedInAmendmentSummaryScreen(product);
    }
    await amendmentSummaryPage.clickPlaceOrderButton();
    await amendmentSummaryPage.verificationOfAlertPopup();
    await amendmentSummaryPage.visibilityOfBackToContractButton();
    await amendmentSummaryPage.verifyAmendmentProgressStatus("Amendment in Progress");
    await amendmentSummaryPage.clickBacktoContract();
    await amendmentSummaryPage.verifyAmendContractButtonIsDisabled();
    await amendmentSummaryPage.onHoverAmendContractBtnAndverifyTooltipText('You cannot amend a contract while there is an amendment pending');
  });

});

test.describe('Contract with an amendment - Pricing Breakdown and Total Changes', () => {
  test.use({ storageState: '.auth/upgaccountuser.json' });

  test('Verify contract totals match on a contract that already has an amendment, and Total Changes matches the listed changes', async ({ page, homePage, contractsPage, summaryScreenPage, amendmentSummaryPage }, testInfo) => {
    cleanupContractNumber = undefined;
    cleanupDealerAccount = undefined;

    const dealerAccount = 'dxpautomation';
    await page.goto('/');
    await homePage.navigateToContracts(dealerAccount);
    const results = await contractsPage.selectActivatedContractWithAmendmentFromDB(dealercustomers.dxpAutomation);
    if (!results || results.length === 0) {
      throw new Error('Database returned no activated contracts with an amendment.');
    }
    const workerIdx = testInfo.workerIndex;
    const safeIndex = workerIdx % results.length;
    const selectedRow = results[safeIndex];
    if (!selectedRow || selectedRow.contract_number == null) {
      throw new Error(`Database returned an amended contract row without a contract_number at index ${safeIndex}.`);
    }
    const selectedContract = selectedRow.contract_number.toString();
    console.log(`Worker ID: ${workerIdx} | Using amended contract: ${selectedContract}`);
    await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract);
    await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
    await amendmentSummaryPage.verifyPricingBreakdownDisplayedForAllIndexesAndContractTotalsMatch();
    const changesCountFromRow = await summaryScreenPage.openFirstAmendmentFromAmendmentsTab();
    if (changesCountFromRow === undefined) {
      throw new Error('First amendment row did not contain a Changes count.');
    }
    await amendmentSummaryPage.verifyTotalChangesCountInAmendmentSummaryScreen(changesCountFromRow);
    await amendmentSummaryPage.verifyDisplayedTotalChangesMatchesListedChanges();
  });
});