import { test } from '../../src/fixture/TestFixture';
import { expect, Page } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { executeQuery } from '../../src/utils/postgresDBUtils'
import dealercustomers from '../pages/dealercustomers.json'
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

async function waitForActivationOutcome(page: Page, timeoutMs: number): Promise<'in-progress' | 'error'> {
    const activationInProgress = page.getByText('Your activation is in progress');
    const activationError = page.getByText('Something went wrong with activation');

    return Promise.race([
        activationInProgress.waitFor({ state: 'visible', timeout: timeoutMs }).then(() => 'in-progress' as const),
        activationError.waitFor({ state: 'visible', timeout: timeoutMs }).then(() => 'error' as const),
    ]);
}

async function selectPendingActivationContractsFromDB(companyName: string): Promise<Array<{ id: string | number; contract_number: string | number }>> {
    const query = `select contract_number, id  from dxp.contract.contract_detail 
        where ship_to_account_name ilike $1 and
        status = 'PENDING_ACTIVATION' and 
        created_date > '2026-10-01 00:00:00.5666667' AND (po_number LIKE 'Data%') and is_deleted = false and parent_contract_id is NULL and renewal_status is NULL
        order by created_date desc;`;
    const result = await executeQuery<{ id: string | number; contract_number: string | number }>(query, [`${companyName}%`]);
    console.log(`Query executed. Rows returned: ${result.rowCount ?? 0}`);
    return result.rows;
}

const activationAccounts = [
    { label: 'dxpAutomation', customerID: '437d54ac-8a85-5516-be31-9ecda8de19dc', contractInfoFile: '.auth/dataPack_contracts_dxpAutomation.txt' },
    { label: 'bpc', customerID: '264c5ece-f797-55a2-95cf-757cb0ffb7f9', contractInfoFile: '.auth/dataPack_contracts_bpc.txt' },
    { label: 'srm', customerID: '0cf0d9ca-ecb2-5305-88a7-705dc94b22f8', contractInfoFile: '.auth/dataPack_contracts_srm.txt' },
    { label: 'upg', customerID: '85e085f6-29f1-5e04-8f41-e7758dc18453', contractInfoFile: '.auth/dataPack_contracts_upg.txt' },
    { label: 'fp', customerID: '76244577-67d7-5134-85b6-40f9712037f1', contractInfoFile: '.auth/dataPack_contracts_fp.txt' },
    { label: 'kuk', customerID: '1326d477-68e8-5d05-a7cb-28dae6114e68', contractInfoFile: '.auth/dataPack_contracts_kuk.txt' },
    { label: 'ntjv', customerID: '2bce6c5e-b4c6-5302-9d55-3b5e64c49c50', contractInfoFile: '.auth/dataPack_contracts_ntjv.txt' },
    { label: 'osa', customerID: 'fced6f0a-9abd-58d6-947e-fa43656945bf', contractInfoFile: '.auth/dataPack_contracts_osa.txt' },
    { label: 'sdm', customerID: '4256d65b-e9a0-51d9-8966-73b93585c292', contractInfoFile: '.auth/dataPack_contracts_sdm.txt' },
    { label: 'sms', customerID: 'ca58b18f-767f-5b35-b278-1e6f61531e16', contractInfoFile: '.auth/dataPack_contracts_sms.txt' },
    { label: 'ac', customerID: '063220ba-d9d4-59d7-9b0c-40d27cd1cf00', contractInfoFile: '.auth/dataPack_contracts_ac.txt' },
    { label: 'tps', customerID: 'a1a73f2f-68dc-55b5-9a9d-7412ffcd16bc', contractInfoFile: '.auth/dataPack_contracts_tps.txt' },
    { label: 'dxprenewalsgk', customerID: 'fcae0d6a-952e-571d-a783-41f44b746d7d', contractInfoFile: '.auth/dataPack_contracts_dxpRenewalsGK.txt' }
];

const envName = (process.env.ENV || 'qa').toLowerCase();
const isDevLikeEnvironment = envName === 'dev' || envName === 'fedev';
const fedevActivationAccounts = [
    'bpc',
    'srm', 'upg',
    'fp', 'kuk', 'ntjv', 'osa', 'sdm', 'sms', 
    'ac',
];
const activationAccountsToRun = isDevLikeEnvironment
    ? activationAccounts.filter((account) => fedevActivationAccounts.includes(account.label))
    : activationAccounts;
