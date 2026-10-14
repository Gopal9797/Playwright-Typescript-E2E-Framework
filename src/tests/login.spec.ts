import { test } from '../../src/fixture/TestFixture';

// This test uses stored state of multiple accounts User to validate the Dealers Home page
test.describe('Login into DXP Portal', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test('Verify whether user can login', async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.assertHomePage();
    });

});

test.describe('Logout & Setting Page @dailysanity', () => {
    test.use({ storageState: '.auth/bpcaccountuser.json' });
    test('Settings & Logout Flow', async ({ page, loginPage }) => {
        await page.goto('/');
        // await loginPage.assertTrimbleIncHomePage();
        // await page.goto('/');
        await loginPage.logoutFromApplication();
        await loginPage.validateAfterLogoutChecks();
    });
});
