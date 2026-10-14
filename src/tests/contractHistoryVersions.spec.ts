import { expect } from '@playwright/test';
import { executeQuery } from '../utils/postgresDBUtils';
import { test } from '../fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json';

const DEALER_KEY = 'upg';
const SHIP_TO_NAME_PREFIX = dealercustomers[DEALER_KEY as keyof typeof dealercustomers];
const BILL_TO_CDH_ID = dealercustomers[`${DEALER_KEY}_cdhID` as keyof typeof dealercustomers];

type QuoteStatus =
    | 'SUBMITTED'
    | 'PENDING_ACTIVATION'
    | 'ACTIVATED'
    | 'AMENDMENT_DRAFT'
    | 'AMENDMENT_SUBMITTED'
    | 'AMENDMENT_ACTIVATION_IN_PROGRESS'
    | 'AMENDMENT_ACTIVATED';

type HistoryContractRow = {
    contract_number: string;
    contract_number_search: string;
    contract_id: string;
    ship_to_account_name: string;
};

async function getContractByLatestQuoteStatus(status: QuoteStatus): Promise<HistoryContractRow> {
    const query = `
        WITH latest_quote AS (
            SELECT DISTINCT ON (q.contract_id)
                q.contract_id,
                q.status,
                q.created_date
            FROM dxp.contract.quote q
            WHERE q.is_deleted = false
            ORDER BY q.contract_id, q.created_date DESC
        )
        SELECT
            c.contract_number,
            c.contract_number_search,
            c.id AS contract_id,
            c.ship_to_account_name
        FROM latest_quote lq
        JOIN dxp.contract.contract_detail c ON c.id = lq.contract_id
        WHERE lq.status = $1
          AND c.is_deleted = false
          AND c.ship_to_account_name ILIKE $2
        ORDER BY c.created_date DESC
        LIMIT 1;
    `;

    const result = await executeQuery<HistoryContractRow>(query, [status, `${SHIP_TO_NAME_PREFIX}%`]);
    if (!result.rows.length) {
        throw new Error(`No contracts found in quote table for status ${status} and ship_to prefix ${SHIP_TO_NAME_PREFIX}.`);
    }
    return result.rows[0];
}

type ActivatedRenewalPair = {
    renewed_contract_number_search: string;
    parent_contract_number: string;
    parent_contract_number_search: string;
};

async function getActivatedRenewedContractR1(): Promise<ActivatedRenewalPair> {
    if (!BILL_TO_CDH_ID) {
        throw new Error(`Missing bill-to CDH ID mapping for dealer key: ${DEALER_KEY}`);
    }

    const query = `
        SELECT
            child.contract_number_search AS renewed_contract_number_search,
            parent.contract_number AS parent_contract_number,
            parent.contract_number_search AS parent_contract_number_search
        FROM dxp.contract.contract_detail child
        JOIN dxp.contract.contract_detail parent ON parent.id = child.parent_contract_id
        WHERE child.status = 'ACTIVATED'
          AND child.is_deleted = false
          AND child.ship_to_account_name ILIKE $1
          AND child.bill_to_cdh_account_id = $2
          AND child.contract_number_search ILIKE '%-R1'
          AND parent.is_deleted = false
          AND parent.bill_to_cdh_account_id = $2
        ORDER BY child.created_date DESC
        LIMIT 1;
    `;
    const result = await executeQuery<ActivatedRenewalPair>(query, [`${SHIP_TO_NAME_PREFIX}%`, BILL_TO_CDH_ID]);
    if (!result.rows.length) {
        throw new Error(`No ACTIVATED renewal contract with -R1 suffix and parent contract found for ship_to prefix ${SHIP_TO_NAME_PREFIX}.`);
    }
    return result.rows[0];
}

