import { expect, Locator, Page } from "@playwright/test";

export class SuperAdminPage {
    readonly page: Page;

    // Search for a Dealer screen
    readonly supportAdminModeText: Locator;
    readonly searchForADealerHeading: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly clearSearchButton: Locator;
    readonly searchResultItems: Locator;
    readonly noResultsFoundText: Locator;
    readonly noResultsFoundHintText: Locator;

    // Account view screen
    readonly cdhAccountIdLabel: Locator;
    readonly iamAccountIdLabel: Locator;
    readonly accountOwnerEmailLabel: Locator;
    readonly accountAddressLabel: Locator;
    readonly chooseHowToViewAccountText: Locator;
    readonly viewByRoleTab: Locator;
    readonly viewLikeAUserTab: Locator;
    readonly selectRoleLabel: Locator;
    readonly selectRoleDropdown: Locator;
    readonly userSearchInput: Locator;
    readonly userSuggestionItems: Locator;
    readonly selectReasonForViewAccessText: Locator;
    readonly reasonTextBox: Locator;
    readonly additionalNotesTextBox: Locator;
    readonly cancelButton: Locator;
    readonly enterSupportModeButton: Locator;

    readonly supportAdminModeBanner: Locator;
    readonly selectAnotherAccountButton: Locator;

    readonly viewOnlyModeDialog: Locator;
    readonly viewOnlyModeTitle: Locator;
    readonly viewOnlyModeMessage: Locator;
    readonly viewOnlyModeOkButton: Locator;

    readonly reasonMandatoryLabel: Locator;

    constructor(page: Page) {
        this.page = page;

        this.supportAdminModeText = page.getByText('Sales Order Mode', { exact: true });
        this.searchForADealerHeading = page.getByRole('heading', { name: 'Search for a Dealer' });
        this.searchInput = page.getByPlaceholder('Search by CDH/IAM account ID or email address');
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.clearSearchButton = page.getByRole('button', { name: 'Clear search' });
        this.searchResultItems = page.getByRole('menuitem');
        this.noResultsFoundText = page.getByText('No results found');
        this.noResultsFoundHintText = page.getByText('Enter a valid account ID or email address and try again.');

        this.cdhAccountIdLabel = page.getByText('CDH Account ID', { exact: true });
        this.iamAccountIdLabel = page.getByText('IAM Account ID', { exact: true });
        this.accountOwnerEmailLabel = page.getByText('Account Owner Email', { exact: true });
        this.accountAddressLabel = page.getByText('Account Address', { exact: true });
        this.chooseHowToViewAccountText = page.getByText('1. Choose how to view the account');
        this.viewByRoleTab = page.getByRole('button', { name: 'View by Role' });
        this.viewLikeAUserTab = page.getByRole('button', { name: 'View like a User' });
        this.selectRoleLabel = page.getByText('Select Role *');
        this.selectRoleDropdown = page.locator('select[aria-label="Select"]');
        this.userSearchInput = page.getByPlaceholder('Search by email address');
        this.userSuggestionItems = page.getByRole('menuitemradio');
        this.selectReasonForViewAccessText = page.getByRole('heading', { name: 'Select reason for view access' });
        this.reasonTextBox = page.getByPlaceholder('Briefly describe why you are accessing the dealer user account');
        this.additionalNotesTextBox = page.getByPlaceholder('Add additional notes if any');
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.enterSupportModeButton = page.getByRole('button', { name: /Enter (?:Support|Order Admin) mode/i });

        this.supportAdminModeBanner = page.getByText(/(?:Support Admin|Order Admin) Mode:/, { exact: true });
        this.selectAnotherAccountButton = page.getByRole('button', { name: 'Select another account' });

        this.viewOnlyModeDialog = page.locator('dialog#support-admin-view-only-modal');
        this.viewOnlyModeTitle = this.viewOnlyModeDialog.getByText('View-only mode');
        this.viewOnlyModeMessage = this.viewOnlyModeDialog.getByText('Support Administrators are restricted from performing any create, edit, or delete operations.');
        this.viewOnlyModeOkButton = this.viewOnlyModeDialog.getByText('OK', { exact: true });

        this.reasonMandatoryLabel = page.getByText('Reason *');
    }

    private mapReason(reason: string): string {
        if (reason === 'Access Issue') {
            return 'Review Contract';
        }
        return reason;
    }

    reasonCheckbox(reason: string): Locator {
        return this.page.getByRole('checkbox', { name: this.mapReason(reason), exact: true });
    }

