import { expect, Locator, Page } from "@playwright/test";
import { Utilities } from "../utils/browserUtilities";
interface ProductData {
    productName: string[];
    productSKU: string[];
    productQuantity: string[];
    productsPrice: string[];
    KPI?: string[];
    estimatedTax: string;
    totalNetPrice: string;
}
export class RenewalSummaryPage {
    readonly page: Page;
    private util: Utilities;
    readonly summaryScreenText: Locator;
    readonly dealerNameText: Locator;
    readonly customerNameText: Locator;
    readonly CreatedByText: Locator;
    readonly POReferenceNumberTextBox: Locator;
    readonly POReferenceNumberText: Locator;
    readonly subscriptionDraftStatusText: Locator;
    readonly amendmentDraftStatusText: Locator;
    readonly contractStatusText: Locator;
    readonly termLengthText: Locator;
    readonly startDateText: Locator;
    readonly autoRenewalEnabledText: Locator;
    readonly autoRenewalDisabledText: Locator;
    readonly shipToAddressText: Locator;
    readonly customerAdminNameText: Locator;
    readonly customerAdminEmailText: Locator;
    readonly dealerAccountNameText: Locator;
    readonly dealerNameBilledToText: Locator;
    readonly dealerEmailText: Locator;
    readonly billToAddressText: Locator;
    readonly productNameDraftText: Locator;
    readonly productNameSummaryScreenText: Locator;
    readonly productSKUText: Locator;
    readonly productQuantityText: Locator;
    readonly netPriceText: Locator;
    readonly estimatedTaxText: Locator;
    readonly totalPriceText: Locator;
    readonly placeOrderButton: Locator;
    readonly okayPlaceOrderButton: Locator;
    readonly backToTableButton: Locator;
    readonly discardDraftButton: Locator;
    readonly contractSubmittedSuccessfullyText: Locator;
    readonly closeButton: Locator;
    readonly acceptButton: Locator;
    readonly deleteDraftWarningText: Locator;
    readonly EscKeyPressText: Locator;
    readonly draftExpiredText: Locator;
    readonly draftExpiredDateText: Locator;
    readonly contractDetailsTab: Locator;
    readonly subscriptionTab: Locator;
    readonly contractHistoryTab: Locator;
    readonly amendmentHistoryTab: Locator;
    readonly amendmentInProgressStatus: Locator;
    readonly amendmentTotalText: Locator;
    readonly amendmentPriceText: Locator;
    readonly contractTotalText: Locator
    readonly pendingAmendmentBreakdownText: Locator;
    readonly amendmentsDropdown: Locator;
    readonly draftStatusNearAmendmentsDropdown: Locator;
    readonly numberOfLicensesCountInRenewalSummary: Locator;
    readonly clickAmendmentFromAmendmentDropdwon: Locator;
    readonly activeStatus: Locator;
    readonly toast: Locator;
    readonly toastCloseButton: Locator;
    readonly toastSVGBtn: Locator;
    readonly disabledAmendContractBtn: Locator;
    readonly disabledAmendContractTooltipText: Locator;
    readonly purchaseOrderNumber: Locator;
    readonly subscriptionInprogressStatusText: Locator;
    readonly amendmentInprogressStatusText: Locator;
    readonly contractsLink: Locator;
    readonly amendContractButton: Locator;
    readonly startDate: Locator;
    readonly autoRenewalOffCaption: Locator;
    readonly autoRenewalIsOFFInContractDetailsScreen: Locator;
    readonly autoRenewalIsONInContractDetailsScreen: Locator;
    readonly startDateInContractDetails: Locator;
    readonly endDateInContractDetails: Locator;

