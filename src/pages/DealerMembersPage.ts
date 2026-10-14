import { expect, Locator, Page, Response } from "@playwright/test";

export type DealerUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    lastLoginDate: string | null;
    role: string | null;
    status: string;
};

const DEALER_ROLE_LABELS: Record<string, string> = {
    DEALER_OWNER: 'Owner',
    DEALER_SECONDARY_OWNER: 'Secondary Owner',
};

const DEALER_STATUS_LABELS: Record<string, string> = {
    COMMITTED: 'Active',
};

export class DealerMembersPage {
    readonly page: Page;
    readonly adminMenu: Locator;
    readonly dealerMembersMenu: Locator;
    readonly pageHeading: Locator;
    readonly infoText: Locator;
    readonly resultsHeading: Locator;
    readonly searchTextBox: Locator;
    readonly clearSearchIcon: Locator;
    readonly memberRows: Locator;

    /* Initializes locators used on the Dealer Members page. */
    constructor(page: Page) {
        this.page = page;
        this.adminMenu = page.getByRole('button', { name: 'Admin' });
        this.dealerMembersMenu = page.getByRole('menuitem', { name: 'Dealer Members' });
        this.pageHeading = page.getByRole('heading', { name: 'Dealer Members', exact: true }).first();
        this.infoText = page.getByText(
            'This is a list showing the current users and roles for your account. If you wish to make any changes please visit our Impartner site.'
        );
        this.resultsHeading = page.getByRole('heading', { name: /\d+\s+Results?/i }).first();
        this.searchTextBox = page.getByPlaceholder(/search/i)
            .or(page.getByRole('searchbox'))
            .or(page.locator('modus-wc-text-input input'))
            .first();
        this.clearSearchIcon = page.locator('i.modus-wc-icon').filter({ hasText: 'cancel_circle' }).first();
        this.memberRows = page.locator('.MuiDataGrid-row');
    }

