import { expect } from '@playwright/test';
import { test } from '../../src/fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json'
import { SummaryScreenPage } from '../pages/ContractSummaryScreenPage';

const INITIATE_MANUAL_TEST_TAG_ORDER = ['@DXP-T381', '@DXP-T355'];
const DRAFT_RENEWAL_TEST_TAG_ORDER = ['@DXP-T244', '@DXP-T379', '@DXP-T361', '@DXP-T352', '@DXP-T353'];

function resolveScenarioIndex(testTitle: string, fallbackIndex: number, tagOrder: string[]): number {
    const scenarioIndex = tagOrder.findIndex((tag) => testTitle.includes(tag));
    return scenarioIndex >= 0 ? scenarioIndex : fallbackIndex;
}

function resolveSafeIndex(resultsLength: number, scenarioIndex: number, fallbackIndex: number, contextLabel: string): number {
    if (scenarioIndex < resultsLength) {
        return scenarioIndex;
    }
    if (fallbackIndex < resultsLength) {
        return fallbackIndex;
    }
    if (scenarioIndex >= resultsLength) {
        test.skip(true, `[Data Allocation] ${contextLabel}: requires at least ${scenarioIndex + 1} unique contracts, but only ${resultsLength} were returned. Skipping to avoid duplicate contract usage.`);
    }
    return 0;
}

test.describe('Initiate Manual Testcases', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("dxprenewalsgk");
        let selectedDealerCDHAccountID = dealercustomers.dxprenewalsgk_cdhID;
        let results = await contractsPage.selectRenewalEligibleContracts(selectedDealerCDHAccountID);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID);
            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectRenewalEligibleContracts(dealerCDHAccountID);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerCDHAccountID = dealerCDHAccountID;
                    const dealerName = key.replace('_cdhID', '');
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no Renewal Eligible contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;
        const scenarioIdx = resolveScenarioIndex(testInfo.title, parallelIdx, INITIATE_MANUAL_TEST_TAG_ORDER);
        const safeIndex = resolveSafeIndex(results.length, scenarioIdx, parallelIdx, 'Renewal Eligible');
        const selectedContract = results[safeIndex].contract_number;
        const billToCDHAccountID = results[safeIndex].bill_to_cdh_account_id;
        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID);
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }
        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Scenario Slot: ${scenarioIdx} | Using Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    // DXP-T381 Manual Renewals - Validate Start renewal banner ie., that Start button is displayed with text "“Start your renewal You can initiate your Renewal quote." when the contract is eligible for manual renewal
    test('Validate Start renewal banner when the contract is eligible for manual renewal @DXP-T381 @DXP-T349 @DXP-T348 @DXP-T358', async ({ renewalPlanningTab }) => {
        await renewalPlanningTab.assertRenewalEligibilityStatus();
    });

    test('Start Renewal and validate the Renewal quote generation in progress and validate whether amendments are disabled @DXP-T1285 @DXP-T1288 @DXP-T1301 @DXP-T355', async ({ page, renewalPlanningTab, summaryScreenPage }) => {
        await renewalPlanningTab.initiateManualRenewal();
        await summaryScreenPage.clickSubscriptionTab();
        await summaryScreenPage.summaryScreenPageAssertion();
        await page.reload({ waitUntil: 'networkidle' });
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreDisabled('Renewal');
        expect(await summaryScreenPage.isAmendContractButtonVisible()).toBe(false);
    });

});

