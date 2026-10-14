import { test as setup } from '../fixture/TestFixture';

const SIT_ALLACCOUNTS_USER_FILE = '.auth/sit/allaccountsuser.json';
setup('Authenticate as SIT - All Account Users', async ({ page, loginPage, homePage }) => {
    const urlPromise = new Promise((resolve) => {
        page.route('**/*', async (route, request) => {
            await route.continue();
            if (request.url().includes('authorize')) {
                resolve(request.url());
            }
        });
    });

    await page.goto('/');
    const url = await urlPromise;
    await loginPage.loginIntoApplication(process.env.DXP_SIT_SAO_EMAIL, process.env.DXP_SIT_SAO_PASSWORD);
    await homePage.assertHomePage();
    console.log(`User is authenticated and storage state is saved to ${SIT_ALLACCOUNTS_USER_FILE}`);
    await page.context().storageState({ path: SIT_ALLACCOUNTS_USER_FILE });
});