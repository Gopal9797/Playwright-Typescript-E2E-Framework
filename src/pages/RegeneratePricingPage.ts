import { expect, Locator, Page } from "@playwright/test";
export class RegeneratePricingPage {

    readonly page: Page;
    readonly regenerateAlertTitle: Locator;
    readonly regenerateAlertText: Locator;
    readonly bannerAlert: Locator;
    readonly goToAmendmentButtonInBanner: Locator;
    readonly regeneratePriceButtonInBanner: Locator;
    readonly regeneratePriceBtnInBottomOfContractsScreen: Locator;
    readonly regeneratePriceBtnInBottomOfAmendmentSummaryScreen: Locator;


    constructor(page: Page) {
        this.page = page;
        const amendmentAlertBanner = page.getByTestId('amendment-alert');
        this.bannerAlert = amendmentAlertBanner;
        this.regenerateAlertTitle = amendmentAlertBanner.getByTestId('alert-title');
        this.regenerateAlertText = amendmentAlertBanner.getByText(
            'Mid-term amendment pricing is adjusted with proration over time. Review the amendment to update the pricing and resubmit.',
        );
        this.goToAmendmentButtonInBanner = amendmentAlertBanner.getByRole('button', { name: 'Go to Amendment' });
        this.regeneratePriceButtonInBanner = amendmentAlertBanner.getByRole('button', { name: 'refresh Regenerate Price' });
        this.regeneratePriceBtnInBottomOfAmendmentSummaryScreen = page.getByTestId('amendment-screen-place-or-reprice-button');
        this.regeneratePriceBtnInBottomOfContractsScreen = page.getByTestId('place-or-reprice-button');
    }

    // getByRole('alert')
    // getByRole('alert').locator('svg')await page.getByRole('button', { name: 'Go to Amendment' }).click();
    // await page.getByTestId('back-to-contract-button').click();
    // await expect(page.getByTestId('alert-title')).toBeVisible();
    // await expect(page.getByTestId('alert-title')).toContainText('Price Change for Amendment Q-24271001');
    // getByRole('button', { name: 'Go to Amendment' })
    // getByTestId('place-or-reprice-button')
    // getByRole('alert').getByRole('button', { name: 'refresh Regenerate Price' })
    // getByTestId('amendment-screen-place-or-reprice-button')



    async assertregeneratePricingBannerInSummaryScreen() {
        await expect(this.bannerAlert).toBeVisible();
        await expect(this.regenerateAlertText).toContainText('Mid-term amendment pricing is adjusted with proration over time.');
        await expect(this.goToAmendmentButtonInBanner).toBeVisible();
        await expect(this.regeneratePriceBtnInBottomOfContractsScreen).toBeVisible();
    }

    async assertRegeneratePriceButtonIsNotVisibleInContractsScreen() {
        await expect(this.regeneratePriceBtnInBottomOfContractsScreen).not.toBeVisible();
    }

    async verifyQuoteIdIsShownInregeneratePricingBanner(externalQuoteId: string) {
        await expect(this.regenerateAlertTitle).toHaveText(`Price Change for Amendment ${externalQuoteId}`);
    }

    async clickGoToAmendmentButtonInBannerShouldTakeToAmendmentDetailsScreen() {
        await this.goToAmendmentButtonInBanner.click();
    }

    async assertregeneratePricingBannerInAmendmentSummaryScreen() {
        await expect(this.bannerAlert).toBeVisible();
        await expect(this.regenerateAlertText).toContainText('Mid-term amendment pricing is adjusted with proration over time.');
        await expect(this.regeneratePriceButtonInBanner).toBeVisible();
        await expect(this.regeneratePriceBtnInBottomOfAmendmentSummaryScreen).toBeVisible();
    }

    async clickOnregeneratePriceButtonInAmendmentSummaryScreen() {
        await this.regeneratePriceBtnInBottomOfAmendmentSummaryScreen.click();
    }
}