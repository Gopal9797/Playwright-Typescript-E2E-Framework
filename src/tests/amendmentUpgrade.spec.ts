import { expect, type Page } from '@playwright/test';
import { test } from '../fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json'
import { HomePage } from '../pages/HomePage';
import { ContractsPage } from '../pages/ContractsPage';
import { SummaryScreenPage } from '../pages/ContractSummaryScreenPage';
import { AmendmentSummaryPage } from '../pages/AmendmentSummaryPage';

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

test.describe('Amendments Upgrade', () => {

  test.use({ storageState: '.auth/upgaccountuser.json' });

  test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage }, testInfo) => {
    const dealerAccount = 'kuk';
    cleanupContractNumber = undefined;
    cleanupDealerAccount = undefined;

    await page.goto('/');
    await homePage.navigateToContracts(dealerAccount);
    const results = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.kuk);
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

  test('@NZDEV-T269 Full Upgrade from Catalyst 30 to 10', async ({ createAmendmentPage, amendmentSummaryPage, summaryScreenPage }) => {
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.verificationOfCreateAmendmentPage();
    await createAmendmentPage.selectSubscriptionToModify();
    await createAmendmentPage.clickAmendmentTypeDropdown();
    await createAmendmentPage.selectUpgradeOption();
    await createAmendmentPage.selectSubscriptionToModify();
    await createAmendmentPage.selectTheProduct('BS_CAT_SM');
    await createAmendmentPage.verifyTargetSubscriptionText();
    await createAmendmentPage.clickTargetSubscriptionDropdown();
    await createAmendmentPage.selectTheProduct('BS_CAT_DM');

    //adding licensing verification steps
    const totalAvailableLicenseCount = await createAmendmentPage.getAvailableLicenseCountInLicenseSelection();
    await createAmendmentPage.enterLicenseCount(totalAvailableLicenseCount);
    await createAmendmentPage.verifyAvailableLicenseCount(0);
    await createAmendmentPage.clickAddToCartButton();

    //summary of changes verifications - show details
    await createAmendmentPage.viewDetails.click();
    await createAmendmentPage.verifyLicenseCountIsDisplayedInShowDetails(totalAvailableLicenseCount);
    const text = await createAmendmentPage.addLicenseTextInSummaryOfChanges.innerText();
    expect(text).toContain(`Upgrade ${totalAvailableLicenseCount} licenses from Catalyst 30 to Catalyst 10`);
    await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    await amendmentSummaryPage.verifyAmendmentProgressStatus("Amendment in Progress");
    expect(text).toContain(`Upgrade ${totalAvailableLicenseCount} licenses from Catalyst 30 to Catalyst 10`);

    //discarding the amendment
    await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
    // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
    await createAmendmentPage.verificationOfAmendContractButton();

  });


  test('@NZDEV-T270 Partial Upgrade from Catalyst 60 to 10', async ({ createAmendmentPage, amendmentSummaryPage, summaryScreenPage }) => {
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.verificationOfCreateAmendmentPage();
    await createAmendmentPage.selectSubscriptionToModify();
    await createAmendmentPage.clickAmendmentTypeDropdown();
    await createAmendmentPage.selectUpgradeOption();
    await createAmendmentPage.selectSubscriptionToModify();
    await createAmendmentPage.selectTheProduct('BS_CAT_SM');
    await createAmendmentPage.verifyTargetSubscriptionText();
    await createAmendmentPage.clickTargetSubscriptionDropdown();
    await createAmendmentPage.selectTheProduct('BS_CAT_DM');

    //adding licensing verification steps
    const totalAvailableLicenseCount = await createAmendmentPage.getAvailableLicenseCountInLicenseSelection();
    await createAmendmentPage.enterLicenseCount(1);
    const expectedAvailable = totalAvailableLicenseCount - 1;
    await createAmendmentPage.verifyAvailableLicenseCount(expectedAvailable);
    await createAmendmentPage.clickAddToCartButton();


    //summary of changes verifications - show details
    await createAmendmentPage.viewDetails.click();
    await createAmendmentPage.verifyLicenseCountIsDisplayedInShowDetails(1);
    const text = await createAmendmentPage.addLicenseTextInSummaryOfChanges.innerText();
    expect(text).toContain(`Upgrade 1 license from Catalyst 30 to Catalyst 10`);
    await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    await amendmentSummaryPage.verifyAmendmentProgressStatus("Amendment in Progress");
    expect(text).toContain(`Upgrade 1 license from Catalyst 30 to Catalyst 10`);

    //discarding the amendment
    await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
    // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
    await createAmendmentPage.verificationOfAmendContractButton();

  });

  test('Select No upgrade available SKU and verify target subscription field behaviour', async ({ createAmendmentPage, amendmentSummaryPage, summaryScreenPage }) => {
    await createAmendmentPage.clickAmendContractButton();
    await createAmendmentPage.verificationOfCreateAmendmentPage();
    await createAmendmentPage.selectSubscriptionToModify();
    await createAmendmentPage.clickAmendmentTypeDropdown();
    await createAmendmentPage.selectUpgradeOption();
    await createAmendmentPage.selectSubscriptionToModify();
    await createAmendmentPage.verifyNoUpgradesAvailableMessage();
  });

});