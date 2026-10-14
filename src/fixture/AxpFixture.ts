import { BrowserContext, Page, expect } from '@playwright/test';
import { existsSync } from 'fs';
import { test as base } from './TestFixture';
import { testConfig } from '../../testConfig';
import { AxpContractPage } from '../pages/axp/AxpContractPage';
import { AxpAmendmentPage } from '../pages/axp/AxpAmendmentPage';

const ENV = (process.env.ENV || 'qa') as 'qa' | 'dev' | 'sit';
const AXP_STORAGE_STATE_PATH = '.auth/axpglobaluser.json';

async function ensureAxpAuthentication(page: Page, context: BrowserContext): Promise<void> {
    await page.goto('/');

    const cookieAcceptButton = page.locator('#onetrust-accept-btn-handler');
    if (await cookieAcceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cookieAcceptButton.click();
    }

    const usernameInput = page.locator('#username-field');
    // storageState from auth-setup-axp usually already lands on Admin Console home.
    const loggedInHome = page.getByRole('heading', { name: /Welcome,/i })
        .or(page.getByRole('link', { name: 'Contracts', exact: true }));

    const outcome = await Promise.race([
        usernameInput.waitFor({ state: 'visible', timeout: 60000 }).then(() => 'login' as const),
        loggedInHome.first().waitFor({ state: 'visible', timeout: 60000 }).then(() => 'home' as const),
    ]).catch(() => 'timeout' as const);

    if (outcome === 'home') {
        return;
    }
    if (outcome !== 'login') {
        throw new Error(`AXP app did not show login form or home after goto('/'). URL: ${page.url()}`);
    }

    if (!process.env.AXP_GLOBAL_EMAIL || !process.env.AXP_GLOBAL_PASSWORD) {
        throw new Error('AXP_GLOBAL_EMAIL and AXP_GLOBAL_PASSWORD must be set in .env for AXP login.');
    }

    await usernameInput.fill(process.env.AXP_GLOBAL_EMAIL);

    const nextButton = page.locator('#enter_username_submit');
    if (await nextButton.isVisible({ timeout: 10000 }).catch(() => false)) {
        await nextButton.click();
    }

    const passwordInput = page.getByPlaceholder('Password').first();
    await expect(passwordInput).toBeVisible({ timeout: 60000 });
    await passwordInput.fill(process.env.AXP_GLOBAL_PASSWORD);
    await passwordInput.press('Enter');

    await page.waitForURL((url) => !/authorize|login|signin/i.test(url.toString()), { timeout: 120000 });
    await expect(loggedInHome.first()).toBeVisible({ timeout: 60000 });
    await context.storageState({ path: AXP_STORAGE_STATE_PATH });
}

type AxpFixtureFixtures = {
    axpContext: BrowserContext;
    axpPage: Page;
    axpContractPage: AxpContractPage;
    axpAmendmentPage: AxpAmendmentPage;
};

export const test = base.extend<AxpFixtureFixtures>({
    axpContext: async ({ browser }, use) => {
        const storageState = existsSync(AXP_STORAGE_STATE_PATH) ? AXP_STORAGE_STATE_PATH : undefined;
        const context = await browser.newContext({
            baseURL: testConfig[ENV].axp,
            storageState,
            viewport: { width: 1280, height: 720 },
        });

        await use(context);
        await context.close();
    },

    axpPage: async ({ axpContext }, use) => {
        const page = await axpContext.newPage();
        await ensureAxpAuthentication(page, axpContext);
        await use(page);
    },

    axpContractPage: async ({ axpPage }, use) => {
        await use(new AxpContractPage(axpPage));
    },

    axpAmendmentPage: async ({ axpPage }, use) => {
        await use(new AxpAmendmentPage(axpPage));
    },
});

export { expect } from '@playwright/test';
export default test;
