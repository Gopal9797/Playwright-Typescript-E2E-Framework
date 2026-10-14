import { expect, Locator, Page } from "@playwright/test";
import { NotificationPopup } from "./common/NotificationPopup";

export class TransferDeviceModal {
    readonly page: Page;
    readonly dialog: Locator;
    readonly customerInput: Locator;
    readonly transferButton: Locator;
    readonly superkeyWarningTitle: Locator;
    readonly superkeyWarningMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.locator('dialog#transfer-device-modal');
        this.customerInput = this.dialog.getByPlaceholder('Select Customer');
        this.transferButton = this.dialog.getByRole('button', { name: 'Transfer Device', exact: true });
        this.superkeyWarningTitle = this.dialog.getByText('Transferring One or More Devices With a Superkey', { exact: true });
        this.superkeyWarningMessage = this.dialog.getByText('Transferring this device will revoke the Superkey.', { exact: true });
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

    async selectFirstCustomer() {
        await expect(this.customerInput).toBeVisible();
        await this.customerInput.click();
        const firstCustomerOption = this.dialog
            .getByRole('menu', { name: 'Autocomplete menu' })
            .getByRole('menuitemradio')
            .first()
            .getByRole('button');
        await expect(firstCustomerOption).toBeVisible();
        await firstCustomerOption.click();
        await expect(this.customerInput).not.toHaveValue('');
    }

    async validateCustomerInputDisabled() {
        await expect(this.customerInput).toBeDisabled();
    }

    async transferDevice(message: string) {
        await expect(this.transferButton).toBeEnabled();
        const notificationPopup = new NotificationPopup(this.page);

        await Promise.all([
            notificationPopup.assertMessage(message),
            this.transferButton.click(),
        ]);
        await expect(this.dialog).toBeHidden();
    }

    async validateSuperkeyWarningVisible() {
        await expect(this.dialog).toBeVisible();
        await expect(this.superkeyWarningTitle).toBeVisible();
        await expect(this.superkeyWarningMessage).toBeVisible();
    }
}
