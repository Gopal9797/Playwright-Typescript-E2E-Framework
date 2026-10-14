import { test } from '../fixture/TestFixture';
import { expect } from "@playwright/test";

import dealercustomers from '../pages/dealercustomers.json'
import { AmendmentSummaryPage } from '../pages/AmendmentSummaryPage';
import { commonSqlQueries } from '../pages/commonSqlQueries';

test.describe('Amendment - Banners validation - Regenerate pricing and Reprice_change', () => {

  test.use({ storageState: '.auth/upgaccountuser.json' });

  test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage }) => {
    await page.goto('/');
    await homePage.navigateToContracts("upg");
    const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.upg);
    if (!result[0].contract_number) {
      throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
    }
    let contract_number = Number(result[0].contract_number);
    console.log('Selected Active Contract:', contract_number);
    await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
    await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
  });


  test('Validate the presence of Reprice Change banner and Regenerate Pricing banner on Amendment Summary page', async ({ createAmendmentPage, amendmentSummaryPage, regeneratePricingPage, summaryScreenPage, commonSqlQueries }) => {
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.verificationOfCreateAmendmentPage();
    await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
    await createAmendmentPage.clickAmendmentTypeDropdown();
    await createAmendmentPage.selectAddSeatOption();
    await createAmendmentPage.EnterTheLicenseAndAssertTheValue("1", "1");
    await createAmendmentPage.clickAddToCartButton();
    await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    await amendmentSummaryPage.verifyDiscardDraftButtonIsVisible();

    // Step 1: Get the contract GUID from the current page URL
    const contractGuid = await summaryScreenPage.fetchContractGUIDFromURL();

    // Step 2: Fetch the external_quote_id for the AMENDMENT_DRAFT quote
    const externalQuoteId = await commonSqlQueries.getExternalQuoteIdByContractIdForAMENDMENT_DRAFT(contractGuid);

    // Step 3: Fetch the current last_price_updated_date for that quote
    const lastPriceUpdatedDate = await commonSqlQueries.getLastPriceUpdatedDateForExternalQuoteId(externalQuoteId);

    // Step 4: Update last_price_updated_date to 2 days before the fetched date
    await commonSqlQueries.updateLastPriceUpdatedDateTwoDaysBack(externalQuoteId, lastPriceUpdatedDate);

    await summaryScreenPage.page.reload(); //refrshing the page to see regenerate banner after updating the date in DB

    // Step 5: Verify that the Reprice Change banner and other scenarios
    await amendmentSummaryPage.clickBacktoContract();
    await regeneratePricingPage.assertregeneratePricingBannerInSummaryScreen();
    await regeneratePricingPage.verifyQuoteIdIsShownInregeneratePricingBanner(externalQuoteId);
    await regeneratePricingPage.clickGoToAmendmentButtonInBannerShouldTakeToAmendmentDetailsScreen();
    await regeneratePricingPage.assertregeneratePricingBannerInAmendmentSummaryScreen();
    await regeneratePricingPage.clickOnregeneratePriceButtonInAmendmentSummaryScreen();
    await amendmentSummaryPage.visibilityOfPlaceOrderButton();
    await amendmentSummaryPage.discardDraftButton.click();
    await expect(amendmentSummaryPage.acceptButtonOnDiscardDraftPopup).toBeVisible();
    await amendmentSummaryPage.acceptButtonOnDiscardDraftPopup.click({ timeout: 20000 });
    await expect(amendmentSummaryPage.amendContractButton).toBeVisible();
  });
});
