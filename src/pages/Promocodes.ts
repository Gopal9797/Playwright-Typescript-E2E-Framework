import { expect, Locator, Page } from "@playwright/test";
import testdata from './testdata.json';

export class PromoCodesPage {
   readonly page: Page;
   readonly promoCodeHeadingText: Locator;
   readonly promoCodeAndDiscountHeadings: Locator;
   readonly promoCodeChildHeadingText: Locator;
   readonly promoCodeTextBox: Locator;
   readonly promoCodeApplyButton: Locator;
   readonly promoCodeRemoveButton: Locator;
   readonly promoCodeDiscountIcon: Locator;
   readonly promoCodeDiscountText: Locator;
   readonly promoCodeDiscountValueText: Locator;
   readonly placeOrderButton: Locator;


   constructor(page: Page) {
      this.page = page;
      this.promoCodeHeadingText = page.getByRole('heading', { name: 'Promo Code', exact: true });
      this.promoCodeAndDiscountHeadings = page.getByRole('heading', { name: 'Promotions, Billing and Discretionary Discount', });
      this.promoCodeChildHeadingText = page.getByRole('heading', { name: 'Maximum of 1 Promo Code can be used at one time. The Promo Code will be applied instantly.', exact: true });
      this.promoCodeTextBox = page.getByPlaceholder('Promo Code');
      this.promoCodeApplyButton = page.getByTestId('promo-code-apply-btn');
      this.promoCodeRemoveButton = page.getByTestId('promo-code-remove-btn');
      this.promoCodeDiscountIcon = page.getByRole('img', { name: 'discount' });
      this.promoCodeDiscountText = page.locator('#discount-promo');
      this.promoCodeDiscountValueText = page.locator('td[aria-labelledby="discount-promo"]');
      this.placeOrderButton = page.getByTestId('place-or-reprice-button');
   }

   async verifyPromoCodePageUIElements() {
      await expect(this.promoCodeHeadingText).toBeVisible();
      await expect(this.promoCodeAndDiscountHeadings).toBeVisible();
      await expect(this.promoCodeChildHeadingText).toBeVisible();
      await expect(this.promoCodeTextBox).toBeVisible();
   }

   async verifyPromoCodeIsNotAvailableForDraftContract() {
      await expect(this.promoCodeHeadingText).not.toBeVisible();
      await expect(this.promoCodeTextBox).not.toBeVisible();
   }

   async placeOrderButtonIsDisabled() {
      await this.placeOrderButton.waitFor({ state: 'attached' });
      await expect(this.placeOrderButton).toBeDisabled();
   }

   async placeOrderButtonIsEnabled() {
      await expect(this.placeOrderButton).toBeEnabled();
   }

   async enterPromoCode(promoCode: string) {
      console.log(`Waiting for 45 seconds before entering the promo code to bypass the issue`);
      await this.page.waitForTimeout(45000); // waits 45 seconds to bypass this issue https://jira.trimble.tools/browse/DXP-471 
      await this.promoCodeTextBox.fill(promoCode);
   }

   async clickOnApplyButton() {
      try {
         await this.promoCodeApplyButton.click();
      }
      catch (error) {
         console.error("Error clicking on Apply button:", error);
         await expect(this.page.getByText('The quote is currently being created in the background', { exact: false })).toBeVisible({ timeout: 5000 });
         await this.page.waitForTimeout(10000); // wait for 10 seconds before trying again
         await this.promoCodeApplyButton.click(); // try clicking the apply button again
      }
   }

   async clickOnRemoveButton() {
      await this.promoCodeRemoveButton.click();
   }

   async removeButtonIsVisible() {
      await expect(this.promoCodeRemoveButton).toBeVisible();
   }

   async verifyPromoCodeErrorMessage(expectedMessage: string) {
      await expect(this.page.getByText(expectedMessage, { exact: false })).toBeVisible({ timeout: 30000 });
      await expect(this.promoCodeDiscountIcon).not.toBeVisible({ timeout: 3000 });
   }

   async verifyPromoDiscountIsDisplayed() {
      await expect(this.promoCodeDiscountText).toBeVisible();
      await expect(this.promoCodeDiscountValueText).toBeVisible();
   }

   async verifyPromoCodeIconIsDisplayedOnSuccessfulApplyOfCode() {
      await expect(this.promoCodeDiscountIcon).toBeVisible();
   }
}