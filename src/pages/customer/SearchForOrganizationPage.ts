import { expect, Locator, Page } from "@playwright/test";
import { cancelCreateCustomer, type CreateCustomerBasePage } from "./CreateCustomerNavigation";
import { OrganizationListPage } from "./OrganizationListPage";

export class SearchForOrganizationPage {
	readonly page: Page;
	readonly pageHeader: Locator;
	readonly searchForOrganizationHeader: Locator;
	readonly organizationNameTxt: Locator;
	readonly websiteTxt: Locator;
	readonly countryCmb: Locator;
	readonly cityTxt: Locator;
	readonly stateCmb: Locator;
	readonly zipCodeTxt: Locator;
	readonly backBtn: Locator;
	readonly cancelBtn: Locator;
	readonly nextBtn: Locator;

	constructor(page: Page) {
		this.page = page;
		this.pageHeader = page.locator('h2', { hasText: /^Create New Customer$/ });
		this.searchForOrganizationHeader = page.locator('h2', { hasText: /^Search for Organization$/ });
		this.organizationNameTxt = page.getByTestId('search-organization-name-input').getByRole('textbox');
		this.websiteTxt = page.getByTestId('search-organization-website-input').getByRole('textbox');
		this.countryCmb = page.getByTestId('search-organization-country-select').getByRole('combobox');
		this.cityTxt = page.getByTestId('search-organization-city-input').getByRole('textbox');
		this.stateCmb = page.getByTestId('search-organization-state-select').getByRole('combobox');
		this.zipCodeTxt = page.getByTestId('search-organization-zip-input').getByRole('textbox');
		this.backBtn = page
			.getByTestId('back-create-customer-search-organization-button')
			.getByRole('button', { name: 'Back', exact: true });
		this.cancelBtn = page
			.getByTestId('cancel-create-customer-search-organization-button')
			.getByRole('button', { name: 'Cancel', exact: true });
		this.nextBtn = page
			.getByTestId('next-create-customer-search-organization-button')
			.getByRole('button', { name: /^Next: / });
	}

	static async init(page: Page): Promise<SearchForOrganizationPage> {
		const searchForOrgPage = new SearchForOrganizationPage(page);
		await expect(searchForOrgPage.searchForOrganizationHeader).toBeVisible();
		return searchForOrgPage;
	}

	async assertBasicFields(): Promise<void> {
		await expect(this.pageHeader).toBeVisible();
		await expect(this.searchForOrganizationHeader).toBeVisible();
		await expect(this.organizationNameTxt).toBeVisible();
		await expect(this.websiteTxt).toBeVisible();
		await expect(this.countryCmb).toBeVisible();
		await expect(this.cityTxt).toBeVisible();
		await expect(this.stateCmb).toBeVisible();
		await expect(this.zipCodeTxt).toBeVisible();
		await expect(this.backBtn).toBeVisible();
		await expect(this.cancelBtn).toBeVisible();
		await expect(this.nextBtn).toBeVisible();
	}

	async Cancel(): Promise<CreateCustomerBasePage> {
		return cancelCreateCustomer(this.page, this.cancelBtn);
	}

	async EnterOrganizationSearch(organizationName: string, country: string, city: string | null = null): Promise<void> {
		await this.organizationNameTxt.fill(organizationName);
		await this.countryCmb.selectOption({ label: country });
		if (city !== null) {
			await this.cityTxt.fill(city);
		}
	}

	async NextOrganizationList(): Promise<OrganizationListPage> {
		await this.nextBtn.click();
		return OrganizationListPage.init(this.page);
	}
}
