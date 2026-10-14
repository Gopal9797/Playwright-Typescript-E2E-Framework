import { expect, type APIRequestContext, Locator, Page } from "@playwright/test";
import { AssignSubscriptionDeviceModal } from "./AssignSubscriptionDeviceModal";
import type { HomePage } from "./HomePage";
import { TransferDeviceModal } from "./TransferDeviceModal";
import { getIamDeviceBaseUrl } from "../utils/iamDevice/iamDeviceApi";
import { NotificationPopup } from "./common/NotificationPopup";

const CUSTOMER_NAME = "ALLTERRA CENTRAL, INC";
const IAM_DEVICE_BASE_URL = `${getIamDeviceBaseUrl()}/devices`;
const BLOCKED_ACTION_TOOLTIP = "Disabled due to blocked device";
export const BLOCK_COMMENT = "testautomationblock";
export const UNBLOCK_COMMENT = "testautomationUNblock";
export const BLOCK_REASON = "Stolen";
const DEVICES_V2_BY_SERIAL_QUERY = `
query getDeviceBySerial($dealerAccountId: ID!, $serialNumber: String!) {
  dealerDevicesV2(
    dealerAccountId: $dealerAccountId
    initialise: false
    first: null
    after: null
    last: null
    before: null
    where: { serialNumber: { eq: $serialNumber } }
    order: null
  ) {
    nodes {
      id
      serialNumber
    }
  }
}
`;

export type DeviceStatus = "ACTIVE" | "BLOCKED";

export type SelectedDevice = {
    accountId: string;
    authorization: string;
    deviceId: string;
    graphqlUrl: string;
    serialNumber: string;
};

type DeviceNotificationAction = "blocked" | "unblocked";

type DeviceHomePage = Pick<HomePage, "assertHomePage" | "selectDevicesTab" | "navigateToDevicesPage">;

type DealerDevicesBySerialResponse = {
    dealerDevicesV2: {
        nodes: Array<{
            id: string;
            serialNumber: string;
        }>;
    };
};

