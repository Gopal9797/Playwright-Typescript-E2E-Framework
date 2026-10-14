import { expect, Locator, Page } from "@playwright/test";
import testdata from './testdata.json';

export class ProductsPage {
    readonly page: Page;
    readonly cartIsEmptyText: Locator;
    // readonly NothingInYourCartText: Locator;
    // readonly LetsAddSomeProductsText: Locator;
    readonly productsCheckBoxes: Locator;
    readonly quantityInputBox: Locator;
    readonly selectedProductsCheckBoxes: Locator;
    readonly productsName: Locator;
    readonly productsSKU: Locator;
    readonly generatePricingButton: Locator;
    readonly generatePricingButtonInAddonDialog: Locator;
    readonly generatePricingDraftConfirmationYesButton: Locator;
    readonly listPrices: Locator;
    readonly searchProductsTextBox: Locator;
    readonly clearSearchButton: Locator;
    readonly backToTermsPage: Locator;
    readonly cancelButton: Locator;
    readonly catalystFamilyButton: Locator;
    readonly trimbleAccessFamilyButton: Locator;
    readonly trimbleBusinessCenterFamilyButton: Locator;
    readonly noResultsText: Locator;
    readonly selectAllProductsCheckBoxes: Locator;
    readonly removeFromCartButton: Locator;
    readonly incrementButton: Locator;
    readonly decrementButton: Locator;
    readonly licenseQuantity: Locator;
    readonly listPriceMonthlyText: Locator;
    readonly listPriceYearlyText: Locator;
    readonly listPricefirstProduct: Locator;
    readonly addUnSelectedProductsCheckBoxes: Locator;

    //Add-seats in create amendment screen locators
    readonly addproductsSelectAllCheckbox: Locator;
    readonly addproductsUnselectAllCheckbox: Locator;
    readonly selectRowCheckbox: Locator;
    readonly unselectRowCheckbox: Locator;
    readonly addProductSearchBox: Locator;
    readonly addProductCloseButton: Locator;
    readonly addProductsproductNameText: Locator;
    readonly addProductsScreenTypeColumnText: Locator;
    readonly addProductsScreenQuantityColumnText: Locator;
    readonly productListRowsInAddProduct: Locator;
    readonly addProductSubmitButton: Locator;
    readonly Catalyst60CheckBox: Locator;
    readonly catalyst60Name: Locator;
    readonly catalyst60SKU: Locator;
    readonly catalyst60Price: Locator;
    readonly firstProductCheckbox: Locator;
    readonly firstProductName: Locator;
    readonly firstProductSKU: Locator;
    readonly firstProductPrice: Locator;

    //bundles
    readonly bundleText: Locator;
    readonly expandIconBundle: Locator;
    readonly collapseIconBundle: Locator;

    //packages
    readonly packageText: Locator;
    readonly expandIconPackage: Locator;
    readonly collapseIconPackage: Locator;
    readonly expandIconPackageText: Locator;
    readonly expandIconPackageSubscriptionText: Locator;

