import { expect, Locator, Page } from "@playwright/test";

export class AuditLogPage {
    readonly page: Page;
    readonly auditLogMenu: Locator;
    readonly auditLogContainer: Locator;
    readonly auditLogRows: Locator;
    readonly auditLogFilterButton: Locator;
    readonly adminMenu: Locator;
    readonly pageDescription: Locator;
    readonly dateRangeFilterButton: Locator;
    readonly resetAllButton: Locator;
    readonly includeSystemOperationsCheckbox: Locator;
    readonly resultsSummary: Locator;
    readonly tableHeaders: Locator;
    readonly userFilter: Locator;
    readonly eventFilter: Locator;
    readonly expandAllButton: Locator;
    readonly collapseAllButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.auditLogMenu = page.getByRole('menuitem', { name: 'Audit Logs' });
        this.auditLogContainer = page.getByRole('heading', { name: 'Audit Logs' }).first();
        this.auditLogRows = page.locator('.MuiDataGrid-row');
        this.auditLogFilterButton = page.getByRole('button', { name: 'category-filter' });
        this.adminMenu = page.getByRole('button', { name: 'Admin' });
        this.pageDescription = page.getByText('Monitor account-wide activity, user interactions, and system events.');
        this.dateRangeFilterButton = page.getByRole('button', { name: 'date range filter' });
        this.resetAllButton = page.getByRole('button', { name: 'Reset All' });
        this.includeSystemOperationsCheckbox = page.locator('modus-wc-checkbox', {
            has: page.getByText('Include support and system operations', { exact: true })
        }).locator('input[type="checkbox"]').first();
        this.resultsSummary = page.locator('.MuiTablePagination-displayedRows').first();
        this.tableHeaders = page.locator('[role="columnheader"]');
        this.userFilter = page.locator('modus-wc-autocomplete[button-aria-label="user filter"]');
        this.eventFilter = page.locator('modus-wc-autocomplete').nth(1);
        this.expandAllButton = page.getByRole('button', { name: 'Expand All' }).first();
        this.collapseAllButton = page.getByRole('button', { name: 'Collapse All' }).first();
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private async resolveVisibleLocator(candidates: Locator[], timeoutMs = 10000): Promise<Locator> {
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            for (const candidate of candidates) {
                const locator = candidate.first();
                if (await locator.isVisible().catch(() => false)) {
                    return locator;
                }
            }

            await this.page.waitForTimeout(250);
        }