    readonly renewalQuoteAlertTitle: Locator;
    readonly renewalQuoteAlertMessage: Locator;
    readonly editRenewalDetailsButton: Locator;
    readonly editRenewalSubscriptionButton: Locator;
    readonly editRenewalTermsButton: Locator;
    readonly editRenewalEndDateButton: Locator;
    readonly editRenewalTurnOffAutoRenewalButton: Locator;
    readonly cancelEditRenewalButton: Locator;
    readonly generatePricingEditRenewalButton: Locator;
    readonly generatePricingFromWarningButton: Locator;
    readonly addProductEditRenewalButton: Locator;
    readonly searchProductTextBox: Locator;
    readonly renewalHistoryTab: Locator;
    readonly deleteSubscriptionConfirmationPopup: Locator;
    readonly deleteSubscriptionYesButton: Locator;
    readonly deleteSubscriptionCancelButton: Locator;
    readonly deleteIconButtonList: Locator;
    readonly noNegativeActionsText: Locator;
    readonly termChangePopUp: Locator;
    readonly termChangeToYear: Locator;
    readonly termChangeToMonth: Locator;
    readonly saveAndRepriceButton: Locator;
    readonly proceedWithTermChangeText: Locator;
    readonly termChangeDialogTitle: Locator;
    readonly termChangeDialogDescription: Locator;
    readonly selectNewTermHeading: Locator;
    readonly annualTermLabel: Locator;
    readonly monthlyTermLabel: Locator;
    readonly annualTermRadioHost: Locator;
    readonly monthlyTermRadioHost: Locator;
    readonly currentTermBadge: Locator;
    readonly annualCurrentTermBadge: Locator;
    readonly monthlyCurrentTermBadge: Locator;
    readonly termLengthValue: Locator;
    readonly contractTotalValue: Locator;
    readonly termChangeDialogCloseButton: Locator;
    readonly termChangeCancelButton: Locator;
    readonly termChangeDialog: Locator;
    readonly termMenuItem: Locator;
    readonly endDateMenuItem: Locator;
    readonly autoRenewalMenuItem: Locator;
    readonly alignContractEndDateDialog: Locator;
    readonly alignContractEndDateDialogTitle: Locator;
    readonly alignContractEndDateDialogDescription: Locator;
    readonly alignContractEndDateCloseButton: Locator;
    readonly alignContractEndDatePrompt: Locator;
    readonly alignContractEndDateSearchTextbox: Locator;
    readonly alignContractEndDateGrid: Locator;
    readonly alignContractEndDateRows: Locator;
    readonly alignContractEndDateContractIdHeader: Locator;
    readonly alignContractEndDateCustomerNameHeader: Locator;
    readonly alignContractEndDatePONumberHeader: Locator;
    readonly alignContractEndDateEndDateHeader: Locator;
    readonly alignContractEndDateContractIdCells: Locator;
    readonly alignContractEndDateCustomerNameCells: Locator;
    readonly alignContractEndDatePONumberCells: Locator;
    readonly alignContractEndDateEndDateCells: Locator;
    readonly alignContractEndDateRadioButtons: Locator;
    readonly alignContractEndDateCheckedRadio: Locator;
    readonly alignContractEndDateContinueButton: Locator;
    readonly alignContractEndDateCancelButton: Locator;
    readonly alignContractEndDatePaginationSummary: Locator;
    readonly alignContractEndDateGoBackButton: Locator;
    readonly alignContractEndDateCurrentEndDateLabel: Locator;
    readonly alignContractEndDateCurrentEndDateValue: Locator;
    readonly alignContractEndDateNewEndDateLabel: Locator;
    readonly alignContractEndDateNewEndDateValue: Locator;
    readonly alignContractEndDateSelectedContractLabel: Locator;
    readonly alignContractEndDateSelectedContractValuesColumn: Locator;
    readonly alignContractEndDateSelectedContractIdValue: Locator;
    readonly alignContractEndDateSelectedCustomerNameValue: Locator;
    readonly alignContractEndDateSelectedPONumberValue: Locator;
    readonly alignContractEndDateSelectedEndDateValue: Locator;
    readonly alignContractEndDateSaveAndRepriceButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.util = new Utilities(page);
        this.startDate = page.locator('[aria-labelledby="renewal-date"]');
        this.autoRenewalOffCaption = page.locator('[aria-label="renewal-date-caption"]');
        this.autoRenewalIsOFFInContractDetailsScreen = page.locator('[aria-live="polite"]').filter({ hasText: 'OFF' });
        this.autoRenewalIsONInContractDetailsScreen = page.locator('[aria-live="polite"]').filter({ hasText: 'ON' });
        this.startDateInContractDetails = page.locator('p[aria-labelledby="start-date"]');
        this.endDateInContractDetails = page.locator('[aria-labelledby="end-date"]');
        this.summaryScreenText = page.locator('[aria-label="contract-number"]');
        this.contractDetailsTab = page.getByRole('button', { name: 'contract-details-toggle' });
        this.subscriptionTab = page.locator('[aria-label="subscriptions-toggle"]');
        this.contractHistoryTab = page.getByRole('button', { name: 'contract-history-toggle' });
        this.amendmentHistoryTab = page.getByRole('button', { name: 'amendment-history-toggle' });
        this.dealerNameText = page.locator('p[aria-labelledby="dealer-card-title"]');
        this.customerNameText = page.locator('p[aria-labelledby="customer-card-title"]');
        this.CreatedByText = page.locator('p[aria-labelledby="header-card-created-by"]');
        this.POReferenceNumberTextBox = page.getByRole('textbox', { name: 'Enter PO #' });
        this.POReferenceNumberText = page.locator('//h5[@aria-labelledby="po-number"]');
        this.subscriptionDraftStatusText = page.getByLabel('Status', { exact: true }).getByText('Draft');
        this.amendmentDraftStatusText = page.getByText('Draft').nth(1);
        this.subscriptionInprogressStatusText = page.getByLabel('Status', { exact: true }).getByText('In Progress');
        this.amendmentInprogressStatusText = page.getByText('In Progress', { exact: true }).nth(1);
        this.contractStatusText = page.locator('button[aria-label="Contract status"] .modus-wc-chip-label');
        this.termLengthText = page.locator('p[aria-labelledby="term-length"]');
        this.startDateText = page.locator('p[aria-labelledby="start-date"]');
        this.autoRenewalEnabledText = page.getByText('Auto Renewal Enabled', { exact: true });
        this.autoRenewalDisabledText = page.getByText('Auto Renewal Disabled', { exact: true });
        this.shipToAddressText = page.locator('p[aria-labelledby="ship-to"]');
        this.customerAdminNameText = page.locator('[aria-labelledby="customer-admin"]').first();
        this.customerAdminEmailText = page.locator('[aria-labelledby="customer-admin"]').last();
        this.dealerAccountNameText = page.locator('xpath=//span[contains(text(),"Dealer")]//following-sibling::p').last();
        this.dealerNameBilledToText = page.locator('xpath=//div[@aria-labelledby="bill-to"]/div[1]/p').first();
        this.dealerEmailText = page.locator('xpath=//div[@aria-labelledby="bill-to"]/div[1]/p').last();
        this.billToAddressText = page.locator('xpath=//div[@aria-labelledby="bill-to"]/div[2]');
        this.productNameDraftText = page.locator('[aria-label="subscription-name"]');
        this.productNameSummaryScreenText = page.locator('xpath=(//div[@data-field="description"]/div/p)');
        this.productSKUText = page.locator('[aria-label="subscription-sku"]');
        this.productQuantityText = page.locator('div[data-field="quantity"][role="gridcell"]');
        this.netPriceText = page.locator('div[data-field="netPriceTotal"][role="gridcell"]');
        this.totalPriceText = page.locator('td[aria-labelledby="total-net-price"]');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.okayPlaceOrderButton = page.getByTestId('warning-okay-button');
        this.backToTableButton = page.locator("//span[text()='Back to Contracts']");
        this.discardDraftButton = page.getByRole('button', { name: 'Delete Draft' });
        this.contractSubmittedSuccessfullyText = page.getByText('Contract submitted', { exact: true });
        this.closeButton = page.getByRole('button', { name: 'Close', exact: true });
        this.acceptButton = page.getByTestId('delete-draft-dialog-confirm-button').getByRole('button', { name: 'Delete' });
        this.deleteDraftWarningText = page.locator('div').filter({ hasText: /^Are you sure that you want to delete the draft\?$/ }).first();
        this.EscKeyPressText = page.getByRole('dialog').filter({ hasText: 'Are you sure that you want to' }).getByLabel('Close modal');
        this.draftExpiredText = page.getByText('Since it is expired, you only have view access.');
        this.draftExpiredDateText = page.locator('xpath=//span[contains(text(),"Expired ")]');
        this.amendmentInProgressStatus = page.getByText('Amendment in Progress').nth(1);
        this.activeStatus = page.locator('[aria-label="contract status"]');
        this.amendmentTotalText = page.getByRole('heading', { name: 'Amendment Total' });
        this.estimatedTaxText = page.getByRole('heading', { name: 'Estimated Tax' });
        this.amendmentPriceText = page.getByRole('heading', { name: 'Amendment Price' });
        this.contractTotalText = page.locator('#total-net-price').getByRole('heading', { name: 'Contract Total' });
        this.pendingAmendmentBreakdownText = page.getByRole('heading', { name: 'Pending Amendment Breakdown' });
        this.amendmentsDropdown = page.getByTestId('amendments-header');
        this.draftStatusNearAmendmentsDropdown = page.getByRole('button', { name: 'Contract status' }).nth(1);
        this.numberOfLicensesCountInRenewalSummary = page.getByRole('heading', { name: 'Licenses' });
        this.clickAmendmentFromAmendmentDropdwon = page.getByTestId('amendment-item-0');
        this.toast = page.getByRole('alert');
        this.toastCloseButton = page.getByRole('button', { name: 'Close' });
        this.toastSVGBtn = page.getByRole('alert').locator('svg');
        this.disabledAmendContractBtn = page.locator('[aria-label="You cannot amend a contract while there is an amendment pending"]');
        this.disabledAmendContractTooltipText = page.getByText('You cannot amend a contract');
        this.purchaseOrderNumber = page.locator('[aria-labelledby="purchase-order-number"]');
        this.contractsLink = page.getByRole('link', { name: 'Contracts', exact: true });
        this.amendContractButton = page.getByRole('link', { name: 'Amend Contract' });

        this.renewalQuoteAlertTitle = page.getByTestId('contract-alert-title');
        this.renewalQuoteAlertMessage = page.getByTestId('contract-alert-message');
        this.editRenewalSubscriptionButton = page.getByRole('button', { name: 'Edit Subscription' });

