import { test as setup } from '../fixture/TestFixture';
import loginPage from '../pages/LoginPage';
import log from '../../src/utils/Logger';
import testData from './auth-setup.json';

testData.TOKENS.forEach((data) => {
    setup(`Authenticate as User for ${data.name} API`, async ({ page }) => {
        console.log(`In api-auth-setup.ts file name`);
        const loginpage = new loginPage(page);
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
        await loginpage.loginIntoApplication(process.env[data.username], process.env[data.password])
        log.info('Sign In Successful');
        let accessTokenObj;
        do {
            accessTokenObj = await page.evaluate(() => {
                return sessionStorage.getItem('token');
            });
        } while (accessTokenObj === null || accessTokenObj?.trim() === '');
        process.env[data.name.concat(`_API_TOKEN`)] = accessTokenObj!;
    });
});
