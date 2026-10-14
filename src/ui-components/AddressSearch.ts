import { expect, type Locator, type Page } from '@playwright/test';

export class AddressSearch {
    readonly Input: Locator;
    private readonly suggestions: Locator;

    constructor(page: Page, root: Locator) {
        this.Input = root.filter({ visible: true }).getByRole('textbox').filter({ visible: true });
        this.suggestions = page.locator('.modus-wc-menu-item-content');
    }

    async Search(streetAddress: string): Promise<void> {
        await this.Input.clear();
        await this.Input.pressSequentially(streetAddress, { delay: 100 });

        const escapedAddress = streetAddress.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const suggestion = this.suggestions.filter({ hasText: new RegExp(`^\\s*${escapedAddress}\\s*$`) });
        const suggestionVisible = await suggestion.waitFor({ state: 'visible', timeout: 2_000 })
            .then(() => true)
            .catch(() => false);
        if (suggestionVisible) {
            await suggestion.click();
        } else {
            await this.CloseSuggestions();
        }
        await expect(this.Input).toHaveValue(streetAddress);
    }

    async CloseSuggestions(): Promise<void> {
        await this.suggestions.first().waitFor({ state: 'visible', timeout: 2_000 }).catch(() => { });
        for (let attempt = 0; attempt < 2 && await this.suggestions.count() > 0; attempt++) {
            await this.Input.press('Escape');
        }
    }
}
