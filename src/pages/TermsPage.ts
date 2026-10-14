import { expect, Locator, Page } from "@playwright/test";
import { CustomerDetailsPage } from "./customer/CustomerDetailsPage";
export class TermsPage {

    readonly page: Page;
    readonly MAX_FUTURE_DAYS = 30;
    readonly contractTerms: Locator | undefined;
    readonly customersListComboBox: Locator | undefined;
    readonly cancelButton: Locator;
    readonly continueButton: Locator;
    readonly customerRequiredErrorText: Locator | undefined;
    readonly createNewContractHeadingText: Locator;
    readonly contractTermsText: Locator;
    readonly termLengthText: Locator;
    readonly termLengthSubText: Locator;
    readonly termLengthUomDropdown: Locator;
    readonly yearsTermLengthButton: Locator;
    readonly monthsTermLengthButton: Locator;
    readonly termLengthTextBox: Locator;
    readonly termLengthGTOneErrorMessage: Locator;
    readonly termLengthLTFiveErrorMessage: Locator;
    readonly autoRenewToggle: Locator;
    readonly autoRenewalTitle: Locator;
    readonly startDateBasedOnOrderButton: Locator;
    readonly startDateBasedOnFutureButton: Locator;
    readonly clearDateButton: Locator;
    readonly daySpinButton: Locator;
    readonly monthSpinButton: Locator;
    readonly yearSpinButton: Locator;
    readonly calendarPicker: Locator;
    readonly dateGridcell: Locator;
    readonly nextMonthButton: Locator;
    readonly startDateAfterErrorText: Locator;
    readonly startDateBeforeErrorText: Locator
    readonly startDateRequiredErrorText: Locator;
    readonly addNewContractText: Locator;
    readonly contactUsLink: Locator;
    readonly monthlyValidationLT1: Locator;
    readonly monthlyValidationGT11: Locator;
    readonly autoRenewalTextMonthlyVisible: Locator;
    readonly enterMonth: Locator;
    readonly enterDay: Locator;
    readonly enterYear: Locator;
    readonly currencyDropdown: Locator;
    readonly currencyUSD: Locator;
    readonly currencyEUR: Locator;

    constructor(page: Page) {
        this.page = page;
        const termsPanel = page.locator('[role="tabpanel"]:not([hidden])');
        this.createNewContractHeadingText = page.getByRole('heading', { name: 'Create new contract' });
        this.cancelButton = termsPanel.getByTestId('create-contract-cancel-button');
        this.contractTermsText = termsPanel.getByRole('heading', { name: 'Set Contract Details' });
        this.termLengthText = termsPanel.getByText('Term Length', { exact: true }).first();
        this.termLengthUomDropdown = termsPanel.locator('#term-uom').getByRole('button', { name: 'Term Length' });
        this.yearsTermLengthButton = page.getByRole('menuitemradio', { name: 'Years' });
        this.monthsTermLengthButton = page.getByRole('menuitemradio', { name: 'Months' });
        this.termLengthTextBox = termsPanel.locator('#term-quantity');
        this.termLengthGTOneErrorMessage = page.getByText('Number must be greater than or equal to 1');
        this.termLengthLTFiveErrorMessage = page.getByText('Term length must be no more than 5 years.');
        this.autoRenewToggle = termsPanel.getByRole('switch', { name: 'Auto-Renewal' });
        this.autoRenewalTitle = termsPanel.getByTestId('auto-renewal-title');
        this.startDateBasedOnOrderButton = termsPanel.locator('#now');
        this.startDateBasedOnFutureButton = termsPanel.locator('#future');
        this.clearDateButton = page.getByRole('button', { name: 'Clear' });
        this.daySpinButton = page.getByRole('spinbutton', { name: 'Day' });
        this.monthSpinButton = page.getByRole('spinbutton', { name: 'Month' });
        this.yearSpinButton = page.getByRole('spinbutton', { name: 'Year' });
        this.calendarPicker = page.getByRole('button', { name: 'Choose date' });
        this.dateGridcell = page.getByRole('gridcell');
        this.nextMonthButton = page.getByRole('button', { name: 'Next month' });
        this.continueButton = termsPanel.getByTestId('create-contract-continue-button');
        this.startDateAfterErrorText = page.getByText('Start date must be after');
        this.startDateBeforeErrorText = page.getByText('Start date must be before');
        this.startDateRequiredErrorText = page.getByText('Start date is required');
        this.addNewContractText = page.getByText('To add a new bill-to contact');
        this.contactUsLink = page.getByRole('link', { name: 'here' });
        this.termLengthSubText = termsPanel.getByText('Set the type of contract, the length, start date and currency that will be applied to this contract');
        this.monthlyValidationLT1 = page.getByText('Too small: expected number to be >=1');
        this.monthlyValidationGT11 = page.getByText('Too big: expected number to be <=11');
        this.autoRenewalTextMonthlyVisible = termsPanel.getByText(/month to month basis/i);
        this.enterMonth = page.getByRole('spinbutton', { name: 'Month' })
        this.enterDay = page.getByRole('spinbutton', { name: 'Day' });
        this.enterYear = page.getByRole('spinbutton', { name: 'Year' });
        this.currencyDropdown = termsPanel.locator('#currency-select');
        this.currencyUSD = page.locator('[data-value="USD"]');
        this.currencyEUR = page.locator('[data-value="EUR"]');
    }

