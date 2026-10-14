import { expect, Locator, Page } from "@playwright/test";

export class VolumeDiscountPage {
   readonly page: Page;
   readonly placeOrderButton: Locator;
   readonly volumeDiscountText: Locator;
   readonly volumeDiscountAmt: Locator;
   readonly lineItemExpand: Locator;
   readonly volumeDiscountTextLine: Locator;
   readonly amendVolumeDiscountText: Locator;
   readonly deleteDraftButton: Locator;
   readonly deleteButton: Locator;

   constructor(page: Page) {
      this.page = page;
      this.placeOrderButton = page.getByTestId('place-or-reprice-button');
      this.volumeDiscountText = page.locator('p').filter({ hasText: 'Volume Discount' }).last();
      this.volumeDiscountAmt = page.locator('td[aria-labelledby="discount-volume"] p').first();
      this.lineItemExpand = page.getByRole('button', { name: 'Pricing Breakdown $' });
      this.volumeDiscountTextLine = page.locator('p').filter({ hasText: 'Volume Discount' }).first();
      this.amendVolumeDiscountText = page.locator('slot-fb:has-text("Volume Discount")');
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

   async verifyVolumeDiscountUIElements() {
      await this.volumeDiscountText.scrollIntoViewIfNeeded();
      await expect(this.volumeDiscountText).toBeVisible();
      await expect(this.volumeDiscountAmt).toBeVisible();
   }

   async verifyVolumeDiscountLineItems() {
      await this.volumeDiscountText.scrollIntoViewIfNeeded();
      await this.lineItemExpand.click();
      await expect(this.volumeDiscountTextLine).toBeVisible();
   }

   async verifyVolumeDiscountInAmendment() {
      await this.amendVolumeDiscountText.scrollIntoViewIfNeeded();
      await expect(this.amendVolumeDiscountText).toBeVisible();
   }

   async verifyVolumeDiscountNotPresent() {
      await expect(this.volumeDiscountText).toBeHidden();
   }
}
