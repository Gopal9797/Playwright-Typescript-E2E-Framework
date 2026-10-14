import { test } from '../fixture/AxpFixture';
import type { Page } from '@playwright/test';
import dealercustomers from '../pages/dealercustomers.json';
import { HomePage } from '../pages/HomePage';
import { ContractsPage } from '../pages/ContractsPage';
import { SummaryScreenPage } from '../pages/ContractSummaryScreenPage';
import { AmendmentSummaryPage } from '../pages/AmendmentSummaryPage';
import type { CreateAmendmentPage } from '../pages/CreateAmendmentPage';
import { RenewalPlanningTab } from '../pages/RenewalPlanningTab';
import { closeAxpBrowserIfOpen } from '../utils/axpTestHelpers';
import type { OrderNotificationsPage } from '../pages/OrderNotificationsPage';

const AXP_CUSTOMER_ID_BY_ACCOUNT = {
    'bpc': '264c5ece-f797-55a2-95cf-757cb0ffb7f9',
    'srm': '84ebc425-e715-5cb6-9551-e18d3883de5c',
    'upg': '85e085f6-29f1-5e04-8f41-e7758dc18453',
    'fp': '76244577-67d7-5134-85b6-40f9712037f1',
    'kuk': 'fa0d5047-e507-5018-9890-4c9bf0a24afa',
    'ntjv': '2bce6c5e-b4c6-5302-9d55-3b5e64c49c50',
    'osa': 'fced6f0a-9abd-58d6-947e-fa43656945bf',
    'sdm': 'f5775ce7-4895-5616-9518-f3ee8a72debf',
    'sms': 'd458437b-fea2-5052-968e-ef15c44cce12',
    'ac': '063220ba-d9d4-59d7-9b0c-40d27cd1cf00',
    'tps': 'a1a73f2f-68dc-55b5-9a9d-7412ffcd16bc',
    'dxpAutomation': '437d54ac-8a85-5516-be31-9ecda8de19dc'
} as const;

const AXP_CUSTOMER_COMMENT = 'PLAYWRIGHT AUTOMATION - CUSTOMER INITIATED AMENDMENT';

type ActiveContractRow = {
    contract_number: string | number;
    id: string | number;
};

type FutureDateInput = {
    month: number;
    day: number;
    year: number | string;
};

const MAX_CUSTOMER_REQUEST_FUTURE_DAYS = 30;

const futureDateFromToday = (daysAhead: number): FutureDateInput => {
    if (!Number.isInteger(daysAhead) || daysAhead < 1 || daysAhead > MAX_CUSTOMER_REQUEST_FUTURE_DAYS) {
        throw new Error(`daysAhead must be an integer between 1 and ${MAX_CUSTOMER_REQUEST_FUTURE_DAYS}.`);
    }

    const today = new Date();
    const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const date = new Date(todayAtMidnight);
    date.setDate(date.getDate() + daysAhead);

    // Safety guard for edge cases; this helper must never return a past date.
    if (date <= todayAtMidnight) {
        date.setDate(todayAtMidnight.getDate() + 1);
    }

    return {
        month: date.getMonth() + 1,
        day: date.getDate(),
        year: date.getFullYear(),
    };
};