const axpHost = isDevLikeEnvironment ? 'fedev.accounts.trimble.com' : 'feqa.accounts.trimble.com';

test.describe.parallel(`Activate dataPack contracts in AXP`, () => {
    for (const account of activationAccountsToRun) {
        test.describe(`Activation Flow: ${account.label}`, () => {
            test.beforeAll(async () => {
                await waitForFile(account.contractInfoFile);
            });
            const contract_guids = existsSync(account.contractInfoFile)
                ? readFileSync(account.contractInfoFile, 'utf-8').trim().split(/\r?\n/).filter(line => line.trim().length > 0)
                : [];
            test.describe.configure({ mode: 'parallel' });
            for (const contract_guid of contract_guids) {
                test(`Activate contract ${contract_guid}`, async ({ page, loginPage }) => {
                    const workerIndex = Number(process.env.PLAYWRIGHT_WORKER_INDEX || 0);
                    await delay(workerIndex * 500);
                    await page.goto(`https://${axpHost}/${account.customerID}/contracts/${contract_guid}`);
                    await page.locator(`[id="onetrust-accept-btn-handler"]`).waitFor({ state: 'visible' });
                    await page.locator(`[id="onetrust-accept-btn-handler"]`).click();
                    await loginPage.loginIntoApplication(process.env.AXP_GLOBAL_EMAIL, process.env.AXP_GLOBAL_PASSWORD);
                    console.log(`🔍 Searching for contract to activate: ${contract_guid}`);
                    await expect(page.locator(`xpath=//h1[contains(text(),"Contract")]`)).toBeVisible({ timeout: 50000 });
                    await page.locator(`xpath=//input[@type="checkbox"]`).click();
                    await expect(page.getByTestId('activate-now-button')).toBeVisible({ timeout: 50000 });
                    await page.getByTestId('activate-now-button').click();
                    const activationOutcome = await waitForActivationOutcome(page, 65000);
                    if (activationOutcome === 'error') {
                        throw new Error(`Activation failed for contract ${contract_guid} in account ${account.label}: Something went wrong with activation - Check AXP Team`);
                    }
                    console.log(`✅ Contract Activation initiated for contract: ${contract_guid}`);
                });
            }
        });
    }
});


