import { expect, Locator, Page } from "@playwright/test";
import { NotificationPopup } from "./common/NotificationPopup";

export class AssignSubscriptionDeviceModal {
    readonly page: Page;
    readonly dialog: Locator;
    readonly customerInput: Locator;
    readonly assignSubscriptionButton: Locator;
    readonly transferNowRadio: Locator;
    readonly scheduledTransferRadio: Locator;
    readonly transferDateInput: Locator;
    readonly superkeyWarningTitle: Locator;
    readonly superkeyWarningMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.locator('dialog#assign-subscription-device-modal');
        this.customerInput = this.dialog.getByPlaceholder('Select Customer');
        this.assignSubscriptionButton = this.dialog.getByRole('button', { name: /^Assign Subscriptions?$/ });
        this.transferNowRadio = this.dialog.locator('input#now');
        this.scheduledTransferRadio = this.dialog.locator('input#scheduled');
        this.transferDateInput = this.dialog.getByRole('textbox', { name: 'Transfer Date', exact: true });
        this.superkeyWarningTitle = this.dialog.getByText('Assigning Subscription to Device With a Superkey', { exact: true });
        this.superkeyWarningMessage = this.dialog.getByText(
            'One or more devices have an active Superkey. Assigning a subscription will revoke all Superkeys.',
            { exact: true },
        );
    }

    async selectCustomer(customerName: string) {
        await this.customerInput.fill(customerName);
        const customerOption = this.dialog
            .getByRole('menu', { name: 'Autocomplete menu' })
            .getByRole('menuitemradio')
            .getByRole('button', { name: customerName, exact: false });
        await expect(customerOption).toBeVisible({ timeout: 15_000 });
        await customerOption.click();
    }

    async validateSubscriptionAvailable(sku: string) {
        await expect(this.dialog).toBeVisible();
        await expect(this.dialog.getByText(sku, { exact: true })).toBeVisible();
    }

    async selectSubscriptionSku(sku: string) {
        const subscriptionArticle = this.dialog
            .getByText(sku, { exact: true })
            .locator('xpath=ancestor::article[1]');

        await subscriptionArticle.getByRole('radio').check();
        await expect(subscriptionArticle.getByRole('radio')).toBeChecked();

        const contractSelector = subscriptionArticle.getByRole('combobox').first();
        await expect(contractSelector).toBeVisible();
        await subscriptionArticle.getByRole('button', { name: 'Open' }).first().click();
        await this.dialog.getByRole('option').first().click();
    }

    async validateOnlyOneSubscriptionSelected() {
        await expect(
            this.dialog.locator('article input[type="radio"]:checked, article [role="radio"][aria-checked="true"]'),
        ).toHaveCount(1);
    }

    async validateAssignSubscriptionButtonEnabled() {
        await expect(this.dialog).toBeVisible();
        await expect(this.assignSubscriptionButton).toBeEnabled();
    }

    async validateTransferNowSelected() {
        await expect(this.dialog).toBeVisible();
        await expect(this.transferNowRadio).toBeChecked();
        await expect(this.scheduledTransferRadio).not.toBeChecked();
    }

    async selectScheduledTransfer() {
        await expect(this.scheduledTransferRadio).toBeVisible();
        await this.scheduledTransferRadio.check();
        await expect(this.scheduledTransferRadio).toBeChecked();
        await expect(this.transferNowRadio).not.toBeChecked();
        await expect(this.transferDateInput).toBeVisible();
        await expect(this.transferDateInput).not.toHaveValue('');
    }

    async validateTransferTermsNotVisible() {
        await expect(this.dialog).toBeVisible();
        await expect(this.dialog.getByText('Transfer Terms', { exact: true })).not.toBeVisible({ timeout: 3000 });
    }

    async assignSubscription(message: string) {
        await expect(this.assignSubscriptionButton).toBeEnabled();
        const notificationPopup = new NotificationPopup(this.page);

        await Promise.all([
            notificationPopup.assertMessage(message),
            this.assignSubscriptionButton.click()
        ]);
        await expect(this.dialog).toBeHidden();
    }

    async validateSuperkeyWarningVisible() {
        await expect(this.dialog).toBeVisible();
        await expect(this.superkeyWarningTitle).toBeVisible();
        await expect(this.superkeyWarningMessage).toBeVisible();
    }
}