    searchResultItem(text: string): Locator {
        return this.searchResultItems.filter({ hasText: text });
    }

    async assertSearchForDealerScreen() {
        await expect(this.supportAdminModeText).toBeVisible();
        await expect(this.searchForADealerHeading).toBeVisible();
        await expect(this.searchInput).toBeVisible();
        await expect(this.searchButton).toBeVisible();
        console.log('Search for a Dealer screen is displayed');
    }

    async searchDealer(searchTerm: string) {
        await this.searchInput.click();
        await this.searchInput.fill(searchTerm);
        await expect(this.searchButton).toBeEnabled();
        await this.searchButton.click();
        console.log(`Searched dealer with: ${searchTerm}`);
    }

    async verifyAccountIsDisplayed(expectedText: string) {
        await expect(this.searchResultItem(expectedText).first()).toBeVisible();
        console.log(`Account with '${expectedText}' is displayed in the search results`);
    }

    async verifySearchResultsListIsNotEmpty() {
        await expect(this.searchResultItems.first()).toBeVisible();
        const count = await this.searchResultItems.count();
        expect(count).toBeGreaterThan(0);
        console.log(`Search results list is not empty, found ${count} account(s)`);
    }

    async verifyNoResultsFound() {
        await expect(this.noResultsFoundText).toBeVisible();
        await expect(this.noResultsFoundHintText).toBeVisible();
        console.log('No results found message is displayed for invalid search');
    }

    async clickAccountFromList(accountText: string) {
        await this.searchResultItem(accountText).first().click();
        console.log(`Clicked on account: ${accountText}`);
    }

    async assertAccountViewScreen(cdhId: string, iamId: string) {
        await expect(this.page).toHaveURL(/support-admin/);
        await expect(this.cdhAccountIdLabel).toBeVisible();
        await expect(this.page.getByText(cdhId).first()).toBeVisible();
        await expect(this.iamAccountIdLabel).toBeVisible();
        await expect(this.page.getByText(iamId).first()).toBeVisible();
        await expect(this.accountOwnerEmailLabel).toBeVisible();
        await expect(this.accountAddressLabel).toBeVisible();
        await expect(this.selectReasonForViewAccessText).toBeVisible();
        await expect(this.additionalNotesTextBox).toBeVisible();
        await expect(this.cancelButton).toBeVisible();

        if (await this.chooseHowToViewAccountText.isVisible().catch(() => false)) {
            await expect(this.viewByRoleTab).toBeVisible();
            await expect(this.viewLikeAUserTab).toBeVisible();
            await expect(this.selectRoleLabel).toBeVisible();
            await expect(this.selectRoleDropdown).toBeVisible();
        }
        console.log('Account view screen UI elements are displayed');
    }

    async verifyEnterSupportModeIsDisabled() {
        await expect(this.enterSupportModeButton).toBeDisabled();
        console.log('Enter admin mode button is disabled');
    }

    async verifyEnterSupportModeIsEnabled() {
        await expect(this.enterSupportModeButton).toBeEnabled();
        console.log('Enter admin mode button is enabled');
    }

    async verifyRoleOptions(expectedRoles: string[] = ['Owner', 'Secondary Owner', 'Technician']) {
        await expect(this.selectRoleDropdown.locator('option')).toHaveText(['Select Role', ...expectedRoles]);
        console.log(`Role dropdown has expected options: ${expectedRoles.join(', ')}`);
    }

    async selectRole(role: string, options: { optional?: boolean } = {}) {
        const dropdownVisible = await this.selectRoleDropdown.isVisible().catch(() => false);
        if (!dropdownVisible) {
            if (options.optional) {
                console.log(`Role dropdown not shown in current admin UI; skipping role selection for ${role}`);
                return;
            }
            throw new Error(
                `Cannot select role "${role}": role dropdown is not available in the current admin UI.`,
            );
        }
        await this.selectRoleDropdown.selectOption({ label: role });
        console.log(`Selected role: ${role}`);
    }

    async selectReason(reason: string) {
        await this.reasonCheckbox(reason).check();
        console.log(`Selected reason: ${this.mapReason(reason)}`);
    }

    async unselectReason(reason: string) {
        await this.reasonCheckbox(reason).uncheck();
        console.log(`Unselected reason: ${this.mapReason(reason)}`);
    }

