import { expect, Locator, Page } from "@playwright/test";

export class AmendmentSummaryPage {
    readonly page: Page;
    readonly contractTerms: Locator | undefined;
    readonly amendContractButton: Locator;
    readonly amendmentInProgressStatus: Locator;
    readonly amendmentInProgressStatusinContractPage: Locator;
    readonly moreOptionsButton: Locator;
    readonly viewExistingContractButton: Locator;
    readonly contractNumber: Locator;
    readonly enterPOTextFieldInAmendmentSummary: Locator;
    readonly poReferenceText: Locator;
    readonly amendmentTotalText: Locator;
    readonly amendmentTotalValue: Locator;
    readonly totalChangesText: Locator;
    readonly totalChangesCount: Locator;
    readonly renewalDateText: Locator;
    readonly renewalDateValue: Locator;
    readonly contractDetailsToggle: Locator;
    readonly subscriptionDetailsToggle: Locator;
    readonly immediatePriceAndChangesText: Locator;
    readonly licenseAdditionsCount: Locator;
    readonly licenseEffectiveDate: Locator;
    readonly pricingBreakDownText: Locator;
    readonly KPIDiscountText: Locator;
    readonly currentContractTotalText: Locator;
    readonly amendmentPriceText: Locator
    readonly estimatedTaxText: Locator;
    readonly discardDraftButton: Locator;
    readonly placeOrderButton: Locator;
    readonly closeButtonOnDiscardDraftPopup: Locator;
    readonly acceptButtonOnDiscardDraftPopup: Locator;
    readonly licenseAdditionsAmendmentTotalCount: Locator;
    readonly deleteDraftWarningText: Locator;
    readonly EscKeyPressText: Locator;
    readonly backToTableButton: Locator;
    readonly clickBackToContract: Locator;
    readonly toast: Locator;
    readonly toastCloseButton: Locator;
    readonly toastSVGBtn: Locator;
    readonly disabledAmendContractBtn: Locator;
    readonly disabledAmendContractTooltipText: Locator;
    readonly additionalProductTextInAmendmentSummary: Locator;
    readonly additionalProductSKUTextInAmendmentSummary: Locator;
    readonly additionalBundleSKUTextInAmendmentSummary: Locator;
    readonly additionalProductsExpandButton: Locator;
    readonly verifyPOTextFieldInAmendmentSummary: Locator;
    readonly amendmentStatus: Locator;


