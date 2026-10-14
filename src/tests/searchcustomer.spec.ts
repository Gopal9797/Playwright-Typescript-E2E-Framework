import { test } from '../fixture/TestFixture';
import testdata from '../pages/testdata.json'

// This test uses to search customer
test.describe('Search customer in DXP Portal', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("BPC");
    });
    test('Search for an CustomerAccount by Company Name', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.searchCustomersbyCompany(testdata[5].searchby_company);

    });

    test('Search for an CustomerAccount by TID', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.searchCustomersbyTID(testdata[5].searchby_tid);

    });

    test('Search for an CustomerAccount by Owner name', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.searchCustomersbyName(testdata[5].searchby_owner_name);

    });

    test('Search with no results for non existing company', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.searchCustomersbynonexistingCompany(testdata[5].searchby_noncompany);

    });

    test('Search with no results for non existing owner name', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.searchCustomersbynonexistingName(testdata[5].searchby_nonowner_name);

    });

    test('Search with no results for non existing owner email ID', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.searchCustomersbynonexistingTID(testdata[5].searchby_nontid);

    });

    test('Verify whether clear button works in Customers page', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.clearSearch(testdata[5].clear_btn);

    });

    test('Open an CustomerAccount and view contracts', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.viewContracts(testdata[5].searchby_company);

    });

    test('Account with no active contracts', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.noActiveContracts(testdata[5].noActive);

    });

    test('CustomerAccount name is a clickable link on contract summary', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.clickCustomer(testdata[5].searchby_company);

    });

    test('Navigate to customer page from Amendments screen', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.navigateTocustomerpage(testdata[5].searchby_company);

    });

    test('Customer & Dealer email has a copy icon on contract summary', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.copyEmail(testdata[5].searchby_company);

    });

    test('Draft Creation through Customer Screen', async ({ page, searchCustomer, homePage }) => {

        await searchCustomer.draftCreation(testdata[5].searchby_company);

    });


});