function normalizeText(value: string | null | undefined): string {
    return (value ?? "").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function notificationPattern(serialNumber: string, action: DeviceNotificationAction): RegExp {
    return new RegExp(`Device\\s+${escapeRegExp(serialNumber)}\\s+has been\\s+${action}`, "i");
}

export const DeviceToast = {
    subscriptionAssignedAndDeviceTransferred: 'Subscription assigned & device transferred!',
    subscriptionAssignedAndTransferScheduled: 'Subscription assigned & device transfer scheduled',
    subscriptionRevoked: 'Subscription revoked successfully',
    subscriptionRevokedAndTransferCanceled: 'Subscription Revoked & Transfer Canceled Successfully',
    subscriptionRevokedAndTransferSuccessful: 'Subscription Revoked & Transfer Successful',
    deviceTransferCancelled: 'Device Transfer Cancelled',
    deviceTransferCancelledSuccessfully: 'Device transfer cancelled successfully',
    deviceTransferSuccessful: 'Device Transfer Successful!',
    devicesTransferSuccessful: (count: number) => `[${count}] Devices transferred`,
} as const;

export class DevicePage {

    readonly page: Page;
    readonly searchDeviceInput: Locator;
    readonly deviceActionMenu: Locator;
    readonly manageDeviceMenuButton: Locator;
    readonly assignSuperkeyMenuButton: Locator;
    readonly assignSubscriptionMenuButton: Locator;
    readonly viewOnVirtualWarehouseMenuButton: Locator;
    readonly assignSubscriptionDeviceModal: AssignSubscriptionDeviceModal;
    readonly transferDeviceMenuButton: Locator;
    readonly transferDeviceModal: TransferDeviceModal;
    readonly assignSuperkeyDialog: Locator;
    readonly assignSuperkeyConfirmButton: Locator;
    readonly addSuperkeysButton: Locator;
    readonly addSuperkeyDialog: Locator;
    readonly deselectAllConflictingItemsLink: Locator;
    readonly manageDeviceModal: Locator;
    readonly manageDeviceModalTitle: Locator;
    readonly manageDeviceModalCloseButton: Locator;
    readonly revokeSubscriptionButton: Locator;
    readonly confirmRevokeSubscriptionButton: Locator;
    readonly revokeSubscriptionWithTransferModal: Locator;
    readonly revokeSubscriptionAndCancelTransferButton: Locator;
    readonly revokeSubscriptionAndTransferDeviceNowButton: Locator;
    readonly revokeSuperkeyButton: Locator;
    readonly revokeSuperkeyModal: Locator;
    readonly revokeSuperkeyHeading: Locator;
    readonly revokeSuperkeyMessage: Locator;
    readonly revokeSuperkeyCancelButton: Locator;
    readonly revokeSuperkeyConfirmButton: Locator;
    readonly cancelTransferButton: Locator;
    readonly transferNowButton: Locator;
    readonly confirmCancelTransferButton: Locator;
    readonly devicesHeading: Locator;
    readonly selectMultipleSwitch: Locator;
    readonly manageSelectionButton: Locator;
    readonly assignSubscriptionsButton: Locator;
    readonly transferDevicesButton: Locator;
    readonly allDevicesTab: Locator;
    readonly unallocatedDevicesTab: Locator;
    readonly blockedDevicesTab: Locator;
    readonly tableRows: Locator;
    readonly noRowsFoundText: Locator;
    readonly notificationButton: Locator;
    readonly notificationItemTitles: Locator;
    readonly notificationItemDescriptions: Locator;
    readonly auditLogsHeading: Locator;
    readonly auditLogRows: Locator;
    readonly auditLogResultsSummary: Locator;
    readonly auditLogTableHeaders: Locator;
    readonly auditLogLoadingText: Locator;
    readonly firstGridRow: Locator;
    readonly firstRowDeviceActionsButton: Locator;
    readonly firstMenuOptionButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchDeviceInput = page.getByRole('searchbox', { name: 'Search', exact: true });
        this.deviceActionMenu = page.getByRole('menu');
        this.manageDeviceMenuButton = this.deviceActionMenu.getByRole('button', { name: 'Manage Device' });
        this.assignSuperkeyMenuButton = this.deviceActionMenu.getByRole('button', { name: 'Assign Superkey' });
        this.assignSubscriptionMenuButton = this.deviceActionMenu.getByRole('button', { name: 'Assign Subscription' });
        this.viewOnVirtualWarehouseMenuButton = this.deviceActionMenu.getByRole('button', { name: 'View on Virtual Warehouse', exact: true });
        this.assignSubscriptionDeviceModal = new AssignSubscriptionDeviceModal(page);
        this.transferDeviceMenuButton = this.deviceActionMenu.getByRole('button', { name: 'Transfer Device' });
        this.transferDeviceModal = new TransferDeviceModal(page);
        this.assignSuperkeyDialog = this.page.locator('dialog#assign-superkey-modal');
        this.assignSuperkeyConfirmButton = this.assignSuperkeyDialog.getByRole('button', { name: 'Assign Superkey' });
        this.addSuperkeyDialog = this.page.locator('dialog#add-superkey-modal');
        this.deselectAllConflictingItemsLink = this.addSuperkeyDialog.getByText(
            'click here to deselect all conflicting items',
            { exact: true },
        );
        // Host web component (data-testid) is hidden; the open native dialog has id manage-devices-modal.
        this.manageDeviceModal = page.locator('dialog#manage-devices-modal');
        this.addSuperkeysButton = this.manageDeviceModal.getByRole('button', { name: 'Add Superkeys' });
        this.manageDeviceModalTitle = this.manageDeviceModal.getByText('Manage Device', { exact: true });
        this.manageDeviceModalCloseButton = this.manageDeviceModal.getByRole('button', {
            name: 'Close modal',
            exact: true,
        });
        this.revokeSubscriptionButton = this.manageDeviceModal.getByRole('button', { name: 'Revoke subscription' });
        this.confirmRevokeSubscriptionButton = this.page.getByRole('button', { name: 'Yes, Revoke Subscription' });
        this.revokeSubscriptionWithTransferModal = page.locator('dialog#revoke-subscription-with-transfer-modal');
        this.revokeSubscriptionAndCancelTransferButton = this.revokeSubscriptionWithTransferModal.getByRole('button', {
            name: 'Revoke Subscription and Cancel Transfer',
            exact: true,
        });
        this.revokeSubscriptionAndTransferDeviceNowButton = this.revokeSubscriptionWithTransferModal.getByRole('button', {
            name: 'Revoke Subscription and Transfer Device Now',
            exact: true,
        });
        this.revokeSuperkeyButton = this.manageDeviceModal.getByRole('button', { name: /^Revoke / });
        this.revokeSuperkeyModal = page.locator('dialog#modus-confirm-dialog');
        this.revokeSuperkeyHeading = this.revokeSuperkeyModal.getByRole('heading', { name: 'Revoking Product from Superkey?' });
        this.revokeSuperkeyMessage = this.revokeSuperkeyModal.getByRole('heading', {
            name: 'You\'re about to revoke T4D Field Core. This action cannot be undone. Do you wish to proceed?',
        });
        this.revokeSuperkeyCancelButton = this.revokeSuperkeyModal.getByRole('button', { name: 'Cancel' });
        this.revokeSuperkeyConfirmButton = this.revokeSuperkeyModal.getByRole('button', { name: 'Yes, Revoke Superkey' });
        // Todo: refactor to extract modal elements to a seaprate page object class.
        // Manage device modal
        this.cancelTransferButton = this.page.getByRole('button', { name: 'Cancel Transfer', exact: true });
        this.transferNowButton = this.page.getByRole('button', { name: 'Transfer Now' });
        // confirm cancelation modal
        this.confirmCancelTransferButton = this.page.getByRole('button', { name: 'Yes, Cancel Transfer of Device' });
        this.devicesHeading = page.getByRole('heading', { name: 'Devices', exact: true });
        this.selectMultipleSwitch = page.getByRole('switch', { name: 'Select Multiple', exact: true });
        this.manageSelectionButton = page.getByRole('button', { name: 'Manage Selection', exact: true });
        this.assignSubscriptionsButton = page.getByRole('button', { name: 'Assign Subscriptions', exact: true });
        this.transferDevicesButton = page.getByRole('button', { name: /^Transfer Devi(?:ces|cies)$/ });
        this.allDevicesTab = page.getByRole('tab', { name: 'All Devices', exact: true });
        this.unallocatedDevicesTab = page.getByRole('tab', { name: 'Unallocated Devices', exact: true });
        this.blockedDevicesTab = page.getByRole('tab', { name: 'Blocked Devices', exact: true });
        this.tableRows = page.locator('[role="rowgroup"] [role="row"]');
        this.noRowsFoundText = page.getByText(/^No rows(?: found)?$/i);
        this.notificationButton = page.locator('#notification-button');
        this.notificationItemTitles = page.locator('[data-testid="notification-item-title"]');
        this.notificationItemDescriptions = page.locator('[data-testid="notification-item-description"]');
        this.auditLogsHeading = page.getByRole('heading', { name: 'Audit Logs', exact: true });
        this.auditLogRows = page.locator('.MuiDataGrid-row');
        this.auditLogResultsSummary = page.locator('.MuiTablePagination-displayedRows').first();
        this.auditLogTableHeaders = page.locator('[role="columnheader"]');
        this.auditLogLoadingText = page.getByText('Loading...', { exact: true });
        this.firstGridRow = page.locator('.MuiDataGrid-row').first();
        // Exclude blocked devices - their actions button is covered by a tooltip overlay and not clickable
        this.firstRowDeviceActionsButton = page.locator('.MuiDataGrid-row:not(.blocked-row)').getByRole('button', { name: 'Device Actions' }).filter({ visible: true }).first();
        this.firstMenuOptionButton = this.deviceActionMenu.getByRole('button').first();
    }

    async validateToast(message: string) {
        await expect(this.page.getByRole('status').getByText(message)).toBeVisible({ timeout: 15000 });
    }

    deviceRow(serialNumber: string): Locator {
        const serialNumberCell = this.page
            .locator('[data-field="serialNumber"]')
            .filter({ hasText: new RegExp(`^${escapeRegExp(serialNumber)}$`) });
        return this.page.getByRole('row').filter({ has: serialNumberCell }).first();
    }

    deviceActionsButton(serialNumber: string): Locator {
        return this.deviceRow(serialNumber).getByRole('button', { name: 'Device Actions' });
    }

    async manageDevice(serialNumber: string) {
        await this.deviceActionsButton(serialNumber).click();
    }

    async validateDeviceActionMenu() {
        await expect(this.manageDeviceMenuButton).toBeVisible();
    }

    async validateTransferDeviceAvailable() {
        await expect(this.transferDeviceMenuButton).toBeVisible();
    }

    async validateTransferDeviceUnavailable() {
        await expect(this.deviceActionMenu).toBeVisible();
        await expect(this.transferDeviceMenuButton).not.toBeVisible();
    }

    async validateFailedTransferActions() {
        await expect(this.deviceActionMenu).toBeVisible();
        await expect(this.deviceActionMenu.getByRole('button', { name: /retry/i })).toBeVisible();
        await expect(this.deviceActionMenu.getByRole('button', { name: /cancel/i })).toBeVisible();
    }

    async clickRetryTransfer() {
        const retryButton = this.deviceActionMenu.getByRole('button', { name: /retry/i });
        await expect(retryButton).toBeVisible();
        await retryButton.click();
        await expect(this.transferDeviceModal.dialog).toBeVisible();
    }

    async cancelFailedTransfer() {
        const cancelButton = this.deviceActionMenu.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();
    }

    async validateAssignSuperkeyUnavailable() {
        await expect(this.assignSubscriptionMenuButton).toBeVisible({ timeout: 3000 });
        await expect(this.assignSuperkeyMenuButton).not.toBeVisible({ timeout: 3000 });
    }

    async openFirstUnallocatedDeviceActions() {
        await expect(this.unallocatedDevicesTab).toBeVisible();
        await expect.poll(async () => await this.tableRows.count(), {
            timeout: 60_000,
            intervals: [1000, 2000, 5000],
        }).toBeGreaterThan(0);

        const firstRow = this.tableRows.first();
        await expect(firstRow).toBeVisible();
        await expect(firstRow.getByRole('button', { name: 'Device Actions' })).toBeVisible();
        await firstRow.getByRole('button', { name: 'Device Actions' }).click();
        await expect(this.deviceActionMenu).toBeVisible();
    }

    async verifyUnallocatedDeviceActionsForTechnician() {
        await expect(this.transferDeviceMenuButton).toBeVisible();
        await expect(this.assignSubscriptionMenuButton).toBeVisible();
        await expect(this.assignSuperkeyMenuButton).toBeVisible();
        await expect(this.viewOnVirtualWarehouseMenuButton).toBeVisible();
    }

    /** On the Devices grid (All Devices tab), opens the first non-blocked device's three dot actions menu */
    async openFirstDeviceActionsMenu() {
        await expect(this.firstGridRow).toBeVisible();
        await this.firstRowDeviceActionsButton.click();
        await expect(this.deviceActionMenu).toBeVisible();
        console.log('Opened first device actions menu');
    }

    /** Opens the first device's actions menu and clicks the first action option */
    async clickFirstDeviceAction() {
        await this.openFirstDeviceActionsMenu();
        await this.firstMenuOptionButton.click();
        console.log('Clicked first device action');
    }

    async clickOnManageDevice() {
        await this.manageDeviceMenuButton.click();
    }

    async clickOnAssignSuperkey() {
        await this.assignSuperkeyMenuButton.click();
        await expect(this.assignSuperkeyDialog).toBeVisible();
    }

    async validateAssignSuperkeyRemainingAllowance(remainingTimes: number) {
        await expect(this.assignSuperkeyDialog.getByText(`${remainingTimes} more times`)).toBeVisible();
    }

    async validateAssignSuperkeySkuVisible(sku: string) {
        await expect(this.assignSuperkeyDialog.locator(`input[id="${sku}"]`)).toBeVisible();
    }

    async clickOnAssignSubscription() {
        await this.assignSubscriptionMenuButton.click();
        await expect(this.assignSubscriptionDeviceModal.dialog).toBeVisible();
    }

    async clickOnTransferDevice() {
        await this.transferDeviceMenuButton.click();
        await expect(this.transferDeviceModal.dialog).toBeVisible();
    }

    async selectSuperkeySku(sku: string) {
        const skuInput = this.assignSuperkeyDialog.locator(`input[id="${sku}"]`);
        const skuOnStandaloneTab = await skuInput.waitFor({ state: 'visible', timeout: 5_000 }).then(
            () => true,
            () => false,
        );
        if (!skuOnStandaloneTab) {
            await this.assignSuperkeyDialog.getByRole('tab', { name: 'Bundles' }).click();
            await expect(skuInput).toBeVisible();
        }
        await skuInput.check();
        await expect(skuInput).toBeChecked();
    }

    async confirmAssignSuperkey() {
        await this.assignSuperkeyConfirmButton.click();
        await expect(this.assignSuperkeyDialog).toBeHidden();
    }

    async openAssignSuperkeyBundlesTab() {
        await this.assignSuperkeyDialog.getByRole('tab', { name: 'Bundles' }).click();
    }

    async deselectAllConflictingItemsFromAssignSuperkey(sku: string) {
        const skuArticle = this.assignSuperkeyDialog
            .locator(`input[id="${sku}"]`)
            .locator('xpath=ancestor::article[1]');
        await skuArticle
            .getByRole('button', { name: 'click here to deselect all conflicting items', exact: true })
            .click();
    }

    async validateAssignSuperkeySkuDisabled(sku: string) {
        await expect(this.assignSuperkeyDialog.locator(`input[id="${sku}"]`)).toBeDisabled();
    }

    async validateAssignSuperkeySkuEnabled(sku: string) {
        await expect(this.assignSuperkeyDialog.locator(`input[id="${sku}"]`)).toBeEnabled();
    }

    async validateOnlyOneAssignSuperkeySkuSelected(skus: string[]) {
        const selectedSkuInputs = skus.map(sku => `input[id="${sku}"]:checked`).join(', ');
        await expect(this.assignSuperkeyDialog.locator(selectedSkuInputs)).toHaveCount(1);
    }

    async assignSuperkeySku(serialNumber: string, sku: string) {
        await this.manageDevice(serialNumber);
        await this.clickOnAssignSuperkey();
        await this.selectSuperkeySku(sku);
        await this.confirmAssignSuperkey();
    }

    async validateSuperkeySkuAssigned(sku: string) {
        await this.clickOnManageDevice();
        await this.validateManageDeviceModalShowsAssignedSuperkey(sku);
    }

    async revokeAssignedSuperkey(sku: string) {
        await this.revokeSuperkeyButton.click();
        await expect(this.revokeSuperkeyConfirmButton).toBeVisible();
        await this.revokeSuperkeyConfirmButton.click();
        await expect(this.revokeSuperkeyModal).toBeHidden();
        await expect(this.manageDeviceModal.getByText(sku, { exact: true })).toBeHidden();
    }

    async cancelRevokeAssignedSuperkey(sku: string) {
        await this.revokeSuperkeyButton.click();
        await expect(this.revokeSuperkeyCancelButton).toBeVisible();
        await this.revokeSuperkeyCancelButton.click();
        await expect(this.revokeSuperkeyModal).toBeHidden();
        await expect(this.manageDeviceModal.getByText(sku, { exact: true })).toBeVisible();
    }

    async validateRevokeSuperkeyModal() {
        await expect(this.revokeSuperkeyHeading).toBeVisible();
        await expect(this.revokeSuperkeyMessage).toBeVisible();
        await expect(this.revokeSuperkeyCancelButton).toBeVisible();
        await expect(this.revokeSuperkeyConfirmButton).toBeVisible();
    }

    async searchForDevice(serialNumber: string) {
        // Clear first so repeating the same search value always triggers a fresh table query.
        await this.searchDeviceInput.fill('');
        await this.searchDeviceInput.fill(serialNumber);
        await this.searchDeviceInput.press('Enter');
    }

    async validateDeviceRowVisible(serialNumber: string) {
        await expect(this.deviceRow(serialNumber)).toBeVisible();
    }

    async validateDevicePartNumberVisible(partNumber: string) {
        const partNumberCell = this.page
            .locator('[data-field="partNumber"]')
            .filter({ hasText: new RegExp(`^${escapeRegExp(partNumber)}$`) });
        await expect(partNumberCell.first()).toBeVisible();
    }

    async validateDeviceOwnerLink(serialNumber: string) {
        const ownerLink = this.deviceRow(serialNumber).locator('[data-field="ownerName"]').getByRole('link');
        await expect(ownerLink).toBeVisible();
        await expect(ownerLink).toHaveAttribute('href', /\/customers\//i);
    }

    async selectMultipleDevices() {
        await this.selectMultipleSwitch.click();
        await expect(this.selectMultipleSwitch).toBeChecked();
    }

    async selectDevice(serialNumber: string) {
        const deviceCheckbox = this.deviceRow(serialNumber).locator('input[type="checkbox"]');
        await expect.poll(
            async () => {
                if (await deviceCheckbox.isChecked()) {
                    return true;
                }

                await deviceCheckbox.click();
                return await deviceCheckbox.isChecked();
            },
            {
                timeout: 10_000,
                intervals: [500, 1000, 2000],
            },
        ).toBe(true);
        await expect(deviceCheckbox).toBeChecked();
    }

    async validateDeviceRowSelectionDisabled(serialNumber: string) {
        const deviceCheckbox = this.deviceRow(serialNumber).locator('input[type="checkbox"]');
        await expect(deviceCheckbox).toBeDisabled();
    }

    async selectFirstDevice() {
        const deviceCheckbox = this.tableRows.first().locator('input[type="checkbox"]');
        await expect(deviceCheckbox).toBeVisible();
        await deviceCheckbox.check();
        await expect(deviceCheckbox).toBeChecked();
    }

    async clickOnManageSelection() {
        await this.manageSelectionButton.click();
    }

    async removeSelectedDevice(serialNumber: string) {
        const manageSelectionModal = this.page.getByRole('dialog').filter({ hasText: 'Selected Devices' }).first();
        await expect(manageSelectionModal).toBeVisible();
        const selectedDeviceCard = manageSelectionModal.getByRole('article').filter({ hasText: serialNumber });
        await expect(selectedDeviceCard).toBeVisible();
        const serialNumbersToggle = selectedDeviceCard.locator('modus-wc-collapse summary');
        await expect(serialNumbersToggle).toBeVisible();
        await serialNumbersToggle.click();

        const removeDeviceButton = manageSelectionModal.getByRole('button', {
            name: `Remove ${serialNumber}`,
            exact: true,
        });
        await expect(removeDeviceButton).toBeVisible();
        await removeDeviceButton.click();
        await expect(removeDeviceButton).toBeHidden();
    }

    async clickOnAssignSubscriptions() {
        await this.assignSubscriptionsButton.click();
        await expect(this.assignSubscriptionDeviceModal.dialog).toBeVisible();
    }

    async clickOnTransferDevices() {
        await this.transferDevicesButton.click();
        await expect(this.transferDeviceModal.dialog).toBeVisible();
    }

    async validateDeviceRowShowsSuperkey(serialNumber: string) {
        await expect(this.deviceRow(serialNumber).getByText('SuperKey (1)', { exact: true })).toBeVisible();
    }

    async validateDeviceRowDoesNotShowSuperkey(serialNumber: string) {
        await expect(this.deviceRow(serialNumber).getByText('SuperKey (1)', { exact: true })).toBeHidden();
    }

    async validateManageDeviceModal() {
        await expect(this.manageDeviceModal).toBeVisible();
        await expect(this.manageDeviceModalTitle).toBeVisible();
        await expect(this.manageDeviceModalCloseButton).toBeVisible();
    }

    async validateManageDeviceModalShowsDevice(serialNumber: string) {
        await expect(this.manageDeviceModal.getByText(serialNumber)).toBeVisible();
    }

    async validateManageDeviceModalShowsAssignedSubscription(sku: string) {
        await expect(this.manageDeviceModal.getByText(sku, { exact: true })).toBeVisible();
        await expect(this.revokeSubscriptionButton).toBeVisible();
    }

    async validateAssignedSubscriptionDetails() {
        await expect(this.manageDeviceModal.getByRole('link', { name: /^Contract\s+#\s*\S+/i }).first()).toBeVisible();
        await expect(this.manageDeviceModal.getByText(/^Start Date:\s+\S+/i).first()).toBeVisible();
        await expect(this.manageDeviceModal.getByText(/^End Date:\s+\S+/i).first()).toBeVisible();
    }

    async validateScheduledTransferInformation(transferToCustomerName: string) {
        const transferCustomerField = this.manageDeviceModal
            .getByText('Transferring To', { exact: true })
            .locator('..')
            .locator('..')
            .locator('..')
            .getByRole('textbox');
        const transferDateField = this.manageDeviceModal
            .getByText('Transfer Date', { exact: true })
            .locator('..')
            .locator('..')
            .locator('..')
            .getByRole('textbox');
        await expect(this.manageDeviceModal.getByText('Transferring To', { exact: true })).toBeVisible();
        await expect(transferCustomerField).toHaveValue(transferToCustomerName);
        await expect(this.manageDeviceModal.getByText('Transfer Date', { exact: true })).toBeVisible();
        await expect(transferDateField).toHaveValue(/\S+/);
        await expect(this.cancelTransferButton).toBeVisible();
        await expect(this.transferNowButton).toBeVisible();
    }

    async revokeAssignedSubscription(sku: string, message: string) {
        await expect(this.revokeSubscriptionButton).toBeVisible();
        await this.revokeSubscriptionButton.click();
        await expect(this.confirmRevokeSubscriptionButton).toBeVisible();

        const notificationPopup = new NotificationPopup(this.page);
        await Promise.all([
            notificationPopup.assertMessage(message),
            this.confirmRevokeSubscriptionButton.click(),
        ]);
        await expect(this.manageDeviceModal.getByText(sku, { exact: true })).toBeHidden();
    }

    async revokeAssignedSubscriptionAndCancelTransfer(sku: string, message: string) {
        await expect(this.revokeSubscriptionButton).toBeVisible();
        await this.revokeSubscriptionButton.click();
        await expect(this.revokeSubscriptionWithTransferModal).toBeVisible();
        const notificationPopup = new NotificationPopup(this.page);
        await Promise.all([
            notificationPopup.assertMessage(message),
            this.revokeSubscriptionAndCancelTransferButton.click(),
        ]);
        await expect(this.revokeSubscriptionWithTransferModal).toBeHidden();
        await expect(this.manageDeviceModal.getByText(sku, { exact: true })).toBeHidden();
    }

    async revokeAssignedSubscriptionAndTransferDeviceNow(sku: string, message: string) {
        await expect(this.revokeSubscriptionButton).toBeVisible();
        await this.revokeSubscriptionButton.click();
        await expect(this.revokeSubscriptionWithTransferModal).toBeVisible();

        const notificationPopup = new NotificationPopup(this.page);
        await Promise.all([
            notificationPopup.assertMessage(message),
            this.revokeSubscriptionAndTransferDeviceNowButton.click(),
        ]);
        await expect(this.revokeSubscriptionWithTransferModal).toBeHidden();
        await expect(this.manageDeviceModal.getByText(sku, { exact: true })).toBeHidden();
    }

    async validateManageDeviceModalShowsAssignedSuperkey(sku: string) {
        await this.validateManageDeviceModal();
        await expect(this.manageDeviceModal.getByText(sku, { exact: true })).toBeVisible();
        await expect(this.revokeSuperkeyButton).toBeVisible();
    }

    async validateAssignedSuperkeyExpiryDate(daysUntilExpiry: number) {
        await expect(this.manageDeviceModal.getByText(`Expires in ${daysUntilExpiry} days`, { exact: true })).toBeVisible();
    }

    /** Modal shell, device identity, and API-assigned subscription visible in UI. */
    async validateManageDeviceModalForAssignedSubscription(serialNumber: string, sku: string) {
        await this.validateManageDeviceModal();
        await this.validateManageDeviceModalShowsDevice(serialNumber);
        await this.validateManageDeviceModalShowsAssignedSubscription(sku);
    }

    async validateManageDeviceModalForAssignedSuperkey(serialNumber: string, sku: string) {
        await this.validateManageDeviceModalShowsDevice(serialNumber);
        await this.validateManageDeviceModalShowsAssignedSuperkey(sku);
    }

    async openAddSuperkeys() {
        await this.addSuperkeysButton.click();
        await expect(this.addSuperkeyDialog).toBeVisible();
    }

    async validateSuperkeyRemainingAllowance(remainingTimes: number) {
        await expect(this.addSuperkeyDialog.getByText(`${remainingTimes} more times`)).toBeVisible();
    }

    async openAddSuperkeyBundlesTab() {
        await this.addSuperkeyDialog.getByRole('tab', { name: 'Bundles' }).click();
    }

    async deselectAllConflictingItems() {
        await this.deselectAllConflictingItemsLink.click();
    }

    async validateAddSuperkeySkuDisabled(sku: string) {
        await expect(this.addSuperkeyDialog.locator(`input[id="${sku}"]`)).toBeDisabled();
    }

    async validateAddSuperkeyConflictWarning(sku: string) {
        const skuArticle = this.addSuperkeyDialog
            .locator(`input[id="${sku}"]`)
            .locator('xpath=ancestor::article[1]');
        await expect(skuArticle.getByText("You've already assigned one or more items that are included in this bundle.", { exact: true })).toBeVisible();
    }

    async validateAddSuperkeySkuEnabled(sku: string) {
        await expect(this.addSuperkeyDialog.locator(`input[id="${sku}"]`)).toBeEnabled();
    }

    // this is on manage device modal
    async cancelTransfer(message: string) {
        await this.cancelTransferButton.click();
        await expect(this.confirmCancelTransferButton).toBeVisible();

        const notificationPopup = new NotificationPopup(this.page);
        await Promise.all([
            notificationPopup.assertMessage(message),
            await this.confirmCancelTransferButton.click(),
        ])

    }

    async transferNow(message: string) {
        const notificationPopup = new NotificationPopup(this.page);

        await Promise.all([
            notificationPopup.assertMessage(message),
            this.transferNowButton.click(),
        ]);
    }

    static logStep(message: string, details?: Record<string, unknown>): void {
        if (details) {
            console.log(`[blockUnblockDevices] ${message}`, details);
            return;
        }

        console.log(`[blockUnblockDevices] ${message}`);
    }

    static logSuccess(message: string, details?: Record<string, unknown>): void {
        if (details) {
            console.log(`[blockUnblockDevices] ${message}`, details);
            return;
        }

        console.log(`[blockUnblockDevices] ${message}`);
    }

    static async updateDeviceStatus(
        request: APIRequestContext,
        authorization: string,
        deviceId: string,
        status: DeviceStatus,
    ): Promise<void> {
        DevicePage.logStep('Updating device status', {
            deviceId,
            status,
        });
        const response = await request.patch(`${IAM_DEVICE_BASE_URL}/${deviceId}`, {
            headers: {
                accept: 'application/json',
                authorization,
                'content-type': 'application/json',
            },
            data: status === 'BLOCKED'
                ? {
                    status,
                    statusMetaData: {
                        comment: BLOCK_COMMENT,
                        reason: BLOCK_REASON,
                    },
                }
                : {
                    status,
                    statusMetaData: {
                        comment: UNBLOCK_COMMENT,
                    },
                },
        });

        const responseBody = await response.text();
        DevicePage.logStep('Device status update response received', {
            deviceId,
            status,
            responseStatus: response.status(),
            responseStatusText: response.statusText(),
            responseBody,
        });
        expect(response.ok(), `Expected ${status} device API call to succeed. Status: ${response.status()} ${response.statusText()}. Body: ${responseBody}`).toBeTruthy();
    }

    async initializeSelectableDevice(
        request: APIRequestContext,
        homePage: DeviceHomePage,
        currentSelectedDevice?: SelectedDevice,
    ): Promise<SelectedDevice> {
        if (currentSelectedDevice) {
            DevicePage.logStep('Reusing cached selected device', {
                accountId: currentSelectedDevice.accountId,
                deviceId: currentSelectedDevice.deviceId,
                serialNumber: currentSelectedDevice.serialNumber,
            });
            return currentSelectedDevice;
        }

        DevicePage.logStep('Initializing selectable device');
        await this.page.goto('/');
        await homePage.assertHomePage();
        await homePage.selectDevicesTab();

        const authContext = await this.waitForDevicesV2Authorization(async () => {
            await homePage.navigateToDevicesPage();
        });

        await expect(this.devicesHeading).toBeVisible();
        await this.searchForDevice(CUSTOMER_NAME);
        await this.waitForDeviceResults();

        const resolvedCandidate = await this.waitForSelectableDevice();
        const deviceId = await this.resolveDeviceIdBySerial(
            request,
            authContext.graphqlUrl,
            authContext.authorization,
            authContext.accountId,
            resolvedCandidate.serialNumber,
        );
        const selectedDevice: SelectedDevice = {
            ...authContext,
            ...resolvedCandidate,
            deviceId,
        };

        DevicePage.logStep('Selected device initialized', {
            accountId: selectedDevice.accountId,
            deviceId: selectedDevice.deviceId,
            serialNumber: selectedDevice.serialNumber,
        });
        await this.validateDeviceRowVisible(selectedDevice.serialNumber);

        return selectedDevice;
    }

    async validateDeviceAcrossTabs(serialNumber: string, accountId: string, expectedStatus: DeviceStatus): Promise<void> {
        DevicePage.logStep('Validating device across tabs', {
            accountId,
            serialNumber,
            expectedStatus,
        });
        await this.openDevicesPageAndSearchSerial(serialNumber, accountId);

        await this.allDevicesTab.click();
        await this.assertDeviceStateOnCurrentTab(serialNumber, expectedStatus, expectedStatus === 'BLOCKED');

        await this.unallocatedDevicesTab.click();
        if (expectedStatus === 'BLOCKED') {
            await this.assertNoRowsFound();
        } else {
            await this.assertDeviceStateOnCurrentTab(serialNumber, expectedStatus);
        }

        await this.blockedDevicesTab.click();

        if (expectedStatus === 'BLOCKED') {
            await this.assertDeviceStateOnCurrentTab(serialNumber, expectedStatus);
            return;
        }

        await this.assertNoRowsFound();
    }

    async assertNotification(accountId: string, serialNumber: string, action: DeviceNotificationAction): Promise<void> {
        DevicePage.logStep('Checking notification', {
            accountId,
            serialNumber,
            action,
        });
        await expect.poll(async () => {
            await this.page.goto(`/${accountId}`);
            await expect(this.page.getByText(/Welcome back,/i)).toBeVisible();
            await this.notificationButton.click();

            const titles = await this.notificationItemTitles.allTextContents();
            const descriptions = await this.notificationItemDescriptions.allTextContents();

            return [...titles, ...descriptions].map(normalizeText).join(' | ');
        }, {
            timeout: 120_000,
            intervals: [2000, 5000, 10000],
        }).toMatch(notificationPattern(serialNumber, action));
        DevicePage.logStep('Notification verified', {
            accountId,
            serialNumber,
            action,
        });
    }

    async assertAuditLog(
        accountId: string,
        serialNumber: string,
        summaryPattern: RegExp,
        detailHeading: string,
        comment: string,
        reason?: string,
    ): Promise<void> {
        DevicePage.logStep('Checking audit log', {
            accountId,
            serialNumber,
            detailHeading,
            comment,
            reason: reason ?? '',
        });
        await this.page.goto(`/${accountId}/audit-logs`);
        await expect(this.auditLogsHeading).toBeVisible();

        const row = await this.waitForAuditLogRowByReference(accountId, serialNumber, summaryPattern);

        await expect(row.locator('[data-field="summary"]')).toHaveText(summaryPattern);
        await expect(row.locator('[data-field="eventType"]')).toHaveText(/^Device Status Change$/i);

        const expandButton = row.getByRole('button', { name: /Expand|Collapse/i }).first();
        await expandButton.click();

        await expect(this.page.getByText(detailHeading, { exact: true })).toBeVisible();
        await expect(this.page.getByText(new RegExp(`Serial Number\\s*:?\\s*${escapeRegExp(serialNumber)}`, 'i'))).toBeVisible();
        await expect(this.page.getByText(new RegExp(`Customer\\s*:?\\s*${escapeRegExp(CUSTOMER_NAME)}`, 'i'))).toBeVisible();
        await expect(this.page.getByText(new RegExp(`Comments\\s*:?\\s*${escapeRegExp(comment)}`, 'i'))).toBeVisible();

        if (reason) {
            await expect(this.page.getByText(new RegExp(`Reason\\s*:?\\s*${escapeRegExp(reason)}`, 'i'))).toBeVisible();
        }

        DevicePage.logStep('Audit log verified', {
            accountId,
            serialNumber,
            detailHeading,
        });
    }

    private async waitForDevicesV2Authorization(
        action: () => Promise<void>,
    ): Promise<Pick<SelectedDevice, 'accountId' | 'authorization' | 'graphqlUrl'>> {
        const requestPromise = this.page.waitForRequest((request) => {
            const postData = request.postData() ?? '';
            return request.method() === 'POST'
                && request.url().includes('/api/graphql')
                && (
                    request.url().includes('operationName=DevicesV2')
                    || postData.includes('"operationName":"DevicesV2"')
                    || postData.includes('dealerDevicesV2')
                );
        }, { timeout: 60_000 });

        await action();

        const request = await requestPromise;
        const authorization = request.headers()['authorization'];
        const accountId = request.headers()['dxp-account-ids'];
        const graphqlUrl = request.url();

        expect(authorization, 'Expected DevicesV2 request authorization header').toMatch(/^Bearer\s.+/);
        expect(accountId, 'Expected DevicesV2 request dxp-account-ids header').toBeTruthy();
        expect(graphqlUrl, 'Expected DevicesV2 request URL').toBeTruthy();

        DevicePage.logStep('Captured DevicesV2 request context', {
            accountId,
            graphqlUrl,
        });

        return {
            accountId: accountId!,
            authorization: authorization!,
            graphqlUrl,
        };
    }

    private async waitForDeviceResults(): Promise<void> {
        await expect.poll(async () => await this.tableRows.count(), {
            timeout: 60_000,
            intervals: [1000, 2000, 5000],
        }).toBeGreaterThan(0);
        DevicePage.logStep('Device results loaded', {
            rowCount: await this.tableRows.count(),
        });
    }

    private async getDeviceRowBySerial(serialNumber: string): Promise<Locator | undefined> {
        const rowCount = await this.tableRows.count();

        for (let index = 0; index < rowCount; index++) {
            const row = this.tableRows.nth(index);
            const rowSerial = normalizeText(await row.locator('[data-field="serialNumber"]').textContent().catch(() => null));

            if (rowSerial === serialNumber) {
                return row;
            }
        }

        return undefined;
    }

    private async getSelectableDevice(): Promise<Pick<SelectedDevice, 'serialNumber'> | undefined> {
        const rowCount = await this.tableRows.count();

        for (let index = 0; index < rowCount; index++) {
            const row = this.tableRows.nth(index);
            const ownerName = normalizeText(await row.locator('[data-field="ownerName"]').textContent().catch(() => null));
            const modelName = normalizeText(await row.locator('[data-field="modelName"]').textContent().catch(() => null));
            const serialNumber = normalizeText(await row.locator('[data-field="serialNumber"]').textContent().catch(() => null));

            if (ownerName === CUSTOMER_NAME && serialNumber && !/lock/i.test(modelName)) {
                DevicePage.logStep('Found selectable device candidate', {
                    serialNumber,
                    ownerName,
                    modelName,
                });
                return {
                    serialNumber,
                };
            }
        }

        return undefined;
    }

    private async waitForSelectableDevice(timeoutMs = 60_000): Promise<Pick<SelectedDevice, 'serialNumber'>> {
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            const candidate = await this.getSelectableDevice();
            if (candidate) {
                return candidate;
            }

            await this.page.waitForTimeout(1000);
        }

        throw new Error(`Unable to find a selectable device for owner ${CUSTOMER_NAME} within ${timeoutMs}ms.`);
    }

    private async waitForDeviceRowBySerial(serialNumber: string, timeoutMs = 60_000): Promise<Locator> {
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            const row = await this.getDeviceRowBySerial(serialNumber);
            if (row) {
                return row;
            }

            await this.page.waitForTimeout(1000);
        }

        throw new Error(`Unable to find device row for serial number ${serialNumber} within ${timeoutMs}ms.`);
    }

    private async isDeviceActionDisabled(actionButton: Locator): Promise<boolean> {
        return actionButton.evaluate((element) => {
            const button = element as HTMLButtonElement;
            return button.disabled
                || button.getAttribute('aria-disabled') === 'true'
                || button.classList.contains('Mui-disabled')
                || button.closest('[aria-disabled="true"]') !== null;
        }).catch(() => false);
    }

    private async resolveDeviceIdBySerial(
        request: APIRequestContext,
        graphqlUrl: string,
        authorization: string,
        dealerAccountId: string,
        serialNumber: string,
    ): Promise<string> {
        DevicePage.logStep('Resolving DevicesV2 id for serial number', {
            dealerAccountId,
            serialNumber,
        });
        const response = await request.post(graphqlUrl, {
            headers: {
                accept: 'application/json',
                authorization,
                'content-type': 'application/json',
                'dxp-account-ids': dealerAccountId,
            },
            data: {
                query: DEVICES_V2_BY_SERIAL_QUERY,
                variables: {
                    dealerAccountId,
                    serialNumber,
                },
            },
        });

        const responseText = await response.text();
        expect(response.ok(), `Expected DevicesV2 lookup for serial ${serialNumber} to succeed. Status: ${response.status()} ${response.statusText()}. Body: ${responseText}`).toBeTruthy();

        const body = responseText ? (JSON.parse(responseText) as { data?: DealerDevicesBySerialResponse; errors?: unknown }) : {};
        expect(body.errors, `Unexpected GraphQL errors while resolving device id for serial ${serialNumber}: ${JSON.stringify(body.errors, null, 2)}`).toBeFalsy();

        const resolvedDevice = body.data?.dealerDevicesV2.nodes.find((node) => node.serialNumber === serialNumber);
        expect(resolvedDevice, `Expected DevicesV2 lookup to return a device id for serial ${serialNumber}. Body: ${responseText}`).toBeTruthy();

        DevicePage.logStep('Resolved DevicesV2 id for serial number', {
            dealerAccountId,
            serialNumber,
            deviceId: resolvedDevice!.id,
        });

        return resolvedDevice!.id;
    }

    private async openDevicesPageAndSearchSerial(serialNumber: string, accountId: string): Promise<void> {
        DevicePage.logStep('Opening Devices page and searching serial number', {
            accountId,
            serialNumber,
        });
        await this.page.goto(`/${accountId}/devices`);
        await expect(this.devicesHeading).toBeVisible();
        await this.searchForDevice(serialNumber);
    }

    private async assertDeviceStateOnCurrentTab(
        serialNumber: string,
        expectedStatus: DeviceStatus,
        expectBlockedTooltip = false,
    ): Promise<void> {
        DevicePage.logStep('Validating device state on current tab', {
            serialNumber,
            expectedStatus,
            expectBlockedTooltip,
        });
        const resolvedRow = await this.waitForDeviceRowBySerial(serialNumber);
        const modelCell = resolvedRow.locator('[data-field="modelName"]');
        const actionButton = resolvedRow.getByRole('button', { name: 'Device Actions' });

        if (expectedStatus === 'BLOCKED') {
            await expect(modelCell).toContainText(/lock/i);
            await expect(actionButton).toBeVisible();
            if (expectBlockedTooltip) {
                await resolvedRow.locator('[role="gridcell"]').last().hover({ force: true });
                await expect(this.page.getByText(BLOCKED_ACTION_TOOLTIP, { exact: true })).toBeVisible();
                DevicePage.logStep('Blocked tooltip verified on current tab', {
                    serialNumber,
                });
            }
        } else {
            await expect(modelCell).not.toContainText(/lock/i);
            await expect.poll(async () => await this.isDeviceActionDisabled(actionButton), {
                timeout: 30_000,
                intervals: [1000, 2000, 5000],
            }).toBe(false);
        }
    }

    private async assertNoRowsFound(): Promise<void> {
        await expect(this.noRowsFoundText).toBeVisible();
        DevicePage.logStep('Verified empty device table state');
    }

    private auditLogDataRows(): Locator {
        return this.auditLogRows.filter({
            has: this.page.getByRole('button', { name: /Expand|Collapse/i }).first(),
        });
    }

    private async waitForAuditLogResults(timeoutMs = 15_000): Promise<void> {
        await expect(this.auditLogsHeading).toBeVisible({ timeout: timeoutMs });
        await expect(this.auditLogResultsSummary).toBeVisible({ timeout: timeoutMs });
        await expect(this.auditLogTableHeaders.nth(1)).toBeVisible({ timeout: timeoutMs });

        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            const summaryText = normalizeText(await this.auditLogResultsSummary.textContent().catch(() => null));
            const rowCount = await this.auditLogDataRows().count().catch(() => 0);
            const loadingVisible = await this.auditLogLoadingText.isVisible().catch(() => false);

            if (!loadingVisible && (rowCount > 0 || summaryText.length > 0)) {
                return;
            }

            await this.page.waitForTimeout(250);
        }

        throw new Error(`Timed out after ${timeoutMs}ms waiting for audit log results to load.`);
    }

    private async findAuditLogRowByReference(referenceNumber: string, summaryPattern?: RegExp): Promise<Locator | undefined> {
        const rows = this.auditLogDataRows();
        const rowCount = await rows.count();

        for (let index = 0; index < rowCount; index++) {
            const row = rows.nth(index);
            const reference = normalizeText(await row.locator('[data-field="reference"]').textContent().catch(() => null));
            const summary = normalizeText(await row.locator('[data-field="summary"]').textContent().catch(() => null));
            const eventType = normalizeText(await row.locator('[data-field="eventType"]').textContent().catch(() => null));

            if (
                referenceNumber === reference
                && /^Device Status Change$/i.test(eventType)
                && (!summaryPattern || summaryPattern.test(summary))
            ) {
                DevicePage.logStep('Found audit log row by reference', {
                    referenceNumber,
                    summary,
                    rowIndex: index,
                });
                return row;
            }
        }

        return undefined;
    }

    private async waitForAuditLogRowByReference(
        accountId: string,
        referenceNumber: string,
        summaryPattern?: RegExp,
        timeoutMs = 120_000,
    ): Promise<Locator> {
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            const timeRemainingMs = deadline - Date.now();
            await this.waitForAuditLogResults(Math.min(15_000, Math.max(2_000, timeRemainingMs)));

            const row = await this.findAuditLogRowByReference(referenceNumber, summaryPattern);
            if (row) {
                return row;
            }

            await this.page.waitForTimeout(Math.min(5_000, Math.max(500, deadline - Date.now())));
            await this.page.goto(`/${accountId}/audit-logs`);
        }

        throw new Error(`Unable to find audit log row for reference number ${referenceNumber} within ${timeoutMs}ms.`);
    }
}
