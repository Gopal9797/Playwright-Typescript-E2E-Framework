import { expect, Locator, Page } from "@playwright/test";
import { cancelCreateCustomer, type CreateCustomerBasePage } from "./CreateCustomerNavigation";
import { CompanyInfoPage } from "./CompanyInfoPage";
import { CustomerDetailsPage } from "./CustomerDetailsPage";
import { ExistingAccountDetectedModal } from "../modals/ExistingAccountDetectedModal";

export class OwnerInfoPage {
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly emailAddressTxt: Locator;
    readonly feedbackLbl: Locator;
    readonly emailMatchedAlert: Locator;
    readonly cancelBtn: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator('h2', { hasText: /^Create New Customer$/ });
        this.emailAddressTxt = page.getByTestId('tid-email-input').getByRole('textbox');
        this.feedbackLbl = page
            .getByTestId('tid-email-input')
            .locator('modus-wc-input-feedback span');
        this.emailMatchedAlert = page.getByTestId('email-matched-alert');
        this.cancelBtn = page
            .getByTestId('cancel-create-customer-account-information-button')
            .getByRole('button', { name: 'Cancel', exact: true });
        this.nextBtn = page
            .getByTestId('next-create-customer-account-information-button')
            .getByRole('button', { name: /^Next: / });
    }

    static async init(page: Page): Promise<OwnerInfoPage> {
        const createNewCustomerPage = new OwnerInfoPage(page);
        await page.waitForLoadState('load');
        await expect(createNewCustomerPage.pageHeader).toBeVisible();
        return createNewCustomerPage;
    };

    async assertBasicFields(): Promise<void> {
        await expect(this.emailAddressTxt).toBeVisible();
        await expect(this.feedbackLbl).toHaveText('This will be the primary account owner\'s Trimble ID email address.');
        await expect(this.cancelBtn).toBeVisible();
        await expect(this.nextBtn).toBeVisible();
    }

    async assertEmailMatchedAlert(name: string, email: string, companyName: string): Promise<void> {
        await expect.soft(
            this.emailMatchedAlert,
            'The email matched alert should be visible',
        ).toBeVisible();
        await expect.soft(
            this.emailMatchedAlert.locator('p').first(),
            'The email matched alert should explain that the TID is already connected to a customer account',
        ).toHaveText('This TID is connected to a customer account that already exists in your dealer portfolio');

        const matchedCustomerCard = this.emailMatchedAlert.locator('article').first();
        await expect.soft(
            matchedCustomerCard.locator('.modus-wc-card-title'),
            'The matched customer card should display the customer name',
        ).toHaveText(name);
        await expect.soft(
            matchedCustomerCard.getByTitle(email, { exact: true }),
            'The matched customer card should display the customer email address',
        ).toHaveText(email);
        await expect.soft(
            matchedCustomerCard.getByText(companyName, { exact: true }),
            'The matched customer card should display the company name',
        ).toBeVisible();
    }

    async Next(): Promise<void> {
        await this.nextBtn.scrollIntoViewIfNeeded();
        await this.nextBtn.click();
    }

    async EnterEmailAddress(emailAddress: string): Promise<void> {
        await this.emailAddressTxt.fill(emailAddress);
        await this.emailAddressTxt.press('Tab');
    }

    async assertLinkAccountButton(): Promise<void> {
        await expect(this.nextBtn).toBeVisible();
        await expect(this.nextBtn).toHaveText(/Next: Link Account/);
    }

    async NextCompanyInfo(): Promise<CompanyInfoPage> {
        await this.Next();
        return CompanyInfoPage.init(this.page);
    }

    async NextContinueWithThisAccount(companyName: string): Promise<CustomerDetailsPage> {
        await this.Next();
        return CustomerDetailsPage.init(this.page, companyName);
    }

    async NextLinkAccount(): Promise<ExistingAccountDetectedModal> {
        await this.Next();
        return ExistingAccountDetectedModal.init(this.page);
    }

    async Cancel(): Promise<CreateCustomerBasePage> {
        return cancelCreateCustomer(this.page, this.cancelBtn);
    }
}