    async termsPageAssertion() {
        await expect(this.createNewContractHeadingText).toBeVisible();
        await expect(this.contractTermsText).toBeVisible();
        await expect(this.termLengthText).toBeVisible();
        await expect(this.termLengthSubText).toBeVisible();
    }

    async CancelAndGoToCustomerDetailsPage(): Promise<CustomerDetailsPage> {
        await this.cancelButton.scrollIntoViewIfNeeded();
        await this.cancelButton.click();
        const customerDetailsPage = new CustomerDetailsPage(this.page);
        await expect(customerDetailsPage.customerNameLbl).toBeVisible();
        return customerDetailsPage;
    }

    async enterTermLength(termLength: string, uom: string) {
        await this.termLengthUomDropdown.click();
        uom == "month" ? await this.monthsTermLengthButton.click() : await this.yearsTermLengthButton.click();
        await this.termLengthTextBox.fill(termLength);
        await expect(this.termLengthTextBox).toHaveValue(termLength);
        await expect(this.termLengthGTOneErrorMessage).not.toBeVisible();
        await expect(this.termLengthLTFiveErrorMessage).not.toBeVisible();
    }

    async toggleAutoRenew(enabled: boolean) {
        const isChecked = await this.autoRenewToggle.isChecked();
        if (enabled && !isChecked) {
            await this.autoRenewToggle.check();
            await expect(this.autoRenewToggle).toBeChecked();
        } else if (!enabled && isChecked) {
            await this.autoRenewToggle.uncheck();
            await expect(this.autoRenewToggle).not.toBeChecked();
        } else if (enabled) {
            await expect(this.autoRenewToggle).toBeChecked();
        } else {
            await expect(this.autoRenewToggle).not.toBeChecked();
        }
        console.log(`Auto-renewal toggle is now switched: ${enabled ? 'ON' : 'OFF'}`);
    }

    async selectStartDateBasedOnOrder() {
        await this.startDateBasedOnOrderButton.click();
        await expect(this.calendarPicker).not.toBeVisible();
        await expect(this.daySpinButton).not.toBeVisible();
        await expect(this.monthSpinButton).not.toBeVisible();
        await expect(this.yearSpinButton).not.toBeVisible();
        await expect(this.clearDateButton).not.toBeVisible();
        await expect(this.startDateAfterErrorText).not.toBeVisible();
        await expect(this.startDateBeforeErrorText).not.toBeVisible();
        await expect(this.startDateRequiredErrorText).not.toBeVisible();
    }

    async selectStartDateBasedOnFutureUsingSpinBox() {
        const today = new Date();
        const nextWeek: Date = new Date(today); // Start with today's date
        nextWeek.setDate(today.getDate() + 7); // Add 7 days
        const year: string = nextWeek.getFullYear().toString();
        const month: string = (nextWeek.getMonth() + 1).toString().padStart(2, '0');
        const day: string = nextWeek.getDate().toString().padStart(2, '0');

        await this.startDateBasedOnFutureButton.click();
        await this.daySpinButton.fill(day);
        await this.monthSpinButton.fill(month);
        await this.yearSpinButton.fill(year);
        await expect(this.daySpinButton).toHaveValue(day);
        await expect(this.yearSpinButton).toHaveValue(year);
    }

