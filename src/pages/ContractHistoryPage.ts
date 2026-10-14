
import { expect, Locator, Page } from "@playwright/test";

export class ContractHistoryPage {
    readonly page: Page;
    readonly contractHistoryTab: Locator;
    readonly contractHistoryContainer: Locator;
    readonly contractHistoryCards: Locator;
    readonly contractHistoryTitle: Locator;
    readonly contractHistoryDate: Locator;
    readonly contractHistoryDetails: Locator;
    readonly contractHistoryViewDetailsLink: Locator;
    readonly contractHistoryPrice: Locator;
    readonly versionsTab: Locator;
    readonly noResultsFoundText: Locator;
    readonly backToHistoryLink: Locator;
    readonly contractRenewedBannerText: Locator;

    readonly byDealerField: Locator;
    readonly byDealerValue: Locator;
    readonly requestedByField: Locator;
    readonly requestedByValue: Locator;
    readonly amendmentIdField: Locator;
    readonly amendmentIdValue: Locator;
    readonly poNumberField: Locator;
    readonly poNumberValue: Locator;
    readonly parentContractIdValue: Locator;
    readonly renewalContractIdValue: Locator;
    readonly contractEndDateUpdatedEventCard: Locator;
    readonly contractEndDateUpdatedDetails: Locator;
    readonly contractEndDateUpdatedByDealerValue: Locator;
    readonly contractEndDateUpdatedQuoteIdValue: Locator;

    private eventTitleLocator(eventTitle: string): Locator {
        return this.contractHistoryTitle.filter({ hasText: new RegExp(eventTitle, 'i') }).first();
    }


    constructor(page: Page) {
        this.page = page;
        this.contractHistoryTab = page.locator('button[aria-label="contract-history-toggle"], button[value="history"]');
        this.contractHistoryContainer = page.getByTestId('contract-history-container');
        this.contractHistoryCards = page.getByTestId('contract-history-card').first();
        this.contractHistoryTitle = page.getByTestId('contract-history-title');
        this.contractHistoryDate = page.getByTestId('contract-history-date').first();
        this.contractHistoryDetails = page.getByTestId('contract-history-details').first();
        this.contractHistoryViewDetailsLink = page.getByTestId('contract-history-view-details-link').first();
        this.contractHistoryPrice = page.getByTestId('contract-history-price').first();
        this.versionsTab = page.locator('button[aria-label="versions-toggle"], button[value="versions"], button:has-text("Versions")').first();
        this.noResultsFoundText = page.getByText(/No result found|No results found/i).first();
        this.backToHistoryLink = page.locator('a:has-text("Back to history"), button:has-text("Back to history"), a.navigate-back-link').first();
        this.contractRenewedBannerText = page.getByText(/The contract has been renewed and the new contract number is/i).first();

        this.byDealerField = page.getByTestId('contract-history-field-contract_summary.contract_activity.by_dealer').first();
        this.byDealerValue = page.getByTestId('contract-history-value-contract_summary.contract_activity.by_dealer').first();
        this.requestedByField = page.getByTestId('contract-history-field-contract_summary.customer_request_banner.requested_by').first();
        this.requestedByValue = page.getByTestId('contract-history-value-contract_summary.customer_request_banner.requested_by').first();
        this.amendmentIdField = page.getByTestId('contract-history-field-contract_summary.contract_activity.amendment_id').first();
        this.amendmentIdValue = page.getByTestId('contract-history-value-contract_summary.contract_activity.amendment_id').first();
        this.poNumberField = page.getByTestId('contract-history-field-contract_summary.contract_activity.po_number').first();
        this.poNumberValue = page.getByTestId('contract-history-value-contract_summary.contract_activity.po_number').first();
        this.parentContractIdValue = page.getByTestId('contract-history-value-contract_summary.contract_activity.parent_contract_number').first();
        this.renewalContractIdValue = page.getByTestId('contract-history-value-contract_summary.contract_activity.renewal_contract_number').first();

        this.contractEndDateUpdatedEventCard = page.getByTestId('contract-history-card').filter({ has: this.eventTitleLocator('Contract End Date Updated') }).first();
        this.contractEndDateUpdatedDetails = this.contractEndDateUpdatedEventCard.getByTestId('contract-history-details').first();
        this.contractEndDateUpdatedByDealerValue = this.contractEndDateUpdatedEventCard.getByTestId('contract-history-value-contract_summary.contract_activity.by_dealer').first();
        this.contractEndDateUpdatedQuoteIdValue = this.contractEndDateUpdatedEventCard.getByTestId('contract-history-value-contract_summary.contract_activity.quote_id').first();
    }

    async assertContractHistoryTab() {
        await expect(this.contractHistoryTab).toBeVisible({ timeout: 10000 });
        await this.contractHistoryTab.click();
        await expect(this.contractHistoryContainer).toBeVisible({ timeout: 10000 });
        console.log('Contract History Tab is displayed');
    }

    async verifyContractTermUOMUpdatedFromMonthToYear() {
        await this.verifyContractHistoryEvent('Contract Term UOM Updated');
        await expect(this.contractHistoryDetails.getByText('The contract Term UOM has been updated from month to year', { exact: true })).toBeVisible({ timeout: 10000 });
    }

