import { expect, Locator, Page } from "@playwright/test";

export class AxpContractPage {
    readonly page: Page;
    readonly contractHeading: Locator;
    readonly cookieAcceptButton: Locator;
    readonly createAmendmentButton: Locator;
    readonly termsCheckbox: Locator;
    readonly acceptTermsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contractHeading = page.locator('xpath=//h1[contains(text(),"Contract")]');
        this.cookieAcceptButton = page.locator('#onetrust-accept-btn-handler');
        this.createAmendmentButton = page.getByTestId('amend-contract-btn');
        this.termsCheckbox = this.page.locator('xpath=//input[@type="checkbox"]').first();
        this.acceptTermsButton = this.page.getByTestId('activate-now-button');
    }

    async goToContract(customerId: string, contractGuid: string) {
        await this.page.goto(`/${customerId}/contracts/${contractGuid}`);
        await this.dismissCookieBannerIfVisible();
        await this.assertContractLoaded(contractGuid);
    }

    async assertContractLoaded(contractGuid: string) {
        await expect(this.page).toHaveURL(new RegExp(`/contracts/${contractGuid}`), { timeout: 40000 });
        await expect(this.contractHeading).toBeVisible({ timeout: 30000 });
    }

    async clickCreateAmendment(contractNumber: string) {
        await this.createAmendmentButton.click();
        await expect(this.page.locator('h1', { hasText: 'Create new amendment' })).toBeVisible({ timeout: 30000 });
        // Assert that the contract number is visible on the top - <p class="MuiTypography-root MuiTypography-body1 apply-sub-element-gap ac-sub-heading-text css-uaq774">Contract 2328, Ultimate Positioning Group</p>
        const escapedContractNumber = contractNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const contractSubHeading = this.page.locator('p.ac-sub-heading-text', {
            hasText: new RegExp(`^\\s*Contract\\s+${escapedContractNumber}\\b`),
        });
        await expect(contractSubHeading).toBeVisible({ timeout: 30000 });
    }

    private async dismissCookieBannerIfVisible() {
        if (await this.cookieAcceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.cookieAcceptButton.click();
        }
    }

    // Check the checkbox and Click on Accept Terms button if the terms and conditions popup appears after clicking submit on amendment creation
    async handleTermsAndConditionsPopup() {
        if (await this.termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.termsCheckbox.check();
            await this.acceptTermsButton.click();
            console.log('Terms and Conditions accepted');
            await expect(this.acceptTermsButton).not.toBeVisible({ timeout: 10000 });
        }
    }
}

export default AxpContractPage;
