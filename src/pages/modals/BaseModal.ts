import { expect, Locator, Page } from "@playwright/test";

export abstract class BaseModal {
    readonly page: Page;
    readonly dialog: Locator;
    readonly closeBtn: Locator;

    protected constructor(page: Page, dialog: Locator, closeBtn?: Locator) {
        this.page = page;
        this.dialog = dialog;
        this.closeBtn = closeBtn ?? dialog.getByRole('button', { name: 'Close modal', exact: true });
    }

    async assertBasicFields(): Promise<void> {
        await expect(this.dialog).toBeVisible();
        await expect(this.closeBtn).toBeVisible();
    }

    async Close(): Promise<void> {
        await this.closeBtn.click();
        await expect(this.dialog).toBeHidden();
    }
}
