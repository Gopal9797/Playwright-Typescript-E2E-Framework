import { expect, Locator, Page } from "@playwright/test";
import notificationCategoriesData from "./notificationCategoriesData.json";

type NotificationFieldData = { label: string; required: boolean };

export class NotificationsSettingsPage {
    readonly page: Page;
    readonly settingsButton: Locator;
    readonly settingsHeading: Locator;
    readonly generalTab: Locator;
    readonly notificationsTab: Locator;
    readonly inAppTab: Locator;
    readonly emailTab: Locator;
    readonly customerEmailTab: Locator;
    readonly inAppHeading: Locator;
    readonly inAppDescription: Locator;
    readonly emailHeading: Locator;
    readonly emailDescription: Locator;
    readonly restoreDefaultsButton: Locator;
    readonly enableAllButtons: Locator;
    readonly restoreDefaultsDialogTitle: Locator;
    readonly restoreDefaultsDialogMessage: Locator;
    readonly restoreDefaultsDialogCancelButton: Locator;
    readonly restoreDefaultsConfirmButton: Locator;
    readonly selectUserLabel: Locator;
    readonly searchUserInput: Locator;
    readonly disableAllButtons: Locator;
    readonly contractsCategory: Locator;
    readonly customerRequestsCategory: Locator;
    readonly contractExpirationAndRenewalsCategory: Locator;
    readonly devicesCategory: Locator;
    readonly customerAccountsCategory: Locator;
    readonly notificationCategories: Array<{ name: string; heading: Locator }>;

    constructor(page: Page) {
        this.page = page;
        this.settingsButton = page.getByRole('button', { name: 'Settings', exact: true });
        this.settingsHeading = page.getByRole('heading', { name: 'Settings', level: 1 });
        this.generalTab = page.getByRole('tab', { name: 'General', exact: true });
        this.notificationsTab = page.getByRole('tab', { name: 'Notifications', exact: true });
        this.inAppTab = page.getByRole('tab', { name: 'In-App', exact: true });
        this.emailTab = page.getByRole('tab', { name: 'Email', exact: true });
        this.customerEmailTab = page.getByRole('tab', { name: 'Customer Email', exact: true });
        this.inAppHeading = page.getByRole('heading', { name: 'In-App Notification Settings', level: 2 });
        this.inAppDescription = page.getByText('Manage in-app notifications for your account by category, or expand to customize individual notification types.');
        this.emailHeading = page.getByRole('heading', { name: 'Configure User Email Notification Settings', level: 2 });
        this.emailDescription = page.getByText('Manage email notification preferences for yourself and other users by category, or expand to customize individual notification types');
        this.restoreDefaultsButton = this.restoreDefaultsButton = page.getByRole('button', { name: 'Restore defaults' }).filter({ hasText: 'refresh' }).first();
        this.enableAllButtons = page.getByRole('button', { name: 'Enable all' });
        this.restoreDefaultsDialogTitle = page.getByRole('dialog').filter({ hasText: 'Restore default notification settings?' }).getByRole('heading', { name: 'Restore default notification settings?' });
        this.restoreDefaultsDialogMessage = page.getByRole('dialog').filter({ hasText: 'Restore default notification settings?' }).getByText('This will reset your notification preferences and turn on all notifications.');
        this.restoreDefaultsDialogCancelButton = page.getByRole('dialog').filter({ hasText: 'Restore default notification settings?' }).getByRole('button', { name: 'Cancel' });
        this.restoreDefaultsConfirmButton = page.getByRole('dialog').filter({ hasText: 'Restore default notification settings?' }).getByRole('button', { name: 'Restore defaults' });
        this.selectUserLabel = page.getByText('Select User', { exact: true });
        this.searchUserInput = page.getByPlaceholder('Search user');
        this.disableAllButtons = page.getByRole('button', { name: 'Disable all' });
        this.contractsCategory = page.getByRole('heading', { name: 'Contracts', exact: true, level: 3 });
        this.customerRequestsCategory = page.getByRole('heading', { name: 'Customer Requests', exact: true, level: 3 });
        this.contractExpirationAndRenewalsCategory = page.getByRole('heading', { name: 'Contract Expiration and Renewals', exact: true, level: 3 });
        this.devicesCategory = page.getByRole('heading', { name: 'Devices', exact: true, level: 3 });
        this.customerAccountsCategory = page.getByRole('heading', { name: 'Customer Accounts', exact: true, level: 3 });
        this.notificationCategories = [
            { name: 'Contracts', heading: this.contractsCategory },
            { name: 'Customer Requests', heading: this.customerRequestsCategory },
            { name: 'Contract Expiration and Renewals', heading: this.contractExpirationAndRenewalsCategory },
            { name: 'Devices', heading: this.devicesCategory },
            { name: 'Customer Accounts', heading: this.customerAccountsCategory }
        ];
    }

    async openSettings() {
        await this.settingsButton.waitFor({ state: 'visible' });
        await this.settingsButton.click();
        await expect(this.settingsHeading).toBeVisible();
        console.log('Settings page is displayed');
    }

