import { expect } from '@playwright/test';
import { test as setup } from '../fixture/TestFixture';
import { time } from 'console';
const SF_QAAccountUserFile = '.auth/sf_qaAccountUser.json';
setup('Authenticate as Salesforce QA Account User', async ({ page, loginPage, homePage }) => {
    const urlPromise = new Promise((resolve) => {
        page.route('**/*', async (route, request) => {
            await route.continue();
            if (request.url().includes('authorize')) {
                resolve(request.url());
            }
        });
    });
    await page.goto('/');
    // const url = await urlPromise;
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.SF_QA_ACCOUNT_EMAIL!);
    await page.keyboard.press('Enter');
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SF_QA_ACCOUNT_PASSWORD!);
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
    await expect(page.locator('[aria-label="Search"]')).toBeVisible({ timeout: 50000 });
    console.log(`Salesforce Login Page is displayed successfully`);
    console.log(`User is authenticated and storage state is saved to ${SF_QAAccountUserFile}`);
    // Save the storage state to a file
    await page.context().storageState({ path: SF_QAAccountUserFile });
});