test.describe.parallel(`Activation of Pending Activation Contracts in AXP @no-auth-setup`, () => {
    test.describe.configure({ timeout: 50000 });
    for (const account of activationAccountsToRun) {
        test.describe(`Pending Activation Flow: ${account.label}`, () => {
            test(`Activate pending contracts for account ${account.label} serially`, async ({ browser }) => {
                const workerIndex = Number(process.env.PLAYWRIGHT_WORKER_INDEX || 0);
                await delay(workerIndex * 500);
                const pendingContracts = await selectPendingActivationContractsFromDB(dealercustomers[account.label as keyof typeof dealercustomers]);
                console.log(`Found ${pendingContracts.length} pending activation contracts for ${account.label}`);
                console.log(`Pending Activation Contracts for ${account.label}:`, pendingContracts.map(c => c.id));

                const baselineTimeoutMs = 700000;
                const perContractBudgetMs = 300000;
                const sessionRecoveryBudgetMs = 180000;
                const maxSafeTimeoutMs = 3300000;
                const calculatedTimeoutMs = baselineTimeoutMs + (pendingContracts.length * perContractBudgetMs) + sessionRecoveryBudgetMs;
                const appliedTimeoutMs = Math.min(Math.max(baselineTimeoutMs, calculatedTimeoutMs), maxSafeTimeoutMs);
                test.setTimeout(appliedTimeoutMs);
                console.log(`Using timeout ${appliedTimeoutMs}ms for ${account.label} with ${pendingContracts.length} pending contracts.`);

                if (pendingContracts.length === 0) {
                    test.skip(true, `No pending activation contracts found for account ${account.label}`);
                }

                let uiContext = await browser.newContext();
                let uiPage = await uiContext.newPage();
                let uiLoginPage = new LoginPage(uiPage);
                const failedContracts: string[] = [];
                const minimumRemainingTimeMs = 180000;
                const startedAtMs = Date.now();
                const remainingTimeMs = () => appliedTimeoutMs - (Date.now() - startedAtMs);
                const contractUrl = (contractGuid: string | number) => `https://${axpHost}/${account.customerID}/contracts/${contractGuid}`;

                const loginForAccountSession = async (contractGuid: string | number) => {
                    await uiPage.goto(contractUrl(contractGuid));
                    await uiLoginPage.loginIntoApplication(process.env.AXP_GLOBAL_EMAIL, process.env.AXP_GLOBAL_PASSWORD);
                    await expect(uiPage.locator(`xpath=//h1[contains(text(),"Contract")]`)).toBeVisible({ timeout: 50000 });
                };

                const activateContract = async (contractGuid: string | number) => {
                    console.log(`Searching for pending activation contract to activate: ${contractGuid} for account: ${account.label}`);
                    await uiPage.goto(contractUrl(contractGuid));
                    await expect(uiPage.locator(`xpath=//h1[contains(text(),"Contract")]`)).toBeVisible({ timeout: 50000 });
                    await uiPage.locator(`xpath=//input[@type="checkbox"]`).click();
                    await expect(uiPage.getByTestId('activate-now-button')).toBeVisible({ timeout: 50000 });
                    await uiPage.getByTestId('activate-now-button').click();

                    try {
                        const activationOutcome = await waitForActivationOutcome(uiPage, 30000);
                        if (activationOutcome === 'error') {
                            throw new Error(`Something went wrong with activation for contract ${contractGuid}`);
                        }
                        console.log(`✅ Pending Activation Contract activation initiated for contract: ${contractGuid} for account: ${account.label}`);
                    } catch (error) {
                        if (error instanceof Error && error.message.includes('Something went wrong with activation')) {
                            throw error;
                        }
                        await expect(uiPage.locator(`xpath=(//p[contains(text(),"Active")])[1]`)).toBeVisible({ timeout: 10000 });
                        console.log(`✅ Terms Accepted for contract: ${contractGuid} for account: ${account.label}`);
                    }
                };

                try {
                    let isSessionAuthenticated = false;
                    let stoppedByTimeoutGuard = false;
                    let attemptedContractsCount = 0;

                    for (const contract of pendingContracts) {
                        const remainingBeforeContractMs = remainingTimeMs();
                        if (remainingBeforeContractMs < minimumRemainingTimeMs) {
                            stoppedByTimeoutGuard = true;
                            console.log(`Stopping activation loop for ${account.label} due to low remaining time (${remainingBeforeContractMs}ms).`);
                            break;
                        }

                        const contract_guid = contract.id;
                        attemptedContractsCount += 1;

                        if (!isSessionAuthenticated) {
                            await loginForAccountSession(contract_guid);
                            isSessionAuthenticated = true;
                        }

                        try {
                            await activateContract(contract_guid);
                        } catch (error) {
                            const message = error instanceof Error ? error.message : String(error);
                            failedContracts.push(`${contract_guid}: ${message}`);
                            console.log(`Activation failed for contract ${contract_guid} in account ${account.label}: ${message}`);
                            console.log(`Re-opening browser session; will continue with next contract for ${account.label}.`);

                            const remainingBeforeResetMs = remainingTimeMs();
                            if (remainingBeforeResetMs < minimumRemainingTimeMs) {
                                stoppedByTimeoutGuard = true;
                                console.log(`Skipping browser session reset for ${account.label} due to low remaining time (${remainingBeforeResetMs}ms).`);
                                break;
                            }

                            await uiContext.close();
                            uiContext = await browser.newContext();
                            uiPage = await uiContext.newPage();
                            uiLoginPage = new LoginPage(uiPage);
                            isSessionAuthenticated = false;
                            continue;
                        }
                    }

                    if (stoppedByTimeoutGuard) {
                        const remainingContractsCount = pendingContracts.length - attemptedContractsCount;
                        throw new Error(
                            `Timeout guard triggered for ${account.label}: attempted ${attemptedContractsCount}/${pendingContracts.length} pending contracts and stopped early with ${remainingContractsCount} remaining. Increase budget or reduce account backlog.`
                        );
                    }
                } finally {
                    await uiContext.close();
                }

                if (failedContracts.length > 0) {
                    console.log(`Pending activation failed for account ${account.label}. Failed contracts: ${failedContracts.join(' | ')}`);
                }
            });
        });
    }
});
