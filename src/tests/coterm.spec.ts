import { expect } from '@playwright/test';
import { test } from '../../src/fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json'

type TermUom = 'YEAR' | 'MONTH';

type RenewalInitiatedContract = {
    id: string;
    contract_number: string;
    contract_number_search?: string | null;
    bill_to_cdh_account_id: string;
    term_uom: TermUom;
};

type CoTermDbContract = {
    id: string;
    contract_number_search: string;
    ship_to_account_name: string;
    bill_to_cdh_account_id: string;
    term_uom: TermUom;
    status: string;
    start_date: string | Date;
    end_date: string | Date;
    renewal_contract_number: string;
    renewal_start_date: string | Date;
    normal_renewal_end_date: string | Date;
};

type CoTermDialogRow = {
    contractId: string;
    customerName: string;
    poNumber: string;
    endDate: string;
};

function parseUiDate(value: string): Date {
    const parsed = new Date(`${value} UTC`);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Unable to parse UI date value: ${value}`);
    }
    return parsed;
}

function toIsoDate(value: Date): string {
    return value.toISOString().slice(0, 10);
}

function resolveTermUomFromTermLength(termLength: string): TermUom {
    const normalized = termLength.toLowerCase();
    if (normalized.includes('year')) {
        return 'YEAR';
    }
    if (normalized.includes('month')) {
        return 'MONTH';
    }
    throw new Error(`Unable to determine term UOM from term length value: ${termLength}`);
}

function parseDbDate(value: string | Date, fieldName: string): Date {
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Unable to parse DB date value for ${fieldName}: ${String(value)}`);
    }
    return parsed;
}

function addUtcDays(baseDate: Date, daysToAdd: number): Date {
    const updatedDate = new Date(baseDate.getTime());
    updatedDate.setUTCDate(updatedDate.getUTCDate() + daysToAdd);
    return updatedDate;
}

function addUtcMonths(baseDate: Date, monthsToAdd: number): Date {
    const updatedDate = new Date(baseDate.getTime());
    const originalDay = updatedDate.getUTCDate();
    updatedDate.setUTCDate(1);
    updatedDate.setUTCMonth(updatedDate.getUTCMonth() + monthsToAdd);
    const lastDayOfTargetMonth = new Date(Date.UTC(
        updatedDate.getUTCFullYear(),
        updatedDate.getUTCMonth() + 1,
        0
    )).getUTCDate();
    updatedDate.setUTCDate(Math.min(originalDay, lastDayOfTargetMonth));
    return updatedDate;
}

function assertCoTermDbEligibilityRules(
    coTermContracts: CoTermDbContract[],
    activeTermUom: TermUom,
    selectedRenewalContract: RenewalInitiatedContract
) {
    for (const coTermContract of coTermContracts) {
        const coTermEndDate = parseDbDate(coTermContract.end_date, 'end_date');
        const renewalStartDate = parseDbDate(coTermContract.renewal_start_date, 'renewal_start_date');
        const renewalEndDate = parseDbDate(coTermContract.normal_renewal_end_date, 'normal_renewal_end_date');

        expect(coTermContract.status).toBe('ACTIVATED');
        expect(coTermContract.bill_to_cdh_account_id).toBe(selectedRenewalContract.bill_to_cdh_account_id);
        expect(coTermContract.term_uom).toBe(activeTermUom);
        expect(coTermEndDate.getTime()).toBeLessThan(renewalEndDate.getTime());

        if (activeTermUom === 'MONTH') {
            const minimumMonthlyEligibleEndDate = addUtcDays(renewalStartDate, 14);
            expect(coTermEndDate.getTime()).toBeGreaterThanOrEqual(minimumMonthlyEligibleEndDate.getTime());
            continue;
        }

        const minimumAnnualEligibleEndDate = addUtcMonths(renewalStartDate, 1);
        expect(coTermEndDate.getTime()).toBeGreaterThanOrEqual(minimumAnnualEligibleEndDate.getTime());
    }
}

