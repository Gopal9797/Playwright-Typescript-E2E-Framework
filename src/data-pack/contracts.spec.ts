import { test } from '../../src/fixture/TestFixture';
import fs from 'fs';
import path from 'path';
import dealercustomers from '../pages/dealercustomers.json'

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const happyFlowAccounts = [
    'dxpAutomation',
    'bpc',
    'srm', 'upg',
    'fp', 'tps',
    'kuk', 'ntjv', 'osa', 'sdm', 'sms', 'ac',
    // 'chinadealer',
    'dxpRenewalsGK'
];

const happyFlowAccountsDEV = [
    'bpc',
    'srm', 'upg',
    'fp',
    'kuk', 'ntjv', 'osa', 'sdm', 'sms', 'ac',
];

const renewalPrepAccounts = [
    'dxpAutomation',
    // 'bpc',
    // 'srm', 'upg',
    // 'fp', 'tps',
    // 'kuk', 'ntjv', 'osa', 'sdm', 'sms', 'ac',
    // 'chinadealer',
    'dxprenewalsgk'
];

const customerSelectionPartialNames = [
    'American Company',
    'Dra Americas',
    'Gilmore', 'CRM',
    'City Architecture', 'Medi',
    'VITALIS', 'KUMAGAI', 'Hatch', 'PSB', 'SCOTT STEEL LTD', 'TECHNICAL SAFETY BC',
    // 'china customer',
    'manual'
];

const UOMs = [
    { uom: 'year', length: "2" },
    { uom: 'month', length: "9" },
    { uom: 'year', length: "1" },
    { uom: 'month', length: "1" },
];

const productSKUsMonthly = [
    ["BS-CAT-PRECISION", "25"], //catalyst 1 (downgrade available & Upgrade not available)
    ["BS-CAT-1M", "25"],// catalyst 60 (upgrade available & downgrade not available)
    ["BS-CAT-SM", "25"],//catalyst 30 (Both upgrade and downgrade available)
    ["BS-CAT-DM", "25"],//catalyst 10 (Both upgrade and downgrade available)
    ["BN-TRM-TBC-SPO-TCBP", "10"], // Bundle
    ["BS-TBC-PACKAGE", "5"], // Package
    ["BS-TA-GENGNSS", "20"],//Trimble Access - GNSS Only General Survey (Upgrade available & Downgrade not available)
    ["BS-TBC-SAM", "25"],//Trimble Business Center Survey and Mapping (upgrade not available & Downgrade available)
    ["BS-TBC-SAF", "25"],//Trimble Business Center Site and Field - AWS Test (Both upgrade and downgrade available)
    ["BS-TBC-STA", "15"],//Trimble Business Center Starter
    ["BS-SB-SCAN-200GB", "2"] // TRCPS SKU
];

const productSKUsYearly = [
    ["BS-CAT-PRECISION", "25"], //catalyst 1 (downgrade available & Upgrade not available)
    ["BS-CAT-1M", "25"],// catalyst 60 (upgrade available & downgrade not available)
    ["BS-CAT-SM", "25"],//catalyst 30 (Both upgrade and downgrade available)
    ["BS-CAT-DM", "25"],//catalyst 10 (Both upgrade and downgrade available)
    ["BN-TRM-TBC-SPO-TCBP", "10"], // Bundle
    ["BS-TBC-PACKAGE", "5"], // Package
    ["BS-TA-GENGNSS", "20"],//Trimble Access - GNSS Only General Survey (Upgrade available & Downgrade not available)
    ["BS-TBC-SAM", "25"],//Trimble Business Center Survey and Mapping (upgrade not available & Downgrade available)
    ["BS-TBC-SAF", "25"],//Trimble Business Center Site and Field - AWS Test (Both upgrade and downgrade available)
    ["BS-TBC-STA", "15"],//Trimble Business Center Starter
    ["BS-SB-SCAN-200GB", "2"] // TRCPS SKU
];

const envName = process.env.ENV?.toLowerCase();
const isDevEnvironment = envName === 'dev';
const happyFlowAccountsToRun = isDevEnvironment ? happyFlowAccountsDEV : happyFlowAccounts;

type DynamicProductSelectionConfig = {
    searchTerm: string;
    productType: 'Subscription' | 'Bundle' | 'Package';
    count: number;
    quantities: string[];
    excludedSkus?: string[];
};

const devGlobalExcludedSkus = [
    'BS-CAT-PACKAGE',
];

