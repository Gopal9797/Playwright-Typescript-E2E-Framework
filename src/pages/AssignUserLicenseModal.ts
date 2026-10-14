import { expect, Locator, Page } from "@playwright/test";

/** "Assign New License" wizard opened from a customer's Account Members row. */
export class AssignUserLicenseModal {
    readonly page: Page;
    readonly dialog: Locator;
    readonly reviewDialog: Locator;
    readonly viewSelectionButton: Locator;
    readonly assignLicensesButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.locator('dialog#assign-subscription-user-modal');
        this.reviewDialog = page.locator('dialog#assign-subscription-user-review-modal');
        this.viewSelectionButton = this.dialog.getByRole('button', { name: 'View Selection' });
        this.assignLicensesButton = this.reviewDialog.getByRole('button', { name: 'Assign Licenses', exact: true });
    }

    private productArticle(sku: string): Locator {
        return this.dialog.getByText(sku, { exact: true }).locator('xpath=ancestor::article[1]');
    }

    async selectProductAndContract(sku: string) {
        const productArticle = this.productArticle(sku);
        await productArticle.getByRole('checkbox').check();

        const contractCombobox = productArticle.getByRole('combobox');
        await expect(contractCombobox).toBeVisible();
        await contractCombobox.click();
        await this.dialog.getByRole('option').first().click();
    }

    async clickViewSelection() {
        await expect(this.viewSelectionButton).toBeEnabled();
        await this.viewSelectionButton.click();
        await expect(this.reviewDialog).toBeVisible();
    }

    async assignLicenses() {
        await expect(this.assignLicensesButton).toBeEnabled();
        await this.assignLicensesButton.click();
        await expect(this.reviewDialog).toBeHidden();
    }
}
