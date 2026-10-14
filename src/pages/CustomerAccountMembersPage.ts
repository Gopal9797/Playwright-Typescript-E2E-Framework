import { Locator, Page, expect } from "@playwright/test";
import { AssignUserLicenseModal } from "./AssignUserLicenseModal";
import { ManageUserLicensesModal } from "./ManageUserLicensesModal";

/** Account Members section on a customer's detail page. */
export class CustomerAccountMembersPage {
    readonly page: Page;
    readonly accountMembersTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accountMembersTab = page.getByRole('tab', { name: 'Account Members', exact: true });
    }

    accountMemberRow(email: string): Locator {
        return this.page.getByRole('row', { name: email });
    }

    private accountMemberActionsButton(email: string): Locator {
        return this.accountMemberRow(email).getByRole('menuitem', { name: 'more' });
    }

    accountMemberSubscriptionStatus(email: string): Locator {
        // "None" renders as a status, not an alert like "Assigned (N)", so scope by column instead of role.
        return this.accountMemberRow(email).locator('[data-field="productLines"]');
    }

    async openAssignLicenseModal(email: string): Promise<AssignUserLicenseModal> {
        await this.accountMembersTab.click();
        await this.accountMemberActionsButton(email).click();
        await this.page.getByRole('menuitem', { name: 'Assign a License' }).click();
        const modal = new AssignUserLicenseModal(this.page);
        await expect(modal.dialog).toBeVisible();
        return modal;
    }

    async openManageLicensesModal(email: string): Promise<ManageUserLicensesModal> {
        await this.accountMembersTab.click();
        await this.accountMemberActionsButton(email).click();
        await this.page.getByRole('menuitem', { name: 'Manage Licenses' }).click();
        const modal = new ManageUserLicensesModal(this.page);
        await expect(modal.dialog).toBeVisible();
        return modal;
    }
}