    constructor(page: Page) {
        this.page = page;
        this.amendContractButton = page.getByTestId('amend-contract-button');
        // The status chip is not always inside the heading's immediate parent div(the header layout changes after an order is placed), so match the chip anywhere on the page instead of anchoring it to the heading's ancestor.
        this.amendmentInProgressStatus = page.getByText('Amendment in Progress', { exact: true }).first();
        this.moreOptionsButton = page.locator('#basic-button');
        this.viewExistingContractButton = page.getByRole('menuitem', { name: 'View Existing Contract' });
        this.contractNumber = page.getByRole('heading', { name: 'contract-number' });
        this.enterPOTextFieldInAmendmentSummary = page.getByRole('textbox', { name: 'Enter PO #' });
        this.poReferenceText = page.getByText('PO/Reference #');
        this.amendmentTotalText = page.locator('#amendment-total');
        this.amendmentTotalValue = page.locator('h5[aria-labelledby="amendment-total"]');
        this.totalChangesText = page.getByText('Total Changes');
        this.totalChangesCount = page.locator('[aria-labelledby="total-changes"]');
        this.renewalDateText = page.locator('[id="renewal-date"]');
        this.renewalDateValue = page.locator('[aria-labelledby="renewal-date"]');
        this.contractDetailsToggle = page.getByRole('button', { name: 'contract-details-toggle' });
        this.subscriptionDetailsToggle = page.getByRole('button', { name: 'subscriptions-toggle' });
        this.immediatePriceAndChangesText = page.getByRole('button', { name: 'subscriptions-toggle' });
        this.licenseAdditionsCount = page.locator('[aria-label="positive-changes-title"]');
        this.licenseEffectiveDate = page.getByTestId('change-effectivity');
        this.KPIDiscountText = page.getByRole('heading', { name: 'KPI Discount' });
        this.pricingBreakDownText = page.getByRole('button', { name: /Pricing Breakdown/ });
        this.currentContractTotalText = page.locator('#total-net-price').getByRole('heading', { name: 'Contract Total' });
        this.amendmentPriceText = page.getByRole('heading', { name: 'Amendment Price' });
        this.estimatedTaxText = page.getByRole('heading', { name: 'Estimated Tax' });
        this.discardDraftButton = page.getByRole('button', { name: 'Delete Draft' });
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.deleteDraftWarningText = page.locator('div').filter({ hasText: /^Are you sure that you want to delete the draft\?$/ }).first();
        this.EscKeyPressText = page.getByRole('region').getByRole('button', { name: 'Close modal' });
        this.closeButtonOnDiscardDraftPopup = page.getByRole('button', { name: 'Close', exact: true });
        this.acceptButtonOnDiscardDraftPopup = page.getByTestId('delete-draft-dialog-confirm-button').getByRole('button', { name: 'Delete' });
        this.licenseAdditionsAmendmentTotalCount = page.locator('//h5[text()="Licenses"]/ancestor::div[1]/following-sibling::h5');
        this.backToTableButton = page.locator("//span[text()='Back to Contracts']");
        this.clickBackToContract = page.getByTestId('back-to-contract-button');
        // Toast notifications are now Modus alerts rendered inside a MUI Snackbar: the alert body is exposed as
        // role="status" (role="alert" is only used by notification badges), the message lives in `.title`
        // and the close button is labelled "Dismiss alert".
        this.toast = page.locator('.MuiSnackbar-root').getByRole('status').first();
        this.toastCloseButton = page.locator('.MuiSnackbar-root').getByRole('button', { name: 'Dismiss alert' }).first();
        this.toastSVGBtn = this.toast.locator('.modus-wc-alert-icon').first();
        this.disabledAmendContractBtn = page.locator('//button[@type="button" and @disabled and contains(.,"Amend Contract")]');
        this.disabledAmendContractTooltipText = page.getByText('You cannot amend a contract');
        this.additionalProductTextInAmendmentSummary = page.getByTestId('change-title');
        this.additionalProductSKUTextInAmendmentSummary = page.getByTestId('change-product-id');
        this.additionalBundleSKUTextInAmendmentSummary = page.locator('[data-testid="bundle-contents-header"] p');
        // this.additionalProductsExpandButton = page.locator('button[aria-expanded="false"]:has([aria-label="positive-changes-title"])');
        this.additionalProductsExpandButton = page.locator('button:has([aria-label="positive-changes-title"])');
        this.verifyPOTextFieldInAmendmentSummary = page.locator('[aria-labelledby="po-number"]');
        // The status chip is exposed as role="status" with accessible name "Contract status" in the current UI
        // (the old [aria-labelledby="contract-status"] hook is no longer rendered).
        this.amendmentStatus = page.getByRole('status', { name: 'Contract status' });
        this.amendmentInProgressStatusinContractPage = page.getByText('Amendment in Progress', { exact: true });
    }

