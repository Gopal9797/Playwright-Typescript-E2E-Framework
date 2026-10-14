import { expect } from '@playwright/test';
import { test } from '../../src/fixture/TestFixture';
import fs, { existsSync, readFileSync } from 'fs';
import path from 'path';

test.describe("Error Hold Contracts Creation", () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test('Navigate to Contracts', async ({ page, homePage, contractsPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("srm");
        await contractsPage.verifyFiftyContractsDisplayedWhenFiftyIsChosenFromShowDropdown();
        await contractsPage.needsAttentionTab.click();
        if (await contractsPage.sortButton.nth(0).getAttribute('aria-sort') !== 'descending') {
            await contractsPage.columnHeaders.nth(0).hover();
            await contractsPage.sortButton.nth(0).click();
            await contractsPage.page.waitForTimeout(2000);
            await contractsPage.columnHeaders.nth(0).hover();
            await contractsPage.sortButton.nth(0).click();
            await expect(contractsPage.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        }
        await expect(contractsPage.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        // await contractsPage.searchTextBox.fill("Datapack");
        await page.waitForTimeout(5000);
        await expect(contractsPage.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        const links = page.locator('a.MuiTypography-root[href*="/contracts/"]');
        // Extract the 'href' attribute from all 38 elements
        const hrefs = await links.evaluateAll((elements: HTMLAnchorElement[]) =>
            elements.map(el => el.getAttribute('href'))
        );
        // 4. Use Regex to extract only the GUID part
        // Regex looks for the 36-character pattern at the end of the URL
        const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

        const guids = hrefs
            .map(href => href?.match(guidRegex)?.[0])
            .filter((guid): guid is string => !!guid); // Remove nulls

        console.log(`Found ${guids.length} GUIDs.`);

        // 5. Save to a file (output.txt)
        const filename = path.join(`.auth`, `ErrorHoldContracts.txt`);
        // const outputPath = path.join(__dirname, 'ErrorHoldContracts.txt');
        fs.appendFileSync(filename, guids.join('\n'), 'utf8');

        console.log(`GUIDs saved to: ${filename}`);
    });
});

test.describe("Pickup PendingActivation Contracts", () => {
    let accountLabel = "kuk";
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test('Navigate to Contracts and pick PendingActivation contracts', async ({ page, homePage, contractsPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts(accountLabel);
        await contractsPage.verifyFiftyContractsDisplayedWhenFiftyIsChosenFromShowDropdown();
        if (await contractsPage.sortButton.nth(2).getAttribute('aria-sort') !== 'descending') {
            await contractsPage.columnHeaders.nth(2).hover();
            await contractsPage.sortButton.nth(2).click();
            await contractsPage.page.waitForTimeout(2000);
            await contractsPage.columnHeaders.nth(2).hover();
            await contractsPage.sortButton.nth(2).click();
            await expect(contractsPage.ContractIDText.nth(0)).toBeVisible({ timeout: 30000 });
        }
        await contractsPage.searchTextBox.fill("Datapack");
        await page.waitForTimeout(5000);
        const links = page.locator(`xpath=//div[@data-testid="contract-status-pending_activation"]/ancestor::div[@role="row"]/descendant::a[contains(@href, '/contracts/')]`);
        const hrefs = await links.evaluateAll((elements: HTMLAnchorElement[]) =>
            elements.map(el => el.getAttribute('href'))
        );

        const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

        const guids = hrefs.map(href => href?.match(guidRegex)?.[0])
            .filter((guid): guid is string => !!guid); // Remove nulls
        console.log(`Found ${guids.length} PendingActivation GUIDs.`);

        const filename = path.join(`.auth`, `PendingActivationContracts_${accountLabel}.txt`);
        fs.appendFileSync(filename, guids.join('\n'), 'utf8');

        console.log(`Pending Activation GUIDs saved to: ${filename}`);
    });
});

async function waitForFile(filePath: string, timeoutMs = 300000, intervalMs = 5000) {
    const start = Date.now();
    while (!existsSync(filePath)) {
        if (Date.now() - start > timeoutMs) {
            throw new Error(`Timeout: File not found: ${filePath}`);
        }
        await new Promise(res => setTimeout(res, intervalMs));
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const activationAccounts = [
    { label: 'dxpAutomation', customerID: '1783583481176303', contractInfoFile: '.auth/PendingActivationContracts_dxpAutomation.txt' },
    { label: 'srm', customerID: '100000007191019', contractInfoFile: '.auth/PendingActivationContracts_srm.txt' },
    { label: 'upg', customerID: '1670441367635564', contractInfoFile: '.auth/PendingActivationContracts_upg.txt' },
    { label: 'kuk', customerID: '300000005664178', contractInfoFile: '.auth/PendingActivationContracts_kuk.txt' },
    { label: 'ntjv', customerID: '300000005792973', contractInfoFile: '.auth/PendingActivationContracts_ntjv.txt' },
    { label: 'osa', customerID: '1735279540032190', contractInfoFile: '.auth/PendingActivationContracts_osa.txt' },
    { label: 'sdm', customerID: '300000002292865', contractInfoFile: '.auth/PendingActivationContracts_sdm.txt' },
    { label: 'sms', customerID: '300000328207008', contractInfoFile: '.auth/PendingActivationContracts_sms.txt' },
    { label: 'ac', customerID: '300000016059641', contractInfoFile: '.auth/PendingActivationContracts_ac.txt' },
];

test.describe.parallel(`Activate PendingActivation contracts in AXP`, () => {
    for (const account of activationAccounts) {
        test.describe(`Activating through AXP UI: ${account.label}`, () => {
            test.beforeAll(async () => {
                await waitForFile(account.contractInfoFile);
            });
            const contract_guids = existsSync(account.contractInfoFile)
                ? readFileSync(account.contractInfoFile, 'utf-8').trim().split(/\r?\n/)
                : [];
            test.describe.configure({ mode: 'parallel' });
            for (const contract_guid of contract_guids) {
                test(`Activate contract ${contract_guid}`, async ({ page, loginPage }) => {
                    const workerIndex = Number(process.env.PLAYWRIGHT_WORKER_INDEX || 0);
                    await delay(workerIndex * 500);
                    await page.goto(`https://feqa.accounts.trimble.com/${account.customerID}/subscriptions`);
                    await loginPage.loginIntoApplication(process.env.AXP_GLOBAL_EMAIL, process.env.AXP_GLOBAL_PASSWORD);
                    console.log(`🔍 Searching for contract to activate: ${contract_guid}`);
                    const contractLocator = page.locator(`xpath=//p[contains(text(),'${contract_guid}')]`);
                    await expect(contractLocator).toBeVisible({ timeout: 500000 });
                    await page.waitForTimeout(2000);
                    await page.locator(`xpath=//p[contains(text(),'${contract_guid}')]//ancestor::div[5]//descendant::input`).click();
                    await page.waitForTimeout(2000);
                    await page.locator(`xpath=//p[contains(text(),'${contract_guid}')]//ancestor::div[5]//descendant::button[@data-testid="activate-now-button"]`).click();
                    await expect(page.locator(`xpath=//p[contains(text(),'${contract_guid}')]//ancestor::div[5]//descendant::p/strong[contains(text(),"Your activation is in progress")]`)).toBeVisible({ timeout: 60000 });
                    console.log(`✅ Contract Activation initiated for contract: ${contract_guid}`);
                });
            }
        });
    }
});
