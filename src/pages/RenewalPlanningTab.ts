import { expect, Locator, Page } from "@playwright/test";

type RenewalPlanningSection = 'License Removal' | 'Downgrades' | 'Product Cancellation';

export class RenewalPlanningTab {
    readonly page: Page;
    readonly renewalPlanningTab: Locator;
    readonly deleteIcon: Locator;
    readonly acceptButtonOnDiscardDraftPopup: Locator;
    readonly subscriptionsTab: Locator;
    readonly licenseRemovalBlockTitle: Locator;
    readonly downgradesBlockTitle: Locator;
    readonly productCancellationBlockTitle: Locator;
    readonly deleteConfirmTitle: Locator;
    readonly deleteConfirmMessage: Locator;
    readonly startRenewalButton: Locator;
    readonly retryRenewalButton: Locator;
    readonly startYouRenewalText: Locator;
    readonly startLateRenewalText: Locator;
    readonly retryYouRenewalText: Locator;
    readonly initiateYourRenewalText: Locator;
    readonly renewalInitiatedText: Locator;
    readonly renewalInitiatedSubText: Locator;
    readonly renewalInProgressText: Locator;
    readonly renewalInProgressSubText: Locator;
    readonly renewalQuoteGeneratedText: Locator;
    readonly renewalQuoteReadyText: Locator;
    readonly lateRenewalQuoteReadyText: Locator;
    readonly viewRenewalQuoteButton: Locator;
    readonly pendingAmendmentPopup: Locator;
    readonly cancelButton: Locator;
    readonly viewAmendmentRequestButton: Locator;
    readonly renewalPlanningTabDetails: Locator;

    constructor(page: Page) {
        this.page = page;
        this.renewalPlanningTab = page.locator('[aria-label="renewal-planning-toggle"]');
        this.deleteIcon = page.getByTestId('delete-icon');
        this.acceptButtonOnDiscardDraftPopup = page.getByRole('button', { name: 'Yes' });
        this.subscriptionsTab = page.locator('[aria-label="subscriptions-toggle"]');
        this.licenseRemovalBlockTitle = page.getByTestId('negative-group-block-title').locator('text=License Removal');
        this.downgradesBlockTitle = page.getByTestId('negative-group-block-title').locator('text=Downgrades');
        this.productCancellationBlockTitle = page.getByTestId('negative-group-block-title').locator('text=Product Cancellation');
        this.deleteConfirmTitle = page.getByText(/Confirm Action/i);
        this.deleteConfirmMessage = page.getByText(/Are you sure you want to delete this item\?/i);
        this.startRenewalButton = page.getByRole('button', { name: 'Start' });
        this.startYouRenewalText = page.getByText('Start your renewal').first();
        this.startLateRenewalText = page.getByText('Start late renewal').first();
        this.initiateYourRenewalText = page.getByText('You can initiate your Renewal quote').first();
        this.retryRenewalButton = page.getByRole('button', { name: 'Retry' }).first();
        this.retryYouRenewalText = page.getByText('Renewal Quote Creation Failed', { exact: true }).first();
        this.renewalInitiatedText = page.getByText('Renewal Initiated').first();
        this.renewalInitiatedSubText = page.getByText('Renewal has been initiated. Renewal quote generation will take some time.').first();
        this.renewalInProgressText = page.getByText('Renewal In Progress').first();
        this.renewalInProgressSubText = page.getByText('What happens next: You will receive an email confirmation. Once processed by Trimble, the contract details will update automatically.').first();
        this.renewalQuoteGeneratedText = page.getByText('Renewal quote has been generated.').first();
        this.renewalQuoteReadyText = page.getByText('Renewal Quote Ready').first();
        this.lateRenewalQuoteReadyText = page.getByText('Late Renewal Quote Ready').first();
        this.viewRenewalQuoteButton = page.getByRole('button', { name: 'View Renewal Quote' }).first();
        this.pendingAmendmentPopup = page.getByText('Pending Amendment Request').first();
        this.cancelButton = page.getByRole('button', { name: 'Cancel' }).first();
        this.viewAmendmentRequestButton = page.getByRole('button', { name: 'View Amendment Request' }).first();
        this.renewalPlanningTabDetails = page.locator('[aria-label="renewals-planning-title"]');
    }

