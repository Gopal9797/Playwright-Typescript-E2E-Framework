import { expect } from '@playwright/test';
import { test } from '../fixture/AxpFixture';
import dealercustomers from '../pages/dealercustomers.json';
import { closeAxpBrowserIfOpen } from '../utils/axpTestHelpers';

const AXP_DXP_AUTOMATION_CUSTOMER_ID = '437d54ac-8a85-5516-be31-9ecda8de19dc';

let contract_number: number | undefined;

test.describe('Billing and Discretionary Discount', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.describe.configure({ timeout: 400000 });

    // test('Apply discretionary discount after AXP customer-initiated amendment for American Company', async ({page,homePage,contractsPage,summaryScreenPage,amendmentSummaryPage,createAmendmentPage,orderNotificationsPage,axpContractPage,axpAmendmentPage,lockRateDiscretionaryDiscount,}, testInfo) => {
    //     const activeContracts = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.dxpAutomation);
    //     if (!activeContracts || activeContracts.length === 0) {
    //         throw new Error('Database returned no active American Company contract for customer-initiated amendment flow.');
    //     }

    //     const selectedContract = activeContracts[testInfo.workerIndex % activeContracts.length];
    //     const contractNumber = String(selectedContract.contract_number);
    //     const contractGuid = String(selectedContract.id);

    //     try {
    //     await axpContractPage.goToContract(AXP_DXP_AUTOMATION_CUSTOMER_ID, contractGuid);
    //     await axpContractPage.clickCreateAmendment(contractNumber);
    //     await axpContractPage.handleTermsAndConditionsPopup();
    //     await axpAmendmentPage.selectSubscriptionBySku('BS-CAT-1M');
    //     await axpAmendmentPage.selectAmendmentType('addSeats');
    //     await axpAmendmentPage.setQuantity(2);
    //     await axpAmendmentPage.saveAmendmentDraft();
    //     await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
    //     await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');
    //     await closeAxpBrowserIfOpen(axpAmendmentPage);

    //     await page.goto('/');
    //     await homePage.navigateToDashboard('dxpautomation');
    //     await homePage.dashboardSearchFilter(contractNumber);
    //     await homePage.assertCustomerRequestEventIsVisible();
    //     await homePage.navigateToContracts('dxpautomation');
    //     await orderNotificationsPage.verifyCustomerRequestNotificationForContract(contractNumber);
    //     await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
    //     await createAmendmentPage.assertCustomerRequestBannerVisible();
    //     await createAmendmentPage.openManageRequest();
    //     await createAmendmentPage.confirmCustomerRequestAcceptance();
    //     await summaryScreenPage.clickAmendmentFromAmendmentDropdownShouldTakeToAmendmentSummaryPage();

    //     await lockRateDiscretionaryDiscount.verifyBillingAndDiscretionaryDiscountUIElements();
    //     await lockRateDiscretionaryDiscount.selectUpfrontBillingWithDiscountOption();
    //     await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
    //     await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest(
    //         'Testing discretionary discount after customer initiated amendment',
    //     );
    //     await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
    //     await lockRateDiscretionaryDiscount.clickRequestButton();
    //     await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
    //     await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountIsDisplayed();
    //     } finally {
    //         if (await lockRateDiscretionaryDiscount.withdrawRequestButton.isVisible().catch(() => false)) {
    //             await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
    //             await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
    //         }

    //         if (await amendmentSummaryPage.discardDraftButton.isVisible().catch(() => false)) {
    //             await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
    //         }
    //     }
    // });

    test.describe('Annual billing and Discretionary Discount - Contract Creation', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('2', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify Upfront Billing and Discretionary Discount withdraw workflow for 2 years contract @DXP-T666 @DXP-T687 @DXP-T623 @DXP-T625 @DXP-T626 @DXP-T627 @DXP-T640 @DXP-T642 @DXP-T645 @DXP-T636 @DXP-T646 @DXP-T634', async ({ lockRateDiscretionaryDiscount, contractsPage, contractHistoryPage, promoCodesPage }) => {
            await lockRateDiscretionaryDiscount.verifyBillingAndDiscretionaryDiscountUIElements();
            await lockRateDiscretionaryDiscount.selectUpfrontBillingWithDiscountOption();
            await lockRateDiscretionaryDiscount.enterInvalidDiscountPercentageAndVerifyErrorMessage('-1.4');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterInvalidDiscountPercentageAndVerifyErrorMessage('0.4');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterInvalidDiscountPercentageAndVerifyErrorMessage('99.5');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            // await lockRateDiscretionaryDiscount.enterReasonOver500CharactersAndVerifyRequestButtonDisabled('discretionaryDiscount');
            // await lockRateDiscretionaryDiscount.selectAnnualBillingOption();
            // await lockRateDiscretionaryDiscount.enterReasonOver500CharactersAndVerifyRequestButtonDisabled('annualBilling');
            // await lockRateDiscretionaryDiscount.selectUpfrontBillingWithDiscountOption();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest(' ');
            await lockRateDiscretionaryDiscount.clearDiscretionaryDiscountReasonTextArea();
            await lockRateDiscretionaryDiscount.verifyReasonRequiredErrorMessage();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreVisible();
            await lockRateDiscretionaryDiscount.placeOrRepriceButtonDisabled();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreRemoved();
            await lockRateDiscretionaryDiscount.placeOrderButtonEnabled();

            // Contracts history log verification.
            await contractHistoryPage.assertContractHistoryTab();
            await contractHistoryPage.verifyContractHistory_DiscretionaryDiscountRequested();
            await contractHistoryPage.verifyContractHistory_DiscretionaryDiscountRequestRemoved();

            // Discard the draft contract to keep the test data clean.
            await contractsPage.clickDraftsubscriptionTab();
            await contractsPage.discardDraftContract();
        });

        test('Verify annual Billing Discount withdraw workflow for 2 years contract @DXP-T686 @DXP-T637 @DXP-T676', async ({ lockRateDiscretionaryDiscount, contractsPage, contractHistoryPage }) => {
            await lockRateDiscretionaryDiscount.verifyBillingAndDiscretionaryDiscountUIElements();
            await lockRateDiscretionaryDiscount.selectAnnualBillingOption();
            await lockRateDiscretionaryDiscount.fillAndClearRequestFieldAndVerifyReasonRequired('annualBilling', 'Testing annual billing reason');
            await lockRateDiscretionaryDiscount.enterAnnualReasonForRequest('Testing annual billing reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForAnnualBilling();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();

            // Contracts history log verification.
            await contractHistoryPage.assertContractHistoryTab();
            await contractHistoryPage.verifyContractHistory_BillingFrequencyRequested();
            await contractHistoryPage.verifyContractHistory_BillingFrequencyChangeWithdrawn();

            // Discard the draft contract to keep the test data clean.
            await contractsPage.clickDraftsubscriptionTab();
            await contractsPage.discardDraftContract();
        });

        test('Place order and verify discretionary discount % @DXP-T1385', async ({ page, lockRateDiscretionaryDiscount, contractsPage, commonSqlQueries, summaryScreenPage }) => {
            const contractGuid = await summaryScreenPage.fetchContractGUIDFromURL();
            await lockRateDiscretionaryDiscount.verifyBillingAndDiscretionaryDiscountUIElements();
            await lockRateDiscretionaryDiscount.selectUpfrontBillingWithDiscountOption();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountIsDisplayed();
            await commonSqlQueries.updateApprovalRequestStatus(contractGuid, 'APPROVED');
            await commonSqlQueries.updateQuoteApprovalStatus(contractGuid, 'APPROVED');
            await commonSqlQueries.updateContractApprovalStatus(contractGuid, 'APPROVED');

            await page.reload();

            // Place the order and verify the discretionary discount section.
            await contractsPage.placeOrderInCreateContractWorkflow();
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountSectionIsShownWithDiscountValue('10');
        });

    });

    test.describe('discretionary discount verification for 1 year contract', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('1', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await page.waitForTimeout(30000);
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify Upfront Billing and Discretionary Discount withdraw workflow for 1 year contract', async ({ lockRateDiscretionaryDiscount, contractsPage }) => {
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountFor1YearContract();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await contractsPage.discardDraftContract();
        });

    });

    test.describe('discretionary discount verification for 1 month contract', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('1', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await page.waitForTimeout(30000);
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify Discretionary Discount withdraw workflow for 1 month contract @DXP-T806 @DXP-T639', async ({ lockRateDiscretionaryDiscount, contractsPage }) => {
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountFor1YearContract();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await contractsPage.placeOrderInCreateContractWorkflow();
        });

    });

    test.describe('R1 Renewal Contract Selection @DXP-T644 @DXP-T630 @DXP-T631 @DXP-T667 @DXP-T525', () => {
        test.beforeEach(async ({ page, homePage, contractsPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('dxprenewalsgk');

            const renewalContracts = await contractsPage.selectRenewalInitiatedContracts(dealercustomers.dxprenewalsgk_cdhID);
            if (!renewalContracts || renewalContracts.length === 0) {
                throw new Error('Database returned no R1 renewal contracts.');
            }

            const renewalContract = renewalContracts[0].contract_number_search;
            await contractsPage.searchContractWithGivenContractIDAndClickContract(renewalContract);
        });

        test('Select an existing R1 renewal contract for dxprenewalsgk', async ({ summaryScreenPage, lockRateDiscretionaryDiscount, contractHistoryPage }) => {
            await summaryScreenPage.summaryScreenPageAssertion();
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountFor1YearContract();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();

            await contractHistoryPage.assertContractHistoryTab();
            await contractHistoryPage.verifyContractHistory_DiscretionaryDiscountRequested();
            await contractHistoryPage.verifyContractHistory_DiscretionaryDiscountRequestRemoved();
        });
    });

    test.describe('Annual billing and Discretionary Discount options for 2 year contract - Contract Creation a product can be mapped to multiple countries in that case should be appeared for dealers in both countries @DXP-T809', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('2', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify Upfront Billing and Discretionary Discount withdraw workflow for 2 years contract @DXP-T623 @DXP-T625 @DXP-T626 @DXP-T627 @DXP-T640 @DXP-T642 @DXP-T645 @DXP-T636', async ({ lockRateDiscretionaryDiscount, contractsPage, contractHistoryPage, promoCodesPage }) => {
            await lockRateDiscretionaryDiscount.verifyBillingAndDiscretionaryDiscountUIElements();
            await lockRateDiscretionaryDiscount.selectUpfrontBillingWithDiscountOption();
            await lockRateDiscretionaryDiscount.enterInvalidDiscountPercentageAndVerifyErrorMessage('0.4');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterInvalidDiscountPercentageAndVerifyErrorMessage('99.5');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.fillAndClearRequestFieldAndVerifyReasonRequired('discretionaryDiscount', 'Testing upfront billing with discount reason');
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreVisible();
            await lockRateDiscretionaryDiscount.placeOrRepriceButtonDisabled();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.placeOrderButtonEnabled();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreRemoved();

            // Contracts history log verification.
            await contractHistoryPage.assertContractHistoryTab();
            await contractHistoryPage.verifyContractHistory_DiscretionaryDiscountRequested();
            await contractHistoryPage.verifyContractHistory_DiscretionaryDiscountRequestRemoved();

            // Discard the draft contract to keep the test data clean.
            await contractsPage.clickDraftsubscriptionTab();
            await contractsPage.discardDraftContract();
        });

        test('Verify annual Billing Discount withdraw workflow for 2 years contract @DXP-T686 @DXP-T667', async ({ lockRateDiscretionaryDiscount, contractsPage, contractHistoryPage }) => {
            await lockRateDiscretionaryDiscount.verifyBillingAndDiscretionaryDiscountUIElements();
            await lockRateDiscretionaryDiscount.selectAnnualBillingOption();
            await lockRateDiscretionaryDiscount.fillAndClearRequestFieldAndVerifyReasonRequired('annualBilling', 'Testing annual billing reason');
            await lockRateDiscretionaryDiscount.enterAnnualReasonForRequest('Testing annual billing reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForAnnualBilling();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();

            // Contracts history log verification.
            await contractHistoryPage.assertContractHistoryTab();
            await contractHistoryPage.verifyContractHistory_BillingFrequencyRequested();
            await contractHistoryPage.verifyContractHistory_BillingFrequencyChangeWithdrawn();

            // Discard the draft contract to keep the test data clean.
            await contractsPage.clickDraftsubscriptionTab();
            await contractsPage.discardDraftContract();
        });

    });

    test.describe('discretionary discount verification for 1 year contract @DXP-T807', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('1', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await page.waitForTimeout(30000);
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify Upfront Billing and Discretionary Discount withdraw workflow for 1 year contract', async ({ lockRateDiscretionaryDiscount, contractsPage }) => {
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountFor1YearContract();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await contractsPage.discardDraftContract();
        });

    });

    test.describe('discretionary discount verification for 1 month contract', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('1', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await page.waitForTimeout(30000);
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify Discretionary Discount withdraw workflow for 1 month contract @DXP-T806', async ({ lockRateDiscretionaryDiscount, contractsPage }) => {
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountFor1YearContract();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await contractsPage.placeOrderInCreateContractWorkflow();
        });

    });

    test.describe('Discretionary Discount and annual billing for amendment', () => {
        test.use({ storageState: '.auth/upgaccountuser.json' });
        test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage, summaryScreenPage }, testInfo) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.sms);
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
            await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
            await summaryScreenPage.summaryScreenPageAssertion();
            await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
            await createAmendmentPage.clickAmendContractButton();
            await createAmendmentPage.verificationOfCreateAmendmentPage();
            await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
            await createAmendmentPage.clickAmendmentTypeDropdown();
            await createAmendmentPage.selectAddSeatOption();
            await createAmendmentPage.EnterTheLicenseAndAssertTheValue('2', '2');
            await createAmendmentPage.clickAddToCartButton();
            await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();

        });

        test('Verify Upfront Billing and Discretionary Discount withdraw workflow for 1 year amendment @DXP-T628 @DXP-T807 @DXP-T809 @DXP-T643', async ({ lockRateDiscretionaryDiscount, amendmentSummaryPage }) => {
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountFor1YearContract();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
        });
    });

    /* Test suite for applying promocodes for lockrate and discretionary discount */
    test.describe('Apply both promocodes and discretionary discount', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('1', 'month');
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductByName('Catalyst 60');
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Enter promocode and discretionary discount @DXP-T810 @DXP-T632', async ({ promoCodesPage, lockRateDiscretionaryDiscount, contractsPage }) => {
            await promoCodesPage.enterPromoCode('50OFF_REPO');
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeIconIsDisplayedOnSuccessfulApplyOfCode();
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountFor1YearContract();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestButtonVisible();
            await lockRateDiscretionaryDiscount.verifySubmittedReasonLabelVisible();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreVisible();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreRemoved();
            await contractsPage.discardDraftContract();
        });

    });

    test.describe('verify request approved for discretionary discount', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('2', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify request approved for discretionary discount @DXP-T624 @DXP-T633 @DXP-T684', async ({ page, lockRateDiscretionaryDiscount, summaryScreenPage, commonSqlQueries, contractsPage }) => {
            const contractGuid = await summaryScreenPage.fetchContractGUIDFromURL();
            await lockRateDiscretionaryDiscount.expandBillingDiscountAccordion();
            await lockRateDiscretionaryDiscount.selectUpfrontBillingWithDiscountOption();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreVisible();

            await commonSqlQueries.updateApprovalRequestStatus(contractGuid, 'APPROVED');
            await commonSqlQueries.updateQuoteApprovalStatus(contractGuid, 'APPROVED');
            await commonSqlQueries.updateContractApprovalStatus(contractGuid, 'APPROVED');

            await page.reload();
            await lockRateDiscretionaryDiscount.verifyRequestAcceptedBadgeVisible();
            await lockRateDiscretionaryDiscount.expandBillingDiscountAccordion();
            await lockRateDiscretionaryDiscount.clickDiscretionaryDiscountRemoveButton();
            await lockRateDiscretionaryDiscount.verifyRemoveConfirmationDialog();
            await lockRateDiscretionaryDiscount.confirmRemoveApprovedDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyRequestAcceptedBadgeNotVisible();
        });

        test('Verify request rejected for discretionary discount @BUGID->DXP-2058 @DXP-T636 @DXP-T641', async ({ page, lockRateDiscretionaryDiscount, summaryScreenPage, commonSqlQueries }) => {
            const contractGuid = await summaryScreenPage.fetchContractGUIDFromURL();
            const discountPercentage = '1';
            await lockRateDiscretionaryDiscount.expandBillingDiscountAccordion();
            await lockRateDiscretionaryDiscount.selectUpfrontBillingWithDiscountOption();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue(discountPercentage);
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreVisible();

            await commonSqlQueries.updateApprovalRequestStatus(contractGuid, 'REJECTED');
            await commonSqlQueries.updateQuoteApprovalStatus(contractGuid, 'REJECTED');
            await commonSqlQueries.updateContractApprovalStatus(contractGuid, 'REJECTED');

            await page.reload();
            await lockRateDiscretionaryDiscount.verifyRequestDeclinedBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyDiscretionaryDiscountRequestDeclinedBanner(discountPercentage);
            await lockRateDiscretionaryDiscount.clickCloseButtonOnBillingFrequencyRequestDeclinedBanner();
            await lockRateDiscretionaryDiscount.verifyRequestDeclinedBadgeNotVisible();
            await lockRateDiscretionaryDiscount.verifyDiscountsAreRemoved();
        });
    });

    test.describe('verify request approved for annual billing', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('2', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify request approved for annual billing @DXP-T671', async ({ page, lockRateDiscretionaryDiscount, summaryScreenPage, commonSqlQueries }) => {
            const contractGuid = await summaryScreenPage.fetchContractGUIDFromURL();
            await lockRateDiscretionaryDiscount.expandBillingDiscountAccordion();
            await lockRateDiscretionaryDiscount.selectAnnualBillingOption();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterAnnualReasonForRequest('Testing annual billing reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();

            await commonSqlQueries.updateApprovalRequestStatus(contractGuid, 'APPROVED');
            await commonSqlQueries.updateQuoteApprovalStatus(contractGuid, 'APPROVED');
            await commonSqlQueries.updateContractApprovalStatus(contractGuid, 'APPROVED');

            await page.reload();
            await lockRateDiscretionaryDiscount.verifyRequestAcceptedBadgeVisible();
            await lockRateDiscretionaryDiscount.expandBillingDiscountAccordion();
            await lockRateDiscretionaryDiscount.clickBillingFrequencyRemoveButton();
            await lockRateDiscretionaryDiscount.verifyRequestAcceptedBadgeNotVisible();
        });

        test('Verify request rejected for annual billing @DXP-T668', async ({ page, lockRateDiscretionaryDiscount, summaryScreenPage, commonSqlQueries }) => {
            const contractGuid = await summaryScreenPage.fetchContractGUIDFromURL();
            await lockRateDiscretionaryDiscount.expandBillingDiscountAccordion();
            await lockRateDiscretionaryDiscount.selectAnnualBillingOption();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterAnnualReasonForRequest('Testing annual billing reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();

            await commonSqlQueries.updateApprovalRequestStatus(contractGuid, 'REJECTED');
            await commonSqlQueries.updateQuoteApprovalStatus(contractGuid, 'REJECTED');
            await commonSqlQueries.updateContractApprovalStatus(contractGuid, 'REJECTED');

            await page.reload();
            await lockRateDiscretionaryDiscount.verifyRequestDeclinedBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyBillingFrequencyRequestDeclinedBanner();
            await lockRateDiscretionaryDiscount.clickCloseButtonOnBillingFrequencyRequestDeclinedBanner();
            await lockRateDiscretionaryDiscount.verifyRequestDeclinedBadgeNotVisible();
        });
    });

    test.describe('Volume and Discretionary Discount - BS-TBC-SAM contract creation @DXP-T804', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts('sms');
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.sms);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength('2', 'year');
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            await productsPage.searchProductBySKU('BS-TBC-SAM');
            await productsPage.selectFirstProduct('1');
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify volume and discretionary discounts after submitting a request @DXP-T683 @DXP-T681', async ({ lockRateDiscretionaryDiscount, contractsPage }) => {
            await lockRateDiscretionaryDiscount.verifyBillingAndDiscretionaryDiscountUIElements();
            await lockRateDiscretionaryDiscount.selectUpfrontBillingWithDiscountOption();
            await lockRateDiscretionaryDiscount.enterDiscretionaryDiscountValidValue('10');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.enterUpfrontBillingWithDiscretionaryDiscountRequest('Testing upfront billing with discount reason');
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeEnabled();
            await lockRateDiscretionaryDiscount.clickRequestButton();
            await lockRateDiscretionaryDiscount.verifyPendingApprovalBadgeVisible();
            await lockRateDiscretionaryDiscount.verifyVolumeDiscountIsDisplayed();
            await lockRateDiscretionaryDiscount.withDrawRequestButtonClick();
            await lockRateDiscretionaryDiscount.confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount();
            await lockRateDiscretionaryDiscount.verifyWithdrawRequestAndPendingApprovalIsNotVisible();
            await expect(lockRateDiscretionaryDiscount.requestButton).toBeDisabled();
            await lockRateDiscretionaryDiscount.placeOrderButtonEnabled();

            // Place the order after withdrawal.
            await contractsPage.placeOrderInCreateContractWorkflow();
        });
    });
});