import { expect, Locator, Page } from "@playwright/test";

export class LockRateDiscretionaryDiscountPage {
    readonly page: Page;

    // ── Section heading & accordion ──────────────────────────────────────────
    readonly billingDiscountSectionHeading: Locator;
    readonly billingAndDiscretionaryDiscountAccordionToggle: Locator;
    readonly discretionaryDiscountAccordionToggle: Locator;
    readonly billingDiscountSubText: Locator;
    readonly billingFrequencyDeclinedDialog: Locator;
    readonly billingFrequencyDeclinedDialogOkayButton: Locator;

    // ── Radio options ─────────────────────────────────────────────────────────
    readonly upfrontBillingRadio: Locator;
    readonly upfrontBillingWithDiscountRadio: Locator;
    readonly annualBillingRadio: Locator;
    readonly upfrontBillingLabel: Locator;
    readonly upfrontBillingWithDiscountLabel: Locator;
    readonly annualBillingLabel: Locator;

    // ── Radio option descriptions ─────────────────────────────────────────────
    readonly upfrontBillingDefaultBadge: Locator;
    readonly upfrontBillingDescription: Locator;
    readonly upfrontBillingWithDiscountDescription: Locator;
    readonly annualBillingDescription: Locator;

    // ── Upfront Billing with Discretionary Discount form ─────────────────────
    readonly discretionaryDiscountInput: Locator;
    readonly discountInvalidErrorMessage: Locator;
    readonly discountNotificationText: Locator;
    readonly discretionaryDiscountReasonTextarea: Locator;
    readonly requestButton: Locator;

    // ── Annual Billing form ───────────────────────────────────────────────────
    readonly annualBillingReasonTextarea: Locator;

    // ── Post-request state ────────────────────────────────────────────────────
    readonly pendingApprovalBadge: Locator;
    readonly withdrawRequestButton: Locator;
    readonly submittedReasonLabel: Locator;
    readonly requestAcceptedBadge: Locator;
    readonly requestDeclinedBadge: Locator;
    readonly contractAlertTitle: Locator;
    readonly contractAlertCloseButton: Locator;

    // ── Withdraw dialog ───────────────────────────────────────────────────────
    readonly withdrawDialogHeading: Locator;
    readonly withdrawDialogBody: Locator;
    readonly withdrawDialogConfirmButton: Locator;
    readonly withdrawDialogCancelButton: Locator;

    readonly withdrawDialogHeadingAnnualBilling: Locator;
    readonly withdrawDialogBodyAnnualBilling: Locator;
    readonly withdrawDialogConfirmButtonAnnualBilling: Locator;
    readonly withdrawDialogCancelButtonAnnualBilling: Locator;

    // ── Remove approved discount dialog ─────────────────────────────────────
    readonly removeConfirmationDialog: Locator;
    readonly removeConfirmationDialogHeading: Locator;
    readonly removeConfirmationDialogBody: Locator;
    readonly removeConfirmationDialogConfirmButton: Locator;
    readonly removeConfirmationDialogCancelButton: Locator;

    //-remove button
    readonly discretionaryDiscountRemoveButton: Locator;
    readonly billingFrequencyRemoveButton: Locator;

    // ── Toast notifications ───────────────────────────────────────────────────
    readonly discountRequestSubmittedToast: Locator;
    readonly discountRequestWithdrawnToast: Locator;

    // ── Footer actions ────────────────────────────────────────────────────────
    readonly placeOrderButton: Locator;
    readonly deleteDraftButton: Locator;
    readonly deleteButton: Locator;

    // ── Pricing summary line ──────────────────────────────────────────────────
    readonly discretionaryDiscountLineText: Locator;
    readonly discretionaryDiscountLineAmount: Locator;
    readonly volumeDiscountLineText: Locator;
    readonly volumeDiscountLineAmount: Locator;
    readonly tariffSurchargeLineText: Locator;
    readonly tariffSurchargeLineAmount: Locator;
    readonly estimatedTaxLineText: Locator;
    readonly estimatedTaxLineAmount: Locator;
    readonly appliedDiscountsSummary: Locator;
    readonly discretionaryDiscountSection: Locator;
    readonly discretionaryDiscountPercent: Locator;

