import { expect, Locator, Page } from "@playwright/test";
import { cancelCreateCustomer, type CreateCustomerBasePage } from "./CreateCustomerNavigation";
import { SearchForOrganizationPage } from "./SearchForOrganizationPage";

export class CompanyInfoPage {
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly companyInfoHeader: Locator;
    readonly companyNameTxt: Locator;
    readonly industryCmb: Locator;
    readonly preferredLanguageCmb: Locator;
    readonly optInChk: Locator;
    readonly backBtn: Locator;
    readonly cancelBtn: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator('h2', { hasText: /^Create New Customer$/ });
        this.companyInfoHeader = page.locator('h2', { hasText: /^Company Information$/ });
        this.companyNameTxt = page.getByTestId('company-name-input').getByRole('textbox');
        this.industryCmb = page.getByTestId('industry-select').getByRole('combobox');
        this.preferredLanguageCmb = page.getByTestId('language-select').getByRole('combobox');
        this.optInChk = page.getByTestId('opt-in-checkbox').getByRole('checkbox');
        this.backBtn = page
            .getByTestId('back-create-customer-company-information-button')
            .getByRole('button', { name: 'Back', exact: true });
        this.cancelBtn = page
            .getByTestId('cancel-create-customer-company-information-button')
            .getByRole('button', { name: 'Cancel', exact: true });
        this.nextBtn = page
            .getByTestId('next-create-customer-company-information-button')
            .getByRole('button', { name: /^Next: / });
    }

    static async init(page: Page): Promise<CompanyInfoPage> {
        const companyInfoPage = new CompanyInfoPage(page);
        await expect(companyInfoPage.companyInfoHeader).toBeVisible();
        return companyInfoPage;
    }

    async assertBasicFields(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.companyInfoHeader).toBeVisible();
        await expect(this.companyNameTxt).toBeVisible();
        await expect(this.industryCmb).toBeVisible();
        await expect(this.preferredLanguageCmb).toBeVisible();
        await expect(this.optInChk).toBeVisible();
        await expect(this.backBtn).toBeVisible();
        await expect(this.cancelBtn).toBeVisible();
        await expect(this.nextBtn).toBeVisible();
    }

    async EnterCompanyInformation(companyName: string, preferredLanguage: string, industry: string | null): Promise<void> {
        await this.companyNameTxt.fill(companyName);
        if (industry !== null) {
            await this.industryCmb.selectOption({ label: industry });
        }
        await this.preferredLanguageCmb.selectOption({ label: preferredLanguage });
    }

    async NextSearchForOrganization(): Promise<SearchForOrganizationPage> {
        await this.nextBtn.click();
        return SearchForOrganizationPage.init(this.page);
    }

    async Cancel(): Promise<CreateCustomerBasePage> {
        return cancelCreateCustomer(this.page, this.cancelBtn);
    }
}
