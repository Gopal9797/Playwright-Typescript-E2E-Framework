import { expect, Locator, Page } from "@playwright/test";
import { cancelCreateCustomer, type CreateCustomerBasePage } from "./CreateCustomerNavigation";
import { ReviewNewCustomerPage } from "./ReviewNewCustomerPage";

export class ShipToContactInfoPage {
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly shipToContactInfoHeader: Locator;
    readonly firstNameTxt: Locator;
    readonly lastNameTxt: Locator;
    readonly emailAddressTxt: Locator;
    readonly feedbackLbl: Locator;
    readonly phoneCountryCmb: Locator;
    readonly phoneNumberTxt: Locator;
    readonly backBtn: Locator;
    readonly cancelBtn: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator('h2', { hasText: /^Create New Customer$/ });
        this.shipToContactInfoHeader = page.getByRole('heading', { name: 'Ship to Contact Information', exact: true });
        this.firstNameTxt = page.getByTestId('contact-first-name-input').getByRole('textbox');
        this.lastNameTxt = page.getByTestId('contact-last-name-input').getByRole('textbox');
        this.emailAddressTxt = page.getByTestId('contact-email-input').getByRole('textbox');
        this.feedbackLbl = page.locator('modus-wc-input-feedback span').last();
        this.phoneCountryCmb = page.getByTestId('contact-phone-number-input-country').getByRole('combobox');
        this.phoneNumberTxt = page.getByTestId('contact-phone-number-input').getByRole('textbox');
        this.backBtn = page
            .getByTestId('back-create-customer-ship-to-contact-information-button')
            .getByRole('button', { name: 'Back', exact: true });
        this.cancelBtn = page
            .getByTestId('cancel-create-customer-ship-to-contact-information-button')
            .getByRole('button', { name: 'Cancel', exact: true });
        this.nextBtn = page
            .getByTestId('next-create-customer-ship-to-contact-information-button')
            .getByRole('button', { name: /^Next: / });
    }

    static async init(page: Page): Promise<ShipToContactInfoPage> {
        const shipToContactInfoPage = new ShipToContactInfoPage(page);
        await expect(shipToContactInfoPage.shipToContactInfoHeader).toBeVisible();
        return shipToContactInfoPage;
    }

    async assertBasicFields(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.shipToContactInfoHeader).toBeVisible();
        await expect(this.firstNameTxt).toBeVisible();
        await expect(this.lastNameTxt).toBeVisible();
        await expect(this.emailAddressTxt).toBeVisible();
        await expect(this.phoneCountryCmb).toBeVisible();
        await expect(this.phoneNumberTxt).toBeVisible();
        await expect(this.backBtn).toBeVisible();
        await expect(this.cancelBtn).toBeVisible();
        await expect(this.nextBtn).toBeVisible();
    }

    async Cancel(): Promise<CreateCustomerBasePage> {
        return cancelCreateCustomer(this.page, this.cancelBtn);
    }

    async EnterContactInformation(firstName: string, lastName: string, emailAddress: string, phoneNumber?: string): Promise<void> {
        await this.firstNameTxt.fill(firstName);
        await this.lastNameTxt.fill(lastName);
        await this.emailAddressTxt.fill(emailAddress);
        if (phoneNumber !== undefined) {
            await this.phoneNumberTxt.click();
            await this.page.keyboard.type(phoneNumber, {delay: 100});
        }
    }

    async NextReviewCustomer(): Promise<ReviewNewCustomerPage> {
        await this.nextBtn.click();
        return ReviewNewCustomerPage.init(this.page);
    }
}
