import { expect, Locator, Page } from '@playwright/test';

export class NotificationPopup {
    readonly popup: Locator;
    readonly message: Locator;
    readonly errorCode: Locator;
    readonly dismissBtn: Locator;

    constructor(page: Page) {
        this.popup = page.locator('.MuiSnackbar-root');
        this.message = this.popup.locator('.MuiAlert-message, .modus-wc-alert-content > .title, [slot="content"] p').first();
        this.errorCode = this.popup.locator('p').filter({
            has: page.getByText('Error Code:', { exact: true }),
        });
        this.dismissBtn = this.popup.getByRole('button', {
            name: 'Dismiss alert',
            exact: true,
        });
    }

    async assertMessage(message: string): Promise<void> {
        const alert = this.popup.locator('.MuiAlert-root, .modus-wc-alert');
        await expect(alert).toBeVisible();
        await expect(alert).toHaveClass(/\b(?:modus-wc-alert-(?:success|error)|MuiAlert-(?:standard|filled|outlined)(?:Success|Error))\b/);

        const alertClass = await alert.getAttribute('class');
        if (/\b(?:modus-wc-alert-error|MuiAlert-(?:standard|filled|outlined)Error)\b/.test(alertClass ?? '')) {
            const message = (await alert.locator('.MuiAlert-message, .modus-wc-alert-content').innerText()).trim();
            console.error(message);
            throw new Error(message || 'Action failed with an error notification');
        }

        // Anchor at the start only: some toasts append an inline link (e.g. "View device") to the message element.
        const escaped = message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await expect(this.popup.getByText(new RegExp(`^\\s*${escaped}`))).toBeVisible();
        console.log(message);
        await this.Dismiss();
    }

    async Dismiss(): Promise<void> {
        await this.dismissBtn.click();
        await expect(this.popup).toBeHidden();
    }
}