    async verifyGeneralAndNotificationsTabs() {
        await expect(this.settingsHeading).toBeVisible();
        await expect(this.generalTab).toBeVisible();
        await expect(this.notificationsTab).toBeVisible();
        console.log('General and Notifications tabs are displayed');
    }

    async clickNotificationsTab() {
        await this.notificationsTab.click();
        await expect(this.inAppTab).toBeVisible();
        console.log('Notifications tab clicked');
    }

    async verifyNotificationSubTabs() {
        await expect(this.inAppTab).toBeVisible();
        await expect(this.emailTab).toBeVisible();
        await expect(this.customerEmailTab).toBeVisible();
        console.log('In-App, Email and Customer Email tabs are displayed');
    }

    async verifyNotificationCategories() {
        await expect(this.contractsCategory.first()).toBeVisible();
        await expect(this.customerRequestsCategory.first()).toBeVisible();
        await expect(this.contractExpirationAndRenewalsCategory.first()).toBeVisible();
        await expect(this.devicesCategory.first()).toBeVisible();
        await expect(this.customerAccountsCategory.first()).toBeVisible();
        await expect(this.disableAllButtons.first()).toBeVisible();
        console.log('Notification categories and Disable all actions are displayed');
    }

    async verifyInAppNotificationSettings() {
        await expect(this.inAppHeading).toBeVisible();
        await expect(this.inAppDescription).toBeVisible();
        await expect(this.restoreDefaultsButton).toBeVisible();
        await this.verifyNotificationCategories();
        console.log('In-App notification settings headings and UI are displayed');
    }

    async clickEmailTab() {
        await this.emailTab.click();
        await expect(this.emailHeading).toBeVisible();
        console.log('Email tab clicked');
    }

    async verifyEmailNotificationSettings() {
        await expect(this.emailHeading).toBeVisible();
        await expect(this.emailDescription).toBeVisible();
        await expect(this.restoreDefaultsButton).toBeVisible();
        await expect(this.selectUserLabel).toBeVisible();
        await expect(this.searchUserInput).toBeVisible();
        await expect(this.searchUserInput).toBeEnabled();
        await this.searchUserInput.click();
        await this.verifyNotificationCategories();
        console.log('Email notification settings headings and UI are displayed and Select User is clickable');
    }

    async verifySelectUserIsDisabled() {
        await expect(this.emailHeading).toBeVisible();
        await expect(this.selectUserLabel).toBeVisible();
        await expect(this.searchUserInput).toBeVisible();
        await expect(this.searchUserInput).toBeDisabled();
        console.log('Select User is disabled on Email tab');
    }

    async verifyRestoreDefaultsAndDisableAllAreNotVisible() {
        await expect(this.inAppHeading).toBeVisible();
        await expect(this.restoreDefaultsButton).toHaveCount(0);
        await expect(this.disableAllButtons).toHaveCount(0);
        console.log('Restore defaults and Disable all are not visible on In-App notifications');
    }

    async verifyRestoreDefaultsIsDisabled() {
        await expect(this.restoreDefaultsButton).toBeDisabled();
        console.log('Restore defaults button is disabled');
    }

    async clickDisableAllOnFirstCategory() {
        await this.disableAllButtons.filter({ visible: true }).first().click();
        await expect(this.enableAllButtons.filter({ visible: true }).first()).toBeVisible();
        console.log('Disable all clicked and Enable all is displayed');
    }

    async disableFirstVisibleCategory() {
        const categoryHeading = this.notificationCategories[0].heading.filter({ visible: true }).first();
        await this.openNotificationCategory(categoryHeading);
        const categorySection = this.getCategorySection(categoryHeading);
        const notificationToggles = categorySection.locator('input[role="switch"]');
        const enableAllButton = categorySection.getByRole('button', { name: 'Enable all' });

        if (await enableAllButton.isVisible()) {
            return;
        }

        await categorySection.getByRole('button', { name: 'Disable all' }).click();
        await this.verifyNotificationToggleState(this.notificationCategories[0].name, notificationToggles, false);
    }

    async verifyFirstVisibleCategoryState(enabled: boolean) {
        const categoryHeading = this.notificationCategories[0].heading.filter({ visible: true }).first();
        await this.openNotificationCategory(categoryHeading);
        const categorySection = this.getCategorySection(categoryHeading);
        const notificationToggles = categorySection.locator('input[role="switch"]');

        await this.verifyNotificationToggleState(this.notificationCategories[0].name, notificationToggles, enabled);
    }

    async enableFirstVisibleCategory() {
        const categoryHeading = this.notificationCategories[0].heading.filter({ visible: true }).first();
        await this.openNotificationCategory(categoryHeading);
        const categorySection = this.getCategorySection(categoryHeading);

        await categorySection.getByRole('button', { name: 'Enable all' }).click();
        await this.verifyNotificationToggleState(
            this.notificationCategories[0].name,
            categorySection.locator('input[role="switch"]'),
            true,
        );
    }

    async verifyInAppCategoryBulkToggleBehavior() {
        await this.verifyCategoryBulkToggleBehavior();
    }