        throw new Error('Unable to find a visible locator for the audit log action.');
    }

    private dataRows(): Locator {
        return this.auditLogRows.filter({
            has: this.page.getByRole('button', { name: /Expand|Collapse/i }).first()
        });
    }

    private rowCell(row: Locator, index: number): Locator {
        return row.locator('[role="gridcell"]').nth(index);
    }

    private autocompleteInput(autocomplete: Locator): Locator {
        return autocomplete.getByRole('textbox');
    }

    private async firstVisibleDataRow(timeoutMs = 10000): Promise<Locator> {
        const row = this.dataRows().first();
        await expect(row).toBeVisible({ timeout: timeoutMs });
        return row;
    }

    private async waitForGrid(timeoutMs = 10000) {
        await expect(this.auditLogContainer).toBeVisible({ timeout: timeoutMs });
        await expect(this.resultsSummary).toBeVisible({ timeout: timeoutMs });
        await expect(this.tableHeaders.nth(1)).toBeVisible({ timeout: timeoutMs });
    }

    private async waitForInitialResults(timeoutMs = 10000) {
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            const summaryText = ((await this.resultsSummary.textContent().catch(() => '')) ?? '').replace(/\s+/g, ' ').trim();
            const rowCount = await this.dataRows().count().catch(() => 0);
            const loadingVisible = await this.page.getByText('Loading...', { exact: true }).isVisible().catch(() => false);

            if (!loadingVisible && (rowCount > 0 || summaryText.length > 0)) {
                return;
            }

            await this.page.waitForTimeout(250);
        }

        throw new Error(`Timed out after ${timeoutMs}ms waiting for audit log results.`);
    }

    private async performActionAndWaitForResults(action: () => Promise<void>, timeoutMs = 10000) {
        await Promise.all([
            this.page.waitForLoadState('networkidle', { timeout: timeoutMs }).catch(() => undefined),
            action()
        ]);

        await this.waitForGrid(timeoutMs);
        await this.waitForInitialResults(timeoutMs);
    }

    private resolveExpectedTextAndTimeout(
        expectedTextOrTimeout: string | RegExp | number | undefined,
        defaultExpectedText: string | RegExp,
        timeoutMs: number
    ) {
        if (typeof expectedTextOrTimeout === 'number') {
            return { expectedText: defaultExpectedText, timeoutMs: expectedTextOrTimeout };
        }

        return { expectedText: expectedTextOrTimeout ?? defaultExpectedText, timeoutMs };
    }

    private async selectMenuOption(dropdown: Locator, optionName: string, timeoutMs = 10000) {
        const optionPattern = new RegExp(`^${this.escapeRegExp(optionName)}$`, 'i');

        if ((await dropdown.getAttribute('aria-expanded')) !== 'true') {
            await dropdown.click();
        }

        await expect(this.categoryMenu()).toBeVisible({ timeout: timeoutMs });

        const option = await this.resolveVisibleLocator([
            this.categoryMenu().getByRole('menuitemradio', { name: optionPattern }).first(),
            this.categoryMenu().locator('li[role="menuitemradio"]').filter({ hasText: optionPattern }).first(),
            this.categoryMenu().getByRole('button', { name: optionPattern }).first()
        ], timeoutMs);

        await this.performActionAndWaitForResults(() => option.click(), timeoutMs);
    }

    private async selectAutocompleteOption(autocomplete: Locator, searchText: string, optionName: string, timeoutMs = 10000) {
        const input = this.autocompleteInput(autocomplete);
        const optionPattern = new RegExp(`^${this.escapeRegExp(optionName)}$`, 'i');

        await input.click();
        await input.fill(searchText);

        const option = await this.resolveVisibleLocator([
            this.page.getByRole('button', { name: optionPattern }).first(),
            this.page.getByRole('option', { name: optionPattern }).first(),
            this.page.getByText(optionPattern).first()
        ], timeoutMs);

        await this.performActionAndWaitForResults(() => option.click(), timeoutMs);
        await expect(autocomplete).toHaveAttribute('value', optionPattern, { timeout: timeoutMs });
    }

    private totalFromSummary(summaryText: string): number {
        const match = summaryText.match(/out of\s+(\d+)/i);

        if (!match) {
            throw new Error(`Unable to parse audit log summary: ${summaryText}`);
        }

        return Number(match[1]);
    }

    private categoryDropdownCandidates(): Locator[] {
        return [
            this.page.getByRole('button', { name: 'category-filter' }),
            this.page.locator('button[aria-label="category-filter"]'),
            this.auditLogFilterButton
        ];
    }

    private categoryMenu(): Locator {
        return this.page.getByRole('menu', { name: 'Menu' }).first();
    }

    private categoryOptionCandidates(category: string): Locator[] {
        const normalizedCategory = category.trim().replace(/s$/i, '');
        const optionName = new RegExp(`^${this.escapeRegExp(normalizedCategory)}s?$`, 'i');
        const categoryMenu = this.categoryMenu();

        return [
            categoryMenu.getByRole('menuitemradio', { name: optionName }).first(),
            categoryMenu.locator('li[role="menuitemradio"]').filter({ hasText: optionName }).first(),
            categoryMenu.getByRole('button', { name: optionName }).first(),
            categoryMenu.locator('li[role="menuitemradio"] button').filter({ hasText: optionName }).first()
        ];
    }

    private selectedCategoryLabel(dropdown: Locator): Locator {
        return dropdown.locator('.audit-log-filter-dropdown-button span').first();
    }

    private auditLogRowCandidates(recordId: string): Locator[] {
        const exactLink = this.page.getByRole('link', { name: recordId, exact: true });
        const rowText = new RegExp(`(^|\\s)${this.escapeRegExp(recordId)}(\\s|$)`);

        return [
            this.dataRows().filter({ has: exactLink }),
            this.dataRows().filter({ hasText: rowText })
        ];
    }

    private async auditLogRowForRecord(recordId: string, timeoutMs = 10000): Promise<Locator> {
        return this.resolveVisibleLocator(this.auditLogRowCandidates(recordId), timeoutMs);
    }

    async gotoAuditLogs(dealerId: string, timeoutMs = 10000) {
        await this.page.goto(`/${dealerId}/audit-logs`);
        await this.assertLoaded(timeoutMs);
    }

    async assertLoaded(timeoutMs = 10000) {
        await expect(this.auditLogContainer).toBeVisible({ timeout: timeoutMs });
        await expect(this.pageDescription).toBeVisible({ timeout: timeoutMs });
        await this.waitForGrid(timeoutMs);
        await this.waitForInitialResults(timeoutMs);
    }

    async assertTableColumns(expectedColumns = ['Category', 'Event', 'Summary', 'User', 'Reference', 'Timestamp']) {
        await this.waitForGrid();

        const visibleHeaders = (await this.tableHeaders.allInnerTexts())
            .map((text) => text.replace(/\s+/g, ' ').trim())
            .filter(Boolean);

        expect(visibleHeaders).toEqual(expectedColumns);
    }

    async assertTimestampFormat(sampleSize = 5) {
        const rows = this.dataRows();
        const rowCount = Math.min(await rows.count(), sampleSize);
        const timestampPattern = /^\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\s\d{2}:\d{2}$/;

        expect(rowCount).toBeGreaterThan(0);

        for (let index = 0; index < rowCount; index++) {
            const timestamp = (await this.rowCell(rows.nth(index), 6).innerText()).replace(/\s+/g, ' ').trim();
            expect(timestamp).toMatch(timestampPattern);
        }
    }

    async assertDefaultDateRange(timeoutMs = 10000) {
        await expect(this.dateRangeFilterButton).toContainText(/Last 7 days/i, { timeout: timeoutMs });
    }

    async assertDealerSpecificPage(dealerId: string, dealerName?: string, timeoutMs = 10000) {
        expect(this.page.url()).toContain(`/${dealerId}/audit-logs`);

        if (dealerName) {
            const visibleDealerName = await this.resolveVisibleLocator([
                this.page.getByRole('button', { name: new RegExp(this.escapeRegExp(dealerName), 'i') }),
                this.page.getByText(dealerName, { exact: true })
            ], timeoutMs);

            await expect(visibleDealerName).toBeVisible({ timeout: timeoutMs });
        }
    }

    async getResultsSummaryText(): Promise<string> {
        await this.waitForGrid();
        return ((await this.resultsSummary.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    }

    async getResultTotal(): Promise<number> {
        return this.totalFromSummary(await this.getResultsSummaryText());
    }

    async setIncludeSystemOperations(checked: boolean, timeoutMs = 10000) {
        const currentValue = await this.includeSystemOperationsCheckbox.isChecked();

        if (currentValue !== checked) {
            await this.performActionAndWaitForResults(async () => {
                if (checked) {
                    await this.includeSystemOperationsCheckbox.check();
                } else {
                    await this.includeSystemOperationsCheckbox.uncheck();
                }
            }, timeoutMs);
        }

        if (checked) {
            await expect(this.includeSystemOperationsCheckbox).toBeChecked({ timeout: timeoutMs });
        } else {
            await expect(this.includeSystemOperationsCheckbox).not.toBeChecked({ timeout: timeoutMs });
        }
    }

    async selectDateRange(optionName: string, timeoutMs = 10000) {
        await this.selectMenuOption(this.dateRangeFilterButton, optionName, timeoutMs);
        await expect(this.dateRangeFilterButton).toContainText(new RegExp(this.escapeRegExp(optionName), 'i'), { timeout: timeoutMs });
    }

    async selectUserFilter(optionName: string, timeoutMs = 10000) {
        await this.selectAutocompleteOption(this.userFilter, optionName, optionName, timeoutMs);

        const rows = this.dataRows();
        await expect(rows.first()).toBeVisible({ timeout: timeoutMs });
        const rowCount = await rows.count();

        expect(rowCount).toBeGreaterThan(0);

        for (let index = 0; index < rowCount; index++) {
            const actualUser = (await this.rowCell(rows.nth(index), 4).innerText())
                .split('\n')[0]
                .trim();

            expect(actualUser).toBe(optionName);
        }
    }

    async selectEventFilter(optionName: string, timeoutMs = 10000) {
        await this.selectAutocompleteOption(this.eventFilter, optionName, optionName, timeoutMs);

        const rows = this.dataRows();
        await expect(rows.getByRole('gridcell', { name: optionName, exact: true }).first()).toBeVisible({
            timeout: timeoutMs,
        });
        const rowCount = await rows.count();

        expect(rowCount).toBeGreaterThan(0);

        for (let index = 0; index < rowCount; index++) {
            const actualEvent = (await this.rowCell(rows.nth(index), 2).innerText()).trim();
            expect(actualEvent).toBe(optionName);
        }
    }

    async getFirstNonSystemUserName(): Promise<string> {
        const rows = this.dataRows();
        const rowCount = Math.min(await rows.count(), 20);

        for (let index = 0; index < rowCount; index++) {
            const userLines = (await this.rowCell(rows.nth(index), 4).innerText())
                .split('\n')
                .map((text) => text.trim())
                .filter(Boolean);

            if (userLines.length >= 2 && userLines[0].toLowerCase() !== 'system') {
                return userLines[0];
            }
        }

        throw new Error('Unable to find a non-system audit log user in the current results.');
    }

    async getFirstVisibleEventName(): Promise<string> {
        const firstRow = await this.firstVisibleDataRow();
        return (await this.rowCell(firstRow, 2).innerText()).replace(/\s+/g, ' ').trim();
    }

    async assertVisibleUserCellsExclude(userName: string, sampleSize = 20) {
        const rows = this.dataRows();
        const rowCount = Math.min(await rows.count(), sampleSize);
        const forbiddenUser = new RegExp(`^${this.escapeRegExp(userName)}$`, 'i');

        for (let index = 0; index < rowCount; index++) {
            const userText = (await this.rowCell(rows.nth(index), 4).innerText())
                .split('\n')
                .map((text) => text.trim())
                .filter(Boolean)[0] ?? '';

            expect(userText).not.toMatch(forbiddenUser);
        }
    }

    async resetFilters(timeoutMs = 10000) {
        await this.page.keyboard.press('Escape').catch(() => undefined);
        await this.performActionAndWaitForResults(() => this.resetAllButton.click({ force: true }), timeoutMs);
        await expect(this.userFilter).toHaveAttribute('value', /All/i, { timeout: timeoutMs });
        await expect(this.eventFilter).toHaveAttribute('value', /All/i, { timeout: timeoutMs });
        await expect(this.selectedCategoryLabel(this.auditLogFilterButton)).toHaveText(/^All$/i, { timeout: timeoutMs });
        await expect(this.dateRangeFilterButton).toContainText(/Last 7 days/i, { timeout: timeoutMs });
        await expect(this.includeSystemOperationsCheckbox).toBeChecked({ timeout: timeoutMs });
    }

    async navigateToFirstReferenceInCategory(category: string, expectedUrlPattern: RegExp, timeoutMs = 10000) {
        await this.filterAuditLogsByCategory(category, timeoutMs);

        const referenceLink = this.dataRows().getByRole('link').first();

        await expect(referenceLink).toBeVisible({ timeout: timeoutMs });

        await Promise.all([
            this.page.waitForURL(expectedUrlPattern, { timeout: timeoutMs }),
            referenceLink.click()
        ]);
    }

    async assertDealerCategoryEntry(dealerName: string, timeoutMs = 10000) {
        await this.filterAuditLogsByCategory('Dealer', timeoutMs);

        const firstRow = await this.firstVisibleDataRow(timeoutMs);
        await expect(firstRow).toContainText(/Dealer/i, { timeout: timeoutMs });
        await expect(firstRow).toContainText(dealerName, { timeout: timeoutMs });
    }

    async expandFirstAuditLogRow(timeoutMs = 10000) {
        if (await this.collapseAllButton.isVisible().catch(() => false)) {
            return;
        }

        await expect(this.expandAllButton).toBeVisible({ timeout: timeoutMs });
        await this.expandAllButton.click({ force: true });
        await expect(this.collapseAllButton).toBeVisible({ timeout: timeoutMs });
    }

    async collapseFirstAuditLogRow(timeoutMs = 10000) {
        await expect(this.collapseAllButton).toBeVisible({ timeout: timeoutMs });
        await this.collapseAllButton.click({ force: true });
        await expect(this.expandAllButton).toBeVisible({ timeout: timeoutMs });
    }

    async assertAuditLogPage() {
        await expect(this.adminMenu).toBeVisible({ timeout: 10000 });
        console.log('Admin Menu is displayed');
        await this.adminMenu.click();
        await expect(this.auditLogMenu).toBeVisible({ timeout: 10000 });
        console.log('Audit Log Menu is displayed');
        await this.auditLogMenu.click();
        await this.assertLoaded(10000);
        console.log('Audit Log Page is displayed');
    }

    async filterAuditLogsByCategory(category: string, timeoutMs = 10000) {
        const normalizedCategory = category.trim().replace(/s$/i, '');
        const optionName = new RegExp(`^${this.escapeRegExp(normalizedCategory)}s?$`, 'i');
        const optionText = new RegExp(`${this.escapeRegExp(normalizedCategory)}s?`, 'i');

        const categoryDropdown = await this.resolveVisibleLocator(this.categoryDropdownCandidates(), timeoutMs);
        if ((await categoryDropdown.getAttribute('aria-expanded')) !== 'true') {
            await categoryDropdown.click();
        }

        await expect(this.categoryMenu()).toBeVisible({ timeout: timeoutMs });

        const categoryOption = await this.resolveVisibleLocator(this.categoryOptionCandidates(category), timeoutMs);
        await this.performActionAndWaitForResults(() => categoryOption.click(), timeoutMs);

        const firstAuditLogRow = await this.firstVisibleDataRow(timeoutMs);

        await expect(this.selectedCategoryLabel(categoryDropdown)).toHaveText(optionName, { timeout: timeoutMs });
        await expect(firstAuditLogRow).toContainText(optionText, { timeout: timeoutMs });
    }

    async verifySuperkeyAuditLog(
        serialNumber: string,
        superkeySku: string,
        expectedSummary: string,
        timeoutMs = 10000,
    ) {
        await this.assertLoaded(timeoutMs);
        await this.selectEventFilter('Superkey Management', timeoutMs);

        const auditLogRow = await this.expandAuditLogForRecord(serialNumber, timeoutMs);
        await expect(auditLogRow).toContainText(serialNumber, { timeout: timeoutMs });
        await expect(auditLogRow).toContainText(expectedSummary, { timeout: timeoutMs });
        await expect(this.rowCell(auditLogRow, 4)).toHaveText(/\S+/, { timeout: timeoutMs });
        const now = new Date();
        const currentDate = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`;
        await expect(this.rowCell(auditLogRow, 6)).toContainText(currentDate, { timeout: timeoutMs });
        await expect(this.page.getByText(superkeySku, { exact: true })).toBeVisible({ timeout: timeoutMs });
    }

    private async expandAuditLogForRecord(recordId: string, timeoutMs = 10000) {
        const auditLogRow = await this.auditLogRowForRecord(recordId, timeoutMs);

        const expandButton = auditLogRow.getByRole('button', { name: /Expand|Collapse/i }).first();
        await expect(expandButton).toBeVisible({ timeout: timeoutMs });
        await expandButton.scrollIntoViewIfNeeded();

        const expandButtonLabel = (await expandButton.getAttribute('aria-label')) ?? '';

        if (expandButtonLabel.toLowerCase() !== 'collapse') {
            await expandButton.click({ force: true });
        }

        await expect(auditLogRow.getByRole('button', { name: 'Collapse' }).first()).toBeVisible({ timeout: timeoutMs });
        return auditLogRow;
    }

    async verifyLatestContractAuditLog(contractId: string, expectedTextOrTimeout: string | RegExp | number = /Order Placed/i, timeoutMs = 10000) {
        const { expectedText, timeoutMs: resolvedTimeout } = this.resolveExpectedTextAndTimeout(expectedTextOrTimeout, /Order Placed/i, timeoutMs);

        await this.setIncludeSystemOperations(false, resolvedTimeout);

        const auditLogRow = await this.expandAuditLogForRecord(contractId, resolvedTimeout);
        await expect(auditLogRow).toContainText(expectedText, { timeout: resolvedTimeout });
        await expect(auditLogRow.getByRole('link', { name: contractId, exact: true }).first()).toBeVisible({ timeout: resolvedTimeout });
        console.log(`Latest audit log is for contract: ${contractId}`);
    }

    async verifyLatestAmendmentAuditLog(quoteId: string, expectedTextOrTimeout: string | RegExp | number = /Amendment Order Placed/i, timeoutMs = 10000) {
        const { expectedText, timeoutMs: resolvedTimeout } = this.resolveExpectedTextAndTimeout(expectedTextOrTimeout, /Amendment Order Placed/i, timeoutMs);

        await this.setIncludeSystemOperations(false, resolvedTimeout);

        const auditLogRow = await this.expandAuditLogForRecord(quoteId, resolvedTimeout);
        await expect(auditLogRow).toContainText(expectedText, { timeout: resolvedTimeout });
        await expect(auditLogRow.getByRole('link', { name: quoteId, exact: true }).first()).toBeVisible({ timeout: resolvedTimeout });
        console.log(`Latest audit log is for amendment quote: ${quoteId}`);
    }
}