async function selectRenewalInitiatedDraftForCoTerm(
    page: any,
    homePage: any,
    contractsPage: any,
    excludedDraftIds: Set<string> = new Set<string>()
): Promise<RenewalInitiatedContract> {
    await page.goto('/');

    const preferredDealerKey = 'dxprenewalsgk_cdhID';
    const dealerKeys = Object.keys(dealercustomers).filter((key) => key.endsWith('_cdhID'));
    const orderedDealerKeys = dealerKeys.includes(preferredDealerKey)
        ? [preferredDealerKey, ...dealerKeys.filter((key) => key !== preferredDealerKey)]
        : dealerKeys;

    for (const key of orderedDealerKeys) {
        const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
        const dealerName = key.replace('_cdhID', '');
        await homePage.navigateToContracts(dealerName);

        const renewalContracts = await contractsPage.selectRenewalInitiatedContracts(dealerCDHAccountID) as RenewalInitiatedContract[];
        if (!renewalContracts || renewalContracts.length === 0) {
            continue;
        }

        for (const renewalContract of renewalContracts) {
            if (excludedDraftIds.has(renewalContract.id)) {
                continue;
            }

            const selectedContract = renewalContract.contract_number_search || renewalContract.contract_number;
            const billToCDHAccountID = renewalContract.bill_to_cdh_account_id;
            if (billToCDHAccountID !== dealerCDHAccountID) {
                const matchingKey: string | undefined = Object.keys(dealercustomers).find(
                    (dealerKey) => dealercustomers[dealerKey as keyof typeof dealercustomers] === billToCDHAccountID
                );
                if (matchingKey) {
                    await homePage.navigateToContracts(matchingKey.replace('_cdhID', ''));
                }
            }

            console.log(`Using Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
            await contractsPage.searchContractWithGivenContractIDAndClickContract(String(selectedContract));
            return renewalContract;
        }
    }

    throw new Error(
        `Database returned no additional Renewal Initiated contracts after excluding draft ids: ${Array.from(excludedDraftIds).join(', ') || 'none'}.`
    );
}

test.describe('Coterming -- Aligning Contract Billing Dates - Testcases', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test('Validate co-term eligibility, end-date alignment and history update in a single flow @DXP-T554 @DXP-T555 @DXP-T556 @DXP-T557 @DXP-T558 @DXP-T559 @DXP-T560 @DXP-T561 @DXP-T562 @DXP-T563', async ({ page, homePage, contractsPage, renewalSummaryPage, contractHistoryPage }) => {
        const attemptedDraftIds = new Set<string>();
        const maxRenewalContractAttempts = 5;
        let isCoTermFlowCompleted = false;

        for (let attempt = 1; attempt <= maxRenewalContractAttempts; attempt++) {
            const selectedRenewalContract = await selectRenewalInitiatedDraftForCoTerm(page, homePage, contractsPage, attemptedDraftIds);
            attemptedDraftIds.add(selectedRenewalContract.id);

            await renewalSummaryPage.validateManualRenewalContractNumberFormat();
            const renewalCustomerName = await renewalSummaryPage.getCustomerNameFromHeader(10000);
            const normalizedRenewalCustomerName = renewalCustomerName.trim().toLowerCase();

            let activeTermUom: TermUom = selectedRenewalContract.term_uom;
            let renewalEndDateBeforeText = await renewalSummaryPage.getContractDetailsEndDateText();
            let renewalEndDateBefore = parseUiDate(renewalEndDateBeforeText);
            let renewalEndDateBeforeIso = toIsoDate(renewalEndDateBefore);

            await renewalSummaryPage.clickEditDetailsButton();
            await renewalSummaryPage.openEndDateAlignDialogFromEditDetails();

            let coTermContractsSelected = await contractsPage.selectCoTermContractsForAGivenRenewalDraftContractId(selectedRenewalContract.id) as CoTermDbContract[];

            if (!coTermContractsSelected || coTermContractsSelected.length === 0) {
                console.log(`No co-term contracts for renewal draft id ${selectedRenewalContract.id}. Applying term-change workaround.`);

                await renewalSummaryPage.closeEndDateAlignDialog();

                const previousTermLength = await renewalSummaryPage.getTermLengthValue();
                await renewalSummaryPage.clickEditDetailsButton();
                await renewalSummaryPage.clickTermMenuItem();
                await renewalSummaryPage.clickNonCurrentTermRadioButton(previousTermLength);
                await renewalSummaryPage.verifySaveAndRepriceButtonIsEnabled();
                await renewalSummaryPage.clickSaveAndRepriceButton();
                await renewalSummaryPage.verifyTermLengthChangedFrom(previousTermLength);

                const updatedTermLength = await renewalSummaryPage.getTermLengthValue();
                activeTermUom = resolveTermUomFromTermLength(updatedTermLength);

                renewalEndDateBeforeText = await renewalSummaryPage.getContractDetailsEndDateText();
                renewalEndDateBefore = parseUiDate(renewalEndDateBeforeText);
                renewalEndDateBeforeIso = toIsoDate(renewalEndDateBefore);

                await renewalSummaryPage.clickEditDetailsButton();
                await renewalSummaryPage.openEndDateAlignDialogFromEditDetails();
                coTermContractsSelected = await contractsPage.selectCoTermContractsForAGivenRenewalDraftContractId(selectedRenewalContract.id) as CoTermDbContract[];
            }

            if (!coTermContractsSelected || coTermContractsSelected.length === 0) {
                console.log(`No co-term contracts found for renewal draft contract id: ${selectedRenewalContract.id}, even after term-change workaround. Retrying with another renewal contract.`);
                continue;
            }

            assertCoTermDbEligibilityRules(coTermContractsSelected, activeTermUom, selectedRenewalContract);

            const promptText = await renewalSummaryPage.getEndDateAlignPromptText();
            expect([
                'Select annual contract to align the end date',
                'Select monthly contract to align the end date'
            ]).toContain(promptText);
            await renewalSummaryPage.verifyEndDateAlignDialogPromptForTerm(activeTermUom);

            const uiTotalContracts = await renewalSummaryPage.getTotalContractsInEndDateAlignDialog();
            expect(uiTotalContracts).toBeGreaterThan(0);
            expect(uiTotalContracts).toBe(coTermContractsSelected.length);

            const uiRows = await renewalSummaryPage.getCoTermRowsInEndDateDialog() as CoTermDialogRow[];
            expect(uiRows.length).toBeGreaterThan(0);
expect(uiRows.length).toBeLessThanOrEqual(uiTotalContracts);

            const dbContractIds = new Set(
                coTermContractsSelected
                    .map((coTermContract) => coTermContract.contract_number_search?.trim())
                    .filter(Boolean)
            );

            for (const row of uiRows) {
                expect(dbContractIds.has(row.contractId.trim())).toBeTruthy();
            }

            for (const row of uiRows) {
                expect(parseUiDate(row.endDate).getTime()).toBeLessThan(renewalEndDateBefore.getTime());
            }

            const sameCustomerRows = uiRows.filter((row) => row.customerName.trim().toLowerCase() === normalizedRenewalCustomerName);
            const differentCustomerRows = uiRows.filter((row) => row.customerName.trim().toLowerCase() !== normalizedRenewalCustomerName);
            expect(sameCustomerRows.length + differentCustomerRows.length).toBe(uiRows.length);

            if (differentCustomerRows.length > 0) {
                console.log('Co-term candidates include contracts from different customers under the same dealer account.');
            } else {
                console.log('Co-term candidates include contracts from the same customer under the same dealer account.');
            }

            const selectedCoTermRow = differentCustomerRows[0] ?? sameCustomerRows[0] ?? uiRows[0];
            await renewalSummaryPage.selectCoTermContractInEndDateDialog(selectedCoTermRow.contractId);
            await renewalSummaryPage.clickContinueInEndDateAlignDialog();

            const confirmation = await renewalSummaryPage.getEndDateAlignConfirmationValues();
            const selectedEndDateIso = toIsoDate(parseUiDate(selectedCoTermRow.endDate));

            expect(toIsoDate(parseUiDate(confirmation.currentEndDate))).toBe(renewalEndDateBeforeIso);
            expect(toIsoDate(parseUiDate(confirmation.newEndDate))).toBe(selectedEndDateIso);
            expect(toIsoDate(parseUiDate(confirmation.selectedEndDate))).toBe(selectedEndDateIso);
            expect(confirmation.selectedContractId).toContain(selectedCoTermRow.contractId);
            expect(confirmation.selectedCustomerName.trim().toLowerCase()).toBe(selectedCoTermRow.customerName.trim().toLowerCase());

            await renewalSummaryPage.clickSaveAndRepriceInEndDateAlignDialog();

            await expect(async () => {
                const updatedEndDate = await renewalSummaryPage.getContractDetailsEndDateText();
                expect(toIsoDate(parseUiDate(updatedEndDate))).toBe(selectedEndDateIso);
            }).toPass({ timeout: 180000 });

            await contractHistoryPage.verifyContractHistory_ContractEndDateUpdated(renewalEndDateBeforeIso, selectedEndDateIso, process.env.UPG_ACCOUNT_EMAIL);
            isCoTermFlowCompleted = true;
            break;
        }

        if (!isCoTermFlowCompleted) {
            throw new Error(`No co-term contracts found after trying ${attemptedDraftIds.size} renewal draft contract(s).`);
        }
    });

});