test.describe('Customer initiated amendments - AXP to DXP', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.setTimeout(5 * 60 * 1000); // 5 minutes, to accommodate for potential delays in DB queries and UI interactions
    let contractNumber = '';
    let contractGuid = '';

    test.beforeEach(async ({ contractsPage, axpContractPage }, testInfo) => {
        contractNumber = '';
        contractGuid = '';

        const results = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.tps);
        if (!results || results.length === 0) {
            throw new Error('Database returned no valid active contracts for customer initiated amendment flow.');
        }

        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selected = results[safeIndex] as ActiveContractRow;
        contractNumber = String(selected.contract_number);
        contractGuid = String(selected.id);

        console.log(`Worker ID: ${workerIdx} | Using Contract Number: ${contractNumber} | Contract GUID: ${contractGuid}`);
        await axpContractPage.goToContract(AXP_CUSTOMER_ID_BY_ACCOUNT.tps, contractGuid);
        await axpContractPage.clickCreateAmendment(contractNumber);
    });

    async function clearRenewalPlanningDataForSelectedContractOnFailure(page: Page): Promise<void> {
        if (!contractNumber) {
            console.log('[Failure Cleanup] Skipping cleanup because no contract number was selected.');
            return;
        }

        const homePage = new HomePage(page);
        const contractsPage = new ContractsPage(page);
        const renewalPlanningTab = new RenewalPlanningTab(page);

        await page.goto('/');
        await homePage.navigateToContracts('tps');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await renewalPlanningTab.clearOutAllRenewalPlanningTabData();
    }

    async function discardAmendmentDraftForSelectedContractOnFailure(page: Page): Promise<void> {
        if (!contractNumber) {
            console.log('[Failure Cleanup] Skipping draft cleanup because no contract number was selected.');
            return;
        }

        const homePage = new HomePage(page);
        const contractsPage = new ContractsPage(page);
        const summaryScreenPage = new SummaryScreenPage(page);
        const amendmentSummaryPage = new AmendmentSummaryPage(page);

        await page.goto('/');
        await homePage.navigateToContracts('tps');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);

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
            await discardAmendmentDraftForSelectedContractOnFailure(page);
            console.log(`[Failure Cleanup] Draft cleanup completed for contract ${contractNumber}.`);
        } catch (error) {
            console.warn(`[Failure Cleanup] Unable to discard Amendment Draft for contract ${contractNumber}.`, error);
        }

        try {
            await clearRenewalPlanningDataForSelectedContractOnFailure(page);
            console.log(`[Failure Cleanup] Cleared renewal planning data for contract ${contractNumber}.`);
        } catch (error) {
            console.warn(`[Failure Cleanup] Unable to clear renewal planning data for contract ${contractNumber}.`, error);
        }
    });

    async function openDxpContractWithPendingRequest(
        page: Page,
        homePage: HomePage,
        contractsPage: ContractsPage,
        createAmendmentPage: CreateAmendmentPage,
        orderNotificationsPage: OrderNotificationsPage,
        summaryScreenPage: SummaryScreenPage,
    ): Promise<void> {
        await page.goto('/');
        await homePage.navigateToDashboard('tps');
        await homePage.dashboardSearchFilter(contractNumber);
        await homePage.assertCustomerRequestEventIsVisible();
        await homePage.navigateToContracts('tps');
        await orderNotificationsPage.verifyCustomerRequestNotificationForContract(contractNumber);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await createAmendmentPage.assertCustomerRequestBannerVisible();
        await createAmendmentPage.assertManageRequestButtonVisible();
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreDisabled('CustomerRequest');
    }

    async function openDxpContractAndAcceptRequest(
        page: Page,
        homePage: HomePage,
        contractsPage: ContractsPage,
        createAmendmentPage: CreateAmendmentPage,
        orderNotificationsPage: OrderNotificationsPage,
        summaryScreenPage: SummaryScreenPage,
        options?: {
            schedule?: 'orderPlaced' | 'futureDate';
            futureDate?: FutureDateInput;
            assertDefaultAsap?: boolean;
            assertAxpComment?: boolean;
        }
    ): Promise<void> {
        await openDxpContractWithPendingRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage);
        await createAmendmentPage.openManageRequest();

        if (options?.assertDefaultAsap) {
            await createAmendmentPage.assertOrderPlacedScheduleDefault();
        }

        if (options?.assertAxpComment) {
            await createAmendmentPage.assertCustomerRequestCommentVisible(AXP_CUSTOMER_COMMENT);
        }

        if (options?.schedule === 'futureDate') {
            if (!options.futureDate) {
                throw new Error('futureDate is required when schedule is futureDate.');
            }
            await createAmendmentPage.setFutureDateForCustomerRequest(options.futureDate);
        }

        await createAmendmentPage.confirmCustomerRequestAcceptance();
    }

    // Click and assert Renewal Planning for Remove seats, Downgrades and Product cancellation
    async function openDxpContractAndCheckRenewalPlanningTab(
        page: Page,
        homePage: HomePage,
        contractsPage: ContractsPage,
        renewalPlanning: RenewalPlanningTab,
        orderNotificationsPage: OrderNotificationsPage,
        options?: {
            expectedSections?: Array<'License Removal' | 'Downgrades' | 'Product Cancellation'>;
            removeOneMotion?: boolean;
        }
    ): Promise<void> {
        await page.goto('/');
        await homePage.navigateToContracts('tps');
        await orderNotificationsPage.verifyCustomerRequestNotificationForContract(contractNumber);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);

        const sectionsToValidate = options?.expectedSections ?? ['License Removal', 'Downgrades', 'Product Cancellation'];
        await renewalPlanning.assertRenewalPlanningSectionsVisible(sectionsToValidate);

        if (options?.removeOneMotion) {
            await renewalPlanning.removeFirstRenewalPlanningMotion();
        }
    }

    test('AXP initiates Add Seats and DXP completes with Generate Pricing and Place Order @DXP-T134 @DXP-T137 @DXP-T170', async ({
        page, homePage, contractsPage, createAmendmentPage, amendmentSummaryPage, contractHistoryPage,
        axpAmendmentPage, axpContractPage, orderNotificationsPage, summaryScreenPage }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('addSeats');
        await axpAmendmentPage.setQuantity(5);
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await openDxpContractAndAcceptRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage, {
            schedule: 'orderPlaced',
            assertDefaultAsap: true,
            assertAxpComment: true,
        });

        const poNumber = `CustInit_${Date.now()}`;
        await amendmentSummaryPage.completeAmendmentByGeneratePricingAndPlaceOrder(poNumber);
        await amendmentSummaryPage.verifyAmendmentProgressStatus('Amendment in Progress');
        await amendmentSummaryPage.clickBacktoContract();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await contractHistoryPage.verifyContractHistory_CustomerRequestAccepted();
        await contractHistoryPage.verifyCustomerRequestHistoryMetadataVisible();
    });

    test('AXP initiates partial upgrade and DXP completes with Place Order @DXP-T135 @DXP-T138 @DXP-T144 @DXP-T145', async ({
        page, homePage, contractsPage, createAmendmentPage, amendmentSummaryPage,
        axpAmendmentPage, commonSqlQueries, regeneratePricingPage, axpContractPage, orderNotificationsPage, summaryScreenPage }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        const upgradePath = await axpAmendmentPage.selectFirstAvailableUpgradePath();
        test.skip(!upgradePath, `No valid upgrade path available for contract ${contractNumber}`);
        console.log(`AXP upgrade path selected: ${upgradePath!.sourceSubscription} -> ${upgradePath!.targetSubscription}`);

        await axpAmendmentPage.setQuantity(1);
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await openDxpContractAndAcceptRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage, {
            schedule: 'orderPlaced',
            assertDefaultAsap: true,
        });

        // The following will become deprecated once this is implemented https://jira.trimble.tools/browse/DXP-1183
        const externalQuoteId = await commonSqlQueries.getExternalQuoteIdByContractIdForAMENDMENT_DRAFT(contractGuid);
        const lastPriceUpdatedDate = await commonSqlQueries.getLastPriceUpdatedDateForExternalQuoteId(externalQuoteId);
        const rowsAffected = await commonSqlQueries.updateLastPriceUpdatedDateHoursBack(externalQuoteId, lastPriceUpdatedDate, 24);
        if (rowsAffected === 0) {
            throw new Error(`Failed to stale pricing timestamp for quote ${externalQuoteId}.`);
        }

        await page.reload();
        await regeneratePricingPage.assertregeneratePricingBannerInAmendmentSummaryScreen();
        await regeneratePricingPage.verifyQuoteIdIsShownInregeneratePricingBanner(externalQuoteId);
        await regeneratePricingPage.clickOnregeneratePriceButtonInAmendmentSummaryScreen();
        await amendmentSummaryPage.visibilityOfPlaceOrderButton();

        const poNumber = `CustInit_${Date.now()}`;
        await amendmentSummaryPage.completeAmendmentByGeneratePricingAndPlaceOrder(poNumber);
        await amendmentSummaryPage.verifyAmendmentProgressStatus('Amendment in Progress');
    });

    test('AXP initiates full upgrade and DXP accepts then discards draft @DXP-T136 @DXP-T142 @DXP-T143', async ({
        page, homePage, contractsPage, createAmendmentPage, amendmentSummaryPage,
        axpAmendmentPage, axpContractPage, orderNotificationsPage, summaryScreenPage }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        const upgradePath = await axpAmendmentPage.selectFirstAvailableUpgradePath();
        test.skip(!upgradePath, `No valid upgrade path available for contract ${contractNumber}`);
        console.log(`AXP upgrade path selected: ${upgradePath!.sourceSubscription} -> ${upgradePath!.targetSubscription}`);

        await axpAmendmentPage.setQuantityToAllAvailable();
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await openDxpContractWithPendingRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage);

        await createAmendmentPage.openManageRequest();
        await createAmendmentPage.cancelCustomerRequestReview();
        await createAmendmentPage.assertCustomerRequestBannerVisible();
        await createAmendmentPage.assertManageRequestButtonVisible();

        await createAmendmentPage.openManageRequest();
        await createAmendmentPage.assertOrderPlacedScheduleDefault();
        await createAmendmentPage.confirmCustomerRequestAcceptance();

        const poNumber = `CustInit_${Date.now()}`;
        await amendmentSummaryPage.completeAmendmentByGeneratePricingAndPlaceOrder(poNumber, 'discardDraft');
        await createAmendmentPage.verificationOfAmendContractButton();
    });

    test('AXP initiates amendment and DXP declines request @DXP-T153 @DXP-T113 @DXP-T114 @DXP-T1305 @DXP-T1304', async ({
        page, homePage, contractsPage, createAmendmentPage, contractHistoryPage,
        axpAmendmentPage, axpContractPage, orderNotificationsPage, summaryScreenPage }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('addSeats');
        await axpAmendmentPage.setQuantity(2);
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await openDxpContractWithPendingRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage);
        await createAmendmentPage.declineCustomerInitiatedRequest('Declined by automation for validation');
        await createAmendmentPage.verificationOfAmendContractButton();
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreEnabled();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await contractHistoryPage.verifyContractHistory_CustomerRequestDeclined();
    });

    test('Dealer accepts customer request with future date - 6 days from today @DXP-T139 @DXP-T140', async ({
        page, homePage, contractsPage, createAmendmentPage, amendmentSummaryPage,
        axpAmendmentPage, contractHistoryPage, axpContractPage, orderNotificationsPage, summaryScreenPage }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('addSeats');
        await axpAmendmentPage.setQuantity(3);
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await openDxpContractAndAcceptRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage, {
            schedule: 'futureDate',
            futureDate: futureDateFromToday(6),
            assertDefaultAsap: true,
        });

        const poNumber = `CustInit_${Date.now()}`;
        await amendmentSummaryPage.completeAmendmentByGeneratePricingAndPlaceOrder(poNumber, 'discardDraft');
        await createAmendmentPage.verificationOfAmendContractButton();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await contractHistoryPage.verifyContractHistory_CustomerRequestAccepted();
    });

    test('Dealer accepts customer request with future date - boundary at 10 days @DXP-T141', async ({
        page, homePage, contractsPage, createAmendmentPage, amendmentSummaryPage,
        axpAmendmentPage, contractHistoryPage, axpContractPage, orderNotificationsPage, summaryScreenPage }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('addSeats');
        await axpAmendmentPage.setQuantity(3);
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await openDxpContractAndAcceptRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage, {
            schedule: 'futureDate',
            futureDate: futureDateFromToday(10),
            assertDefaultAsap: true,
        });

        const poNumber = `CustInit_${Date.now()}`;
        await amendmentSummaryPage.completeAmendmentByGeneratePricingAndPlaceOrder(poNumber, 'discardDraft');
        await createAmendmentPage.verificationOfAmendContractButton();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await contractHistoryPage.verifyContractHistory_CustomerRequestAccepted();
    });

    test('Auto-expire pending customer requests @DXP-T146 @DXP-T147 @DXP-455', async ({
        page, homePage, contractsPage, createAmendmentPage, commonSqlQueries,
        axpAmendmentPage, contractHistoryPage, axpContractPage, orderNotificationsPage, summaryScreenPage }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('addSeats');
        await axpAmendmentPage.setQuantity(2);
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        // Validate pending request is visible before forcing expiry in DB.
        await openDxpContractWithPendingRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage);

        const rowsAffected = await commonSqlQueries.updateCustomerInitiatedValidUntilDate(contractGuid);
        if (rowsAffected === 0) {
            throw new Error(`No positive_request rows were expired for contract ${contractGuid}.`);
        }

        await page.reload();
        await createAmendmentPage.assertCustomerRequestBannerNotVisible();
        await createAmendmentPage.assertManageRequestButtonNotVisible();
        await createAmendmentPage.verificationOfAmendContractButton();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
    });

    test('AXP initiates negative motion and DXP shows it in Renewal Planning with delete option @DXP-T115 @DXP-T175 @DXP-454', async ({
        page,
        homePage,
        contractsPage,
        createAmendmentPage,
        axpAmendmentPage,
        renewalPlanningTab,
        contractHistoryPage, axpContractPage, summaryScreenPage
    }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('removeSeats');
        await axpAmendmentPage.setQuantity(5);
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('negative');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('negative');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await page.goto('/');
        await homePage.navigateToContracts('tps');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await createAmendmentPage.assertCustomerRequestBannerNotVisible();
        await createAmendmentPage.assertManageRequestButtonNotVisible();

        await renewalPlanningTab.assertRenewalPlanningSectionsVisible(['License Removal']);
        await renewalPlanningTab.removeFirstRenewalPlanningMotion();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await renewalPlanningTab.clearOutAllRenewalPlanningTabData();
    });

    // Product Cancellation - Negative Motions
    test('AXP initiates Remove Subscription and DXP shows it in Renewal Planning with delete option @DXP-T109 @DXP-T176', async ({
        page,
        homePage,
        contractsPage,
        createAmendmentPage,
        axpAmendmentPage,
        renewalPlanningTab,
        contractHistoryPage, axpContractPage, orderNotificationsPage
    }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('removeSubscription');
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('negative');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('negative');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await page.goto('/');
        await homePage.navigateToContracts('tps');
        await orderNotificationsPage.verifyCustomerRequestNotificationForContract(contractNumber);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await createAmendmentPage.assertCustomerRequestBannerNotVisible();
        await createAmendmentPage.assertManageRequestButtonNotVisible();

        await renewalPlanningTab.assertRenewalPlanningSectionsVisible(['Product Cancellation']);
        await renewalPlanningTab.removeFirstRenewalPlanningMotion();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await renewalPlanningTab.clearOutAllRenewalPlanningTabData();
    });

    test('AXP removes one 200GB storage increment and DXP shows Product Cancellation after refresh @DXPT-1205 @DXP-T1202', async ({page,homePage,contractsPage,axpAmendmentPage,axpContractPage,
        orderNotificationsPage,
        renewalPlanningTab,
    }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-SB-SCAN-200GB');
        await axpAmendmentPage.selectAmendmentType('removeStorage');
        await axpAmendmentPage.incrementQuantityOnce();
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('negative');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('negative');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await page.goto('/');
        await homePage.navigateToContracts('tps');
        await orderNotificationsPage.verifyCustomerRequestNotificationForContract(contractNumber);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await page.reload();

        await renewalPlanningTab.assertRenewalPlanningSectionsVisible(['Product Cancellation']);
        await renewalPlanningTab.clearOutAllRenewalPlanningTabData();
    });

    // Downgrade - Negative Motions
    test('AXP initiates Full Downgrade and DXP shows it in Renewal Planning with delete option @DXP-T126', async ({
        page,
        homePage,
        contractsPage,
        createAmendmentPage,
        axpAmendmentPage,
        renewalPlanningTab,
        contractHistoryPage, axpContractPage, orderNotificationsPage
    }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('downgrade');
        await axpAmendmentPage.setQuantityToAllAvailable();
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('negative');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('negative');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await page.goto('/');
        await homePage.navigateToContracts('tps');
        await orderNotificationsPage.verifyCustomerRequestNotificationForContract(contractNumber);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await createAmendmentPage.assertCustomerRequestBannerNotVisible();
        await createAmendmentPage.assertManageRequestButtonNotVisible();
        await createAmendmentPage.verificationOfAmendContractButton();
        await renewalPlanningTab.assertRenewalPlanningSectionsVisible(['Downgrades']);
        await renewalPlanningTab.removeFirstRenewalPlanningMotion();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await renewalPlanningTab.clearOutAllRenewalPlanningTabData();
    });

    test('AXP initiates combined positive and negative motions and DXP handles both flows @DXP-T111 @DXP-T112 @DXP-451 @DXP-452 @DXP-453 @DXP-T1281 @DXP-T1282', async ({
        page,
        homePage,
        contractsPage,
        createAmendmentPage,
        axpAmendmentPage,
        renewalPlanningTab,
        contractHistoryPage, axpContractPage, orderNotificationsPage, summaryScreenPage
    }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('addSeats');
        await axpAmendmentPage.setQuantity(2);
        await axpAmendmentPage.saveAmendmentDraft();

        await axpAmendmentPage.createAnotherAmendmentButton.click();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('removeSeats');
        await axpAmendmentPage.setQuantity(1);
        await axpAmendmentPage.saveAmendmentDraft();

        await axpAmendmentPage.submitCustomerInitiatedAmendment('combined');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('combined');
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await openDxpContractAndAcceptRequest(page, homePage, contractsPage, createAmendmentPage, orderNotificationsPage, summaryScreenPage, {
            schedule: 'orderPlaced',
            assertDefaultAsap: true,
            assertAxpComment: true,
        });

        await openDxpContractAndCheckRenewalPlanningTab(page, homePage, contractsPage, renewalPlanningTab, orderNotificationsPage, {
            expectedSections: ['License Removal'],
            removeOneMotion: true,
        });
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await contractHistoryPage.verifyContractHistory_CustomerRequestAccepted();
        await renewalPlanningTab.clearOutAllRenewalPlanningTabData();
    });

    // Create a customer initiated amendment in AXP and then cancel it in AXP itself, Then verify that DXP does not show any pending request for that contract and the history shows that the request was deleted by the customer.
    test('AXP initiates amendment and then cancels it, DXP should not show pending request @DXP-T110 @DXP-T116 @DXP-T117 @DXP-T119 @DXP-458 @DXP-463', async ({
        page, homePage, contractsPage, createAmendmentPage, contractHistoryPage,
        axpAmendmentPage, axpContractPage, orderNotificationsPage, summaryScreenPage }) => {
        await axpContractPage.handleTermsAndConditionsPopup();
        await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
        await axpAmendmentPage.selectAmendmentType('addSeats');
        await axpAmendmentPage.setQuantity(2);
        await axpAmendmentPage.saveAmendmentDraft();
        await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
        await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
        await axpAmendmentPage.cancelCustomerInitiatedAmendment();
        await axpAmendmentPage.assertAmendmentCancellationSuccess();
        await closeAxpBrowserIfOpen(axpAmendmentPage);

        await page.goto('/');
        await homePage.navigateToContracts('tps');
        await orderNotificationsPage.clickOnCustomerRequestNotification(contractNumber);
        await createAmendmentPage.assertCustomerRequestBannerNotVisible();
        await createAmendmentPage.assertManageRequestButtonNotVisible();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_CustomerRequestReceived();
        await contractHistoryPage.verifyContractHistory_CustomerRequestDeletedByCustomer();
    });

});