import { expect, Locator, Page } from "@playwright/test";
import { OwnerInfoPage } from "./OwnerInfoPage";
import { SearchBar } from "../../ui-components/SearchBar";
import { PaginatedGrid } from "../../ui-components/PaginatedGrid";
import { CustomerDetailsPage } from "./CustomerDetailsPage";

export class CustomersPage {
	readonly page: Page;
	readonly pageHeader: Locator;
	readonly createNewCustomerButton: Locator;
	readonly customerTab: Locator;
	readonly searchBar: SearchBar;
	readonly searchTextBox: Locator;
	readonly gridTotalCount: Locator;
	readonly customersGrid: PaginatedGrid;
	readonly defaultCustomerName: string;
	readonly statusColumnsWOHeaderTextList: Locator;
	readonly ContractIDText: Locator;
	readonly customerActionsButton: Locator;
	readonly confirmButton: Locator;
	readonly cancelButton: Locator;
	readonly clearSearchButton: Locator;
	readonly autoRenewalMenuItem: Locator;
	readonly manageMembersButton: Locator;
	readonly addMembersMenuItem: Locator;
	readonly addMembersDialog: Locator;
	readonly memberEmailTextBox: Locator;
	readonly addMemberEmailOption: Locator;
	readonly addMembersButton: Locator;
	readonly customerDetailsThreeDotButton: Locator;
	readonly requestCustomerOptInMenuItem: Locator;
	readonly requestCustomerOptInButton: Locator;
	readonly firstGridRow: Locator;
	readonly firstVisibleCustomerActionsButton: Locator;
	readonly actionsMenu: Locator;
	readonly firstMenuOptionButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.pageHeader = page.locator('h1', { hasText: /^Customers$/ });
		this.createNewCustomerButton = page.getByRole('button', { name: /Create New Customer/ });
		this.customerTab = page.getByRole('link', { name: 'Customers', exact: true });
		this.searchBar = new SearchBar(
			page.getByRole('searchbox', { name: 'Search', exact: true }),
			page.getByTestId('datagrid-total-count'),
		);
		this.searchTextBox = this.searchBar.Input;
		this.gridTotalCount = this.searchBar.ResultsText;
		this.customersGrid = new PaginatedGrid(page);
		this.defaultCustomerName = 'CRM Steel Detailing';
		this.statusColumnsWOHeaderTextList = page.locator('div[data-field="status"][role="gridcell"]');
		this.ContractIDText = page.locator('xpath=//span//a[contains(@href, "/contracts/")]');
		this.customerActionsButton = page.getByRole('button', { name: 'Customer Actions' });
		this.confirmButton = page.locator('dialog[open] [data-testid="confirm-button"] button');
		this.cancelButton = page.locator('dialog[open] [data-testid="cancel-button"] button');
		this.clearSearchButton = page.getByLabel('Clear search');
		this.autoRenewalMenuItem = page.getByTestId('auto-renew-menu-item');
		this.manageMembersButton = page.getByRole('button', { name: /Manage Members/i });
		this.addMembersMenuItem = page.getByText('Add Members', { exact: true });
		this.addMembersDialog = page.locator('#add-members-modal');
		this.memberEmailTextBox = this.addMembersDialog.getByRole('textbox');
		this.addMemberEmailOption = this.addMembersDialog.getByText(/^Add ".*"$/);
		this.addMembersButton = this.addMembersDialog.getByRole('button', { name: 'Add Members', exact: true });
		this.customerDetailsThreeDotButton = page.getByRole('button').filter({ hasText: 'more_vertical' }).first();
		this.requestCustomerOptInMenuItem = page.getByText('Request Customer Opt-in', { exact: true });
		this.firstGridRow = page.locator('.MuiDataGrid-row').first();
		this.firstVisibleCustomerActionsButton = this.firstGridRow.getByRole('button', { name: 'Customer Actions' }).filter({ visible: true }).first();
		this.actionsMenu = page.getByRole('menu', { name: 'Menu' });
		this.firstMenuOptionButton = this.actionsMenu.getByRole('button').first();
		// Role-based locator on the open menu — getByText matches a hidden copy in every grid row
		this.requestCustomerOptInButton = this.actionsMenu.getByRole('button', { name: 'Request Customer Opt-in' });
	}

	static async init(page: Page): Promise<CustomersPage> {
		const customersPage = new CustomersPage(page);
		await page.waitForLoadState('load');
		await expect(customersPage.pageHeader).toBeVisible();
		return customersPage;
	};

	async CreateNewCustomer(): Promise<OwnerInfoPage> {
		await this.createNewCustomerButton.click();
		return await OwnerInfoPage.init(this.page);
	}

	async openCustomersPage() {
		await this.customerTab.click();
		await expect(this.searchTextBox).toBeVisible();
	}

	async searchCustomerName(customerName: string = this.defaultCustomerName) {
		await this.searchBar.Search(customerName);
		console.log(`Searching for customer name: ${customerName}`);
	}

	async openCustomerFromGrid(companyName: string): Promise<CustomerDetailsPage> {
		const cell = await this.customersGrid.FindCell('Company Name', companyName);
		await cell.locator('a', { hasText: companyName }).click();
		return await CustomerDetailsPage.init(this.page, companyName);
	}

	async clearSearch() {
		await this.clearSearchButton.click();
		await expect(this.searchTextBox).toBeEmpty();
		console.log('Customer search cleared successfully');
	}

	async openFirstCustomerFromGrid() {
		await expect(this.page.locator('.MuiDataGrid-row').first()).toBeVisible();
		const firstCustomerLink = this.page.locator('.MuiDataGrid-row').first().locator('a[href*="/customers/"]').first();
		await firstCustomerLink.click();
		await expect(this.page).toHaveURL(/\/customers\//);
		console.log('Opened first customer from grid');
	}

	async verifyManageMembersButtonIsVisible() {
		await expect(this.manageMembersButton).toBeVisible();
		console.log('Manage Members button is visible');
	}

	async verifyAddMembersOptionIsVisible() {
		await this.manageMembersButton.click();
		await expect(this.addMembersMenuItem).toBeVisible();
		await this.page.keyboard.press('Escape');
		console.log('Add Members option is visible in Manage Members menu');
	}

	async openAddMembersModal() {
		await this.manageMembersButton.click();
		await this.addMembersMenuItem.click();
		await expect(this.addMembersDialog).toBeVisible();
		console.log('Add Members modal is visible');
	}

	async enterMemberEmailAndSelectAdd(email: string) {
		await this.memberEmailTextBox.fill(email);
		await this.addMemberEmailOption.click();
		console.log(`Selected email to add: ${email}`);
	}

	async verifyAddMembersButtonIsEnabled() {
		await expect(this.addMembersButton).toBeEnabled();
		console.log('Add Members button is enabled');
	}

	async verifyRequestCustomerOptInIsVisibleFromThreeDotMenu() {
		await this.customerDetailsThreeDotButton.scrollIntoViewIfNeeded();
		await this.customerDetailsThreeDotButton.click();
		await expect(this.requestCustomerOptInMenuItem).toBeVisible();
		console.log('Request Customer Opt-in is visible from three dot menu');
	}

	async clickAutoRenewalMenuItemAndCaptureState(customerName?: string) {
		const row = customerName
			? this.page.getByRole('row').filter({ hasText: customerName }).first()
			: this.page.getByRole('row').first();
		const button = row.getByRole('button', { name: 'Customer Actions' });
		await button.click();
		const menuItem = this.page.getByRole('menu', { name: 'Menu' }).getByTestId('auto-renew-menu-item');
		await expect(menuItem).toBeVisible({ timeout: 10000 });
		const menuText = (await menuItem.textContent())?.trim() ?? '';
		const isCurrentlyOn = menuText.toLowerCase().includes('turn off');
		console.log(`Auto-Renewal menu item text: "${menuText}" — Auto-Renewal is currently: ${isCurrentlyOn ? 'ON' : 'OFF'}`);
		await menuItem.click();
		await expect(this.confirmButton).toBeVisible({ timeout: 10000 });
		await this.confirmButton.click();
		console.log(`Auto-Renewal confirmation dialog confirmed`);
		return isCurrentlyOn;
	}

	/** On the Customers grid, opens the first visible customer's three dot menu and clicks Request Customer Opt-in */
	async clickRequestCustomerOptInFromFirstRow() {
		await expect(this.firstGridRow).toBeVisible();
		await this.firstVisibleCustomerActionsButton.click();
		await expect(this.actionsMenu).toBeVisible();
		await this.requestCustomerOptInButton.click();
		console.log('Clicked Request Customer Opt-in from first customer row');
	}

	/** On the customer details screen, opens the three dot menu and clicks the first action option */
	async clickFirstCustomerDetailsMenuAction() {
		await this.customerDetailsThreeDotButton.scrollIntoViewIfNeeded();
		await this.customerDetailsThreeDotButton.click();
		await expect(this.actionsMenu).toBeVisible();
		await this.firstMenuOptionButton.click();
		console.log('Clicked first action from customer details three dot menu');
	}
}