test.describe('Draft Renewal Quote Validations Testcases', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    let selectedContractNumber: string;
    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("dxprenewalsgk");
        let selectedDealerCDHAccountID = dealercustomers.dxprenewalsgk_cdhID;
        let results = await contractsPage.selectRenewalInitiatedContracts(selectedDealerCDHAccountID);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID);
            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectRenewalInitiatedContracts(dealerCDHAccountID);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerCDHAccountID = dealerCDHAccountID;
                    const dealerName = key.replace('_cdhID', '');
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no Renewal Initiated contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;
        const scenarioIdx = resolveScenarioIndex(testInfo.title, parallelIdx, DRAFT_RENEWAL_TEST_TAG_ORDER);
        const safeIndex = resolveSafeIndex(results.length, scenarioIdx, parallelIdx, 'Renewal Initiated');
        const selectedContract = results[safeIndex].contract_number_search;
        selectedContractNumber = results[safeIndex].contract_number;
        const billToCDHAccountID = results[safeIndex].bill_to_cdh_account_id;
        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID);
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }
        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Scenario Slot: ${scenarioIdx} | Using Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    //Manual Renewal - Validate the manual renewal contract number with the suffix as -R1
    test('Validate the manual renewal contract number with the suffix as -R1 @DXP-T244', async ({ renewalPlanningTab, renewalSummaryPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
    });

    // DXP-T379 Manual Renewals - Validate The dealer can delete a renewal quote, and then manually regenerate another renewal quote. - Yearly/Monthly
    test('Validate The dealer can delete a renewal quote, and then manually regenerate another renewal quote. - Yearly/Monthly @DXP-T379', async ({ contractsPage, renewalPlanningTab, renewalSummaryPage, summaryScreenPage }) => {
        await renewalSummaryPage.discardDraftFunctionalityInSummaryScreen();
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContractNumber.toString());
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreEnabled();
        await renewalPlanningTab.assertRenewalEligibilityStatus();
        await renewalPlanningTab.initiateManualRenewal();
        // await renewalPlanningTab.renewalQuoteInProgress();
    });

    // DXP-T361 Manual Renewals - Validate contract History should have option to navigate from main contract to renewal contract and vice versa
    test('Validate contract History should have option to navigate from main contract to renewal contract and vice versa @DXP-T1286 @DXP-T361', async ({ summaryScreenPage, renewalSummaryPage, renewalPlanningTab, contractHistoryPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await contractHistoryPage.verifyContractHistory_ContractDraftCreated("renewal");
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreDisabled('Renewal');
        await contractHistoryPage.verifyContractHistory_RenewalDraftCreated();
    });

    // Place order the draft renewal quote and validate the contract history and audit log for the renewal contract
    test('Place order the draft renewal quote and validate the contract history and audit log for the renewal contract @DXP-T352 @DXP-T350 @DXP-T383 @DXP-T384 @DXP-T1300', async ({ summaryScreenPage, renewalSummaryPage, contractHistoryPage, auditLogPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        const renewalContractNumber = await renewalSummaryPage.getRenewalContractNumberFromHeader();
        await renewalSummaryPage.fillPOReferenceNumber("AutomationRenewalDXP_54");
        await renewalSummaryPage.verifyPOReferenceNumber("AutomationRenewalDXP_54");
        await renewalSummaryPage.clickPlaceOrderButton();
        await contractHistoryPage.verifyContractHistory_OrderPlaced("renewal");
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreDisabled('Renewal');
        await contractHistoryPage.verifyContractHistory_RenewalContractSubmitted();
        await auditLogPage.assertAuditLogPage();
        await auditLogPage.filterAuditLogsByCategory('Contract', 30000);
        await auditLogPage.verifyLatestContractAuditLog(renewalContractNumber, 30000);
    });

    // Validate end to end- Monthly-new contract -with edit renewal
    test('Validate end to end contract with edit renewal @DXP-T353 @DXP-T351 @DXP-T390', async ({ renewalSummaryPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await renewalSummaryPage.clickOnEditSubscription();
        await renewalSummaryPage.deleteAllSubscriptionsInEditRenewalToCheckGeneratePricingButtonDisabled();
    });
    // Validate edit-renewals with Add Products, Add Seats, Remove Seats and Cancel Subscription
    test('Validate edit-renewals with Add Products, Add Seats, Remove Seats and Cancel Subscription @DXP-T389 @DXP-T386 @DXP-T387 @DXP-T385 @DXP-T396', async ({ productsPage, renewalSummaryPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await renewalSummaryPage.clickOnEditSubscription();
        await renewalSummaryPage.addProductsInEditRenewal();
        await productsPage.selectFirstUnselectedProduct("10");
        await productsPage.submitButtonInAddProduct();
        await renewalSummaryPage.deleteSubscriptionEditRenewal();
        const initialQtyDM = await renewalSummaryPage.getSeatQuantity("BS-CAT-DM");
        const initialQty1M = await renewalSummaryPage.getSeatQuantity("BS-CAT-1M");
        await renewalSummaryPage.incrementSeats("BS-CAT-DM", 5);
        await renewalSummaryPage.decrementSeats("BS-CAT-1M", 3);
        await expect(async () => {
            expect(await renewalSummaryPage.getSeatQuantity("BS-CAT-DM")).toBe(initialQtyDM + 5);
            expect(await renewalSummaryPage.getSeatQuantity("BS-CAT-1M")).toBe(initialQty1M - 3);
        }).toPass({ timeout: 5000 });
        await renewalSummaryPage.fillPOReferenceNumber("AutomationRenewalDXP_54");
        await renewalSummaryPage.verifyPOReferenceNumber("AutomationRenewalDXP_54");
        await renewalSummaryPage.clickOnGeneratePricingInEditRenewal();
        await renewalSummaryPage.clickPlaceOrderButton();
    });

});

test.describe('Renewal Error Status Validations Testcases', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("tps");
        let selectedDealerCDHAccountID = dealercustomers.tps_cdhID;
        let results = await contractsPage.selectRenewalErrorContracts(selectedDealerCDHAccountID);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID);
            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectRenewalErrorContracts(dealerCDHAccountID);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerCDHAccountID = dealerCDHAccountID;
                    const dealerName = key.replace('_cdhID', '');
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no Renewal Error contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;
        const scenarioIdx = 0;
        const safeIndex = resolveSafeIndex(results.length, scenarioIdx, parallelIdx, 'Renewal Error');
        const selectedContract = results[safeIndex].contract_number;
        const billToCDHAccountID = results[safeIndex].bill_to_cdh_account_id;
        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID);
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }
        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Scenario Slot: ${scenarioIdx} | Using Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    test('Validate Retry button is displayed when the contract is in Renewal Error status @DXP-T382 @DXP-T388', async ({ page, summaryScreenPage, renewalPlanningTab }) => {
        await renewalPlanningTab.renewalContractCreationFailed();
        await summaryScreenPage.clickSubscriptionTab();
        await page.reload({ waitUntil: 'networkidle' });
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreDisabled('Renewal');
    });
});

