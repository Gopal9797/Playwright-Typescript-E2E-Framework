import { test } from '../../src/fixture/TestFixture';

// This test validates the invoice page
test.describe('This Test Validates the invoice page', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, invoicePage }) => {
        await page.goto('/');
        await homePage.navigateToContracts('fp');
        await invoicePage.assertInvoicePage();

    });

    test('Verify the invoice page is opened @DXP-T866', async ({ page, homePage, invoicePage }) => {
        await invoicePage.assertInvoicePage();
    });

    test('Validate the default filter for 7 days @DXP-T869', async ({ page, homePage, invoicePage }) => {
        await invoicePage.defaultFilter();
    });
    test('Validate the default filter is set to Invoice Date and Last 7 days @DXP-T868', async ({ page, homePage, invoicePage }) => {
        await invoicePage.defaultFilter();
    });

    test('Validate Switching between Invoice and Due date filter @DXP-T875', async ({ page, homePage, invoicePage }) => {
        await invoicePage.invoiceDueDateFilterSwitch();

    });
    test('Verify export to CSV option is available @DXP-T887', async ({ page, homePage, invoicePage }) => {
        await invoicePage.exportToCSV();

    });
    //Negative flow only if invoices are not found
    // test('Verify export to CSV option is disabled when no invoices are found @DXP-T903', async ({ page, homePage, invoicePage }) => {
    //     await invoicePage.exportToCSVDisabled();

    // });

    test('Verify Custom Date range selection works correctly @DXP-T874', async ({ page, homePage, invoicePage }) => {
        await invoicePage.invoiceCustomDateRangeSelection();
    });

    test('Verify Selected records export  @DXP-T894', async ({ page, homePage, invoicePage }) => {
        await invoicePage.selectedRecordsExport();
    });

    test('Verify validation/error message for date range  @DXP-T879', async ({ page, homePage, invoicePage }) => {
        await invoicePage.enterRequestedDateRange()
    });

    test('Verify last 7 day return correct data  @DXP-T870', async ({ page, homePage, invoicePage }) => {
        await invoicePage.verifyInvoiceDateRange('Last 7 days');
    });

    test('Verify last 30 days return correct data  @DXP-T871', async ({ page, homePage, invoicePage }) => {
        await invoicePage.verifyInvoiceDateRange('Last 30 days');
    });
    test('Verify last  90 days return correct data @DXP-T872', async ({ page, homePage, invoicePage }) => {
        await invoicePage.verifyInvoiceDateRange('Last 3 months');
    });
    test('Verify last 1 year return correct data  @DXP-T873', async ({ page, homePage, invoicePage }) => {

        await invoicePage.verifyInvoiceDateRange('Last 1 year');
    });
    test('Verify the maximum selectable date range is one year @DXP-T878', async ({ page, homePage, invoicePage }) => {
        await invoicePage.verifyMaximumSelectableDateRangeIsOneYear();

    });
});
