import { expect, Locator, Page } from "@playwright/test";
import { CustomersPage } from "../customer/CustomersPage";
import { BaseModal } from "./BaseModal";
import { CustomerDetailsPage } from "../customer/CustomerDetailsPage";
import { NotificationPopup } from "../common/NotificationPopup";

export class ExistingAccountDetectedModal extends BaseModal {
    readonly title: Locator;
    readonly companyName: Locator;
    readonly emailAddress: Locator;
    readonly cdhId: Locator;
    readonly address: Locator;
    readonly chooseDifferentTidBtn: Locator;
    readonly linkCustomerToDealerPortalBtn: Locator;
    readonly cancelBtn: Locator;

    constructor(page: Page) {
        const title = page.getByTestId('matching-customer-information-title');
        const dialog = page.locator('article').filter({ has: title });
        super(page, dialog, title.locator('..').getByRole('button'));
        this.title = title;
        this.companyName = this.dialog.getByTestId('matching-customer-information-company-name');
        this.emailAddress = this.dialog.getByTestId('matching-customer-information-customer-email');
        this.cdhId = this.dialog.getByTestId('matching-customer-information-customer-id');
        this.address = this.dialog.getByTestId('matching-customer-information-address');
        this.chooseDifferentTidBtn = this.dialog
            .getByTestId('choose-different-tid-button')
            .getByRole('button', { name: 'Choose a Different TID', exact: true });
        this.linkCustomerToDealerPortalBtn = this.dialog
            .getByTestId('link-to-dealer-portal-button')
            .getByRole('button', { name: 'Link This Customer to My Dealer Portal', exact: true });
        this.cancelBtn = this.dialog
            .getByTestId('cancel-existing-account-modal-button')
            .getByRole('button', { name: 'Cancel', exact: true });
    }

    static async init(page: Page): Promise<ExistingAccountDetectedModal> {
        const existingAccountDetectedModal = new ExistingAccountDetectedModal(page);
        await expect(existingAccountDetectedModal.dialog).toBeVisible();
        return existingAccountDetectedModal;
    }

    async assertBasicFields(): Promise<void> {
        await super.assertBasicFields();
        await expect(this.title).toHaveText('Existing Account Detected');
        await expect(this.companyName).toBeVisible();
        await expect(this.companyName).toHaveText(/\S/);
        await expect(this.emailAddress).toBeVisible();
        await expect(this.emailAddress).toHaveText(/\S/);
        await expect(this.cdhId).toBeVisible();
        await expect(this.cdhId).toHaveText(/\S/);
        await expect(this.address).toBeVisible();
        await expect(this.address).toHaveText(/\S/);
        await expect(this.chooseDifferentTidBtn).toBeVisible();
        await expect(this.linkCustomerToDealerPortalBtn).toBeVisible();
        await expect(this.cancelBtn).toBeVisible();
    }

    async Cancel(): Promise<CustomersPage> {
        await this.cancelBtn.click();
        await expect(this.dialog).toBeHidden();
        return CustomersPage.init(this.page);
    }

    // TODO: Return to contract customer confirmation when linking originates from Create Contract.
    async LinkCustomer(customerName: string): Promise<CustomerDetailsPage> {
        const notificationPopup = new NotificationPopup(this.page);
        await Promise.all([
            notificationPopup.assertMessage('Customer linked successfully'),
            this.linkCustomerToDealerPortalBtn.click(),
        ]);
        await expect(this.dialog).toBeHidden();
        return CustomerDetailsPage.init(this.page, customerName);
    }
}
