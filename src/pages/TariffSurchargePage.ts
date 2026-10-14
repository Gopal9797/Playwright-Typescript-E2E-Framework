import { expect, Locator, Page } from "@playwright/test";

export class TariffSurchargePage {
   readonly page: Page;
   readonly placeOrderButton: Locator;
   readonly tariffSurchargeText: Locator;
   readonly tariffSurchargeAmt: Locator;
   readonly lineItemExpand: Locator;
   readonly tariffSurchargeTextLine: Locator;
   readonly amendTariffSurchargeText: Locator;
   readonly deleteDraftButton: Locator;
   readonly deleteButton: Locator;

   constructor(page: Page) {
      this.page = page;
      this.placeOrderButton = page.getByTestId('place-or-reprice-button');
      this.tariffSurchargeText = page.locator('p').filter({ hasText: 'Tariff Surcharge' }).last();
      this.tariffSurchargeAmt = page.locator('td[aria-labelledby="surcharge"] p').first();
      this.lineItemExpand = page.getByRole('button', { name: 'Pricing Breakdown $' });
      this.tariffSurchargeTextLine = page.locator('p').filter({ hasText: 'Tariff Surcharge' }).first();
      this.amendTariffSurchargeText = page.locator('slot-fb:has-text("Tariff Surcharge")');
      this.deleteDraftButton = page.getByRole('button', { name: 'Delete Draft' });
      this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
   }

   async placeOrder() {
      await this.placeOrderButton.click();
   }

   async deleteDraft() {
      await this.deleteDraftButton.click();
      await this.deleteButton.click();
   }

   async verifyTariffSurchargeUIElements() {
      await this.tariffSurchargeText.scrollIntoViewIfNeeded();
      await expect(this.tariffSurchargeText).toBeVisible();
      await expect(this.tariffSurchargeAmt).toBeVisible();
   }

   async verifyTariffSurchargeLineItems() {
      await this.tariffSurchargeText.scrollIntoViewIfNeeded();
      await this.lineItemExpand.click();
      await expect(this.tariffSurchargeTextLine).toBeVisible();
   }

   async verifyTariffSurchargeInAmendment() {
      await this.amendTariffSurchargeText.scrollIntoViewIfNeeded();
      await expect(this.amendTariffSurchargeText).toBeVisible();
   }

   async verifyTariffSurchargeNotPresent() {
      await expect(this.tariffSurchargeText).toBeHidden();
   }
}
