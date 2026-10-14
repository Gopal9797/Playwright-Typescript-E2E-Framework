import { expect, Locator, Page } from "@playwright/test";
import { BaseModal } from "./BaseModal";
import type { OrganizationListPage } from "../customer/OrganizationListPage";
import { AddressSearch } from "../../ui-components/AddressSearch";
import { AddressMatchModal } from "./AddressMatchModal";

export class AssignOrgToCustomerModal extends BaseModal {
	readonly title: Locator;
	readonly subtitle: Locator;
	readonly consentAlert: Locator;
	readonly customerCard: Locator;
	readonly organizationNameTxt: Locator;
	readonly organizationEmailTxt: Locator;
	readonly phoneNumberTxt: Locator;
	readonly websiteTxt: Locator;
	readonly industryCmb: Locator;
	readonly countryCmb: Locator;
	readonly streetAddressSearch: AddressSearch;
	readonly streetAddressTxt: Locator;
	readonly streetAddressLineTwoTxt: Locator;
	readonly cityTxt: Locator;
	readonly stateCmb: Locator;
	readonly zipCodeTxt: Locator;
	readonly feedbackLbl: Locator;
	readonly backBtn: Locator;
	readonly submitBtn: Locator;

	constructor(page: Page) {
		const dialog = page.locator('dialog#create-organization-modal .modus-wc-modal-box');
		const title = dialog.locator('[slot="header"]').filter({
			hasText: /^Assign an Organization to the Customer$/,
		});
		super(page, dialog);
		this.title = title;
		this.subtitle = this.dialog.locator('modus-wc-typography').filter({
			hasText: /^Fill the new Organization's details and assign it to the selected customer account\.$/,
		});
		this.consentAlert = this.dialog.getByText(
			/By providing Organization details in this form, you represent that you have the necessary approvals/,
		);
		this.customerCard = this.dialog.getByTestId('assign-organization-modal-customer-card');
		this.organizationNameTxt = this.dialog
			.getByTestId('organization-name-input')
			.getByRole('textbox')
			.filter({ visible: true });
		this.organizationEmailTxt = this.dialog
			.getByTestId('organization-email-input')
			.getByRole('textbox')
			.filter({ visible: true });
		this.phoneNumberTxt = this.dialog
			.getByTestId('organization-phone-number-input')
			.getByRole('textbox')
			.filter({ visible: true });
		this.websiteTxt = this.dialog
			.getByTestId('organization-website-input')
			.getByRole('textbox')
			.filter({ visible: true });
		this.industryCmb = this.dialog
			.getByTestId('organization-industry-select')
			.getByRole('combobox')
			.filter({ visible: true });
		this.countryCmb = this.dialog
			.getByTestId('address-country-select')
			.getByRole('combobox')
			.filter({ visible: true });
		this.streetAddressSearch = new AddressSearch(
			page,
			this.dialog.getByTestId('address-street-address-input'),
		);
		this.streetAddressTxt = this.streetAddressSearch.Input;
		this.streetAddressLineTwoTxt = this.dialog
			.getByTestId('address-street-address-two-input')
			.getByRole('textbox')
			.filter({ visible: true });
		this.cityTxt = this.dialog
			.getByTestId('address-city-input')
			.getByRole('textbox')
			.filter({ visible: true });
		this.stateCmb = this.dialog
			.getByTestId('address-state-select')
			.getByRole('combobox')
			.filter({ visible: true });
		this.zipCodeTxt = this.dialog
			.getByTestId('address-zip-input')
			.getByRole('textbox')
			.filter({ visible: true });
		this.feedbackLbl = this.dialog
			.locator('modus-wc-input-feedback span')
			.filter({ visible: true });
		this.backBtn = this.dialog
			.getByTestId('assign-organization-modal-create-back-button')
			.getByRole('button', { name: 'Back', exact: true });
		this.submitBtn = this.dialog
			.getByTestId('assign-organization-modal-create-submit-button')
			.getByRole('button', { name: /^(Create Organization Draft|Next: Location Info)$/ });
	}