    async verifyCategoryBulkToggleBehavior() {
        for (const category of this.notificationCategories) {
            const categoryHeading = category.heading.filter({ visible: true }).first();
            await this.openNotificationCategory(categoryHeading);

            const categorySection = this.getCategorySection(categoryHeading);
            const disableAllButton = categorySection.getByRole('button', { name: 'Disable all' });
            const enableAllButton = categorySection.getByRole('button', { name: 'Enable all' });
            const notificationToggles = categorySection.locator('input[role="switch"]');

            await expect(categorySection).toBeVisible();
            await expect(notificationToggles.first()).toBeVisible();

            if (await enableAllButton.isVisible()) {
                await enableAllButton.click();
                await this.verifyNotificationToggleState(category.name, notificationToggles, true);
            }

            await expect(disableAllButton).toBeVisible();
            await disableAllButton.click();
            await this.verifyNotificationToggleState(category.name, notificationToggles, false);

            await expect(enableAllButton).toBeVisible();
            await enableAllButton.click();
            await this.verifyNotificationToggleState(category.name, notificationToggles, true);
        }
    }

    async verifyRequiredTagsAcrossAllCategories() {
        for (const category of this.notificationCategories) {
            await this.verifyRequiredTagsForCategory(category.name);
        }
    }

    async verifyRequiredTagsForCategory(categoryName: string) {
        const category = this.notificationCategories.find((c) => c.name === categoryName);
        if (!category) {
            throw new Error(`Unknown notification category: ${categoryName}`);
        }
        const knownFields: NotificationFieldData[] = (notificationCategoriesData as Record<string, NotificationFieldData[]>)[categoryName] ?? [];

        const categoryHeading = category.heading.filter({ visible: true }).first();
        await this.openNotificationCategory(categoryHeading);
        const categorySection = this.getCategorySection(categoryHeading);
        await expect(categorySection).toBeVisible();

        for (const field of knownFields) {
            const row = categorySection.locator('p.modus-wc-typography-weight-semibold', { hasText: field.label }).first()
                .locator('xpath=ancestor::*[.//input[@role="switch"] or .//*[normalize-space(.) = "Required"]][1]');
            const requiredBadge = row.getByText('Required', { exact: true });
            const toggle = row.locator('input[role="switch"]');

            if (field.required) {
                await expect(requiredBadge).toBeVisible();
                await expect(toggle).toHaveCount(0);
            } else {
                await expect(toggle).toBeVisible();
                await expect(requiredBadge).toHaveCount(0);
            }
        }
        console.log(`Required tags verified for ${categoryName} against known notification fields`);
    }

    async verifyRestoreDefaultsIsEnabled() {
        await expect(this.restoreDefaultsButton).toBeEnabled();
        console.log('Restore defaults button is enabled');
    }

    async clickRestoreDefaults() {
        await this.restoreDefaultsButton.click();
        console.log('Restore defaults button clicked');
    }

    async verifyRestoreDefaultsPopup() {
        await expect(this.restoreDefaultsDialogTitle.first()).toBeVisible();
        await expect(this.restoreDefaultsDialogMessage.first()).toBeVisible();
        await expect(this.restoreDefaultsDialogCancelButton.first()).toBeVisible();
        await expect(this.restoreDefaultsConfirmButton.first()).toBeVisible();
        console.log('Restore defaults popup is displayed with title, message, Cancel and Restore defaults');
    }

    async confirmRestoreDefaultsPopup() {
        await this.restoreDefaultsConfirmButton.filter({ visible: true }).first().click();
        console.log('Restore defaults confirmed on popup');
    }

    async verifySettingsResetToDefaults() {
        await expect(this.enableAllButtons.filter({ visible: true })).toHaveCount(0);
        await expect(this.disableAllButtons.filter({ visible: true }).first()).toBeVisible();
        await expect(this.restoreDefaultsButton).toBeDisabled();
        console.log('Enable all moved back to Disable all and Restore defaults is disabled');
    }

    private getCategorySection(categoryHeading: Locator) {
        return categoryHeading.locator('xpath=ancestor::details[1]');
    }

    private async openNotificationCategory(categoryHeading: Locator) {
        const categorySection = this.getCategorySection(categoryHeading);
        const isOpen = await categorySection.evaluate((el) => el.hasAttribute('open'));

        if (!isOpen) {
            await categoryHeading.click();
            await expect(categorySection.getByRole('button', { name: /Disable all|Enable all/ }).first()).toBeVisible();
        }
    }

    private async verifyNotificationToggleState(categoryName: string, notificationToggles: Locator, enabled: boolean) {
        const toggleCount = await notificationToggles.count();
        expect(toggleCount).toBeGreaterThan(0);

        for (let index = 0; index < toggleCount; index++) {
            if (enabled) {
                await expect(notificationToggles.nth(index)).toBeChecked();
            } else {
                await expect(notificationToggles.nth(index)).not.toBeChecked();
            }
        }

        console.log(`${categoryName} notification toggles are ${enabled ? 'enabled' : 'disabled'}`);
    }
}
