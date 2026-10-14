import { expect, Locator, Page } from "@playwright/test";
import { Utilities } from "../utils/browserUtilities";
import { ManageLicensesModal } from "./ManageLicensesModal";
interface ProductData {
    productName: string | string[]; // or just string if it's always single
    productSKU: string | string[];
    productQuantity: string | string[];
    productsPrice: string | string[];
    KPI: string | string[];
    estimatedTax: string | string[];
    totalNetPrice: string | string[];
}
export class SummaryScreenPage {
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
    readonly customerAccountNameText: Locator;
    readonly dealerAccountNameText: Locator;
    readonly dealerNameBilledToText: Locator;
    readonly dealerEmailText: Locator;
    readonly billToAddressText: Locator;
    readonly productNameDraftText: Locator;
    readonly productNameSummaryScreenText: Locator;
    readonly productSKUText: Locator;
    readonly productPriceText: Locator;
    readonly productQuantityText: Locator;
    readonly netPriceText: Locator;
    readonly discountText: Locator;
    readonly discountKPIText: Locator;
    readonly estimatedTaxText: Locator;
    readonly totalPriceText: Locator;
    readonly placeOrderButton: Locator;
    readonly backToTableButton: Locator;
    readonly discardDraftButtonInContractSummaryScreen: Locator;
    readonly discardDraftButton: Locator;
    readonly deleteButton: Locator;
    readonly contractSubmittedSuccessfullyText: Locator;
    readonly contractDraftDiscardedText: Locator;
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
    readonly amendmentInProgressAlert: Locator;
    readonly amendmentInProgressStatus: Locator;
    readonly amendmentTotalText: Locator;
    readonly KPIDiscountText: Locator;
    readonly dealerDiscountText: Locator;
    readonly amendmentPriceText: Locator;
    readonly contractTotalText: Locator
    readonly pendingAmendmentBreakdownText: Locator;
    readonly amendmentsDropdown: Locator;
    readonly draftStatusNearAmendmentsDropdown: Locator;
    readonly numberOfLicensesCountInContractSummary: Locator;
    readonly clickAmendmentFromAmendmentDropdwon: Locator;
    readonly activeStatus: Locator;
    readonly draftDiscardedToastText: Locator;
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
    readonly bundleTextInSummaryScreen: Locator;
    readonly contentsPerBundle: Locator;
    readonly contractNumber: Locator;
    readonly renewalPlanningTab: Locator;
    readonly optInApprovedIcon: Locator;
    readonly manageAssignmentsButton: Locator;
    readonly manageLicensesButtons: Locator;
    readonly managePackageAssignmentsButton: Locator;
    readonly amendmentDraftReadyFromBanner: Locator;

