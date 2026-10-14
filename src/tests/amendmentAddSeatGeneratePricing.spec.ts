import { test } from '../../src/fixture/TestFixture';
import { expect, type Page } from '@playwright/test';
import dealercustomers from '../pages/dealercustomers.json'
import { SummaryScreenPage } from '../pages/ContractSummaryScreenPage';
import { CreateAmendmentPage } from '../pages/CreateAmendmentPage';
import { HomePage } from '../pages/HomePage';
import { ContractsPage } from '../pages/ContractsPage';
import { AmendmentSummaryPage } from '../pages/AmendmentSummaryPage';
let contract_number: number | undefined;
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

test.describe('Amendments - UI Assertions', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage, summaryScreenPage }, testInfo) => {
        const dealerAccount = 'sdm';
        cleanupContractNumber = undefined;
        cleanupDealerAccount = undefined;

        await page.goto('/');
        await homePage.navigateToContracts(dealerAccount);
        const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.sdm);
        if (!contract_number) {
            if (!result[0].contract_number) {
                throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % result.length;
            const selectedContract = result[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
            contract_number = Number(selectedContract);
        }
        if (contract_number === undefined) {
            throw new Error('No contract_number selected for cleanup context.');
        }
        cleanupContractNumber = contract_number.toString();
        cleanupDealerAccount = dealerAccount;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
        await summaryScreenPage.summaryScreenPageAssertion();
        await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
    });

    test('Verification Of CreateAmendmentPage Elements', async ({ createAmendmentPage }) => {
        await createAmendmentPage.assertCreateAmendmentPageTextElements();
    });

    test('Verification Of Visit Existing Contract From Create Amendment Page', async ({ createAmendmentPage }) => {
        await createAmendmentPage.visitExistingContractFromCreateAmendmentPageShouldTakeToCreateAmendmentPage();
    });

    test(' @NZDEV-T259 Verification Of Add To Cart Button Is Enabled When Increment Seat Button Is Greater Than 0', async ({ createAmendmentPage }) => {
        await createAmendmentPage.verifyAddToCartButtonIsEnabledWhenIncrementSeatButtonIsGreaterThan0();
    });

    test('Verification Of Add To Cart Button Is Disabled When Increment Seat Button Is 0', async ({ createAmendmentPage }) => {
        await createAmendmentPage.verifyAddToCartButtonIsDisabledWhenIncrementSeatButtonIs0();
    });

    test('Verification Of Seats Can Not Be Added More Than 999', async ({ createAmendmentPage }) => {
        await createAmendmentPage.verifySeatsCanNotBeAddedMoreThan999AndIncrementButtonIsDisabled();
    });

    // test('@Dxp-187 Verification Of Seats Can Not Be Added Less Than 0', async ({createAmendmentPage }) => {    
    //     await createAmendmentPage.verifySeatsCanNotBeAddedLessThan0AndVerifyDecrementButtonIsDisabled();
    // });

    test('Add license using increment button and assert the value', async ({ createAmendmentPage }) => {
        await createAmendmentPage.addLicenseSeatsUsingIncrementButton();
    }
    );

    test('Add license using decrement button and assert the value', async ({ createAmendmentPage }) => {
        await createAmendmentPage.reduceLicenseSeatsUsingDecrementButton();
    });

    // helper to perform the common steps before date checks
    async function prepareSummaryForDateChecks(createAmendmentPage: CreateAmendmentPage) {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectAddSeatOption();
        await createAmendmentPage.EnterTheLicenseAndAssertTheValue("5", "5");
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.assertTextAndVisibilityOfSummaryOfChangesScreenInCreateAmendmentPage();
    }

    test('Verify generate pricing disabled for future year', async ({ page, createAmendmentPage }) => {
        await prepareSummaryForDateChecks(createAmendmentPage);
        await createAmendmentPage.verifyGeneratePricingDisabledForFutureYear();
    });

    test('Verify generate pricing enabled within allowed range', async ({ page, createAmendmentPage }) => {
        await prepareSummaryForDateChecks(createAmendmentPage);
        await createAmendmentPage.verifyGeneratePricingEnabledWithinAllowedRange();
    });

    test('Verify generate pricing disabled beyond max days', async ({ page, createAmendmentPage }) => {
        await prepareSummaryForDateChecks(createAmendmentPage);
        await createAmendmentPage.verifyGeneratePricingDisabledBeyondMaxDays();
    });

    test('Verify generate pricing disabled for month beyond two ahead', async ({ page, createAmendmentPage }) => {
        await prepareSummaryForDateChecks(createAmendmentPage);
        await createAmendmentPage.verifyGeneratePricingDisabledForMonthBeyondTwoAhead();
    });

    test('log days in current month', async ({ page, createAmendmentPage }) => {
        await prepareSummaryForDateChecks(createAmendmentPage);
        await createAmendmentPage.validateDaysInCurrentMonthAndLog();
    });

    test('Verify today date shows error', async ({ page, createAmendmentPage }) => {
        await prepareSummaryForDateChecks(createAmendmentPage);
        await createAmendmentPage.verifyGeneratePricingDisabledForPastDate();
    });

    test('Verify removing the license should discard summary of changes and disable proceed to cart button', async ({ page, createAmendmentPage, summaryScreenPage }) => {
        await createAmendmentPage.clickRemoveChangesButtonAndVerifySummaryOfChangesIsDiscarded();
    });
});

