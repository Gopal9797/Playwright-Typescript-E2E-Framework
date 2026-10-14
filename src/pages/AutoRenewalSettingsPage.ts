import { expect, Locator, Page } from "@playwright/test";

export class AutoRenewalSettingsPage {
    readonly page: Page;
    readonly autoRenewalSettingsButton: Locator;
    readonly autoRenewSwitch: Locator;
    readonly autoRenewalSettingsSavedToast: Locator;
    readonly autoRenewalToggleOnLabel: Locator;
    readonly autoRenewalToggleOffLabel: Locator;
    readonly contractsNavLink: Locator;
    readonly editDetailsButton: Locator;
    readonly turnOffAutoRenewalMenuItem: Locator;
    readonly turnOnAutoRenewalMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;
        this.autoRenewalSettingsButton = page.locator('button:has(modus-wc-icon i:text("settings"))');
        this.autoRenewSwitch = page.locator('[data-testid="auto-renew-switch"] input[role="switch"]');
        this.autoRenewalSettingsSavedToast = page.getByText('Auto-renewal settings saved successfully');
        this.autoRenewalToggleOnLabel = page.locator('[data-testid="auto-renew-status"]').filter({ hasText: 'ON' });
        this.autoRenewalToggleOffLabel = page.locator('[data-testid="auto-renew-status"]').filter({ hasText: 'OFF' });
        this.contractsNavLink = page.locator('a[href$="/contracts"][data-discover="true"][tabindex="0"]');
        this.editDetailsButton = page.locator('button[aria-label="Edit Details"][aria-haspopup="true"]');
        this.turnOffAutoRenewalMenuItem = page.getByText('Turn off Auto-Renewal', { exact: true });
        this.turnOnAutoRenewalMenuItem = page.getByText('Turn on Auto-Renewal', { exact: true });
    }
    async verifyAutoRenewalGlobalSettings() {
        await this.autoRenewalSettingsButton.click();
        console.log('Auto Renewal Settings button clicked successfully');
        await this.autoRenewSwitch.waitFor({ state: 'visible' });
        console.log('Auto Renewal switch is visible on the page');
        await this.clickAutoRenewalToggle();
        const isChecked = await this.autoRenewSwitch.isChecked();
        console.log(`Auto-renewal toggle is now switched: ${isChecked ? 'ON' : 'OFF'}`);
        await this.verifyAutoRenewalSettingsSavedToast();
        if (isChecked) {
            await this.verifyAutoRenewalToggleIsOn();
        } else {
            await this.verifyAutoRenewalToggleIsOff();
        }
        return isChecked;
    }
    async clickAutoRenewalToggle() {
        await this.autoRenewSwitch.click();
        console.log('Auto-renewal toggle clicked successfully');
    }

    async verifyAutoRenewalSettingsSavedToast() {
        await expect(this.autoRenewalSettingsSavedToast).toBeVisible({ timeout: 10000 });
        console.log('Auto-renewal settings saved successfully toast is visible');
    }

    async verifyAutoRenewalToggleIsOn() {
        await expect(this.autoRenewalToggleOnLabel).toBeVisible();
        await expect(this.autoRenewSwitch).toBeChecked();
        console.log('Auto-renewal toggle is ON');
    }

    async verifyAutoRenewalToggleIsOff() {
        await expect(this.autoRenewalToggleOffLabel).toBeVisible();
        await expect(this.autoRenewSwitch).not.toBeChecked();
        console.log('Auto-renewal toggle is OFF');
    }

    async verifyAutoRenewalMenuItemIsAvailableInEditDetails() {
        await this.editDetailsButton.click();
        const eitherMenuItem = this.turnOffAutoRenewalMenuItem.or(this.turnOnAutoRenewalMenuItem);
        await expect(eitherMenuItem).toBeVisible({ timeout: 10000 });
        const isOff = await this.turnOffAutoRenewalMenuItem.isVisible();
        console.log(`"${isOff ? 'Turn off Auto-Renewal' : 'Turn on Auto-Renewal'}" menu item is available in Edit Details`);
    }

    async toggleAutoRenewalInEditDetails(): Promise<boolean> {
        await this.editDetailsButton.click();
        const eitherMenuItem = this.turnOffAutoRenewalMenuItem.or(this.turnOnAutoRenewalMenuItem);
        await expect(eitherMenuItem).toBeVisible({ timeout: 10000 });
        const turnOffVisible = await this.turnOffAutoRenewalMenuItem.isVisible();
        if (turnOffVisible) {
            await this.turnOffAutoRenewalMenuItem.click();
            console.log('Auto-renewal turned OFF via Edit Details menu');
            return false;
        }
        await this.turnOnAutoRenewalMenuItem.click();
        console.log('Auto-renewal turned ON via Edit Details menu');
        return true;
    }

    async verifyAutoRenewalToggleIsDisabled() {
        await expect(this.autoRenewSwitch).toBeDisabled();
        console.log('Auto-renewal toggle is disabled — cannot be changed for this contract');
    }

    async verifyAutoRenewalToggleIsNotVisible() {
        await expect(this.autoRenewSwitch).not.toBeVisible();
        console.log('Auto-renewal toggle is not visible — cannot be changed for this contract');
    }

}