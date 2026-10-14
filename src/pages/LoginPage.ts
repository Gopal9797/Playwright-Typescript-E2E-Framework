import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly userNameEmailTxt: Locator;
    userEmailID: string | undefined;
    readonly continueSubmitBtn: Locator;
    readonly passwordTxt: Locator;
    readonly cookieAcceptAllCookieSelector: Locator;
    readonly settingsButton: Locator;
    readonly signOutButton: Locator;
    readonly signOutText: Locator;
    readonly userEmailText: Locator | undefined;
    readonly userProfileImage: Locator;
    readonly moreFromTrimbleText: Locator;
    readonly moreFromTrimbleUrl: Locator;
    readonly goToTrimbleIncHomePage: Locator;
    readonly relaunchText: Locator;
    readonly closeWindowText: Locator;
    readonly autoLogoutErrorMessage: Locator;
    readonly userNameSITUATLocator: Locator;
    readonly passwordSITUATLocator: Locator;
    readonly signInButtonSITUATLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cookieAcceptAllCookieSelector = page.getByText('Accept All Cookies', { exact: true }).last();
        this.userNameEmailTxt = page.locator('input#username_email[name="username"]');
        this.continueSubmitBtn = page
            .locator(
                'modus-wc-button[data-test-id="login-submit-button"], ' +
                'modus-wc-button[data-test-id="password-submit-button"]',
            )
            .getByRole('button', { name: 'Continue', exact: true })
            .filter({ visible: true });
        this.passwordTxt = page
            .locator('modus-wc-text-input[data-test-id="login-password-input"]')
            .locator('input#login-password-input[type="password"]');

        this.settingsButton = page.getByRole('button', { name: 'Open Settings' });
        this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
        this.signOutText = page.getByRole('heading', { name: 'You\'ve been signed out' });

        this.userProfileImage = page.getByRole('img', { name: 'Mandi Moris' });
        this.moreFromTrimbleText = page.getByText('More from Trimble.com');
        this.moreFromTrimbleUrl = page.getByRole('menuitem', { name: 'More from Trimble.com' })
        this.goToTrimbleIncHomePage = page.getByRole('link', { name: 'Go to Trimble Inc. Home Page' }).first();
        this.relaunchText = page.getByText('Please relaunch your application to sign in again.');
        this.closeWindowText = page.getByText('You may close this window.');
        this.autoLogoutErrorMessage = page.getByText('You do not have any accounts, logging out...');
        this.userNameSITUATLocator = page.getByPlaceholder('Username').first();
        this.passwordSITUATLocator = page.getByPlaceholder('Password').first();
        this.signInButtonSITUATLocator = page.getByRole('button', { name: 'Sign In' }).first();
    }

    async loginIntoApplication(username: string | undefined, password: string | undefined) {
        await this.userNameEmailTxt.click();
        console.log(`Username: ${username}`);
        await this.userNameEmailTxt.fill(username!);
        this.userEmailID = username!;
        await this.page.keyboard.press('Tab');
        await this.continueSubmitBtn.click();

        await this.passwordTxt.click();
        await this.passwordTxt.fill(password!);
        await this.passwordTxt.press('Enter');
    }

    async assertTrimbleIncHomePage() {
        await this.settingsButton.click();
        await expect(this.page.getByText(process.env.BPC_ACCOUNT_EMAIL!)).toBeVisible();
        await expect(this.moreFromTrimbleText).toBeVisible();
        await this.moreFromTrimbleUrl.click();
        await expect(this.goToTrimbleIncHomePage.first()).toBeVisible();
    }

    async logoutFromApplication() {
        await this.settingsButton.click();
        await expect(this.page.getByText(process.env.BPC_ACCOUNT_EMAIL!)).toBeVisible();
        await expect(this.moreFromTrimbleText).toBeVisible();
        await expect(this.signOutButton).toBeVisible();
        await this.signOutButton.click();
    }

    async validateAutoLogoutFromApplication() {
        await expect(this.autoLogoutErrorMessage).toBeVisible();
        console.log('User is auto logged out from the application due to no accounts');
    }

    async validateAfterLogoutChecks() {
        console.log('User is logged out from the application successfully');
        await expect(this.userNameEmailTxt).toBeVisible();
        await this.page.goBack();
        await expect(this.userNameEmailTxt).toBeVisible();

        await this.page.goto('/');
        await expect(this.userNameEmailTxt).toBeVisible();
    }

    async loginIntoSITUATApplication(username: string | undefined, password: string | undefined) {
        await this.userNameEmailTxt.click();
        await this.userNameEmailTxt.fill(username!);
        this.userEmailID = username!;
        await this.page.keyboard.press('Tab');
        await this.continueSubmitBtn.click();

        await expect(this.userNameSITUATLocator).toBeVisible();
        await this.userNameSITUATLocator.click();
        await this.userNameSITUATLocator.fill(username!);
        await this.page.keyboard.press('Tab');
        await expect(this.passwordSITUATLocator).toBeVisible();
        await this.passwordSITUATLocator.click();
        await this.passwordSITUATLocator.fill(password!);
        await this.page.keyboard.press('Enter');
    }
}
export default LoginPage;