import { test as setup } from '../fixture/TestFixture';

const BPCAccountUserFile = '.auth/bpcaccountuser.json';
setup('Authenticate as BPC Account User', async ({ page, loginPage, homePage }) => {
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
    await loginPage.loginIntoApplication(process.env.BPC_ACCOUNT_EMAIL, process.env.BPC_ACCOUNT_PASSWORD);
    await homePage.assertHomePage();
    console.log(`User is authenticated and storage state is saved to ${BPCAccountUserFile}`);
    // Save the storage state to a file
    await page.context().storageState({ path: BPCAccountUserFile });
});

const UPGAccountUserFile = '.auth/upgaccountuser.json';
setup('Authenticate as UPG Account User', async ({ page, loginPage, homePage }) => {
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
    await loginPage.loginIntoApplication(process.env.UPG_ACCOUNT_EMAIL, process.env.UPG_ACCOUNT_PASSWORD);
    await homePage.assertHomePage();
    console.log(`User is authenticated and storage state is saved to ${UPGAccountUserFile}`);
    await page.context().storageState({ path: UPGAccountUserFile });
});

const UPGAccountUserTechnicianFile = '.auth/upgaccountusertechnician.json';
setup('Authenticate as Technician User', async ({ page, loginPage, homePage }) => {
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
    await loginPage.loginIntoApplication(process.env.TECHNICIAN_EMAIL, process.env.TECHNICIAN_PASSWORD);
    await homePage.assertHomePage();
    console.log(`User is authenticated and storage state is saved to ${UPGAccountUserTechnicianFile}`);
    await page.context().storageState({ path: UPGAccountUserTechnicianFile });
});

// Temporarily disabled — SUPER_ADMIN credentials/config not available; blocks auth-setup and all uiTests.
// const SuperAdminUserFile = '.auth/superadmin.json';
// setup('Authenticate as Super Admin User', async ({ page, loginPage, superAdminPage }) => {
//     const authorizeRequest = page.waitForRequest((request) => request.url().includes('authorize'));
//
//     await page.goto('/');
//     await authorizeRequest;
//     await loginPage.loginIntoApplication(process.env.SUPER_ADMIN_EMAIL, process.env.SUPER_ADMIN_PASSWORD);
//     // Super admin lands on the Support Admin 'Search for a Dealer' screen instead of the home page
//     await superAdminPage.assertSearchForDealerScreen();
//     console.log(`User is authenticated and storage state is saved to ${SuperAdminUserFile}`);
//     await page.context().storageState({ path: SuperAdminUserFile });
// });