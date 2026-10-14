import { expect, Locator, Page } from "@playwright/test";
import { DeviceToast } from "./DevicePage";
import { NotificationPopup } from "./common/NotificationPopup";

export const ManageLicensesToast = {
    licenseAssigned: 'License successfully assigned',
    subscriptionRevoked: DeviceToast.subscriptionRevoked,
    subscriptionRevokedAndTransferCanceled: DeviceToast.subscriptionRevokedAndTransferCanceled,
    subscriptionRevokedAndTransferSuccessful: DeviceToast.subscriptionRevokedAndTransferSuccessful,
} as const;

/** "Manage Licenses" / "Assign Licenses to Device" modal on a contract's Subscriptions tab, scoped to one SKU. */
export class ManageLicensesModal {
    readonly page: Page;
    readonly dialog: Locator;
    readonly licenseLineRadio: Locator;
    readonly assignLicensesButton: Locator;
    readonly assignLicenseAndTransferButton: Locator;
    readonly serialNumberInput: Locator;
    readonly addDeviceButton: Locator;
    readonly selectedDeviceItems: Locator;
    readonly customerInput: Locator;
    readonly transferTermsText: Locator;
    readonly transferDatePicker: Locator;
    readonly noDeviceFoundText: Locator;
    readonly notApplicableProductErrorText: Locator;
    readonly deviceDoesNotBelongToCustomerErrorText: Locator;
    readonly deviceDoesNotBelongToDealerErrorText: Locator;
    readonly closeModalButton: Locator;
    readonly scheduledTransferRadio: Locator;
    readonly transferDateInput: Locator;
    readonly revokeConfirmDialog: Locator;
    readonly confirmRevokeButton: Locator;
    readonly revokeSubscriptionWithTransferDialog: Locator;
    readonly revokeAndCancelTransferButton: Locator;
    readonly revokeAndTransferDeviceNowButton: Locator;

    constructor(page: Page, sku: string) {
        this.page = page;
        // Dialog id is `transfer-device-modal-<contractId>::<sku>` — shared component id pattern, scoped by SKU suffix.
        this.dialog = page.locator(`dialog[id$="::${sku}"]`);
        this.licenseLineRadio = this.dialog.getByRole('radio');
        this.assignLicensesButton = this.dialog.getByRole('button', { name: 'Assign Licenses', exact: true });
        this.assignLicenseAndTransferButton = this.dialog.getByRole('button', { name: 'Assign License & Transfer Device', exact: true });
        this.serialNumberInput = this.dialog.getByPlaceholder('Enter serial number');
        this.addDeviceButton = this.dialog.getByRole('button', { name: 'Add Device' });
        this.selectedDeviceItems = this.dialog.locator('[data-testid^="device-item-"]');
        this.customerInput = this.dialog.getByPlaceholder('Select Customer');
        this.transferTermsText = this.dialog.getByText('Transfer Terms', { exact: true });
        this.transferDatePicker = this.dialog.locator('modus-wc-date');
        this.noDeviceFoundText = this.dialog.getByText('Device not found for serial number');
        this.notApplicableProductErrorText = this.dialog.getByText('not in the list of applicable products', { exact: false });
        this.deviceDoesNotBelongToCustomerErrorText = this.dialog.getByText('does not belong to this customer', { exact: false });
        this.deviceDoesNotBelongToDealerErrorText = this.dialog.getByText('does not belong to this dealer', { exact: false });
        this.closeModalButton = this.dialog.getByRole('button', { name: 'Close modal' });
        this.scheduledTransferRadio = this.dialog.locator('input#scheduled');
        this.transferDateInput = this.dialog.getByRole('textbox', { name: 'Transfer Date', exact: true });
        this.revokeConfirmDialog = page.locator('dialog#revoke-subscription-modal');
        this.confirmRevokeButton = this.revokeConfirmDialog.getByRole('button', { name: 'Yes, Revoke Subscription' });
        this.revokeSubscriptionWithTransferDialog = page.locator('dialog#revoke-subscription-with-transfer-modal');
        this.revokeAndCancelTransferButton = this.revokeSubscriptionWithTransferDialog.getByRole('button', {
            name: 'Revoke Subscription and Cancel Transfer',
            exact: true,
        });
        this.revokeAndTransferDeviceNowButton = this.revokeSubscriptionWithTransferDialog.getByRole('button', {
            name: 'Revoke Subscription and Transfer Device Now',
            exact: true,
        });
    }

    async validateToast(message: string) {
        await expect(this.page.getByText(message)).toBeVisible({ timeout: 15000 });
    }

    async selectLicenseLine() {
        await expect(this.licenseLineRadio).toBeVisible();
        await this.licenseLineRadio.check();
    }

    async clickAssignLicenses(message: string = '') {
        await expect(this.assignLicensesButton).toBeVisible();
        await expect(this.assignLicensesButton).toBeEnabled();

        if(message === '') {
            await this.assignLicensesButton.click();
            return;
        }

        const notificationPopup = new NotificationPopup(this.page);

        await Promise.all([
            notificationPopup.assertMessage(message),
            this.assignLicensesButton.click(),
        ]);
    }

    async submitSerialNumberForAssignment(serialNumber: string) {
        await expect(this.serialNumberInput).toBeVisible();
        await this.serialNumberInput.fill(serialNumber);
        await expect(this.addDeviceButton).toBeEnabled();
        await this.addDeviceButton.click();
    }

    async validateDevicesAddedToAssignment(serialNumbers: string[]) {
        await expect(this.selectedDeviceItems).toHaveCount(serialNumbers.length);
        for (const serialNumber of serialNumbers) {
            await expect(this.selectedDeviceItems.filter({ hasText: serialNumber })).toHaveCount(1);
        }
    }

