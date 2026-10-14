import { expect, type Locator } from '@playwright/test';

export class SearchBar {
    constructor(
        readonly Input: Locator,
        readonly ResultsText: Locator,
        readonly FilterAction?: Locator,
    ) { }

    async Search(text: string, expectedResults?: number): Promise<void> {
        await this.Input.fill(text);
        await this.Input.press('Enter');

        if (expectedResults === undefined) {
            return;
        }

        await expect(this.ResultsText).toHaveText(`${expectedResults} ${expectedResults === 1 ? 'Result' : 'Results'}`);
    }
}
