import { expect, Locator, Page } from "@playwright/test";
import { OwnerInfoPage } from "./customer/OwnerInfoPage";

export class CustomerSelectionPage {
    readonly page: Page;
    readonly createANewContractText: Locator;
    readonly customerNameHeading: Locator;
    readonly customersListComboBox: Locator;
    readonly cancelButton: Locator;
    readonly continueButton: Locator;
    private optionLocator: Locator | undefined;
    readonly customerRequiredErrorText: Locator;
    readonly continueButtonInShipToPage: Locator;
    readonly loadCustomersDropdown: Locator;
    readonly createNewCustomerLink: Locator;
    readonly backToContractListButton: Locator;

    constructor(page: Page) {
        this.page = page;
        const customerSelectPanel = page.locator('[role="tabpanel"]:not([hidden])');
        this.createANewContractText = page.getByRole('heading', { name: 'Create new contract' });
        this.customerNameHeading = customerSelectPanel.getByRole('heading', { name: 'Customer Name' });
        this.customersListComboBox = customerSelectPanel.locator('#customer-select-autocomplete');
        this.cancelButton = customerSelectPanel.getByRole('button', { name: 'Cancel', exact: true });
        this.continueButton = customerSelectPanel.getByRole('button', { name: 'Next: Confirm Customer Info' });
        this.customerRequiredErrorText = page.getByText('Customer is required', { exact: true });
        this.continueButtonInShipToPage = page.locator('[role="tabpanel"]:not([hidden])')
            .getByRole('button', { name: 'Next: Set Contract Details' });
        this.loadCustomersDropdown = customerSelectPanel.locator('#customer-select-autocomplete[aria-expanded="true"]');
        this.createNewCustomerLink = customerSelectPanel.getByTestId('customer-select-create-new-link');
        this.backToContractListButton = customerSelectPanel.getByRole('button', { name: 'Back to Contract List' });
    }

    static async init(page: Page): Promise<CustomerSelectionPage> {
        const customerSelectionPage = new CustomerSelectionPage(page);
        await customerSelectionPage.customerSelectionPageAssertion();
        await expect(customerSelectionPage.customersListComboBox).toBeVisible();
        await expect(customerSelectionPage.createNewCustomerLink).toBeVisible();
        return customerSelectionPage;
    }

    async customerSelectionPageAssertion() {
        await expect(this.createANewContractText).toBeVisible();
        await expect(this.customerNameHeading).toBeVisible();
        await expect(this.continueButton).toBeVisible();
    }

    async CreateNewCustomer(): Promise<OwnerInfoPage> {
        await this.createNewCustomerLink.click();
        return OwnerInfoPage.init(this.page);
    }

    async findAndSelectingCustomer(customerToSelect: string) {
        await this.customersListComboBox.fill(customerToSelect);
        this.optionLocator = this.page.getByRole('option', { name: customerToSelect });
        await expect(this.optionLocator).toBeVisible();
        await this.optionLocator.click();
        await expect(this.customersListComboBox).toHaveValue(customerToSelect);
        await this.continueButton.click();
    }

    async findAndSelectingCustomerWithPartialName(partialCustomerName: string) {
        await this.page.waitForTimeout(1000);
        await this.customersListComboBox.click();
        // await this.page.waitForTimeout(10000);
        await expect(this.loadCustomersDropdown).toBeVisible({ timeout: 90000 });
        await this.customersListComboBox.fill(partialCustomerName);
        await expect(this.customersListComboBox).toHaveValue(partialCustomerName, { timeout: 10000 });
        this.optionLocator = this.page.getByRole('option', { name: partialCustomerName });
        await expect(this.optionLocator.first()).toBeVisible();
        await this.optionLocator.first().click();
        await this.page.waitForTimeout(2000);
        await this.continueButton.click();
        await this.continueButtonInShipToPage.click();
    }

    async selectFirstCustomer() {
        await this.page.waitForTimeout(1000);
        await this.customersListComboBox.click();
        await expect(this.loadCustomersDropdown).toBeVisible({ timeout: 90000 });
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
        await this.continueButton.click();
        await this.continueButtonInShipToPage.click();
    }

    async cancelButtonValidation() {
        await expect(this.createANewContractText).toBeVisible();
        await expect(this.continueButton).toBeVisible();
        await this.cancelButton.click();
    }

    async customerIsRequiredValidation() {
        await this.continueButton.click();
        await expect(this.customerRequiredErrorText).toBeVisible();

    }
}
export default CustomerSelectionPage;