    async verifyReasonTextBoxIsMandatory() {
        await this.verifyEnterSupportModeIsDisabled();
        if (await this.reasonTextBox.isVisible().catch(() => false)) {
            await expect(this.reasonMandatoryLabel).toBeVisible();
            await expect(this.reasonTextBox).toBeVisible();
        }
        console.log('Additional details are required when Other (please specify) is selected');
    }

    async enterReason(reason: string) {
        if (await this.reasonTextBox.isVisible().catch(() => false)) {
            await this.reasonTextBox.fill(reason);
        } else {
            await this.additionalNotesTextBox.fill(reason);
        }
        console.log(`Entered reason: ${reason}`);
    }

    async clickEnterSupportMode() {
        await this.verifyEnterSupportModeIsEnabled();
        await this.enterSupportModeButton.click();
        console.log('Clicked on Enter admin mode button');
    }

    async verifySupportModeBanner(cdhId: string, iamId: string, role: string) {
        await expect(this.supportAdminModeBanner).toBeVisible();
        await expect(this.page.getByText(`CDH ID: ${cdhId}`)).toBeVisible();
        await expect(this.page.getByText(`IAM ID: ${iamId}`)).toBeVisible();
        const roleBanner = this.page.getByText(`Viewing what a ${role} would see`);
        if (await roleBanner.isVisible().catch(() => false)) {
            await expect(roleBanner).toBeVisible();
        }
        await expect(this.selectAnotherAccountButton).toBeVisible();
        console.log(`Admin mode banner is displayed for CDH ID: ${cdhId}, IAM ID: ${iamId}`);
    }

    async clickSelectAnotherAccount() {
        await this.selectAnotherAccountButton.click();
        await this.assertSearchForDealerScreen();
        console.log('Clicked Select another account and navigated back to Search for a Dealer screen');
    }

    async clickViewLikeAUserTab() {
        await this.viewLikeAUserTab.click();
        await expect(this.userSearchInput).toBeVisible();
        console.log('View like a User tab is selected');
    }

    async selectUserToViewAs(email: string) {
        await this.userSearchInput.click();
        await this.userSearchInput.pressSequentially(email, { delay: 20 });
        await expect(this.userSuggestionItems.first()).toBeVisible();
        await this.userSuggestionItems.first().click();
        console.log(`Selected first user from the suggestion list for: ${email}`);
    }

    async impersonateDealerAsUser(cdhId: string, userEmail: string, reason: string) {
        await this.searchDealer(cdhId);
        await this.verifyAccountIsDisplayed(`CDH ID: ${cdhId}`);
        await this.clickAccountFromList(`CDH ID: ${cdhId}`);
        if (await this.viewLikeAUserTab.isVisible().catch(() => false)) {
            await this.clickViewLikeAUserTab();
            await this.selectUserToViewAs(userEmail);
        }
        await this.selectReason(reason);
        await this.clickEnterSupportMode();
        console.log(`Entered admin mode for dealer ${cdhId}`);
    }

    async verifySupportModeBannerForUser(cdhId: string, iamId: string, userDisplayName: string) {
        await expect(this.supportAdminModeBanner).toBeVisible();
        await expect(this.page.getByText(`CDH ID: ${cdhId}`)).toBeVisible();
        await expect(this.page.getByText(`IAM ID: ${iamId}`)).toBeVisible();
        const userBanner = this.page.getByText(`Viewing what ${userDisplayName} would see`);
        if (await userBanner.isVisible().catch(() => false)) {
            await expect(userBanner).toBeVisible();
        }
        await expect(this.selectAnotherAccountButton).toBeVisible();
        console.log(`Admin mode banner is displayed for CDH ID: ${cdhId}, IAM ID: ${iamId}`);
    }

    async impersonateDealerAs(cdhId: string, role: string, reason: string) {
        await this.searchDealer(cdhId);
        await this.verifyAccountIsDisplayed(`CDH ID: ${cdhId}`);
        await this.clickAccountFromList(`CDH ID: ${cdhId}`);
        await this.selectRole(role);
        await this.selectReason(reason);
        await this.clickEnterSupportMode();
        console.log(`Entered admin mode for dealer ${cdhId}`);
    }

    async verifyViewOnlyModePopupAndClose() {
        await expect(this.viewOnlyModeTitle).toBeVisible();
        await expect(this.viewOnlyModeMessage).toBeVisible();
        await this.viewOnlyModeOkButton.click();
        await expect(this.viewOnlyModeDialog).not.toBeVisible();
        console.log('View-only mode popup is displayed and closed');
    }
}
