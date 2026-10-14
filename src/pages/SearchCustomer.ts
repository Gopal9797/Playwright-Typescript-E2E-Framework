import { expect, Locator, Page } from "@playwright/test";
export class SearchCustomer {

    readonly page: Page;
    readonly customerTab: Locator;
    readonly searchTextBox: Locator;
    searchKeyword: string | undefined;
    readonly searchResult: Locator;
    readonly expandBtnEX: Locator;
    readonly expandBtnCol: Locator;
    readonly emailID: Locator;
    readonly ownerName: Locator;
    readonly contactsList: Locator;
    readonly contractID: Locator;
    readonly detailsTab: Locator;
    readonly copyIcon: Locator;
    readonly dealercopyIcon: Locator;
    readonly notFound: Locator;
    readonly noActive: Locator;
    readonly clear_Search: Locator;
    readonly searchText: Locator;
    readonly createContract: Locator;
    readonly continueBtn: Locator;
    readonly verifyTerm: Locator;
    readonly amendmentsTab: Locator;
    readonly cancelBtn: Locator;




    constructor(page: Page) {
        this.page = page;

        this.customerTab = page.getByRole('link', { name: 'Customers', exact: true });
        this.searchTextBox = page.getByPlaceholder('Search by company name, TID email, first name, or last name');
        this.searchResult = page.getByTitle('Gilmore Landscape Architecture LLC');
        this.expandBtnEX = page.getByLabel('Expand');
        this.expandBtnCol = page.getByLabel('Collapse');
        this.emailID = page.locator('[data-testid="user-email"]');
        this.ownerName = page.locator('[data-testid="user-full-name"]');
        this.contactsList = page.locator('xpath=//p[contains(normalize-space(),"Contracts")]');
        this.contractID = page.locator('xpath=//a[contains(@href,"/contracts/") and text()]').first();
        this.detailsTab = page.getByText('Contract Details', { exact: true }).first();
        this.copyIcon = page.getByTitle('Copy Email').first();
        this.dealercopyIcon = page.getByTitle('Copy Email').last();
        this.notFound = page.getByText('No results found.');
        this.noActive = page.getByText('No rows');
        this.clear_Search = page.getByText('Clear search');
        this.searchText = page.getByPlaceholder('Search by company name, TID email, first name, or last name');
        this.createContract = page.getByText('Create new contract');
        this.continueBtn = page.getByRole('button', { name: 'Continue' });
        this.cancelBtn = page.locator('xpath=(//button[normalize-space()="Cancel"])[7]');
        this.verifyTerm = page.getByText('Contract Terms');
        this.amendmentsTab = page.getByText('Amendments').first();

    }

    async searchCustomersbyName(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(5000);
        await this.expandBtnEX.click();
        await expect(this.ownerName.filter({ hasText: searchValue })).toBeVisible();
        await this.expandBtnCol.click();

    }

    async searchCustomersbyTID(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(5000);
        await this.expandBtnEX.click();
        await expect(this.emailID.filter({ hasText: searchValue })).toBeVisible();
        await this.expandBtnCol.click();

    }

    async searchCustomersbyCompany(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(5000);
        await this.expandBtnEX.click();
        await expect(this.page.getByRole('link', { name: searchKeyword })).toBeVisible();
        await this.expandBtnCol.click();

    }


    async searchCustomersbynonexistingName(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(5000);
        await expect(this.notFound.filter({ hasText: 'No results found.' })).toBeVisible();


    }

    async searchCustomersbynonexistingTID(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(5000);
        await expect(this.notFound.filter({ hasText: 'No results found.' })).toBeVisible();

    }

    async searchCustomersbynonexistingCompany(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(5000);
        await expect(this.notFound.filter({ hasText: 'No results found.' })).toBeVisible();

    }

    async clearSearch(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(5000);
        await this.clear_Search.click();
        await this.page.waitForTimeout(3000);
        await expect(this.searchText).toBeVisible();
    }


    async viewContracts(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(30000);
        await this.page.getByRole('link', { name: searchKeyword }).click();
        await this.page.waitForTimeout(1000);
        await expect(this.contactsList.filter({ hasText: 'Contracts (' })).toBeVisible();
    }


    async noActiveContracts(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(30000);
        await expect(this.notFound).toBeVisible();
    }
    async clickCustomer(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(30000);
        await this.expandBtnEX.click();
        await this.page.getByRole('link', { name: searchKeyword }).click();
        await expect(this.contactsList.filter({ hasText: 'Contracts (' })).toBeVisible();
        await this.contractID.click();
       await this.page.getByRole('link', { name: searchValue }).click();

    }


    async navigateTocustomerpage(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(30000);
        await this.expandBtnEX.click();
        await this.page.getByRole('link', { name: searchKeyword }).click();
        await expect(this.contactsList.filter({ hasText: 'Contracts (' })).toBeVisible();
        await this.contractID.click();
        await this.page.waitForTimeout(2000);
        await this.amendmentsTab.click();
        await this.page.getByRole('link', { name: searchValue }).click();
    }

    async copyEmail(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(5000);
        await this.expandBtnEX.click();
        await this.page.getByRole('link', { name: searchKeyword }).click();
        await expect(this.contactsList.filter({ hasText: 'Contracts (' })).toBeVisible();
        await this.contractID.click();
        await this.detailsTab.click();
        await this.copyIcon.scrollIntoViewIfNeeded();
        await expect(this.copyIcon).toBeVisible();
        await this.page.waitForTimeout(1000);
        await expect(this.dealercopyIcon).toBeVisible();


    }

    async draftCreation(searchKeyword: string | undefined) {
        await this.page.waitForTimeout(1000);
        await this.customerTab.click();
        await this.page.waitForTimeout(1000);
        const searchValue = searchKeyword!;
        await this.searchTextBox.fill(searchValue);
        await this.page.waitForTimeout(30000);
        await this.page.getByRole('link', { name: searchKeyword }).click();
        await expect(this.contactsList.filter({ hasText: 'Contracts (' })).toBeVisible();
        await this.page.waitForTimeout(1000);
        await this.createContract.click();
        await this.page.waitForTimeout(1000);
        await this.continueBtn.click();
        await this.page.waitForTimeout(1000);
        await expect(this.verifyTerm).toBeVisible();
        await this.cancelBtn.scrollIntoViewIfNeeded();
        await this.cancelBtn.click();
        await expect(this.contactsList.filter({ hasText: 'Contracts (' })).toBeVisible();


    }


}
export default SearchCustomer;