    async openRenewalPlanningTab() {
        await this.renewalPlanningTab.click();
    }
    async assertRenewalPlanningTabDetailsSectionVisibility() {
        await expect(this.renewalPlanningTabDetails).toBeVisible({ timeout: 10000 });
    }

    async assertRenewalEligibilityStatus() {
        await this.openRenewalPlanningTab();
        await expect(this.startYouRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.initiateYourRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.startRenewalButton).toBeVisible({ timeout: 10000 });
    }

    async assertLateRenewalEligibilityStatus() {
        await this.openRenewalPlanningTab();
        await expect(this.startLateRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.initiateYourRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.startRenewalButton).toBeVisible({ timeout: 10000 });
    }

    async assertRenewalNotEligibleStatus() {
        await this.openRenewalPlanningTab();
        await expect(this.startYouRenewalText).not.toBeVisible({ timeout: 10000 });
        await expect(this.initiateYourRenewalText).not.toBeVisible({ timeout: 10000 });
        await expect(this.startRenewalButton).not.toBeVisible({ timeout: 10000 });
    }

    async assertLateRenewalNotEligibleStatus() {
        await this.openRenewalPlanningTab();
        await expect(this.startLateRenewalText).not.toBeVisible({ timeout: 10000 });
        await expect(this.startRenewalButton).not.toBeVisible({ timeout: 10000 });
        await expect(this.viewRenewalQuoteButton).not.toBeVisible({ timeout: 10000 });
    }

    async assertPendingAmendmentPopup() {
        await this.startRenewalButton.click();
        await expect(this.pendingAmendmentPopup).toBeVisible({ timeout: 10000 });
        await expect(this.cancelButton).toBeVisible({ timeout: 10000 });
        await expect(this.viewAmendmentRequestButton).toBeVisible({ timeout: 10000 });
        await this.viewAmendmentRequestButton.click();
    }

    async assertRenewalPlanningSectionsVisible(sections: RenewalPlanningSection[]) {
        await this.openRenewalPlanningTab();

        for (const section of sections) {
            if (section === 'License Removal') {
                await expect(this.licenseRemovalBlockTitle).toBeVisible({ timeout: 10000 });
            }
            else if (section === 'Downgrades') {
                await expect(this.downgradesBlockTitle).toBeVisible({ timeout: 10000 });
            }
            else if (section === 'Product Cancellation') {
                await expect(this.productCancellationBlockTitle).toBeVisible({ timeout: 10000 });
            }
        }
    }

    async removeFirstRenewalPlanningMotion() {
        await this.openRenewalPlanningTab();
        await expect(this.deleteIcon.first()).toBeVisible({ timeout: 10000 });

        const deleteIconsBefore = await this.deleteIcon.count();
        await this.deleteIcon.first().click();
        await expect(this.deleteConfirmTitle).toBeVisible({ timeout: 10000 });
        await expect(this.deleteConfirmMessage).toBeVisible({ timeout: 10000 });
        await this.acceptButtonOnDiscardDraftPopup.click();
        await expect(this.deleteIcon).toHaveCount(deleteIconsBefore - 1, { timeout: 10000 });
    }

