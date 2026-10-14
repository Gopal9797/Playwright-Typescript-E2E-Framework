import { test } from '../../src/fixture/TestFixture';
import { expect } from '@playwright/test';

test.describe('Dashboard DXP Portal', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test('Verify Dealer Dashboard @DXP-T1223 @DXP-T1230 @DXP-T1239 @DXP-T1240', async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.assertHomePage();
        await homePage.assertDealerDashboard();
        await homePage.assertActiveItemsTab();
        await homePage.assertDashboardSort();
        await homePage.assertDashboardCategoriesFilterContracts();
        await homePage.assertDashboardDateFilter();
        await homePage.assertNoSearchResultsInDashboardSearchFilter('12345');
        await page.reload();
        await homePage.assertDealerDashboardEditPermission();
        await homePage.selectDevicesTab();
        await homePage.assertActiveItemsTab();
        await homePage.assertDashboardSort();
        await homePage.assertDashboardCategoriesFilterDevices();
        await homePage.assertDashboardDateFilter();
    });

    test('Verify ignored active event is shown in Past Items @DXP-T240', async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.assertHomePage();
        const contractNumber = await homePage.getFirstActiveContractNumber();
        await homePage.ignoreFirstActiveEvent();
        await homePage.openPastItems();
        await homePage.assertIgnoredContractPresentInPastItems(contractNumber);
        console.log(`Assertion passed: ignored contract ${contractNumber} is present in Past Items`);
    });


    test.describe('Dashboard Permissions', () => {
        test.use({ storageState: '.auth/upgaccountusertechnician.json' });

        test('Verify Dealer Dashboard Permissions for Technician @DXP-T1242 @DXP-T1243', async ({ page, homePage }) => {
            await page.goto('/');
            await homePage.assertHomePage();
            await homePage.assertDealerDashboardEditPermissionforTechnician();
            await homePage.selectDevicesTab();
            //Technician will have edit permission for devices
            await homePage.assertDealerDashboardEditPermission();
        });
    });

    test.describe('Dashboard Global Search', () => {
        test.use({ storageState: '.auth/upgaccountuser.json' });

        test('Verify global search placeholder for each dropdown option @DXP-T964', async ({ page, homePage }) => {
            await page.goto('/');
            await homePage.assertHomePage();

            const dropdownOptions = [
                {
                    option: 'Contracts',
                    placeholder: /Search by contract number, company name, PO #/i,
                },
                {
                    option: 'Devices',
                    placeholder: /Search by model, part number, serial no, reference/i,
                },
                {
                    option: 'Customers',
                    placeholder: /Search by company name, user name, email/i,
                },
                {
                    option: 'Dealers',
                    placeholder: /Search by user name, email/i,
                },
                {
                    option: 'Invoices',
                    placeholder: /Search by contract number, customer name, PO #/i,
                },
            ] as const;

            for (const { option, placeholder } of dropdownOptions) {
                await homePage.clickGlobalSearchIcon();
                await homePage.selectGlobalSearchDropdownOption(option);
                await homePage.assertGlobalSearchPlaceholder(placeholder);

                const placeholderText = await homePage.globalSearchAutocompleteInput.getAttribute('placeholder');
                console.log(`${option} search placeholder: ${placeholderText}`);

                await page.goto('/');
                await page.waitForLoadState('networkidle');
            }
        });

        test('Verify global search contracts shows only first 5 records @DXP-T977 @DXP-T1174 ', async ({ page, homePage }) => {
            await page.goto('/');
            await homePage.assertHomePage();
            await homePage.searchContractsAndAssertOnlyFirstFiveRecords('1');
        });

        test('Verify clicking first global search result navigates to the correct page  @DXP-T964 @DXP-T967 @DXP-T969 @DXP-T971 @DXP-T973 @DXP-T978 @DXP-T1175', async ({ page, homePage }) => {
            await page.goto('/');
            await homePage.assertHomePage();
            const globalSearchOptions = ['Contracts', 'Customers', 'Dealers', 'Devices', 'Invoices'] as const;
            for (const option of globalSearchOptions) {
                await homePage.clickFirstGlobalSearchResultAndAssertNavigation('1', option);
                await page.goto('/');
                await page.waitForLoadState('networkidle');
            }
        });

        test("Verify invoice global search first result and export hover toast for All filter @DXP-T1172", async ({ page, homePage }) => {
            await page.goto('/');
            await homePage.assertHomePage();
            await homePage.searchInvoicesAndAssertExportHoverToast('1');
        });

        test('Verify Global Search result count matches View all matching records count for all dropdown options @DXP-T966 @DXP-T968 @DXP-T970 @DXP-T972 @DXP-T974 @DXP-T976', async ({ page, homePage }) => {
            await page.goto('/');
            await homePage.assertHomePage();
            const globalSearchOptions = ['Contracts', 'Devices', 'Customers', 'Dealers', 'Invoices'] as const;
            for (const option of globalSearchOptions) {
                const searchText = option === 'Customers' ? 'TECHNICAL SAFETY BC' : '1';
                const globalSearchResultCount = await homePage.searchGlobalOptionAndOpenViewAllMatchingRecords(searchText, option);
                const { resultsPageCount, matchingCount } = await homePage.getGlobalSearchResultsPageCounts(option);

                console.log(`${option} -> Global Search: ${globalSearchResultCount}, Results Page: ${resultsPageCount}, Matching: ${matchingCount}`);
                expect(resultsPageCount, `${option} header count`).toBe(matchingCount);
                expect(globalSearchResultCount, `${option} global search count`).toBe(matchingCount);

                await page.goto('/');
                await page.waitForLoadState('networkidle');
            }
        });
    });

});