    readonly invalidDiscountPercentageErrorMessage: Locator;
    readonly oneYearContractDiscretionaryDiscountTitle: Locator;
    readonly discretionaryDiscountLabel: Locator;
    readonly discretionaryDiscountValue: Locator;
    readonly placeOrRepriceButton: Locator;
    readonly reasonRequiredErrorMessage: Locator;
    readonly promoCodeErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.reasonRequiredErrorMessage = page.locator('modus-wc-input-feedback').getByText('Reason is required.');
        this.discretionaryDiscountLabel = page.locator('#discount-discretionary');
        this.discretionaryDiscountValue = page.locator('[aria-labelledby="discount-discretionary"]');
        this.billingDiscountSectionHeading = page.getByRole('heading', { name: 'Promotions, Billing and Discretionary Discount', });
        this.billingAndDiscretionaryDiscountAccordionToggle = page.locator('summary.modus-wc-collapse-title, summary').filter({ hasText: /Billing and Discretionary Discount/i }).first();
        this.discretionaryDiscountAccordionToggle = page.locator('details.modus-wc-collapse, modus-wc-collapse').filter({ hasText: 'Discretionary Discount' }).first();
        this.oneYearContractDiscretionaryDiscountTitle = page.locator('summary.modus-wc-collapse-title').filter({ hasText: 'Discretionary Discount' });
        this.billingDiscountSubText = page.getByText('Submit a request for either annual billing or a discretionary discount. Selecting either option will place your order on hold until the request is reviewed.',);
        this.billingFrequencyDeclinedDialog = page.getByTestId('confirmation-dialog').filter({ hasText: 'Billing Frequency Request declined', });
        this.billingFrequencyDeclinedDialogOkayButton = this.billingFrequencyDeclinedDialog.getByRole('button', { name: 'Okay' },);
        this.upfrontBillingRadio = page.locator('modus-wc-radio[input-id="UPFRONT"] input[name="billing-frequency"]',);
        this.upfrontBillingLabel = page.locator('modus-wc-input-label label[for="UPFRONT"]',);
        this.upfrontBillingWithDiscountRadio = page.locator('modus-wc-radio[input-id="DISCRETIONARY"] input[name="billing-frequency"]',);
        this.upfrontBillingWithDiscountLabel = page.locator('modus-wc-input-label label[for="DISCRETIONARY"]',);
        this.annualBillingRadio = page.locator('modus-wc-radio[input-id="ANNUAL"] input[name="billing-frequency"]',);
        this.annualBillingLabel = page.locator('modus-wc-input-label label[for="ANNUAL"]',);
        this.upfrontBillingDefaultBadge = page.getByText('Default Billing', { exact: true });
        this.upfrontBillingDescription = page.getByText('Pay total contract amount at the start of the term', { exact: true },);
        this.upfrontBillingWithDiscountDescription = page.getByText('Request a discount on the total contract amount paid at the start of the term', { exact: true },);
        this.annualBillingDescription = page.getByText('Request to pay in equal annual installments', { exact: true },);
        this.discretionaryDiscountInput = page.getByTestId('discretionary-discount-input').locator('input');
        this.discountInvalidErrorMessage = page.getByTestId('discretionary-discount-helper-text',);
        this.discountNotificationText = page.getByText('You will be notified once the request is approved or declined. The discount will be applied once approved.', { exact: true },);
        this.discretionaryDiscountReasonTextarea = page.getByPlaceholder('Enter the business reason for this discount request');
        this.requestButton = page.getByTestId('reason-request-btn').getByRole('button', { name: 'Request' });
        this.annualBillingReasonTextarea = page.getByPlaceholder('Enter reason for request');
        this.pendingApprovalBadge = page.getByText('Pending Approval', { exact: true });
        this.requestAcceptedBadge = page.getByText('Request Accepted', { exact: true });
        this.requestDeclinedBadge = page.getByTestId('discretionary-discount-badge').getByText('Request Declined', { exact: true });
        this.contractAlertTitle = page.getByTestId('contract-alert-title');
        this.contractAlertCloseButton = page.getByRole('button', { name: 'Dismiss alert' }).first();
        this.withdrawRequestButton = page.getByRole('button', { name: 'Withdraw Request' });
        this.submittedReasonLabel = page.getByText('Submitted reason', { exact: true });
        this.discretionaryDiscountRemoveButton = page.getByTestId('discretionary-discount-remove-btn');
        this.billingFrequencyRemoveButton = page.getByTestId('billing-frequency-remove-btn');
        const withdrawDialog = page.getByTestId('confirmation-dialog').filter({ hasText: 'Withdraw Discretionary Request', });
        this.withdrawDialogHeading = withdrawDialog.getByTestId('confirmation-dialog-title');
        this.withdrawDialogBody = withdrawDialog.getByTestId('confirmation-dialog-message');
        this.withdrawDialogConfirmButton = withdrawDialog.getByTestId('confirm-button');
        this.withdrawDialogCancelButton = withdrawDialog.getByTestId('cancel-button');
        const withdrawDialogAnnualBilling = page.getByTestId('confirmation-dialog').filter({ hasText: 'Withdraw Billing Change Request', });
        this.withdrawDialogHeadingAnnualBilling = withdrawDialogAnnualBilling.getByTestId('confirmation-dialog-title');
        this.withdrawDialogBodyAnnualBilling = withdrawDialogAnnualBilling.getByTestId('confirmation-dialog-message');
        this.withdrawDialogConfirmButtonAnnualBilling = withdrawDialogAnnualBilling.getByTestId('confirm-button');
        this.withdrawDialogCancelButtonAnnualBilling = withdrawDialogAnnualBilling.getByTestId('cancel-button');
        this.removeConfirmationDialog = page.getByTestId('confirmation-dialog').filter({ hasText: 'Remove Approved Discretionary Discount', });
        this.removeConfirmationDialogHeading = this.removeConfirmationDialog.getByTestId('confirmation-dialog-title');
        this.removeConfirmationDialogBody = this.removeConfirmationDialog.getByTestId('confirmation-dialog-message');
        this.removeConfirmationDialogConfirmButton = this.removeConfirmationDialog.getByTestId('confirm-button');
        this.removeConfirmationDialogCancelButton = this.removeConfirmationDialog.getByTestId('cancel-button');
        this.discountRequestSubmittedToast = page.getByText('Discretionary discount request submitted successfully', { exact: true },);
        this.discountRequestWithdrawnToast = page.getByText('Discretionary discount request withdrawn successfully', { exact: true },);
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order', exact: true, });
        this.deleteDraftButton = page.getByRole('button', { name: 'Delete Draft' });
        this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
        this.discretionaryDiscountLineText = page.getByText('Discretionary Discount', { exact: true, });
        this.discretionaryDiscountLineAmount = page.locator('td[aria-labelledby="discount-discretionary"] p,  [data-testid="discount-discretionary-value"]').first();
        this.volumeDiscountLineText = page.locator('#discount-volume');
        this.volumeDiscountLineAmount = page.locator('td[aria-labelledby="discount-volume"] p');
        this.tariffSurchargeLineText = page.locator('#surcharge');
        this.tariffSurchargeLineAmount = page.locator('td[aria-labelledby="surcharge"] p');
        this.estimatedTaxLineText = page.locator('#estimated-tax');
        this.estimatedTaxLineAmount = page.locator('td[aria-labelledby="estimated-tax"] p');
        this.appliedDiscountsSummary = page.getByTestId('applied-discounts-summary');
        this.discretionaryDiscountSection = this.appliedDiscountsSummary.getByTestId('discretionary-discount-section');
        this.discretionaryDiscountPercent = this.discretionaryDiscountSection.getByTestId('discretionary-discount-percent');