test.describe(`Renewal Ineligible Contracts Validations Testcases`, () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("tps");
        let selectedDealerCDHAccountID = dealercustomers.tps_cdhID;
        let results = await contractsPage.selectAmendmentIneligibleContracts(selectedDealerCDHAccountID);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID);
            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectAmendmentIneligibleContracts(dealerCDHAccountID);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerCDHAccountID = dealerCDHAccountID;
                    const dealerName = key.replace('_cdhID', '');
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no Renewal Ineligible contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;
        const scenarioIdx = 0;
        const safeIndex = resolveSafeIndex(results.length, scenarioIdx, parallelIdx, 'Renewal Ineligible');
        const selectedContract = results[safeIndex].contract_number;
        const billToCDHAccountID = results[safeIndex].bill_to_cdh_account_id;
        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID);
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }
        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Scenario Slot: ${scenarioIdx} | Using Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    // DXP-T380 Manual Renewals - Validate Amend contract is disable when a renewal date is within 8days
    test('Validate Amend contract is disable when a renewal date is within 8days @DXP-T380', async ({ renewalPlanningTab, summaryScreenPage }) => {
        await renewalPlanningTab.assertRenewalEligibilityStatus();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.verifyAmendContractButtonIsDisabled();
    });
});

test.describe(`Renewal Activated Contracts Validations Testcases`, () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("tps");
        let selectedDealerName = "tps";
        let selectedCompanyName = dealercustomers[selectedDealerName as keyof typeof dealercustomers];
        let results = await contractsPage.selectRenewalActivatedContracts(selectedCompanyName);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && key !== `${selectedDealerName}_cdhID`);
            for (const key of fallbackDealerKeys) {
                const dealerName = key.replace('_cdhID', '');
                const companyName = dealercustomers[dealerName as keyof typeof dealercustomers];
                if (!companyName) {
                    continue;
                }
                const fallbackResults = await contractsPage.selectRenewalActivatedContracts(companyName);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerName = dealerName;
                    selectedCompanyName = companyName;
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no Renewal Activated contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;
        const scenarioIdx = 0;
        const safeIndex = resolveSafeIndex(results.length, scenarioIdx, parallelIdx, 'Renewal Activated');
        const selectedContract = results[safeIndex].contract_number_search;
        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Scenario Slot: ${scenarioIdx} | Using Contract: ${selectedContract} | Dealer: ${selectedDealerName} | Company: ${selectedCompanyName}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    test('Validate once renewed contract is active, parent contract should not have option for renewal / Amend - Yearly/monthly @DXP-T357', async ({ renewalPlanningTab, summaryScreenPage, contractHistoryPage, renewalSummaryPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await contractHistoryPage.verifyContractHistory_ContractDraftCreated("renewal");
        await summaryScreenPage.summaryScreenPageAssertion();
        expect(await summaryScreenPage.isAmendContractButtonVisible()).toBe(false);
        await renewalPlanningTab.assertRenewalNotEligibleStatus();
        await contractHistoryPage.verifyContractHistory_RenewalActivated();

    });
});


