import { test as setup } from '../fixture/TestFixture';
import { writeFileSync } from 'fs';

const UPGAccountUserFile = '.auth/upgaccountuser.json';
const UPGAccountUserTokenFile = '.auth/upgaccountuser-token.json';

/**
 * UPG UI login plus capture of the first GraphQL request's Authorization header and URL
 * for API tests (GraphQLClient / testDataFixture). Used by featureTests and the optional
 * featureIamDevicePoolSetup project.
 */
setup('Feature: UPG account — GraphQL token and storage state', async ({ page, loginPage, homePage }) => {
    const urlPromise = new Promise((resolve) => {
        page.route('**/*', async (route, request) => {
            await route.continue();
            if (request.url().includes('authorize')) {
                resolve(request.url());
            }
        });
    });
    const graphqlRequest = page.waitForRequest((request) =>
        request.url().includes('/api/graphql') &&
        !!request.headers().authorization
    );
    await page.goto('/' + process.env.SMOKE_DEALER_ACCOUNT_ID);
    await urlPromise;
    await loginPage.loginIntoApplication(process.env.UPG_ACCOUNT_EMAIL, process.env.UPG_ACCOUNT_PASSWORD);
    await homePage.assertHomePage();
    const frontendRequest = await graphqlRequest;
    const authorization = frontendRequest.headers().authorization;

    console.log(`Feature: storage state saved to ${UPGAccountUserFile}, token file to ${UPGAccountUserTokenFile}`);
    await page.context().storageState({ path: UPGAccountUserFile });
    writeFileSync(UPGAccountUserTokenFile, JSON.stringify({
        authorization,
        graphqlUrl: frontendRequest.url(),
    }, null, 2), 'utf-8');
});