    async selectCustomFutureStartDate(daysAhead: number) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const day = futureDate.getDate().toString().padStart(2, '0');
        const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
        const year = futureDate.getFullYear().toString();
        await this.startDateBasedOnFutureButton.click();
        await this.daySpinButton.click();
        await this.daySpinButton.fill(day);
        await this.monthSpinButton.click();
        await this.monthSpinButton.fill(month);
        await this.yearSpinButton.click();
        await this.yearSpinButton.fill(year);
        await this.page.keyboard.press('Tab');
        console.log("Expected:", day);
        await expect(this.daySpinButton).toHaveAttribute('aria-valuenow', String(Number(day)));
    }

    async selectStartDateBasedOnFutureUsingCalendarPicker() {
        const today = new Date();
        const fifthDayNextMonth: Date = new Date(today); // Start with today's date
        fifthDayNextMonth.setMonth(today.getMonth() + 1); // Move to next month
        fifthDayNextMonth.setDate(5); // Set to the 5th day of the next month
        await this.startDateBasedOnFutureButton.click();
        await this.calendarPicker.click();
        const totalGridCells = await this.dateGridcell.count();
        let found = false;
        for (let i = 0; i < totalGridCells; i++) {
            if (await this.dateGridcell.nth(i).getAttribute('aria-current') == 'date') {
                if (['28', '29', '30', '31'].includes((await this.dateGridcell.nth(i).textContent())?.trim() || '')) {
                    await this.nextMonthButton.click();
                    await this.dateGridcell.getByText('5').click();
                    await expect(this.daySpinButton).toHaveValue('05');
                }
                else {
                    await this.dateGridcell.nth(i + 3).click();
                    const selectedDay = this.dateGridcell.nth(i + 3).textContent();
                    await expect(this.daySpinButton).toHaveValue(selectedDay.toString().padStart(2, '0'));
                }
            }
        }
    }

    async selectStartDateBasedOnFutureUsingCalendarPickerAndReturnDate(): Promise<{ day: string; month: string; year: string }> {
        await this.startDateBasedOnFutureButton.click();
        await this.calendarPicker.click();
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + 2); //  today + 2
        const targetDay = targetDate.getDate();
        const totalGridCells = await this.dateGridcell.count();
        for (let i = 0; i < totalGridCells; i++) {
            if (await this.dateGridcell.nth(i).getAttribute('aria-current') == 'date') {
                const currentDay = parseInt(
                    (await this.dateGridcell.nth(i).textContent())?.trim() || '0'
                );
                // If target goes to next month
                if (currentDay + 2 > 27) {
                    await this.nextMonthButton.click();
                    await this.dateGridcell.getByText(targetDay.toString()).click();
                } else {
                    const offset = targetDay - currentDay;
                    await this.dateGridcell.nth(i + offset).click();
                }
                await expect(this.daySpinButton).toHaveText(
                    targetDay.toString().padStart(2, '0')
                );
                break;
            }
        }
        const day = (await this.daySpinButton.textContent() || '').trim();
        const month = (await this.monthSpinButton.textContent() || '').trim();
        const year = (await this.yearSpinButton.textContent() || '').trim();
        return { day, month, year };
    }

    async clearStartDate() {
        await this.clearDateButton.click();
        await expect(this.daySpinButton).toHaveValue('DD');
        await expect(this.monthSpinButton).toHaveValue('MM');
        await expect(this.yearSpinButton).toHaveValue('YYYY');
        await expect(this.startDateAfterErrorText).not.toBeVisible();
        await expect(this.startDateBeforeErrorText).not.toBeVisible();
        await expect(this.startDateRequiredErrorText).toBeVisible();
    }

    async startDateAfterErrorValidation() {
        await this.startDateBasedOnFutureButton.click();
        await this.daySpinButton.fill('01');
        await this.monthSpinButton.fill('01');
        await this.yearSpinButton.fill('2020');
        await this.continueButton.click();
        await expect(this.startDateAfterErrorText).toBeVisible();
    }

    async startDateBeforeErrorValidation() {
        await this.startDateBasedOnFutureButton.click();
        await this.daySpinButton.fill('12');
        await this.monthSpinButton.fill('12');
        await this.yearSpinButton.fill('2100');
        await this.continueButton.click();
        await expect(this.startDateBeforeErrorText).toBeVisible();
    }

    async startDateRequiredErrorValidation() {
        await this.startDateBasedOnFutureButton.click();
        await this.clearDateButton.click();
        await this.continueButton.click();
        await expect(this.startDateRequiredErrorText).toBeVisible();
    }

    async BillToValidation(userEmail: string) {
        await expect(this.addNewContractText).toBeVisible();
        await expect(this.contactUsLink).toBeVisible();
    }

    async cancelButtonValidation() {
        await expect(this.createNewContractHeadingText).toBeVisible();
        await expect(this.continueButton).toBeVisible();
        if (this.cancelButton) {
            await this.cancelButton.click();
        }
    }

    async continueToProductsPage() {
        await this.continueButton.click();
    }

    async assertMonthlyValidationLT1Visible(timeout = 5000) {
        await expect(this.monthlyValidationLT1).toBeVisible({ timeout });
    }

    async assertMonthlyValidationGT11Visible(timeout = 5000) {
        await expect(this.monthlyValidationGT11).toBeVisible({ timeout });
    }

    async assertAutoRenewalTextMonthlyVisible(timeout = 5000) {
        await expect(this.autoRenewalTextMonthlyVisible).toBeVisible({ timeout });
    }

    async setAFutureDate() {
        await this.startDateBasedOnFutureButton.click();
    }

    async enterMonthDateYearInSummaryOfchangesPage(monthOffset: number, dayOffset: number, year?: string) {
        const today = new Date();
        const validDate = new Date(today);
        // Apply month offset
        validDate.setMonth(validDate.getMonth() + monthOffset);
        // Apply day offset
        validDate.setDate(validDate.getDate() + dayOffset);
        const yearToUse = year && year.trim().length ? year.trim() : String(validDate.getFullYear());
        await this.enterMonth.click();
        await this.enterMonth.fill(String(validDate.getMonth() + 1)); // JS months are 0-based
        await this.enterDay.click();
        await this.enterDay.fill(String(validDate.getDate()));
        await this.enterYear.click();
        await this.enterYear.fill(yearToUse);
    }

    async getDaysInMonth(year: number, month: number): Promise<number> {
        // month is 0-indexed (0 = Jan, 11 = Dec)
        return new Date(year, month + 1, 0).getDate();
    }
    // CASE 1: Date in past
    async verifyCreateContractNotAllowedForPastDate() {
        await this.enterMonthDateYearInSummaryOfchangesPage(-1, 0, '2025');
        await expect(this.continueButton).toBeDisabled();
    }
    // CASE 2: Different Year (Future Year)
    async verifyCreateContractNotAllowedForFutureYear() {
        await this.enterMonthDateYearInSummaryOfchangesPage(1, 0, '2030');
        await expect(this.continueButton).toBeDisabled();
    }
    // CASE 3: Current date + 2 to +maxDays (enabled)
    async verifyCreateContractEnabledWithinAllowedRange() {
        const today = new Date();
        const daysInMonth = await this.getDaysInMonth(today.getFullYear(), today.getMonth());
        // We’ll pick date +2 (minimum allowed)
        await this.enterMonthDateYearInSummaryOfchangesPage(0, 2, String(today.getFullYear()));
        await expect(this.continueButton).toBeVisible();
        // We’ll also test for date +30 (maximum allowed window)
        await this.enterMonthDateYearInSummaryOfchangesPage(0, this.MAX_FUTURE_DAYS, String(today.getFullYear()));
        await expect(this.continueButton).toBeVisible();
    }
    // CASE 4: More than 30/31 days from today
    async verifyCreateContractNotAllowedBeyondMaxDays() {
        const today = new Date();
        const daysInMonth = await this.getDaysInMonth(today.getFullYear(), today.getMonth());
        // pick +31 days to exceed the fixed 30-day limit
        await this.enterMonthDateYearInSummaryOfchangesPage(0, this.MAX_FUTURE_DAYS + 1, String(today.getFullYear()));
        await expect(this.continueButton).toBeDisabled();
    }
    // CASE 5: Month +2 or more → disable directly
    async verifyCreateContractNotAllowedForMonthBeyondTwoAhead() {
        const today = new Date();
        await this.enterMonthDateYearInSummaryOfchangesPage(3, 0, String(today.getFullYear()));
        await expect(this.continueButton).toBeDisabled();
    }
    // CASE 6: Validating dynamic month days (30/31 check)
    async validateDaysInCurrentMonthAndLog() {
        const today = new Date();
        const daysInMonth = await this.getDaysInMonth(today.getFullYear(), today.getMonth());
        console.log(`Current month (${today.toLocaleString('default', { month: 'long' })}) has ${daysInMonth} days.`);
    }

    async chooseCurrencyDropdown(currency: 'USD' | 'EUR') {
        const isEnabled = await this.currencyDropdown.isEnabled();
        const ariaDisabled =
            await this.currencyDropdown.getAttribute('aria-disabled');
        if (!isEnabled || ariaDisabled === 'true') {
            console.log('Currency dropdown is disabled. Cannot select currency.');
            return;
        }

        await this.currencyDropdown.click();
        switch (currency) {
            case 'USD':
                await this.currencyUSD.click();
                break;
            case 'EUR':
                await this.currencyEUR.click();
                break;
            default:
                throw new Error(
                    `Couldn't find any options for "${currency}"`
                );
        }
    }
}