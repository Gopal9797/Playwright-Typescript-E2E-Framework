import { expect, Locator, Page } from "@playwright/test";

export class DealerInitiatedTrialsPage {
   readonly page: Page;
   readonly placeOrderButton: Locator;
   readonly trialSummaryScreenText: Locator;
   readonly dealerInitiatedTrialsText: Locator;
   readonly lineItemExpand: Locator;
   readonly dealerInitiatedTrialsTextLine: Locator;
   readonly deleteDraftButton: Locator;
   readonly deleteButton: Locator;
   readonly trialContract: Locator;
   readonly contractTypeText: Locator;
   readonly amendContractButton: Locator;
   readonly renewalPlanningTab: Locator;
   readonly trialAvailableCountText: Locator;
   readonly trialLimitReachedText: Locator;
   readonly trialIneligibleMessageText: Locator;
   readonly trialOrLimitErrorAlert: Locator;
   readonly amendmentTab: Locator;
   readonly renewalTab: Locator;
   readonly customersListComboBox: Locator;
   readonly loadCustomersDropdown: Locator;
   readonly continueButton: Locator;
   readonly continueButtonInShipToPage: Locator;

   constructor(page: Page) {
      this.page = page;
      this.amendmentTab = page.getByRole('button', { name: 'Amendments' });
      this.placeOrderButton = page.getByTestId('place-or-reprice-button');
      this.trialSummaryScreenText = page.locator('//h4[@aria-label="contract-number"]/span[starts-with(normalize-space(text()[1]), "Trial #")]');
      this.dealerInitiatedTrialsText = page.locator('p').filter({ hasText: /Dealer Initiated Trial(s)?|Trial/i }).last();
      this.lineItemExpand = page.getByRole('button', { name: 'Pricing Breakdown $' });
      this.dealerInitiatedTrialsTextLine = page.locator('p').filter({ hasText: /Dealer Initiated Trial(s)?|Trial/i }).first();
      this.deleteDraftButton = page.getByRole('button', { name: 'Delete Draft' });
      this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
      this.trialContract = page.locator('label').filter({ hasText: /Trial Contract|Trail Contract/i }).first();
      this.contractTypeText = page.getByText('Contract Type', { exact: true });
      this.amendContractButton = page.getByRole('link', { name: 'Amend Contract' });
      this.renewalPlanningTab = page.getByRole('button', { name: 'renewal-planning-toggle' });
      this.renewalTab = page.getByRole('button', { name: 'Renewal Planning' });
      this.trialAvailableCountText = page.locator('h6').filter({ hasText: /^Trials available:\s*\d+$/i }).first();
      this.trialLimitReachedText = page.getByText('Trial limit reached: 3/3', { exact: true });
      this.trialIneligibleMessageText = page.getByText(/(Trial|Trail).*(no longer eligible|not eligible|limit reached)/i).first();
      this.trialOrLimitErrorAlert = page.getByRole('alert').filter({ hasText: /(trial|trail|eligible|limit)/i }).first();
      this.customersListComboBox = page.getByRole('combobox', { name: 'Start typing to find a customer' });
      this.loadCustomersDropdown = page.locator('[placeholder="Start typing to find a customer"][aria-expanded="true"]');
      this.continueButton = page.locator('button[type=submit]').first();
      this.continueButtonInShipToPage = page.getByRole('button', { name: 'Continue' });
   }

   async selectTrial() {
      await this.trialContract.click();
   }

   async verifyOptionToChooseTrialContractType() {
      await expect(this.trialContract).toBeVisible();
   }

   async selectTrialCustomerWithPartialName(partialCustomerName: string, customerOptionIndex: number) {
      await this.page.waitForTimeout(1000);
      await this.customersListComboBox.click();
      await expect(this.loadCustomersDropdown).toBeVisible({ timeout: 90000 });
      await this.customersListComboBox.fill(partialCustomerName);
      await expect(this.customersListComboBox).toHaveValue(partialCustomerName, { timeout: 10000 });
      const customerOption = this.page.getByRole('option', { name: partialCustomerName }).nth(customerOptionIndex);
      await expect(customerOption).toBeVisible();
      await customerOption.click();
      await this.page.waitForTimeout(2000);
      await this.continueButton.click();
      await this.continueButtonInShipToPage.click();
   }

   async placeOrder() {
      await this.placeOrderButton.click();
   }

   async getTrialContractIDFromHeader() {
      await expect(this.trialSummaryScreenText).toContainText(/Trial #\d+/, { timeout: 30000 });
      const contractNumberText = await this.trialSummaryScreenText.evaluate((el) =>
         (el.childNodes[0]?.textContent || '').trim()
      );
      expect(contractNumberText).toMatch(/^Trial #\d+$/);
      const headerText = await this.trialSummaryScreenText.textContent();
      const contractID = headerText?.match(/Trial #(\d+)/)?.[1];
      if (!contractID) {
         throw new Error('Trial contract ID not found in header text');
      }
      console.log(`Extracted Trial Contract ID: ${contractID}`);
      return contractID;
   }

   async verifyAmendmentAndRenewalArePreventedOnTrialContract() {
      await expect(this.amendmentTab).not.toBeVisible();
      console.log(`Amendment tab is not visible for trial contract`);
      await expect(this.renewalTab).not.toBeVisible();
      console.log(`Renewal tab is not visible for trial contract`);

   }

   async hasTrialLimitReachedState(): Promise<boolean> {
      const limitReachedVisible = await this.trialLimitReachedText.isVisible().catch(() => false);
      const ineligibleVisible = await this.trialIneligibleMessageText.isVisible().catch(() => false);
      return limitReachedVisible || ineligibleVisible;
   }

   async verifyTrialLimitReachedMessage() {
      await expect(this.trialLimitReachedText.or(this.trialIneligibleMessageText)).toBeVisible();
      console.log(`Trial limit reached message is visible: ${await this.trialLimitReachedText.textContent() || await this.trialIneligibleMessageText.textContent()}`);

   }

   async verifyTrialAvailableCountIsVisible() {
      await expect(this.trialAvailableCountText).toBeVisible();
   }

   async verifyTrialIneligibleMessage() {
      await expect(this.trialIneligibleMessageText.or(this.trialOrLimitErrorAlert)).toBeVisible();
   }

   async deleteDraft() {
      await this.deleteDraftButton.click();
      await this.deleteButton.click();
   }

   async verifyDealerInitiatedTrialsUIElements() {
      await this.dealerInitiatedTrialsText.scrollIntoViewIfNeeded();
      await expect(this.dealerInitiatedTrialsText).toBeVisible();
   }

   async verifyDealerInitiatedTrialsLineItems() {
      await this.dealerInitiatedTrialsText.scrollIntoViewIfNeeded();
      await this.lineItemExpand.click();
      await expect(this.dealerInitiatedTrialsTextLine).toBeVisible();
   }
}