    //baseAddons
    readonly cancelButtonInAddonDialog: Locator;
    readonly warningOkayButtonInAddonDialog: Locator;
    readonly missingBaseProductWarningText: Locator;
    readonly missingBaseProductWarningTextInAddonDialog: Locator;
    readonly showAddOnProductsMissingBaseProductsText: Locator;
    readonly unsupportedAddOnProductsText: Locator;
    readonly oneAddOnsText: Locator;
    readonly cancelButtonInAddonDialogText: Locator;
    readonly warningOkayButtonInAddonDialogText: Locator;
    readonly removingBaseProductsText: Locator;
    readonly removingBaseProductsWarningText: Locator;
    readonly removingBaseProductsWarningTextInAddonDialog: Locator;
    readonly baseProductsRemovedText: Locator;
    readonly oneBasesText: Locator;
    readonly addonProductsMissingCompatibleBaseProductsText: Locator;
    readonly disabledCheckboxInAddProduct: Locator;
    readonly viewDetailsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartIsEmptyText = page.getByText('Your cart is empty.', { exact: true });
        // this.NothingInYourCartText = page.getByText('There is nothing in your cart.', { exact: true });
        // this.LetsAddSomeProductsText = page.getByText('add some products');
        this.productsCheckBoxes = page.locator('div[data-field="__check__"]');
        this.quantityInputBox = page.locator('input[aria-label="quantity input" i]');
        this.selectedProductsCheckBoxes = page.getByRole('checkbox', { name: 'Unselect row', exact: true });
        this.productsName = page.getByTestId('product-description');
        this.productsSKU = page.getByTestId('product-sku-id');
        this.listPrices = page.locator('[data-field="listPrice"][role="gridcell"]');
        this.generatePricingButton = page.getByRole('button', { name: 'Generate Pricing' });
        this.generatePricingButtonInAddonDialog = page.getByTestId('warning-okay-button');
        this.searchProductsTextBox = page.getByPlaceholder('Search for a product, SKU');
        this.clearSearchButton = page.locator('[aria-label="Clear search"]');
        this.backToTermsPage = page.getByRole('button', { name: 'Back to Terms' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' }).last();
        this.catalystFamilyButton = page.locator('xpath=//span[contains(text(),"Catalyst")]/following-sibling::*[1]');
        this.trimbleAccessFamilyButton = page.locator('xpath=//span[contains(text(),"Trimble Access")]/following-sibling::*[1]');
        this.trimbleBusinessCenterFamilyButton = page.locator('xpath=//span[contains(text(),"Trimble Business Center")]/following-sibling::*[1]');
        this.noResultsText = page.getByText('No results found.');
        this.selectAllProductsCheckBoxes = page.getByRole('checkbox', { name: 'Select all rows' });
        this.removeFromCartButton = page.getByTestId('remove-item-button');
        this.viewDetailsButton = page.getByTestId('view-details-button');
        this.incrementButton = page.locator('[aria-label="Increment"]');
        this.decrementButton = page.locator('[aria-label="Decrement"]');
        this.licenseQuantity = page.locator('[aria-label="quantity input" i]');
        this.listPriceMonthlyText = page.getByText('List Price Monthly');
        this.listPriceYearlyText = page.getByText('List Price Yearly');
        this.listPricefirstProduct = page.locator('xpath=//*[@class="MuiDataGrid-cell MuiDataGrid-cell--textLeft shaded"]');
        this.addUnSelectedProductsCheckBoxes = page.locator('[type="checkbox"][value="false"]');

        //add-seats in create amendment screen locators
        this.addproductsSelectAllCheckbox = page.getByRole('checkbox', { name: 'Select all rows' });
        this.addproductsUnselectAllCheckbox = page.getByRole('checkbox', { name: 'Unselect all rows' });
        this.selectRowCheckbox = page.getByRole('checkbox', { name: 'Select row' });
        this.unselectRowCheckbox = page.getByRole('checkbox', { name: 'Unselect row' });
        this.addProductSearchBox = page.getByPlaceholder('Search for a product, SKU');
        this.addProductCloseButton = page.getByRole('button', { name: 'Close' });
        this.addProductsproductNameText = page.getByText('Product Name');
        this.addProductsScreenTypeColumnText = page.locator('div').filter({ hasText: /^Type$/ }).nth(2);
        this.addProductsScreenQuantityColumnText = page.locator('div').filter({ hasText: /^Quantity$/ }).nth(2);
        this.productListRowsInAddProduct = this.page.locator('//div[@data-id]');
        this.addProductSubmitButton = page.getByRole('button', { name: 'Add' });
        this.Catalyst60CheckBox = page.locator('xpath=//div[@data-id="BS-CAT-1M"]/div[@data-field="__check__"]');
        this.catalyst60Name = page.locator('[data-id="BS-CAT-1M"] [data-testid="product-description"]');
        this.catalyst60SKU = page.locator('[data-id="BS-CAT-1M"] [data-testid="product-sku-id"]');
        this.catalyst60Price = page.locator('[data-id="BS-CAT-1M"] [data-field="listPrice"]');
        this.firstProductCheckbox = page.getByRole('checkbox', { name: 'Select row' }).first();
        this.firstProductName = page.locator('[data-testid="product-description"]').nth(0);
        this.firstProductSKU = page.locator('[data-testid="product-sku-id"]').nth(0);
        this.firstProductPrice = page.locator('[data-field="listPrice"][role="gridcell"]').nth(0);
        this.disabledCheckboxInAddProduct = page.locator('.MuiDataGrid-cell > .hydrated > div');

        //bundles
        this.bundleText = page.getByText('Bundle');
        this.expandIconBundle = page.getByRole('button').filter({ hasText: 'expand_more' }).nth(3);
        this.collapseIconBundle = page.getByRole('button').filter({ hasText: 'expand_less' }).nth(0);

        //packages
        this.packageText = page.locator('[data-field="skuTypeName"]').filter({ hasText: 'Package' });
        this.expandIconPackage = page.getByRole('button').filter({ hasText: 'expand_more' }).nth(3);
        this.collapseIconPackage = page.getByRole('button').filter({ hasText: 'expand_less' }).nth(0);
        this.expandIconPackageText = page.getByText('Contents per Package:');
        this.expandIconPackageSubscriptionText = page.getByText('Subscriptions within a package can be assigned separately to a user or a device');

        //baseAddons
        this.cancelButtonInAddonDialog = page.locator('#warning-popup-modal').getByTestId('cancel-button');
        this.warningOkayButtonInAddonDialog = page.locator('#warning-popup-modal').getByTestId('warning-okay-button');
        this.missingBaseProductWarningText = page.getByText('Missing Base Products');
        this.missingBaseProductWarningTextInAddonDialog = page.getByText('You are trying to add an Add-on product without the relevant Base product. Without the Base Product, the software will not work correctly.');
        this.showAddOnProductsMissingBaseProductsText = page.locator('#warning-popup-modal').getByText('The following Add-on product(s) do not have a compatible Base product');
        this.unsupportedAddOnProductsText = page.locator('#warning-popup-modal').getByText('Unsupported Add-on Products');
        this.oneAddOnsText = page.getByText('1 Add-ons');
        this.cancelButtonInAddonDialogText = page.locator('#warning-popup-modal').getByText('Cancel');
        this.warningOkayButtonInAddonDialogText = page.locator('#warning-popup-modal').getByText('Ok, Generate Pricing');
        this.removingBaseProductsText = page.locator('#warning-popup-modal').getByText('Removing Base Products');
        this.removingBaseProductsWarningText = page.locator('#warning-popup-modal').getByText('You are removing a Base product while still keeping its Add-on product in the contract. Without the Base Product, the software will not work correctly.');
        this.removingBaseProductsWarningTextInAddonDialog = page.locator('#warning-popup-modal').getByText('The following are the Base product(s) you are attempting to remove:');
        this.baseProductsRemovedText = page.locator('#warning-popup-modal').getByText('Base Products Removed');
        this.oneBasesText = page.locator('#warning-popup-modal').getByText('1 Bases');
        this.addonProductsMissingCompatibleBaseProductsText = page.locator('#warning-popup-modal').getByText('The following Add-on product(s) do not have a compatible Base product');
        this.unsupportedAddOnProductsText = page.locator('#warning-popup-modal').getByText('Unsupported Add-on Products');
        this.generatePricingDraftConfirmationYesButton = page.getByTestId('create-draft-confirmation-yes').first();
    }

    private initialProductListCount = 0;

    private normalizeSku(rawSku: string): string {
        return rawSku.trim().replace(/\s+/g, '').replace(/_/g, '-').toUpperCase();
    }

    private extractSkuFromText(text: string): string | null {
        const matches = text.match(/[A-Z0-9]+(?:[-_][A-Z0-9]+)+/g);
        if (!matches || matches.length === 0) {
            return null;
        }
        return matches[matches.length - 1].replace(/_/g, '-').trim();
    }

    private addProductModal(): Locator {
        return this.page.getByRole('dialog').filter({
            has: this.page.getByRole('heading', { name: 'Add Product', exact: true }),
        });
    }

    private async waitForAddProductModalReady() {
        const modal = this.addProductModal();
        await expect(modal).toBeVisible({ timeout: 30000 });
        await expect(modal.getByRole('button', { name: 'Close' })).toBeVisible({ timeout: 30000 });
        await expect(modal.getByPlaceholder('Search for a product, SKU')).toBeVisible({ timeout: 30000 });

        const dataRows = modal.locator('//div[@data-id and @role="row"]');
        await expect.poll(async () => await dataRows.count(), {
            timeout: 30000,
            message: 'Add Product modal did not render any product rows in time.',
        }).toBeGreaterThan(0);

        // Soft-wait for checkbox hydration. The grid is virtualized, so the initially mounted rows can all be
        // already-added (disabled) products even when selectable products exist further down or via search —
        // callers scroll or search by SKU afterwards, so do not hard-fail here.
        const selectableCheckboxes = modal.locator('input[aria-label="Select row"]:enabled');
        await expect.poll(async () => await selectableCheckboxes.count(), {
            timeout: 10000,
        }).toBeGreaterThan(0).catch(() => {
            console.log('No enabled Select row checkbox among initially mounted rows; continuing (virtualized grid).');
        });

        // Allow one short tick for virtualization to settle after first row mount.
        await this.page.waitForTimeout(200);
    }

    async productsPageAssertion() {
        // await expect(this.cartIsEmptyText).toBeVisible();
        await expect(this.viewDetailsButton).toBeVisible();
        // await expect(this.NothingInYourCartText).toBeVisible();
        // await expect(this.LetsAddSomeProductsText).toBeVisible();
    }

    async selectFirstProduct(qty: string) {
        await expect(this.selectRowCheckbox.first()).toBeEnabled();
        await this.selectRowCheckbox.first().check();
        await this.quantityInputBox.first().fill(qty);
        await expect(this.generatePricingButton).toBeEnabled();
        var firstProductPrice = await this.firstProductPrice.textContent();
        var firstProductName = await this.firstProductName.textContent();
        var firstProductSKU = await this.firstProductSKU.textContent();
        console.log(`First product price: ${firstProductPrice}`);
        return {
            price: firstProductPrice?.toString().trim(),
            name: firstProductName?.toString().trim(),
            sku: firstProductSKU?.toString().trim()
        };
    }

    async selectFirstUnselectedProduct(qty: string) {
        await expect(this.addUnSelectedProductsCheckBoxes.first()).toBeEnabled();
        await this.page.waitForTimeout(2000);
        await this.addUnSelectedProductsCheckBoxes.first().click();
        await this.quantityInputBox.nth(0).fill(qty);
    }

    async searchProductByName(productName: string) {
        await this.searchProductsTextBox.fill(productName);
        await this.page.waitForTimeout(1000);
        const numberOfProducts = await this.productsName.count();
        if (numberOfProducts === 1)
            await expect(this.productsName).toContainText(productName);
        else {
            for (let i = 0; i < numberOfProducts; i++) {
                await expect(this.productsName.nth(i)).toContainText(productName);
            }
        }
    }
    async searchProductBySKU(productSKU: string) {
        await this.searchProductsTextBox.fill(productSKU);
        await this.page.waitForTimeout(1000);
        const numberOfProducts = await this.productsSKU.count();
        if (numberOfProducts === 1)
            await expect(this.productsSKU).toContainText(productSKU.replaceAll(' ', '-'));
        else {
            for (let i = 0; i < numberOfProducts; i++) {
                await expect(this.productsSKU.nth(i)).toContainText(productSKU.replaceAll(' ', '-'));
            }
        }
    }
    async clearSearch() {
        await this.searchProductsTextBox.fill("Something to be cleared");
        await this.clearSearchButton.click();
        await expect(this.searchProductsTextBox).toBeEmpty();
    }
    async searchWithInvalidProductName(productName: string) {
        await this.searchProductsTextBox.fill(productName);
        await this.page.waitForTimeout(1000);
        await expect(this.productsName).not.toBeVisible();
        await expect(this.productsSKU).not.toBeVisible();
        await expect(this.noResultsText).toBeVisible();
    }

    async filterByCatalystFamily() {
        await this.catalystFamilyButton.click();
        const products = await this.productsName.allTextContents();
        for (const product of products) {
            expect(product.toLowerCase()).toContain('catalyst');
        }
        const productSKUs = await this.productsSKU.allTextContents();
        for (const sku of productSKUs) {
            expect(sku).toContain('BS-CAT');
        }
        await this.catalystFamilyButton.click();
    }

    async filterByTrimbleAccessFamily() {
        await this.trimbleAccessFamilyButton.click();
        const products = await this.productsName.allTextContents();
        for (const product of products) {
            expect(product.toLowerCase()).toContain('trimble access');
        }
        const productSKUs = await this.productsSKU.allTextContents();
        for (const sku of productSKUs) {
            expect(sku).toContain('BS-TA');
        }
        await this.trimbleAccessFamilyButton.click();
    }

    async filterByTrimbleBusinessCenterFamily() {
        await this.trimbleBusinessCenterFamilyButton.click();
        const products = await this.productsName.allTextContents();
        for (const product of products) {
            expect(product.toLowerCase()).toContain('trimble business center');
        }
        const productSKUs = await this.productsSKU.allTextContents();
        for (const sku of productSKUs) {
            expect(sku).toContain('BS-TBC');
        }
        await this.trimbleBusinessCenterFamilyButton.click();
    }

    async selectAllProductsAndValidateCart() {
        await this.page.waitForTimeout(1000);

        const maxProductsToSelect = 5;
        const rowCheckboxes = this.selectRowCheckbox;
        await expect(rowCheckboxes.first()).toBeEnabled();
        const productsToSelect = Math.min(await rowCheckboxes.count(), maxProductsToSelect);

        for (let i = 0; i < productsToSelect; i++) {
            await rowCheckboxes.nth(i).check();
            await expect(this.unselectRowCheckbox.nth(i)).toBeChecked();
            await this.licenseQuantity.nth(i).fill('9');
        }

        const selectedProducts = (await this.productsName.allTextContents()).slice(0, productsToSelect);
        console.log(`Number of products selected: ${productsToSelect}`);
        console.log(`Number of products: ${selectedProducts.length}`);

        await this.viewDetailsButton.first().click();
        const cartRows = this.page.getByTestId('cart-table-row-item');
        await expect(cartRows.first()).toBeVisible();

        for (let i = 0; i < selectedProducts.length; i++) {
            const cartRow = cartRows.nth(i);
            await expect(cartRow).toBeVisible();

            const lineProduct = (await cartRow.locator('td').first().locator('h5').first().textContent())?.trim();
            const lineSKU = (await cartRow.locator('td').first().locator('h6').first().textContent())?.trim();
            const lineQuantity = (await cartRow.locator('td').nth(2).locator('h5').first().textContent())?.trim();

            expect(lineQuantity).toEqual(await this.licenseQuantity.nth(i).inputValue());
            expect(lineProduct).toEqual(selectedProducts[i].trim());
            expect(lineSKU).toEqual((await this.productsSKU.nth(i).textContent())?.trim());
        }
        await this.removeFromCart();
    }

    async removeFromCart() {
        while (await this.removeFromCartButton.count() > 0) {
            await this.removeFromCartButton.first().click();
        }
        // await expect(this.cartIsEmptyText).toBeVisible();
    }

    async incrementLicenseQuantity() {
        await expect(this.selectRowCheckbox.first()).toBeEnabled();
        await this.selectRowCheckbox.first().check();
        for (let i = 1; i < 5; i++)
            await this.incrementButton.first().click();
        const quantity = await this.licenseQuantity.first().inputValue();
        expect(parseInt(quantity)).toEqual(5);
        await this.licenseQuantity.first().fill('1000');
        expect(await this.licenseQuantity.first().inputValue()).toEqual('999');
        await expect(this.incrementButton.first()).toBeDisabled();
        await expect(this.decrementButton.first()).toBeEnabled();
    }

    async decrementLicenseQuantity() {
        await this.licenseQuantity.first().fill('5');
        for (let i = 1; i < 5; i++)
            await this.decrementButton.first().click();
        const quantity = await this.licenseQuantity.first().inputValue();
        expect(parseInt(quantity)).toEqual(1);
        await expect(this.decrementButton.first()).toBeDisabled();
        await expect(this.incrementButton.first()).toBeEnabled();
    }


    async generatePricing() {
        await this.generatePricingButton.click();
        const addonDialogVisible = await this.generatePricingButtonInAddonDialog
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        if (addonDialogVisible) {
            await this.generatePricingButtonInAddonDialog.click();
            console.log("Clicked on Generate Pricing button in Addon Dialog");
            await this.generatePricingButtonInAddonDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
        }
        const draftConfirmationVisible = await this.generatePricingDraftConfirmationYesButton
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        if (draftConfirmationVisible) {
            await this.page.locator('#warning-popup-modal').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
            await this.generatePricingDraftConfirmationYesButton.click();
            console.log("Clicked on Yes button in Generate Pricing Draft Confirmation");
        }
    }

    async generatePricingWithoutAddonDialog() {
        await this.generatePricingButton.click();
    }

    private async clickProductCheckboxByIndexOrLogFailure(index: number, productSKU: string, sourceMethod: string) {
        const rowCheckbox = this.page.getByRole('checkbox', { name: 'Select row' }).nth(index);
        try {
            await rowCheckbox.check();
        } catch (error) {
            const failurePrefix = `[ProductsPage.${sourceMethod}] Failed to click Select row checkbox at index ${index} for productSKU=\"${productSKU}\".`;

            // Log SKU first so CI always has this signal even if timeout blocks extra locator reads.
            console.error(failurePrefix);

            let checkboxCount = -1;
            let normalizedVisibleSkus: string[] = [];

            try {
                checkboxCount = await this.productsCheckBoxes.count();
            } catch (contextError) {
                console.error(`${failurePrefix} Could not read checkbox count: ${String(contextError)}`);
            }

            try {
                const visibleSkus = await this.productsSKU.allTextContents();
                normalizedVisibleSkus = visibleSkus.map(sku => sku.trim()).filter(Boolean);
            } catch (contextError) {
                console.error(`${failurePrefix} Could not read visible SKUs: ${String(contextError)}`);
            }

            console.error(
                `${failurePrefix} ` +
                `Checkbox count: ${checkboxCount}. Visible SKUs: ${normalizedVisibleSkus.length ? normalizedVisibleSkus.join(', ') : 'none'}.`
            );

            throw error;
        }
    }

    async selectProductBySKUAndQuantity(productSKU: string, qty: string) {
        await this.searchProductsTextBox.fill(productSKU);

        // Target the row that actually contains the searched SKU instead of blindly using index 0.
        // While the search filter is still settling, the grid may momentarily show unfiltered
        // results, so index 0 can be a different product entirely.
        const escapedSku = productSKU.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const targetRow = this.page
            .locator('//div[@data-id and @role="row"]')
            .filter({ has: this.page.getByTestId('product-sku-id').filter({ hasText: new RegExp(`^\\s*${escapedSku}\\s*$`) }) })
            .first();

        try {
            await expect(targetRow).toBeVisible({ timeout: 30000 });
            await targetRow.scrollIntoViewIfNeeded();

            // The grid re-renders while search results stream in, which can detach the row
            // mid-action and swallow the check. Retry until the checkbox is actually checked.
            const rowCheckbox = targetRow.getByRole('checkbox', { name: 'Select row' });
            await expect(async () => {
                await rowCheckbox.check({ timeout: 5000 });
            }).toPass({ timeout: 60000 });

            await targetRow.locator('input[aria-label="quantity input" i]').fill(qty);
        } catch (error) {
            const failurePrefix = `[ProductsPage.selectProductBySKUAndQuantity] Failed to select product row for productSKU="${productSKU}".`;
            console.error(failurePrefix);

            let normalizedVisibleSkus: string[] = [];
            try {
                const visibleSkus = await this.productsSKU.allTextContents();
                normalizedVisibleSkus = visibleSkus.map(sku => sku.trim()).filter(Boolean);
            } catch (contextError) {
                console.error(`${failurePrefix} Could not read visible SKUs: ${String(contextError)}`);
            }
            console.error(`${failurePrefix} Visible SKUs: ${normalizedVisibleSkus.length ? normalizedVisibleSkus.join(', ') : 'none'}.`);

            throw error;
        }
    }

    async selectFirstNProductsBySearchTerm(
        searchTerm: string,
        productsToSelectCount: number,
        quantities: string[] = [],
        productType?: string,
        excludedSkus: string[] = []
    ) {
        await this.searchProductsTextBox.fill(searchTerm);
        await this.page.waitForTimeout(1000);

        const quantitiesToApply = quantities.length > 0
            ? quantities
            : Array.from({ length: productsToSelectCount }, () => '1');

        if (quantitiesToApply.length < productsToSelectCount) {
            throw new Error(
                `[ProductsPage.selectFirstNProductsBySearchTerm] Expected ${productsToSelectCount} quantities for search "${searchTerm}", but found ${quantitiesToApply.length}.`
            );
        }

        const excludedSkuSet = new Set(
            excludedSkus
                .map((sku) => this.normalizeSku(sku))
                .filter(Boolean)
        );

        const matchingRows = productType
            ? this.page.locator(`//div[@data-id and @role="row" and .//div[@data-field="skuTypeName" and normalize-space()="${productType}"]]`)
            : this.page.locator('//div[@data-id and @role="row"]');

        const matchingProducts = await matchingRows.count();
        const eligibleRowIndexes: number[] = [];

        for (let i = 0; i < matchingProducts; i++) {
            const row = matchingRows.nth(i);
            const skuFromGrid = (await row.getByTestId('product-sku-id').first().textContent().catch(() => null))?.trim() ?? '';
            const dataId = (await row.getAttribute('data-id'))?.trim() ?? '';
            const fallbackSku = this.extractSkuFromText(dataId) ?? '';
            const normalizedRowSku = this.normalizeSku(skuFromGrid || fallbackSku);

            if (normalizedRowSku && excludedSkuSet.has(normalizedRowSku)) {
                continue;
            }

            eligibleRowIndexes.push(i);
            if (eligibleRowIndexes.length === productsToSelectCount) {
                break;
            }
        }

        if (eligibleRowIndexes.length < productsToSelectCount) {
            const typeContext = productType ? ` with type "${productType}"` : '';
            const excludedContext = excludedSkuSet.size > 0
                ? ` after excluding [${[...excludedSkuSet].join(', ')}]`
                : '';
            throw new Error(
                `[ProductsPage.selectFirstNProductsBySearchTerm] Expected at least ${productsToSelectCount} products for search "${searchTerm}"${typeContext}${excludedContext}, but found ${eligibleRowIndexes.length}.`
            );
        }

        for (const [selectionIndex, rowIndex] of eligibleRowIndexes.entries()) {
            const row = matchingRows.nth(rowIndex);
            const isSelected = (await row.getAttribute('aria-selected')) === 'true';

            if (!isSelected) {
                await row.locator('div[data-field="__check__"]').click();
            }

            const targetQuantityInput = row.locator('input[aria-label="quantity input" i]');
            await expect(targetQuantityInput).toBeVisible({ timeout: 30000 });
            await targetQuantityInput.fill(quantitiesToApply[selectionIndex]);
        }
    }

    //Add-seats in create amendment screen methods

    async selectProductBySKUAndQuantityWithIncrementAndDecrementScenariosCovered(productSKU: string, qty: string) {
        await this.searchProductsTextBox.fill(productSKU);
        await this.page.waitForTimeout(1000);
        await this.clickProductCheckboxByIndexOrLogFailure(0, productSKU, 'selectProductBySKUAndQuantityWithIncrementAndDecrementScenariosCovered');
        await this.decrementLicenseQuantity();
        await this.quantityInputBox.nth(0).fill(qty);
    }

    async clearProductSearch() {
        await this.clearSearchButton.click();
        await expect(this.addProductSearchBox).toHaveValue('');
    }

    async closeButtonInAddproduct() {
        await this.addProductCloseButton.click();
        await expect(this.addProductCloseButton).not.toBeVisible();
    }

    async submitButtonInAddProduct() {
        await expect(this.addProductSubmitButton).toBeEnabled();
        await this.addProductSubmitButton.click();
        //await expect(this.addProductSubmitButton).not.toBeVisible();
    }

    async verifyProductListLoaded() {
        await this.waitForAddProductModalReady();
        const count = await this.addProductModal().locator('//div[@data-id and @role="row"]').count();
        expect(count).toBeGreaterThan(0);
    }

    async verifyAddProductUI() {
        await expect(this.addProductCloseButton).toBeVisible();
        await expect(this.addProductsproductNameText).toBeVisible();
        await expect(this.addProductsScreenTypeColumnText).toBeVisible();
        await expect(this.addProductsScreenQuantityColumnText).toBeVisible();
        await this.verifyProductListLoaded();
        await expect(this.addProductSearchBox).toBeVisible();
    }

    async verifyProductListRestoredAfterClear() {
        const currentCount = await this.productListRowsInAddProduct.count();
        expect(currentCount).toBe(this.initialProductListCount);
    }

    async storeInitialProductListCount() {
        this.initialProductListCount = await this.productListRowsInAddProduct.count();
        expect(this.initialProductListCount).toBeGreaterThan(0);
    }


    async verifySearchedProductDisabled() {
        //const checkbox = this.selectRowCheckbox.first();
        //await expect(this.disabledCheckboxInAddProduct).toBeDisabled();
        const checkbox = this.page.locator("input[type='checkbox']").nth(1);

        await expect(checkbox).toBeDisabled();
    }

    async verifySelectAndUnselectAllFunctionality() {
        await this.selectRowCheckbox.first().check({ timeout: 10000 });
        await this.unselectRowCheckbox.first().uncheck();
        // The Add Product grid does not always render the header select-all checkbox (for example when the
        // search filter leaves a single row), so only verify select/unselect-all when the control is shown.
        const selectAllVisible = await this.addproductsSelectAllCheckbox.isVisible().catch(() => false);
        if (selectAllVisible) {
            await this.addproductsSelectAllCheckbox.check({ timeout: 10000 });
            await expect(this.addproductsUnselectAllCheckbox).toBeVisible();
            // Restore the unselected state so the caller can select the specific row it searched for.
            await this.addproductsUnselectAllCheckbox.uncheck();
        } else {
            console.log('Header select-all checkbox is not rendered for the current filter; skipping select-all verification');
        }
    }

    async getAvailableProducts(_existingProducts: string[] = []): Promise<string[]> {
        await this.waitForAddProductModalReady();

        const existingProducts = new Set(
            _existingProducts
                .map((sku) => this.normalizeSku(sku))
                .filter(Boolean)
        );

        const modal = this.addProductModal();
        // Ignore non-row grid anchors (for example data-id="gridPanelAnchor").
        const productRows = modal.locator('//div[@data-id and @role="row"]');
        const virtualScroller = modal.locator('.MuiDataGrid-virtualScroller').first();

        await expect(virtualScroller).toBeVisible();
        await expect.poll(async () => await productRows.count()).toBeGreaterThan(0);

        const availableProducts = new Set<string>();
        const maxScrollPasses = 80;
        let stalledPasses = 0;

        const collectVisibleRows = async () => {
            const rowCount = await productRows.count();

            for (let i = 0; i < rowCount; i++) {
                const row = productRows.nth(i);

                const isSelected = (await row.getAttribute('aria-selected')) === 'true';
                if (isSelected) {
                    continue;
                }

                const selectableCheckbox = row.locator('input[aria-label="Select row"]');
                if ((await selectableCheckbox.count()) === 0) {
                    continue;
                }

                if (!(await selectableCheckbox.first().isEnabled())) {
                    continue;
                }

                let sku: string | null = null;

                const dataId = (await row.getAttribute('data-id'))?.trim() ?? '';
                sku = this.extractSkuFromText(dataId);

                if (!sku) {
                    const skuFromTestId = (await row.getByTestId('product-sku-id').first().textContent().catch(() => null))?.trim();
                    if (skuFromTestId) {
                        sku = skuFromTestId;
                    }
                }

                if (!sku) {
                    const rowText = (await row.innerText().catch(() => '')).trim();
                    sku = this.extractSkuFromText(rowText);
                }

                if (!sku) {
                    continue;
                }

                const normalizedSku = this.normalizeSku(sku);
                if (!existingProducts.has(normalizedSku)) {
                    availableProducts.add(normalizedSku);
                }
            }
        };

        // Start from top for deterministic scanning across virtualized content.
        await virtualScroller.evaluate((el) => {
            (el as HTMLElement).scrollTop = 0;
        });

        for (let pass = 0; pass < maxScrollPasses; pass++) {
            await collectVisibleRows();

            const metrics = await virtualScroller.evaluate((el) => {
                const node = el as HTMLElement;
                return {
                    scrollTop: node.scrollTop,
                    clientHeight: node.clientHeight,
                    scrollHeight: node.scrollHeight,
                };
            });

            const maxScrollableTop = Math.max(metrics.scrollHeight - metrics.clientHeight, 0);

            if (maxScrollableTop <= 2) {
                break;
            }

            if (metrics.scrollTop >= maxScrollableTop - 2) {
                break;
            }

            const step = Math.max(Math.floor(metrics.clientHeight * 0.75), 220);
            const nextScrollTop = Math.min(metrics.scrollTop + step, maxScrollableTop);
            if (nextScrollTop <= metrics.scrollTop + 1) {
                break;
            }

            await virtualScroller.evaluate((el, top) => {
                const node = el as HTMLElement;
                node.scrollTop = top;
                node.dispatchEvent(new Event('scroll', { bubbles: true }));
            }, nextScrollTop);

            await this.page.waitForTimeout(250);

            let updatedScrollTop = await virtualScroller.evaluate((el) => (el as HTMLElement).scrollTop);

            // Fallback for environments where direct scrollTop assignment doesn't always trigger row virtualization updates.
            if (updatedScrollTop <= metrics.scrollTop + 1) {
                await virtualScroller.hover();
                await this.page.mouse.wheel(0, step);
                await this.page.waitForTimeout(250);
                updatedScrollTop = await virtualScroller.evaluate((el) => (el as HTMLElement).scrollTop);
            }

            if (updatedScrollTop <= metrics.scrollTop + 1) {
                stalledPasses++;
                if (stalledPasses >= 3) {
                    break;
                }
            } else {
                stalledPasses = 0;
            }
        }

        // Restore top so subsequent search interactions start from a stable grid position.
        await virtualScroller.evaluate((el) => {
            (el as HTMLElement).scrollTop = 0;
        });

        return [...availableProducts];
    }


    async pickAndSelectNewProduct(existingProducts: string[]): Promise<string> {

        await this.waitForAddProductModalReady();

        const productData = testdata.find(item => item.allSku);
        const all = productData?.allSku || [];

        const available = all.filter(p => !existingProducts.includes(p));

        if (available.length === 0) {
            throw new Error("All JSON products are already in contract!");
        }

        const product = available[0];

        await this.searchProductBySKU(product);
        await this.selectRowCheckbox.check();

        return product;
    }

    async productsPageAssertionMonthly() {
        await expect(this.listPriceMonthlyText).toBeVisible();
    }

    async getCatalyst60PriceMonthly() {
        await this.searchProductsTextBox.fill('Catalyst 60');
        await this.page.waitForTimeout(1000);
        await expect(this.productsName.first()).toContainText('Catalyst 60');// Verify Catalyst 60 is found
        // Get monthly price 
        const listPricefirstProductMonthly = await this.listPricefirstProduct.textContent();
        console.log(`Catalyst 60 Monthly Price: ${listPricefirstProductMonthly}`);
        return listPricefirstProductMonthly;
    }

    async getCatalyst60PriceYearly() {
        await this.searchProductsTextBox.fill('Catalyst 60');
        await this.page.waitForTimeout(1000);
        await expect(this.productsName.first()).toContainText('Catalyst 60');// Verify Catalyst 60 is found
        // Get yearly price
        const listPricefirstProductYearly = await this.listPricefirstProduct.textContent();
        console.log(`Catalyst 60 Yearly Price: ${listPricefirstProductYearly}`);
        return listPricefirstProductYearly;
    }

    async productDetailsPageAssertionForBundle() {
        await expect(this.bundleText).toBeVisible();
    }

    async expandAndCollapseBundleAndValidateProductsInBundle() {
        await this.expandIconBundle.click();
        await expect(this.page.getByText(/Contents per Bundle:/)).toBeVisible();
        await expect(this.page.getByText(/Subscriptions within a bundle are assigned together to a single user or device/)).toBeVisible();
        await this.collapseIconBundle.click();
        await expect(this.page.getByText(/Contents per Bundle:/)).not.toBeVisible();
        await expect(this.page.getByText(/Subscriptions within a bundle are assigned together to a single user or device/)).not.toBeVisible();
    }

    async assertMissingBaseProductWarning() {
        await expect(this.missingBaseProductWarningText).toBeVisible();
        await expect(this.missingBaseProductWarningTextInAddonDialog).toBeVisible();
        await expect(this.showAddOnProductsMissingBaseProductsText).toBeVisible();
        await expect(this.unsupportedAddOnProductsText).toBeVisible();
        await expect(this.oneAddOnsText).toBeVisible();
        await expect(this.cancelButtonInAddonDialogText).toBeVisible();
        await expect(this.warningOkayButtonInAddonDialogText).toBeVisible();
    }

    async assertRemovingBaseProductWarning() {
        await expect(this.removingBaseProductsText).toBeVisible();
        await expect(this.removingBaseProductsWarningText).toBeVisible();
        await expect(this.removingBaseProductsWarningTextInAddonDialog).toBeVisible();
        await expect(this.baseProductsRemovedText).toBeVisible();
        await expect(this.oneBasesText).toBeVisible();
        await expect(this.addonProductsMissingCompatibleBaseProductsText).toBeVisible();
        await expect(this.unsupportedAddOnProductsText).toBeVisible();
        await expect(this.cancelButtonInAddonDialogText).toBeVisible();
        await expect(this.warningOkayButtonInAddonDialogText).toBeVisible();
    }

    async generatePricingInAddonDialog() {
        await this.generatePricingButtonInAddonDialog.click();
    }

    async missingBaseProductWarningNotToBeVisible() {
        await expect(this.missingBaseProductWarningText).not.toBeVisible();
    }

    async clickWarningOkayButtonInAddonDialog() {
        await this.warningOkayButtonInAddonDialog.click();
    }

    async productDetailsPageAssertionForPackage() {
        await expect(this.packageText).toBeVisible();
    }

    async expandAndCollapsePackageAndValidateProductsInPackage() {
        await this.expandIconPackage.click();
        await expect(this.expandIconPackageText).toBeVisible();
        await expect(this.expandIconPackageSubscriptionText).toBeVisible();
        await this.collapseIconPackage.click();
        await expect(this.expandIconPackageText).not.toBeVisible();
        await expect(this.expandIconPackageSubscriptionText).not.toBeVisible();
    }

}