    async verifyContractTermUOMUpdatedFromYearToMonth() {
        await this.verifyContractHistoryEvent('Contract Term UOM Updated');
        await expect(this.contractHistoryDetails.getByText('The contract Term UOM has been updated from year to month', { exact: true })).toBeVisible({ timeout: 10000 });
    }

    async verifyContractTermUOMUpdatedFrom(previousTermLength: string) {
        const previous = previousTermLength.toLowerCase();
        if (previous.includes('month')) {
            await this.verifyContractTermUOMUpdatedFromMonthToYear();
            return;
        }
        if (previous.includes('year')) {
            await this.verifyContractTermUOMUpdatedFromYearToMonth();
            return;
        }
        throw new Error(`Unable to determine term UOM history event from stored term length: ${previousTermLength}`);
    }

    async verifyContractHistoryPriceContains(contractTotal: string) {
        await expect(this.contractHistoryPrice).toBeVisible({ timeout: 10000 });
        const historyPrice = (await this.contractHistoryPrice.textContent())?.trim() ?? '';
        const expectedAmount = contractTotal.replace(/[^0-9.]/g, '');
        const actualAmount = historyPrice.replace(/[^0-9.]/g, '');
        expect(actualAmount, `Contract history price '${historyPrice}' should contain latest contract total '${contractTotal}'`).toContain(expectedAmount);
    }

    async verifyContractHistory_ContractEndDateUpdated(previousIsoDate: string, newIsoDate: string, expectedDealerIdentity?: string) {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Contract End Date Updated', 120000);
        const expectedDetailsText = `The end date has been changed from ${previousIsoDate} to ${newIsoDate}`;
        await expect(this.contractEndDateUpdatedDetails).toContainText(expectedDetailsText, { timeout: 120000 });
        await expect(this.contractEndDateUpdatedByDealerValue).toBeVisible({ timeout: 120000 });
        if (expectedDealerIdentity) {
            await expect(this.contractEndDateUpdatedByDealerValue).toContainText(expectedDealerIdentity, { timeout: 120000 });
        }
        await expect(this.contractEndDateUpdatedQuoteIdValue).toContainText(/^Q-\d+$/, { timeout: 120000 });
    }

    async verifyContractHistory_DiscretionaryDiscountRequested() {
        await this.verifyContractHistoryEvent('Discretionary Discount Requested');
    }

    async verifyContractHistory_DiscretionaryDiscountRequestAccepted() {
        await this.verifyContractHistoryEvent('Discretionary Discount Request Accepted');
    }

    async verifyContractHistory_BillingFrequencyRequested() {
        await this.verifyContractHistoryEvent('Billing Frequency Requested');
    }

    async verifyContractHistory_BillingFrequencyChangeWithdrawn() {
        await this.verifyContractHistoryEvent('Billing Frequency Change Withdrawn');
    }


    async verifyContractHistory_DiscretionaryDiscountRequestRemoved() {
        await this.verifyContractHistoryEvent('Discretionary Discount Removed');
    }

    async verifyContractHistoryEvent(eventTitle: string, timeoutMs = 10000) {
        await expect(this.eventTitleLocator(eventTitle)).toBeVisible({ timeout: timeoutMs });
        console.log(`Contract history event is displayed: ${eventTitle}`);
    }

    async verifyContractHistory_ContractDraftCreated(quoteType?: string) {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Contract Draft Created');
        if (quoteType === 'renewal') {
            await expect(this.parentContractIdValue).toBeVisible({ timeout: 10000 });
            console.log(`Parent Contract ID is displayed for the Renewal Contract Draft Created event: ${await this.parentContractIdValue.textContent()}`);
            await this.parentContractIdValue.click();
            console.log(`Navigated to the Parent Contract page`);
        }
    }