    /* Maps an API dealer role code to the label shown in the members grid. */
    mapRole(role: string | null | undefined): string {
        if (!role) {
            return 'Unknown';
        }

        if (DEALER_ROLE_LABELS[role]) {
            return DEALER_ROLE_LABELS[role];
        }

        return role
            .replace(/^DEALER_/, '')
            .toLowerCase()
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /* Maps an API dealer status code to the label shown in the members grid. */
    mapStatus(status: string): string {
        return DEALER_STATUS_LABELS[status] ?? status;
    }

    /* Builds the results heading text for a given member count. */
    resultsLabel(count: number): string {
        return count === 1 ? '1 Result' : `${count} Results`;
    }

    /* Builds the display name shown in the members grid from first and last name. */
    fullName(user: DealerUser): string {
        return `${user.firstName} ${user.lastName}`.replace(/\s+/g, ' ').trim();
    }

    /* Opens Dealer Members from the Admin menu and returns members from the DealerUsers API. */
    async navigateToDealerMembers(timeoutMs = 30000): Promise<DealerUser[]> {
        await expect(this.adminMenu).toBeVisible({ timeout: timeoutMs });
        console.log('Admin Menu is displayed');
        await this.adminMenu.click();
        await expect(this.dealerMembersMenu).toBeVisible({ timeout: timeoutMs });
        console.log('Dealer Members menu option is displayed');

        const [response] = await Promise.all([
            this.waitForDealerUsersResponse(timeoutMs),
            this.dealerMembersMenu.click()
        ]);

        const dealerUsers = await this.parseDealerUsers(response);
        console.log(`DealerUsers API returned ${dealerUsers.length} member(s)`);
        return dealerUsers;
    }

    /* Verifies the Dealer Members page loaded with heading, info text, results, search, and rows. */
    async assertDealerMembersScreen(dealerUsers: DealerUser[], timeoutMs = 30000) {
        await expect(this.page).toHaveURL(/\/dealer-members/, { timeout: timeoutMs });
        await expect(this.pageHeading).toBeVisible({ timeout: timeoutMs });
        await expect(this.infoText).toBeVisible({ timeout: timeoutMs });
        await this.assertResultsCount(dealerUsers.length, timeoutMs);
        await expect(this.searchTextBox).toBeVisible({ timeout: timeoutMs });

        if (dealerUsers.length > 0) {
            await expect(this.memberRows.first()).toBeVisible({ timeout: timeoutMs });
            expect(await this.memberRows.count()).toBe(dealerUsers.length);
        }

        console.log('Dealer Members screen is launched');
    }

    /* Verifies the results heading matches the expected member count. */
    async assertResultsCount(count: number, timeoutMs = 15000) {
        await expect(this.resultsHeading).toBeVisible({ timeout: timeoutMs });
        await expect(this.resultsHeading).toHaveText(this.resultsLabel(count), { timeout: timeoutMs });
        console.log(`Results heading shows ${this.resultsLabel(count)}`);
    }

    /* Searches members by email and expects a single matching result. */
    async searchByEmail(email: string, timeoutMs = 15000) {
        await expect(this.searchTextBox).toBeVisible({ timeout: timeoutMs });
        await this.searchTextBox.click();
        await this.searchTextBox.fill(email);
        await this.assertResultsCount(1, timeoutMs);
        console.log(`Search for email ${email} shows 1 Result`);
    }

    /* Clears the search box and optionally restores the full results count. */
    async clearSearch(expectedResultCount?: number, timeoutMs = 15000) {
        await expect(this.clearSearchIcon).toBeVisible({ timeout: timeoutMs });
        await this.clearSearchIcon.click();
        await expect(this.searchTextBox).toHaveValue('', { timeout: timeoutMs });

        if (typeof expectedResultCount === 'number') {
            await this.assertResultsCount(expectedResultCount, timeoutMs);
        }

        console.log('Dealer Members search cleared');
    }

    /* Verifies a grid row matches the API member's name, email, role, status, and last login. */
    async assertMemberMatchesApi(user: DealerUser, timeoutMs = 15000) {
        const row = this.memberRowForUser(user);
        await expect(row).toBeVisible({ timeout: timeoutMs });
        await expect(row.locator('h5').first()).toHaveText(this.fullName(user), { timeout: timeoutMs });
        await expect(row).toContainText(user.email, { timeout: timeoutMs });
        await expect(row.locator('[data-field="role"]')).toHaveText(this.mapRole(user.role), { timeout: timeoutMs });
        await expect(row.locator('[data-field="status"]')).toHaveText(this.mapStatus(user.status), { timeout: timeoutMs });

        if (user.lastLoginDate) {
            const expectedLastLogin = await this.formatLastLogin(user.lastLoginDate);
            await expect(row).toContainText(expectedLastLogin, { timeout: timeoutMs });
        }

        console.log(`Verified member ${this.fullName(user)} with role ${this.mapRole(user.role)}`);
    }

    /* Searches each API member by email and verifies the displayed row. */
    async searchAndVerifyEachMember(dealerUsers: DealerUser[], timeoutMs = 15000) {
        expect(dealerUsers.length).toBeGreaterThan(0);

        for (const user of dealerUsers) {
            await this.searchByEmail(user.email, timeoutMs);
            await this.assertMemberMatchesApi(user, timeoutMs);
            await this.clearSearch(dealerUsers.length, timeoutMs);
        }
    }

    /* Locates a member's grid row by user id or full name. */
    private memberRowForUser(user: DealerUser): Locator {
        const rowById = this.page.locator(`.MuiDataGrid-row[data-id="${user.id}"]`);
        const rowByName = this.memberRows.filter({ hasText: this.fullName(user) });
        return rowById.or(rowByName).first();
    }

    /* Waits for the GraphQL DealerUsers POST response after opening the page. */
    private waitForDealerUsersResponse(timeoutMs = 30000): Promise<Response> {
        return this.page.waitForResponse((response) => {
            if (response.request().method() !== 'POST') {
                return false;
            }

            const url = response.url();
            if (!url.includes('/api/graphql')) {
                return false;
            }

            if (url.includes('operationName=DealerUsers')) {
                return true;
            }

            const postData = response.request().postData() ?? '';
            return postData.includes('DealerUsers');
        }, { timeout: timeoutMs });
    }

    /* Parses dealer members from the DealerUsers API response. */
    private async parseDealerUsers(response: Response): Promise<DealerUser[]> {
        expect(response.ok(), `DealerUsers API returned ${response.status()}`).toBeTruthy();

        const body = await response.json();
        const dealerUsers = body?.data?.dealerUsers;

        expect(dealerUsers, 'DealerUsers API response did not include data.dealerUsers').toBeTruthy();
        expect(Array.isArray(dealerUsers), 'DealerUsers API response dealerUsers was not an array').toBeTruthy();

        return dealerUsers as DealerUser[];
    }

    /* Formats an ISO last-login timestamp to the date/time shown in the members grid. */
    private async formatLastLogin(isoDate: string): Promise<string> {
        return this.page.evaluate((iso) => {
            const date = new Date(iso);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day} ${month} ${year} ${hours}:${minutes}`;
        }, isoDate);
    }
}
