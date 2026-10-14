import { expect, Locator, Page } from "@playwright/test";

type AmendmentType = 'addSeats' | 'upgrade' | 'removeSeats' | 'downgrade' | 'removeSubscription' | 'removeStorage';

export class AxpAmendmentPage {
    readonly page: Page;
    readonly selectSubscriptionToModifyListBox: Locator;
    readonly selectSubscriptionTargetListBox: Locator;
    readonly amendmentTypeGroup: Locator;

    readonly addSeatsOptionByValue: Locator;
    readonly upgradeOptionByValue: Locator;
    readonly removeSeatsOptionByValue: Locator;
    readonly downgradeOptionByValue: Locator;
    readonly removeSubscriptionOptionByValue: Locator;
    readonly removeStorageOptionByValue: Locator;

    readonly subscriptionSearchByPlaceholder: Locator;
    readonly quantityTotalText: Locator;

    readonly quantityInput: Locator;
    readonly quantityIncrementButton: Locator;
    readonly quantityDecrementButton: Locator;
    readonly saveAmendmentDraftButton: Locator;
    readonly createAnotherAmendmentButton: Locator;
    readonly discardAmendmentDraftButton: Locator;
    readonly submitAmendmentsButton: Locator;
    readonly customerCommentsTextBox: Locator;
    readonly upcomingChangesTab: Locator;
    readonly dealerInfoTextForPositiveRequests: Locator;
    readonly dealerInfoTextForNegativeRequests: Locator;
    readonly termsCheckbox: Locator;
    readonly activateNowButton: Locator;
    readonly positiveAmendmentCardStatusSummary: Locator;
    readonly negativeAmendmentCardStatusSummary: Locator;
    readonly cancelChangesInAmendmentButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.selectSubscriptionToModifyListBox = page.locator('div[role="combobox"]', { has: page.locator('p', { hasText: /select subscription/i }) });

        this.amendmentTypeGroup = page.locator('div.ac-amendment-type-radio-option');

        const amendmentOptionByValue = (value: string) => page.locator('label.ac-amendment-type-label', {
            has: page.locator(`input[name="amendment-type"][value="${value}"]`),
        });

        this.addSeatsOptionByValue = amendmentOptionByValue('ADD_SEATS');
        this.upgradeOptionByValue = amendmentOptionByValue('UPGRADE');
        this.removeSeatsOptionByValue = amendmentOptionByValue('REMOVE_SEATS');
        this.downgradeOptionByValue = amendmentOptionByValue('DOWNGRADE');
        this.removeSubscriptionOptionByValue = amendmentOptionByValue('CANCEL_SUBSCRIPTION');
        this.removeStorageOptionByValue = amendmentOptionByValue('REMOVE_STORAGE');

        this.subscriptionSearchByPlaceholder = page.getByPlaceholder(/Select subscription/i);
        this.quantityTotalText = page.getByText(/\/\s*\d+\s*total/i).first();

        this.quantityInput = page.getByTestId('qt-input-box');
        this.quantityIncrementButton = page.getByTestId('qt-increment-button').first();
        this.quantityDecrementButton = page.getByTestId('qt-decrement-button').first();
        this.selectSubscriptionTargetListBox = page.locator('div[role="combobox"]', { has: page.locator('p', { hasText: /select subscription/i }) }).last();
        this.saveAmendmentDraftButton = page.getByTestId('create-amendment-save-btn');
        this.submitAmendmentsButton = page.getByTestId('amend-contract-save-btn');

        this.createAnotherAmendmentButton = page.getByTestId('create-another-amendment-btn');
        this.discardAmendmentDraftButton = page.getByTestId('amend-contract-cancel-btn');
        this.customerCommentsTextBox = page.locator('textarea').first();