    constructor(page: Page) {
        this.page = page;
        this.util = new Utilities(page);
        this.startDate = page.locator('[aria-labelledby="renewal-date"]');
        this.autoRenewalOffCaption = page.locator('[aria-label="renewal-date-caption"]');
        this.autoRenewalIsOFFInContractDetailsScreen = page.locator('[aria-live="polite"]').filter({ hasText: 'OFF' });
        this.autoRenewalIsONInContractDetailsScreen = page.locator('[aria-live="polite"]').filter({ hasText: 'ON' });
        this.startDateInContractDetails = page.locator('p[aria-labelledby="start-date"]');
        this.contractNumber = page.locator('h4[aria-label="contract-number"]');
        this.summaryScreenText = page.locator('[aria-label="contract-number"]');
        this.contractDetailsTab = page.getByRole('button', { name: 'contract-details-toggle' });
        this.subscriptionTab = page.locator('[aria-label="subscriptions-toggle"]');
        this.contractHistoryTab = page.getByRole('button', { name: 'contract-history-toggle' });
        this.amendmentHistoryTab = page.getByRole('button', { name: 'amendment-history-toggle' });
        this.renewalPlanningTab = page.getByRole('button', { name: 'renewal-planning-toggle' });
        this.dealerNameText = page.locator('p[aria-labelledby="dealer-card-title"]');
        this.customerNameText = page.locator('p[aria-labelledby="customer-card-title"]');
        this.CreatedByText = page.locator('p[aria-labelledby="header-card-created-by"]');
        this.POReferenceNumberTextBox = page.getByRole('textbox', { name: 'Enter PO #' });
        this.POReferenceNumberText = page.locator('//h5[@aria-labelledby="po-number"]/h5');
        this.subscriptionDraftStatusText = page.getByLabel('Status', { exact: true }).getByText('Draft');
        this.amendmentDraftStatusText = page.getByText('Draft').nth(1);
        this.subscriptionInprogressStatusText = page.getByLabel('Status', { exact: true }).getByText('In Progress');
        this.amendmentInprogressStatusText = page.getByText('In Progress', { exact: true }).nth(1);
        this.contractStatusText = page.locator('button[aria-label="Contract status"] .modus-wc-chip-label');
        this.termLengthText = page.locator('[aria-labelledby="term-length"]');
        this.startDateText = page.locator('p[aria-labelledby="start-date"]');
        this.autoRenewalEnabledText = page.getByText('Auto Renewal Enabled', { exact: true });
        this.autoRenewalDisabledText = page.getByText('Auto Renewal Disabled', { exact: true });
        this.shipToAddressText = page.locator('p[aria-labelledby="ship-to"]');
        this.customerAdminNameText = page.locator('[aria-labelledby="customer-admin"]').first();
        this.customerAdminEmailText = page.locator('[aria-labelledby="customer-admin"]').last();
        this.customerAccountNameText = page.locator('xpath=//span[contains(text(),"Customer")]//following-sibling::p').last();
        this.dealerAccountNameText = page.locator('xpath=//span[contains(text(),"Dealer")]//following-sibling::p').last();
        this.dealerNameBilledToText = page.locator('xpath=//div[@aria-labelledby="bill-to"]/div[1]/p').first();
        this.dealerEmailText = page.locator('xpath=//div[@aria-labelledby="bill-to"]/div[1]/p').last();
        this.billToAddressText = page.locator('xpath=//div[@aria-labelledby="bill-to"]/div[2]');
        this.productNameDraftText = page.locator('[aria-label="subscription-name"]');
        this.productNameSummaryScreenText = page.locator('xpath=(//div[@data-field="description"]/div/p)');
        this.bundleTextInSummaryScreen = page.locator('h6:visible').filter({ hasText: /^Bundle$/ });
        this.contentsPerBundle = page.getByTestId('contents-per-bundle-title');
        this.productSKUText = page.locator('[aria-label="subscription-sku"]');
        this.productQuantityText = page.locator('div[data-field="quantity"][role="gridcell"]');
        this.productPriceText = page.locator('[aria-labelledby="price-per-seat"]');
        this.netPriceText = page.locator('div[data-field="netPriceTotal"][role="gridcell"]');
        this.discountText = page.locator('//div[@data-field="discounts"]/div/span');
        this.discountKPIText = page.locator('td[aria-labelledby="discount-kpi"]');
        this.totalPriceText = page.locator('td[aria-labelledby="total-net-price"]');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.backToTableButton = page.locator("//span[text()='Back to Contracts']");
        this.discardDraftButtonInContractSummaryScreen = page
            .getByTestId('discard-draft-button')
            .getByRole('button', { name: 'Delete Draft' });
        this.discardDraftButton = this.discardDraftButtonInContractSummaryScreen;
        this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
        this.contractSubmittedSuccessfullyText = page.locator('.MuiSnackbar-root').getByText('Contract submitted', { exact: true });
        this.contractDraftDiscardedText = page.getByText('Draft discarded', { exact: true });
        this.closeButton = page.getByRole('button', { name: 'Close', exact: true });
        this.acceptButton = page.getByTestId('delete-draft-dialog-confirm-button').getByRole('button', { name: 'Delete' });
        this.deleteDraftWarningText = page.locator('div').filter({ hasText: /^Are you sure that you want to delete the draft\?$/ }).first();
        this.EscKeyPressText = page.getByRole('dialog').filter({ hasText: 'Are you sure that you want to' }).getByLabel('Close modal').first();
        this.draftExpiredText = page.getByText('Since it is expired, you only have view access.');
        this.draftExpiredDateText = page.locator('xpath=//span[contains(text(),"Expired ")]');
        this.amendmentInProgressAlert = page.getByRole('alert');
        this.amendmentInProgressStatus = page.getByText('Amendment in Progress').nth(1);
        this.activeStatus = page.locator('[aria-label="contract status"]');
        this.amendmentTotalText = page.getByRole('heading', { name: 'Amendment Total' });
        this.estimatedTaxText = page.getByRole('heading', { name: 'Estimated Tax' });
        this.KPIDiscountText = page.getByRole('heading', { name: 'KPI Discount' });
        this.dealerDiscountText = page.getByRole('heading', { name: 'Dealer Discount' });
        this.amendmentPriceText = page.getByRole('heading', { name: 'Amendment Price' });
        this.contractTotalText = page.locator('#total-net-price').getByRole('heading', { name: 'Contract Total' });
        this.pendingAmendmentBreakdownText = page.getByRole('heading', { name: 'Pending Amendment Breakdown' });
        this.amendmentsDropdown = page.getByTestId('amendments-header');
        this.draftStatusNearAmendmentsDropdown = page.getByRole('button', { name: 'Contract status' }).nth(1);
        this.numberOfLicensesCountInContractSummary = page.getByRole('heading', { name: 'Licenses' });
        this.clickAmendmentFromAmendmentDropdwon = page.getByTestId('amendment-item-0');
        this.draftDiscardedToastText = page.getByText('Draft Discarded');
        // Toast notifications are now Modus alerts rendered inside a MUI Snackbar: the alert body is exposed as
        // role="status" (role="alert" is only used by notification badges), the message lives in `.title`
        // and the close button is labelled "Dismiss alert".
        this.toast = page.locator('.MuiSnackbar-root').getByRole('status').first();
        this.toastCloseButton = page.locator('.MuiSnackbar-root').getByRole('button', { name: 'Dismiss alert' }).first();
        this.toastSVGBtn = this.toast.locator('.modus-wc-alert-icon').first();
        this.disabledAmendContractBtn = page.locator('[aria-label="You cannot amend a contract while there is an amendment pending"]');
        this.disabledAmendContractTooltipText = page.getByText('You cannot amend a contract');
        this.purchaseOrderNumber = page.locator('[aria-labelledby="purchase-order-number"]');
        this.contractsLink = page.getByRole('link', { name: 'Contracts', exact: true });
        this.amendContractButton = page.getByRole('link', { name: 'Amend Contract' });
        this.manageAssignmentsButton = page.getByRole('button', { name: 'Manage Assignments', exact: true });
        this.manageLicensesButtons = page.getByRole('button', { name: 'Manage Licenses', exact: true });
        this.managePackageAssignmentsButton = page.getByRole('button', { name: 'Manage Package Assignments', exact: true });
        this.optInApprovedIcon = page.getByTestId('opt-in-approved-icon');
        this.amendmentDraftReadyFromBanner = page.getByTestId('quote-number');
    }

