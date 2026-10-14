import { expect, Page } from "@playwright/test";
import { ContractsPage } from "./ContractsPage";
import { SummaryScreenPage } from "./ContractSummaryScreenPage";

export class RolesAndPermissionsPage {
    readonly page: Page;
    private contractsPage: ContractsPage;
    private summaryScreenPage: SummaryScreenPage;

    constructor(page: Page) {
        this.page = page;
        this.contractsPage = new ContractsPage(page);
        this.summaryScreenPage = new SummaryScreenPage(page);
    }

    async verifyCreateContractButtonIsNotVisible() {
        await this.contractsPage.assertContractsPage();
        await expect(this.contractsPage.createANewContractButton).not.toBeVisible();
        console.log('Create contract button is not visible for technician');
    }

    async verifyAmendContractButtonIsNotVisible() {
        await this.contractsPage.verifyContractDetailsScreenIsVisible();
        await expect(this.summaryScreenPage.amendContractButton).not.toBeVisible();
        console.log('Amend contract button is not visible for technician on active contract');
    }

    async verifyPlaceOrderButtonIsNotVisible() {
        await this.contractsPage.verifyContractDetailsScreenIsVisible();
        await expect(this.summaryScreenPage.placeOrderButton).not.toBeVisible();
        console.log('Place order button is not displayed for technician on draft contract');
    }
}
