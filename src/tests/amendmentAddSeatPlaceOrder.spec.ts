import { test } from '../fixture/TestFixture';
import type { Page } from '@playwright/test';
import { CreateAmendmentPage } from '../pages/CreateAmendmentPage';
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


test.describe('Amendment - Add Seats - Place order and Discard Draft', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
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
        const selectedContract = results[safeIndex].contract_number;
        console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
        cleanupContractNumber = selectedContract.toString();
        cleanupDealerAccount = dealerAccount;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    async function createAmendmentForAddSeat(createAmendmentPage: CreateAmendmentPage) {
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectAddSeatOption();
        // await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.EnterTheLicenseAndAssertTheValue("1", "1");
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.assertTextAndVisibilityOfSummaryOfChangesScreenInCreateAmendmentPage();
        //Bug raised - https://jira.trimble.tools/browse/DXP-237
        await createAmendmentPage.verifyLicenseCountInSummaryOfChangesInCreateAmendmentScreen("1");
        await createAmendmentPage.verifyAddLicenseTextInSummaryOfChangesInCreateAmendmentScreen("1");
        const today = new Date();
        await createAmendmentPage.enterMonthDateYearInSummaryOfchangesPage(0, +6, String(today.getFullYear()));
        await createAmendmentPage.enterPONumberInSummaryOfChangesInCreateAmendmentScreen("Amendment_AddSeats_PO");
        await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
    }

    test('@DXP-T35,@NZDEV-T257, @DXP-T37 Amendments Navigation - Validation and Discard Draft Close Button redirecting to Contract Summary Page, then accept it again', async ({ amendmentSummaryPage, summaryScreenPage, createAmendmentPage }) => {
        await createAmendmentForAddSeat(createAmendmentPage);
        await amendmentSummaryPage.verifyAmendmentProgressStatus("Amendment in Progress");
        await amendmentSummaryPage.clickBacktoContract();
        await summaryScreenPage.contractSummaryScreenElementsAssertionWhenAmendmentIsDraft();
        await summaryScreenPage.clickAmendmentFromAmendmentDropdownShouldTakeToAmendmentSummaryPage();
        await amendmentSummaryPage.assertAllElementsTextAndVisibilityInAmendmentSummaryPage();
        await amendmentSummaryPage.totalChangesCountInAmendmentSummaryPage("1");
        await amendmentSummaryPage.licenseAdditionsCountInAmendmentSummaryPage("1");
        await amendmentSummaryPage.clickCloseButtonOnDiscardDraftPopUpShouldTaketoContractSummaryPage();
        await amendmentSummaryPage.clickBacktoContract();
        // await summaryScreenPage.verifyActiveSubscriptionsStatusInSubscriptionsTab('Active');
        await summaryScreenPage.clickAmendmentFromAmendmentDropdownShouldTakeToAmendmentSummaryPage();
        await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
        // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
    });

    test('@DXP-T28 Click close in Discard Draft from contract summary page should close the dialogue, then accept it', async ({ amendmentSummaryPage, createAmendmentPage, summaryScreenPage }) => {
        await createAmendmentForAddSeat(createAmendmentPage);
        await amendmentSummaryPage.verifyAmendmentDraftStatus();
        await amendmentSummaryPage.clickBacktoContract();
        await summaryScreenPage.clickCloseButtonOnDiscardDraftPopUpAndVerifyItRetainsInSameScreen();
        // await summaryScreenPage.verifyActiveSubscriptionsStatusInSubscriptionsTab('Active');
        await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
        // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
        await createAmendmentPage.verificationOfAmendContractButton();
    });

    test('@DXP-T36 @DXP-T1284 @DXP-T1306 @DXP-T1291 @DXP-T1287 @DXP-T1289 @DXP-T1290 @DXP-T1291 place order from amendment summary screen and verify amend contract button is disabled @dailysanity', async ({ createAmendmentPage, amendmentSummaryPage, summaryScreenPage, auditLogPage }) => {
        await createAmendmentForAddSeat(createAmendmentPage);
        await amendmentSummaryPage.assertAllElementsTextAndVisibilityInAmendmentSummaryPage();
        const amendmentQuoteId = await amendmentSummaryPage.getAmendmentQuoteIDFromHeader();
        await amendmentSummaryPage.clickPlaceOrderButton();
        await amendmentSummaryPage.verificationOfAlertPopup();
        await amendmentSummaryPage.clickBacktoContract();
        await amendmentSummaryPage.verifyAmendmentProgressStatusinContractPage('Amendment in Progress');
        await amendmentSummaryPage.verifyAmendContractButtonIsDisabled();
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreDisabled('Amendment');
        await amendmentSummaryPage.onHoverAmendContractBtnAndverifyTooltipText('You cannot amend a contract while there is an amendment pending');
        await auditLogPage.assertAuditLogPage();
        await auditLogPage.filterAuditLogsByCategory('Contract', 30000);
        await auditLogPage.verifyLatestAmendmentAuditLog(amendmentQuoteId, 30000);
    });
});