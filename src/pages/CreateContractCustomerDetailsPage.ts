import { expect, Locator, Page } from "@playwright/test";
import { CustomerDetailsPage } from "./customer/CustomerDetailsPage";
import { TermsPage } from "./TermsPage";

export class CreateContractCustomerDetailsPage {
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly shipToAddress: Locator;
    readonly shipToContactName: Locator;
    readonly shipToContactEmail: Locator;
    readonly cancelButton: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator('h2', { hasText: /^Create new contract$/ });
        const customerDetailsPanel = page.locator('[role="tabpanel"]:not([hidden])');
        this.shipToAddress = customerDetailsPanel.getByTestId('option-label-default-ship-to-address');
        this.shipToContactName = customerDetailsPanel.getByTestId('option-label-default-ship-to-contact');
        this.shipToContactEmail = customerDetailsPanel.getByTestId('option-subtitle-default-ship-to-contact');
        this.cancelButton = customerDetailsPanel.getByRole('button', { name: 'Cancel', exact: true });
        this.continueButton = customerDetailsPanel.getByRole('button', { name: 'Next: Set Contract Details', exact: true });
    }

    static async init(page: Page): Promise<CreateContractCustomerDetailsPage> {
        const customerDetailsPage = new CreateContractCustomerDetailsPage(page);
        await expect(customerDetailsPage.pageHeader).toBeVisible();
        return customerDetailsPage;
    }

    async assertBasicFields(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.shipToAddress).toBeVisible();
        await expect(this.shipToContactName).toBeVisible();
        await expect(this.shipToContactEmail).toBeVisible();
        await expect(this.cancelButton).toBeVisible();
        await expect(this.continueButton).toBeVisible();
    }

    async Cancel(customerName: string): Promise<CustomerDetailsPage> {
        await this.cancelButton.click();
        return CustomerDetailsPage.init(this.page, customerName);
    }

    async Continue(): Promise<TermsPage> {
        await this.continueButton.click();
        const termsPage = new TermsPage(this.page);
        await termsPage.termsPageAssertion();
        return termsPage;
    }
}