    async validateAssignLicensesButtonEnabled() {
        await expect(this.assignLicensesButton).toBeVisible();
        await expect(this.assignLicensesButton).toBeEnabled();
    }

    async validateTransferTermsVisible() {
        await expect(this.transferTermsText).toBeVisible();
    }

    async validateTransferTermsNotVisible() {
        await expect(this.transferTermsText).not.toBeVisible({ timeout: 3000 });
    }

    async validateCustomerInputDisabled() {
        await expect(this.customerInput).toBeDisabled();
    }

    async validateNotApplicableProductError() {
        await expect(this.notApplicableProductErrorText).toBeVisible();
    }

    async validateDeviceDoesNotBelongToCustomerError() {
        await expect(this.deviceDoesNotBelongToCustomerErrorText).toBeVisible();
    }

    async validateDeviceDoesNotBelongToDealerError() {
        await expect(this.deviceDoesNotBelongToDealerErrorText).toBeVisible();
    }

    async validateNoDeviceFoundError() {
        await expect(this.noDeviceFoundText).toBeVisible();
    }

    async addDeviceToAssignment(serialNumber: string) {
        await expect(this.serialNumberInput).toBeVisible();
        await this.serialNumberInput.fill(serialNumber);
        await expect(this.addDeviceButton).toBeEnabled();
        await this.addDeviceButton.click();
        await expect(this.assignLicensesButton).toBeEnabled();
    }

    async validateSuperkeyWarningVisible() {
        await expect(this.dialog.getByText('Assigning Subscription to Device With a Superkey', { exact: true })).toBeVisible();
        await expect(
            this.dialog.getByText(
                'One or more devices have an active Superkey. Assigning a subscription will revoke all Superkeys.',
                { exact: true },
            ),
        ).toBeVisible();
    }

    async assignLicenseAndTransferDevice() {
        await expect(this.assignLicenseAndTransferButton).toBeEnabled();
        const notificationPopup = new NotificationPopup(this.page);
        await Promise.all([
            notificationPopup.assertMessage(ManageLicensesToast.licenseAssigned),
            this.assignLicenseAndTransferButton.click(),
        ]);
    }

    async selectScheduledTransfer() {
        await expect(this.scheduledTransferRadio).toBeVisible();
        await this.scheduledTransferRadio.check();
        await expect(this.scheduledTransferRadio).toBeChecked();
        await expect(this.transferDateInput).toBeVisible();
        await expect(this.transferDateInput).not.toHaveValue('');
    }

    async validateScheduledTransferDateRange() {
        await expect(this.transferDatePicker).toBeVisible();

        const formatDate = (date: Date) =>
            new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            }).format(date);

        const minimumDate = new Date();
        minimumDate.setDate(minimumDate.getDate() + 1);

        const maximumDate = new Date();
        maximumDate.setDate(maximumDate.getDate() + 7);

        await expect(this.transferDatePicker).toHaveJSProperty('min', formatDate(minimumDate));
        await expect(this.transferDatePicker).toHaveJSProperty('max', formatDate(maximumDate));
    }

    async assignLicenseToDevice(serialNumber: string, options: { scheduleTransfer?: boolean } = {}) {
        await expect(this.serialNumberInput).toBeVisible();
        await this.serialNumberInput.fill(serialNumber);
        await expect(this.addDeviceButton).toBeEnabled();
        await this.addDeviceButton.click();
        await expect(this.assignLicensesButton).toBeEnabled();
        await this.assignLicensesButton.click();
        if (options.scheduleTransfer) {
            await this.selectScheduledTransfer();
        }
        await expect(this.assignLicenseAndTransferButton).toBeEnabled();
        const notificationPopup = new NotificationPopup(this.page);
        await Promise.all([
            notificationPopup.assertMessage(ManageLicensesToast.licenseAssigned),
            this.assignLicenseAndTransferButton.click(),
        ]);
    }

    private async clickUnassignDevice(serialNumber: string) {
        const deviceItem = this.selectedDeviceItems.filter({ hasText: serialNumber });
        await expect(deviceItem).toHaveCount(1);
        const unassignDeviceButton = deviceItem.getByRole('button', { name: 'Unassign device' });
        await expect(unassignDeviceButton).toBeVisible();
        await unassignDeviceButton.click();
    }

    async revokeAssignedDevice(serialNumber: string) {
        await this.clickUnassignDevice(serialNumber);
        await expect(this.revokeConfirmDialog).toBeVisible();
        const notificationPopup = new NotificationPopup(this.page);
        await Promise.all([
            notificationPopup.assertMessage(ManageLicensesToast.subscriptionRevoked),
            this.confirmRevokeButton.click(),
        ]);
        await expect(this.revokeConfirmDialog).toBeHidden();
    }

    async revokeAssignedDeviceAndCancelTransfer(serialNumber: string) {
        await this.clickUnassignDevice(serialNumber);
        await expect(this.revokeSubscriptionWithTransferDialog).toBeVisible();
        await this.revokeAndCancelTransferButton.click();
        await expect(this.revokeSubscriptionWithTransferDialog).toBeHidden();
    }

    async revokeAssignedDeviceAndTransferDeviceNow(serialNumber: string) {
        await this.clickUnassignDevice(serialNumber);
        await expect(this.revokeSubscriptionWithTransferDialog).toBeVisible();
        await this.revokeAndTransferDeviceNowButton.click();
        await expect(this.revokeSubscriptionWithTransferDialog).toBeHidden();
    }
}
