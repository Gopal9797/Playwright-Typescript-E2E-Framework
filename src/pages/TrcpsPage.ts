import { expect, Locator, Page } from "@playwright/test";

export class TrcpsPage {
    readonly page: Page;

    static readonly PRODUCT_NAME = 'Trimble Reality Capture Platform Service - 200GB Subscription';
    static readonly SKU = 'BS-SB-SCAN-200GB';
    static readonly STORAGE_PER_UNIT_GB = 200;
    static readonly MAX_QUANTITY = 999;

    readonly searchProductsTextBox: Locator;

    constructor(page: Page) {
        this.page = page;
        // Same placeholder is used on the contract creation products page,
        // the amendment Add Product modal and the edit renewal Add Product modal.
        this.searchProductsTextBox = page.getByPlaceholder('Search for a product, SKU');
    }

    /**
     * Grid row for the TRCPS product. The contract creation products grid and the
     * Add Product modals (amendment / edit renewal) share the same MUI data grid structure.
     */
    private trcpsRow(): Locator {
        const escapedSku = TrcpsPage.SKU.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this.page
            .locator('//div[@data-id and @role="row"]')
            .filter({ has: this.page.getByTestId('product-sku-id').filter({ hasText: new RegExp(`^\\s*${escapedSku}\\s*$`) }) })
            .first();
    }

    private quantityInput(): Locator {
        return this.trcpsRow().locator('input[aria-label="quantity input" i]');
    }

    /**
     * Storage value text for a given quantity, e.g. quantity 2 -> /400\s*GB\s*\(200GB\s*x\s*2\)/.
     * Matches the value portion only, so it works with the "Storage:", "Storage" and
     * "Add storage:" prefixes used on the different screens.
     */
    expectedStorageText(quantity: number): RegExp {
        const totalStorageGB = quantity * TrcpsPage.STORAGE_PER_UNIT_GB;
        return new RegExp(`${totalStorageGB}\\s*GB\\s*\\(\\s*${TrcpsPage.STORAGE_PER_UNIT_GB}GB\\s*x\\s*${quantity}\\s*\\)`, 'i');
    }

    /**
     * Reusable storage assertion for any screen (products grid, contract summary,
     * amendment summary additional products, edit renewal subscription card, renewal summary).
     */
    async verifyStorageDisplayed(quantity: number, timeout = 30000) {
        await expect(this.page.getByText(this.expectedStorageText(quantity)).filter({ visible: true }).first()).toBeVisible({ timeout });
    }

    /** Storage assertion scoped to the TRCPS row of the products grid / Add Product modal. */
    async verifyStorageForQuantityInProductRow(quantity: number, timeout = 15000) {
        await expect(this.trcpsRow().getByText(this.expectedStorageText(quantity)).first()).toBeVisible({ timeout });
    }

    /**
     * Searches the TRCPS product by SKU, selects its row and fills the quantity.
     * Works on the contract creation products page and inside the Add Product modals.
     */
    async searchAndSelectTrcpsProduct(quantity: string) {
        await this.searchProductsTextBox.fill(TrcpsPage.SKU);

        const targetRow = this.trcpsRow();
        await expect(targetRow).toBeVisible({ timeout: 30000 });
        await targetRow.scrollIntoViewIfNeeded();

        // The grid re-renders while search results stream in, which can detach the row
        // mid-action and swallow the check. Retry until the checkbox is actually checked.
        const rowCheckbox = targetRow.getByRole('checkbox', { name: 'Select row' });
        await expect(async () => {
            await rowCheckbox.check({ timeout: 5000 });
        }).toPass({ timeout: 60000 });

        await this.setQuantity(quantity);
    }

    async setQuantity(quantity: string) {
        const quantityInput = this.quantityInput();
        await expect(quantityInput).toBeVisible({ timeout: 30000 });
        await quantityInput.fill(quantity);
    }

    async verifyQuantityValue(expectedQuantity: string) {
        await expect(this.quantityInput()).toHaveValue(expectedQuantity);
    }

    /**
     * Entering a quantity above the maximum (999) is clamped to 999 and the
     * storage caption reflects the clamped quantity (999 x 200GB = 199800GB).
     */
    async verifyMaxQuantityIsCappedAt999() {
        await this.setQuantity((TrcpsPage.MAX_QUANTITY + 1).toString());
        await this.verifyQuantityValue(TrcpsPage.MAX_QUANTITY.toString());
        await this.verifyStorageForQuantityInProductRow(TrcpsPage.MAX_QUANTITY);
    }
}
