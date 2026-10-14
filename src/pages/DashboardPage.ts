import { expect, Locator, Page } from "@playwright/test";

export class DashboardPage {
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        this.dashboardHeading = page.getByTestId('dashboard-welcome');
    }

    static async init(page: Page): Promise<DashboardPage> {
        const dashboardPage = new DashboardPage(page);
        await page.waitForLoadState('load');
        await expect(dashboardPage.dashboardHeading).toBeVisible();
        return dashboardPage;
    }
}
