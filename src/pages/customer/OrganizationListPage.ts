import { expect, Locator, Page } from "@playwright/test";
import { cancelCreateCustomer, type CreateCustomerBasePage } from "./CreateCustomerNavigation";
import { LocationInfoPage } from "./LocationInfoPage";
import { AssignOrgToCustomerModal } from "../modals/AssignOrgToCustomerModal";

export class OrganizationListPage {
    readonly page: Page;
    readonly organizationListHeader: Locator;
    readonly resultsCount: Locator;
    readonly createNewOrEditOrgBtn: Locator;
    readonly backBtn: Locator;
    readonly cancelBtn: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.organizationListHeader = page.getByRole('heading', { name: 'Organization List', exact: true });
        this.resultsCount = page.locator('label.modus-wc-input-label').filter({ hasText: /^\d+\s+Results$/ });
        this.createNewOrEditOrgBtn = page
            .getByTestId('create-new-organization-button')
            .getByRole('button', { name: /^(Create a New Organization|Edit Organization)$/ });
        this.backBtn = page
            .getByTestId('back-create-customer-select-organization-button')
            .getByRole('button', { name: 'Back', exact: true });
        this.cancelBtn = page
            .getByTestId('cancel-create-customer-select-organization-button')
            .getByRole('button', { name: 'Cancel', exact: true });
        this.nextBtn = page
            .getByTestId('next-create-customer-select-organization-button')
            .getByRole('button', { name: /^Next: / });
    }

    static async init(page: Page): Promise<OrganizationListPage> {
        const organizationListPage = new OrganizationListPage(page);
        await expect(organizationListPage.organizationListHeader).toBeVisible();
        return organizationListPage;
    }

    async assertBasicFields(): Promise<void> {
        await expect(this.organizationListHeader).toBeVisible();
        await expect(this.resultsCount).toBeVisible();
        await expect(this.createNewOrEditOrgBtn).toBeVisible();
        await expect(this.backBtn).toBeVisible();
        await expect(this.cancelBtn).toBeVisible();
        await expect(this.nextBtn).toBeVisible();
    }

    async CreateNewOrEditOrganization(): Promise<AssignOrgToCustomerModal> {
        await this.createNewOrEditOrgBtn.click();
        return AssignOrgToCustomerModal.init(this.page);
    }

    async Cancel(): Promise<CreateCustomerBasePage> {
        return cancelCreateCustomer(this.page, this.cancelBtn);
    }

    async SelectOrganization(organizationName: string): Promise<void> {
        const escapedName = organizationName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const organizationRow = this.page.getByTestId('assign-organization-modal-result-card').filter({
            has: this.page.locator('p').filter({ hasText: new RegExp(`^${escapedName}$`, 'i') }),
        });
        const organizationRadio = organizationRow.getByRole('radio');
        await organizationRadio.first().check();
        await expect(organizationRadio.first()).toBeChecked();
        await expect(this.nextBtn).toBeEnabled();
    }

    async NextLocationInfo(): Promise<LocationInfoPage> {
        await this.nextBtn.click();
        return LocationInfoPage.init(this.page);
    }
}