test.describe('Contract History Versions - New Sale, Amendment, Renewal', () => {
    test.describe.configure({ mode: 'serial' });
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts(DEALER_KEY);
        await contractsPage.assertContractsPage();
    });

    test('Submitted contract should not show any versions @DXP-T714 @DXP-T725', async ({ contractsPage, contractHistoryPage }) => {
        const contract = await getContractByLatestQuoteStatus('SUBMITTED');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract.contract_number_search || contract.contract_number);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyNoResultsFoundInVersionsTab();
    });

    test('Pending activation contract should not show any versions @DXP-T713 @DXP-T725', async ({ contractsPage, contractHistoryPage }) => {
        const contract = await getContractByLatestQuoteStatus('PENDING_ACTIVATION');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract.contract_number_search || contract.contract_number);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyNoResultsFoundInVersionsTab();
    });

    test('Activated contract should show V1 original and V1 should be view-only @DXP-T713 @DXP-T716 @DXP-T717 @DXP-T718 @DXP-T719 @DXP-T723', async ({ contractsPage, contractHistoryPage }) => {
        const contract = await getContractByLatestQuoteStatus('ACTIVATED');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract.contract_number_search || contract.contract_number);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyVersionAndTypeVisible('V1', 'Original');
        await contractHistoryPage.clickVersionAndVerifyReadOnly('V1', 1);
        await contractHistoryPage.clickBackToHistoryAndVerifyPage();
    });

    test('Amendment draft should show only V1 original @DXP-T725', async ({ contractsPage, contractHistoryPage }) => {
        const contract = await getContractByLatestQuoteStatus('AMENDMENT_DRAFT');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract.contract_number_search || contract.contract_number);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyVersionAndTypeVisible('V1', 'Original');
        await contractHistoryPage.verifyVersionNotVisible('V2');
    });

    test('Amendment submitted should show only V1 original and V2 amendment should not display @DXP-T725', async ({ contractsPage, contractHistoryPage }) => {
        const contract = await getContractByLatestQuoteStatus('AMENDMENT_SUBMITTED');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract.contract_number_search || contract.contract_number);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyVersionAndTypeVisible('V1', 'Original');
        await contractHistoryPage.verifyVersionNotVisible('V2');
    });

    test('Amendment activation in progress should show V1 original and V2 amendment should not display @DXP-T725', async ({ contractsPage, contractHistoryPage }) => {
        const contract = await getContractByLatestQuoteStatus('AMENDMENT_ACTIVATION_IN_PROGRESS');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract.contract_number_search || contract.contract_number);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyVersionAndTypeVisible('V1', 'Original');
        await contractHistoryPage.verifyVersionNotVisible('V2');
    });

    test('Amendment activated should show V1 original and V2 amendment; V2 should be view-only @DXP-T715 @DXP-T716 @DXP-T721 @DXP-T722 @DXP-T724', async ({ contractsPage, contractHistoryPage }) => {
        const contract = await getContractByLatestQuoteStatus('AMENDMENT_ACTIVATED');
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract.contract_number_search || contract.contract_number);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyVersionAndTypeVisible('V1', 'Original');
        await contractHistoryPage.verifyVersionAndTypeVisible('V2', 'Amendment');
        await contractHistoryPage.clickVersionAndVerifyReadOnly('V2', 2);
        await contractHistoryPage.clickBackToHistoryAndVerifyPage();
    });

    test('Renewal parent contract should show renewed banner with -R1 contract number @DXP-T715', async ({ contractsPage, contractHistoryPage }) => {
        const renewalPair = await getActivatedRenewedContractR1();
        const renewedContractNumber = renewalPair.renewed_contract_number_search;
        const parentContractNumber = renewalPair.parent_contract_number_search || renewalPair.parent_contract_number;
        expect(parentContractNumber).not.toEqual(renewedContractNumber);

        await contractsPage.searchContractWithGivenContractIDAndClickContract(parentContractNumber);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyVersionAndTypeVisible('V1', 'Original');
        await contractHistoryPage.verifyRenewedContractBanner(renewedContractNumber);
    });

    test('Renewed contract should show V1 in contract history versions @DXP-T715', async ({ contractsPage, contractHistoryPage }) => {
        const renewalPair = await getActivatedRenewedContractR1();
        const renewedContractNumber = renewalPair.renewed_contract_number_search;
        const parentContractNumber = renewalPair.parent_contract_number_search || renewalPair.parent_contract_number;
        expect(parentContractNumber).not.toEqual(renewedContractNumber);
        expect(renewedContractNumber).toContain('-R1');

        await contractsPage.searchContractWithGivenContractIDAndClickContract(renewedContractNumber);
        await contractHistoryPage.openVersionsTab();
        await contractHistoryPage.verifyVersionAndTypeVisible('V1', 'Original');
    });
});
