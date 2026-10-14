import { test } from '../fixture/TestFixture';
import { existsSync, readFileSync } from 'fs';

const contractFilePath = '.auth/ErrorHoldContracts.txt';
const contract_guids: string[] = existsSync(contractFilePath)
    ? readFileSync(contractFilePath, 'utf-8').trim().split(/\r?\n/).filter(Boolean)
    : [];

test.describe('Salesforce WorkAround', () => {
    test.describe.configure({ mode: 'parallel', timeout: 5000000 });
    test.use({ storageState: '.auth/sf_qaAccountUser.json' });
    for (const contract_guid of contract_guids) {
        test(`Process Contract/Order: ${contract_guid}`, async ({ page, salesforcePage }) => {
            console.log(`Worker ${test.info().workerIndex} starting GUID: ${contract_guid}`);
            await page.goto('/');
            // await salesforcePage.navigateToOrders(contract_guid);
            await salesforcePage.navigateToOrdersUsingOrderID(contract_guid);
            try {
                await salesforcePage.doWorkAroundOnOrder();
                console.log(`✅ Success: ${contract_guid}`);
            } catch (error) {
                console.error(`❌ Error at ${contract_guid}:`, error);
                throw error;
            }
        });
    }
});