    async deleteProductCancellation() {
        await this.openRenewalPlanningTab();
        await expect(this.productCancellationBlockTitle).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByText('Cancel Trimble Reality Capture Platform Service - 200GB Subscription subscriptions', { exact: true })).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByText('BS-SB-SCAN-200GB', { exact: true })).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByText(/Removing total storage from contract:\s*\d+GB\s*\(\d+GB\s*x\s*\d+\)/i)).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByText(/Created by .+ on \d{1,2} \w{3} \d{4}/i)).toBeVisible({ timeout: 10000 });

        const cancellationItem = this.page
            .getByText('Cancel Trimble Reality Capture Platform Service - 200GB Subscription subscriptions', { exact: true })
            .locator('xpath=ancestor::div[.//*[@data-testid="delete-icon"]][1]');
        const cancellationDeleteIcon = cancellationItem.getByTestId('delete-icon');
        const deleteIconsBefore = await this.deleteIcon.count();

        await expect(cancellationDeleteIcon).toBeVisible({ timeout: 10000 });
        await cancellationDeleteIcon.click();
        await expect(this.deleteConfirmTitle).toBeVisible({ timeout: 10000 });
        await expect(this.deleteConfirmMessage).toBeVisible({ timeout: 10000 });
        await this.acceptButtonOnDiscardDraftPopup.click();

        await expect(this.deleteIcon).toHaveCount(deleteIconsBefore - 1, { timeout: 10000 });
        await expect(this.productCancellationBlockTitle).not.toBeVisible({ timeout: 10000 });
    }

    async clearOutAllRenewalPlanningTabData() {
        await this.openRenewalPlanningTab();
        const deleteIcons = await this.deleteIcon.count();
        if (deleteIcons === 0) {
            console.log('No data to clear in Renewal Planning Tab.');
        } else {
            console.log(`Found ${deleteIcons} items to delete in Renewal Planning Tab. Proceeding to delete...`);
            for (let i = 0; i < deleteIcons; i++) {
                await this.deleteIcon.first().click();
                await this.acceptButtonOnDiscardDraftPopup.click();
            }

        }
        await this.subscriptionsTab.click();
    }

    async assertRenewalPlanningTabUIElements() {
        await this.assertRenewalPlanningSectionsVisible(['License Removal', 'Downgrades', 'Product Cancellation']);
    }

    async initiateManualRenewal() {
        await this.openRenewalPlanningTab();
        await expect(this.startYouRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.initiateYourRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.startRenewalButton).toBeEnabled({ timeout: 10000 });
        await this.startRenewalButton.click();
        await expect(this.renewalInitiatedText).toBeVisible({ timeout: 10000 });
        await expect(this.renewalInitiatedSubText).toBeVisible({ timeout: 10000 });
    }

    async initiateLateRenewal() {
        await this.openRenewalPlanningTab();
        await expect(this.startLateRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.initiateYourRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.startRenewalButton).toBeVisible({ timeout: 10000 });
        await this.startRenewalButton.click();
        await expect(this.renewalInitiatedText).toBeVisible({ timeout: 10000 });
        await expect(this.renewalInitiatedSubText).toBeVisible({ timeout: 10000 });
    }

    async renewalQuoteInProgress() {
        await this.openRenewalPlanningTab();
        await expect(this.renewalInProgressText).toBeVisible({ timeout: 10000 });
        await expect(this.renewalInProgressSubText).toBeVisible({ timeout: 10000 });
    }

    async viewGeneratedRenewalQuote() {
        await this.openRenewalPlanningTab();
        await expect(this.renewalQuoteGeneratedText).toBeVisible({ timeout: 10000 });
        await expect(this.renewalQuoteReadyText).toBeVisible({ timeout: 10000 });
        await expect(this.viewRenewalQuoteButton).toBeVisible({ timeout: 10000 });
        await this.viewRenewalQuoteButton.click();
    }

    async viewGeneratedLateRenewalQuote() {
        await this.openRenewalPlanningTab();
        await expect(this.renewalQuoteGeneratedText).toBeVisible({ timeout: 10000 });
        await expect(this.lateRenewalQuoteReadyText).toBeVisible({ timeout: 10000 });
        await expect(this.viewRenewalQuoteButton).toBeVisible({ timeout: 10000 });
        await this.viewRenewalQuoteButton.click();
    }

    async renewalContractCreationFailed() {
        await this.openRenewalPlanningTab();
        await expect(this.retryYouRenewalText).toBeVisible({ timeout: 10000 });
        await expect(this.retryRenewalButton).toBeVisible({ timeout: 10000 });
        await this.retryRenewalButton.click();
        await expect(this.renewalInitiatedText).toBeVisible({ timeout: 10000 });
        await expect(this.renewalInitiatedSubText).toBeVisible({ timeout: 10000 });
    }

}
export default RenewalPlanningTab;