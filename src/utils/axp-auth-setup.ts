import { test as setup } from '../fixture/TestFixture';

const AXPGlobalUserFile = '.auth/axpglobaluser.json';

setup('Authenticate as AXP Global User', async ({ page, loginPage }) => {
    const axpGlobalEmail = process.env.AXP_GLOBAL_EMAIL;
    const axpGlobalPassword = process.env.AXP_GLOBAL_PASSWORD;

    if (!axpGlobalEmail || !axpGlobalPassword) {
        throw new Error('Missing AXP credentials: AXP_GLOBAL_EMAIL and AXP_GLOBAL_PASSWORD must be set for auth-setup-axp.');
    }

    await page.goto('/');
    await loginPage.loginIntoApplication(axpGlobalEmail, axpGlobalPassword);
    await page.waitForURL((url) => !/authorize|login|signin/i.test(url.toString()), { timeout: 120000 });

    console.log(`User is authenticated and storage state is saved to ${AXPGlobalUserFile}`);
    await page.context().storageState({ path: AXPGlobalUserFile });
});