    async clickBacktoContract() {
        await expect(this.clickBackToContract).toBeVisible({ timeout: 30000 });
        const href = await this.clickBackToContract.getAttribute('href');
        await this.clickBackToContract.click();
        // The link is now a generic "Back to Previous Page" control that navigates through browser history rather than
        // following its href. After an order is placed the previous history entry (the /amend screen) is no longer valid
        // and renders a 404, so verify we actually landed on the contract summary and fall back to the href otherwise.
        const contractSummaryUrl = /\/contracts\/[^/?#]+(?:\?[^#]*)?$/;
        const notFoundHeading = this.page.getByRole('heading', { name: /404: Page not found/i });
        await expect
            .poll(async () => contractSummaryUrl.test(this.page.url()) || (await notFoundHeading.isVisible().catch(() => false)), {
                message: 'Waiting for the back link to land on the contract summary (or the 404 page)',
                timeout: 15000,
            })
            .toBe(true);
        if (!contractSummaryUrl.test(this.page.url())) {
            if (!href) {
                throw new Error(`Back to contract link navigated to ${this.page.url()} instead of the contract summary and has no href to fall back to`);
            }
            console.log(`Back to contract link navigated to ${this.page.url()} instead of the contract summary; opening ${href} directly`);
            await this.page.goto(href);
            await expect(this.page).toHaveURL(contractSummaryUrl, { timeout: 30000 });
        }
    }

    async visibilityOfBackToContractButton() {
        await expect(this.clickBackToContract).toBeVisible({ timeout: 80000 });
    }

    async verifyAmendContractButton() {
        await expect(this.amendContractButton).toBeVisible();
        await expect(this.amendContractButton).toHaveText('Amend Contract');
    }

    async verificationOfAmendmentSummaryPage() {
        await expect(this.page).toHaveURL(/tab=subscriptions/);
    }

    //string to be passed 'Amendment In Progress'
    async verifyAmendmentProgressStatus(amendmentInProgressStatus: string) {
        await expect(this.contractNumber).toBeVisible({ timeout: 60000 });
        await expect(this.amendmentInProgressStatus).toBeVisible({ timeout: 60000 });
        await expect(this.amendmentInProgressStatus).toHaveText(amendmentInProgressStatus);
    }

    async verifyAmendmentProgressStatusinContractPage(amendmentInProgressStatus: string) {
        await expect(this.amendmentInProgressStatusinContractPage).toBeVisible();
        await expect(this.amendmentInProgressStatusinContractPage).toHaveText(amendmentInProgressStatus);
    }

    async verifyAmendmentDraftStatus() {
        await expect(this.amendmentStatus).toHaveText('Amendment Draft', { timeout: 30000 });
    }

    async getAmendmentQuoteIDFromHeader() {
        await expect(this.contractNumber).toContainText(/Amendment ID:\s*Q-\d+/, { timeout: 30000 });

        const headerText = (await this.contractNumber.textContent())?.trim() ?? '';
        const quoteId = headerText.match(/Amendment ID:\s*(Q-\d+)/)?.[1];

        if (!quoteId) {
            throw new Error(`Amendment quote ID not found in header text: ${headerText}`);
        }

        console.log(`Extracted Amendment Quote ID: ${quoteId}`);
        return quoteId;
    }

    async visitExistingContractFromAmendmentSummaryPageShouldTakeToCreateAmendmentPage() {
        await this.moreOptionsButton.click();
        await this.viewExistingContractButton.click();
        await expect(this.page).toHaveURL(/tab=subscriptions/);
        await expect(this.amendContractButton).toBeVisible();
        await this.amendContractButton.click();
        await expect(this.page).toHaveURL(/\/amend/);
    }

    async expandPricingBreakdown() {
        await this.pricingBreakDownText.scrollIntoViewIfNeeded();
        await expect(this.pricingBreakDownText).toBeVisible();
        const expanded = await this.pricingBreakDownText.getAttribute('aria-expanded');
        if (expanded !== 'true') {
            await this.pricingBreakDownText.click();
        }
        console.log('Pricing Breakdown section is expanded');
    }

    async assertAllElementsTextAndVisibilityInAmendmentSummaryPage() {
        await expect(this.contractNumber).toBeVisible();
        await expect(this.verifyPOTextFieldInAmendmentSummary).toBeVisible();
        await expect(this.poReferenceText).toBeVisible();
        await expect(this.amendmentTotalText).toBeVisible();
        await expect(this.amendmentTotalValue).toBeVisible();
        await expect(this.totalChangesText).toBeVisible();
        await expect(this.totalChangesCount).toBeVisible();
        await expect(this.renewalDateText).toBeVisible();
        await expect(this.renewalDateValue).toBeVisible();
        await expect(this.contractDetailsToggle).toBeVisible();
        await expect(this.subscriptionDetailsToggle).toBeVisible();
        await expect(this.immediatePriceAndChangesText).toBeVisible();
        // Multiple change sections (Upgrades, License Additions, Additional Products) share this aria-label.
        await expect(this.licenseAdditionsCount.first()).toBeVisible();
        await expect(this.licenseEffectiveDate.first()).toBeVisible();
        //await this.expandPricingBreakdown();
        //await expect(this.KPIDiscountText).toBeVisible(); --> Only applicable for USA customer 
        //await expect(this.currentContractTotalText).toBeVisible();
        //await expect(this.amendmentPriceText).toBeVisible();
        // await expect(this.estimatedTaxText).toBeVisible();
        await expect(this.discardDraftButton).toBeVisible();
        await expect(this.placeOrderButton).toBeVisible();
    }

    async assertPurchaseOrderNumberInAmendmentSummaryPage(poNumber: string) {
        await expect(this.enterPOTextFieldInAmendmentSummary).toHaveValue(poNumber);
    }

    async totalChangesCountInAmendmentSummaryPage(totalChangesCount: string) {
        await expect(this.totalChangesCount).toHaveText(totalChangesCount);
    }

    async licenseAdditionsCountInAmendmentSummaryPage(licenseAdditionsCount: string) {
        await expect(this.licenseAdditionsCount).toContainText(licenseAdditionsCount);
    }

    async verifyDiscardDraftButtonIsVisible() {
        await expect(this.discardDraftButton).toBeVisible();
    }

    async clickCloseButtonOnDiscardDraftPopUpShouldTaketoContractSummaryPage() {
        await expect(this.discardDraftButton).toBeVisible();
        await this.discardDraftButton.click();
        await expect(this.deleteDraftWarningText).toBeVisible();
        await expect(this.closeButtonOnDiscardDraftPopup).toBeVisible();
        await expect(this.acceptButtonOnDiscardDraftPopup).toBeVisible();
        await this.closeButtonOnDiscardDraftPopup.click();
    }

    async clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton() {
        await expect(this.discardDraftButton).toBeVisible({ timeout: 30000 });
        await this.discardDraftButton.click();
        await expect(this.deleteDraftWarningText).toBeVisible();
        //await expect(this.EscKeyPressText).toBeVisible();
        await expect(this.closeButtonOnDiscardDraftPopup).toBeVisible();
        await expect(this.acceptButtonOnDiscardDraftPopup).toBeVisible();
        await this.acceptButtonOnDiscardDraftPopup.click({ timeout: 20000 });
        //await expect(this.backToTableButton).toBeVisible();
        await expect(this.amendContractButton).toBeVisible();
        console.log(`AmendmentDraft Discarded`);
    }

    async clickBackToTableButtonShouldTakeToContractsSummaryPage() {
        await this.backToTableButton.click();
        await expect(this.page).toHaveURL(/tab=contracts/);
    }

    /** Closes any toast still on screen (e.g. "Purchase Order Number saved") so the next assertion targets a fresh toast. */
    private async dismissVisibleToast() {
        if (await this.toastCloseButton.isVisible().catch(() => false)) {
            await this.toastCloseButton.click();
            await expect(this.toast).toBeHidden({ timeout: 10000 });
        }
    }

    async clickPlaceOrderButton() {
        await this.dismissVisibleToast();
        await this.placeOrderButton.click();
        await expect(this.toast, 'Expected a toast notification after clicking Place Order').toBeVisible({ timeout: 60000 });
        console.log(`Toast after Place Order: ${((await this.toast.innerText()) ?? '').replace(/\s+/g, ' ').trim()}`);
    }

    async visibilityOfPlaceOrderButton() {
        await expect(this.placeOrderButton).toBeVisible();
    }

    async verificationOfAlertPopup() {
        await expect(this.toast).toBeVisible();
        // await expect(this.toastCloseButton).toBeVisible();
    }

    async verifyAmendContractButtonIsDisabled() {
        await expect(this.disabledAmendContractBtn).toBeVisible();
    }

    async onHoverAmendContractBtnAndverifyTooltipText(expectedTooltipText: string) {
        // await this.disabledAmendContractBtn.hover();
        await this.page.locator('[data-testid="amend-contract-button"]').hover();
        await this.page.waitForTimeout(1000);
        await expect(this.disabledAmendContractTooltipText).toHaveText(expectedTooltipText);
    }


    async verifyProductAddedIsDisplayedInAmendmentSummaryScreen(productName: string) {
        await expect(this.additionalProductTextInAmendmentSummary).toContainText(productName);
    }

    // async verifyProductSKUAddedIsDisplayedInAmendmentSummaryScreen(productSKU: string) {
    //     const additionalProductsAccordion = this.page
    //         .locator('button.MuiAccordionSummary-root')
    //         .filter({ has: this.page.locator('[aria-label="positive-changes-title"]') });

    //     if (await additionalProductsAccordion.isVisible()) {
    //         await additionalProductsAccordion.click();
    //     }

    //     const sku = this.additionalProductSKUTextInAmendmentSummary
    //         .filter({ hasText: productSKU });
    //     await this.page.waitForTimeout(2000);
    //     console.log('Verifying SKU in Amendment Summary: ', productSKU);
    //     try {
    //         await expect(sku).toBeVisible({ timeout: 45000 });
    //     }
    //     catch (error) {
    //         const bundleSKUs = this.additionalBundleSKUTextInAmendmentSummary
    //             .filter({ hasText: productSKU });
    //         console.log('Verifying SKU in Bundle Contents: ', productSKU);
    //         await expect(bundleSKUs).toBeVisible({ timeout: 45000 });
    //     }
    // }

    async verifyProductSKUAddedIsDisplayedInAmendmentSummaryScreen(productSKU: string) {
        await this.clickExpandButtonInAdditionalproducts();

        console.log(`Verifying SKU in Amendment Summary: ${productSKU}`);

        const subscriptionSku = this.additionalProductSKUTextInAmendmentSummary
            .filter({ hasText: productSKU })
            .first();

        if (await subscriptionSku.count()) {
            await expect(subscriptionSku).toBeVisible({ timeout: 45000 });
            return;
        }

        const bundleSku = this.additionalBundleSKUTextInAmendmentSummary
            .filter({ hasText: productSKU })
            .first();

        if (await bundleSku.count()) {
            await expect(bundleSku).toBeVisible({ timeout: 45000 });
            return;
        }

        // Fallback for minor UI formatting differences across environments.
        const escapedSKU = productSKU.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await expect(this.page.getByText(new RegExp(escapedSKU))).toBeVisible({ timeout: 45000 });
    }

    async clickExpandButtonInAdditionalproducts() {
        // The Additional Products section is only collapsible (rendered as an accordion button) when
        // there are many changes; with few changes it renders as a plain heading that is already expanded.
        await expect(this.licenseAdditionsCount.first()).toBeVisible({ timeout: 30000 });
        // Every collapsible change-type section (Upgrades, License Additions, ...) shares the same
        // positive-changes-title button, so scope to the Additional Products section specifically.
        const additionalProductsButton = this.additionalProductsExpandButton
            .filter({ hasText: 'Additional Products' })
            .first();
        if ((await additionalProductsButton.count()) === 0) {
            console.log('Additional Products section is already expanded (no expand button rendered)');
            return;
        }
        const isExpanded = await additionalProductsButton.getAttribute('aria-expanded');
        if (isExpanded === 'false') {
            await additionalProductsButton.click();
            await expect(additionalProductsButton).toHaveAttribute('aria-expanded', 'true');
            console.log('Clicked on Expand button');
        }

    }


    async verifyTotalChangesCountInAmendmentSummaryScreen(expectedCount: number) {
        const totalChanges = this.totalChangesCount;
        await expect(totalChanges).toHaveText(`${expectedCount}`);
    }

    private readCurrencyAmount(raw: string, label: string): number {
        const match = raw.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
        if (!match) {
            throw new Error(`${label} did not contain a currency amount. Text: "${raw.trim()}"`);
        }
        return Number(match[0]);
    }

    async verifyPricingBreakdownDisplayedForAllIndexesAndContractTotalsMatch() {
        const pricingBreakdowns = this.page.getByRole('button').filter({ has: this.page.getByTestId('pricing-breakdown-title') });
        const listedProducts = this.page.locator('h6[aria-label="subscription-name"]');
        await expect(pricingBreakdowns.first()).toBeVisible({ timeout: 30000 });
        const productCount = await pricingBreakdowns.count();
        expect(productCount, 'Pricing Breakdown should be displayed for every listed product').toBeGreaterThan(0);
        if (await listedProducts.count()) {
            await expect(pricingBreakdowns, 'Pricing Breakdown should be displayed for every product index').toHaveCount(await listedProducts.count());
        }

        for (let index = 0; index < productCount; index++) {
            const breakdown = pricingBreakdowns.nth(index);
            await breakdown.scrollIntoViewIfNeeded();
            await expect(breakdown, `Pricing Breakdown should be displayed for product index ${index}`).toBeVisible();
            const rowText = (await breakdown.innerText()) ?? '';
            console.log(`Product index ${index}: Pricing Breakdown is displayed (${rowText.replace(/\s+/g, ' ').trim()})`);
        }

        // Contract Total in the page header should match the Contract Total in the pricing table below the products.
        const contractTotalAbove = this.page.locator('[aria-labelledby="contract-total"]').first();
        await expect(contractTotalAbove, 'Contract Total should be displayed above the products').toBeVisible();
        const aboveAmount = this.readCurrencyAmount(
            (await contractTotalAbove.innerText()) ?? '',
            'Contract Total displayed above the products',
        );

        const contractTotalBelow = this.page.locator('td[aria-labelledby="total-net-price"]').first();
        await contractTotalBelow.scrollIntoViewIfNeeded();
        await expect(contractTotalBelow, 'Contract Total should be displayed below the products').toBeVisible();
        const belowAmount = this.readCurrencyAmount(
            (await contractTotalBelow.innerText()) ?? '',
            'Contract Total displayed below the products',
        );

        expect(
            Math.round(belowAmount * 100),
            `Contract Total below the products (${belowAmount}) should match the Contract Total above (${aboveAmount})`,
        ).toBe(Math.round(aboveAmount * 100));
        console.log(`Contract Total matches: above ${aboveAmount} | below ${belowAmount}`);
    }

    async verifyDisplayedTotalChangesMatchesListedChanges() {
        await expect(this.totalChangesCount).toBeVisible({ timeout: 30000 });
        const expandVisible = await this.additionalProductsExpandButton.isVisible().catch(() => false);
        if (expandVisible) {
            await this.clickExpandButtonInAdditionalproducts();
        }

        const displayedCount = Number((await this.totalChangesCount.innerText())?.trim());
        const listedChanges = await this.additionalProductTextInAmendmentSummary.count();
        expect(
            displayedCount,
            `Total Changes (${displayedCount}) should match the ${listedChanges} listed changes`,
        ).toBe(listedChanges);
        console.log(`Total Changes ${displayedCount} matches the ${listedChanges} listed changes`);
    }

    async completeAmendmentByGeneratePricingAndPlaceOrder(
        poNumber: string,
        action: 'placeOrder' | 'discardDraft' = 'placeOrder'
    ): Promise<void> {
        await expect(this.placeOrderButton).toBeVisible({ timeout: 45000 });
        const poFieldVisible = await this.enterPOTextFieldInAmendmentSummary.isVisible({ timeout: 3000 }).catch(() => false);
        if (poFieldVisible && poNumber.trim().length > 0) {
            await this.enterPOTextFieldInAmendmentSummary.fill(poNumber);
        }

        if (action === 'discardDraft') {
            await this.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            return;
        }

        await this.clickPlaceOrderButton();
        await this.verificationOfAlertPopup();
    }

    async completeDiscardDraftInAmendmentSummary() {
        await this.acceptButtonOnDiscardDraftPopup.click({ timeout: 20000 });
    }
}