    async contractSummaryScreenElementsAssertionWhenAmendmentIsDraft() {
        await expect(this.backToTableButton).toBeVisible();
        await expect(this.contractDetailsTab).toBeVisible();
        await expect(this.subscriptionTab).toBeVisible();
        await expect(this.contractHistoryTab).toBeVisible();
        await expect(this.amendmentHistoryTab).toBeVisible();
        await expect(this.discardDraftButtonInContractSummaryScreen).toBeVisible();
        await expect(this.placeOrderButton).toBeVisible();
        await expect(this.amendmentDraftReadyFromBanner.or(this.pendingAmendmentBreakdownText)).toBeVisible({
            timeout: 60000,
        });
        await expect(this.amendmentTotalText).toBeVisible();
        //await expect(this.KPIDiscountText).toBeVisible();
        //await expect(this.dealerDiscountText).toBeVisible();
        await expect(this.amendmentPriceText).toBeVisible();
        //await expect(this.estimatedTaxText).toBeVisible();
        await expect(this.contractTotalText).toBeVisible();
        await expect(this.pendingAmendmentBreakdownText).toBeVisible();
        await expect(this.numberOfLicensesCountInContractSummary.first()).toBeVisible();
    }

    async assertPurchaseOrderNumberInContractSummaryPage(poNumber: string) {
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

    async licenseCountInContractSummaryPage(licenseAdditionsCount: string) {
        await expect(this.numberOfLicensesCountInContractSummary).toContainText(licenseAdditionsCount);
    }

    async openFirstAmendmentFromAmendmentsTab(): Promise<number | undefined> {
        await expect(this.amendmentHistoryTab).toBeVisible({ timeout: 30000 });
        await this.amendmentHistoryTab.click();
        // Skip draft rows so the test validates an activated/in-progress amendment, not a leftover draft.
        const amendmentRow = this.page.getByRole('row')
            .filter({ hasText: /Amendment\s*(?:ID)?\s*:?\s*Q-\d+/ })
            .filter({ hasNotText: 'Amendment Draft' })
            .first();
        await expect(amendmentRow).toBeVisible({ timeout: 30000 });
        const rowText = (await amendmentRow.innerText()) ?? '';
        const changesCount = rowText.match(/Changes\s+(\d+)/)?.[1];
        console.log(`Opening amendment row: ${rowText.replace(/\s+/g, ' ').trim()}`);
        await amendmentRow.click();
        await expect(this.page).toHaveURL(/\/amendments\//, { timeout: 30000 });
        return changesCount ? Number(changesCount) : undefined;
    }

    async clickAmendmentFromAmendmentDropdownShouldTakeToAmendmentSummaryPage() {
        if (await this.amendmentDraftReadyFromBanner.isVisible().catch(() => false)) {
            await this.clickOnAmendmentDraftReadyFromBanner();
        } else {
            await this.amendmentsDropdown.first().click();
            await this.clickAmendmentFromAmendmentDropdwon.first().click();
        }
        await expect(this.page).toHaveURL(/\/amendments\//, { timeout: 30000 });
    }

    async summaryScreenPageAssertion() {
        await expect(this.contractNumber).toBeVisible();
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

    async fillPOReferenceNumber(poNumber: string) {
        const randomNumber = await this.util.generateRandomNumber(100, 999);
        console.log(`Generated random number: ${randomNumber}`);
        await expect(this.POReferenceNumberTextBox).toBeVisible({ timeout: 45000 });
        await this.POReferenceNumberTextBox.click();
        await this.POReferenceNumberTextBox.fill(poNumber + randomNumber.toString());
        await this.page.waitForTimeout(1000);
        await expect(this.POReferenceNumberTextBox).toHaveValue(poNumber + randomNumber.toString());
        await this.termLengthText.click();
        return poNumber + randomNumber.toString();
    }

    async fillPOReferenceNumberWORandomNumber(poNumber: string) {
        await expect(this.POReferenceNumberTextBox).toBeVisible({ timeout: 45000 });
        await this.POReferenceNumberTextBox.click();
        await this.POReferenceNumberTextBox.fill(poNumber);
        await this.page.waitForTimeout(1000);
        await expect(this.POReferenceNumberTextBox).toHaveValue(poNumber);
        await this.termLengthText.click();
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

    /** Closes any toast still on screen (e.g. "Purchase Order Number saved") so the next assertion targets a fresh toast. */
    private async dismissVisibleToast() {
        if (await this.toastCloseButton.isVisible().catch(() => false)) {
            await this.toastCloseButton.click();
            await expect(this.toast).toBeHidden({ timeout: 10000 });
        }
    }

    async convertToContract() {
        await this.dismissVisibleToast();
        await this.placeOrderButton.click();
        // Use an explicit timeout below the 180s test timeout so a failure reports the toast actually shown
        // (e.g. a backend error) instead of a bare test-timeout.
        try {
            await expect(this.contractSubmittedSuccessfullyText).toBeVisible({ timeout: 90000 });
        } catch (error) {
            const toastText = ((await this.toast.innerText().catch(() => '')) ?? '').replace(/\s+/g, ' ').trim();
            throw new Error(
                `"Contract submitted" toast was not displayed after clicking Place Order. ` +
                `Toast currently shown: "${toastText || 'none'}". ${error instanceof Error ? error.message : String(error)}`
            );
        }
        console.log('Contract submitted toast is displayed');
        await this.contractsLink.click();
    }

    async getContractIDFromHeader() {
        await expect(this.summaryScreenText).toContainText(/(Contract|Trail|Renewal Contract) #\d+/, { timeout: 30000 });
        const headerText = (await this.summaryScreenText.textContent() ?? "").replace(/\s+/g, ' ').trim();
        const contractID = headerText.match(/(?:Contract|Trail|Renewal Contract)\s*#(\d+)/)?.[1];
        if (!contractID) {
            throw new Error(`Contract ID not found in header text: "${headerText}"`);
        }
        console.log(`Extracted Contract ID: ${contractID}`);
        return contractID;
    }

    async discardDraftFunctionalityInSummaryScreen() {
        await expect(this.placeOrderButton).toBeEnabled();
        await expect(this.backToTableButton).toBeVisible();
        await expect(this.discardDraftButtonInContractSummaryScreen).toBeEnabled();
        await this.discardDraftButtonInContractSummaryScreen.click();
        await expect(this.deleteDraftWarningText).toBeVisible();
        await expect(this.EscKeyPressText).toBeVisible({ timeout: 10000 });
        await this.closeButton.click();
        await expect(this.deleteDraftWarningText).not.toBeVisible({ timeout: 10000 });
        await this.discardDraftButtonInContractSummaryScreen.click();
        await this.page.keyboard.press('Escape');
        await expect(this.EscKeyPressText).not.toBeVisible();
        await this.discardDraftButtonInContractSummaryScreen.click();
        await this.acceptButton.click();
        // await expect(this.contractDraftDiscardedText).toBeVisible();
        // Commented for now as the toast message is not displayed due to some bug
        // NZDEV-710
    }

    async clickCloseButtonOnDiscardDraftPopUpAndVerifyItRetainsInSameScreen() {
        await this.discardDraftButtonInContractSummaryScreen.click();
        await expect(this.deleteDraftWarningText).toBeVisible();
        await expect(this.EscKeyPressText).toBeVisible();
        await expect(this.closeButton).toBeVisible();
        await expect(this.acceptButton).toBeVisible();
        await this.closeButton.click();
        await expect(this.deleteDraftWarningText).not.toBeVisible();
    }

    async clickAcceptButtonOnDiscardDraftPopUp() {
        await this.discardDraftButtonInContractSummaryScreen.click();
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
        await expect(this.summaryScreenText).toContainText(`Contract #${contractID}`);
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
        //await expect(this.bundleTextInSummaryScreen.first()).toHaveText('Bundle');
        await expect(this.page.locator('h6:visible').filter({ hasText: /^Bundle$/ }).first()).toHaveText('Bundle');
    }

    async verifyNoResultsFoundWhenAmendmentIsDiscarded() {
        await this.amendmentHistoryTab.click();
        const noResultsText = this.page.getByText('No results found');
        await expect(noResultsText).toBeVisible({ timeout: 30000 });
    }

    async summaryScreenAssertionForPackage() {
        await this.page.waitForTimeout(2000);
        await expect(this.page.locator('h6:visible').filter({ hasText: /^Package$/ }).first()).toHaveText('Package');
    }

    /** Nearest card ancestor of a subscription's SKU text (`.filter({ has })` would match nested cards too). */
    private subscriptionCard(sku: string): Locator {
        return this.page.locator(
            `xpath=//p[normalize-space(text())="${sku}"]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " MuiCard-root ")][1]`,
        );
    }

    manageLicensesButton(sku: string): Locator {
        return this.subscriptionCard(sku).getByRole('button', { name: 'Manage Licenses' });
    }

    async validateSubscriptionCardForAssignment(sku: string) {
        const card = this.subscriptionCard(sku);
        await expect(card).toBeVisible();
        await expect(card.getByText(sku, { exact: true })).toBeVisible();
        await expect(this.manageLicensesButton(sku)).toBeVisible();
    }

    async assignedAndUnassignedLicenseCounts(sku: string): Promise<{ assigned: number; unassigned: number }> {
        const card = this.subscriptionCard(sku);
        const assignedCount = card.locator('[aria-labelledby="assigned-license-count"]');
        const unassignedCount = card.locator('[aria-labelledby="unassigned-license-count"]');
        await expect(card).toBeVisible();
        await expect(assignedCount).toHaveText(/^\d+$/);
        await expect(unassignedCount).toHaveText(/^\d+$/);
        const assignedText = await assignedCount.textContent();
        const unassignedText = await unassignedCount.textContent();
        return {
            assigned: Number(assignedText?.trim() ?? 0),
            unassigned: Number(unassignedText?.trim() ?? 0),
        };
    }

    async openManageLicensesModal(sku: string): Promise<ManageLicensesModal> {
        const modal = new ManageLicensesModal(this.page, sku);
        await this.manageLicensesButton(sku).click();
        await expect(modal.dialog).toBeVisible();
        return modal;
    }

    async validateLicenseCountsAfterAssignment(sku: string, before: { assigned: number; unassigned: number }) {
        // Compares against the captured baseline rather than an exact delta, since parallel tests
        // may assign/revoke other licenses on the same subscription concurrently.
        await expect
            .poll(async () => (await this.assignedAndUnassignedLicenseCounts(sku)).assigned)
            .toBeGreaterThanOrEqual(before.assigned);
        await expect
            .poll(async () => (await this.assignedAndUnassignedLicenseCounts(sku)).unassigned)
            .toBeLessThanOrEqual(before.unassigned);
    }

    private async assertOptInApprovedIconIsVisible() {
        // isVisible() ignores timeout and returns immediately, while this icon is inserted only after the org header finishes loading.
        const visible = await this.optInApprovedIcon
            .waitFor({ state: 'visible', timeout: 30000 })
            .then(() => true)
            .catch(() => false);
        if (!visible) {
            throw new Error('Opt-in approved icon is not visible. Please do Dealer Opt-in');
        }
    }

    private async dismissBlockingDialogs() {
        for (let attempt = 0; attempt < 8; attempt++) {
            const okay = this.page.getByRole('button', { name: 'Okay', exact: true });
            if (await okay.isVisible().catch(() => false)) {
                await okay.click();
                continue;
            }

            const ok = this.page.getByRole('button', { name: 'OK', exact: true });
            if (await ok.first().isVisible().catch(() => false)) {
                await ok.first().click();
                continue;
            }

            const editSubscriptions = this.page.getByRole('heading', { name: 'Edit Subscriptions' });
            if (await editSubscriptions.isVisible().catch(() => false)) {
                await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
                continue;
            }

            // Error dialogs opened after a Manage* click/hover ("Something went wrong")
            const somethingWentWrong = this.page.getByText('Something went wrong');
            if (await somethingWentWrong.isVisible().catch(() => false)) {
                const cancel = this.page.getByRole('button', { name: 'Cancel', exact: true });
                if (await cancel.isVisible().catch(() => false)) {
                    await cancel.click();
                } else {
                    await this.page.getByRole('button', { name: 'Close modal' }).first().click().catch(() => { });
                }
                continue;
            }

            break;
        }
    }

    async validateAllManageLicensesAssignmentsButtonsAreEnabled() {
        await this.clickSubscriptionTab();
        await this.assertOptInApprovedIconIsVisible();

        const buttonGroups = [
            this.manageAssignmentsButton,
            this.manageLicensesButtons,
            this.managePackageAssignmentsButton,
        ];
        await expect(
            this.manageAssignmentsButton.or(this.manageLicensesButtons).or(this.managePackageAssignmentsButton).first(),
        ).toBeVisible({ timeout: 30000 });
        let checked = 0;
        for (const locator of buttonGroups) {
            const count = await locator.count();
            for (let i = 0; i < count; i++) {
                await expect(locator.nth(i), `Manage button ${checked + 1}`).toBeEnabled();
                checked++;
            }
        }
        expect(checked).toBeGreaterThan(0);
        console.log(`All ${checked} Manage* buttons are enabled`);
    }

    async validateAllManageLicensesAssignmentsButtonsAreDisabled(OrderType: string) {
        await this.clickSubscriptionTab();
        const pendingAmendment = OrderType.trim().toLowerCase() === 'amendment';
        // A pending amendment removes or disables Manage* on its own. The opt-in icon only gates
        // whether those buttons can be enabled, so it is not part of the amendment check.
        if (!pendingAmendment) {
            await this.assertOptInApprovedIconIsVisible();
        }

        const buttonGroups = [
            this.manageAssignmentsButton,
            this.manageLicensesButtons,
            this.managePackageAssignmentsButton,
        ];
        if (pendingAmendment) {
            await expect(this.productNameDraftText.first()).toBeVisible({ timeout: 30000 });
        } else {
            await expect(
                this.manageAssignmentsButton.or(this.manageLicensesButtons).or(this.managePackageAssignmentsButton).first(),
            ).toBeVisible({ timeout: 30000 });
        }
        let checked = 0;
        for (const locator of buttonGroups) {
            const count = await locator.count();
            for (let i = 0; i < count; i++) {
                await expect(locator.nth(i), `Manage button ${checked + 1}`).toBeDisabled({ timeout: 30000 });
                checked++;
            }
        }
        if (pendingAmendment && checked === 0) {
            console.log('No Manage* buttons are offered while an amendment is in progress');
            return;
        }
        expect(checked).toBeGreaterThan(0);
        console.log(`All ${checked} Manage* buttons are disabled (${OrderType})`);
    }

    async clickOnAmendmentDraftReadyFromBanner() {
        await expect(this.amendmentDraftReadyFromBanner).toBeVisible();
        await expect(this.amendmentDraftReadyFromBanner).toBeEnabled();
        await this.amendmentDraftReadyFromBanner.click();
    }
}