const devDynamicProductSelectionConfig: DynamicProductSelectionConfig[] = [
    { searchTerm: 'Subscription', productType: 'Subscription', count: 3, quantities: ['25', '20', '15'] },
    { searchTerm: 'Bundle', productType: 'Bundle', count: 2, quantities: ['10', '15'] },
    { searchTerm: 'Package', productType: 'Package', count: 1, quantities: ['5'] },
];


test.describe.parallel("Create Contracts for all accounts", () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.describe.configure({ timeout: 400000 });
    for (const account of happyFlowAccountsToRun) {
        test.describe(`Account Flow: ${account}`, () => {
            const contractGUIDs: string[] = [];
            const poRefBase = "DataPack_" + new Date().toISOString().slice(0, 10);
            test.describe.configure({ mode: 'default' });
            test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage }) => {
                // const workerIndex = Number(process.env.PLAYWRIGHT_WORKER_INDEX || 0);
                // await delay(workerIndex * 500);
                await page.goto('/');
                await homePage.navigateToContracts(account);
                await contractsPage.VerifyCreateANewContractButton();
                await customerSelectionPage.customerSelectionPageAssertion();
            });
            for (const [uomIndex, { uom, length }] of UOMs.entries()) {
                const contractRun = uomIndex + 1;
                test(`Create Contract for ${account} - ${uom} ${length} - run ${contractRun} - ${process.env.PLAYWRIGHT_WORKER_INDEX || 0}`, async ({ customerSelectionPage, termsPage, productsPage, summaryScreenPage, contractsPage }) => {
                    await customerSelectionPage.findAndSelectingCustomerWithPartialName(customerSelectionPartialNames[happyFlowAccounts.indexOf(account)]);
                    await termsPage.termsPageAssertion();
                    await termsPage.enterTermLength(length, uom);
                    await termsPage.toggleAutoRenew(true);
                    await termsPage.selectStartDateBasedOnOrder();
                    await termsPage.chooseCurrencyDropdown('USD');

                    await termsPage.continueToProductsPage();

                    if (isDevEnvironment) {
                        for (const selection of devDynamicProductSelectionConfig) {
                            const excludedSkus = [...new Set([...devGlobalExcludedSkus, ...(selection.excludedSkus ?? [])])];
                            await productsPage.selectFirstNProductsBySearchTerm(
                                selection.searchTerm,
                                selection.count,
                                selection.quantities,
                                selection.productType,
                                excludedSkus
                            );
                        }
                    } else {
                        let skusToUse = productSKUsYearly;
                        if (uom === 'month') {
                            skusToUse = productSKUsMonthly;
                        }
                        for (const [sku, qty] of skusToUse) {
                            await productsPage.selectProductBySKUAndQuantity(sku, qty);
                        }
                    }
                    await productsPage.generatePricing();
                    await summaryScreenPage.summaryScreenPageAssertion();
                    console.log(`Generated Pricing for ${account} - ${uom} ${length} - run ${contractRun}`);
                    await summaryScreenPage.fillPOReferenceNumberWORandomNumber(poRefBase);
                    const contractNumber = await summaryScreenPage.getContractIDFromHeader();
                    await summaryScreenPage.convertToContract();
                    await contractsPage.assertContractsPage();
                    await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
                    const contractGUID = await summaryScreenPage.fetchContractGUIDFromURL();
                    contractGUIDs.push(contractGUID);
                });
            }

            test.afterAll(`Write contract IDs for ${account}`, async () => {
                const filename = path.join(`.auth`, `dataPack_contracts_${account}.txt`);
                const data = contractGUIDs.join("\n") + "\n"; // write one GUID per line
                fs.writeFileSync(filename, data, { encoding: "utf-8" }); // overwrite instead of append
                console.log(`✔ Saved ${contractGUIDs.length} contracts for ${account} → ${filename} in environment ${envName}`);
            });
        });
    }

});