	static async init(page: Page): Promise<AssignOrgToCustomerModal> {
		const createOrganizationModal = new AssignOrgToCustomerModal(page);
		await expect(createOrganizationModal.dialog).toBeVisible();
		return createOrganizationModal;
	}

	async assertBasicFields(): Promise<void> {
		await super.assertBasicFields();
		await expect(this.title).toBeVisible();
		await expect(this.subtitle).toBeVisible();
		await expect(this.consentAlert).toBeVisible();
		await expect(this.customerCard).toBeVisible();
		await expect(this.organizationNameTxt).toBeVisible();
		await expect(this.organizationEmailTxt).toBeVisible();
		await expect(this.dialog
			.getByTestId('organization-phone-number-input-country')
			.filter({ visible: true })).toBeVisible();
		await expect(this.phoneNumberTxt).toBeVisible();
		await expect(this.websiteTxt).toBeVisible();
		await expect(this.industryCmb).toBeVisible();
		await expect(this.countryCmb).toBeVisible();
		await expect(this.streetAddressTxt).toBeVisible();
		await expect(this.streetAddressLineTwoTxt).toBeVisible();
		await expect(this.cityTxt).toBeVisible();
		await expect(this.stateCmb).toBeVisible();
		await expect(this.zipCodeTxt).toBeVisible();
		await expect(this.backBtn).toBeVisible();
		await expect(this.submitBtn).toBeVisible();
	}

	async Back(): Promise<OrganizationListPage> {
		await this.backBtn.click();
		await expect(this.dialog).toBeHidden();
		const { OrganizationListPage } = await import("../customer/OrganizationListPage");
		return OrganizationListPage.init(this.page);
	}

	async EnterOrganizationDetails(
		organizationName: string,
		country: string,
		streetAddress: string,
		city: string,
		region: string,
		zipCode: string,
		options?: {
			email?: string;
			website?: string;
			industry?: string;
			phoneNumber?: string;
			streetAddressLineTwo?: string;
		},
	): Promise<void> {
		await this.organizationNameTxt.fill(organizationName);
		if (options?.email !== undefined) {
			await this.organizationEmailTxt.fill(options.email);
		}
		if (options?.phoneNumber !== undefined) {
			await this.phoneNumberTxt.click();
			await this.page.keyboard.type(options.phoneNumber, { delay: 100 });
		}
		if (options?.website !== undefined) {
			await this.websiteTxt.fill(options.website);
		}
		if (options?.industry !== undefined) {
			await this.industryCmb.selectOption({ label: options.industry });
		}
		await this.countryCmb.selectOption({ label: country });
		await this.streetAddressSearch.Search(streetAddress);
		if (options?.streetAddressLineTwo !== undefined) {
			await this.streetAddressLineTwoTxt.fill(options.streetAddressLineTwo);
		}
		await this.cityTxt.fill(city);
		await this.stateCmb.selectOption({ label: region });
		await this.zipCodeTxt.fill(zipCode);
	}

	async CreateOrganizationDraft(): Promise<OrganizationListPage> {
		await this.submitBtn.click();
		await expect(this.dialog).toBeHidden();
		const { OrganizationListPage } = await import("../customer/OrganizationListPage");
		return OrganizationListPage.init(this.page);
	}

	async CreateOrganizationDraftAddressMatch(): Promise<AddressMatchModal> {
		await this.submitBtn.click();
		return AddressMatchModal.init(this.page);
	}

	async AssertCustomerCardDetails(companyName: string, ownerEmail: string): Promise<void> {
		await expect.soft(this.customerCard.locator('p').filter({ hasText: companyName }))
			.toHaveText(companyName);
		await expect.soft(this.customerCard.locator('h6').filter({ hasText: ownerEmail }))
			.toHaveText(ownerEmail);
	}

	/** Selected option label; use instead of toHaveText on the combobox (which includes all options). */
	SelectedOption(combobox: Locator): Locator {
		return combobox.locator('option:checked');
	}
}
