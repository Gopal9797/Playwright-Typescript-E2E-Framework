import { expect, Locator, Page } from "@playwright/test";

/** "Manage Licenses" modal for an account member, opened from their Account Members row. */
export class ManageUserLicensesModal {
    readonly page: Page;
    readonly dialog: Locator;
    readonly revokeSubscriptionButton: Locator;
    readonly revokeConfirmDialog: Locator;
    readonly confirmRevokeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.locator('dialog#manage-user-licenses-modal');
        this.revokeSubscriptionButton = this.dialog.getByRole('button', { name: 'Revoke subscription' });
        // Shared with the device-side revoke flow — fixed id, not scoped to this dialog.
        this.revokeConfirmDialog = page.locator('dialog#revoke-subscription-modal');
        this.confirmRevokeButton = this.revokeConfirmDialog.getByRole('button', { name: 'Yes, Revoke Subscription' });
    }

    async revokeSubscription() {
        await expect(this.revokeSubscriptionButton).toBeVisible();
        await this.revokeSubscriptionButton.click();
        await expect(this.revokeConfirmDialog).toBeVisible();
        await this.confirmRevokeButton.click();
        await expect(this.revokeConfirmDialog).toBeHidden();
    }
}