test.describe(`Amendment In Progress contracts can't be renewed Validations Testcases`, () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts("tps");
        let selectedDealerCDHAccountID = dealercustomers.tps_cdhID;
        let results = await contractsPage.selectAmendmentsInProgressAndRenewalInProgressContractsFromDB(selectedDealerCDHAccountID);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID);
            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectAmendmentsInProgressAndRenewalInProgressContractsFromDB(dealerCDHAccountID);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerCDHAccountID = dealerCDHAccountID;
                    const dealerName = key.replace('_cdhID', '');
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no Amendment In Progress contracts.');
        }
        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;
        const scenarioIdx = 0;
        const safeIndex = resolveSafeIndex(results.length, scenarioIdx, parallelIdx, 'Amendment In Progress');
        const selectedContract = results[safeIndex].contract_number;
        const billToCDHAccountID = results[safeIndex].bill_to_cdh_account_id;
        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID);
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }
        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Scenario Slot: ${scenarioIdx} | Using Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });

    // Validate manual renewal is not allowed when Amendment is in progress/amendment in draft
    test('Validate manual renewal is not allowed when Amendment is in progress/amendment in draft @DXP-T354', async ({ renewalPlanningTab, amendmentSummaryPage }) => {
        await renewalPlanningTab.assertRenewalEligibilityStatus();
        await renewalPlanningTab.assertPendingAmendmentPopup();
        await amendmentSummaryPage.visibilityOfBackToContractButton();
    });
});

