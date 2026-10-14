import { expect, Locator, Page } from "@playwright/test";
import { BaseModal } from "./BaseDialog";
import { ShipToContactInfoPage } from "../customer/ShipToContactInfoPage";

export class AddressMatchModal extends BaseModal {
	readonly title: Locator;
	readonly enteredAddressLabel: Locator;
	readonly recommendedAddressLabel: Locator;
	readonly enteredAddress: Locator;
	readonly recommendedAddress: Locator;
	readonly useAddressEnteredBtn: Locator;
	readonly useRecommendedAddressBtn: Locator;

	constructor(page: Page) {
		const title = page.locator('[slot="header"]').filter({ hasText: /^It looks like we found a match!$/ });
		const dialog = page.locator('.modus-wc-modal-box').filter({ has: title });
		super(page, dialog);
		this.title = title;
		this.enteredAddressLabel = dialog.locator('modus-wc-typography').filter({ hasText: /^You entered$/ });
		this.recommendedAddressLabel = dialog.locator('modus-wc-typography').filter({ hasText: /^We recommend$/ });
		this.enteredAddress = this.enteredAddressLabel.locator('..').locator('article .modus-wc-card-title');
		this.recommendedAddress = this.recommendedAddressLabel.locator('..').locator('article .modus-wc-card-title');
		this.useAddressEnteredBtn = dialog
			.getByTestId('use-current-address-button')
			.getByRole('button', { name: 'Use The Address Entered', exact: true });
		this.useRecommendedAddressBtn = dialog
			.getByTestId('accept-matched-address-button')
			.getByRole('button', { name: 'Use The Recommended Address', exact: true });
	}

	static async init(page: Page): Promise<AddressMatchModal> {
		const addressMatchDialog = new AddressMatchModal(page);
		await expect(addressMatchDialog.dialog).toBeVisible();
		return addressMatchDialog;
	}

	async assertBasicFields(): Promise<void> {
		await super.assertBasicFields();
		await expect(this.title).toBeVisible();
		await expect(this.enteredAddressLabel).toBeVisible();
		await expect(this.recommendedAddressLabel).toBeVisible();
		await expect(this.enteredAddress).toBeVisible();
		await expect(this.enteredAddress).toHaveText(/\S/);
		await expect(this.recommendedAddress).toBeVisible();
		await expect(this.recommendedAddress).toHaveText(/\S/);
		await expect(this.useAddressEnteredBtn).toBeVisible();
		await expect(this.useRecommendedAddressBtn).toBeVisible();
	}

	async UseAddressEntered(): Promise<void> {
		await this.useAddressEnteredBtn.click();
		await expect(this.dialog).toBeHidden();
	}

	async UseRecommendedAddress(): Promise<ShipToContactInfoPage> {
		await this.useRecommendedAddressBtn.click();
		await expect(this.dialog).toBeHidden();
		return ShipToContactInfoPage.init(this.page);
	}
}