        this.editRenewalDetailsButton = page.locator('[aria-label="Edit Details"]');
        this.editRenewalTermsButton = page.getByRole('button', { name: 'menuitemradio' }).nth(0);
        this.editRenewalEndDateButton = page.getByRole('button', { name: 'menuitemradio' }).nth(1);
        this.editRenewalTurnOffAutoRenewalButton = page.getByRole('button', { name: 'menuitemradio' }).nth(2);
        this.cancelEditRenewalButton = page.locator('xpath=//button[contains(text(),"Cancel")]');
        this.generatePricingEditRenewalButton = page.locator('xpath=//button[contains(text(),"Generate Pricing")]');
        this.generatePricingFromWarningButton = page.locator('#warning-popup-modal').getByRole('button', { name: 'Ok, Generate Pricing' });
        this.addProductEditRenewalButton = page.getByText('Add Product').first();
        this.searchProductTextBox = page.getByPlaceholder('Search for a product, SKU');
        this.renewalHistoryTab = page.getByRole('tab', { name: 'Renewal History' });
        this.deleteSubscriptionConfirmationPopup = page.getByText('Deleting the subscription removes all seats and all actions from this contract. Do you want to proceed?');
        this.deleteSubscriptionYesButton = page.getByRole('button', { name: 'Yes' });
        this.deleteSubscriptionCancelButton = page.getByRole('button', { name: 'Cancel' }).last();
        this.deleteIconButtonList = page.locator('xpath=//i[contains(text(),"delete")]');
        this.noNegativeActionsText = page.getByTestId('no-negative-actions');
        this.termChangePopUp = page.locator('.term-change-modal-header');
        this.termChangeToYear = page.locator('[id="YEAR"]');
        this.termChangeToMonth = page.locator('[id="MONTH"]');
        this.saveAndRepriceButton = page.getByRole('button', { name: 'Save and Reprice' });
        this.proceedWithTermChangeText = page.getByText('Are you sure you want to proceed with the term change?');
        this.termChangeDialogTitle = page.getByText('Change Contract Term for Billing frequency on Renewal');
        this.termChangeDialogDescription = page.getByText('This will modify the Contract Term and changes will be applied on the renewal date.');
        this.selectNewTermHeading = page.getByText('Select New Term');
        this.annualTermLabel = page.locator('label[for="YEAR"]');
        this.monthlyTermLabel = page.locator('label[for="MONTH"]');
        this.annualTermRadioHost = page.locator('modus-wc-radio[input-id="YEAR"]');
        this.monthlyTermRadioHost = page.locator('modus-wc-radio[input-id="MONTH"]');
        this.currentTermBadge = page.getByRole('status', { name: 'Current' });
        this.annualCurrentTermBadge = this.annualTermRadioHost
            .locator('xpath=following-sibling::modus-wc-badge')
            .getByText('Current', { exact: true });
        this.monthlyCurrentTermBadge = this.monthlyTermRadioHost
            .locator('xpath=following-sibling::modus-wc-badge')
            .getByText('Current', { exact: true });
        this.termLengthValue = page.locator('h5[aria-labelledby="term-length"]');
        this.contractTotalValue = page.locator('td[aria-labelledby="total-net-price"] h5');
        this.termChangeDialog = page.getByRole('dialog').filter({ hasText: 'Change Contract Term for Billing frequency on Renewal' });
        this.termChangeDialogCloseButton = this.termChangeDialog.getByRole('button').filter({ hasText: 'close' });
        this.termChangeCancelButton = page.locator('#term-change-modal').getByRole('button', { name: 'Cancel' });
        this.termMenuItem = page.locator('modus-wc-menu-item').filter({ hasText: /^Term$/ }).locator('[role="menuitemradio"]');
        this.endDateMenuItem = page.locator('modus-wc-menu-item').filter({ hasText: 'End Date' }).locator('[role="menuitemradio"]');
        this.autoRenewalMenuItem = page.locator('modus-wc-menu-item').filter({ hasText: /Auto-Renewal/i }).locator('[role="menuitemradio"]');
        this.alignContractEndDateDialog = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Edit contract end date' }) });
        this.alignContractEndDateDialogTitle = this.alignContractEndDateDialog.getByText('Edit contract end date', { exact: true });
        this.alignContractEndDateDialogDescription = this.alignContractEndDateDialog.getByText('Aligning this contract\'s end date with an existing contract of the same term will synchronize their end dates.');
        this.alignContractEndDateCloseButton = this.alignContractEndDateDialog.getByRole('button', { name: 'Close' });
        this.alignContractEndDatePrompt = this.alignContractEndDateDialog.getByText(/Select (annual|monthly) contract to align the end date/i);
        this.alignContractEndDateSearchTextbox = this.alignContractEndDateDialog.getByPlaceholder('Search by contract ID or customer name');
        this.alignContractEndDateGrid = this.alignContractEndDateDialog.getByRole('grid');
        this.alignContractEndDateRows = this.alignContractEndDateDialog.locator('[role="row"][data-rowindex]');
        this.alignContractEndDateContractIdHeader = this.alignContractEndDateDialog.getByRole('columnheader', { name: 'Contract ID' });
        this.alignContractEndDateCustomerNameHeader = this.alignContractEndDateDialog.getByRole('columnheader', { name: 'Customer Name' });
        this.alignContractEndDatePONumberHeader = this.alignContractEndDateDialog.getByRole('columnheader', { name: 'PO Number' });
        this.alignContractEndDateEndDateHeader = this.alignContractEndDateDialog.getByRole('columnheader', { name: 'End Date' });
        this.alignContractEndDateContractIdCells = this.alignContractEndDateDialog.locator('[data-field="contractNumber"][role="gridcell"]');
        this.alignContractEndDateCustomerNameCells = this.alignContractEndDateDialog.locator('[data-field="customerName"][role="gridcell"], [data-field="shipToAccountName"][role="gridcell"]');
        this.alignContractEndDatePONumberCells = this.alignContractEndDateDialog.locator('[data-field="poNumber"][role="gridcell"]');
        this.alignContractEndDateEndDateCells = this.alignContractEndDateDialog.locator('[data-field="endDate"][role="gridcell"]');
        this.alignContractEndDateRadioButtons = this.alignContractEndDateDialog.getByRole('radio');
        this.alignContractEndDateCheckedRadio = this.alignContractEndDateDialog.locator('[data-field="radio"] input[type="radio"]:checked');
        this.alignContractEndDateContinueButton = this.alignContractEndDateDialog.getByRole('button', { name: 'Continue' });
        this.alignContractEndDateCancelButton = this.alignContractEndDateDialog.getByRole('button', { name: 'Cancel' });
        this.alignContractEndDatePaginationSummary = this.alignContractEndDateDialog.locator('.MuiTablePagination-displayedRows');
        this.alignContractEndDateGoBackButton = this.alignContractEndDateDialog.getByRole('button', { name: 'Go Back' });
        this.alignContractEndDateCurrentEndDateLabel = this.alignContractEndDateDialog.getByText('Current End Date');
        this.alignContractEndDateCurrentEndDateValue = this.alignContractEndDateCurrentEndDateLabel
            .locator('xpath=ancestor::modus-wc-typography[1]/following-sibling::*[1]//*[self::h5 or self::p][1]');
        this.alignContractEndDateNewEndDateLabel = this.alignContractEndDateDialog.getByText('New End Date');
        this.alignContractEndDateNewEndDateValue = this.alignContractEndDateNewEndDateLabel
            .locator('xpath=ancestor::modus-wc-typography[1]/following-sibling::*[1]//*[self::h5 or self::p][1]');
        this.alignContractEndDateSelectedContractLabel = this.alignContractEndDateDialog.getByText('Selected Contract');
        this.alignContractEndDateSelectedContractValuesColumn = this.alignContractEndDateSelectedContractLabel
            .locator('xpath=following::div[.//p[normalize-space()="Contract ID"] and .//p[normalize-space()="Customer Name"] and .//p[normalize-space()="PO Number"] and .//p[normalize-space()="End Date"]][1]/div[2]');
        this.alignContractEndDateSelectedContractIdValue = this.alignContractEndDateSelectedContractValuesColumn.locator('p').nth(0);
        this.alignContractEndDateSelectedCustomerNameValue = this.alignContractEndDateSelectedContractValuesColumn.locator('p').nth(1);
        this.alignContractEndDateSelectedPONumberValue = this.alignContractEndDateSelectedContractValuesColumn.locator('p').nth(2);
        this.alignContractEndDateSelectedEndDateValue = this.alignContractEndDateSelectedContractValuesColumn.locator('p').nth(3);
        this.alignContractEndDateSaveAndRepriceButton = this.alignContractEndDateDialog.getByRole('button', { name: 'Save and Reprice' });
    }

    async renewalSummaryScreenElementsAssertionWhenAmendmentIsDraft() {
        await expect(this.backToTableButton).toBeVisible();
        await expect(this.contractDetailsTab).toBeVisible();
        await expect(this.subscriptionTab).toBeVisible();
        await expect(this.contractHistoryTab).toBeVisible();
        await expect(this.amendmentHistoryTab).toBeVisible();
        await expect(this.discardDraftButton).toBeVisible();
        await expect(this.placeOrderButton).toBeVisible();
        await expect(this.amendmentsDropdown.first()).toBeVisible();
        await expect(this.amendmentTotalText).toBeVisible();
        //await expect(this.KPIDiscountText).toBeVisible();
        //await expect(this.dealerDiscountText).toBeVisible();
        await expect(this.amendmentPriceText).toBeVisible();
        //await expect(this.estimatedTaxText).toBeVisible();
        await expect(this.contractTotalText).toBeVisible();
        await expect(this.pendingAmendmentBreakdownText).toBeVisible();
        await expect(this.draftStatusNearAmendmentsDropdown).toHaveText('Draft');
        await expect(this.numberOfLicensesCountInRenewalSummary.first()).toBeVisible();
    }

    async assertPurchaseOrderNumberInRenewalSummaryPage(poNumber: string) {
        await expect(this.purchaseOrderNumber.first()).toHaveText(poNumber);
    }

    async verifySubscriptionAndAmendmentStatusIsDraft() {
        await expect(this.subscriptionDraftStatusText).toBeVisible();
        await expect(this.amendmentDraftStatusText).toBeVisible();
    }

    async verifySubscriptionStatusIsActive() {
        await expect(this.activeStatus.nth(0)).toHaveText('Active');
    }

    async verifySubscriptionStatusIsOnHold() {
        await expect(this.activeStatus.nth(0)).toHaveText('On Hold');
    }

    async verifySubscriptionAndAmendmentStatusIsInProgress() {
        await expect(this.subscriptionInprogressStatusText).toHaveText('In Progress');
        await expect(this.amendmentInprogressStatusText).toHaveText('In Progress');
    }

    async verifySubscriptionStatusIsInProgress() {
        await expect(this.amendmentInProgressStatus).toHaveText('Amendment in Progress');
    }

    async licenseCountInRenewalSummaryPage(licenseAdditionsCount: string) {
        await expect(this.numberOfLicensesCountInRenewalSummary).toContainText(licenseAdditionsCount);
    }

    async clickAmendmentFromAmendmentDropdownShouldTakeToAmendmentSummaryPage() {
        await this.amendmentsDropdown.first().click();
        await this.clickAmendmentFromAmendmentDropdwon.first().click();
    }

    async summaryScreenPageAssertion() {
        await expect(this.summaryScreenText).toBeVisible();
        await this.contractDetailsTab.click();
        await expect(this.dealerNameText).toBeVisible();
        await expect(this.customerNameText).toBeVisible();
        //await expect(this.CreatedByText).toBeVisible();
        await this.subscriptionTab.click();

    }

    async clickContractDetailsTab() {
        await this.contractDetailsTab.click();
    }

    async clickSubscriptionTab() {
        await this.subscriptionTab.click();
    }

    async getCustomerNameFromHeader(timeoutMs = 10000) {
        const renewalCustomerNameLink = this.page.locator('h5[aria-label="customer-name"] a').first();
        await expect(renewalCustomerNameLink).toBeVisible({ timeout: timeoutMs });

        let renewalCustomerName = '';
        await expect.poll(async () => {
            const title = (await renewalCustomerNameLink.getAttribute('title'))?.trim() ?? '';
            const text = (await renewalCustomerNameLink.textContent())?.trim() ?? '';
            renewalCustomerName = title || text;
            return renewalCustomerName.length;
        }, { timeout: timeoutMs }).toBeGreaterThan(0);

        return renewalCustomerName;
    }

    async getContractDetailsEndDateText() {
        await this.clickContractDetailsTab();
        await expect(this.endDateInContractDetails.first()).toBeVisible({ timeout: 30000 });
        return (await this.endDateInContractDetails.first().textContent())?.trim() ?? '';
    }

    async verifyEndDateAlignDialogPromptForTerm(termUom: 'YEAR' | 'MONTH') {
        const expectedPrompt = termUom === 'YEAR'
            ? 'Select annual contract to align the end date'
            : 'Select monthly contract to align the end date';

        await expect(this.alignContractEndDatePrompt).toHaveText(expectedPrompt, { timeout: 10000 });
    }

    async getEndDateAlignPromptText() {
        await expect(this.alignContractEndDatePrompt).toBeVisible({ timeout: 10000 });
        return (await this.alignContractEndDatePrompt.textContent())?.trim() ?? '';
    }

    async getTotalContractsInEndDateAlignDialog() {
        await expect(this.alignContractEndDateDialog).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDatePaginationSummary).toBeVisible({ timeout: 10000 });

        const paginationText = (await this.alignContractEndDatePaginationSummary.textContent())?.trim() ?? '';
        const totalMatch = paginationText.match(/out of\s+(\d+)/i);

        if (!totalMatch) {
            throw new Error(`Unable to parse total rows from pagination text: ${paginationText}`);
        }

        return Number.parseInt(totalMatch[1], 10);
    }

    async getCoTermRowsInEndDateDialog() {
        await expect(this.alignContractEndDateDialog).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateRows.first()).toBeVisible({ timeout: 10000 });

        const contractIds = (await this.alignContractEndDateContractIdCells.allTextContents()).map((value) => value.trim()).filter(Boolean);
        const customerNames = (await this.alignContractEndDateCustomerNameCells.allTextContents()).map((value) => value.trim()).filter(Boolean);
        const poNumbers = (await this.alignContractEndDatePONumberCells.allTextContents()).map((value) => value.trim());
        const endDates = (await this.alignContractEndDateEndDateCells.allTextContents()).map((value) => value.trim()).filter(Boolean);

        const rowCount = Math.min(contractIds.length, customerNames.length, poNumbers.length, endDates.length);
        const rows: { contractId: string; customerName: string; poNumber: string; endDate: string }[] = [];

        for (let i = 0; i < rowCount; i++) {
            rows.push({
                contractId: contractIds[i],
                customerName: customerNames[i],
                poNumber: poNumbers[i] ?? '',
                endDate: endDates[i]
            });
        }

        return rows;
    }

    async fillPOReferenceNumber(poNumber: string) {
        const randomNumber = await this.util.generateRandomNumber(100, 999);
        console.log(`Generated random number: ${randomNumber}`);
        await expect(this.POReferenceNumberTextBox).toBeVisible({ timeout: 180000 });
        await this.POReferenceNumberTextBox.click();
        await this.POReferenceNumberTextBox.fill(poNumber + randomNumber.toString());
        await this.page.waitForTimeout(10000);
        await expect(this.POReferenceNumberTextBox).toHaveValue(poNumber + randomNumber.toString());
        await this.summaryScreenText.click(); // Click on the summary screen text to trigger the blur event
        return poNumber + randomNumber.toString();
    }

    async fillPOReferenceNumberWORandomNumber(poNumber: string) {
        await expect(this.POReferenceNumberTextBox).toBeVisible({ timeout: 180000 });
        await this.POReferenceNumberTextBox.click();
        await this.POReferenceNumberTextBox.fill(poNumber);
        await this.page.waitForTimeout(10000);
        await expect(this.POReferenceNumberTextBox).toHaveValue(poNumber);
        await this.summaryScreenText.click();
        return poNumber;
    }

    async verifyPOReferenceNumber(poNumber: string) {
        await expect(this.POReferenceNumberText).toContainText(poNumber);
        //await this.backToTableButton.click();
    }

    async verifyProductDetails(name: string, sku: string, price: string) {
        await this.page.waitForTimeout(2000);
        await expect(this.productNameDraftText).toHaveText(name);
        await expect(this.productSKUText).toHaveText(sku);
        // Commenting this below line as we summary screen might have a different Pricing Format
        // await expect(this.productPriceText).toContainText(price.split(".")[0]);
    }

    async convertToContract() {
        await this.placeOrderButton.click();
        if (await this.okayPlaceOrderButton.isVisible()) {
            await this.okayPlaceOrderButton.click();
        }
        await expect(this.contractSubmittedSuccessfullyText).toBeVisible();
        await this.contractsLink.click();
    }

    async getContractIDFromHeader() {
        await expect(this.summaryScreenText).toContainText(/(Contract|Trail|Renewal Contract) #\d+/, { timeout: 30000 });
        const contractNumberText = await this.summaryScreenText.evaluate((el) =>
            (el.childNodes[0]?.textContent || "").trim()
        );
        //Renewal Contract #7194-R1  ---> This is how the contract number is displayed in the header of the Renewal Summary Screen. So, we are using regex to match this pattern.
        expect(contractNumberText).toMatch(/^Renewal Contract #\d+-R\d+$/);
        const headerText = await this.summaryScreenText.textContent();
        const contractID = headerText?.match(/Renewal Contract #(\d+)/)?.[1];
        if (!contractID) {
            throw new Error('Renewal Contract Number not found in header text');
        }
        console.log(`Extracted Renewal Contract Number: ${contractID}`);
        return contractID;
    }

    async getRenewalContractNumberFromHeader() {
        await expect(this.summaryScreenText).toContainText(/Renewal Contract #\d+-R\d+/, { timeout: 30000 });
        // The header wrapper also contains Contract Debug and the org badge, so read the contract-number text node only.
        const contractNumberText = await this.summaryScreenText.evaluate((el) => {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            let node = walker.nextNode();
            while (node) {
                const value = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
                if (/^Renewal Contract #\d+-R\d+$/.test(value)) {
                    return value;
                }
                node = walker.nextNode();
            }
            return '';
        });
        expect(contractNumberText).toMatch(/^Renewal Contract #\d+-R\d+$/);

        const headerText = (await this.summaryScreenText.textContent())?.trim() ?? '';
        const renewalContractNumber = headerText.match(/Renewal Contract #(\d+-R\d+)/)?.[1];

        if (!renewalContractNumber) {
            throw new Error(`Renewal contract number not found in header text: ${headerText}`);
        }

        console.log(`Extracted Renewal Contract Number For Audit Log: ${renewalContractNumber}`);
        return renewalContractNumber;
    }

    async discardDraftFunctionalityInSummaryScreen() {
        await expect(this.placeOrderButton).toBeEnabled();
        await expect(this.backToTableButton).toBeVisible();
        await expect(this.discardDraftButton).toBeEnabled();
        await this.discardDraftButton.click();
        await expect(this.deleteDraftWarningText).toBeVisible();
        await expect(this.EscKeyPressText).toBeVisible({ timeout: 10000 });
        await this.closeButton.click();
        await expect(this.deleteDraftWarningText).not.toBeVisible({ timeout: 10000 });
        await this.discardDraftButton.click();
        await this.page.keyboard.press('Escape');
        await expect(this.EscKeyPressText).not.toBeVisible();
        await this.discardDraftButton.click();
        await this.acceptButton.click();
        await this.page.waitForTimeout(5000);
    }

    async clickCloseButtonOnDiscardDraftPopUpAndVerifyItRetainsInSameScreen() {
        await this.discardDraftButton.click();
        await expect(this.deleteDraftWarningText).toBeVisible();
        await expect(this.EscKeyPressText).toBeVisible();
        await expect(this.closeButton).toBeVisible();
        await expect(this.acceptButton).toBeVisible();
        await this.closeButton.click();
        await expect(this.deleteDraftWarningText).not.toBeVisible();
    }

    async clickAcceptButtonOnDiscardDraftPopUp() {
        await this.discardDraftButton.click();
        await expect(this.deleteDraftWarningText).toBeVisible();
        await expect(this.EscKeyPressText).toBeVisible();
        await expect(this.closeButton).toBeVisible();
        await expect(this.acceptButton).toBeVisible();
        await this.acceptButton.click();
    }

    async verifyDealerInformation(dealerAccountName: string, dealerName: string, dealerEmail: string, billToAddress: string) {
        await expect(this.dealerAccountNameText).toHaveText(dealerAccountName);
        await expect(this.dealerNameBilledToText).toHaveText(dealerName);
        await expect(this.dealerEmailText).toHaveText(dealerEmail);
        await expect(this.billToAddressText).toHaveText(billToAddress);
    }

    async verifyCustomerInformation(customerAccountName: string, customerAdminName: string, customerAdminEmail: string, shipToAddress: string) {
        await expect(this.customerNameText).toHaveText(customerAccountName);
        await expect(this.customerAdminNameText).toHaveText(customerAdminName);
        await expect(this.customerAdminEmailText).toHaveText(customerAdminEmail);
        await expect(this.shipToAddressText).toHaveText(shipToAddress);
    }

    async verifyTermsInformation(termLength: string, startDate: string, autoRenewal: boolean) {
        await expect(this.termLengthText).toHaveText(termLength);
        await expect(this.startDateText).toHaveText(startDate);
        if (autoRenewal) {
            await expect(this.autoRenewalEnabledText).toBeVisible();
            await expect(this.autoRenewalDisabledText).not.toBeVisible();
        } else {
            await expect(this.autoRenewalDisabledText).toBeVisible();
            await expect(this.autoRenewalEnabledText).not.toBeVisible();
        }
    }

    async verifyProductInformation(data: ProductData) {
        // await expect(this.discountKPIText).toHaveText(data.KPI);
        await expect(this.estimatedTaxText).toHaveText(data.estimatedTax);
        await expect(this.totalPriceText).toHaveText(data.totalNetPrice);
        expect(await this.productNameSummaryScreenText.allTextContents()).toEqual(data.productName);
        expect(await this.productSKUText.allTextContents()).toEqual(data.productSKU);
        const actualNetPrices = await this.netPriceText.allTextContents();
        for (let i = 0; i < data.productsPrice.length; i++) {
            expect('Net Price: ' + actualNetPrices[i]).toEqual(data.productsPrice[i]);
        }

        const actualProductQuantities = await this.productQuantityText.allTextContents();
        for (let i = 0; i < data.productQuantity.length; i++) {
            expect('Quantity: ' + actualProductQuantities[i]).toEqual(data.productQuantity[i]);

        }
    }

    async verifyContractInformation(contractID: string, status: string, dealerName: string, customerName: string, createdBy: string, poReferenceNumber: string) {
        await expect(this.summaryScreenText).toContainText(`Renewal Contract #${contractID}`);
        await expect(this.contractStatusText).toHaveText(status);
        await expect(this.dealerNameText).toHaveText(dealerName);
        await expect(this.customerNameText).toHaveText(customerName);
        // await expect(this.CreatedByText).toHaveText(createdBy);
        await expect(this.POReferenceNumberText).toHaveText(poReferenceNumber);
    }

    async verifyDraftExpiredMessage(expiryDate: string, message: string) {
        console.log(`Expiry Date: ${expiryDate}`);
        console.log(`Message: ${message}`);
        console.log(`Draft Expired Text: ${await this.draftExpiredText.textContent()}`);
        console.log(`Draft Expired Date Text: ${await this.draftExpiredDateText.textContent()}`);

        await expect(this.draftExpiredText).toHaveText(message);
        await expect(this.draftExpiredDateText).toHaveText(expiryDate);
        await expect(this.backToTableButton).toBeVisible();
        await this.backToTableButton.click();
    }

    async clickPlaceOrderButton() {
        await this.placeOrderButton.click();
        if (await this.okayPlaceOrderButton.isVisible()) {
            await this.okayPlaceOrderButton.click();
        }
    }

    async verificationOfAlertPopup() {
        await expect(this.toast).toBeVisible();
        await expect(this.toastSVGBtn).toBeVisible();
        await expect(this.toastCloseButton).toBeVisible();
    }

    async verifyAmendContractButtonIsDisabled() {
        await expect(this.disabledAmendContractBtn).toBeVisible();
    }

    async onHoverAmendContractBtnAndverifyTooltipText(expectedTooltipText: string) {
        await this.disabledAmendContractBtn.hover();
        await expect(this.disabledAmendContractTooltipText).toHaveText(expectedTooltipText);
    }

    async fetchContractGUIDFromURL() {
        await expect(this.page).toHaveURL(/contracts\/[0-9a-fA-F-]{36}/, { timeout: 30000 });
        const url = this.page.url();
        const match = url.match(/contracts\/([0-9a-fA-F-]{36})/);
        const contract_guid = match ? match[1] : null;
        if (!contract_guid) {
            throw new Error('Contract GUID not found in URL');
        }
        return contract_guid.toString();
    }

    async isAmendContractButtonVisible() {
        let amendContractButtonVisible: boolean = await this.amendContractButton.isVisible();
        console.log('Amend Contract button is visible:', amendContractButtonVisible);
        if (!amendContractButtonVisible) {
            return false;
        }
        let amendContractButtonEnabled: boolean = await this.amendContractButton.isEnabled();
        console.log('Amend Contract button enabled:', amendContractButtonEnabled);
        if (amendContractButtonEnabled)
            return true;
        else
            return false;
    }

    async verifyStartDateInSummaryScreen(startDate: string) {
        await expect(this.startDate).toHaveText(startDate);
    }

    async verifyAutoRenewalIsOffInSummaryScreen(timeout = 5000) {
        await expect(this.autoRenewalOffCaption).toHaveText('Auto-renewal is off', { timeout });
    }

    async verifyAutoRenewalIsOFFInContractDetailsScreen() {
        await expect(this.autoRenewalIsOFFInContractDetailsScreen).toHaveText('OFF');
    }

    async verifyAutoRenewalIsONInContractDetailsScreen() {
        await expect(this.autoRenewalIsONInContractDetailsScreen).toHaveText('ON');
    }

    async verifyStartDateInContractDetailsScreen(date: string) {
        await expect(this.startDateInContractDetails).toHaveText(`Target Start Date: ${date}`);
    }

    async summaryScreenAssertionForBundle() {
        await this.page.waitForTimeout(2000);
        await expect(this.page.getByText('Bundle')).toHaveCount(2);
    }

    async verifyNoResultsFoundWhenAmendmentIsDiscarded() {
        await this.amendmentHistoryTab.click();
        const noResultsText = this.page.getByText('No results found');
        await expect(noResultsText).toBeVisible({ timeout: 30000 });
    }

    async summaryScreenAssertionForPackage() {
        await this.page.waitForTimeout(2000);
        await expect(this.page.getByText('Package')).toHaveCount(9);
    }

    /**
     * Returns the card/container for the given product.
     */
    private productCard(productName: string): Locator {
        return this.page
            .getByText(productName, { exact: true })
            .locator('xpath=ancestor::div[.//button[@aria-label="Increment"]][1]');
    }

    /**
     * Deletes the given product.
     */
    async deleteProduct(productName: string): Promise<void> {
        const card = this.productCard(productName);
        await expect(card).toBeVisible({ timeout: 10000 });
        await card
            .locator('i:text-is("delete")')
            .click();
        await expect(this.deleteSubscriptionConfirmationPopup).toBeVisible();
        await expect(this.deleteSubscriptionYesButton).toBeVisible();
        await expect(this.deleteSubscriptionCancelButton).toBeVisible();
        await this.deleteSubscriptionYesButton.click();
    }

    /**
     * Returns the current seat quantity for the given product.
     */
    async getSeatQuantity(productName: string): Promise<number> {
        const card = this.productCard(productName);
        await expect(card).toBeVisible({ timeout: 10000 });
        const quantityInput = card.getByRole('spinbutton').first();
        const value = await quantityInput.inputValue();
        return Number.parseInt(value, 10);
    }

    /**
     * Increments the quantity by the given amount.
     */
    async incrementSeats(productName: string, qty: number = 1): Promise<void> {
        const card = this.productCard(productName);
        await expect(card).toBeVisible({ timeout: 10000 });
        for (let i = 0; i < qty; i++) {
            await card
                .getByRole('button', { name: 'Increment' })
                .click();
        }
    }

    /**
     * Decrements the quantity by the given amount.
     * Stops decrementing when quantity reaches 0.
     */
    async decrementSeats(productName: string, qty: number = 1): Promise<void> {
        const card = this.productCard(productName);
        await expect(card).toBeVisible({ timeout: 10000 });

        const decrementButton = card.getByRole('button', { name: 'Decrement' });
        const quantityInput = card.getByRole('spinbutton').first();
        const hasQuantityInput = (await quantityInput.count()) > 0;

        for (let i = 0; i < qty; i++) {
            if (hasQuantityInput) {
                const currentQty = Number.parseInt(await quantityInput.inputValue(), 10);
                if (!Number.isNaN(currentQty) && currentQty <= 0) {
                    break;
                }
            }

            if (!(await decrementButton.isEnabled())) {
                break;
            }

            await decrementButton.click();
        }
    }

    /**
     * Returns the Product ID (SKU) for the given product.
     * Example: Catalyst 60 -> BS-CAT-1M
     */
    async getProductId(productName: string): Promise<string> {
        const card = this.productCard(productName);
        await expect(card).toBeVisible({ timeout: 10000 });
        return (
            await card
                .locator('p')
                .nth(1)
                .textContent()
        )?.trim() ?? '';
    }

    /**
     * Returns the Product Name for the given Product ID.
     * Example: BS-CAT-1M -> Catalyst 60
     */
    async getProductName(productId: string): Promise<string> {
        return (
            await this.page
                .getByText(productId, { exact: true })
                .locator('xpath=preceding-sibling::div/p[1]')
                .textContent()
        )?.trim() ?? '';
    }

    /**
     * Returns the List Price.
     * Example: $ 1,375.00
     */
    async getListPrice(productName: string): Promise<string> {
        const card = this.productCard(productName);
        await expect(card).toBeVisible({ timeout: 10000 });
        return (
            await card
                .getByText('List Price')
                .locator('xpath=following-sibling::p[1]')
                .textContent()
        )?.trim() ?? '';
    }

    /**
     * Returns the Net Price.
     * Example: $ 948.75
     */
    async getNetPrice(productName: string): Promise<string> {
        const card = this.productCard(productName);
        await expect(card).toBeVisible({ timeout: 10000 });
        return (
            await card
                .locator('xpath=.//p[starts-with(normalize-space(), "$")]')
                .last()
                .textContent()
        )?.trim() ?? '';
    }

    /**
     * Returns the Dealer Discount.
     * Example: 35%
     */
    async getDealerDiscount(productName: string): Promise<string> {
        const card = this.productCard(productName);
        await expect(card).toBeVisible({ timeout: 10000 });
        return (
            await card
                .getByText('Dealer Discount')
                .locator('xpath=following-sibling::p')
                .textContent()
        )?.trim() ?? '';
    }

    async findWhetherTermLengthIsMonthlyOrYearly() {
        const termLength = await this.termLengthText.textContent();
        if (termLength?.includes('month')) {
            return 'Monthly';
        } else if (termLength?.includes('year')) {
            return 'Yearly';
        } else {
            return null;
        }
    }

    async validateManualRenewalContractNumberFormat() {
        await expect(this.summaryScreenText).toContainText(/Renewal Contract #\d+-R\d+/, { timeout: 30000 });
        const headerText = (await this.summaryScreenText.textContent() ?? "").replace(/\s+/g, ' ').trim();
        const renewalContractNumber = headerText.match(/Renewal Contract #(\d+-R\d+)/)?.[1];
        if (!renewalContractNumber) {
            throw new Error(`Renewal contract number not found in header text: "${headerText}"`);
        }
        console.log(`Extracted Renewal Contract Number: ${renewalContractNumber}`);
    }

    async clickOnEditSubscription() {
        await expect(this.editRenewalSubscriptionButton).toBeVisible();
        await this.editRenewalSubscriptionButton.click();
        await expect(this.renewalHistoryTab).toBeVisible({ timeout: 10000 });
        await expect(this.generatePricingEditRenewalButton).toBeVisible({ timeout: 10000 });
        await expect(this.addProductEditRenewalButton).toBeVisible({ timeout: 10000 });
    }

    async clickEditDetailsButton() {
        await expect(this.editRenewalDetailsButton).toBeVisible();
        await this.editRenewalDetailsButton.click();
        await expect(this.termMenuItem).toBeVisible({ timeout: 10000 });
        await expect(this.endDateMenuItem).toBeVisible({ timeout: 10000 });
        await expect(this.autoRenewalMenuItem).toBeVisible({ timeout: 10000 });
    }

    async openEndDateAlignDialogFromEditDetails() {
        await expect(this.endDateMenuItem).toBeVisible({ timeout: 10000 });
        await this.endDateMenuItem.click();
        await this.verifyEndDateAlignDialog();
    }

    async verifyEndDateAlignDialog() {
        await expect(this.alignContractEndDateDialogTitle).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateSearchTextbox).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateContractIdHeader).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateCustomerNameHeader).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDatePONumberHeader).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateEndDateHeader).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateCancelButton).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateContinueButton).toBeVisible({ timeout: 10000 });
    }

    async verifyEditDetailsButtonIsNotVisible() {
        await expect(this.editRenewalDetailsButton).toHaveCount(0);
        console.log('Edit Details button is not present');
    }

    async verifyRenewalEditOptionsAreNotVisible() {
        await expect(this.editRenewalDetailsButton).toHaveCount(0);
        await expect(this.editRenewalSubscriptionButton).toHaveCount(0);
        console.log('Renewal edit options are not present');
    }

    async clickTermMenuItem() {
        await expect(this.termMenuItem).toBeVisible({ timeout: 10000 });
        await this.termMenuItem.click();
        await expect(this.termChangeDialogTitle).toBeVisible({ timeout: 10000 });
    }

    async selectCoTermContractInEndDateDialog(selectedContractNumber: string) {
        const escapedContractNumber = selectedContractNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await this.alignContractEndDateSearchTextbox.fill(selectedContractNumber.toString());

        const selectedContractLocator = this.alignContractEndDateContractIdCells
            .filter({ hasText: new RegExp(`^\\s*${escapedContractNumber}\\s*$`) })
            .first();

        await expect(selectedContractLocator).toBeVisible({ timeout: 10000 });
        await selectedContractLocator.click();
        await expect(this.alignContractEndDateCancelButton).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateContinueButton).toBeVisible({ timeout: 10000 });
    }

    async clickContinueInEndDateAlignDialog() {
        await expect(this.alignContractEndDateContinueButton).toBeVisible({ timeout: 10000 });
        await this.alignContractEndDateContinueButton.click();
    }

    async closeEndDateAlignDialog() {
        await expect(this.alignContractEndDateCancelButton).toBeVisible({ timeout: 10000 });
        await this.alignContractEndDateCancelButton.click();
        await expect(this.alignContractEndDateDialog).not.toBeVisible({ timeout: 10000 });
    }

    async getEndDateAlignConfirmationValues() {
        await expect(this.alignContractEndDateDialog).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateGoBackButton).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateSaveAndRepriceButton).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateCurrentEndDateLabel).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateNewEndDateLabel).toBeVisible({ timeout: 10000 });
        await expect(this.alignContractEndDateSelectedContractLabel).toBeVisible({ timeout: 10000 });

        await expect(this.alignContractEndDateSelectedContractIdValue).toBeVisible({ timeout: 10000 });

        const currentEndDate = (await this.alignContractEndDateCurrentEndDateValue.first().textContent())?.trim() ?? '';
        const newEndDate = (await this.alignContractEndDateNewEndDateValue.first().textContent())?.trim() ?? '';
        const selectedContractId = (await this.alignContractEndDateSelectedContractIdValue.textContent())?.trim() ?? '';
        const selectedCustomerName = (await this.alignContractEndDateSelectedCustomerNameValue.textContent())?.trim() ?? '';
        const selectedPONumber = (await this.alignContractEndDateSelectedPONumberValue.textContent())?.trim() ?? '';
        const selectedEndDate = (await this.alignContractEndDateSelectedEndDateValue.textContent())?.trim() ?? '';

        return {
            currentEndDate,
            newEndDate,
            selectedContractId,
            selectedCustomerName,
            selectedPONumber,
            selectedEndDate
        };
    }

    async clickSaveAndRepriceInEndDateAlignDialog() {
        await expect(this.alignContractEndDateSaveAndRepriceButton).toBeEnabled({ timeout: 10000 });
        await this.alignContractEndDateSaveAndRepriceButton.click();
    }

    async verifyChangeContractTermDialog() {
        await expect(this.termChangePopUp).toBeVisible();
        await expect(this.termChangeDialogTitle).toBeVisible();
        await expect(this.termChangeDialogDescription).toBeVisible();
        await expect(this.selectNewTermHeading).toBeVisible();
        await expect(this.annualTermLabel).toHaveText('Annual Term');
        await expect(this.monthlyTermLabel).toHaveText('Monthly Term');
        await expect(this.termChangeCancelButton).toBeVisible();
        await expect(this.saveAndRepriceButton).toBeVisible();
    }

    async clickAnnualTermRadioButton() {
        await expect(this.annualTermLabel).toBeVisible();
        await this.annualTermLabel.click();
        await expect(this.termChangeToYear).toBeChecked();
    }

    async clickMonthlyTermRadioButton() {
        await expect(this.monthlyTermLabel).toBeVisible();
        await this.monthlyTermLabel.click();
        await expect(this.termChangeToMonth).toBeChecked();
    }

    async getTermLengthValue() {
        await expect(this.termLengthValue).toBeVisible();
        const termLength = (await this.termLengthValue.textContent())?.trim() ?? '';
        console.log(`Term Length from summary screen: ${termLength}`);
        return termLength;
    }

    async verifyCurrentTermBadgeMatchesContractTermLength(termLength: string) {
        const normalizedTermLength = termLength.toLowerCase();
        if (normalizedTermLength.includes('month')) {
            await expect(this.monthlyCurrentTermBadge).toBeVisible();
            await expect(this.annualCurrentTermBadge).toHaveCount(0);
            console.log(`Current badge is displayed next to Monthly Term for term length: ${termLength}`);
            return;
        }
        if (normalizedTermLength.includes('year')) {
            await expect(this.annualCurrentTermBadge).toBeVisible();
            await expect(this.monthlyCurrentTermBadge).toHaveCount(0);
            console.log(`Current badge is displayed next to Annual Term for term length: ${termLength}`);
            return;
        }
        throw new Error(`Unable to determine term length from stored summary value: ${termLength}`);
    }

    async verifySaveAndRepriceButtonIsDisabled() {
        await expect(this.saveAndRepriceButton).toBeDisabled();
    }

    async verifySaveAndRepriceButtonIsEnabled() {
        await expect(this.saveAndRepriceButton).toBeEnabled();
    }

    async clickCancelOnTermChangeDialog() {
        await expect(this.termChangeCancelButton).toBeVisible({ timeout: 10000 });
        await this.termChangeCancelButton.click();
    }

    async clickCloseOnTermChangeDialog() {
        await expect(this.termChangeDialogCloseButton).toBeVisible({ timeout: 10000 });
        await this.termChangeDialogCloseButton.click();
    }

    async getContractTotalValue() {
        await expect(this.contractTotalValue).toBeVisible();
        const contractTotal = (await this.contractTotalValue.textContent())?.trim() ?? '';
        console.log(`Contract Total from summary screen: ${contractTotal}`);
        return contractTotal;
    }

    private parseContractTotalAmount(contractTotal: string) {
        const numericValue = Number(contractTotal.replace(/[^0-9.]/g, ''));
        return Number.isNaN(numericValue) ? 0 : numericValue;
    }

    async clickSaveAndRepriceButton() {
        await expect(this.saveAndRepriceButton).toBeEnabled();
        await this.saveAndRepriceButton.click();
    }

    async verifyTermLengthChangedFrom(previousTermLength: string) {
        const previous = previousTermLength.toLowerCase();
        if (previous.includes('month')) {
            await expect(this.termLengthValue).toContainText(/year/i, { timeout: 60000 });
            console.log(`Term Length changed from '${previousTermLength}' to yearly`);
            return;
        }
        if (previous.includes('year')) {
            await expect(this.termLengthValue).toContainText(/month/i, { timeout: 60000 });
            console.log(`Term Length changed from '${previousTermLength}' to monthly`);
            return;
        }
        throw new Error(`Unable to determine expected term length change from: ${previousTermLength}`);
    }

    async verifyContractTotalChangedFrom(previousContractTotal: string) {
        await expect(this.contractTotalValue).not.toHaveText(previousContractTotal, { timeout: 60000 });
        const currentContractTotal = await this.getContractTotalValue();
        const previousAmount = this.parseContractTotalAmount(previousContractTotal);
        const currentAmount = this.parseContractTotalAmount(currentContractTotal);
        const currentDigits = currentContractTotal.replace(/[^0-9]/g, '');
        //added this for debug purposes, In future if issues arises it is easy to check the logic.
        expect(currentDigits, `Contract total should not be all zeros. Actual: ${currentContractTotal}`).not.toMatch(/^0+$/);
        expect(currentAmount, `Contract total should be greater than 0. Actual: ${currentContractTotal}`).toBeGreaterThan(0);
        expect(currentAmount, `Contract total should change after Save and Reprice. Before: ${previousContractTotal}, After: ${currentContractTotal}`).not.toBe(previousAmount);
        console.log(`Contract total changed from ${previousContractTotal} (${previousAmount}) to ${currentContractTotal} (${currentAmount})`);
    }

    async clickNonCurrentTermRadioButton(termLength: string) {
        const normalizedTermLength = termLength.toLowerCase();
        if (normalizedTermLength.includes('month')) {
            await this.clickAnnualTermRadioButton();
            return;
        }
        if (normalizedTermLength.includes('year')) {
            await this.clickMonthlyTermRadioButton();
            return;
        }
        throw new Error(`Unable to determine whether the R1 draft term length is monthly or yearly: ${termLength}`);
    }

    async deleteAllSubscriptionsInEditRenewalToCheckGeneratePricingButtonDisabled() {
        let remainingDeleteButtons = await this.deleteIconButtonList.count();
        while (remainingDeleteButtons > 0) {
            await this.deleteIconButtonList.first().click();
            await expect(this.deleteSubscriptionConfirmationPopup).toBeVisible();
            await this.deleteSubscriptionYesButton.click();
            await this.page.waitForTimeout(1000); // Wait for the deletion to complete
            remainingDeleteButtons = await this.deleteIconButtonList.count();
        }
        await expect(this.generatePricingEditRenewalButton).toBeDisabled();
    }

    async addProductsInEditRenewal() {
        await this.addProductEditRenewalButton.click();
        await expect(this.searchProductTextBox).toBeVisible({ timeout: 10000 });
    }

    async clickOnGeneratePricingInEditRenewal() {
        await expect(this.generatePricingEditRenewalButton).toBeVisible();
        await this.generatePricingEditRenewalButton.click();
        let warningVisible = false;
        try {
            await expect(this.generatePricingFromWarningButton).toBeVisible({ timeout: 3000 });
            warningVisible = true;
        } catch {
            // No missing-base-product warning was shown; pricing has already started.
        }
        if (warningVisible) {
            await this.generatePricingFromWarningButton.click();
        }
        await this.page.waitForTimeout(5000); // Wait for the pricing to be generated
    }

    async deleteSubscriptionEditRenewal() {
        const subscriptionCount = await this.deleteIconButtonList.count();
        expect(subscriptionCount, 'Expected an existing subscription and the newly added product').toBeGreaterThanOrEqual(2);
        await this.deleteIconButtonList.nth(subscriptionCount - 2).click();
        await expect(this.deleteSubscriptionConfirmationPopup).toBeVisible();
        await this.deleteSubscriptionYesButton.click();
        await this.page.waitForTimeout(1000); // Wait for the deletion to complete
        await expect(this.deleteIconButtonList).toHaveCount(subscriptionCount - 1);
    }
}