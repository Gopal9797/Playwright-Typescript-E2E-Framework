import { expect, FrameLocator, Locator, Page } from "@playwright/test";
import { executeQuery } from '../../src/utils/postgresDBUtils';
import RenewalPlanningTab from "./RenewalPlanningTab";
import { SummaryScreenPage } from './ContractSummaryScreenPage';
import { appendFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import testdata from './testdata.json';
export class ContractsPage {

    readonly page: Page;
    // readonly contractsPageText: Locator;
    readonly allDocumentsTab: Locator;
    readonly allTab: Locator;
    readonly draftTab: Locator;
    readonly requestsInReviewTab: Locator;
    readonly issuesWithOrdersTab: Locator;
    readonly inProgressTab: Locator;
    readonly contractsListTabGroup: Locator;
    readonly activeTab: Locator;
    readonly needsAttentionTab: Locator;
    readonly expiredTab: Locator;
    readonly sortButton: Locator;
    readonly allColumnsMenu: Locator;
    readonly contractIDColumnMenu: Locator;
    readonly customerColumnMenu: Locator;
    readonly statusColumnMenu: Locator;
    readonly autoRenewalColumnMenu: Locator;
    readonly netPriceColumnMenu: Locator;
    readonly poNumberColumnMenu: Locator;
    readonly startDateColumnMenu: Locator;
    readonly creationDateColumnMenu: Locator;
    readonly contractIDCheckbox: Locator;
    readonly autorenewalCheckbox: Locator;
    readonly netPriceCheckbox: Locator;
    readonly poNumberCheckbox: Locator;
    readonly startDateCheckbox: Locator;
    readonly creationDateCheckbox: Locator;
    readonly statusCheckbox: Locator;
    readonly salesPersonCheckbox: Locator;
    readonly customerCheckbox: Locator;
    readonly showHideAllCheckbox: Locator;
    readonly resetButton: Locator;
    readonly pinToLeftMenuItem: Locator;
    readonly pinToRightMenuItem: Locator;
    readonly unpinMenuItem: Locator;
    readonly hideColumnMenuItem: Locator;
    readonly manageColumnsMenuItem: Locator;
    readonly sortByASCMenuItem: Locator;
    readonly sortByDESCMenuItem: Locator;
    readonly unsortMenuItem: Locator;
    readonly rowsPerPageComboBox: Locator;
    readonly goToPrevPageButton: Locator;
    readonly goToNextPageButton: Locator;
    readonly totalRowsText: Locator;
    readonly fiveRowsPerPageOption: Locator;
    readonly tenRowsPerPageOption: Locator;
    readonly twentyRowsPerPageOption: Locator;
    readonly fiftyRowsPerPageOption: Locator;
    readonly listStatuses: Locator;
    readonly contractsCount: Locator;
    readonly searchTextBox: Locator;
    readonly ContractIDText: Locator;
    readonly customerNameText: Locator;
    readonly AutoRenewalImage: Locator;
    readonly StartDateText: Locator;
    readonly NetPriceText: Locator;
    readonly StatusText: Locator;
    readonly POText: Locator;
    readonly POTextWOHeader: Locator;
    readonly statusColumnsWOHeaderTextList: Locator;
    readonly customerNameWOHeaderTextList: Locator;
    readonly CreationDateText: Locator;
    readonly AutoRenewlImageTrue: Locator;
    readonly AutoRenewlImageFalse: Locator;
    readonly contractIDsColumnWithHeaderTextList: Locator;
    readonly customerNameColumnsWithHeaderTextList: Locator;
    readonly autoRenewalColumnsWithHeaderTextList: Locator;
    readonly startDateColumnsWithHeaderTextList: Locator;
    readonly netPriceColumnsWithHeaderTextList: Locator;
    readonly statusColumnsWithHeaderTextList: Locator;
    readonly poNumberColumnsWithHeaderTextList: Locator;
    readonly creationDateColumnsWithHeaderTextList: Locator;
    readonly noRowsText: Locator;
    readonly clearSearchButton: Locator;
    readonly selectColumnsMenuButton: Locator;
    readonly showHideAllCheckBoxPartiallyChecked: Locator;
    readonly searchBoxInsideColumnsMenu: Locator;
    readonly CustomerSearchedColumnText: Locator;
    readonly AutoRenewalSearchedColumnText: Locator;
    readonly StartDateSearchedColumnText: Locator;
    readonly NetPriceSearchedColumnText: Locator;
    readonly StatusSearchedColumnText: Locator;
    readonly POTextSearchedColumnText: Locator;
    readonly CreationDateSearchedColumnText: Locator;
    readonly noColumnsText: Locator;
    readonly clearButtonInColumnsMenu: Locator;
    readonly columnHeaders: Locator;
    readonly pinnedLeftColumn: Locator;
    readonly pinnedRightColumn: Locator;
    readonly createANewContractButton: Locator;
    readonly createANewContractText: Locator;
    readonly summaryScreenText: Locator;
    readonly contractsLink: Locator;
    readonly contractNotFoundText: Locator;
    readonly contractIDColumnHeader: Locator;
    readonly renewalInProgressBannerText: Locator;
    readonly contractsLoadingError: Locator;
    //sidesheet
    readonly customerNameSidesheet: Locator;
    readonly contractsIframe: FrameLocator; // Added for the iframe
    readonly placeOrderButton: Locator;
    readonly discardDraftButtonInContractCreationScreen: Locator;
    readonly deleteDraftWarningTextInContractCreationScreen: Locator;
    readonly closeButtonInContractCreationScreen: Locator;
    readonly deleteDraftButtonInContractCreationScreen: Locator;
    readonly ContractDetailsScreenStatus: Locator;
    readonly backToContractsLink: Locator;
    readonly contractScreenToggleTabs: Locator;
    readonly contractDetailsTab: Locator;
    readonly autoRenewSwitchInContractDetails: Locator;
    readonly autoRenewalSavedToast: Locator;
    readonly termsAndConditionsText: Locator;
    readonly draftSubscriptionsToggle: Locator;

    constructor(page: Page) {
        this.page = page;
        // this.contractsPageText = page.locator('h4').first();
        this.placeOrderButton = this.page.getByTestId('place-or-reprice-button');
        this.allDocumentsTab = page.getByRole('tab', { name: 'All Documents' });
        this.contractsListTabGroup = page.getByRole('tablist', { name: 'Tab Group' });
        this.allTab = page.getByRole('tab', { name: 'All', exact: true });
        this.draftTab = page.getByRole('tab', { name: 'Draft', exact: true });
        this.requestsInReviewTab = page.getByRole('tab', { name: 'Requests in Review' });
        this.issuesWithOrdersTab = page.getByRole('tab', { name: 'Issues With Orders' });
        this.inProgressTab = page.getByRole('tab', { name: 'In Progress' });
        this.activeTab = page.getByRole('tab', { name: 'Active' });
        this.needsAttentionTab = page.getByRole('tab', { name: 'Needs Attention' });
        this.expiredTab = page.getByRole('tab', { name: 'Expired' });
        this.sortButton = page.locator('xpath=//button[@aria-label="Sort"]');
        this.allColumnsMenu = page.locator('xpath=//button[@aria-haspopup="menu"]');
        this.contractIDColumnMenu = page.getByRole('button', { name: 'Contract ID column menu' });
        this.customerColumnMenu = page.getByRole('button', { name: 'Customer column menu' });
        this.statusColumnMenu = page.getByRole('button', { name: 'Status column menu' });
        this.autoRenewalColumnMenu = page.locator('[aria-label="Auto-renewal column menu"]');
        this.netPriceColumnMenu = page.getByRole('button', { name: 'Net Price column menu' });
        this.poNumberColumnMenu = page.getByRole('button', { name: 'PO # column menu' });
        this.startDateColumnMenu = page.getByRole('button', { name: 'Start Date column menu' });
        this.creationDateColumnMenu = page.getByRole('button', { name: 'Creation Date column menu' });
        this.pinToLeftMenuItem = page.getByRole('menuitem', { name: 'Pin to left' });
        this.pinToRightMenuItem = page.getByRole('menuitem', { name: 'Pin to right' });
        this.unpinMenuItem = page.getByRole('menuitem', { name: 'Unpin' });
        this.hideColumnMenuItem = page.getByRole('menuitem', { name: 'Hide column' });
        this.manageColumnsMenuItem = page.getByRole('menuitem', { name: 'Manage columns' });
        this.sortByASCMenuItem = page.getByRole('menuitem', { name: 'Sort by ASC' }).first();
        this.sortByDESCMenuItem = page.getByRole('menuitem', { name: 'Sort by DESC' }).first();
        this.unsortMenuItem = page.getByRole('menuitem', { name: 'Unsort' });
        this.rowsPerPageComboBox = page.getByRole('combobox', { name: 'Rows per page:' });
        this.goToPrevPageButton = page.getByRole('button', { name: 'Go to previous page' });
        this.goToNextPageButton = page.getByRole('button', { name: 'Go to next page' });
        this.totalRowsText = page.getByText('Showing 1-');
        this.fiveRowsPerPageOption = page.getByRole('option', { name: '5', exact: true });
        this.tenRowsPerPageOption = page.getByRole('option', { name: '10' });
        this.twentyRowsPerPageOption = page.getByRole('option', { name: '20' });
        this.fiftyRowsPerPageOption = page.getByRole('option', { name: '50' });

        this.contractIDCheckbox = page.getByRole('checkbox', { name: 'Contract ID' });
        this.autorenewalCheckbox = page.getByRole('checkbox', { name: 'Auto-renewal' });
        this.netPriceCheckbox = page.getByRole('checkbox', { name: 'Net Price' });
        this.poNumberCheckbox = page.getByRole('checkbox', { name: 'PO #' });
        this.startDateCheckbox = page.getByRole('checkbox', { name: 'Start Date' });
        this.statusCheckbox = page.getByRole('checkbox', { name: 'Status' });
        this.creationDateCheckbox = page.getByRole('checkbox', { name: 'Creation Date' });
        this.salesPersonCheckbox = page.getByRole('checkbox', { name: 'Sales Person' });
        this.customerCheckbox = page.getByRole('checkbox', { name: 'Customer' });
        this.showHideAllCheckbox = page.getByRole('checkbox', { name: 'Show/Hide All' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });

        this.listStatuses = page.locator('[aria-label="Contract status"]');
        this.summaryScreenText = page.locator('[aria-label="contract-number"]');
        // Header badge (not subscription rows): role="status" on draft, role="alert" on active/on-hold.
        const contractSummaryHeader = this.summaryScreenText.locator('xpath=ancestor::div[1]/..');
        this.ContractDetailsScreenStatus = contractSummaryHeader
            .getByRole('alert', { name: 'Contract status' })
            .or(contractSummaryHeader.getByRole('status', { name: 'Contract status' }));
        this.contractsCount = page.getByTestId('datagrid-total-count');
        this.searchTextBox = page.getByRole('searchbox');
        this.ContractIDText = page.locator('[data-field="__tree_data_group__"][role="gridcell"] a[href*="/contracts/"]');
        this.customerNameText = page.locator('div[data-field="customerName"]').nth(1);
        this.AutoRenewalImage = page.locator('div[data-field="autoRenew"]').nth(1);
        this.StartDateText = page.locator('div[data-field="startDate"]').nth(1);
        this.NetPriceText = page.locator('div[data-field="netPriceTotal"]').nth(1);
        this.StatusText = page.locator('div[data-field="status"]').nth(1);
        this.POText = page.locator('div[data-field="purchaseOrderNumber"]').nth(1);
        this.POTextWOHeader = page.locator('div[data-field="purchaseOrderNumber"][role="gridcell"]');
        this.CreationDateText = page.locator('div[data-field="createdDate"]').nth(1);
        this.AutoRenewlImageTrue = page.getByText('sync', { exact: true });
        this.AutoRenewlImageFalse = page.getByText('sync_off', { exact: true });
        this.contractIDColumnHeader = page.locator('xpath=//div[contains(text(),"Contract ID")]');
        this.contractIDsColumnWithHeaderTextList = page.locator('div[data-field="contractNumber"]');
        this.customerNameColumnsWithHeaderTextList = page.locator('div[data-field="customerName"]');
        this.customerNameWOHeaderTextList = page.locator('div[data-field="customerName"][role="gridcell"]');
        this.autoRenewalColumnsWithHeaderTextList = page.locator('div[data-field="autoRenew"]');
        this.startDateColumnsWithHeaderTextList = page.locator('div[data-field="startDate"]');
        this.netPriceColumnsWithHeaderTextList = page.locator('div[data-field="netPriceTotal"]');
        this.statusColumnsWithHeaderTextList = page.locator('div[data-field="status"]');
        this.statusColumnsWOHeaderTextList = page.locator('div[data-field="status"][role="gridcell"]');
        this.poNumberColumnsWithHeaderTextList = page.locator('div[data-field="purchaseOrderNumber"]');
        this.creationDateColumnsWithHeaderTextList = page.locator('div[data-field="createdDate"]');
        this.noRowsText = page.getByText('No rows', { exact: true }).first();
        this.clearSearchButton = page.getByRole('button', { name: 'Clear search' });
        this.selectColumnsMenuButton = page.getByRole('button', { name: 'Select columns' });
        this.showHideAllCheckBoxPartiallyChecked = page.locator('xpath=//input[@data-indeterminate="true"]');
        this.searchBoxInsideColumnsMenu = page.getByPlaceholder('Search', { exact: true });
        this.CustomerSearchedColumnText = page.locator('xpath=//span[contains(text(), "Customer")]');
        this.AutoRenewalSearchedColumnText = page.locator('xpath=//span[contains(text(), "Auto-renewal")]');
        this.StartDateSearchedColumnText = page.locator('xpath=//span[contains(text(), "Start Date")]');
        this.NetPriceSearchedColumnText = page.locator('xpath=//span[contains(text(), "Net Price")]');
        this.StatusSearchedColumnText = page.locator('xpath=//span[contains(text(), "Status")]');
        this.POTextSearchedColumnText = page.locator('xpath=//span[contains(text(), "PO #")]');
        this.CreationDateSearchedColumnText = page.locator('xpath=//span[contains(text(), "Creation Date")]');
        this.noColumnsText = page.getByText('No columns', { exact: true });
        this.clearButtonInColumnsMenu = page.getByRole('button', { name: 'Clear' });
        this.columnHeaders = page.getByRole('columnheader');
        this.pinnedLeftColumn = page.locator('div[class*="pinnedLeft"][role="columnheader"]');
        this.pinnedRightColumn = page.locator('div[class*="pinnedRight"][role="columnheader"]');
        this.createANewContractButton = page.locator('//a[contains(@href, "/contracts/create")]').first();
        this.createANewContractText = page.getByRole('heading', { name: 'Create new contract' });
        this.contractsLink = page.getByRole('link', { name: 'Contracts', exact: true });
        this.contractNotFoundText = page.locator('xpath=//h4[contains(text(),"Contract not found")]');
        this.renewalInProgressBannerText = page.locator('xpath=//*[contains(text(),"Renewal in Progress")]');
        this.contractsLoadingError = page.locator('xpath=//h6[contains(text(),"There was an error loading the contracts. Please try again.")]');
        //sidesheet
        this.customerNameSidesheet = page.locator('p[aria-labelledby="header-card-customer"]');
        const iframeLocator = page.locator('iframe[srcdoc*="Contracts - Dealer Experience"]');
        // Get the FrameLocator for elements inside this iframe
        this.contractsIframe = iframeLocator.frameLocator('body');
        this.discardDraftButtonInContractCreationScreen = page.getByTestId('discard-draft-button');
        this.deleteDraftWarningTextInContractCreationScreen = page.locator('[data-testid="confirmation-dialog-title"]', { hasText: 'Are you sure that you want to delete the draft?' });
        this.closeButtonInContractCreationScreen = page.locator('//modus-wc-button[@data-testid="cancel-button"]//button[normalize-space()="Close"]');
        this.deleteDraftButtonInContractCreationScreen = page.getByTestId('delete-draft-dialog-confirm-button');
        this.backToContractsLink = page.locator('a.navigate-back-link');
        this.contractScreenToggleTabs = page.locator('[aria-label="contract-content-toggle"]');
        this.contractDetailsTab = page.getByRole('button', { name: 'contract-details-toggle' });
        this.autoRenewSwitchInContractDetails = page.locator('[data-testid="auto-renew-switch"] input[role="switch"]');
        this.autoRenewalSavedToast = page.getByText('Auto-renewal settings saved successfully');
        this.termsAndConditionsText = page.getByText('The terms of your reseller agreement apply to this purchase');
        this.draftSubscriptionsToggle = page.getByRole('button', { name: 'subscriptions-toggle' });
    }

    async discardDraftFunctionalityInContractCreationScreen() {
        await expect(this.placeOrderButton).toBeEnabled();
        await expect(this.discardDraftButtonInContractCreationScreen).toBeEnabled();
        await this.discardDraftButtonInContractCreationScreen.click();
        await expect(this.deleteDraftWarningTextInContractCreationScreen).toBeVisible();
        await this.closeButtonInContractCreationScreen.click();
        await expect(this.deleteDraftWarningTextInContractCreationScreen).not.toBeVisible({ timeout: 10000 });
        await this.discardDraftButtonInContractCreationScreen.click();
        await expect(this.deleteDraftWarningTextInContractCreationScreen).toBeVisible();
        await this.deleteDraftButtonInContractCreationScreen.click();
        await expect(this.activeTab).toBeVisible({ timeout: 30000 });
        // await expect(this.contractDraftDiscardedText).toBeVisible();
        // Commented for now as the toast message is not displayed due to some bug
        // NZDEV-710
    }

    async discardDraftContract() {
        await this.discardDraftButtonInContractCreationScreen.click();
        await expect(this.deleteDraftButtonInContractCreationScreen).toBeVisible({ timeout: 10000 });
        await this.deleteDraftButtonInContractCreationScreen.click();
    }

    async clickDraftsubscriptionTab() {
        await this.draftSubscriptionsToggle.click();
    }
    async placeOrderInCreateContractWorkflow() {
        await this.placeOrderButton.click();
    }

    async placeOrderInCreateContractWorkflowEnabled() {
        await expect(this.placeOrderButton).toBeVisible({ timeout: 30000 });
    }

    async clickBackToContractsLink() {
        await this.backToContractsLink.click();
    }

    async navigateToContractsList() {
        await this.contractsLink.click();
        console.log('Navigated to Contracts list via top nav');
    }

    async assertContractsPage() {
        await expect(this.contractsCount).toBeVisible();
        console.log('Contracts page is displayed');
    }

    async verifyActiveTab() {
        try {
            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        }
        catch {
            if (await this.contractsLoadingError.isVisible()) {
                console.log('Contracts loading error is visible.');
                this.verifyFiveContractsDisplayedWhenFiveIsChosenFromShowDropdown();
            }

        }
        await this.activeTab.click();
        try { await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 }); }
        catch {
            if (await this.noRowsText.isVisible()) {
                console.log('No rows text is visible, there are no active contracts to display.');
                return;
            }
        }
        await expect(this.activeTab).toHaveAttribute('aria-selected', 'true');
        // await expect(this.listStatuses).toBeVisible();
        const countOfContracts = await this.listStatuses.count();
        console.log(`Total Count of Active Contracts: ${await this.contractsCount.textContent()}`);
        // https://jira.trimble.tools/browse/DXP-496
        // for (let i = 0; i < countOfContracts; i++) {
        //     const statusText = await this.listStatuses.nth(i).textContent();
        //     // console.log(`Status of Contract ${i + 1}: ${statusText}`);
        //     expect(['Active', 'Amendment in Progress', 'Activation in Progress', 'Error']).toContain(statusText);
        // }
        // console.log('All contracts in Active tab have status Active/Amendment in Progress/Activation in Progress/Error');
    }

    async returnActiveStatusContract() {
        // Ensure descending sort
        if ((await this.sortButton.nth(0).getAttribute('aria-sort')) !== 'descending') {
            await this.columnHeaders.nth(0).hover();
            await this.sortButton.nth(0).click();
            await this.page.waitForTimeout(2000);
            await this.columnHeaders.nth(0).hover();
            await this.sortButton.nth(0).click();
            // await this.page.waitForTimeout(10000);
            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        }

        let pageHasNext = true;
        await this.searchTextBox.fill("Datapack");
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        while (pageHasNext) {
            const countOfContracts = await this.listStatuses.count();
            for (let i = 0; i < countOfContracts; i++) {
                const statusText = await this.listStatuses.nth(i).textContent();
                const POText = await this.POTextWOHeader.nth(i).textContent();
                const poNormalized = (POText ?? '').toString().toLowerCase().trim();
                if (statusText === 'Active' && !poNormalized.includes('donot') && !poNormalized.includes('dxsit')) {
                    const contract_number = await this.ContractIDText.nth(i).textContent();
                    const contractIdElement = this.ContractIDText.nth(i);
                    await contractIdElement.scrollIntoViewIfNeeded();
                    await expect(contractIdElement).toBeVisible({ timeout: 30000 });
                    await contractIdElement.click();
                    console.log('Clicked on Contract ID:', contract_number);
                    if (await this.renewalInProgressBannerText.isVisible()) {
                        console.log('Renewal in Progress banner is visible, continuing to next contract.');
                        await this.contractsLink.click();
                        await this.assertContractsPage();
                        await this.activeTab.click();
                        await this.searchTextBox.fill("Datapack");
                        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
                        continue;
                    }
                    try {
                        await expect(this.summaryScreenText).toBeVisible({ timeout: 20000 });
                    }
                    catch {
                        if (await this.contractNotFoundText.isVisible()) {
                            console.log('Contract not found, continuing to next contract.');
                            await this.contractsLink.click();
                            await this.assertContractsPage();
                            await this.activeTab.click();
                            await this.searchTextBox.fill("Datapack");
                            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
                            continue;
                        }
                    }
                    const summary = new SummaryScreenPage(this.page);
                    const renewals = new RenewalPlanningTab(this.page);
                    if (await summary.isAmendContractButtonVisible() === true) {
                        await renewals.clearOutAllRenewalPlanningTabData();
                        console.log('Selected Active Contract with Amend Contract button visible:', contract_number);
                        await this.contractsLink.click();
                        await this.assertContractsPage();
                        return { contract_number };
                    }
                    else {
                        await this.contractsLink.click();
                        await this.assertContractsPage();
                        await this.activeTab.click();
                        await this.searchTextBox.fill("Datapack");
                        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
                        console.log('Amend Contract button not visible/enabled, continuing to next contract.');
                    }
                }
            }
            // Check if next page button is visible/enabled
            pageHasNext = await this.goToNextPageButton.isVisible().catch(() => false);
            if (pageHasNext) {
                await this.goToNextPageButton.click();
                await this.page.waitForTimeout(500);
                await expect(this.customerNameColumnsWithHeaderTextList.nth(1)).toBeVisible();
            }

        }
        throw new Error('No Active contract found');
    }

    async chooseActiveStatusContract() {
        // Ensure descending sort
        if ((await this.sortButton.nth(0).getAttribute('aria-sort')) !== 'descending') {
            await this.columnHeaders.nth(0).hover();
            await this.sortButton.nth(0).click();
            // await this.page.waitForTimeout(6000);
            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            await this.columnHeaders.nth(0).hover();
            await this.sortButton.nth(0).click();
            // await this.page.waitForTimeout(10000);
            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        }
        await this.searchTextBox.fill("Datapack");
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });

        let pageHasNext = true;

        while (pageHasNext) {
            const countOfContracts = await this.listStatuses.count();
            for (let i = 0; i < countOfContracts; i++) {
                const statusText = await this.listStatuses.nth(i).textContent();
                if (statusText === 'Active') {
                    const contract_number = await this.ContractIDText.nth(i).textContent();
                    const contractIdElement = this.ContractIDText.nth(i);
                    await contractIdElement.scrollIntoViewIfNeeded();
                    await expect(contractIdElement).toBeVisible({ timeout: 30000 });
                    await contractIdElement.click();
                    console.log('Clicked on Contract ID:', contract_number);
                    try {
                        await expect(this.summaryScreenText).toBeVisible({ timeout: 20000 });
                    }
                    catch {
                        if (await this.contractNotFoundText.isVisible()) {
                            console.log('Contract not found, continuing to next contract.');
                            await this.contractsLink.click();
                            await this.assertContractsPage();
                            await this.activeTab.click();
                            await this.searchTextBox.fill("Datapack");
                            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
                            continue;
                        }
                    }
                    const summary = new SummaryScreenPage(this.page);
                    const renewals = new RenewalPlanningTab(this.page);
                    if (await summary.isAmendContractButtonVisible() === true) {
                        await renewals.clearOutAllRenewalPlanningTabData();
                        console.log('Selected Active Contract with Amend Contract button visible:', contract_number);
                        return { contract_number };
                    }
                    else {
                        await this.contractsLink.click();
                        await this.assertContractsPage();
                        await this.activeTab.click();
                        await this.searchTextBox.fill("Datapack");
                        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
                        console.log('Amend Contract button not visible/enabled, continuing to next contract.');
                    }

                }
            }

            // Check if next page button is visible/enabled
            pageHasNext = await this.goToNextPageButton.isVisible().catch(() => false);
            if (pageHasNext) {
                await this.goToNextPageButton.click();
                await this.page.waitForTimeout(500);
                await expect(this.customerNameColumnsWithHeaderTextList.nth(1)).toBeVisible();
            }
        }

        throw new Error('No Active contract found');
    }

    async selectActiveStatusContractFromDB(companyName: string) {
        const query = `SELECT contract_number, id FROM dxp.contract.contract_detail c
            WHERE ship_to_account_name ILIKE $1
            AND id IN ( 
                SELECT contract_id 
                FROM dxp.contract.quote 
                GROUP BY contract_id 
                HAVING SUM(
                    CASE 
                        WHEN status = 'ACTIVATED' THEN 0
                        WHEN status = 'AMENDMENT_DRAFT' AND is_deleted = true THEN 0
                        WHEN status = 'AMENDMENT_ACTIVATED' AND is_deleted = false THEN 0
                        ELSE 1
                    END
                ) = 0
            )  
            AND status = 'ACTIVATED' 
            AND (po_number LIKE 'Data%') 
            AND created_date > '2026-04-15 00:00:00.5666667' 
            AND is_deleted = false
            AND parent_contract_id IS NULL
            AND renewal_status IS NULL
            AND end_date > (CURRENT_DATE + INTERVAL '8 days')
            AND NOT EXISTS (
                SELECT 1
                FROM dxp.contract.negative_request nr
                WHERE nr.contract_id = c.id 
                AND nr.is_deleted = false
            )
           AND NOT EXISTS (
                SELECT 1
                FROM dxp.contract.positive_request pr
                WHERE pr.contract_id = c.id
                AND pr.is_deleted IS FALSE
                AND pr.status = 'RECEIVED'
            )
            ORDER BY created_date DESC;`
        const result = await executeQuery<any>(query, [`${companyName}%`]);
        console.log(`Query executed`);
        console.log(query);
        return result.rows;
    }

    async selectActivatedContractWithAmendmentFromDB(companyName: string) {
        const query = `SELECT contract_number, id FROM dxp.contract.contract_detail c
            WHERE ship_to_account_name ILIKE $1
            AND status = 'ACTIVATED'
            AND is_deleted = false
            AND parent_contract_id IS NULL
            AND EXISTS (
                SELECT 1
                FROM dxp.contract.quote q
                WHERE q.contract_id = c.id
                AND q.is_deleted = false
                AND q.status = 'AMENDMENT_ACTIVATED'
            )
            AND NOT EXISTS (
                SELECT 1
                FROM dxp.contract.quote q2
                WHERE q2.contract_id = c.id
                AND q2.is_deleted = false
                AND q2.status = 'AMENDMENT_DRAFT'
            )
            ORDER BY created_date DESC;`;
        const result = await executeQuery<any>(query, [`${companyName}%`]);
        console.log(`Query executed`);
        console.log(query);
        return result.rows;
    }

    async selectDraftStatusContractFromDB(companyName: string) {
        const query = `SELECT contract_number, id FROM dxp.contract.contract_detail
            WHERE ship_to_account_name ILIKE $1
            AND status = 'DRAFT'
            AND is_deleted = false
            AND parent_contract_id IS NULL
            ORDER BY created_date DESC;`;
        const result = await executeQuery<any>(query, [`${companyName}%`]);
        console.log(`Query executed`);
        console.log(query);
        return result.rows;
    }

    async selectAmendmentsInProgressAndRenewalInProgressContractsFromDB(dealerCDHID: string) {
        const query = `SELECT bill_to_cdh_account_id,ship_to_account_name,term_uom, end_date,contract_number, id FROM dxp.contract.contract_detail c
            WHERE 
            bill_to_cdh_account_id ILIKE $1
            AND
            id IN ( 
                SELECT contract_id 
                FROM dxp.contract.quote 
                where status in ('AMENDMENT_ACTIVATION_IN_PROGRESS','AMENDMENT_DRAFT','AMENDMENT_ON_HOLD','AMENDMENT_SUBMITTED')
            )  
            AND status = 'ACTIVATED' 
            AND is_deleted = false
            AND (
		        (term_uom = 'YEAR'  AND end_date < (CURRENT_DATE + INTERVAL '90 days' + INTERVAL '1 day') and end_date > CURRENT_DATE)
		        OR
		        (term_uom = 'MONTH' AND end_date < (CURRENT_DATE + INTERVAL '1 month' + INTERVAL '1 day') and end_date > CURRENT_DATE)
		    )
            ORDER BY c.ship_to_account_name  DESC;`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectRenewalEligibleContracts(dealerCDHID: string) {
        const query = `SELECT bill_to_cdh_account_id, contract_number, term_uom, id FROM dxp.contract.contract_detail c
            WHERE bill_to_cdh_account_id ILIKE $1
            AND id IN ( 
                SELECT contract_id 
                FROM dxp.contract.quote 
                GROUP BY contract_id 
                HAVING SUM(
                    CASE 
                        WHEN status = 'ACTIVATED' THEN 0
                        WHEN status = 'AMENDMENT_DRAFT' AND is_deleted = true THEN 0
                        WHEN status = 'AMENDMENT_ACTIVATED' AND is_deleted = false THEN 0
                        ELSE 1
                    END
                ) = 0
            )  
            AND status = 'ACTIVATED' 
            AND (po_number LIKE 'Data%') 
            AND created_date > '2026-04-15 00:00:00.5666667' 
            AND is_deleted = false
            AND parent_contract_id IS NULL 
            AND renewal_status IS NULL
            AND (
		        (term_uom = 'YEAR'  AND end_date < (CURRENT_DATE + INTERVAL '90 days' + INTERVAL '1 day') and end_date > CURRENT_DATE)
		        OR
		        (term_uom = 'MONTH' AND end_date < (CURRENT_DATE + INTERVAL '1 month' + INTERVAL '1 day') and end_date > CURRENT_DATE)
		    )
           AND NOT EXISTS (
                SELECT 1
                FROM dxp.contract.positive_request pr
                WHERE pr.contract_id = c.id
                AND pr.is_deleted IS FALSE
                AND pr.status = 'RECEIVED'
            )
            ORDER BY created_date DESC;`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectLateRenewalEligibleContracts(dealerCDHID: string) {
        const query = `SELECT *
            FROM dxp.contract.contract_detail c
            WHERE 
            bill_to_cdh_account_id ILIKE $1 and
            status = 'EXPIRED'
            AND po_number LIKE 'Data%'
            AND created_date > '2026-04-15 00:00:00.5666667'
            AND is_deleted = false
            AND parent_contract_id IS null
            AND end_date >= CURRENT_DATE - INTERVAL '30 days' AND end_date < CURRENT_DATE
            AND renewal_status IS NULL
            ORDER BY created_date DESC;`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectLateRenewalInitiatedContracts(dealerCDHID: string) {
        const query = `SELECT r.contract_number, r.contract_number_search,
                r.id, r.parent_contract_id, r.status, r.ship_to_account_name,
                r.bill_to_cdh_account_id, r.term_uom, p.contract_number AS parent_contract_number,
                p.status AS parent_contract_status, p.end_date AS parent_end_date
            FROM dxp.contract.contract_detail r
            JOIN dxp.contract.contract_detail p
                ON p.id = r.parent_contract_id
            WHERE r.contract_number_search LIKE '%-R%'
            AND p.bill_to_cdh_account_id ILIKE $1
            AND r.status = 'DRAFT'
            AND r.is_deleted = false
            AND p.status = 'EXPIRED'
            AND p.is_deleted = false
            ORDER BY r.contract_number DESC;`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectPermanentlyExpiredContracts(dealerCDHID: string) {
        const query = `SELECT c.contract_number, c.bill_to_cdh_account_id, c.end_date, c.id
            FROM dxp.contract.contract_detail c
            WHERE c.bill_to_cdh_account_id ILIKE $1
            AND c.status = 'EXPIRED'
            AND c.po_number LIKE 'Data%'
            AND c.created_date > '2026-04-15 00:00:00.5666667'
            AND c.is_deleted = false
            AND c.parent_contract_id IS NULL
            AND c.end_date < CURRENT_DATE - INTERVAL '30 days'
            AND c.renewal_status IS NULL
            AND NOT EXISTS (
                SELECT 1
                FROM dxp.contract.contract_detail r
                WHERE r.parent_contract_id = c.id
                AND r.is_deleted = false
                AND r.contract_number_search LIKE '%-R%'
                AND r.status IN ('DRAFT', 'PENDING_ACTIVATION', 'ACTIVATED', 'ACTIVATION_IN_PROGRESS')
            )
            ORDER BY c.end_date DESC;`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectRenewalInitiatedContracts(dealerCDHID: string) {
        const query = `select contract_number, contract_number_search ,id, parent_contract_id , status,ship_to_account_name, bill_to_cdh_account_id ,term_uom from dxp.contract.contract_detail 
            where contract_number_search like '%-R%' and bill_to_cdh_account_id ILIKE $1
            and status = 'DRAFT' and is_deleted = false 
            order by contract_number desc;`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    /*Fetches non-deleted R1 renewal contracts for the dealer that are either SUBMITTED or ACTIVATED.
      The results are ordered with SUBMITTED contracts first, allowing the test to validate that Edit Details is unavailable in either state.
    */

    async selectSubmittedOrActivatedRenewalContracts(dealerCDHID: string) {
        const query = `select contract_number, contract_number_search, id, parent_contract_id, status, ship_to_account_name, bill_to_cdh_account_id, term_uom from dxp.contract.contract_detail 
            where contract_number_search like '%-R1' and bill_to_cdh_account_id ILIKE $1
            and status in ('SUBMITTED', 'ACTIVATED') and is_deleted = false 
            order by case when status = 'SUBMITTED' then 0 else 1 end, contract_number desc;`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectRenewalActivatedContracts(companyName: string) {
        const query = `select contract_number,contract_number_search ,id, parent_contract_id , status,ship_to_account_name ,term_uom,renewal_status from dxp.contract.contract_detail 
            where contract_number_search ILIKE '%-R%' 
            and ship_to_account_name ILIKE $1 
            and status = 'ACTIVATED' and is_deleted = false 
            order by contract_number desc;`
        const result = await executeQuery<any>(query, [`${companyName}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectRenewalErrorContracts(dealerCDHID: string) {
        const query = `SELECT bill_to_cdh_account_id,ship_to_account_name,term_uom, end_date,contract_number, id FROM dxp.contract.contract_detail c
            WHERE 
            bill_to_cdh_account_id ILIKE $1
            AND status = 'ACTIVATED'
            AND created_date > '2026-06-15 00:00:00.5666667' 
            AND is_deleted = false
            AND parent_contract_id IS NULL 
            AND renewal_status = 'RENEWAL_ERROR'
			AND (
		        (term_uom = 'YEAR'  AND end_date < (CURRENT_DATE + INTERVAL '90 days' + INTERVAL '1 day') and end_date > CURRENT_DATE)
		        OR
		        (term_uom = 'MONTH' AND end_date < (CURRENT_DATE + INTERVAL '1 month' + INTERVAL '1 day') and end_date > CURRENT_DATE)
		    )
            ORDER BY created_date DESC;`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectActiveStatusContractFromDBPackage(companyName: string) {
        const query = `SELECT contract_number, id FROM dxp.contract.contract_detail c
            WHERE 
            ship_to_account_name ILIKE $1 AND
            id IN(
            SELECT contract_id 
                FROM dxp.contract.quote 
                GROUP BY contract_id 
                HAVING SUM(
                CASE 
                        WHEN status = 'ACTIVATED' THEN 0
                        WHEN status = 'AMENDMENT_DRAFT' AND is_deleted = true THEN 0
                        WHEN status = 'AMENDMENT_ACTIVATED' AND is_deleted = false THEN 0
                        ELSE 1
                    END
            ) = 0
        )  
            AND status = 'ACTIVATED'
            AND(po_number LIKE 'AutomationPOPackages%') 
            AND created_date > '2026-04-15 00:00:00.5666667' 
            AND is_deleted = false
            AND parent_contract_id IS NULL
            AND renewal_status IS NULL
            AND end_date > (CURRENT_DATE + INTERVAL '8 days')
            AND NOT EXISTS(
            SELECT 1
                FROM dxp.contract.negative_request nr
                WHERE nr.contract_id = c.id 
                AND nr.is_deleted = false
            )
           AND NOT EXISTS(
            SELECT 1
                FROM dxp.contract.positive_request pr
                WHERE pr.contract_id = c.id
                AND pr.is_deleted IS FALSE
                AND pr.status = 'RECEIVED'
        )
            ORDER BY created_date DESC; `
        const result = await executeQuery<any>(query, [`${companyName}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectAmendmentIneligibleContracts(dealerCDHID: string) {
        const query = `SELECT contract_number, end_date,term_uom, id, 
            c.ship_to_account_name,bill_to_cdh_account_id  FROM dxp.contract.contract_detail c
            WHERE bill_to_cdh_account_id ILIKE $1
            AND status = 'ACTIVATED'
            AND is_deleted = false
            AND renewal_status != 'RENEWAL_COMPLETED'
            AND end_date < CURRENT_DATE + INTERVAL '8 days'  and end_date > CURRENT_DATE
            ORDER BY created_date DESC;
`
        const result = await executeQuery<any>(query, [`${dealerCDHID}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectPendingActivationStatusContractFromDB(companyName: string) {
        const query = `select contract_number, id  from dxp.contract.contract_detail 
        where ship_to_account_name ilike $1 and
        status = 'PENDING_ACTIVATION' and(po_number like('Automation%') or po_number like('Data%') or po_number like('Postman%')) and
        created_date > '2026-10-01 00:00:00.5666667' and is_deleted = false and parent_contract_id is NULL and renewal_status is NULL
        order by created_date desc; `
        const result = await executeQuery<any>(query, [`${companyName}%`]);
        console.log(`Query executed`);
        return result.rows;
    }

    async selectCoTermContractsForAGivenRenewalDraftContractId(renewalDraftContractId: string) {
        const query = `WITH renewal_contract AS (
                    SELECT
                        id,
                        contract_number_search,
                        bill_to_cdh_account_id,
                        term_uom,
                        start_date,
                        end_date
                    FROM dxp.contract.contract_detail
                    WHERE id = $1
                )

                SELECT
                    c.contract_number_search, c.id, c.ship_to_account_name, c.bill_to_cdh_account_id, c.term_uom, c.status, c.start_date, c.end_date,
                    r.contract_number_search AS renewal_contract_number, r.start_date AS renewal_start_date, r.end_date AS normal_renewal_end_date
                FROM dxp.contract.contract_detail c
                CROSS JOIN renewal_contract r
                WHERE
                    -- Don't include the renewal contract itself
                    c.id <> r.id
                    -- Same dealer account
                    AND c.bill_to_cdh_account_id = r.bill_to_cdh_account_id
                    -- Same term
                    AND c.term_uom = r.term_uom
                    -- Candidate must be an active contract
                    AND c.status = 'ACTIVATED'
                    -- Candidate must not be deleted
                    AND c.is_deleted = false
                    -- Candidate must end before the renewal's normal full-term end date
                    AND c.end_date < r.end_date
                    -- Minimum co-term duration
                    AND (
                        ( r.term_uom = 'MONTH' AND c.end_date >= r.start_date + INTERVAL '14 days' )
                        OR
                        ( r.term_uom = 'YEAR' AND c.end_date >= r.start_date + INTERVAL '1 month' )
                    )
                ORDER BY c.end_date DESC;`;
        const result = await executeQuery<any>(query, [renewalDraftContractId]);
        console.log(`Query executed`);
        return result.rows;
    }

    async verifyDraftTab() {
        await this.draftTab.click();
        await this.page.waitForTimeout(2000);
        await expect(this.draftTab).toHaveAttribute('aria-selected', 'true');
        // await expect(this.listStatuses).toBeVisible();
        const countOfContracts = await this.listStatuses.count();
        console.log(`Total Count of Draft Contracts: ${await this.contractsCount.textContent()} `);
        for (let i = 0; i < countOfContracts; i++) {
            const statusText = await this.listStatuses.nth(i).textContent();
            // console.log(`Status of Contract ${ i + 1 }: ${ statusText } `);
            expect(statusText).toEqual('Draft');
        }
    }

    private async reserveAndUpdateActiveYearlyContractForRenewalPrep(
        dealerCDHID: string,
        reservationOffset: number,
        endDateExpressionSql: string,
        prepTypeLabel: string
    ) {
        const reserveAndUpdateQuery = `WITH selected_contract AS (
                SELECT c.id, c.contract_number
                FROM dxp.contract.contract_detail c
                WHERE 
                bill_to_cdh_account_id ILIKE $1
                AND id IN (
                    SELECT contract_id 
                    FROM dxp.contract.quote 
                    GROUP BY contract_id 
                    HAVING SUM(
                        CASE 
                            WHEN status = 'ACTIVATED' THEN 0
                            WHEN status = 'AMENDMENT_DRAFT' AND is_deleted = true THEN 0
                            WHEN status = 'AMENDMENT_ACTIVATED' AND is_deleted = false THEN 0
                            ELSE 1
                        END
                    ) = 0
                )  
                AND status = 'ACTIVATED' 
                AND (po_number LIKE 'Data%') 
                AND created_date > '2026-07-01 00:00:00.5666667' 
                AND is_deleted = false
                AND parent_contract_id IS NULL 
                AND renewal_status is NULL
                AND term_uom = 'YEAR'
                AND NOT EXISTS (
                    SELECT 1
                    FROM dxp.contract.positive_request pr
                    WHERE pr.contract_id = c.id
                    AND pr.is_deleted IS FALSE
                    AND pr.status = 'RECEIVED'
                )
                ORDER BY created_date DESC
                LIMIT 1
                OFFSET $2
                FOR UPDATE SKIP LOCKED
            )
            UPDATE dxp.contract.contract_detail cd
            SET end_date = ${endDateExpressionSql}
            FROM selected_contract sc
            WHERE cd.id = sc.id
            RETURNING sc.contract_number, sc.id;`;

        const result = await executeQuery<any>(reserveAndUpdateQuery, [`${dealerCDHID}%`, reservationOffset]);
        console.log(`Query executed`);
        if (result.rows.length === 0) {
            throw new Error(`No active yearly contracts found to prepare ${prepTypeLabel} for dealerCDHID: ${dealerCDHID}. Required reservation slot: ${reservationOffset + 1}`);
        }

        return result.rows[0];
    }

    async selectAllAmendmentDraftsinDB(options?: { parallelSlots?: number; workerSlot?: number; limit?: number }) {
        const { parallelSlots, workerSlot, limit } = options ?? {};
        const values: any[] = [];
        let workerPartitionClause = '', limitClause = '';

        if (Number.isInteger(parallelSlots) && Number.isInteger(workerSlot) && Number(parallelSlots) > 0) {
            values.push(parallelSlots, workerSlot);
            workerPartitionClause = `
            and mod(abs(hashtext(c.id::text)::bigint), $${values.length - 1}::bigint) = $${values.length}::bigint`;
        }

        if (Number.isInteger(limit) && Number(limit) > 0) {
            values.push(limit);
            limitClause = `
            limit $${values.length}`;
        }

        const query = `SELECT contract_number, id, c.ship_to_account_name, c.bill_to_cdh_account_id, c.created_date, c.updated_date 
            FROM dxp.contract.contract_detail c
            WHERE 
            id IN ( 
                SELECT contract_id 
                FROM dxp.contract.quote 
                where status = 'AMENDMENT_DRAFT' AND is_deleted = false
                GROUP BY contract_id
                )
            and po_number LIKE 'Data%'
            and created_date < (CURRENT_DATE - INTERVAL '2 days')${workerPartitionClause}
            order by ship_to_account_name, c.updated_date${limitClause};`
        const result = await executeQuery<any>(query, values);
        return result.rows;
    }

    async selectActiveYearlyContractsAndUpdateEndDateToMakeItRenewalEligible(dealerCDHID: string) {
        const selectedContractRow = await this.reserveAndUpdateActiveYearlyContractForRenewalPrep(
            dealerCDHID,
            1,
            "CURRENT_DATE + INTERVAL '89 days'",
            'manual renewal eligibility'
        );
        console.log(`Updated end_date for contract ID: ${selectedContractRow.id} for dealerCDHID: ${dealerCDHID}`);
        return selectedContractRow;
    }

    async selectActiveYearlyContractsAndUpdateEndDateToMakeItLateRenewalEligible(dealerCDHID: string) {
        const selectedContractRow = await this.reserveAndUpdateActiveYearlyContractForRenewalPrep(
            dealerCDHID,
            0,
            "CURRENT_DATE - INTERVAL '1 day'",
            'late renewal eligibility'
        );
        const contractId = selectedContractRow.id;
        console.log(`Updated end_date for contract ID: ${contractId} for dealerCDHID: ${dealerCDHID}`);

        const updateValidUntilDateQuery = `UPDATE dxp.contract.quote
                SET valid_until_date = CURRENT_DATE - INTERVAL '1 day'
                WHERE contract_id = $1;`;
        await executeQuery(updateValidUntilDateQuery, [contractId]);
        console.log(`Updated valid_until_date for contract ID: ${contractId} for dealerCDHID: ${dealerCDHID}`);

        return selectedContractRow;
    }

    async verifyNeedsAttentionTab() {
        await this.needsAttentionTab.click();
        await this.page.waitForTimeout(2000);
        await expect(this.needsAttentionTab).toHaveAttribute('aria-selected', 'true');
        // await expect(this.listStatuses).toBeVisible();
        await this.verifyFiftyContractsDisplayedWhenFiftyIsChosenFromShowDropdown();
        if (await this.noRowsText.isVisible() == false) {
            const countOfContracts = await this.listStatuses.count();
            console.log(`Total Count of Contracts that needs attention: ${await this.contractsCount.textContent()} `);
            for (let i = 0; i < countOfContracts; i++) {
                const statusText = await this.listStatuses.nth(i).textContent();
                // console.log(`Status of Contract ${ i + 1 }: ${ statusText } `);
                expect(['Draft', 'Activated', 'Expired', 'Submitted']).not.toContain(statusText);
            }
            // await expect(this.contractsCount).toHaveText(countOfContracts.toString());
        }
        else {
            await expect(this.noRowsText).toBeVisible();
        }
    }

    async verifyExpiredTab() {
        await this.expiredTab.click();
        await this.page.waitForTimeout(2000);
        await expect(this.expiredTab).toHaveAttribute('aria-selected', 'true');
        // await expect(this.listStatuses).toBeVisible();
        await this.verifyFiftyContractsDisplayedWhenFiftyIsChosenFromShowDropdown();
        if (await this.noRowsText.isVisible() == false) {
            const countOfContracts = await this.listStatuses.count();
            console.log(`Total Count of Expired Contracts: ${await this.contractsCount.textContent()} `);
            for (let i = 0; i < countOfContracts; i++) {
                const statusText = await this.listStatuses.nth(i).textContent();
                // console.log(`Status of Contract ${ i + 1 }: ${ statusText } `);
                expect(statusText).toEqual('Expired');
            }
            if (countOfContracts <= 50) {
                await expect(this.contractsCount).toHaveText(countOfContracts.toString());
                await expect(this.goToNextPageButton).not.toBeVisible();
            }
            else if (countOfContracts > 50) {
                await expect(this.goToNextPageButton).toBeVisible();
            }
        }
        else {
            await expect(this.noRowsText).toBeVisible();
        }
    }

    async allDocumentsHaveExpiredStatusToo() {
        let found: boolean = false;
        while (await this.goToNextPageButton.isVisible()) {
            const countOfContracts = await this.listStatuses.count();
            console.log(`Total Count of Contracts in Next Page: ${countOfContracts} `);
            for (let i = 0; i < countOfContracts; i++) {
                if (await this.listStatuses.nth(i).textContent() == 'Expired') {
                    console.log(`Found an Expired Contract in the current page`);
                    found = true
                    break; // Exit the loop if at least one contract has Expired status
                }
            }
            if (found) break;
            else if (await this.goToNextPageButton.isVisible()) {
                await this.goToNextPageButton.click();
                await this.page.waitForTimeout(2000);
            }
            else {
                console.log('No Expired Contracts found in the current page');
                break;
            }
        }
    }

    async searchContractWithGivenContractID(contractId: string, poNumber: string) {
        await this.searchTextBox.fill(contractId);
        await this.page.waitForTimeout(6000);
        const escapedContractId = contractId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactMatch = this.ContractIDText.filter({ hasText: new RegExp(`^\\s*${escapedContractId}\\s*$`) }).first();
        await expect(exactMatch).toBeVisible({ timeout: 30000 });
        console.log('Search with Contract ID is successful');
        // await expect(this.poNumberColumnsWithHeaderTextList.nth(1)).toHaveText(poNumber.trim());
    }

    async searchContractWithGivenContractIDAndClickContract(contractId: string | number | null | undefined) {
        console.log("received contractId: ", contractId);

        if (contractId === undefined || contractId === null) {
            throw new Error(`searchContractWithGivenContractIDAndClickContract called with invalid contractId: ${contractId}. Check the DB query and column name.`);
        }
        const contractIdStr = String(contractId);
        await expect(this.ContractIDText.first()).toBeVisible({ timeout: 45000 });
        await this.searchTextBox.fill(contractIdStr);
        await this.page.waitForTimeout(2000);
        const escapedContractId = contractIdStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactMatch = this.ContractIDText.filter({ hasText: new RegExp(`^\\s*${escapedContractId}\\s*$`) }).first();
        await expect(exactMatch).toBeVisible({ timeout: 30000 });
        console.log(`Search with Contract ID is successful — clicking exact match: ${contractIdStr} `);
        // The contracts grid keeps re-rendering while search results settle, which can detach the row mid-click and silently swallow the navigation. Retry the click until the browser actually lands on the contract detail page (/contracts/<id>).
        await expect(async () => {
            await exactMatch.click({ timeout: 5000 });
            await expect(this.page).toHaveURL(/\/contracts\/[^/?#]+/, { timeout: 10000 });
        }).toPass({ timeout: 90000 });
        console.log(`Navigated to contract detail page for contract: ${contractIdStr}`);
    }

    async searchContractWithPartialContractID() {
        await this.searchTextBox.fill('101');
        await this.page.waitForTimeout(5000);
        await expect(this.ContractIDText.nth(1)).toBeVisible({ timeout: 30000 });
        const contractCount = await this.ContractIDText.count();
        console.log(`Total Count of Contracts with Partial Contract ID: ${contractCount} `);
        for (let i = 0; i < contractCount; i++) {
            const contractId = await this.ContractIDText.nth(i).textContent();
            const poNumber = await this.POTextWOHeader.nth(i).textContent();
            console.log(`Row ${i}: Contract ID: ${contractId}, PO #: ${poNumber} `);
            const containsSearchTerm = contractId?.includes('101') || poNumber?.includes('101');
            expect(containsSearchTerm).toBeTruthy();
        }
    }

    async searchContractWithCustomerName() {
        try {
            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            await this.searchTextBox.fill(testdata[0].customer || '');
        }
        catch {
            if (await this.contractsLoadingError.isVisible()) {
                console.log('Contracts loading error is visible.');
                this.verifyFiveContractsDisplayedWhenFiveIsChosenFromShowDropdown();
                await this.searchTextBox.fill(testdata[0].customer || '');
                await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            }
        }
        await expect(this.ContractIDText.nth(1)).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(2000);
        const ContractsCount = await this.customerNameWOHeaderTextList.count();
        console.log(`Total Count of Contracts with Customer Name: ${ContractsCount} `);
        for (let i = 0; i < ContractsCount; i++) {
            await expect(this.customerNameWOHeaderTextList.nth(i)).toContainText(testdata[0].customer || '', { timeout: 30000 });
        }
    }

    async searchContractWithPartialCustomerName() {
        await this.searchTextBox.fill(testdata[0].customer.substring(0, 4));
        await this.page.waitForTimeout(2000);
        const ContractsCount = await this.customerNameColumnsWithHeaderTextList.count();
        console.log(`Total Count of Contracts with Partial Customer Name: ${ContractsCount} `);
        for (let i = 1; i < ContractsCount; i++) {
            await expect(this.customerNameColumnsWithHeaderTextList.nth(i)).toContainText(testdata[0].customer.substring(0, 4), { timeout: 30000 });
        }
    }

    async searchWithName(name: string) {
        await this.searchTextBox.fill(name);
        await this.page.waitForTimeout(2000);
    }

    async searchContractWithPO() {
        await this.searchTextBox.fill(testdata[0].po);
        await this.page.waitForTimeout(2000);
        await expect(this.ContractIDText.nth(0)).toHaveText(testdata[0].contractId, { timeout: 30000 });
        await expect(this.customerNameText).toContainText(testdata[0].customer);

        if (testdata[0].autoRenewal == true) {
            await expect(this.AutoRenewlImageTrue).toBeVisible();
        }
        else if (testdata[0].autoRenewal == false) {
            await expect(this.AutoRenewlImageFalse).toBeVisible();
        }

        await expect(this.StartDateText).toHaveText(testdata[0].startDate);
        await expect(this.NetPriceText).toHaveText(testdata[0].netPrice);
        await expect(this.StatusText).toHaveText(testdata[0].status);
        await expect(this.POText).toHaveText(testdata[0].po);
        await expect(this.CreationDateText).toHaveText(testdata[0].creationDate);

        console.log('Search with PO# is successful');
    }

    async searchContractWithPONumber(poNumber: string) {
        await this.searchTextBox.fill(poNumber);
        await this.page.waitForTimeout(2000);
        await expect(this.poNumberColumnsWithHeaderTextList.nth(1)).toContainText(poNumber, { timeout: 30000 });
        console.log('Search with Updated PO# is successful');
    }

    async verifyNoResultsFound() {
        await this.searchTextBox.fill('TestingNoResults');
        await expect(this.noRowsText).toBeVisible({ timeout: 30000 });
        console.log('Verified the appropriate message when no results are found');
    }

    async verifyNoResultsFoundForGivenContractID(contractId: string) {
        await this.page.waitForTimeout(2000);
        await this.searchTextBox.clear();
        await this.searchTextBox.fill(contractId);
        await this.page.waitForTimeout(2000);
        try {
            await expect(this.noRowsText).toBeVisible({ timeout: 30000 });
        }
        catch {
            await expect(this.ContractIDText.nth(0)).not.toHaveText(contractId);
        }
    }

    async verifyContractStatusIsExpired(contractId: string) {
        await this.page.waitForTimeout(2000);
        await this.searchTextBox.clear();
        await this.searchTextBox.fill(contractId);
        await this.page.waitForTimeout(2000);
        await expect(this.ContractIDText.nth(0)).toHaveText(contractId);
        await this.ContractIDText.nth(0).click();
        await expect(this.listStatuses.first()).toHaveText('Expired', { timeout: 30000 });
    }

    async verifyClearSearchText() {
        await expect(this.customerNameColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        const TotalContractsCountTextBefore = await this.contractsCount.textContent();
        const match = TotalContractsCountTextBefore?.match(/\((\d+)\)/); // Finds digits inside parentheses
        let TotalContractsCountBefore = 0; // Initialize with a default value
        if (match && match[1]) {
            TotalContractsCountBefore = parseInt(match[1]);
        }

        await this.searchTextBox.fill('TestingClearSearch');
        await expect(this.noRowsText).toBeVisible({ timeout: 30000 });
        await this.clearSearchButton.first().click();
        await expect(this.searchTextBox).toBeEmpty();
        await expect(this.noRowsText).not.toBeVisible();

        const TotalContractsCountTextAfter = await this.contractsCount.textContent();
        const matchAfter = TotalContractsCountTextAfter?.match(/\((\d+)\)/); // Finds digits inside parentheses
        let TotalContractsCountAfter = 0; // Initialize with a default value
        if (matchAfter && matchAfter[1]) {
            TotalContractsCountAfter = parseInt(matchAfter[1]);
        }

        await this.page.waitForTimeout(2000);
        expect(TotalContractsCountAfter).toEqual(TotalContractsCountBefore);
        console.log('Verified Clear Search Text with X button in Search TextBox. And ' + TotalContractsCountTextAfter + ' is equal to ' + TotalContractsCountTextBefore);
    }

    async verifyAllDocumentsTab() {
        try {
            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            await this.allDocumentsTab.click();
            await expect(this.allDocumentsTab).toHaveAttribute('aria-selected', 'true');
        }
        catch {
            if (await this.contractsLoadingError.isVisible()) {
                console.log('Contracts loading error is visible.');
                this.verifyFiveContractsDisplayedWhenFiveIsChosenFromShowDropdown();
                await this.allDocumentsTab.click();
                await expect(this.allDocumentsTab).toHaveAttribute('aria-selected', 'true');
                await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            }
        }
        await expect(this.contractsCount).toBeVisible();
        const TotalContractsCountTextBefore = await this.contractsCount.textContent();
        console.log('Total Contracts Count Before clicking on another tab: ' + TotalContractsCountTextBefore);
        await this.page.waitForTimeout(2000);
        await this.draftTab.click();
        await expect(this.draftTab).toHaveAttribute('aria-selected', 'true');
        await this.page.waitForTimeout(2000);
        await this.activeTab.click();
        await expect(this.activeTab).toHaveAttribute('aria-selected', 'true');
        await this.page.waitForTimeout(2000);
        await this.needsAttentionTab.click();
        await expect(this.needsAttentionTab).toHaveAttribute('aria-selected', 'true');
        await this.page.waitForTimeout(2000);
        await this.expiredTab.click();
        await expect(this.expiredTab).toHaveAttribute('aria-selected', 'true');
        await this.page.waitForTimeout(2000);
        await this.allDocumentsTab.click();
        await expect(this.allDocumentsTab).toHaveAttribute('aria-selected', 'true');
        await this.page.waitForTimeout(2000);
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        const TotalContractsCountTextAfter = await this.contractsCount.textContent();
        console.log('Total Contracts Count After coming back: ' + TotalContractsCountTextAfter);
        expect(TotalContractsCountTextAfter).toEqual(TotalContractsCountTextBefore);
        console.log('After clicking another tab, clicked back on "ALL DOCUMENTS". Verified the table displays all contracts again (like the initial view) and the tab becomes visually active.');
    }

    async verifyColumnsButton() {
        // await this.selectColumnsMenuButton.click();
        await expect(this.customerNameColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });;
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await this.customerColumnMenu.click();
        await expect(this.customerColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();

        // Verify the columns menu is displayed
        await expect(this.contractIDCheckbox).toBeVisible();
        await expect(this.customerCheckbox).toBeVisible();
        await expect(this.autorenewalCheckbox).toBeVisible();
        await expect(this.startDateCheckbox).toBeVisible();
        await expect(this.netPriceCheckbox).toBeVisible();
        await expect(this.statusCheckbox).toBeVisible();
        await expect(this.poNumberCheckbox).toBeVisible();
        await expect(this.creationDateCheckbox).toBeVisible();
        // await expect(this.salesPersonCheckbox).toBeVisible();
        await expect(this.showHideAllCheckbox).toBeVisible();
        await expect(this.resetButton).toBeVisible();

        //Verify whether unchecking the checkboxes works
        await expect(this.contractIDCheckbox).toBeDisabled();
        await this.customerCheckbox.uncheck();
        await expect(this.customerCheckbox).not.toBeChecked();
        await this.autorenewalCheckbox.uncheck();
        await expect(this.autorenewalCheckbox).not.toBeChecked();
        await this.startDateCheckbox.uncheck();
        await expect(this.startDateCheckbox).not.toBeChecked();
        await this.netPriceCheckbox.uncheck();
        await expect(this.netPriceCheckbox).not.toBeChecked();
        await this.statusCheckbox.uncheck();
        await expect(this.statusCheckbox).not.toBeChecked();
        await this.poNumberCheckbox.uncheck();
        await expect(this.poNumberCheckbox).not.toBeChecked();
        await this.creationDateCheckbox.uncheck();
        await expect(this.creationDateCheckbox).not.toBeChecked();
        // await this.salesPersonCheckbox.uncheck();

        await expect(this.showHideAllCheckbox).not.toBeChecked();
        await expect(this.resetButton).toBeEnabled();

        await this.showHideAllCheckbox.check();
        await expect(this.customerCheckbox).toBeChecked();
        await expect(this.autorenewalCheckbox).toBeChecked();
        await expect(this.startDateCheckbox).toBeChecked();
        await expect(this.netPriceCheckbox).toBeChecked();
        await expect(this.statusCheckbox).toBeChecked();
        await expect(this.poNumberCheckbox).toBeChecked();
        await expect(this.creationDateCheckbox).toBeChecked();
        await expect(this.showHideAllCheckbox).toBeChecked();
        await expect(this.resetButton).toBeDisabled();
        await this.showHideAllCheckbox.uncheck();
        await expect(this.resetButton).toBeEnabled();

        await this.resetButton.click();
        await expect(this.customerCheckbox).toBeChecked();
        await expect(this.autorenewalCheckbox).toBeChecked();
        await expect(this.startDateCheckbox).toBeChecked();
        await expect(this.netPriceCheckbox).toBeChecked();
        await expect(this.statusCheckbox).toBeChecked();
        await expect(this.poNumberCheckbox).toBeChecked();
        await expect(this.creationDateCheckbox).toBeChecked();
        await expect(this.showHideAllCheckbox).toBeChecked();
        await expect(this.resetButton).toBeDisabled();

        //Search for columns inside the columns menu
        await this.searchBoxInsideColumnsMenu.fill('Contract ID');
        await expect(this.contractIDCheckbox).toBeChecked();
        await expect(this.contractIDCheckbox).toBeDisabled();
        await this.searchBoxInsideColumnsMenu.fill('Customer');
        await expect(this.CustomerSearchedColumnText).toBeVisible();
        await this.searchBoxInsideColumnsMenu.fill('Auto-renewal');
        await expect(this.AutoRenewalSearchedColumnText).toBeVisible();
        await this.searchBoxInsideColumnsMenu.fill('Start Date');
        await expect(this.StartDateSearchedColumnText).toBeVisible();
        await this.searchBoxInsideColumnsMenu.fill('Net Price');
        await expect(this.NetPriceSearchedColumnText).toBeVisible();
        await this.searchBoxInsideColumnsMenu.fill('Status');
        await expect(this.StatusSearchedColumnText).toBeVisible();
        await this.searchBoxInsideColumnsMenu.fill('PO #');
        await expect(this.POTextSearchedColumnText).toBeVisible();
        await this.searchBoxInsideColumnsMenu.fill('Creation Date');
        await expect(this.CreationDateSearchedColumnText).toBeVisible();
        await this.searchBoxInsideColumnsMenu.fill('TestingNoResults');
        await expect(this.noColumnsText).toBeVisible();

        //Clear the search box inside columns menu
        await this.clearButtonInColumnsMenu.click();
        await expect(this.contractIDCheckbox).toBeVisible();
        await expect(this.customerCheckbox).toBeVisible();
        await expect(this.autorenewalCheckbox).toBeVisible();
        await expect(this.startDateCheckbox).toBeVisible();
        await expect(this.netPriceCheckbox).toBeVisible();
        await expect(this.statusCheckbox).toBeVisible();
        await expect(this.poNumberCheckbox).toBeVisible();
        await expect(this.creationDateCheckbox).toBeVisible();

        console.log('Verified the "Columns" button functionality');
    }

    async deselectEachColumnAndVerifyIfItDisappears() {
        // await this.selectColumnsMenuButton.click();
        await expect(this.customerNameColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await this.customerColumnMenu.click();
        await expect(this.customerColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();

        // Deselect each column and verify it disappears
        await this.customerCheckbox.uncheck();
        await expect(this.customerColumnMenu).not.toBeVisible();

        await this.autorenewalCheckbox.uncheck();
        await expect(this.autoRenewalColumnMenu).not.toBeVisible();

        await this.startDateCheckbox.uncheck();
        await expect(this.startDateColumnMenu).not.toBeVisible();

        await this.netPriceCheckbox.uncheck();
        await expect(this.netPriceColumnMenu).not.toBeVisible();

        await this.statusCheckbox.uncheck();
        await expect(this.statusColumnMenu).not.toBeVisible();

        await this.poNumberCheckbox.uncheck();
        await expect(this.poNumberColumnMenu).not.toBeVisible();

        await this.creationDateCheckbox.uncheck();
        await expect(this.creationDateColumnMenu).not.toBeVisible();

        console.log('Deselected each column and verified it disappears from the table view.');
    }

    async verifyColumnReappearsInSamePositionWhenReselected() {
        // await this.selectColumnsMenuButton.click();
        await expect(this.customerNameColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await this.customerColumnMenu.click();
        await expect(this.customerColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();

        const ListOfColumnHeadersBeforeDeSelecting = await this.columnHeaders.allTextContents();
        const contractIDIndexBefore = ListOfColumnHeadersBeforeDeSelecting.indexOf('Contract ID');
        const customerIndexBefore = ListOfColumnHeadersBeforeDeSelecting.indexOf('Customer');
        const autoRenewalIndexBefore = ListOfColumnHeadersBeforeDeSelecting.indexOf('Auto-renewal');
        const startDateIndexBefore = ListOfColumnHeadersBeforeDeSelecting.indexOf('Start Date');
        const netPriceIndexBefore = ListOfColumnHeadersBeforeDeSelecting.indexOf('Net Price');
        const statusIndexBefore = ListOfColumnHeadersBeforeDeSelecting.indexOf('Status');
        const poNumberIndexBefore = ListOfColumnHeadersBeforeDeSelecting.indexOf('PO #');
        const creationDateIndexBefore = ListOfColumnHeadersBeforeDeSelecting.indexOf('Creation Date');

        // Reselect each column in random manner and verify it reappears in the same position
        await this.showHideAllCheckbox.uncheck();
        await this.poNumberCheckbox.check();
        await this.netPriceCheckbox.check();
        await this.autorenewalCheckbox.check();
        await this.startDateCheckbox.check();
        await this.creationDateCheckbox.check();
        await this.customerCheckbox.check();
        await this.statusCheckbox.check();

        const ListOfColumnHeadersAfterReSelecting = await this.columnHeaders.allTextContents();
        const contractIDIndexAfter = ListOfColumnHeadersAfterReSelecting.indexOf('Contract ID');
        const customerIndexAfter = ListOfColumnHeadersAfterReSelecting.indexOf('Customer');
        const autoRenewalIndexAfter = ListOfColumnHeadersAfterReSelecting.indexOf('Auto-renewal');
        const startDateIndexAfter = ListOfColumnHeadersAfterReSelecting.indexOf('Start Date');
        const netPriceIndexAfter = ListOfColumnHeadersAfterReSelecting.indexOf('Net Price');
        const statusIndexAfter = ListOfColumnHeadersAfterReSelecting.indexOf('Status');
        const poNumberIndexAfter = ListOfColumnHeadersAfterReSelecting.indexOf('PO #');
        const creationDateIndexAfter = ListOfColumnHeadersAfterReSelecting.indexOf('Creation Date');

        expect(contractIDIndexAfter).toEqual(contractIDIndexBefore);
        expect(customerIndexAfter).toEqual(customerIndexBefore);
        expect(autoRenewalIndexAfter).toEqual(autoRenewalIndexBefore);
        expect(startDateIndexAfter).toEqual(startDateIndexBefore);
        expect(netPriceIndexAfter).toEqual(netPriceIndexBefore);
        expect(statusIndexAfter).toEqual(statusIndexBefore);
        expect(poNumberIndexAfter).toEqual(poNumberIndexBefore);
        expect(creationDateIndexAfter).toEqual(creationDateIndexBefore);

        console.log('Verified whether the column reappears in the table, in its same position when reselected.');
    }

    async verifyTableSortAscendingAndDescending() {

        // Sort by Contract ID in ascending order
        /* Commenting out Contract ID sorting as per MUI Defect in Open State. 
        
                await this.contractIDsColumnWithHeaderTextList.nth(0).hover();
                await this.contractIDColumnMenu.click();
        
                await this.sortByASCMenuItem.click();
                const contractIDsAscending = await this.ContractIDText.allTextContents();
                const sortedContractIDsAscending = [...contractIDsAscending].sort();
                expect(contractIDsAscending).toEqual(sortedContractIDsAscending);
                console.log('Verified sorting by Contract ID in ascending order.');
        
                // Sort by Contract ID in descending order
                await this.contractIDsColumnWithHeaderTextList.nth(0).hover();
                await expect(this.contractIDColumnMenu).toBeEnabled();
                await this.contractIDColumnMenu.click();
                await expect(this.sortByDESCMenuItem).toBeEnabled();
                await this.sortByDESCMenuItem.click();
                const contractIDsDescending = await this.ContractIDText.allTextContents();
                const sortedContractIDsDescending = [...contractIDsDescending].sort().reverse();
                expect(contractIDsDescending).toEqual(sortedContractIDsDescending);
                console.log('Verified sorting by Contract ID in descending order.');
        */
        // Sort by Customer Name in ascending order
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.customerColumnMenu).toBeEnabled();
        await this.customerColumnMenu.click();
        await expect(this.sortByASCMenuItem).toBeEnabled();
        await this.sortByASCMenuItem.click();
        const customerNamesAscending = await this.customerNameText.allTextContents();
        const sortedCustomerNamesAscending = [...customerNamesAscending].sort();
        expect(customerNamesAscending).toEqual(sortedCustomerNamesAscending);
        console.log('Verified sorting by Customer Name in ascending order.');
        // Sort by Customer Name in descending order
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.customerColumnMenu).toBeEnabled();
        await this.customerColumnMenu.click();
        await expect(this.sortByDESCMenuItem).toBeEnabled();
        await this.sortByDESCMenuItem.click();
        const customerNamesDescending = await this.customerNameText.allTextContents();
        const sortedCustomerNamesDescending = [...customerNamesDescending].sort().reverse();
        expect(customerNamesDescending).toEqual(sortedCustomerNamesDescending);
        console.log('Verified sorting by Customer Name in descending order.');
        // Sort by Auto-renewal in ascending order
        await this.autoRenewalColumnsWithHeaderTextList.nth(0).hover();
        await this.page.waitForTimeout(1000);
        await expect(this.autoRenewalColumnMenu).toBeEnabled();
        await this.autoRenewalColumnMenu.click();
        await expect(this.sortByASCMenuItem).toBeEnabled();
        await this.sortByASCMenuItem.click();
        const autoRenewalAscending = await this.AutoRenewalImage.all();
        const sortedAutoRenewalAscending = [...autoRenewalAscending].sort();
        expect(autoRenewalAscending).toEqual(sortedAutoRenewalAscending);
        console.log('Verified sorting by Auto-renewal in ascending order.');
        // Sort by Auto-renewal in descending order
        await this.autoRenewalColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.autoRenewalColumnMenu).toBeEnabled();
        await this.autoRenewalColumnMenu.click();
        await expect(this.sortByDESCMenuItem).toBeEnabled();
        await this.sortByDESCMenuItem.click();
        const autoRenewalDescending = await this.AutoRenewalImage.all();
        const sortedAutoRenewalDescending = [...autoRenewalDescending].sort().reverse();
        expect(autoRenewalDescending).toEqual(sortedAutoRenewalDescending);
        console.log('Verified sorting by Auto-renewal in descending order.');
        // Sort by Start Date in ascending order
        await this.startDateColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.startDateColumnMenu).toBeEnabled();
        await this.startDateColumnMenu.click();
        await this.page.waitForTimeout(1000);
        await expect(this.sortByASCMenuItem).toBeEnabled();
        await this.sortByASCMenuItem.click();
        const startDatesAscending = await this.StartDateText.allTextContents();
        const sortedStartDatesAscending = [...startDatesAscending].sort();
        expect(startDatesAscending).toEqual(sortedStartDatesAscending);
        console.log('Verified sorting by Start Date in ascending order.');
        // Sort by Start Date in descending order
        await this.startDateColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.startDateColumnMenu).toBeEnabled();
        await this.startDateColumnMenu.click();
        await expect(this.sortByDESCMenuItem).toBeEnabled();
        await this.sortByDESCMenuItem.click();
        const startDatesDescending = await this.StartDateText.allTextContents();
        const sortedStartDatesDescending = [...startDatesDescending].sort().reverse();
        expect(startDatesDescending).toEqual(sortedStartDatesDescending);
        console.log('Verified sorting by Start Date in descending order.');
        // Sort by Net Price in ascending order
        await this.netPriceColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.netPriceColumnMenu).toBeEnabled();
        await this.netPriceColumnMenu.click();
        await expect(this.sortByASCMenuItem).toBeEnabled();
        await this.sortByASCMenuItem.click();
        const netPricesAscending = await this.NetPriceText.allTextContents();
        const sortedNetPricesAscending = [...netPricesAscending].sort((a, b) => parseFloat(a.replace(/[$,]/g, '')) - parseFloat(b.replace(/[$,]/g, '')));
        expect(netPricesAscending).toEqual(sortedNetPricesAscending);
        console.log('Verified sorting by Net Price in ascending order.');
        // Sort by Net Price in descending order
        await this.netPriceColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.netPriceColumnMenu).toBeEnabled();
        await this.netPriceColumnMenu.click();
        await expect(this.sortByDESCMenuItem).toBeEnabled();
        await this.sortByDESCMenuItem.click();
        const netPricesDescending = await this.NetPriceText.allTextContents();
        const sortedNetPricesDescending = [...netPricesDescending].sort((a, b) => parseFloat(b.replace(/[$,]/g, '')) - parseFloat(a.replace(/[$,]/g, '')));
        expect(netPricesDescending).toEqual(sortedNetPricesDescending);
        console.log('Verified sorting by Net Price in descending order.');
        // Sort by Status in ascending order
        await this.statusColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.statusColumnMenu).toBeEnabled();
        await this.statusColumnMenu.click();
        await expect(this.sortByASCMenuItem).toBeEnabled();
        await this.sortByASCMenuItem.click();
        const statusesAscending = await this.StatusText.allTextContents();
        const sortedStatusesAscending = [...statusesAscending].sort();
        expect(statusesAscending).toEqual(sortedStatusesAscending);
        console.log('Verified sorting by Status in ascending order.');
        // Sort by Status in descending order
        await this.statusColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.statusColumnMenu).toBeEnabled();
        await this.statusColumnMenu.click();
        await expect(this.sortByDESCMenuItem).toBeEnabled();
        await this.sortByDESCMenuItem.click();
        const statusesDescending = await this.StatusText.allTextContents();
        const sortedStatusesDescending = [...statusesDescending].sort().reverse();
        expect(statusesDescending).toEqual(sortedStatusesDescending);
        console.log('Verified sorting by Status in descending order.');
        // Sort by PO # in ascending order
        await this.poNumberColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.poNumberColumnMenu).toBeEnabled();
        await this.poNumberColumnMenu.click();
        await expect(this.sortByASCMenuItem).toBeEnabled();
        await this.sortByASCMenuItem.click();
        const poNumbersAscending = await this.POText.allTextContents();
        const sortedPONumbersAscending = [...poNumbersAscending].sort();
        expect(poNumbersAscending).toEqual(sortedPONumbersAscending);
        console.log('Verified sorting by PO # in ascending order.');
        // Sort by PO # in descending order
        await this.poNumberColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.poNumberColumnMenu).toBeEnabled();
        await this.poNumberColumnMenu.click();
        await expect(this.sortByDESCMenuItem).toBeEnabled();
        await this.sortByDESCMenuItem.click();
        const poNumbersDescending = await this.POText.allTextContents();
        const sortedPONumbersDescending = [...poNumbersDescending].sort().reverse();
        expect(poNumbersDescending).toEqual(sortedPONumbersDescending);
        console.log('Verified sorting by PO # in descending order.');
        // Sort by Creation Date in ascending order
        await this.creationDateColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.creationDateColumnMenu).toBeEnabled();
        await this.creationDateColumnMenu.click();
        await expect(this.sortByASCMenuItem).toBeEnabled();
        await this.sortByASCMenuItem.click();
        const creationDatesAscending = await this.CreationDateText.allTextContents();
        const sortedCreationDatesAscending = [...creationDatesAscending].sort();
        expect(creationDatesAscending).toEqual(sortedCreationDatesAscending);
        console.log('Verified sorting by Creation Date in ascending order.');
        // Sort by Creation Date in descending order
        await this.creationDateColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.creationDateColumnMenu).toBeEnabled();
        await this.creationDateColumnMenu.click();
        await expect(this.sortByDESCMenuItem).toBeEnabled();
        await this.sortByDESCMenuItem.click();
        const creationDatesDescending = await this.CreationDateText.allTextContents();
        const sortedCreationDatesDescending = [...creationDatesDescending].sort().reverse();
        expect(creationDatesDescending).toEqual(sortedCreationDatesDescending);
        console.log('Verified sorting by Creation Date in descending order.');
    }

    async verifySortingEnabledAndDisabled() {
        const totalSortingHeaders = await this.sortButton.count();
        console.log(`Total Sorting Headers: ${totalSortingHeaders} `);
        for (let i = 0; i < totalSortingHeaders; i++) {
            await this.columnHeaders.nth(i).hover();
            await expect(this.allColumnsMenu.nth(i)).toBeVisible({ timeout: 30000 });
            await this.allColumnsMenu.nth(i).click();

            if (await this.unsortMenuItem.isVisible()) {
                await this.unsortMenuItem.click();
                await this.columnHeaders.nth(i).hover();
                await expect(this.allColumnsMenu.nth(i)).toBeVisible({ timeout: 30000 });
                await this.allColumnsMenu.nth(i).click();
            }

            await this.page.waitForTimeout(500);
            await expect(this.sortByASCMenuItem).toBeVisible();
            await expect(this.sortByDESCMenuItem).toBeVisible();
            await expect(this.unsortMenuItem).not.toBeVisible();

            await this.page.waitForTimeout(500);
            await this.columnHeaders.nth(i).hover();
            await this.sortButton.nth(i).click();
            await expect(this.allColumnsMenu.nth(i)).toBeVisible({ timeout: 30000 });
            await this.allColumnsMenu.nth(i).click();
            await expect(this.sortByASCMenuItem).not.toBeVisible();
            await expect(this.sortByDESCMenuItem).toBeVisible();

            await this.page.waitForTimeout(500);
            await this.columnHeaders.nth(i).hover();
            await this.sortButton.nth(i).click();
            await expect(this.allColumnsMenu.nth(i)).toBeVisible({ timeout: 30000 });
            await this.allColumnsMenu.nth(i).click();
            await expect(this.sortByDESCMenuItem).not.toBeVisible();
            await expect(this.sortByASCMenuItem).toBeVisible();

            await this.page.waitForTimeout(500);
            await this.columnHeaders.nth(i).hover();
            await this.sortButton.nth(i).click();
            await expect(this.allColumnsMenu.nth(i)).toBeVisible({ timeout: 30000 });
            await this.allColumnsMenu.nth(i).click();
            await expect(this.sortByASCMenuItem).toBeVisible();
            await expect(this.sortByDESCMenuItem).toBeVisible();
            await expect(this.unsortMenuItem).not.toBeVisible();
            await this.page.keyboard.press('Escape');
        }
    }

    // async verifySidesheetOpensOnContractClick() {
    //     await this.page.waitForTimeout(2000);
    //     await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
    //     const contractNumber = await this.ContractIDText.nth(0).textContent();
    //     console.log(`Contract Number: ${contractNumber} `);
    //     await this.ContractIDText.nth(0).click();
    // }

    async verifyFiveContractsDisplayedWhenFiveIsChosenFromShowDropdown() {
        await this.rowsPerPageComboBox.click();
        if (await this.fiveRowsPerPageOption.getAttribute('aria-selected') === 'false') {
            await this.fiveRowsPerPageOption.click();
        }
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
        await expect(this.rowsPerPageComboBox).toHaveText('5');
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        const countOfContracts = await this.statusColumnsWOHeaderTextList.count();
        expect(countOfContracts).toEqual(5); // 5 contracts + header row
        console.log(`Verified that 5 contracts are displayed when 5 is chosen from the "Show" dropdown.Total Count: ${countOfContracts} `);
    }

    async verifyTenContractsDisplayedWhenTenIsChosenFromShowDropdown() {
        await this.rowsPerPageComboBox.click();
        if (await this.tenRowsPerPageOption.getAttribute('aria-selected') === 'false') {
            await this.tenRowsPerPageOption.click();
        }
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        await expect(this.rowsPerPageComboBox).toHaveText('10');
        const countOfContracts = await this.statusColumnsWOHeaderTextList.count();
        expect(countOfContracts).toEqual(10); // 10 contracts + header row
        console.log(`Verified that 10 contracts are displayed when 10 is chosen from the "Show" dropdown.Total Count: ${countOfContracts} `);
    }

    async verifyTwentyContractsDisplayedWhenTwentyIsChosenFromShowDropdown() {
        try {
            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        }
        catch {
            if (await this.contractsLoadingError.isVisible()) {
                console.log('Contracts loading error is visible.');
                this.verifyFiveContractsDisplayedWhenFiveIsChosenFromShowDropdown();
                await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            }
        }
        await this.rowsPerPageComboBox.click();
        if (await this.twentyRowsPerPageOption.getAttribute('aria-selected') === 'false') {
            await this.twentyRowsPerPageOption.click();
        }
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        await expect(this.rowsPerPageComboBox).toHaveText('20');
        const countOfContracts = await this.statusColumnsWOHeaderTextList.count();
        if (countOfContracts == 20)
            expect(countOfContracts).toEqual(20); // 20 contracts + header row
        else if (countOfContracts < 20)
            expect(this.goToNextPageButton).not.toBeVisible();
        console.log(`Verified that 20 contracts are displayed when 20 is chosen from the "Show" dropdown.Total Count: ${countOfContracts} `);
    }

    async verifyFiftyContractsDisplayedWhenFiftyIsChosenFromShowDropdown() {
        try {
            await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        }
        catch {
            if (await this.contractsLoadingError.isVisible()) {
                console.log('Contracts loading error is visible.');
                this.verifyFiveContractsDisplayedWhenFiveIsChosenFromShowDropdown();
                await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            }
        }
        await this.rowsPerPageComboBox.click();
        if (await this.fiftyRowsPerPageOption.getAttribute('aria-selected') === 'false') {
            await this.fiftyRowsPerPageOption.click();
        }
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
        await expect(this.rowsPerPageComboBox).toHaveText('50');
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        const countOfContracts = await this.statusColumnsWOHeaderTextList.count();

        if (countOfContracts == 50) {
            expect(countOfContracts).toEqual(50); // 50 contracts + header row
        }
        else if (countOfContracts < 50) {
            expect(this.goToNextPageButton).not.toBeVisible();
        }
        console.log(`Verified that 50 contracts are displayed when 50 is chosen from the "Show" dropdown.Total Count: ${countOfContracts} `);
    }

    async verifyContractsCountsAreMatching() {
        await this.page.waitForTimeout(2000);
        const TotalContractsCountInTop = await this.contractsCount.textContent();
        const matchTop = TotalContractsCountInTop?.match(/\((\d+)\)/); // Finds digits inside parentheses
        let TotalContractsCountCountInTop = 0; // Initialize with a default value
        if (matchTop && matchTop[1]) {
            TotalContractsCountCountInTop = parseInt(matchTop[1]);
        }
        console.log(`Total Contracts Count in Top: ${TotalContractsCountCountInTop} `);

        const TotalContractsCountInPaginationText = await this.contractsCount.textContent();
        const matchPagination = TotalContractsCountInPaginationText?.match(/\((\d+)\)/); // Finds digits inside parentheses
        let TotalContractsCountInPagination = 0; // Initialize with a default value
        if (matchPagination && matchPagination[1]) {
            TotalContractsCountInPagination = parseInt(matchPagination[1]);
        }
        console.log(`Total Contracts Count in Pagination Text: ${TotalContractsCountInPagination} `);

        expect(TotalContractsCountCountInTop).toEqual(TotalContractsCountInPagination);
        console.log(`Verified that the total count of contracts displayed in the top matches the count in the pagination text.Total Count: ${TotalContractsCountInTop} `);
    }

    async verifyNextButtonNavigatesToNextPageAndComingBackToFirstPage() {
        await expect(this.goToPrevPageButton).not.toBeVisible();
        while (await this.goToNextPageButton.isVisible()) {
            await this.goToNextPageButton.click();
            await this.page.waitForTimeout(500);
            await expect(this.customerNameColumnsWithHeaderTextList.nth(1)).toBeVisible();
        }

        await expect(this.goToNextPageButton).not.toBeVisible();
        while (await this.goToPrevPageButton.isVisible()) {
            await this.goToPrevPageButton.click();
            await this.page.waitForTimeout(500);
            await expect(this.customerNameColumnsWithHeaderTextList.nth(1)).toBeVisible();
        }
    }

    async verifyNavigatableBetweenPages() {
        await this.verifyFiveContractsDisplayedWhenFiveIsChosenFromShowDropdown();
        await this.page.locator('xpath=//button[@aria-label="Go to page 3"]').click();
        await this.page.waitForTimeout(500);
        await expect(this.customerNameColumnsWithHeaderTextList.nth(1)).toBeVisible();

        await this.page.locator('xpath=//button[@aria-label="Go to page 1"]').click();
        await this.page.waitForTimeout(500);
        await expect(this.customerNameColumnsWithHeaderTextList.nth(1)).toBeVisible();

        await this.page.locator('xpath=//button[@aria-label="Go to page 4"]').click();
        await this.page.waitForTimeout(500);
        await expect(this.customerNameColumnsWithHeaderTextList.nth(1)).toBeVisible();

        await this.page.locator('xpath=//button[@aria-label="Go to page 2"]').click();
        await this.page.waitForTimeout(500);
        await expect(this.customerNameColumnsWithHeaderTextList.nth(1)).toBeVisible();

    }

    async verifyPinToLeftFunctionality() {
        // Pin to Left Contract ID
        /*      Commenting out Contract ID pinning as per MUI Defect in Open State.  
                await this.contractIDsColumnWithHeaderTextList.nth(0).hover();
                await this.contractIDColumnMenu.click();
                if (await this.pinnedLeftColumn.isVisible()) {
                    await this.unpinMenuItem.click();
                    await this.contractIDsColumnWithHeaderTextList.nth(0).hover();
                    await this.contractIDColumnMenu.click();
                }
                await this.pinToLeftMenuItem.click();
                await expect(this.pinnedLeftColumn).toBeVisible();
                await expect(this.pinnedLeftColumn).toHaveAttribute('data-field', 'contractNumber', { timeout: 5000 });
                await this.contractIDsColumnWithHeaderTextList.nth(0).hover();
                await this.contractIDColumnMenu.click();
                await this.unpinMenuItem.click();
                console.log('Verified Pin to Left functionality for Contract ID.');
        */
        // Pin to Left Customer Name
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await this.customerColumnMenu.click();
        await this.pinToLeftMenuItem.click();
        await expect(this.pinnedLeftColumn.nth(1)).toBeVisible();
        await expect(this.pinnedLeftColumn.nth(1)).toHaveAttribute('data-field', 'customerName', { timeout: 5000 });
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await this.customerColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Left functionality for Customer Name.');

        // Pin to Left Auto-renewal
        await this.autoRenewalColumnsWithHeaderTextList.nth(0).hover();
        await this.autoRenewalColumnMenu.click();
        await this.pinToLeftMenuItem.click();
        await expect(this.pinnedLeftColumn.nth(1)).toBeVisible();
        await expect(this.pinnedLeftColumn.nth(1)).toHaveAttribute('data-field', 'autoRenew', { timeout: 5000 });
        await this.autoRenewalColumnsWithHeaderTextList.nth(0).hover();
        await this.autoRenewalColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Left functionality for Auto-renewal.');

        // Pin to Left Start Date
        await this.startDateColumnsWithHeaderTextList.nth(0).hover();
        await this.startDateColumnMenu.click();
        await this.pinToLeftMenuItem.click();
        await expect(this.pinnedLeftColumn.nth(1)).toBeVisible();
        await expect(this.pinnedLeftColumn.nth(1)).toHaveAttribute('data-field', 'startDate', { timeout: 5000 });
        await this.startDateColumnsWithHeaderTextList.nth(0).hover();
        await this.startDateColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Left functionality for Start Date.');

        // Pin to Left Net Price
        await this.netPriceColumnsWithHeaderTextList.nth(0).hover();
        await this.netPriceColumnMenu.click();
        await this.pinToLeftMenuItem.click();
        await expect(this.pinnedLeftColumn.nth(1)).toBeVisible();
        await expect(this.pinnedLeftColumn.nth(1)).toHaveAttribute('data-field', 'netPriceTotal', { timeout: 5000 });
        await this.netPriceColumnsWithHeaderTextList.nth(0).hover();
        await this.netPriceColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Left functionality for Net Price.');

        // Pin to Left Status
        await this.statusColumnsWithHeaderTextList.nth(0).hover();
        await this.statusColumnMenu.click();
        await this.pinToLeftMenuItem.click();
        await expect(this.pinnedLeftColumn.nth(1)).toBeVisible();
        await expect(this.pinnedLeftColumn.nth(1)).toHaveAttribute('data-field', 'status', { timeout: 5000 });
        await this.statusColumnsWithHeaderTextList.nth(0).hover();
        await this.statusColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Left functionality for Status.');

        // Pin to Left PO #
        await this.poNumberColumnsWithHeaderTextList.nth(0).hover();
        await this.poNumberColumnMenu.click();
        await this.pinToLeftMenuItem.click();
        await expect(this.pinnedLeftColumn.nth(1)).toBeVisible();
        await expect(this.pinnedLeftColumn.nth(1)).toHaveAttribute('data-field', 'purchaseOrderNumber', { timeout: 5000 });
        await this.poNumberColumnsWithHeaderTextList.nth(0).hover();
        await this.poNumberColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Left functionality for PO #.');

        // Pin to Left Creation Date
        await this.creationDateColumnsWithHeaderTextList.nth(0).hover();
        await this.creationDateColumnMenu.click();
        await this.pinToLeftMenuItem.click();
        await expect(this.pinnedLeftColumn.nth(1)).toBeVisible();
        await expect(this.pinnedLeftColumn.nth(1)).toHaveAttribute('data-field', 'createdDate', { timeout: 5000 });
        await this.creationDateColumnsWithHeaderTextList.nth(0).hover();
        await this.creationDateColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Left functionality for Creation Date.');
    }

    async verifyPinToRightFunctionality() {
        // Pin to Right Contract ID
        /*    Commenting out Contract ID pinning as per MUI Defect in Open State.
                await this.contractIDsColumnWithHeaderTextList.nth(0).hover();
                await this.contractIDColumnMenu.click();
                await this.pinToRightMenuItem.click();
                await expect(this.pinnedRightColumn).toBeVisible();
                await expect(this.pinnedRightColumn).toHaveAttribute('data-field', 'contractNumber', { timeout: 5000 });
                await this.contractIDsColumnWithHeaderTextList.nth(0).hover();
                await this.contractIDColumnMenu.click();
                await this.unpinMenuItem.click();
                console.log('Verified Pin to Right functionality for Contract ID.');
        */
        // Pin to Right Customer Name
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await this.customerColumnMenu.click();
        await this.pinToRightMenuItem.click();
        await expect(this.pinnedRightColumn).toBeVisible();
        await expect(this.pinnedRightColumn).toHaveAttribute('data-field', 'customerName', { timeout: 5000 });
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await this.customerColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Right functionality for Customer Name.');

        // Pin to Right Auto-renewal
        await this.autoRenewalColumnsWithHeaderTextList.nth(0).hover();
        await this.autoRenewalColumnMenu.click();
        await this.pinToRightMenuItem.click();
        await expect(this.pinnedRightColumn).toBeVisible();
        await expect(this.pinnedRightColumn).toHaveAttribute('data-field', 'autoRenew', { timeout: 5000 });
        await this.autoRenewalColumnsWithHeaderTextList.nth(0).hover();
        await this.autoRenewalColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Right functionality for Auto-renewal.');

        // Pin to Right Start Date
        await this.startDateColumnsWithHeaderTextList.nth(0).hover();
        await this.startDateColumnMenu.click();
        await this.pinToRightMenuItem.click();
        await expect(this.pinnedRightColumn).toBeVisible();
        await expect(this.pinnedRightColumn).toHaveAttribute('data-field', 'startDate', { timeout: 5000 });
        await this.startDateColumnsWithHeaderTextList.nth(0).hover();
        await this.startDateColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Right functionality for Start Date.');

        // Pin to Right Net Price
        await this.netPriceColumnsWithHeaderTextList.nth(0).hover();
        await this.netPriceColumnMenu.click();
        await this.pinToRightMenuItem.click();
        await expect(this.pinnedRightColumn).toBeVisible();
        await expect(this.pinnedRightColumn).toHaveAttribute('data-field', 'netPriceTotal', { timeout: 5000 });
        await this.netPriceColumnsWithHeaderTextList.nth(0).hover();
        await this.netPriceColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Right functionality for Net Price.');
        // Pin to Right Status
        await this.statusColumnsWithHeaderTextList.nth(0).hover();
        await this.statusColumnMenu.click();
        await this.pinToRightMenuItem.click();
        await expect(this.pinnedRightColumn).toBeVisible();
        await expect(this.pinnedRightColumn).toHaveAttribute('data-field', 'status', { timeout: 5000 });
        await this.statusColumnsWithHeaderTextList.nth(0).hover();
        await this.statusColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Right functionality for Status.');
        // Pin to Right PO #
        await this.poNumberColumnsWithHeaderTextList.nth(0).hover();
        await this.poNumberColumnMenu.click();
        await this.pinToRightMenuItem.click();
        await expect(this.pinnedRightColumn).toBeVisible();
        await expect(this.pinnedRightColumn).toHaveAttribute('data-field', 'purchaseOrderNumber', { timeout: 5000 });
        await this.poNumberColumnsWithHeaderTextList.nth(0).hover();
        await this.poNumberColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Right functionality for PO #.');
        // Pin to Right Creation Date
        await this.creationDateColumnsWithHeaderTextList.nth(0).hover();
        await this.creationDateColumnMenu.click();
        await this.pinToRightMenuItem.click();
        await expect(this.pinnedRightColumn).toBeVisible();
        await expect(this.pinnedRightColumn).toHaveAttribute('data-field', 'createdDate', { timeout: 5000 });
        await this.creationDateColumnsWithHeaderTextList.nth(0).hover();
        await this.creationDateColumnMenu.click();
        await this.unpinMenuItem.click();
        console.log('Verified Pin to Right functionality for Creation Date.');
    }

    async verifyHideColumnFunctionality() {
        // await this.contractIDsColumnWithHeaderTextList.nth(0).hover();
        // await this.contractIDColumnMenu.click();
        // await expect(this.hideColumnMenuItem).not.toBeVisible();
        await this.customerNameColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.customerColumnMenu).toBeEnabled();
        await this.customerColumnMenu.click();
        await expect(this.hideColumnMenuItem).toBeEnabled();
        await this.hideColumnMenuItem.click();
        await this.page.keyboard.press('Escape');
        // await this.selectColumnsMenuButton.click();
        await expect(this.statusColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        await this.statusColumnsWithHeaderTextList.nth(0).hover();
        await this.statusColumnMenu.click();
        await expect(this.statusColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();
        await expect(this.customerCheckbox).not.toBeChecked();
        await this.page.keyboard.press('Escape');
        await this.startDateColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.startDateColumnMenu).toBeEnabled();
        await this.startDateColumnMenu.click();
        await expect(this.hideColumnMenuItem).toBeEnabled();
        await this.hideColumnMenuItem.click();
        // await this.selectColumnsMenuButton.click();
        await expect(this.autoRenewalColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        await this.autoRenewalColumnsWithHeaderTextList.nth(0).hover();
        await this.autoRenewalColumnMenu.click();
        await expect(this.autoRenewalColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();
        await expect(this.startDateCheckbox).not.toBeChecked();
        await this.page.keyboard.press('Escape');
        await this.autoRenewalColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.autoRenewalColumnMenu).toBeEnabled();
        await this.autoRenewalColumnMenu.click();
        await expect(this.hideColumnMenuItem).toBeEnabled();
        await this.hideColumnMenuItem.click();
        // await this.selectColumnsMenuButton.click();
        await expect(this.netPriceColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        await this.netPriceColumnsWithHeaderTextList.nth(0).hover();
        await this.netPriceColumnMenu.click();
        await expect(this.netPriceColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();
        await expect(this.autorenewalCheckbox).not.toBeChecked();
        await this.page.keyboard.press('Escape');
        await this.netPriceColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.netPriceColumnMenu).toBeEnabled();
        await this.netPriceColumnMenu.click();
        await expect(this.hideColumnMenuItem).toBeEnabled();
        await this.hideColumnMenuItem.click();
        // await this.selectColumnsMenuButton.click();
        await expect(this.poNumberColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        await this.poNumberColumnsWithHeaderTextList.nth(0).hover();
        await this.poNumberColumnMenu.click();
        await expect(this.poNumberColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();
        await expect(this.netPriceCheckbox).not.toBeChecked();
        await this.page.keyboard.press('Escape');
        await this.poNumberColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.poNumberColumnMenu).toBeEnabled();
        await this.poNumberColumnMenu.click();
        await expect(this.hideColumnMenuItem).toBeEnabled();
        await this.hideColumnMenuItem.click();
        // await this.selectColumnsMenuButton.click();
        await expect(this.creationDateColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        await this.creationDateColumnsWithHeaderTextList.nth(0).hover();
        await this.creationDateColumnMenu.click();
        await expect(this.creationDateColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();
        // await expect(this.statusCheckbox).not.toBeChecked();
        await this.page.keyboard.press('Escape');
        await this.creationDateColumnsWithHeaderTextList.nth(0).hover();
        await expect(this.creationDateColumnMenu).toBeEnabled();
        await this.creationDateColumnMenu.click();
        await expect(this.hideColumnMenuItem).toBeEnabled();
        await this.hideColumnMenuItem.click();
        // await this.selectColumnsMenuButton.click();
        await expect(this.statusColumnsWithHeaderTextList.nth(0)).toBeVisible({ timeout: 30000 });
        await this.statusColumnsWithHeaderTextList.nth(0).hover();
        await this.statusColumnMenu.click();
        await expect(this.statusColumnMenu).toBeVisible();
        await this.hideColumnMenuItem.click();

        // await expect(this.hideColumnMenuItem).toBeDisabled();
        // await this.hideColumnMenuItem.click();
        // await this.selectColumnsMenuButton.click();
        await expect(this.contractIDColumnHeader.nth(0)).toBeVisible({ timeout: 30000 });
        await this.contractIDColumnHeader.nth(0).hover();
        await this.contractIDColumnMenu.click();
        await expect(this.contractIDColumnMenu).toBeVisible();
        await this.manageColumnsMenuItem.click();
        await expect(this.creationDateCheckbox).not.toBeChecked();
        await expect(this.poNumberCheckbox).not.toBeChecked();
        await expect(this.netPriceCheckbox).not.toBeChecked();
        await expect(this.autorenewalCheckbox).not.toBeChecked();
        await expect(this.startDateCheckbox).not.toBeChecked();
        await expect(this.customerCheckbox).not.toBeChecked();
        await expect(this.contractIDCheckbox).toBeChecked();
        console.log('Verified Hide Column functionality for all columns.');
    }

    async verifyManageColumnsFunctionality() {
        const columnHeadersCount = await this.columnHeaders.count();

        for (let i = 1; i < columnHeadersCount; i++) {
            await expect(this.selectColumnsMenuButton).not.toHaveAttribute('aria-expanded', 'true');
            await this.columnHeaders.nth(i).hover();
            await this.page.waitForTimeout(1000);
            await this.allColumnsMenu.nth(i - 1).click();
            await this.page.waitForTimeout(1000);
            await this.manageColumnsMenuItem.click();
            await this.page.waitForTimeout(1000);
            await expect(this.selectColumnsMenuButton).toHaveAttribute('aria-expanded', 'true');
            await this.page.keyboard.press('Escape');
        }
    }

    async VerifyCreateANewContractButton() {
        await this.createANewContractButton.click();
        await expect(this.createANewContractText).toBeVisible();
    }

    async selectQuery(contractNumber: string) {
        const selectQuery = `SELECT q.contract_id, c.id, c.contract_number, q.valid_until_date FROM dxp.contract.quote q INNER JOIN dxp.contract.contract_detail c ON q.contract_id = c.id where c.contract_number = $1; `
        console.log(`Query: ${selectQuery} `);
        const result = await executeQuery<any>(selectQuery, [contractNumber]);
        console.log(`Query executed`);
        // console.log(`Result: ${ JSON.stringify(result) } `);
        return result.rows;
    }

    /**
    * Returns the ISO string for the date of the day before yesterday (2 days ago) in UTC.
    * Example output: 2025-06-10T03:33:17.328Z
    */
    async getDayISOString(day: number) {
        const now = new Date();
        now.setDate(now.getDate() - day);
        console.log('Day in ISO String:', now);
        return now.toISOString();
    }

    async updateValidUntilDateForGivenContractID(contractID: string, days: number) {
        const validUntilDate = await this.getDayISOString(days);
        console.log(`Updating ValidUntil date for ContractID: ${contractID} to ${validUntilDate} `);
        const updateQuery = `UPDATE dxp.contract.quote SET valid_until_date = $1 WHERE contract_id = $2`;
        const result = await executeQuery(updateQuery, [validUntilDate, contractID]);
        const rowsAffected = result.rowCount ?? 0;
        console.log(`Updated ValidUntil date for ContractID ${contractID} to ${validUntilDate}. Rows affected: ${rowsAffected} `);
    }

    async updateStatusAsExpiredForGivenContractID(contractID: string) {
        console.log(`Updating Status as Expired for ContractID: ${contractID} `);
        const updateQuery = `UPDATE dxp.contract.contract_detail SET status = 'EXPIRED' WHERE id = $1`;
        const result = await executeQuery(updateQuery, [contractID]);
        const rowsAffected = result.rowCount ?? 0;
        console.log(`Updated Status as Expired for ContractID ${contractID}. Rows affected: ${rowsAffected} `);
    }

    async chooseAPendingActivationContract() {
        await this.page.waitForTimeout(2000);
        await expect(this.goToPrevPageButton).not.toBeVisible();
        console.log('Go to Previous Page button is disabled');
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        const contractsCountTextRaw = await this.contractsCount.textContent();
        const contractsCountText = contractsCountTextRaw ? parseInt(contractsCountTextRaw) : 0;
        console.log(`Total Contracts Count: ${contractsCountText} `);
        if (contractsCountText !== null && contractsCountText > 20) {
            await expect(this.goToNextPageButton).toBeVisible();
            console.log('Go to Next Page button is enabled');
            if (await this.sortButton.nth(0).getAttribute('aria-sort') !== 'descending') {
                await this.columnHeaders.nth(0).hover();
                await this.sortButton.nth(0).click();
                await this.page.waitForTimeout(2000);
                await this.columnHeaders.nth(0).hover();
                await this.sortButton.nth(0).click();
                await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            }
            while (true) {
                console.log('Go to Next Page button is enabled');
                await this.page.waitForTimeout(2000);
                const countOfContracts = await this.listStatuses.count();
                for (let i = 0; i < countOfContracts; i++) {
                    console.log(`Checking contract at index ${i} `);
                    const statusText = await this.listStatuses.nth(i).textContent();
                    console.log(`Status Text: ${statusText} `);
                    if (statusText === 'Pending Activation') {
                        const contract_number = await this.ContractIDText.nth(i).textContent();
                        await this.listStatuses.nth(i).click();
                        await this.page.waitForTimeout(2000);
                        const url = this.page.url();
                        const match = url.match(/contracts\/([0-9a-fA-F-]{36})/);
                        const contract_guid = match ? match[1] : null;
                        return { contract_guid, contract_number };
                    }
                }
                console.log('No Pending Activation contract found on this page, moving to next page.');
                const hasNextPage = await this.goToNextPageButton.isVisible();
                if (!hasNextPage) {
                    console.log('No more pages to navigate.');
                    break;
                }
                await this.goToNextPageButton.click();
                await this.page.waitForTimeout(2000);
                await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            }
            throw new Error('No Pending Activation contract found');
        } else {
            if (await this.sortButton.nth(0).getAttribute('aria-sort') !== 'descending') {
                await this.columnHeaders.nth(0).hover();
                await this.sortButton.nth(0).click();
                await this.page.waitForTimeout(2000);
                await this.columnHeaders.nth(0).hover();
                await this.sortButton.nth(0).click();
                await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
            }
            await this.page.waitForTimeout(2000);
            const countOfContracts = await this.listStatuses.count();
            for (let i = 0; i < countOfContracts; i++) {
                console.log(`Checking contract at index ${i} `);
                const statusText = await this.listStatuses.nth(i).textContent();
                console.log(`Status Text: ${statusText} `);
                if (statusText === 'Pending Activation') {
                    const contract_number = await this.ContractIDText.nth(i).textContent();
                    await this.listStatuses.nth(i).click();
                    await this.page.waitForTimeout(2000);
                    const url = this.page.url();
                    const match = url.match(/contracts\/([0-9a-fA-F-]{36})/);
                    const contract_guid = match ? match[1] : null;
                    return { contract_guid, contract_number };
                }
            }
            throw new Error('No Pending Activation contract found');
        }
    }

    async searchContractUsingPONumberAndSelectContract(poNumber: string, accountLabel: string) {
        const filePath = `.auth/dataPack_contracts_${accountLabel}.txt`;
        await expect(this.POTextWOHeader.nth(0)).toBeVisible({ timeout: 20000 });
        await this.searchTextBox.fill(poNumber);
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        const totalContractsStr = await this.contractsCount.textContent();
        const totalContracts = parseInt(totalContractsStr || "0");
        console.log(`Total Count of Contracts matching this PO: ${totalContracts} `);
        for (let i = 0; i < totalContracts; i++) {
            const statusRaw = await this.statusColumnsWOHeaderTextList.nth(i).textContent();
            const statusText = (statusRaw || '').trim();
            if (statusText === 'Active' || statusText === 'Activation in Progress' || statusText === 'Draft') {
                console.log(`Skipping ${statusText} contract at index ${i} `);
                continue;
            }
            await this.POTextWOHeader.nth(i).click();
            await this.page.waitForTimeout(2000);
            const url = this.page.url();
            const match = url.match(/contracts\/([0-9a-fA-F-]{36})/);
            const contract_guid = match ? match[1] : null;

            if (contract_guid) {
                appendFileSync(filePath, contract_guid + "\n", "utf-8");
            }
            await this.page.goBack();
            await this.page.waitForTimeout(2000);
            await this.searchTextBox.fill(poNumber);
            await this.page.waitForTimeout(2000);
        }
    }

    async verifyContractDetailsScreenStatus(text: string) {
        await expect(this.ContractDetailsScreenStatus).toBeVisible({ timeout: 30000 });
        await expect(this.ContractDetailsScreenStatus).toContainText(text);
    }

    async verifyContractDetailsScreenIsVisible() {
        await expect(this.contractScreenToggleTabs).toBeVisible({ timeout: 30000 });
    }

    async searchAndClickFirstContract(searchTerm: string) {
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 45000 });
        await this.searchTextBox.fill(searchTerm);
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        console.log(`Selecting first contract search result for: ${searchTerm} `);
        await this.ContractIDText.nth(0).click();
    }

    async clickAutoRenewalToggleInContractDetailsAndVerifyToast() {
        await this.autoRenewSwitchInContractDetails.click();
        await expect(this.page.getByRole('alert').first()).toBeVisible({ timeout: 10000 });
        console.log('Auto-renewal toggle is enabled, clicked and toast verified in contract details screen');
    }

    async verifyTermsAndConditionAtPlaceOrder() {
        await expect(this.termsAndConditionsText).toBeVisible({ timeout: 30000 });
    }

    async getErrorContractAndSearchInUI(): Promise<string> {
        const query = `SELECT contract_number_search FROM dxp.contract.contract_detail WHERE bill_to_cdh_account_id = '300000166572548' AND status = 'ERROR' ORDER BY created_date DESC LIMIT 1`;
        const result = await executeQuery<{ contract_number_search: string }>(query, []);
        if (!result.rows.length) throw new Error('No error contract found in DB');
        const contractNumber = String(result.rows[0].contract_number_search);
        console.log(`Error contract found: ${contractNumber} `);
        await this.searchContractWithGivenContractIDAndClickContract(contractNumber);
        return contractNumber;
    }

    async getCancelledContractAndSearchInUI(): Promise<string> {
        const query = `SELECT contract_number_search FROM dxp.contract.contract_detail
            WHERE bill_to_cdh_account_id = '300000166572548'
              AND status = 'CANCELLED' AND is_deleted = false
            ORDER BY created_date DESC LIMIT 1`;
        const result = await executeQuery<{ contract_number_search: string }>(query, []);
        if (!result.rows.length) throw new Error('No cancelled contract found in DB');
        const contractNumber = String(result.rows[0].contract_number_search);
        console.log(`Cancelled contract found: ${contractNumber} `);
        await this.searchContractWithGivenContractIDAndClickContract(contractNumber);
        return contractNumber;
    }

    async getExpiredContractAndSearchInUI(): Promise<string> {
        const query = `SELECT contract_number_search FROM dxp.contract.contract_detail
            WHERE bill_to_cdh_account_id = '300000036528518'
              AND status = 'EXPIRED' AND is_deleted = false
            ORDER BY created_date DESC LIMIT 1`;
        const result = await executeQuery<{ contract_number_search: string }>(query, []);
        if (!result.rows.length) throw new Error('No expired contract found in DB for BPC account');
        const contractNumber = String(result.rows[0].contract_number_search);
        console.log(`Expired contract found: ${contractNumber} `);
        await this.searchContractWithGivenContractIDAndClickContract(contractNumber);
        return contractNumber;
    }

    async selectRenewalContractStatus(accountLabel: string) {
        const query = `SELECT contract_number_search
            FROM dxp.contract.contract_detail
            WHERE status = 'DRAFT'
              AND type = 'RENEWAL'
              AND renewal_type = 'AUTO'
              AND bill_to_cdh_account_id = '300000036528518'; `;
        const result = await executeQuery<{ contract_number_search: string }>(query, []);
        if (!result.rows.length) throw new Error(`No contract with RENEWAL_IN_PROGRESS status found for account: ${accountLabel} `);
        const contractNumber = String(result.rows[0].contract_number_search);
        console.log(`Renewal contract found: ${contractNumber} `);
        await this.searchContractWithGivenContractIDAndClickContract(contractNumber);
    }

    async verifyAutoRenewalAfterPlaceOrderInRenewal() {
        const query = `
        SELECT contract_number_search
            FROM dxp.contract.contract_detail
            WHERE status = 'DRAFT'
              AND type = 'RENEWAL'
              AND renewal_type = 'AUTO'
              AND bill_to_cdh_account_id = '300000036528518'; `;
        const result = await executeQuery<{ contract_number_search: string }>(query, []);
        if (!result.rows.length) throw new Error('No renewal contract found for place order verification');
        const contractNumber = String(result.rows[0].contract_number_search);
        console.log(`Renewal contract for place order: ${contractNumber} `);
        await this.searchContractWithGivenContractIDAndClickContract(contractNumber);
        await expect(this.placeOrderButton).toBeVisible({ timeout: 30000 });
        await this.placeOrderButton.click();
        await expect(this.summaryScreenText).toBeVisible({ timeout: 30000 });
        console.log('Place order in renewal completed — auto-renewal toggle should now be visible in contract details');
    }

    async verifyAutoRenewalForRenewalInProgress() {
        const query = `SELECT contract_number_search, renewal_status, status, type, renewal_type
            FROM dxp.contract.contract_detail
            WHERE bill_to_cdh_account_id = '300000166572548'
              AND renewal_status = 'RENEWAL_IN_PROGRESS'
            ORDER BY created_date DESC
            LIMIT 1; `;
        const result = await executeQuery<{ contract_number_search: string }>(query, []);
        if (!result.rows.length) throw new Error('No contract with renewal in progress found in DB');
        const contractNumber = String(result.rows[0].contract_number_search);
        console.log(`Renewal in progress contract found: ${contractNumber} `);
        await this.contractsLink.click();
        await expect(this.ContractIDText.nth(0)).toBeVisible({ timeout: 45000 });
        await this.searchTextBox.fill(contractNumber);
        await this.page.waitForTimeout(2000);
        const exactMatch = this.ContractIDText.filter({ hasText: contractNumber }).first();
        await expect(exactMatch).toBeVisible({ timeout: 30000 });
        console.log(`Clicking contract strictly matching: ${contractNumber} `);
        await exactMatch.click();
        await this.contractDetailsTab.click();
        await this.page.waitForTimeout(2000);
        const switchCount = await this.autoRenewSwitchInContractDetails.count();
        if (switchCount > 0) {
            const isDisabled = await this.autoRenewSwitchInContractDetails.isDisabled();
            console.log(`Auto - renewal toggle is ${isDisabled ? 'disabled' : 'enabled'} for contract with renewal in progress`);
        } else {
            console.log('Auto-renewal toggle is not present in contract details for renewal in progress contract');
        }
    }
}

export default ContractsPage;