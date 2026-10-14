import { test } from '../../src/fixture/TestFixture';



test.describe('Sanity - SIT @sit-sanity', () => {
    test.use({ storageState: '.auth/sit/allaccountsuser.json' });
    test.beforeEach(async ({ page, homePage, }) => {
        await page.goto('/');
        await homePage.navigateToContracts("kuk");
    });

    test(`Contract Creation`, async ({ page, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage, orderNotificationsPage, contractHistoryPage }) => {
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.selectFirstCustomer();
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength("1", "year");
        await termsPage.toggleAutoRenew(true);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertion();
        const { price, name, sku } = await productsPage.selectFirstProduct((new Date().getDate() + 100).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPO');
        await summaryScreenPage.verifyProductDetails(name ?? '', sku ?? '', price ?? '');
        const contractID = await summaryScreenPage.getContractIDFromHeader();
        await summaryScreenPage.convertToContract();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
        await contractsPage.searchTextBox.clear();
        await page.reload();
        await orderNotificationsPage.notificationAssertionAfterContractCreation(String(contractID));
        await summaryScreenPage.verifyProductDetails(name ?? '', sku ?? '', price ?? '');
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractHistory_ContractDraftCreated();
        await contractHistoryPage.verifyContractHistory_OrderPlaced();
    });
});
