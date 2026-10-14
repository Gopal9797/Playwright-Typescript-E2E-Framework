import { expect, Locator, Page } from "@playwright/test";
import { CustomersPage } from "./customer/CustomersPage";
import { DashboardPage } from "./DashboardPage";

export enum TopNavTab {
    Customers = 'Customers',
}

/** Top-level shell for the dashboard landing page and top-nav tabs. */
export class HomePageNew {
    readonly page: Page;
    readonly dealerDropdown: Locator;
    private readonly navLinks: Record<TopNavTab, Locator>;

    constructor(page: Page) {
        this.page = page;
        // Two elements share id="dropdown-button"; the Admin one has a child span with text "Admin".
        this.dealerDropdown = page.locator('button#dropdown-button').filter({
            hasNot: page.locator('span', { hasText: 'Admin' }),
        });
        this.navLinks = {
            [TopNavTab.Customers]: page.getByRole('link', { name: 'Customers', exact: true }),
        };
    }

    static async init(page: Page): Promise<HomePageNew> {
        const homePage = new HomePageNew(page);
        await page.waitForLoadState('load');
        await expect(homePage.dealerDropdown).toBeVisible();

        // Also wait for the 'Welcome back,' text
        await DashboardPage.init(page);
        return homePage;
    }

    async SelectTab(tab: TopNavTab) {
        await this.navLinks[tab].click();
    }

    async SelectCustomersTab(): Promise<CustomersPage> {
        await this.SelectTab(TopNavTab.Customers);
        return await CustomersPage.init(this.page);
    }

    async SelectDealer(dealerName: string): Promise<void> {
        await this.dealerDropdown.click();
        const dealerOption = this.page.getByRole('menuitem', { name: dealerName, exact: false });
        await expect(dealerOption).toBeVisible();

        await dealerOption.click();
        await expect(this.dealerDropdown).toContainText(dealerName, {ignoreCase: true});
    }
}
