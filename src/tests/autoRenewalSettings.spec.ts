import { test } from '../../src/fixture/TestFixture';

// This test uses stored state of multiple accounts User to validate the Dealers Home page
test.describe('This Test Validates the HomePage of DXP Portal', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach('Verify Auto Renewal Settings', async ({ page, homePage, autorenewalPage }) => {
        await page.goto('/');
        await homePage.assertHomePage();
        await autorenewalPage.verifyAutoRenewalGlobalSettings();
    });

    test('Verify global settings and Customer level override @DXP-T650,@DXP-T651,@DXP-T652', async ({ customersPage }) => {
        await customersPage.openCustomersPage();
        await customersPage.searchCustomerName('CRM Steel Detailing');
        const wasOnCRM = await customersPage.clickAutoRenewalMenuItemAndCaptureState('CRM Steel Detailing');
        console.log(`Auto-Renewal for CRM Steel Detailing toggled from ${wasOnCRM ? 'ON' : 'OFF'} to ${wasOnCRM ? 'OFF' : 'ON'}`);
        await customersPage.clearSearch();
        await customersPage.searchCustomerName('ABC');
        const wasOnABC = await customersPage.clickAutoRenewalMenuItemAndCaptureState('ABC');
        console.log(`Auto-Renewal for ABC toggled from ${wasOnABC ? 'ON' : 'OFF'} to ${wasOnABC ? 'OFF' : 'ON'}`);
    });

    test('Re-enable auto-renew for a previously disabled contract @DXP-T663', async ({ customersPage, contractsPage, homePage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
        await homePage.navigateToContracts('ac');
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName('CRM');
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength("1", "year");
        await termsPage.toggleAutoRenew(false);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertion();
        const { price, name, sku } = await productsPage.selectFirstProduct((new Date().getDate() + 100).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.fillPOReferenceNumber('AutomationPO');
        await contractsPage.placeOrderInCreateContractWorkflow();
        await contractsPage.contractDetailsTab.click();
        await contractsPage.clickAutoRenewalToggleInContractDetailsAndVerifyToast();

    });

    test('Verify Toggle is disabled for an error contract under Contract Details tab @DXP-T665', async ({ homePage, contractsPage, autorenewalPage }) => {
        await homePage.navigateToContracts('ac');
        await contractsPage.needsAttentionTab.click();
        await contractsPage.contractsLink.click();
        await contractsPage.getErrorContractAndSearchInUI();
        await contractsPage.contractDetailsTab.click();
        await autorenewalPage.verifyAutoRenewalToggleIsDisabled();
    });

    test('Verify Toggle is disabled for a Cancelled contract @DXP-T656', async ({ homePage, contractsPage, autorenewalPage }) => {
        await homePage.navigateToContracts('ac');
        await contractsPage.contractsLink.click();
        await contractsPage.getCancelledContractAndSearchInUI();
        await contractsPage.contractDetailsTab.click();
        await autorenewalPage.verifyAutoRenewalToggleIsDisabled();
    });

    test('Verify Toggle is disabled for an Expired contract under Contract Details tab @DXP-T664', async ({ homePage, contractsPage, autorenewalPage }) => {
        await homePage.selectAccount('bpc');
        await contractsPage.contractsLink.click();
        await contractsPage.getExpiredContractAndSearchInUI();
        await contractsPage.contractDetailsTab.click();
        await autorenewalPage.verifyAutoRenewalToggleIsDisabled();
    });

    test('Contract level settings should override customer and  global settings @DXP-T655', async ({ homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage, autorenewalPage }) => {
        await autorenewalPage.clickAutoRenewalToggle();
        await autorenewalPage.verifyAutoRenewalSettingsSavedToast();
        const globalAutoRenewal = await autorenewalPage.autoRenewSwitch.isChecked();
        console.log(`Global auto-renewal setting is now: ${globalAutoRenewal ? 'ON' : 'OFF'}`);
        const contractAutoRenewal = !globalAutoRenewal;
        console.log(`Setting contract-level auto-renewal to: ${contractAutoRenewal ? 'ON' : 'OFF'} — intentionally opposite of global setting`);
        await homePage.navigateToContracts('ac');
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName('CRM');
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength("1", "year");
        await termsPage.toggleAutoRenew(contractAutoRenewal);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertion();
        const { price, name, sku } = await productsPage.selectFirstProduct((new Date().getDate() + 100).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.fillPOReferenceNumber('AutomationPO');
        await summaryScreenPage.verifyProductDetails(name ?? '', sku ?? '', price ?? '');
        await contractsPage.placeOrderInCreateContractWorkflow();
    });

    test('Verify edit renewal auto-renewal on/off in edit details screen @DXP-T689', async ({ contractsPage, autorenewalPage, homePage }) => {
        await homePage.selectAccount('bpc');
        await contractsPage.contractsLink.click();
        await contractsPage.selectRenewalContractStatus('bpc');
        await autorenewalPage.verifyAutoRenewalMenuItemIsAvailableInEditDetails();
    });

    test('Verify renewal place order - we should see auto-renewal toggle in contract details screen @DXP-T690', async ({ contractsPage, autorenewalPage, homePage }) => {
        await autorenewalPage.verifyAutoRenewalGlobalSettings();
        await autorenewalPage.clickAutoRenewalToggle();
        await autorenewalPage.verifyAutoRenewalSettingsSavedToast();
        await homePage.selectAccount('bpc');
        await contractsPage.contractsLink.click();
        await contractsPage.verifyAutoRenewalAfterPlaceOrderInRenewal();
        await contractsPage.contractDetailsTab.click();
        await autorenewalPage.clickAutoRenewalToggle();
    });

    test('Verify toggle Disabled  - when renewal is in progress @DXP-T657', async ({ contractsPage, autorenewalPage }) => {
        await autorenewalPage.verifyAutoRenewalGlobalSettings();
        await autorenewalPage.clickAutoRenewalToggle();
        await autorenewalPage.verifyAutoRenewalSettingsSavedToast();
        await contractsPage.verifyAutoRenewalForRenewalInProgress();
    });
});

