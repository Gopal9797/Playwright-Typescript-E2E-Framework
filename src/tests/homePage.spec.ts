import { test } from '../../src/fixture/TestFixture';

// This test uses stored state of multiple accounts User to validate the Dealers Home page
test.describe('This Test Validates the HomePage of DXP Portal', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test('Verify that accounts switcher button and menus', async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.assertHomePage();
        await homePage.multipleAccountsSwitcher();
        await homePage.selectAccount('bpc');
    });
});