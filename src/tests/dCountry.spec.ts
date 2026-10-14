import { test } from '../../src/fixture/TestFixture';

test.describe('D_COUNTRY_HOLD_DEALER_AND_CUSTOMER Test cases', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    let contractNumber = '';

    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage, commonSqlQueries }) => {
        await page.goto('/');
        await homePage.navigateToContracts('chinadealer');
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName('CHINA CUSTOMER');
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength('1', 'year');
        await termsPage.toggleAutoRenew(true);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertion();
        await productsPage.selectFirstProduct((new Date().getDate()).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.fillPOReferenceNumber('AutomationPO');
        await contractsPage.placeOrderInCreateContractWorkflow();
        await contractsPage.verifyContractDetailsScreenIsVisible();
        contractNumber = await summaryScreenPage.getContractIDFromHeader();
        await commonSqlQueries.verifyStatusChangeReasonInContractDB('D_COUNTRY_HOLD_DEALER_AND_CUSTOMER', contractNumber);
        await contractsPage.clickBackToContractsLink();
        await homePage.verifyContractsListScreenIsVisible();
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await contractsPage.verifyContractDetailsScreenStatus('On Hold');
    });
    test('Verify D_COUNTRY_HOLD_DEALER_AND_CUSTOMER Banners,Review Terms and Accept it @DXP-T728 @DXP-T729 @DXP-T733 @DXP-T734 @DXP-T747 @DXP-T735 @DXP-T745', async ({ page, dCountryPage, contractsPage }) => {
        await dCountryPage.verificationOfBannerMessagesForD_COUNTRY_HOLD_DEALER_AND_CUSTOMER();
        await dCountryPage.clickReviewTermsButton();
        await dCountryPage.verificationOfIndividualForm();
        await dCountryPage.clickBackButtonOnEEUCFormAndVerifyContractScreenIsShown();
        await dCountryPage.acceptReviewTermsForEEUCEndUser();
        await dCountryPage.acceptReviewTermsForEEUCForPurchaser();
        await dCountryPage.verifyTrimbleWillReleaseTheHoldTextForPurchaserAndEndUser();
    });

      test('Verify Cancel Contract Functionality for contract in D_COUNTRY_HOLD_DEALER_AND_CUSTOMER status @DXP-T747', async ({ page, dCountryPage, contractsPage }) => {
        await dCountryPage.cancelContract();
        await contractsPage.verifyContractDetailsScreenStatus('Cancelled');
    });
});

test.describe('D_COUNTRY_HOLD_DEALER Test cases', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    let contractNumber = '';

    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage, commonSqlQueries }) => {
        await page.goto('/');
        await homePage.navigateToContracts('chinadealer');
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName('US CUSTOMER');
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength('1', 'year');
        await termsPage.toggleAutoRenew(true);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertion();
        await productsPage.selectFirstProduct((new Date().getDate()).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.fillPOReferenceNumber('AutomationPO');
        await contractsPage.placeOrderInCreateContractWorkflow();
        await contractsPage.verifyContractDetailsScreenIsVisible();
        contractNumber = await summaryScreenPage.getContractIDFromHeader();
        await commonSqlQueries.verifyStatusChangeReasonInContractDB('D_COUNTRY_HOLD_DEALER', contractNumber);
        await contractsPage.clickBackToContractsLink();
        await homePage.verifyContractsListScreenIsVisible();
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await contractsPage.verifyContractDetailsScreenStatus('On Hold');
    });

    test('Verify D_COUNTRY_HOLD_DEALER Banners,Review Terms and Accept it @DXP-T726', async ({ page, dCountryPage,contractsPage }) => {
        await dCountryPage.verificationOfBannerMessagesForD_COUNTRY_HOLD_DEALER();
         await dCountryPage.clickReviewTermsButton();
        await dCountryPage.verificationOfIndividualForm();
        await dCountryPage.clickBackButtonOnEEUCFormAndVerifyContractScreenIsShown();
        await dCountryPage.acceptReviewTermsForEEUCForPurchaser();
        await dCountryPage.verifyTrimbleWillReleaseTheHoldTextForPurchaser();
    });

    test('Verify Cancel Contract Functionality for contract in D_COUNTRY_HOLD_DEALER status @DXP-T747', async ({ page, dCountryPage, contractsPage }) => {
        await dCountryPage.cancelContract();
        await contractsPage.verifyContractDetailsScreenStatus('Cancelled');
    });
});

test.describe('D_COUNTRY_HOLD_CUSTOMER Test cases @DXP-T740 @DXP-T739', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    let contractNumber = '';

    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage, commonSqlQueries }) => {
        await page.goto('/');
        await homePage.navigateToContracts('dxpAutomation');
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName('China Corp');
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength('1', 'year');
        await termsPage.toggleAutoRenew(true);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertion();
        await productsPage.selectFirstProduct((new Date().getDate()).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.fillPOReferenceNumber('AutomationPO');
        await contractsPage.placeOrderInCreateContractWorkflow();
        await contractsPage.verifyContractDetailsScreenIsVisible();
        contractNumber = await summaryScreenPage.getContractIDFromHeader();
        await commonSqlQueries.verifyStatusChangeReasonInContractDB('D_COUNTRY_HOLD_CUSTOMER', contractNumber);
        await contractsPage.clickBackToContractsLink();
        await homePage.verifyContractsListScreenIsVisible();
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await contractsPage.verifyContractDetailsScreenStatus('On Hold');
    });

    test('Verify D_COUNTRY_HOLD_CUSTOMER Banners,Review Terms and Accept it @DXP-T727 @DXP-T744,@DXP-T746', async ({ page, dCountryPage , contractsPage}) => {
        await dCountryPage.verificationOfBannerMessagesForD_COUNTRY_HOLD_CUSTOMER();
        await dCountryPage.clickReviewTermsButton();
        await dCountryPage.verificationOfIndividualForm();
        await dCountryPage.clickBackButtonOnEEUCFormAndVerifyContractScreenIsShown();
        await dCountryPage.acceptReviewTermsForEEUCEndUser();
        await dCountryPage.verifyTrimbleWillReleaseTheHoldTextForEndUser();
    });

    test('Verify Cancel Contract Functionality for contract in D_COUNTRY_HOLD_CUSTOMER status @DXP-T747', async ({ page, dCountryPage, contractsPage }) => {
        await dCountryPage.cancelContract();
        await contractsPage.verifyContractDetailsScreenStatus('Cancelled');
    });
});