let contract_number: number | undefined;
test.describe.parallel(`Prep some Manual / LateRenewal Eligible Yearly contracts`, () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    for (const accountID of renewalPrepAccounts) {
        test.describe(`Manual /Late Renewal Eligible Flow: ${accountID}`, () => {
            test(`LATE RENEWAL ELIGIBLE for account ${accountID}`, async ({ contractsPage }) => {
                // Implementation for prepping late renewal eligible contracts goes here
                const selectedContract = await contractsPage.selectActiveYearlyContractsAndUpdateEndDateToMakeItLateRenewalEligible(dealercustomers[accountID + '_cdhID' as keyof typeof dealercustomers]);
                if (!selectedContract?.contract_number) {
                    throw new Error(`No contract_number returned while preparing late renewal eligible contract for account ${accountID}`);
                }
            });
            test(`MANUAL RENEWAL ELIGIBLE, Do some Negative and initial Manual Renewals for account ${accountID}`, async ({ page, homePage, contractsPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage, renewalPlanningTab }, testInfo) => {
                // Implementation for prepping renewal eligible contracts goes here
                await page.goto('/');
                await homePage.navigateToContracts(accountID);
                const selectedContract = await contractsPage.selectActiveYearlyContractsAndUpdateEndDateToMakeItRenewalEligible(dealercustomers[accountID + '_cdhID' as keyof typeof dealercustomers]);
                if (!selectedContract?.contract_number) {
                    throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
                }
                contract_number = Number(selectedContract.contract_number);

                // Do some negative amendments like Remove Seats 
                await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
                await summaryScreenPage.summaryScreenPageAssertion();
                await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
                await createAmendmentPage.clickAmendContractButton();
                await createAmendmentPage.verificationOfCreateAmendmentPage();
                await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
                await createAmendmentPage.clickAmendmentTypeDropdown();
                await createAmendmentPage.selectRemoveLicensesOption();
                await createAmendmentPage.enterLicenseCount(1);
                await createAmendmentPage.clickAddToCartButton();
                await createAmendmentPage.assertConflictPopupIsVisibleAndClickSave();
                await renewalPlanningTab.assertRenewalPlanningTabDetailsSectionVisibility();
                await renewalPlanningTab.initiateManualRenewal();
            });
        });
    }
});


test.describe.parallel('Amendment Draft Contracts - Discarding Drafts', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    // Partition draft selection by slot so parallel workers do not discard the same shared DB rows.
const configuredDiscardParallelSlots = Number(process.env.DRAFT_DISCARD_PARALLEL_SLOTS ?? (process.env.CI ? 2 : 1));
    if (!Number.isInteger(configuredDiscardParallelSlots) || configuredDiscardParallelSlots < 1) {
        throw new Error('DRAFT_DISCARD_PARALLEL_SLOTS must be a positive integer.');
    }
    const discardParallelSlots = configuredDiscardParallelSlots;
    const perDraftBudgetMs = 180_000;
    const maxPartitionTimeoutMs = Number(process.env.DRAFT_DISCARD_MAX_TIMEOUT_MS || 10_200_000);

    for (let workerSlot = 0; workerSlot < discardParallelSlots; workerSlot++) {
        test(`Discard amendment drafts from the contract banner in partition #${workerSlot + 1}`, async ({ page, contractsPage, amendmentSummaryPage, summaryScreenPage }, testInfo) => {
            const amendmentDrafts = await contractsPage.selectAllAmendmentDraftsinDB({ parallelSlots: discardParallelSlots, workerSlot });
            const partitionTimeoutMs = Math.max(perDraftBudgetMs, Math.min(maxPartitionTimeoutMs, amendmentDrafts.length * perDraftBudgetMs));
            testInfo.setTimeout(partitionTimeoutMs);

            console.log(
                `[Data Allocation] Requested Slot ${workerSlot}/${discardParallelSlots} | Executing Worker ${testInfo.workerIndex} | Drafts Assigned ${amendmentDrafts.length}`
            );

            if (amendmentDrafts.length === 0) {
                console.log(`[Draft Discard] No drafts available for partition ${workerSlot}.`);
                return;
            }

            const failures: string[] = [];

            for (const [localDraftIndex, draft] of amendmentDrafts.entries()) {
                console.log(
                    `[Data Allocation] Worker ${testInfo.workerIndex} | Partition ${workerSlot}/${discardParallelSlots} | Local Draft Index ${localDraftIndex} | Contract ${draft.contract_number}`
                );

                try {
                    await page.goto(`/${draft.bill_to_cdh_account_id}/contracts/${draft.id}`);
                    await summaryScreenPage.clickOnAmendmentDraftReadyFromBanner();
                    await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
                } catch (error) {
                    const reason = error instanceof Error ? error.message : String(error);
                    failures.push(`Contract ${draft.contract_number}: ${reason}`);
                }
            }

            if (failures.length > 0) {
                throw new Error(
                    `[Draft Discard] Partition ${workerSlot} failed ${failures.length}/${amendmentDrafts.length} drafts.\n${failures.join('\n')}`
                );
            }
        });
    }
});