    async verifyContractHistory_RenewalDraftCreated() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Renewal Draft Created');
        await expect(this.renewalContractIdValue).toBeVisible({ timeout: 10000 });
        console.log(`Renewal Contract ID is displayed for the Renewal Draft Created event: ${await this.renewalContractIdValue.textContent()}`);
        await this.renewalContractIdValue.click();
        console.log(`Navigated to the Renewal Contract page`);
    }

    async verifyContractHistory_RenewalContractSubmitted() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Renewal Contract Submitted');
        await expect(this.renewalContractIdValue).toBeVisible({ timeout: 10000 });
        console.log(`Renewal Contract ID is displayed for the Renewal Contract Submitted event: ${await this.renewalContractIdValue.textContent()}`);
        await this.renewalContractIdValue.click();
        console.log(`Navigated to the Renewal Contract page`);
    }

    async verifyContractHistory_RenewalActivated() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Contract Renewed');
        await expect(this.renewalContractIdValue).toBeVisible({ timeout: 10000 });
        console.log(`Renewal Contract ID is displayed for the Contract Renewed event: ${await this.renewalContractIdValue.textContent()}`);
        await this.renewalContractIdValue.click();
        console.log(`Navigated to the Renewal Contract page`);
    }


    async verifyContractHistory_OrderPlaced(quoteType?: string) {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Order Placed');
        if (quoteType === 'renewal') {
            await expect(this.parentContractIdValue).toBeVisible({ timeout: 10000 });
            console.log(`Parent Contract ID is displayed for the Order Placed event: ${await this.parentContractIdValue.textContent()}`);
            await this.parentContractIdValue.click();
            console.log(`Navigated to the Parent Contract page`);
        }
    }

    async verifyContractHistory_ContractAwaitingActivation() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Contract Awaiting Activation');
    }

    async verifyContractHistory_ContractActivationInProgress() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Activation In Progress');
    }

    async verifyContractHistory_ContractManuallyActivated() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Contract Manually Activated');
    }

    async verifyContractHistory_CustomerRequestReceived() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Customer Request Received');
    }

    async verifyContractHistory_CustomerRequestAccepted() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Customer Request Accepted');
    }

    async verifyContractHistory_CustomerRequestDeclined() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Customer Request Declined');
    }

    async verifyContractHistory_CustomerRequestDeletedByCustomer() {
        await this.assertContractHistoryTab();
        await this.verifyContractHistoryEvent('Customer Request Deleted');
    }

    async verifyCustomerRequestHistoryMetadataVisible() {
        await expect(this.byDealerField).toBeVisible({ timeout: 10000 });
        await expect(this.byDealerValue).toBeVisible({ timeout: 10000 });
        await expect(this.byDealerValue).toContainText(process.env.UPG_ACCOUNT_EMAIL!, { timeout: 10000 });

        await expect(this.requestedByField).toBeVisible({ timeout: 10000 });
        await expect(this.requestedByValue).toBeVisible({ timeout: 10000 });
        await expect(this.requestedByValue).toContainText(process.env.AXP_GLOBAL_EMAIL!, { timeout: 10000 });

        await expect(this.amendmentIdField).toBeVisible({ timeout: 10000 });
        await expect(this.amendmentIdValue).toBeVisible({ timeout: 10000 });

        await expect(this.poNumberField).toBeVisible({ timeout: 10000 });
        await expect(this.poNumberValue).toBeVisible({ timeout: 10000 });

        await expect(this.contractHistoryViewDetailsLink.first()).toBeVisible({ timeout: 10000 });
    }

    async openVersionsTab() {
        await this.assertContractHistoryTab();
        await expect(this.versionsTab).toBeVisible({ timeout: 10000 });
        await this.versionsTab.click();
    }

    async verifyNoResultsFoundInVersionsTab() {
        await expect(this.noResultsFoundText).toBeVisible({ timeout: 10000 });
        console.log('"No results found" in Versions tab as expected - Pass');
    }

    async verifyVersionAndTypeVisible(version: 'V1' | 'V2', versionType: 'Original' | 'Amendment') {
        await expect(this.page.getByText(new RegExp(`^\\s*${version}\\s*$`, 'i')).first()).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByText(new RegExp(`^\\s*${versionType}\\s*$`, 'i')).first()).toBeVisible({ timeout: 10000 });
        console.log(`Version ${version} and type ${versionType} are visible in Versions tab - Pass`);
    }

    async verifyVersionNotVisible(version: 'V1' | 'V2') {
        await expect(this.page.getByText(new RegExp(`^\\s*${version}\\s*$`, 'i'))).toHaveCount(0);
        console.log(`Version ${version} is not visible in Versions tab as expected - Pass`);
    }

    async clickVersionAndVerifyReadOnly(version: 'V1' | 'V2', versionNumber: 1 | 2) {
        await this.page.getByText(new RegExp(`^\\s*${version}\\s*$`, 'i')).first().click();
        await expect(this.page).toHaveURL(/([?&]tab=subscriptions(?:&|$)|\/contracts\/[^/]+\/versions\/\d+(?:\?.*)?$)/, { timeout: 30000 });
        await expect(this.page.getByText(`Version ${versionNumber}`, { exact: true })).toBeVisible({ timeout: 10000 });
        const editableFields = this.page.locator('input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), [contenteditable="true"]');
        await expect(editableFields).toHaveCount(0);
        console.log(`Version ${version} is view-only as expected - Pass`);
    }

    async clickBackToHistoryAndVerifyPage() {
        await expect(this.backToHistoryLink).toBeVisible({ timeout: 10000 });
        await this.backToHistoryLink.click();
        await expect(this.page).toHaveURL(/([?&]tab=history(?:&|$)|\/contracts\/[^/]+(?:\?.*)?$)/, { timeout: 30000 });
        await expect(this.contractHistoryContainer).toBeVisible({ timeout: 10000 });
        console.log('Navigated back to Contract History tab successfully - Pass');
    }

    async verifyRenewedContractBanner(renewedContractNumber: string) {
        await expect(this.contractRenewedBannerText).toBeVisible({ timeout: 10000 });
        await expect(this.contractRenewedBannerText).toContainText(renewedContractNumber, { timeout: 10000 });
        console.log(`Renewed contract banner is displayed with renewed contract number: ${renewedContractNumber} - Pass`);
    }

}