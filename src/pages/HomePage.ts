import { expect, Locator, Page } from "@playwright/test";

type GlobalSearchOption = 'Contracts' | 'Devices' | 'Customers' | 'Dealers' | 'Invoices';

export class HomePage {

    readonly page: Page;
    readonly welcomeBackText: Locator;
    readonly accountSwitcherButton: Locator;
    readonly bpcMenuItem: Locator;
    readonly fpMenuItem: Locator;
    readonly srmMenuItem: Locator;
    readonly smsMenuItem: Locator;
    readonly kukMenuItem: Locator;
    readonly ntjvMenuItem: Locator;
    readonly sdmMenuItem: Locator;
    readonly upgMenuItem: Locator;
    readonly renewalsMenuItem: Locator;
    readonly chinadealerMenuItem: Locator;
    readonly acMenuItem: Locator;
    readonly contractsLink: Locator;
    readonly dashboardButton: Locator;
    readonly osaMenuItem: Locator;
    readonly tpsMenuItem: Locator;
    readonly allnavMenuItem: Locator;
    readonly bpaustraliaMenuItem: Locator
    readonly geosystemsMenuItem: Locator;
    readonly bpmidwestMenuItem: Locator;
    readonly bpfloridaMenuItem: Locator;
    readonly bppacificMenuItem: Locator;
    readonly bpschweizMenuItem: Locator;
    readonly bpsoutheastMenuItem: Locator;
    readonly devicesLink: Locator;
    readonly contractsHeading: Locator;
    readonly dxpAutomationMenuItem: Locator;
    readonly dxpRenewalsGKItem: Locator;
    readonly contractsTab: Locator;
    readonly devicesTab: Locator;
    readonly activeItems: Locator;
    readonly pastItems: Locator;
    readonly sortButton: Locator;
    readonly sortByLastUpdatedDate: Locator;
    readonly newestToOldest: Locator;
    readonly oldestToNewest: Locator;
    readonly newestToOldestButton: Locator;
    readonly oldestToNewestButton: Locator;
    readonly dashboardFilter: Locator;
    readonly filterByText: Locator;
    readonly dashboardCategoriesFilter: Locator;
    readonly issueswithordersFilter: Locator;
    readonly pendingActions: Locator;
    readonly expirationAndRenewals: Locator;
    readonly issueswithordersFilterCheckbox: Locator;
    readonly pendingActionsFilterCheckbox: Locator;
    readonly expirationAndRenewalsFilterCheckbox: Locator;
    readonly dashboardDateFilter: Locator;
    readonly dateFilterAll: Locator;
    readonly dateFilterLast7Days: Locator;
    readonly dateFilterLast30Days: Locator;
    readonly dateFilterLast6months: Locator;
    readonly searchByContractNumber: Locator;
    readonly customerRequestEvent: Locator;
    readonly threeDots: Locator;
    readonly ignoreButton: Locator;
    readonly noContractAlertsToShow: Locator;
    readonly issueswithTransferFilter: Locator;
    readonly scheduledTransfersFilter: Locator;
    readonly transferRequestsFilter: Locator;
    readonly issueswithTransferFilterCheckbox: Locator;
    readonly scheduledTransfersFilterCheckbox: Locator
    readonly transferRequestsFilterCheckbox: Locator;
    readonly globalSearchButton: Locator;
    readonly globalDropdownMenuButton: Locator;
    readonly contractsOptionInGlobalSearchDropdown: Locator;
    readonly devicesOptionInGlobalSearchDropdown: Locator;
    readonly customersOptionInGlobalSearchDropdown: Locator;
    readonly dealersOptionInGlobalSearchDropdown: Locator;
    readonly invoicesOptionInGlobalSearchDropdown: Locator;
    readonly globalSearchAutocompleteInput: Locator;
    readonly globalSearchResultItems: Locator;
    readonly viewAllMatchingButton: Locator;
    readonly exportTableAsCsvButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.welcomeBackText = page.getByText('Welcome back,');
        this.accountSwitcherButton = page.locator('xpath=//button[@id="dropdown-button"]/span').first();
        this.bpcMenuItem = page.getByRole('menuitem', { name: /buildingpoint canada/i }).last();
        this.fpMenuItem = page.getByRole('menuitem', { name: /frontier precision/i }).last();
        this.srmMenuItem = page.getByRole('menuitem', { name: /sitech rocky/i }).last();
        this.smsMenuItem = page.getByRole('menuitem', { name: /sms equipment/i }).last();
        this.kukMenuItem = page.getByRole('menuitem', { name: /korec/i }).last();
        this.ntjvMenuItem = page.getByRole('menuitem', { name: /ntjv|nikon/i }).last();
        this.sdmMenuItem = page.getByRole('menuitem', { name: /sitech deutschland/i }).last();
        this.upgMenuItem = page.getByRole('menuitem', { name: /ultimate positioning group/i }).last();
        this.acMenuItem = page.getByRole('menuitem', { name: /allterra/i }).last();
        this.osaMenuItem = page.getByRole('menuitem', { name: /optron/i }).last();
        this.tpsMenuItem = page.getByRole('menuitem', { name: /tamilnadu/i }).last();
        this.renewalsMenuItem = page.getByRole('menuitem', { name: /RENEWALS/i }).last();
        this.chinadealerMenuItem = page.getByRole('menuitem', { name: /ShanghaiCHINA/i }).last();
        this.dxpAutomationMenuItem = page.getByRole('menuitem', { name: /DXP Automation/i }).last();
        this.contractsLink = page.getByRole('link', { name: /contracts/i });
        this.dashboardButton = page.getByText(/dashboard/i, { exact: true }).first();
        this.allnavMenuItem = page.getByRole('menuitem', { name: /allnav/i }).last();
        this.bpaustraliaMenuItem = page.getByRole('menuitem', { name: /buildingpoint australia/i }).last();
        this.bpmidwestMenuItem = page.getByRole('menuitem', { name: /midwest/i }).last();
        this.bpfloridaMenuItem = page.getByRole('menuitem', { name: /florida/i }).last();
        this.bppacificMenuItem = page.getByRole('menuitem', { name: /pacific/i }).last();
        this.bpschweizMenuItem = page.getByRole('menuitem', { name: /schweiz/i }).last();
        this.bpsoutheastMenuItem = page.getByRole('menuitem', { name: /southeast/i }).last();
        this.geosystemsMenuItem = page.getByRole('menuitem', { name: /geosystems/i }).last();
        this.dxpRenewalsGKItem = page.getByRole('menuitem', { name: /DXP_RenewalsGopal/i }).last();
        this.devicesLink = page.getByRole('link', { name: /devices/i });
        this.contractsHeading = page.getByTestId('contracts-heading');
        this.contractsTab = page.getByRole('tab', { name: 'Contracts', exact: true }).nth(0);
        this.devicesTab = page.getByRole('tab', { name: 'Devices', exact: true }).nth(0);
        this.activeItems = page.getByLabel('Active Items').first();
        this.pastItems = page.getByRole('menu').getByRole('button', { name: 'Past Items', exact: true });
        this.activeItems = page.getByRole('button', { name: 'Active Items', exact: true, });
        this.pastItems = page.getByText('Past Items');
        this.sortButton = page.getByRole('button', { name: 'Sort by Event Date' });
        this.sortByLastUpdatedDate = page.getByText('Sort by Last Updated Date');
        this.newestToOldest = page.getByText('Newest to Oldest');
        this.oldestToNewest = page.getByText('Oldest to Newest');
        this.newestToOldestButton = page.getByRole('radio', { name: 'Newest to Oldest' });
        this.oldestToNewestButton = page.getByRole('radio', { name: 'Oldest to Newest' });
        this.dashboardFilter = page.getByRole('button', { name: 'Filter by' });
        this.filterByText = page.getByText('Filter by');
        this.dashboardCategoriesFilter = page.getByRole('button', { name: 'Categories (3)' });
        this.issueswithordersFilter = page.getByText('warningIssues with Orders');
        this.pendingActions = page.getByText('file_check_inPending Actions');
        this.expirationAndRenewals = page.getByText('timesheetExpirations and');
        this.issueswithordersFilterCheckbox = page.getByRole('checkbox', { name: 'Checkbox' }).first();
        this.pendingActionsFilterCheckbox = page.getByRole('checkbox', { name: 'Checkbox' }).nth(1);
        this.expirationAndRenewalsFilterCheckbox = page.getByRole('checkbox', { name: 'Checkbox' }).nth(2);
        this.issueswithordersFilterCheckbox = page.getByRole('checkbox', { name: /issues with orders/i });
        this.pendingActionsFilterCheckbox = page.getByRole('checkbox', { name: /pending actions/i });
        this.expirationAndRenewalsFilterCheckbox = page.getByRole('checkbox', { name: /expirations and renewals/i });
        this.dashboardDateFilter = page.getByRole('button', { name: 'Date', exact: true });
        this.dateFilterAll = page.getByRole('radio', { name: 'All', exact: true });
        this.dateFilterLast7Days = page.getByRole('radio', { name: 'Last 7 Days', exact: true });
        this.dateFilterLast30Days = page.getByRole('radio', { name: 'Last 30 Days', exact: true });
        this.dateFilterLast6months = page.getByRole('radio', { name: 'Last 6 Months', exact: true });
        this.searchByContractNumber = page.getByRole('textbox', { name: 'Search by contract number,' });
        this.customerRequestEvent = page.getByText('Customer Request');
        this.threeDots = page.locator('modus-wc-button').filter({ hasText: 'more_vertical' }).first();
        this.ignoreButton = page.getByRole('button', { name: 'Ignore' });
        this.noContractAlertsToShow = page.getByText('No contract alerts to show');
        this.issueswithTransferFilter = page.getByText('Issues with Transfer');
        this.scheduledTransfersFilter = page.getByText('Scheduled Transfers');
        this.transferRequestsFilter = page.getByText('Transfer Requests');
        this.issueswithTransferFilterCheckbox = page.getByRole('checkbox', { name: 'Checkbox' }).first();
        this.scheduledTransfersFilterCheckbox = page.getByRole('checkbox', { name: 'Checkbox' }).nth(1);
        this.transferRequestsFilterCheckbox = page.getByRole('checkbox', { name: 'Checkbox' }).nth(2);
        this.globalSearchButton = page.getByRole('button', { name: 'Search' });
        this.globalDropdownMenuButton = page.getByRole('button', { name: 'Dropdown menu button' });
        this.contractsOptionInGlobalSearchDropdown = page.getByRole('button', { name: 'Contracts' });
        this.devicesOptionInGlobalSearchDropdown = page.getByRole('button', { name: 'Devices' });
        this.customersOptionInGlobalSearchDropdown = page.getByRole('button', { name: 'Customers' });
        this.dealersOptionInGlobalSearchDropdown = page.getByRole('button', { name: 'Dealers' });
        this.invoicesOptionInGlobalSearchDropdown = page.getByRole('button', { name: 'Invoices' });
        this.globalSearchAutocompleteInput = page.getByRole('textbox', { name: 'Autocomplete input' });
        this.globalSearchResultItems = page.getByRole('menuitemradio');
        this.viewAllMatchingButton = page.getByRole('button', { name: /\d+\s+results\s+View all matching/i }).last();
        this.exportTableAsCsvButton = page.getByRole('button', { name: 'Export Table as CSV' });
    }

    async assertHomePage() {
        await this.dashboardButton.click();
        await expect(this.welcomeBackText).toBeVisible();
    }

    async verifyContractsListScreenIsVisible() {
        await expect(this.contractsHeading).toBeVisible();
        console.log('Contracts list screen is visible');
    }

    async multipleAccountsSwitcher() {
        await this.accountSwitcherButton.click();
        await expect(this.bpcMenuItem).toBeVisible();
        await this.bpcMenuItem.click();

        await this.accountSwitcherButton.click();
        await expect(this.fpMenuItem).toBeVisible();
        await this.fpMenuItem.click();
    }

    async selectAccount(dealerAccName: string) {
        await this.accountSwitcherButton.click();
        switch (dealerAccName) {
            case 'fp':
                await expect(this.fpMenuItem).toBeVisible();
                await this.fpMenuItem.click();
                break;
            case 'bpc':
                await expect(this.bpcMenuItem).toBeVisible();
                await this.bpcMenuItem.click();
                break;
        }
    }

    async navigateToContracts(dealerAccName: string) {
        switch (dealerAccName.toLowerCase()) {
            case 'fp':
                await this.accountSwitcherButton.click();
                await expect(this.fpMenuItem).toBeVisible();
                await this.fpMenuItem.click();
                break;
            case 'srm':
                await this.accountSwitcherButton.click();
                await expect(this.srmMenuItem).toBeVisible();
                await this.srmMenuItem.click();
                break;
            case 'sms':
                await this.accountSwitcherButton.click();
                await expect(this.smsMenuItem).toBeVisible();
                await this.smsMenuItem.click();
                break;
            case 'kuk':
                await this.accountSwitcherButton.click();
                await expect(this.kukMenuItem).toBeVisible();
                await this.kukMenuItem.click();
                break;
            case 'ntjv':
                await this.accountSwitcherButton.click();
                await expect(this.ntjvMenuItem).toBeVisible();
                await this.ntjvMenuItem.click();
                break;
            case 'ac':
                await this.accountSwitcherButton.click();
                await expect(this.acMenuItem).toBeVisible();
                await this.acMenuItem.click();
                break;
            case 'sdm':
                await this.accountSwitcherButton.click();
                await expect(this.sdmMenuItem).toBeVisible();
                await this.sdmMenuItem.click();
                break;
            case 'upg':
                await this.accountSwitcherButton.click();
                await expect(this.upgMenuItem).toBeVisible();
                await this.upgMenuItem.click();
                break;
            case 'osa':
                await this.accountSwitcherButton.click();
                await expect(this.osaMenuItem).toBeVisible();
                await this.osaMenuItem.click();
                break;
            case 'tps':
                await this.accountSwitcherButton.click();
                await expect(this.tpsMenuItem).toBeVisible();
                await this.tpsMenuItem.click();
                break;
            case 'renewals':
                await this.accountSwitcherButton.click();
                await expect(this.renewalsMenuItem).toBeVisible();
                await this.renewalsMenuItem.click();
                break;
            case 'chinadealer':
                await this.accountSwitcherButton.click();
                await expect(this.chinadealerMenuItem).toBeVisible();
                await this.chinadealerMenuItem.click();
                break;
            case 'dxpautomation':
                await this.accountSwitcherButton.click();
                await expect(this.dxpAutomationMenuItem).toBeVisible();
                await this.dxpAutomationMenuItem.click();
                break;
            case 'dxprenewalsgk':
                await this.accountSwitcherButton.click();
                await expect(this.dxpRenewalsGKItem).toBeVisible();
                await this.dxpRenewalsGKItem.click();
                break;
            default:
                await this.accountSwitcherButton.click();
                await expect(this.bpcMenuItem).toBeVisible();
                await this.bpcMenuItem.click();
                break;
        }

        await expect(this.contractsLink).toBeEnabled();
        await this.contractsLink.click({ timeout: 25000 });
        // Account switch can leave the contracts route mounted with an empty body (no search or grid).
        const contractsSearch = this.page.getByRole('searchbox');
        const listRendered = await contractsSearch
            .waitFor({ state: 'visible', timeout: 30000 })
            .then(() => true)
            .catch(() => false);
        if (!listRendered) {
            console.log('Contracts list did not render after opening Contracts; reloading');
            await this.page.reload();
            await expect(contractsSearch).toBeVisible({ timeout: 30000 });
        }
        console.log('User is on Contracts page of ' + dealerAccName + ' account');
    }

    async navigateToContractsSIT(dealerAccName: string) {
        switch (dealerAccName) {
            case 'allnav':
                await this.accountSwitcherButton.click();
                await expect(this.allnavMenuItem).toBeVisible();
                await this.allnavMenuItem.click();
                break;
            case 'bpc':
                await this.accountSwitcherButton.click();
                await expect(this.bpcMenuItem).toBeVisible();
                await this.bpcMenuItem.click();
                break;
            case 'bpaustralia':
                await this.accountSwitcherButton.click();
                await expect(this.bpaustraliaMenuItem).toBeVisible();
                await this.bpaustraliaMenuItem.click();
                break;
            case 'bpmidwest':
                await this.accountSwitcherButton.click();
                await expect(this.bpmidwestMenuItem).toBeVisible();
                await this.bpmidwestMenuItem.click();
                break;
            case 'bpflorida':
                await this.accountSwitcherButton.click();
                await expect(this.bpfloridaMenuItem).toBeVisible();
                await this.bpfloridaMenuItem.click();
                break;
            case 'bppacfic':
                await this.accountSwitcherButton.click();
                await expect(this.bppacificMenuItem).toBeVisible();
                await this.bppacificMenuItem.click();
                break;
            case 'bpschweiz':
                await this.accountSwitcherButton.click();
                await expect(this.bpschweizMenuItem).toBeVisible();
                await this.bpschweizMenuItem.click();
                break;
            case 'bpsoutheast':
                await this.accountSwitcherButton.click();
                await expect(this.bpsoutheastMenuItem).toBeVisible();
                await this.bpsoutheastMenuItem.click();
                break;
            case 'fp':
                await this.accountSwitcherButton.click();
                await expect(this.fpMenuItem).toBeVisible();
                await this.fpMenuItem.click();
                break;
            case 'geosystems':
                await this.accountSwitcherButton.click();
                await expect(this.geosystemsMenuItem).toBeVisible();
                await this.geosystemsMenuItem.click();
                break;
            case 'kuk':
                await this.accountSwitcherButton.click();
                await expect(this.kukMenuItem).toBeVisible();
                await this.kukMenuItem.click();
                break;
        }
        await expect(this.contractsLink).toBeEnabled();
        await this.contractsLink.click({ timeout: 25000 });
        console.log('User is on Contracts page');
    }

    async navigateToContractsPage() {
        await expect(this.contractsLink).toBeEnabled();
        await this.contractsLink.click({ timeout: 25000 });
        console.log('User is on Contracts page');
    }

    async navigateToDevicesPage() {
        await expect(this.devicesLink).toBeEnabled();
        await this.devicesLink.click({ timeout: 25000 });
        console.log('User is on Devices page');
    }

    async assertDealerDashboard() {
        await expect(this.contractsTab).toBeVisible();
        await expect(this.devicesTab).toBeVisible();
    }

    async assertActiveItemsTab() {
        await expect(this.activeItems).toBeVisible();
        await this.activeItems.click();
        await expect(this.pastItems).toBeVisible();
        await this.pastItems.click();
    }

    async assertDashboardSort() {
        await this.sortButton.click();
        await expect(this.sortByLastUpdatedDate).toBeVisible();
        await expect(this.newestToOldest).toBeVisible();
        console.log('Sort by Newest to Oldest is visible');
        await expect(this.oldestToNewest).toBeVisible();
        console.log('Sort by Oldest to Newest is visible');
        await this.oldestToNewest.click();
        console.log('Sort by Oldest to Newest is selected');
        await this.newestToOldest.click();
        console.log('Sort by Newest to Oldest is selected');
    }

    async assertDashboardCategoriesFilterContracts() {
        await this.dashboardFilter.click();
        await expect(this.filterByText).toBeVisible();
        console.log('Filter by text is visible');
        await expect(this.dashboardCategoriesFilter).toBeVisible();
        await this.dashboardCategoriesFilter.click();
        await expect(this.issueswithordersFilter).toBeVisible();
        await expect(this.pendingActions).toBeVisible();
        await expect(this.expirationAndRenewals).toBeVisible();
        console.log('All the filters are visible');
        await expect(this.issueswithordersFilterCheckbox).toBeChecked();
        console.log('Issues with Orders filter is selected');
        await expect(this.pendingActionsFilterCheckbox).toBeChecked();
        console.log('Pending Actions filter is selected');
        await expect(this.expirationAndRenewalsFilterCheckbox).toBeChecked();
        console.log('Expirations and Renewals filter is selected');
        await this.issueswithordersFilterCheckbox.click();
        console.log('Issues with Orders filter is unselected');
        await this.pendingActionsFilterCheckbox.click();
        console.log('Pending Actions filter is unselected');
        await this.expirationAndRenewalsFilterCheckbox.click();
        console.log('Expirations and Renewals filter is unselected');
    }

    async assertDashboardCategoriesFilterDevices() {
        await this.dashboardFilter.click();
        await expect(this.filterByText).toBeVisible();
        await expect(this.dashboardCategoriesFilter).toBeVisible();
        await this.dashboardCategoriesFilter.click();
        await expect(this.issueswithTransferFilter).toBeVisible();
        await expect(this.scheduledTransfersFilter).toBeVisible();
        await expect(this.transferRequestsFilter).toBeVisible();
        await expect(this.issueswithTransferFilterCheckbox).toBeChecked();
        await expect(this.scheduledTransfersFilterCheckbox).toBeChecked();
        await expect(this.transferRequestsFilterCheckbox).toBeChecked();
    }

    async assertDashboardDateFilter() {
        await this.dashboardFilter.click();
        await this.dashboardFilter.click();
        await this.dashboardDateFilter.click();
        await expect(this.dateFilterAll).toBeVisible();
        await expect(this.dateFilterLast7Days).toBeVisible();
        await expect(this.dateFilterLast30Days).toBeVisible();
        await expect(this.dateFilterLast6months).toBeVisible();
        console.log('All the date filters are visible');
        await expect(this.dateFilterAll).toBeChecked();
        await expect(this.dateFilterLast7Days).not.toBeChecked();
        await expect(this.dateFilterLast30Days).not.toBeChecked();
        await expect(this.dateFilterLast6months).not.toBeChecked();
        await this.dateFilterLast7Days.check();
        await this.dateFilterLast30Days.check();
        await this.dateFilterLast6months.check();
    }

    async selectDevicesTab() {
        await this.devicesTab.click();
        await expect(this.devicesTab).toBeVisible();
        console.log('Devices tab is selected');
    }

    async dashboardSearchFilter(contractNumber: string) {
        await expect(this.searchByContractNumber).toBeVisible();
        await this.searchByContractNumber.click();
        await this.searchByContractNumber.fill(contractNumber);
    }

    async assertCustomerRequestEventIsVisible() {
        await expect(this.customerRequestEvent).toBeVisible();
        console.log('Customer Request event is visible');
    }

    async navigateToDashboard(dealerAccName: string) {
        switch (dealerAccName.toLowerCase()) {
            case 'fp':
                await this.accountSwitcherButton.click();
                await expect(this.fpMenuItem).toBeVisible();
                await this.fpMenuItem.click();
                break;
            case 'srm':
                await this.accountSwitcherButton.click();
                await expect(this.srmMenuItem).toBeVisible();
                await this.srmMenuItem.click();
                break;
            case 'sms':
                await this.accountSwitcherButton.click();
                await expect(this.smsMenuItem).toBeVisible();
                await this.smsMenuItem.click();
                break;
            case 'kuk':
                await this.accountSwitcherButton.click();
                await expect(this.kukMenuItem).toBeVisible();
                await this.kukMenuItem.click();
                break;
            case 'ntjv':
                await this.accountSwitcherButton.click();
                await expect(this.ntjvMenuItem).toBeVisible();
                await this.ntjvMenuItem.click();
                break;
            case 'ac':
                await this.accountSwitcherButton.click();
                await expect(this.acMenuItem).toBeVisible();
                await this.acMenuItem.click();
                break;
            case 'sdm':
                await this.accountSwitcherButton.click();
                await expect(this.sdmMenuItem).toBeVisible();
                await this.sdmMenuItem.click();
                break;
            case 'upg':
                await this.accountSwitcherButton.click();
                await expect(this.upgMenuItem).toBeVisible();
                await this.upgMenuItem.click();
                break;
            case 'osa':
                await this.accountSwitcherButton.click();
                await expect(this.osaMenuItem).toBeVisible();
                await this.osaMenuItem.click();
                break;
            case 'tps':
                await this.accountSwitcherButton.click();
                await expect(this.tpsMenuItem).toBeVisible();
                await this.tpsMenuItem.click();
                break;
            case 'renewals':
                await this.accountSwitcherButton.click();
                await expect(this.renewalsMenuItem).toBeVisible();
                await this.renewalsMenuItem.click();
                break;
            case 'chinadealer':
                await this.accountSwitcherButton.click();
                await expect(this.chinadealerMenuItem).toBeVisible();
                await this.chinadealerMenuItem.click();
                break;
            case 'dxpautomation':
                await this.accountSwitcherButton.click();
                await expect(this.dxpAutomationMenuItem).toBeVisible();
                await this.dxpAutomationMenuItem.click();
                break;
            default:
                await this.accountSwitcherButton.click();
                await expect(this.bpcMenuItem).toBeVisible();
                await this.bpcMenuItem.click();
                break;
        }
        await expect(this.dashboardButton).toBeEnabled();
        await this.dashboardButton.click({ timeout: 25000 });
        console.log('User is on Dashboard page');
    }

    async assertDealerDashboardEditPermission() {
        await expect(this.threeDots).toBeVisible();
        await this.threeDots.click();
        await expect(this.ignoreButton).toBeVisible();
    }

    async assertDealerDashboardEditPermissionforTechnician() {
        await expect(this.threeDots).not.toBeVisible();
    }

    async getFirstActiveContractNumber(): Promise<string> {
        await expect(this.activeItems).toBeVisible();
        await this.activeItems.click();

        const firstEventHeading = this.page.locator('article').first().getByRole('heading').first();
        await expect(firstEventHeading).toBeVisible();

        const headingText = (await firstEventHeading.innerText()).trim();
        const match = headingText.match(/Contract\s*#\s*(\d+)/i);

        if (!match || !match[1]) {
            throw new Error(`Unable to extract contract number from first active event: "${headingText}"`);
        }

        console.log(`First active contract number: ${match[1]}`);
        return match[1];
    }

    async ignoreFirstActiveEvent() {
        await expect(this.activeItems).toBeVisible();
        await this.activeItems.click();

        const firstEventMenu = this.page.locator('article').first().locator('modus-wc-button').filter({ hasText: 'more_vertical' }).first();
        await expect(firstEventMenu).toBeVisible();
        await firstEventMenu.click();

        await expect(this.ignoreButton).toBeVisible();
        await this.ignoreButton.click();

        console.log('Ignored the first active dashboard event');
    }

    async openPastItems() {
        await expect(this.activeItems).toBeVisible();
        await this.activeItems.click();
        await expect(this.pastItems).toBeVisible();
        await this.pastItems.click();
        console.log('Opened Past Items');
    }

    async assertIgnoredContractPresentInPastItems(contractNumber: string) {
        const ignoredContract = this.page.getByRole('heading', {
            name: new RegExp(`Contract\\s*#\\s*${contractNumber}`, 'i')
        }).first();

        await expect(ignoredContract).toBeVisible();
        console.log(`Ignored contract is present in Past Items: ${contractNumber}`);
    }

    async assertNoSearchResultsInDashboardSearchFilter(contractNumber: string) {
        await this.searchByContractNumber.click();
        await this.searchByContractNumber.fill(contractNumber);
        await expect(this.noContractAlertsToShow).toBeVisible();
    }

    async globalSearchButtonClick() {
        await expect(this.globalSearchButton).toBeVisible();
        await this.globalSearchButton.click();
    }

    async clickGlobalSearchIcon() {
        await this.globalSearchButtonClick();
    }

    async openGlobalSearchDropdown() {
        await expect(this.globalDropdownMenuButton).toBeVisible();
        await this.globalDropdownMenuButton.click();
    }

    async assertGlobalSearchDropdownValues() {
        await this.openGlobalSearchDropdown();
        await expect(this.contractsOptionInGlobalSearchDropdown).toBeVisible();
        await expect(this.devicesOptionInGlobalSearchDropdown).toBeVisible();
        await expect(this.customersOptionInGlobalSearchDropdown).toBeVisible();
        await expect(this.dealersOptionInGlobalSearchDropdown).toBeVisible();
        await expect(this.invoicesOptionInGlobalSearchDropdown).toBeVisible();
        console.log('All the options in Global Search dropdown are visible');
    }

    async selectGlobalSearchDropdownOption(option: GlobalSearchOption) {
        const optionMap = {
            Contracts: this.contractsOptionInGlobalSearchDropdown,
            Devices: this.devicesOptionInGlobalSearchDropdown,
            Customers: this.customersOptionInGlobalSearchDropdown,
            Dealers: this.dealersOptionInGlobalSearchDropdown,
            Invoices: this.invoicesOptionInGlobalSearchDropdown,
        };

        if (!await optionMap[option].isVisible()) {
            await this.openGlobalSearchDropdown();
        }

        await expect(optionMap[option]).toBeVisible();
        await optionMap[option].click();
    }

    async assertGlobalSearchPlaceholder(expectedPlaceholder: string | RegExp) {
        await expect(this.globalSearchAutocompleteInput).toBeVisible();
        await expect(this.globalSearchAutocompleteInput).toHaveAttribute('placeholder', expectedPlaceholder);
    }

    async searchContractsAndAssertOnlyFirstFiveRecords(searchText: string) {
        await this.clickGlobalSearchIcon();
        await this.selectGlobalSearchDropdownOption('Contracts');

        await expect(this.globalSearchAutocompleteInput).toBeVisible();
        await this.globalSearchAutocompleteInput.fill(searchText);
        await expect(this.viewAllMatchingButton).toBeVisible();

        const totalItems = await this.globalSearchResultItems.count();
        const actualRecordCount = totalItems - 1;

        expect(actualRecordCount).toBe(5);

        for (let index = 0; index < actualRecordCount; index++) {
            const recordText = (await this.globalSearchResultItems.nth(index).innerText()).trim();
            console.log(`Global search contract record ${index + 1}: ${recordText}`);
        }

        console.log(`Displayed contract records count before View all matching: ${actualRecordCount}`);
    }

    async searchGlobalOptionAndOpenViewAllMatchingRecords(searchText: string, option: GlobalSearchOption): Promise<number> {
        if (await this.globalSearchButton.isVisible().catch(() => false)) {
            await this.clickGlobalSearchIcon();
        }

        await this.selectGlobalSearchDropdownOption(option);
        await expect(this.globalSearchAutocompleteInput).toBeVisible();
        await this.globalSearchAutocompleteInput.fill(searchText);

        const viewAllMatchingButton = this.page.getByRole('button', {
            name: /\d+\s+results\s+View all matching/i
        }).last();
        await expect(viewAllMatchingButton).toBeVisible();

        const viewAllMatchingText = await this.readStableGlobalSearchResultText(viewAllMatchingButton);
        const globalSearchResultCount = this.extractCountOrThrow(
            viewAllMatchingText,
            /(\d+)\s+results/i,
            `${option} global search result count`
        );

        await viewAllMatchingButton.click();
        return globalSearchResultCount;
    }

    async getGlobalSearchResultsPageCounts(option: GlobalSearchOption): Promise<{ resultsPageCount: number; matchingCount: number; }> {
        const resultsPageCountText = this.page.getByText(new RegExp(`${option}\\s*\\(\\d+\\)`, 'i')).first();
        const showingMatchingCountText = this.page.getByText(/Showing \d+ out of \d+ matching/i).first();

        await expect(showingMatchingCountText).toBeVisible();
        const showingMatchingText = await showingMatchingCountText.innerText();
        const matchingCount = this.extractCountOrThrow(showingMatchingText, /out of\s+(\d+)\s+matching/i, `${option} matching count`);
        let resultsPageCount = matchingCount;

        if (await resultsPageCountText.count() > 0 && await resultsPageCountText.isVisible()) {
            const resultsPageText = await resultsPageCountText.innerText();
            resultsPageCount = this.extractCountOrThrow(resultsPageText, /\((\d+)\)/, `${option} page count`);
        } else {
            console.log(`${option} page header count not found. Falling back to matching count: ${matchingCount}`);
        }

        return { resultsPageCount, matchingCount };
    }

    private async readStableGlobalSearchResultText(viewAllMatchingButton: Locator): Promise<string> {
        let previousText = '';

        for (let attempt = 0; attempt < 10; attempt++) {
            const currentText = (await viewAllMatchingButton.innerText()).trim();

            if (currentText === previousText && /\d+\s+results/i.test(currentText)) {
                return currentText;
            }

            previousText = currentText;
            await this.page.waitForTimeout(500);
        }

        return previousText;
    }

    private extractCountOrThrow(text: string, regex: RegExp, context: string): number {
        const match = text.match(regex);
        if (!match || !match[1]) {
            throw new Error(`Unable to parse ${context} from text: "${text}"`);
        }
        return Number(match[1]);
    }

    async clickFirstGlobalSearchResultAndAssertNavigation(searchText: string, option: GlobalSearchOption): Promise<void> {
        const expectedUrlPatterns: Record<GlobalSearchOption, RegExp> = {
            Contracts: /\/contracts\/[a-z0-9-]+/i,
            Customers: /\/customers\/[a-z0-9-]+/i,
            Dealers: /\/dealer-members(\/[a-z0-9-]+|\?search=)/i,
            Devices: /\/devices(\/[a-z0-9-]+|\?search=)/i,
            Invoices: /\/invoices(\/[a-z0-9-]+|\?search=)/i,
        };

        await this.clickGlobalSearchIcon();
        await this.selectGlobalSearchDropdownOption(option);
        await expect(this.globalSearchAutocompleteInput).toBeVisible();
        await this.globalSearchAutocompleteInput.fill(searchText);

        await expect(this.globalSearchResultItems.first()).toBeVisible({ timeout: 15000 });

        const firstResult = this.globalSearchResultItems.first();
        const firstResultText = (await firstResult.innerText()).trim();
        console.log(`[${option}] Clicking first result: "${firstResultText}"`);

        const urlBeforeClick = this.page.url();
        await firstResult.click();

        // Wait for URL to actually navigate away from the current page
        await this.page.waitForURL(url => url.toString() !== urlBeforeClick, { timeout: 30000 });
        await this.page.waitForLoadState('networkidle');

        const currentUrl = this.page.url();
        const expectedPattern = expectedUrlPatterns[option];

        if (expectedPattern.test(currentUrl)) {
            console.log(`[${option}] PASS — navigated to: ${currentUrl}`);
        } else {
            console.log(`[${option}] FAIL — expected URL matching ${expectedPattern}, but got: ${currentUrl}`);
            throw new Error(`[${option}] Navigation URL "${currentUrl}" did not match expected pattern ${expectedPattern}`);
        }
    }

    async searchInvoicesAndAssertExportHoverToast(searchText: string): Promise<void> {
        await this.clickGlobalSearchIcon();
        await this.selectGlobalSearchDropdownOption('Invoices');
        await expect(this.globalSearchAutocompleteInput).toBeVisible();
        await this.globalSearchAutocompleteInput.fill(searchText);

        await expect(this.globalSearchResultItems.first()).toBeVisible({ timeout: 15000 });
        const searchResultCount = await this.globalSearchResultItems.count();
        console.log(`Global search invoice results shown: ${searchResultCount}`);

        const firstInvoiceResult = this.globalSearchResultItems.first();
        const firstInvoiceResultText = (await firstInvoiceResult.innerText()).trim();
        console.log(`Clicking first invoice result: "${firstInvoiceResultText}"`);

        const urlBeforeClick = this.page.url();
        await firstInvoiceResult.click();
        await this.page.waitForURL(url => url.toString() !== urlBeforeClick, { timeout: 30000 });
        await this.page.waitForLoadState('networkidle');

        await expect(this.page).toHaveURL(/\/invoices(\/[a-z0-9-]+|\?search=)/i);
        console.log(`User navigated to invoice record/list page: ${this.page.url()}`);

        await expect(this.exportTableAsCsvButton).toBeVisible();
        const exportTableAsCsvHostButton = this.exportTableAsCsvButton.locator('xpath=ancestor::modus-wc-button[1]');
        await expect(exportTableAsCsvHostButton).toBeVisible();
        await exportTableAsCsvHostButton.hover();
        await this.assertExportNotSupportedForAllFilterMessage(exportTableAsCsvHostButton);
        console.log("Export hover validation passed: Export is not supported for 'All' filter type, choose a date range upto 1 year");
    }

    private async assertExportNotSupportedForAllFilterMessage(exportTableAsCsvHostButton: Locator): Promise<void> {
        const expectedMessagePattern = /Export is not supported.*All.*choose a date range.*1 year/i;
        const tooltipMessage = this.page.getByRole('tooltip').filter({ hasText: expectedMessagePattern }).first();

        if (await tooltipMessage.count() > 0) {
            await expect(tooltipMessage).toBeVisible();
            return;
        }

        const messageAttributes = [
            await this.exportTableAsCsvButton.getAttribute('title'),
            await this.exportTableAsCsvButton.getAttribute('aria-label'),
            await exportTableAsCsvHostButton.getAttribute('title'),
            await exportTableAsCsvHostButton.getAttribute('aria-label'),
        ]
            .filter((value): value is string => Boolean(value))
            .join(' | ');

        expect(messageAttributes).toMatch(expectedMessagePattern);
    }

    async assertGlobalSearchDropdownValuesInAllModules() {
        await this.dashboardButton.click();
        await this.assertGlobalSearchDropdownValues();
        await this.contractsLink.click();
        await this.assertGlobalSearchDropdownValues();
        await this.devicesLink.click();
        await this.assertGlobalSearchDropdownValues();
    }
}

export default HomePage;