test.describe('Positive Amendments - Add Seats Generate Pricing', () => {
    test.describe.configure({ mode: 'serial' });
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage }, testInfo) => {
        const dealerAccount = 'sdm';
        cleanupContractNumber = undefined;
        cleanupDealerAccount = undefined;

        await page.goto('/');
        await homePage.navigateToContracts(dealerAccount);
        const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.sdm);
        if (!result[0].contract_number) {
            throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
        }
        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % result.length;
        const selectedContract = result[safeIndex].contract_number;
        console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
        cleanupContractNumber = selectedContract.toString();
        cleanupDealerAccount = dealerAccount;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
        await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
    });


    test('@NZDEV-T279 @NZDEV-T272 @DXP-T1283 @DXP-T1292 @DXP-T1293 @DXP-T1303 @DXP-T1306 Positive Amendments - Add Seats - Generate Pricing - Future Dated', async ({ page, createAmendmentPage, amendmentSummaryPage, contractsPage, summaryScreenPage }) => {
        //entering license count and PO number to be passed as argument
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectAddSeatOption();
        await createAmendmentPage.EnterTheLicenseAndAssertTheValue("2", "2");
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.assertTextAndVisibilityOfSummaryOfChangesScreenInCreateAmendmentPage();
        //Bug raised - https://jira.trimble.tools/browse/DXP-237
        //await createAmendmentPage.verifyLicenseCountInSummaryOfChangesInCreateAmendmentScreen("2");
        await createAmendmentPage.verifyAddLicenseTextInSummaryOfChangesInCreateAmendmentScreen("2");
        const today = new Date();
        await createAmendmentPage.enterMonthDateYearInSummaryOfchangesPage(0, +6, String(today.getFullYear()));
        await createAmendmentPage.enterPONumberInSummaryOfChangesInCreateAmendmentScreen("Amendment_AddSeats_PO");
        await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
        // Land on amendment summary, then return to contract for Manage* checks.
        await amendmentSummaryPage.verifyAmendmentDraftStatus();
        await amendmentSummaryPage.clickBacktoContract();
        await expect(summaryScreenPage.amendmentDraftReadyFromBanner).toBeVisible({ timeout: 60000 });
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreDisabled('Amendment');
        await summaryScreenPage.clickOnAmendmentDraftReadyFromBanner();
        await amendmentSummaryPage.verifyAmendmentDraftStatus();
        await amendmentSummaryPage.assertAllElementsTextAndVisibilityInAmendmentSummaryPage();
        await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreEnabled();
    });

    test('@NZDEV-T273 @NZDEV-T274 Positive Amendments - Add Seats - Generate Pricing without adding date and PO number', async ({ page, createAmendmentPage, amendmentSummaryPage, contractsPage }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectAddSeatOption();
        await createAmendmentPage.EnterTheLicenseAndAssertTheValue("2", "2");
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
        await amendmentSummaryPage.verifyAmendmentDraftStatus();
        await amendmentSummaryPage.assertAllElementsTextAndVisibilityInAmendmentSummaryPage();
        await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
    });
});