        this.invalidDiscountPercentageErrorMessage =this.page.getByTestId('discretionary-discount-input').locator('modus-wc-input-feedback').getByText(/Discount between .* is only permissible/);        this.placeOrRepriceButton = page.getByTestId('place-or-reprice-button').locator('button');
        this.promoCodeErrorMessage = this.page.getByTestId('promo-code-error-message');
    }

    async clickBillingDiscountExpandButton() {
        await this.billingAndDiscretionaryDiscountAccordionToggle.click();
    }

    async verifyBillingAndDiscretionaryDiscountUIElements() {
        await expect(this.billingDiscountSectionHeading).toBeVisible();
        await expect(this.billingAndDiscretionaryDiscountAccordionToggle).toBeVisible();
        const billingDiscountAccordion = this.billingAndDiscretionaryDiscountAccordionToggle.locator('..');
        if (await billingDiscountAccordion.getAttribute('open') === null) {
            await this.billingAndDiscretionaryDiscountAccordionToggle.click();
        }
        await expect(this.billingDiscountSubText).toBeVisible();

        await this.upfrontBillingRadio.waitFor({ state: 'visible' });
        await expect(this.upfrontBillingLabel).toBeVisible();
        await expect(this.upfrontBillingDescription).toBeVisible();


        await this.upfrontBillingWithDiscountRadio.waitFor({ state: 'visible' });
        await expect(this.upfrontBillingWithDiscountLabel).toBeVisible();
        await expect(this.upfrontBillingWithDiscountDescription).toBeVisible();


        await this.annualBillingRadio.waitFor({ state: 'visible' });
        await expect(this.annualBillingLabel).toBeVisible();
        await expect(this.annualBillingDescription).toBeVisible();
    }

    async verifyDiscretionaryDiscountIsNotAvailableForDraftContract() {
        // Technicians may still see a read-only view of an already-approved discount,
        // so only assert that the request controls (input + Request button) are hidden.
        await expect(this.discretionaryDiscountInput).not.toBeVisible();
        await expect(this.requestButton).not.toBeVisible();
    }

    async selectUpfrontBillingWithDiscountOption() {
        await this.upfrontBillingWithDiscountRadio.waitFor({ state: 'visible' });
        await this.upfrontBillingWithDiscountRadio.check();
        await expect(this.discountNotificationText).toBeVisible();
    }

    async selectAnnualBillingOption() {
        await this.annualBillingRadio.waitFor({ state: 'visible' });
        await this.annualBillingRadio.check();
    }

    async enterDiscretionaryDiscountValidValue(value: string) {
        await this.discretionaryDiscountInput.click();
        await this.discretionaryDiscountInput.fill(value);
    }

    async enterInvalidDiscountPercentageAndVerifyErrorMessage(value: string) {
        await this.discretionaryDiscountInput.click();
        await this.discretionaryDiscountInput.fill(value);
        await expect(this.invalidDiscountPercentageErrorMessage).toHaveText('Discount between 0.5 and 99.4 is only permissible.');
    }

    async verify() {
        await expect(this.promoCodeErrorMessage).toHaveText('Promo Code must be less than 255 characters');
    }

    async enterUpfrontBillingWithDiscretionaryDiscountRequest(reason: string) {
        await this.discretionaryDiscountReasonTextarea.fill(reason);
    }

    async enterAnnualReasonForRequest(reason: string) {
        await this.annualBillingReasonTextarea.fill(reason);
    }

    async fillAndClearRequestFieldAndVerifyReasonRequired(requestType: 'annualBilling' | 'discretionaryDiscount', reason: string) {
        const requestField = requestType === 'annualBilling' ? this.annualBillingReasonTextarea : this.discretionaryDiscountReasonTextarea;
        await requestField.fill(reason);
        await requestField.clear();
        await expect(this.reasonRequiredErrorMessage).toHaveText('Reason is required.');
    }

    async enterReasonOver500CharactersAndVerifyRequestButtonDisabled(requestType: 'annualBilling' | 'discretionaryDiscount') {
        const requestField = requestType === 'annualBilling' ? this.annualBillingReasonTextarea : this.discretionaryDiscountReasonTextarea;
        await requestField.fill('a'.repeat(501));
        await expect(this.requestButton).toBeDisabled();
        await requestField.clear();
    }

    async clickRequestButton() {
        //waittime added - quote is generated in backend, we need to wait for sometime before clicking on request button, otherwise request will fail
        await this.page.waitForTimeout(40000);
        await this.requestButton.click();
        await this.page.waitForTimeout(10000);
    }

    async verifyPendingApprovalBadgeVisible() {
        await expect(this.pendingApprovalBadge.first()).toBeVisible();
    }

    async verifyRequestAcceptedBadgeVisible() {
        await expect(this.requestAcceptedBadge.first()).toBeVisible();
    }

    async verifyRequestAcceptedBadgeNotVisible() {
        await expect(this.requestAcceptedBadge.first()).not.toBeVisible();
    }

    async verifyRequestDeclinedBadgeVisible() {
        await expect(this.requestDeclinedBadge).toBeVisible();
    }

    async verifyRequestDeclinedBadgeNotVisible() {
        await expect(this.requestDeclinedBadge).not.toBeVisible();
    }

    async verifyBillingFrequencyRequestDeclinedBanner() {
        await expect(this.contractAlertTitle).toHaveText('Billing Frequency Request declined');
    }

    async verifyDiscretionaryDiscountRequestDeclinedBanner(discountPercentage: string) {
        await expect(this.contractAlertTitle).toHaveText(`Request for ${discountPercentage}% discretionary discount declined.`);
    }

    async clickCloseButtonOnBillingFrequencyRequestDeclinedBanner() {
        await this.contractAlertCloseButton.click();
    }

    async verifyPendingApprovalBadgeNotVisible() {
        await expect(this.pendingApprovalBadge.first()).not.toBeVisible();
    }

    async verifyWithdrawRequestButtonVisible() {
        await expect(this.withdrawRequestButton).toBeVisible();
    }

    async withDrawRequestButtonClick() {
        await this.withdrawRequestButton.click();
    }

    async confirmWithdrawRequestPopUpForUpFrontBillingAndDiscretionaryDiscount() {
        await expect(this.withdrawDialogHeading).toHaveText('Withdraw Discretionary Request');
        await expect(this.withdrawDialogBody).toHaveText(
            'You are requesting to withdraw your discretionary discount. Please confirm if you would like to proceed.',
        );
        await expect(this.withdrawDialogCancelButton).toHaveText('Cancel');
        await expect(this.withdrawDialogConfirmButton).toHaveText('Confirm');

        await this.withdrawDialogConfirmButton.click();

        await this.page.waitForTimeout(30000);
    }

    async expandBillingDiscountAccordion() {
        await this.billingAndDiscretionaryDiscountAccordionToggle.click();
    }

    async expandDiscretionaryDiscountAccordion() {
        await this.discretionaryDiscountAccordionToggle.click();
    }

    async verifyWithdrawRequestAndPendingApprovalIsNotVisible() {
        await expect(this.pendingApprovalBadge).not.toBeVisible();
        await expect(this.withdrawRequestButton).not.toBeVisible();
    }

    async confirmWithdrawRequestPopUpForAnnualBilling() {
        await expect(this.withdrawDialogHeadingAnnualBilling).toHaveText('Withdraw Billing Change Request');
        await expect(this.withdrawDialogBodyAnnualBilling).toHaveText(
            'You are requesting to withdraw your request for annual billing. Please confirm if you would like to proceed.',
        );
        await expect(this.withdrawDialogCancelButtonAnnualBilling).toHaveText('Cancel');
        await expect(this.withdrawDialogConfirmButtonAnnualBilling).toHaveText('Confirm');

        await this.withdrawDialogConfirmButtonAnnualBilling.click();

        await this.page.waitForTimeout(30000);
    }

    async verifySubmittedReasonLabelVisible() {
        await expect(this.submittedReasonLabel).toBeVisible();
    }

    async clickDiscretionaryDiscountRemoveButton() {
        await this.discretionaryDiscountRemoveButton.click();
    }

    async clickBillingFrequencyRemoveButton() {
        await this.billingFrequencyRemoveButton.click();
    }

    async verifyRemoveConfirmationDialog() {
        await expect(this.removeConfirmationDialogHeading).toHaveText('Remove Approved Discretionary Discount');
        await expect(this.removeConfirmationDialogBody).toHaveText(
            'You are removing an approved discretionary discount. Removing and requesting for another discount would require a new review process and further delay your order.\n\nPlease confirm if you would like to proceed.',
        );
        await expect(this.removeConfirmationDialogCancelButton).toHaveText('Cancel');
        await expect(this.removeConfirmationDialogConfirmButton).toHaveText('Confirm');
    }

    async confirmRemoveApprovedDiscretionaryDiscount() {
        await this.removeConfirmationDialogConfirmButton.click();
        await this.page.waitForTimeout(30000);
    }

    async verifyDiscretionaryDiscountFor1YearContract() {
        await expect(this.oneYearContractDiscretionaryDiscountTitle).toBeVisible();
        await this.oneYearContractDiscretionaryDiscountTitle.click();
        await expect(this.discretionaryDiscountInput).toBeVisible();
        await expect(this.discountNotificationText).toBeVisible();
        await expect(this.discretionaryDiscountReasonTextarea).toBeVisible();
    }

    async expandDiscretionaryDiscountAccordionFor1YearContract() {
        this.oneYearContractDiscretionaryDiscountTitle.click();
    }

    async verifyVolumeDiscountIsDisplayed() {
        await expect(this.volumeDiscountLineText).toBeVisible();
        await expect(this.volumeDiscountLineAmount).toBeVisible();
    }

    async verifyDiscretionaryDiscountIsDisplayed() {
        await expect(this.discretionaryDiscountLineAmount).toBeVisible();
    }

    async verifyDiscretionaryDiscountSectionIsShownWithDiscountValue(discountPercentage: string) {
        await expect(this.appliedDiscountsSummary).toBeVisible();
        await expect(this.discretionaryDiscountSection).toBeVisible();
        await expect(this.discretionaryDiscountPercent).toHaveText(`${discountPercentage}%`);
    }

    async verifyDiscountsAreVisible() {
        await expect(this.discretionaryDiscountLineAmount).toBeVisible();
    }

    async verifyDiscountsAreRemoved() {
        await expect(this.discretionaryDiscountLineAmount).not.toBeVisible();
    }

    async placeOrderButtonEnabled() {
        await expect(this.placeOrderButton).toBeEnabled();
    }

    async placeOrRepriceButtonDisabled() {
        await expect(this.placeOrRepriceButton).toBeDisabled();
    }

    async verifyReasonRequiredErrorMessage() {
        await expect(this.reasonRequiredErrorMessage).toBeVisible();
    }
    async clearDiscretionaryDiscountReasonTextArea() {
        await this.discretionaryDiscountReasonTextarea.clear();
    }
}