        this.upcomingChangesTab = page.locator("//*[contains(text(),'UPCOMING CHANGES')]").first();
        this.dealerInfoTextForPositiveRequests = page.getByText("Your dealer will be in touch.").first();
        this.dealerInfoTextForNegativeRequests = page.getByText("Scheduled to take effect at renewal").first();
        this.termsCheckbox = page.locator('xpath=//input[@type="checkbox"]');
        this.activateNowButton = page.getByTestId('activate-now-button');
        this.positiveAmendmentCardStatusSummary = page.getByTestId('amendment-card-status-summary').filter({ hasText: /Takes effect after dealer acceptance/i });
        this.negativeAmendmentCardStatusSummary = page.getByTestId('amendment-card-status-summary').filter({ hasText: /Takes effect at renewal/i });
        this.cancelChangesInAmendmentButton = page.getByTestId('order-card-discard-btn');

    }

    async isAmendmentTypeEnabled(type: AmendmentType) {
        const selected = this.getAmendmentTypeLocators(type);
        if (!selected || selected.length === 0) {
            return false;
        }

        const radioInput = selected[0].locator('input[name="amendment-type"]').first();
        if (!await radioInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            return false;
        }

        return !(await radioInput.isDisabled());
    }

    async selectAmendmentType(type: AmendmentType) {
        await expect(this.amendmentTypeGroup.first()).toBeVisible({ timeout: 30000 });
        const selected = this.getAmendmentTypeLocators(type);
        if (!selected || selected.length === 0) {
            throw new Error(`Amendment type option was not found for type: ${type}`);
        }

        const radioInput = selected[0].locator('input[name="amendment-type"]').first();
        if (await radioInput.isDisabled().catch(() => false)) {
            throw new Error(`Amendment type ${type} is disabled for selected contract.`);
        }

        await selected[0].click();
    }

    async selectSubscriptionBySku(sku: string) {
        await expect(this.selectSubscriptionToModifyListBox).toBeVisible({ timeout: 30000 });
        await this.selectSubscriptionToModifyListBox.click();
        const subscriptionOption = this.page.locator('li[role="option"]', {
            has: this.page.locator('p', { hasText: new RegExp(sku, 'i') }),
        }).first();
        await expect(subscriptionOption).toBeVisible({ timeout: 10000 });
        await subscriptionOption.click();
        const loading = this.page.getByText(/loading/i).first();
        await loading.waitFor({ state: "visible", timeout: 2000 }).catch(() => { });
        await expect(this.amendmentTypeGroup.first()).toBeVisible({ timeout: 30000 });
    }

    async selectFirstSubscriptionToModify() {
        return this.selectDropdownOptionByIndex(this.selectSubscriptionToModifyListBox, 0);
    }

    async selectTargetSubscriptionBySku(sku: string) {
        await expect(this.selectSubscriptionTargetListBox).toBeVisible({ timeout: 30000 });
        await this.selectSubscriptionTargetListBox.click();
        const subscriptionOption = this.page.locator('li[role="option"]', {
            has: this.page.locator('p', { hasText: new RegExp(sku, 'i') }),
        });
        await expect(subscriptionOption.first()).toBeVisible({ timeout: 10000 });
        await subscriptionOption.first().click();
        const loading = this.page.getByText(/loading/i).first();
        await loading.waitFor({ state: "visible", timeout: 2000 }).catch(() => { });
        await expect(this.amendmentTypeGroup.first()).toBeVisible({ timeout: 30000 });
    }

    async selectFirstTargetSubscription() {
        return this.selectDropdownOptionByIndex(this.selectSubscriptionTargetListBox, 0);
    }

    async selectFirstAvailableUpgradePath(): Promise<{ sourceSubscription: string; targetSubscription: string } | null> {
        const sourceCount = await this.getDropdownOptionCount(this.selectSubscriptionToModifyListBox);
        if (sourceCount === 0) {
            return null;
        }

        for (let sourceIndex = 0; sourceIndex < sourceCount; sourceIndex++) {
            const sourceSubscription = await this.selectDropdownOptionByIndex(this.selectSubscriptionToModifyListBox, sourceIndex);

            const upgradeEnabledForSource = await this.isAmendmentTypeEnabled('upgrade');
            if (!upgradeEnabledForSource) {
                continue;
            }

            await this.selectAmendmentType('upgrade');

            await expect(this.selectSubscriptionTargetListBox).toBeVisible({ timeout: 30000 });
            await this.selectSubscriptionTargetListBox.click();

            const noUpgradesAvailable = await this.page.getByText(/no upgrades available/i).first().isVisible({ timeout: 1500 }).catch(() => false);
            const targetOptions = this.page.locator('li[role="option"]');
            const hasTargetOptions = await targetOptions.first().isVisible({ timeout: 5000 }).catch(() => false);
            const targetCount = hasTargetOptions ? await targetOptions.count() : 0;

            if (noUpgradesAvailable || targetCount === 0) {
                await this.page.keyboard.press('Escape').catch(() => { });
                continue;
            }

            const firstTarget = targetOptions.first();
            const targetSubscription = this.normalizeText((await firstTarget.textContent()) ?? '');
            await firstTarget.click();
            return { sourceSubscription, targetSubscription };
        }

        return null;
    }

    async setQuantity(value: number) {
        await this.quantityInput.fill(String(value));
    }

    async incrementQuantityOnce() {
        await expect(this.quantityInput).toHaveValue('0');
        await this.quantityIncrementButton.click();
        await expect(this.quantityInput).toHaveValue('1');
    }

    async setQuantityToAllAvailable() {
        await expect(this.quantityTotalText).toBeVisible({ timeout: 30000 });
        const text = (await this.quantityTotalText.textContent()) ?? '';
        const match = text.match(/\/\s*(\d+)\s*total/i);
        if (!match) {
            throw new Error(`Unable to parse total license count from: ${text}`);
        }
        await this.setQuantityWithStepper(Number(match[1]));
    }

    async saveAmendmentDraft() {
        await expect(this.saveAmendmentDraftButton).toBeVisible({ timeout: 30000 });
        await this.saveAmendmentDraftButton.click();
    }

    async submitCustomerInitiatedAmendment(requestType: 'positive' | 'negative' | 'combined') {
        if (requestType === 'positive') {
            await this.positiveAmendmentCardStatusSummary.waitFor({ state: "visible", timeout: 30000 });
            await expect(this.customerCommentsTextBox).toBeVisible({ timeout: 30000 });
            await this.customerCommentsTextBox.click();
            await this.customerCommentsTextBox.fill(`PLAYWRIGHT AUTOMATION - CUSTOMER INITIATED AMENDMENT`);
        } else if (requestType === 'negative') {
            await this.negativeAmendmentCardStatusSummary.waitFor({ state: "visible", timeout: 30000 });
        } else if (requestType === 'combined') {
            await this.positiveAmendmentCardStatusSummary.waitFor({ state: "visible", timeout: 30000 });
            await this.negativeAmendmentCardStatusSummary.waitFor({ state: "visible", timeout: 30000 });
            await expect(this.customerCommentsTextBox).toBeVisible({ timeout: 30000 });
            await this.customerCommentsTextBox.click();
            await this.customerCommentsTextBox.fill(`PLAYWRIGHT AUTOMATION - CUSTOMER INITIATED AMENDMENT`);

        }
        await expect(this.submitAmendmentsButton).toBeVisible({ timeout: 30000 });
        await this.submitAmendmentsButton.click();
        await this.page.waitForTimeout(5000);
    }

    async assertAmendmentSubmissionSuccess(requestType: 'positive' | 'negative' | 'combined') {
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.reload();
        await expect(this.upcomingChangesTab).toBeVisible({ timeout: 60000 });
        await this.upcomingChangesTab.click();
        if (requestType === 'positive') {
            await expect(this.dealerInfoTextForPositiveRequests).toBeVisible({ timeout: 60000 });
        } else if (requestType === 'negative') {
            await expect(this.dealerInfoTextForNegativeRequests).toBeVisible({ timeout: 60000 });
        } else if (requestType === 'combined') {
            await expect(this.dealerInfoTextForPositiveRequests).toBeVisible({ timeout: 60000 });
            await expect(this.dealerInfoTextForNegativeRequests).toBeVisible({ timeout: 60000 });
        }
        if (await this.termsCheckbox.isVisible()) {
            await this.termsCheckbox.click();
            await expect(this.activateNowButton).toBeVisible({ timeout: 500000 });
            await this.activateNowButton.click();
            await this.page.waitForLoadState("domcontentloaded");
        }
    }

    private getAmendmentTypeLocators(type: AmendmentType): Locator[] {
        switch (type) {
            case 'addSeats':
                return [this.addSeatsOptionByValue];
            case 'upgrade':
                return [this.upgradeOptionByValue];
            case 'removeSeats':
                return [this.removeSeatsOptionByValue];
            case 'downgrade':
                return [this.downgradeOptionByValue];
            case 'removeSubscription':
                return [this.removeSubscriptionOptionByValue];
            case 'removeStorage':
                return [this.removeStorageOptionByValue];
            default:
                return [];
        }
    }

    private normalizeText(text: string) {
        return text.replace(/\s+/g, ' ').trim();
    }

    private async getDropdownOptionCount(dropdown: Locator) {
        await expect(dropdown).toBeVisible({ timeout: 30000 });
        await dropdown.click();
        const options = this.page.locator('li[role="option"]');
        const hasOptions = await options.first().isVisible({ timeout: 5000 }).catch(() => false);
        const count = hasOptions ? await options.count() : 0;
        await this.page.keyboard.press('Escape').catch(() => { });
        return count;
    }

    private async selectDropdownOptionByIndex(dropdown: Locator, optionIndex: number) {
        await expect(dropdown).toBeVisible({ timeout: 30000 });
        await dropdown.click();
        const options = this.page.locator('li[role="option"]');
        await expect(options.first()).toBeVisible({ timeout: 10000 });

        const count = await options.count();
        if (optionIndex >= count) {
            await this.page.keyboard.press('Escape').catch(() => { });
            throw new Error(`Dropdown option index ${optionIndex} is out of range. Option count: ${count}`);
        }

        const option = options.nth(optionIndex);
        const optionText = this.normalizeText((await option.textContent()) ?? '');
        await option.click();
        return optionText;
    }

    private async setQuantityWithStepper(targetQuantity: number) {
        await expect(this.quantityInput).toBeVisible({ timeout: 30000 });

        let currentQuantity = Number(await this.quantityInput.inputValue());
        if (Number.isNaN(currentQuantity)) {
            currentQuantity = 0;
        }

        let guard = 0;
        while (currentQuantity !== targetQuantity && guard < 50) {
            if (currentQuantity < targetQuantity) {
                await this.quantityIncrementButton.click();
            } else {
                await this.quantityDecrementButton.click();
            }
            currentQuantity = Number(await this.quantityInput.inputValue());
            guard += 1;
        }

        await expect(this.quantityInput).toHaveValue(String(targetQuantity));
    }

    async cancelCustomerInitiatedAmendment() {
        // click on upcoming changes tab to ensure the cancelchangesButton is visible
        await expect(this.upcomingChangesTab).toBeVisible({ timeout: 30000 });
        await this.upcomingChangesTab.click();
        //Cancel changes might be more than one, so we need to click every cancel changes button until there are no more visible
        await expect(this.cancelChangesInAmendmentButton.first()).toBeVisible({ timeout: 30000 });
        const count = await this.cancelChangesInAmendmentButton.count();
        for (let i = 0; i < count; i++) {
            const button = this.cancelChangesInAmendmentButton.nth(i);
            if (await button.isVisible({ timeout: 5000 })) {
                await button.click();
                await this.page.waitForTimeout(1000);
                await this.page.reload();
                await expect(this.upcomingChangesTab).toBeVisible({ timeout: 30000 });
                await this.upcomingChangesTab.click();
            }
        }
    }

    async assertAmendmentCancellationSuccess() {
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.reload();
        await expect(this.upcomingChangesTab).toBeVisible({ timeout: 60000 });
        await this.upcomingChangesTab.click();
        await expect(this.cancelChangesInAmendmentButton.first()).not.toBeVisible({ timeout: 60000 });
    }
}
export default AxpAmendmentPage;
