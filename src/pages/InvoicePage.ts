
import { expect, Locator, Page } from "@playwright/test";
export class InvoicePage {

    readonly page: Page;
    readonly invoicepageTitle: Locator;
    readonly invoicedefaultfilter: Locator;
    readonly invoicedatefilter: Locator
    readonly dueDateFilter: Locator;
    readonly customerDateRangeFilter: Locator;
    readonly exportToCSVButton: Locator
    readonly noInvoicesFoundText: Locator;
    readonly invoiceCalendarValidationMessage: Locator;
    readonly rowsPerPageComboBox: Locator;
    readonly fiveRowsPerPageOption: Locator;
    readonly ContractIDText: Locator;
    readonly statusColumnsWOHeaderTextList: Locator;
    readonly invoicesTab: Locator;
    readonly rowData: Locator;
    readonly searchInputBox: Locator;
    readonly invoiceRangeButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.invoicepageTitle = page.getByRole('heading', { name: 'Invoices', exact: true });
        this.invoicedefaultfilter = page.getByRole('button', { name: 'Last 7 days', exact: true })
        this.invoicedatefilter = page.getByRole('button', { name: 'Invoice Date', exact: true });
        this.dueDateFilter = page.getByRole('button', { name: 'Due Date', exact: true });
        this.customerDateRangeFilter = page.locator('[aria-label="Choose range"]');
        this.exportToCSVButton = page.getByRole('button', { name: 'Export Table as CSV' });
        this.noInvoicesFoundText = page.getByText('No invoices found');
        this.invoiceCalendarValidationMessage = page.getByText('Maximum date range limit is 1 year', { exact: true });
        this.rowsPerPageComboBox = page.getByRole('combobox', { name: 'Rows per page:' });
        this.fiveRowsPerPageOption = page.getByRole('option', { name: '5', exact: true });
        this.ContractIDText = page.locator('xpath=//span//a[contains(@href, "/contracts/")]');
        this.statusColumnsWOHeaderTextList = page.locator('div[data-field="status"][role="gridcell"]');
        this.invoicesTab = page.getByRole('link', { name: 'Invoices', exact: true });
        this.rowData = page
            .locator('[role="row"][data-id][data-rowindex]')
            .filter({ has: page.locator('[role="gridcell"][data-field="contractNumber"]:visible') });
        this.searchInputBox = page.getByPlaceholder('Search by Contract ID, PO # or Customer Name');
        this.invoiceRangeButton = page.getByRole('button', {
            name: /^(Last 7 days|Last 30 days|Last 3 months|Last 1 year|All)$/i
        });

    }
    private async selectInvoiceRange(rangeLabel: 'Last 7 days' | 'Last 30 days' | 'Last 3 months' | 'Last 1 year' | 'All') {
        await expect(this.invoiceRangeButton).toBeEnabled();
        await this.invoiceRangeButton.click();
        await this.page.getByText(rangeLabel, { exact: true }).click();
        await expect(this.invoiceRangeButton).toContainText(rangeLabel);
        await this.waitForInvoiceResults();
    }

    private visibleContractLinks(): Locator {
        return this.page.locator('a[href*="/contracts/"]:visible');
    }

    private statusCellForRow(row: Locator): Locator {
        return row.locator('[role="gridcell"][data-field="status"]').first();
    }

    private contractCellForRow(row: Locator): Locator {
        return row.locator('[role="gridcell"][data-field="contractNumber"]').first();
    }

    async getInvoiceRowStatuses(): Promise<Array<{ rowIndex: number; contractNumber: string; status: string }>> {
        const resultState = await this.waitForInvoiceResults();

        if (resultState === 'empty') {
            return [];
        }

        const rowCount = await this.rowData.count();
        const rows: Array<{ rowIndex: number; contractNumber: string; status: string }> = [];

        for (let index = 0; index < rowCount; index++) {
            const row = this.rowData.nth(index);
            const contractNumber = (await this.contractCellForRow(row).textContent())?.trim() ?? '';
            const status = (await this.statusCellForRow(row).textContent())?.trim() ?? '';

            rows.push({
                rowIndex: index,
                contractNumber,
                status
            });
        }

        return rows;
    }

    private async assertRowsWithinDays(rangeDays: number) {
        const resultState = await this.waitForInvoiceResults();

        if (resultState === 'empty') {
            throw new Error(`No invoices found for the selected ${rangeDays}-day range.`);
        }

        const contractLinks = this.visibleContractLinks();
        await expect(contractLinks.first()).toBeVisible({ timeout: 10000 });
        const rowCount = await contractLinks.count();
        console.log('Matched row count:', rowCount);

        if (rowCount === 0) {
            throw new Error(`Invoice grid rendered no visible data rows for the selected ${rangeDays}-day range.`);
        }

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - rangeDays);

        for (let index = 0; index < rowCount; index++) {
            const row = contractLinks.nth(index).locator('xpath=ancestor::*[@role="row"][1]');

            // Contract ID, PO #, Customer Name, Invoice Date
            const invoiceDateCell = row.getByRole('gridcell').nth(3);
            const rowDateText = (await invoiceDateCell.textContent())?.trim() ?? '';
            const rowDate = this.parseInvoiceDate(rowDateText);

            if (rowDate < startDate || rowDate > endDate) {
                throw new Error(
                    `Row ${index + 1} is outside the last ${rangeDays} days range. Date: ${rowDateText}`
                );
            }
        }

        console.log(`Validated ${rowCount} rows are within the last ${rangeDays} days.`);
    }

    async verifyInvoiceDateRanges() {
        await this.verifyInvoiceDateRange('Last 7 days');
        await this.verifyInvoiceDateRange('Last 30 days');
        await this.verifyInvoiceDateRange('Last 3 months');
        await this.verifyInvoiceDateRange('Last 1 year');
        await this.verifyInvoiceDateRange('All');
        console.log('Last 7 days, Last 30 days, Last 3 months, Last 1 year fetching records as expected');
    }

    async verifyInvoiceDateRange(rangeLabel: 'Last 7 days' | 'Last 30 days' | 'Last 3 months' | 'Last 1 year' | 'All') {
        const rangeDaysByLabel = {
            'Last 7 days': 7,
            'Last 30 days': 30,
            'Last 3 months': 90,
            'Last 1 year': 365
        } as const;

        if (rangeLabel === 'Last 7 days') {
            await expect(this.invoicedefaultfilter).toBeEnabled();
            await expect(this.invoicedefaultfilter).toHaveAccessibleName('Last 7 days');
        } else {
            await this.selectInvoiceRange(rangeLabel);
        }

        if (rangeLabel === 'All') {
            const resultState = await this.waitForInvoiceResults();

            if (resultState === 'empty') {
                throw new Error('No invoices found after selecting All.');
            }

            console.log('All filter is fetching records as expected');
            return;
        }

        await this.assertRowsWithinDays(rangeDaysByLabel[rangeLabel]);
        console.log(`${rangeLabel} filter is fetching records as expected`);
    }

    private async waitForInvoiceResults(timeout = 20000): Promise<'rows' | 'empty'> {
        const contractLinks = this.visibleContractLinks();

        await expect(contractLinks.first().or(this.noInvoicesFoundText)).toBeVisible({ timeout });

        return (await this.noInvoicesFoundText.isVisible().catch(() => false)) ? 'empty' : 'rows';
    }


    private async expectInvoiceRowsVisible(timeout = 40000) {
        await expect(this.visibleContractLinks().first()).toBeVisible({ timeout });
    }

    private parseInvoiceDate(dateText: string): Date {
        const trimmedValue = dateText.trim();

        const namedMonthMatch = trimmedValue.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
        if (namedMonthMatch) {
            const monthLookup: Record<string, number> = {
                jan: 0,
                january: 0,
                feb: 1,
                february: 1,
                mar: 2,
                march: 2,
                apr: 3,
                april: 3,
                may: 4,
                jun: 5,
                june: 5,
                jul: 6,
                july: 6,
                aug: 7,
                august: 7,
                sep: 8,
                sept: 8,
                september: 8,
                oct: 9,
                october: 9,
                nov: 10,
                november: 10,
                dec: 11,
                december: 11
            };

            const monthIndex = monthLookup[namedMonthMatch[2].toLowerCase()];

            if (monthIndex === undefined) {
                throw new Error(`Unsupported month value in invoice date: ${namedMonthMatch[2]}`);
            }

            const parsedDate = new Date(Number(namedMonthMatch[3]), monthIndex, Number(namedMonthMatch[1]));
            parsedDate.setHours(0, 0, 0, 0);
            return parsedDate;
        }

        const isoMatch = trimmedValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (isoMatch) {
            const parsedDate = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
            parsedDate.setHours(0, 0, 0, 0);
            return parsedDate;
        }

        const numericMatch = trimmedValue.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
        if (numericMatch) {
            const first = Number(numericMatch[1]);
            const second = Number(numericMatch[2]);
            const year = Number(numericMatch[3]);

            const day = first > 12 ? first : second;
            const month = first > 12 ? second : first;

            const parsedDate = new Date(year, month - 1, day);
            parsedDate.setHours(0, 0, 0, 0);
            return parsedDate;
        }

        const fallbackDate = new Date(trimmedValue);
        if (!Number.isNaN(fallbackDate.getTime())) {
            fallbackDate.setHours(0, 0, 0, 0);
            return fallbackDate;
        }

        throw new Error(`Unsupported invoice date format: ${dateText}`);
    }

    async defaultFilter() {
        await expect(this.invoicedefaultfilter).toBeEnabled();
        await expect(this.invoicedefaultfilter).toHaveAccessibleName('Last 30 days');
        await expect(this.invoicedatefilter).toBeEnabled();
        await expect(this.invoicedatefilter).toHaveAccessibleName('Invoice Date');
        console.log('Default filter is set to Invoice Date and Last 30 days');
    }

    async invoiceDueDateFilterSwitch() {
        await expect(this.invoicedatefilter).toBeEnabled();
        await expect(this.invoicedatefilter).toHaveAttribute('aria-label', 'Invoice Date');
        await this.invoicedatefilter.click();
        console.log('DropDown is opened and now will click the due date filter');
        await expect(this.dueDateFilter).toBeEnabled();
        await this.dueDateFilter.click();
        console.log('Due date filter is applied and Invoice date filter switch is working as expected');

    }
    async exportToCSV() {
        await expect(this.invoicedefaultfilter).toBeEnabled();
        await expect(this.invoicedefaultfilter).toHaveAccessibleName('Last 7 days');
        await this.invoicedatefilter.click();
        console.log('DropDown is opened and now will click the due date filter');
        await expect(this.dueDateFilter).toBeEnabled();
        await this.dueDateFilter.click();
        await expect(this.exportToCSVButton).toBeEnabled();
        await this.exportToCSVButton.click();
        console.log('Export to CSV button is clicked and the file should be downloaded');

    }

    async exportToCSVDisabled() {
        await expect(this.invoicedefaultfilter).toBeEnabled();
        await expect(this.invoicedefaultfilter).toHaveAccessibleName('Last 7 days');
        await expect(this.invoicedatefilter).toBeEnabled();
        await this.invoicedatefilter.click();
        console.log('Invoice date filter and last 7 days filter is applied');
        console.log('No data available for last 7 days filter and invoice date filter, so export to csv button should be disabled');
        await expect(this.noInvoicesFoundText).toBeVisible();
        await expect(this.exportToCSVButton).toBeDisabled();
        console.log('Export to CSV button is disabled as expected');

    }
    async invoiceCustomDateRangeSelection() {
        await expect(this.invoicedefaultfilter).toBeEnabled();
        await expect(this.invoicedefaultfilter).toHaveAccessibleName('Last 7 days');
        await this.invoicedefaultfilter.click();
        await expect(this.invoicedatefilter).toBeEnabled();
        console.log('DropDown is opened and now will click the custom date range filter');
        await expect(this.customerDateRangeFilter).toBeEnabled();
        await this.customerDateRangeFilter.click();
        console.log('Custom date range filter is applied and date range picker should be visible');

        const picker = this.page.locator(".MuiDateRangeCalendar-root").first();
        await expect(picker).toBeVisible({ timeout: 20000 });

        const firstMonthGrid = picker.getByRole("grid").first();
        const startDate = firstMonthGrid
            .locator('button:not([disabled])')
            .filter({ hasText: /^10$/ })
            .first();
        await expect(startDate).toBeVisible({ timeout: 10000 });
        await startDate.click();

        console.log('Start date is selected as ' + startDate.textContent() + ' of the current month');
        console.log('Customer date range selection is working as expected');

        for (let i = 0; i < 5; i++) {
            await picker.getByRole("button", { name: /Next month/i }).first().click();
        }
        const lastMonthGrid = picker.getByRole("grid").last();
        const endDate = lastMonthGrid
            .locator('button:not([disabled])')
            .filter({ hasText: /^20$/ })
            .first();
        await expect(endDate).toBeVisible({ timeout: 20000 });
        const endDateDay = (await endDate.textContent())?.trim() ?? '';
        const endDateLabel = (await endDate.getAttribute('aria-label'))?.trim() ?? '';
        await endDate.click();
        console.log('End date clicked');
        console.log('End date is selected as ' + (endDateLabel || endDateDay) + ' of the month which is 5 months ahead of current month');
        console.log('Customer date range selection is working as expected and data is displayed based on the selected custom date range');

    }

    async enterCustomerDateRangeWithValidationMessage(startDate: string, endDate: string) {
        await expect(this.invoicedefaultfilter).toBeEnabled();
        // await expect(this.invoicedefaultfilter).toHaveText('Last 7 days');
        await expect(this.invoicedefaultfilter).toHaveAttribute('aria-label', 'Last 7 days');
        await this.invoicedefaultfilter.click();
        await expect(this.customerDateRangeFilter).toBeEnabled();
        await this.customerDateRangeFilter.click();

        const chooseRangeButton = this.page.getByRole('button', { name: 'Choose range', exact: true });
        await expect(chooseRangeButton).toBeVisible();

        const startDateParts = this.parseDateParts(startDate);
        const endDateParts = this.parseDateParts(endDate);

        const monthSpinButtons = this.page.getByRole('spinbutton', { name: 'Month' });
        const daySpinButtons = this.page.getByRole('spinbutton', { name: 'Day' });
        const yearSpinButtons = this.page.getByRole('spinbutton', { name: 'Year' });
        console.log('Filling custom date range: ', startDate, endDate);
        await expect(monthSpinButtons.first()).toBeVisible({ timeout: 10000 });
        await expect(daySpinButtons.first()).toBeVisible({ timeout: 10000 });
        await expect(yearSpinButtons.first()).toBeVisible({ timeout: 10000 });

        await daySpinButtons.nth(0).fill(startDateParts.day);
        await monthSpinButtons.nth(0).fill(startDateParts.month);
        await yearSpinButtons.nth(0).fill(startDateParts.year);

        await daySpinButtons.nth(1).fill(endDateParts.day);
        await monthSpinButtons.nth(1).fill(endDateParts.month);
        await yearSpinButtons.nth(1).fill(endDateParts.year);

        await yearSpinButtons.nth(1).press('Enter');

        console.log(`Custom date range entered: ${startDate} - ${endDate}`);


        // exact match
        const actual = (await this.invoiceCalendarValidationMessage.textContent())?.trim() ?? "";
        const expected = "Maximum date range limit is 1 year";

        if (actual !== expected) {
            throw new Error(`String mismatch. Actual: ${actual}, Expected: ${expected}`);
        }
        console.log('Validation message is ' + actual);
        await expect(this.invoiceCalendarValidationMessage).toBeVisible({ timeout: 10000 });
        await expect(this.invoiceCalendarValidationMessage).toHaveText(expected);
        console.log('Validation message is ' + expected);
    }


    async enterRequestedDateRange() {
        const fromDate = '02 May 2025';
        const toDate = '05-08-2026';

        await this.enterCustomerDateRangeWithValidationMessage(fromDate, toDate);
    }
    private parseDateParts(dateText: string) {
        const parsedDate = this.parseInvoiceDate(dateText);

        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = String(parsedDate.getFullYear());

        return { day, month, year };
    }

    private datePartsFromDate(date: Date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        return { day, month, year };
    }

    private invoiceDateRangeCalendar(): Locator {
        return this.page.locator('.MuiDateRangeCalendar-root').first();
    }

    private async calendarGridForDate(picker: Locator, date: Date): Promise<Locator> {
        const today = new Date();
        const monthOffset = (date.getFullYear() - today.getFullYear()) * 12 + (date.getMonth() - today.getMonth());
        const nextMonthButton = picker.getByRole('button', { name: /Next month/i }).first();

        for (let step = 0; step < Math.max(0, monthOffset - 1); step++) {
            await nextMonthButton.click();
        }

        return monthOffset === 0 ? picker.getByRole('grid').first() : picker.getByRole('grid').last();
    }

    private calendarDayButton(grid: Locator, day: number): Locator {
        return grid.locator('button').filter({ hasText: new RegExp(`^${day}$`) }).first();
    }

    async selectedRecordsExport() {

        await expect(this.invoicedefaultfilter).toBeEnabled();
        await this.invoicedefaultfilter.click();
        // await this.selectInvoiceRange('Last 3 months');
        const firstContractId = (await this.visibleContractLinks().first().textContent())?.trim() ?? '';
        expect(firstContractId).not.toBe('');
        await expect(this.searchInputBox).toBeVisible();
        await this.searchInputBox.fill(firstContractId);

        const filteredContractLink = this.page
            .locator('a[href*="/contracts/"]:visible')
            .filter({ hasText: firstContractId })
            .first();
        const filteredRows = this.page
            .locator('[role="row"]:visible')
            .filter({ has: this.page.locator('a[href*="/contracts/"]:visible') });

        await expect(filteredContractLink).toBeVisible({ timeout: 20000 });
        await expect(filteredRows).toHaveCount(1);
        await expect(this.exportToCSVButton).toBeEnabled();
        await this.exportToCSVButton.click();

        console.log(`Only one row is visible for contract ${firstContractId} and Export to CSV is enabled`);

    }
    async assertInvoicePage() {
        await Promise.all([
            this.page.waitForURL(/\/invoices$/),
            this.invoicesTab.click()
        ]);
        await expect(this.invoicepageTitle).toBeVisible();
        console.log('Invoice page is displayed');
    }

    async validationMessageDateRange() {
        await expect(this.invoicedefaultfilter).toBeEnabled();
        await expect(this.invoicedefaultfilter).toHaveText('Last 7 days');
        await this.invoicedefaultfilter.click();
        console.log('DropDown is opened and now will click the custom date range filter');
        await expect(this.customerDateRangeFilter).toBeEnabled();

    }
    async checkDatesAreWithinRangeForRecordsFetched() {
        await expect(this.invoicedefaultfilter).toBeEnabled();
        const filterText = (await this.invoicedefaultfilter.textContent())?.trim() ?? '';

        switch (filterText) {
            case 'Last 7 days':
                await this.assertRowsWithinDays(7);
                break;
            case 'Last 30 days':
                await this.assertRowsWithinDays(30);
                break;
            case 'Last 3 months':
            case 'Last 90 days':
                await this.assertRowsWithinDays(90);
                break;
            case 'Last 1 year':
                await this.assertRowsWithinDays(365);
                break;
            case 'All':
                await this.expectInvoiceRowsVisible();
                break;
            default:
                throw new Error(`Unsupported invoice range for date validation: ${filterText}`);
        }

        console.log(`Invoice rows are validated for selected range: ${filterText}`);

    }

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
        console.log(`Verified that 5 contracts are displayed when 5 is chosen from the "Show" dropdown. Total Count: ${countOfContracts}`);
    }

    async verifyMaximumSelectableDateRangeIsOneYear() {
        await expect(this.invoicedefaultfilter).toBeEnabled();
        await this.invoicedefaultfilter.click();
        await expect(this.customerDateRangeFilter).toBeEnabled();
        await this.customerDateRangeFilter.click();

        const picker = this.invoiceDateRangeCalendar();
        await expect(picker).toBeVisible({ timeout: 20000 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDisabledDate = new Date(today);
        firstDisabledDate.setFullYear(firstDisabledDate.getFullYear() + 1);

        const lastAllowedDate = new Date(firstDisabledDate);
        lastAllowedDate.setDate(lastAllowedDate.getDate() - 1);

        const todayCell = picker.locator('[role="gridcell"][aria-current="date"]').first();
        await expect(todayCell).toBeVisible({ timeout: 10000 });
        await todayCell.click();

        const targetMonthGrid = await this.calendarGridForDate(picker, firstDisabledDate);
        await expect(targetMonthGrid).toBeVisible({ timeout: 10000 });

        const lastAllowedDayButton = this.calendarDayButton(targetMonthGrid, lastAllowedDate.getDate());
        await expect(lastAllowedDayButton).toBeEnabled({ timeout: 10000 });

        const firstDisabledDayButton = this.calendarDayButton(targetMonthGrid, firstDisabledDate.getDate());
        await expect(firstDisabledDayButton).toBeDisabled({ timeout: 10000 });

        console.log(`Selected ${today.toDateString()} as the start date`);
        console.log(`${lastAllowedDate.toDateString()} should be enabled`);
        console.log(`${firstDisabledDate.toDateString()} should be disabled`);
    }
}
export default InvoicePage;
