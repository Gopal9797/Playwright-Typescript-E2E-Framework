import { expect, Locator, Page } from "@playwright/test";

export class SalesforcePage {
    readonly page: Page;
    readonly searchTextbox: Locator;
    readonly searchLocator: Locator;
    readonly OrdersLocator: Locator;
    readonly quotesLocator: Locator;
    readonly EditDeniedParty: Locator;
    readonly EditCreditApprovalStatus: Locator;
    readonly DropDownDeniedParty: Locator;
    readonly DropDownCreditApprovalStatus: Locator;
    readonly ApprovedDeniedPartyOption: Locator;
    readonly ApprovedCreditApprovalStatusOption: Locator;
    readonly SaveButtonLocator: Locator;
    readonly orderValidationMessage: Locator;
    readonly DropDownTaxStatus: Locator;
    readonly PassedTaxStatus: Locator;
    readonly DropDownOrderValidationStatus: Locator;
    readonly CompletedOrderValidationStatus: Locator;
    readonly creditOverrideCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchTextbox = page.locator('[aria-label="Search"]');
        this.searchLocator = page.locator('xpath=//input[@placeholder="Search..."]');
        this.OrdersLocator = page.locator('xpath=//a[contains(@href,"/lightning/r/8")]').last();
        this.quotesLocator = page.locator('xpath=//a[contains(@href,"/lightning/r/a")]').last();
        this.EditDeniedParty = page.locator('//button[@title="Edit Denied Party"]').first();
        this.EditCreditApprovalStatus = page.locator('[title="Edit Credit Approval Status"]');
        this.DropDownDeniedParty = page.locator('[aria-label="Denied Party"]').first();
        this.DropDownCreditApprovalStatus = page.locator('[aria-label="Credit Approval Status"]').first();
        this.DropDownTaxStatus = page.locator('[aria-label="Tax Status"]').first();
        this.DropDownOrderValidationStatus = page.locator('[aria-label="Order Validation Status"]').first();
        this.PassedTaxStatus = page.locator('[data-value="Passed"]').first();
        this.ApprovedDeniedPartyOption = page.locator('[data-value="Approved"]').first();
        this.ApprovedCreditApprovalStatusOption = page.locator('[data-value="Approved"]').last();
        this.CompletedOrderValidationStatus = page.locator('[data-value="Completed"]').first();
        this.SaveButtonLocator = page.locator('xpath=//button[@name="SaveEdit"]');
        this.orderValidationMessage = page.locator('xpath=//b[contains(text(),"The order validation is successful.")]').last();
        this.creditOverrideCheckbox = page.locator('xpath=//input[@name="TNV_Order_Credit_Override_Hold__c"]');
    }

    async navigateToOrders(contractGuid: string) {
        await expect(this.searchTextbox).toBeVisible({ timeout: 60000 });
        await this.page.waitForTimeout(5000);
        await this.searchTextbox.click();
        await expect(this.searchLocator).toBeVisible({ timeout: 10000 });
        await this.searchLocator.fill(contractGuid);
        await this.page.waitForTimeout(2000);
        await this.page.keyboard.press('Enter');
        await expect(this.OrdersLocator).toBeVisible({ timeout: 10000 });
        await this.OrdersLocator.click();
        console.log('Navigated to Orders page successfully');
    }

    async navigateToOrdersUsingOrderID(orderID: string) {
        const orderUrl = ``;
        await this.page.goto(orderUrl);
        console.log('Navigated to Orders page successfully using Order ID');
    }

    async doWorkAroundOnOrder() {
        await this.page.waitForTimeout(5000);
        for (let i = 0; i < 3; i++) {
            await this.page.keyboard.press('PageDown');
        }
        console.log('Starting Workaround on Order');
        await expect(this.EditDeniedParty).toBeVisible({ timeout: 60000 });
        await this.EditDeniedParty.click();
        await this.page.waitForTimeout(5000);
        await expect(this.DropDownDeniedParty).toBeVisible({ timeout: 10000 });
        await this.DropDownDeniedParty.click();
        await expect(this.ApprovedDeniedPartyOption).toBeVisible({ timeout: 10000 });
        await this.ApprovedDeniedPartyOption.click();
        console.log('Denied Party updated to Approved successfully');
        await expect(this.DropDownCreditApprovalStatus).toBeVisible({ timeout: 10000 });
        await this.DropDownCreditApprovalStatus.click();
        await expect(this.ApprovedCreditApprovalStatusOption).toBeVisible({ timeout: 10000 });
        await this.ApprovedCreditApprovalStatusOption.click();
        console.log('Credit Approval Status updated to Approved successfully');
        await expect(this.DropDownTaxStatus).toBeVisible({ timeout: 10000 });
        await this.DropDownTaxStatus.click();
        await expect(this.PassedTaxStatus).toBeVisible({ timeout: 10000 });
        await this.PassedTaxStatus.click();
        console.log('Tax Status updated to Passed successfully');
        await expect(this.DropDownOrderValidationStatus).toBeVisible({ timeout: 10000 });
        await this.DropDownOrderValidationStatus.click();
        await this.page.waitForTimeout(500);
        await this.CompletedOrderValidationStatus.click();
        await this.page.waitForTimeout(500);
        console.log('Order Validation Status updated to Completed successfully');
        await this.page.waitForTimeout(500);
        await this.SaveButtonLocator.click();
        console.log('Workaround on Order completed successfully');
        // try {
        //     await expect(this.orderValidationMessage).toBeVisible({ timeout: 60000 });
        // }
        // catch (error) {
        //     console.log('Order validation message was not displayed within the timeout period');
        //     await this.creditOverrideCheckbox.check();
        //     await this.page.waitForTimeout(500);
        //     console.log('Credit Override checkbox checked successfully');
        //     await this.SaveButtonLocator.click();
        //     await expect(this.orderValidationMessage).toBeVisible({ timeout: 60000 });
        // }
        // console.log('Order validation message is displayed successfully');

        await this.page.reload();
    }
}