test.describe('Renewal Draft Contract Details Screen - Edit term change functionality', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts('dxpAutomation');
        let selectedDealerCDHAccountID = dealercustomers.dxpAutomation_cdhID;
        let results = await contractsPage.selectRenewalInitiatedContracts(selectedDealerCDHAccountID);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID);
            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectRenewalInitiatedContracts(dealerCDHAccountID);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerCDHAccountID = dealerCDHAccountID;
                    const dealerName = key.replace('_cdhID', '');
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no R1 draft renewal contracts.');
        }

        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selectedContract = results[safeIndex].contract_number_search;
        const billToCDHAccountID = results[safeIndex].bill_to_cdh_account_id;
        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID);
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }
        console.log(`Worker ID: ${workerIdx} | Using R1 draft contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
    });


    /* Verify Edit Details Term dialog UI, Current badge and Save and Reprice is disabled */
    test('Verify Edit Details Term dialog UI, Current badge and Save and Reprice is disabled @DXP-T505 @DXP-T512 @DXP-T522 @DXP-T519 @DXP-T523', async ({ renewalSummaryPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await renewalSummaryPage.summaryScreenPageAssertion();
        const termLength = await renewalSummaryPage.getTermLengthValue();
        await renewalSummaryPage.clickEditDetailsButton();
        await renewalSummaryPage.clickTermMenuItem();
        await renewalSummaryPage.verifyChangeContractTermDialog();
        await renewalSummaryPage.verifyCurrentTermBadgeMatchesContractTermLength(termLength);
        await renewalSummaryPage.verifySaveAndRepriceButtonIsDisabled();
        await renewalSummaryPage.clickCloseOnTermChangeDialog();
        await renewalSummaryPage.summaryScreenPageAssertion();
    });

    /* Verify badge (Current) is displayed correctly for the current term in the Edit Details Term dialog
    *  Cancel edit term change should dismiss the dialog without making any changes
    *  Selecting a non-current term enables the Save and Reprice button
   */
    test('Verify selecting the other term enables Save and Reprice and Cancel dismisses the dialog @DXP-T511 @DXP-T517 @DXP-T608 @DXP-T502 @DXP-T504', async ({ renewalSummaryPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await renewalSummaryPage.summaryScreenPageAssertion();
        const termLength = await renewalSummaryPage.getTermLengthValue();
        await renewalSummaryPage.clickEditDetailsButton();
        await renewalSummaryPage.clickTermMenuItem();
        await renewalSummaryPage.clickNonCurrentTermRadioButton(termLength);
        await renewalSummaryPage.verifySaveAndRepriceButtonIsEnabled();
        await renewalSummaryPage.clickCancelOnTermChangeDialog();
        await renewalSummaryPage.summaryScreenPageAssertion();
    });

    /* Term length update consecutively from year to month and vice versa
    *  Contract total value changes accordingly with the term length updates and not goes to 0
    *  Contract history validations
    *  Multiple consecutive term changes are handled correctly
    */
    test('Verify term change Save and Reprice updates term length and contract total for month and year @DXP-T503 @DXP-T518 @DXP-T521 @DXP-T508 @DXP-T520 @DXP-T510', async ({ renewalSummaryPage, contractHistoryPage, contractsPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await renewalSummaryPage.summaryScreenPageAssertion();

        let termLength = await renewalSummaryPage.getTermLengthValue();
        let contractTotal = await renewalSummaryPage.getContractTotalValue();
        await renewalSummaryPage.clickEditDetailsButton();
        await renewalSummaryPage.clickTermMenuItem();
        await renewalSummaryPage.clickNonCurrentTermRadioButton(termLength);
        await renewalSummaryPage.verifySaveAndRepriceButtonIsEnabled();
        await renewalSummaryPage.clickSaveAndRepriceButton();
        await renewalSummaryPage.verifyTermLengthChangedFrom(termLength);
        await renewalSummaryPage.verifyContractTotalChangedFrom(contractTotal);
        const latestContractTotalAfterFirstChange = await renewalSummaryPage.getContractTotalValue();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractTermUOMUpdatedFrom(termLength);
        await contractHistoryPage.verifyContractHistoryPriceContains(latestContractTotalAfterFirstChange);
        await contractsPage.clickDraftsubscriptionTab();

        //reason for adding this test is to ensure that multiple consecutive term changes are handled correctly
        termLength = await renewalSummaryPage.getTermLengthValue();
        contractTotal = await renewalSummaryPage.getContractTotalValue();
        await renewalSummaryPage.clickEditDetailsButton();
        await renewalSummaryPage.clickTermMenuItem();
        await renewalSummaryPage.clickNonCurrentTermRadioButton(termLength);
        await renewalSummaryPage.verifySaveAndRepriceButtonIsEnabled();
        await renewalSummaryPage.clickSaveAndRepriceButton();
        await renewalSummaryPage.verifyTermLengthChangedFrom(termLength);
        await renewalSummaryPage.verifyContractTotalChangedFrom(contractTotal);
        const latestContractTotalAfterSecondChange = await renewalSummaryPage.getContractTotalValue();
        await contractHistoryPage.assertContractHistoryTab();
        await contractHistoryPage.verifyContractTermUOMUpdatedFrom(termLength);
        await contractHistoryPage.verifyContractHistoryPriceContains(latestContractTotalAfterSecondChange);
        await contractsPage.clickDraftsubscriptionTab();
    });
});


/* Verify that the Edit Details option is not present for submitted or active state renewal contracts */
test.describe('Renewal Submitted or Active Contract Details Screen - Edit Details option is not present', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test('Verify Edit Details is not present for submitted or active R1 renewal @DXP-T607', async ({ page, homePage, contractsPage, renewalSummaryPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts('dxpAutomation');
        let selectedDealerCDHAccountID = dealercustomers.dxpAutomation_cdhID;
        let results = await contractsPage.selectSubmittedOrActivatedRenewalContracts(selectedDealerCDHAccountID);
        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID);
            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectSubmittedOrActivatedRenewalContracts(dealerCDHAccountID);
                if (fallbackResults && fallbackResults.length > 0) {
                    results = fallbackResults;
                    selectedDealerCDHAccountID = dealerCDHAccountID;
                    const dealerName = key.replace('_cdhID', '');
                    await homePage.navigateToContracts(dealerName);
                    break;
                }
            }
        }
        if (!results || results.length === 0) {
            throw new Error('Database returned no submitted or active R1 renewal contracts.');
        }

        const workerIdx = testInfo.workerIndex;
        const safeIndex = workerIdx % results.length;
        const selectedContract = results[safeIndex].contract_number_search;
        const selectedStatus = results[safeIndex].status;
        const billToCDHAccountID = results[safeIndex].bill_to_cdh_account_id;
        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID);
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await renewalSummaryPage.summaryScreenPageAssertion();
        await renewalSummaryPage.verifyEditDetailsButtonIsNotVisible();
    });
});