import { expect } from '@playwright/test';
import { test } from '../../src/fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json'

async function verifyAnyLateRenewalDeletionEvent(contractHistoryPage: any) {
    const eventCandidates = [
        'Renewal Draft Deleted',
        'Contract Draft Deleted',
        'Renewal Quote Deleted',
        'Quote Deleted',
        'Draft Discarded'
    ];

    let lastError: unknown;
    for (const eventTitle of eventCandidates) {
        try {
            await contractHistoryPage.verifyContractHistoryEvent(eventTitle, 5000);
            console.log(`Deletion event found in Contract History: ${eventTitle}`);
            return;
        }
        catch (error) {
            lastError = error;
        }
    }

    throw new Error(`None of the expected deletion events were found in Contract History. Checked: ${eventCandidates.join(', ')}. Last error: ${String(lastError)}`);
}

test.describe('Late Renewal Eligible Contracts Validations', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts('ac');

        let selectedDealerCDHAccountID = dealercustomers.ac_cdhID;
        let results = await contractsPage.selectLateRenewalEligibleContracts(selectedDealerCDHAccountID);

        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(
                key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID
            );

            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectLateRenewalEligibleContracts(dealerCDHAccountID);

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
            throw new Error('Database returned no Late Renewal Eligible contracts.');
        }

        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;
        const selectedContract = results[0].contract_number;
        const billToCDHAccountID = results[0].bill_to_cdh_account_id;

        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(
                key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID
            );
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }

        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Using Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract?.toString());
    });

    test('Validate "Start Late Renewal" CTA and initiation flow including amendment blocking while pending @DXP-T198 @DXP-T199 @DXP-T203 @DXP-T211 @DXP-T223', async ({ renewalPlanningTab, summaryScreenPage }) => {
        await renewalPlanningTab.assertLateRenewalEligibilityStatus();
        await renewalPlanningTab.initiateLateRenewal();
        await summaryScreenPage.summaryScreenPageAssertion();
        expect(await summaryScreenPage.isAmendContractButtonVisible()).toBe(false);

        await renewalPlanningTab.openRenewalPlanningTab();

        const isQuoteReady = await renewalPlanningTab.lateRenewalQuoteReadyText.isVisible().catch(() => false);
        const isInProgress = await renewalPlanningTab.renewalInProgressText.isVisible().catch(() => false);

        if (isQuoteReady) {
            await expect(renewalPlanningTab.renewalQuoteGeneratedText).toBeVisible({ timeout: 30000 });
            await expect(renewalPlanningTab.viewRenewalQuoteButton).toBeVisible({ timeout: 30000 });
        }
        else if (isInProgress) {
            await expect(renewalPlanningTab.renewalInProgressSubText).toBeVisible({ timeout: 30000 });
        }
        else {
            await expect(renewalPlanningTab.renewalInitiatedText).toBeVisible({ timeout: 30000 });
            await expect(renewalPlanningTab.renewalInitiatedSubText).toBeVisible({ timeout: 30000 });
        }
    });
});

test.describe('Late Renewal Initiated Contracts Validations', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    let selectedParentContractNumber: string;
    let selectedDealerCDHAccountIDForInitiated: string;

    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts('ac');

        let selectedDealerCDHAccountID = dealercustomers.ac_cdhID;
        let results = await contractsPage.selectLateRenewalInitiatedContracts(selectedDealerCDHAccountID);

        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(
                key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID
            );

            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectLateRenewalInitiatedContracts(dealerCDHAccountID);

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
            throw new Error('Database returned no Late Renewal Initiated contracts.');
        }

        selectedDealerCDHAccountIDForInitiated = selectedDealerCDHAccountID;

        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;

        const selectedContract = results[0].contract_number_search || results[0].contract_number;
        selectedParentContractNumber = (results[0].parent_contract_number || '').toString();
        const billToCDHAccountID = results[0].bill_to_cdh_account_id;

        if (!selectedParentContractNumber) {
            throw new Error('Parent contract number is missing for Late Renewal Initiated contract.');
        }

        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(
                key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID
            );
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }

        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Using Renewal Contract: ${selectedContract} | Parent Contract: ${selectedParentContractNumber} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract?.toString());
    });

    // https://jira.trimble.tools/browse/DXP-2080 - Once this bug is fixed, this test will pass
    test('Validate dealer can edit, delete/regenerate, and submit late renewal quote with history and suffix validations @DXP-T201 @DXP-T202 @DXP-T204 @DXP-T205 @DXP-T206 @DXP-T207 @DXP-T208 @DXP-T209 @DXP-T212 @DXP-T226 @DXP-T227 @DXP-T232 @DXP-T233 @DXP-T234 @DXP-T235', async ({ renewalPlanningTab, contractsPage, contractHistoryPage, renewalSummaryPage, productsPage }) => {
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await contractHistoryPage.verifyContractHistory_ContractDraftCreated('renewal');
        await contractHistoryPage.verifyContractHistory_RenewalDraftCreated();
        await renewalSummaryPage.clickOnEditSubscription();
        await renewalSummaryPage.addProductsInEditRenewal();

        const unselectedProductsCount = await productsPage.addUnSelectedProductsCheckBoxes.count();
        if (unselectedProductsCount === 0) {
            test.skip(true, 'No unselected products are available to validate edit-and-generate-pricing flow.');
        }

        await productsPage.selectFirstUnselectedProduct('10');
        await productsPage.submitButtonInAddProduct();
        await renewalSummaryPage.clickOnGeneratePricingInEditRenewal();
        await expect(renewalSummaryPage.placeOrderButton).toBeEnabled();
        await renewalSummaryPage.discardDraftFunctionalityInSummaryScreen();
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedParentContractNumber);
        await contractHistoryPage.assertContractHistoryTab();
        await verifyAnyLateRenewalDeletionEvent(contractHistoryPage);

        await renewalPlanningTab.assertLateRenewalEligibilityStatus();
        await expect(renewalPlanningTab.viewRenewalQuoteButton).not.toBeVisible({ timeout: 10000 });
        await renewalPlanningTab.initiateLateRenewal();

        const lateRenewalInitiatedResults = await contractsPage.selectLateRenewalInitiatedContracts(selectedDealerCDHAccountIDForInitiated);
        if (!lateRenewalInitiatedResults || lateRenewalInitiatedResults.length === 0) {
            test.skip(true, 'No initiated late renewal quote is available for order submission validation after regeneration.');
        }

        const regeneratedOrExistingDraft = lateRenewalInitiatedResults.find(
            (row: any) => String(row.parent_contract_number || '') === selectedParentContractNumber
        );
        if (!regeneratedOrExistingDraft) {
            throw new Error(`No regenerated late-renewal draft found for parent contract ${selectedParentContractNumber}.`);
        }

        const contractToSubmit = regeneratedOrExistingDraft.contract_number_search || regeneratedOrExistingDraft.contract_number;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractToSubmit?.toString());
        await renewalSummaryPage.validateManualRenewalContractNumberFormat();
        await renewalSummaryPage.fillPOReferenceNumber('AutomationLateRenewalDXP_');
        await renewalSummaryPage.verifyPOReferenceNumber('AutomationLateRenewalDXP_');
        await renewalSummaryPage.clickPlaceOrderButton();
        await contractHistoryPage.verifyContractHistory_OrderPlaced('renewal');
        await contractHistoryPage.verifyContractHistory_RenewalContractSubmitted();
    });
});

test.describe('Late Renewal Ineligible Expired Contracts Validations', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage }, testInfo) => {
        await page.goto('/');
        await homePage.navigateToContracts('ac');

        let selectedDealerCDHAccountID = dealercustomers.ac_cdhID;
        let results = await contractsPage.selectPermanentlyExpiredContracts(selectedDealerCDHAccountID);

        if (!results || results.length === 0) {
            const fallbackDealerKeys = Object.keys(dealercustomers).filter(
                key => key.endsWith('_cdhID') && dealercustomers[key as keyof typeof dealercustomers] !== selectedDealerCDHAccountID
            );

            for (const key of fallbackDealerKeys) {
                const dealerCDHAccountID = dealercustomers[key as keyof typeof dealercustomers];
                const fallbackResults = await contractsPage.selectPermanentlyExpiredContracts(dealerCDHAccountID);

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
            throw new Error('Database returned no permanently expired contracts beyond late-renewal window.');
        }

        const workerIdx = testInfo.workerIndex;
        const parallelIdx = testInfo.parallelIndex;

        const selectedContract = results[0].contract_number;
        const billToCDHAccountID = results[0].bill_to_cdh_account_id;

        if (billToCDHAccountID !== selectedDealerCDHAccountID) {
            const matchingKey: string | undefined = Object.keys(dealercustomers).find(
                key => dealercustomers[key as keyof typeof dealercustomers] === billToCDHAccountID
            );
            if (matchingKey) {
                const dealerName = matchingKey.replace('_cdhID', '');
                await homePage.navigateToContracts(dealerName);
            }
        }

        console.log(`Worker ID: ${workerIdx} | Parallel Slot: ${parallelIdx} | Using Contract: ${selectedContract} | Bill To CDH Account ID: ${billToCDHAccountID}`);
        await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract?.toString());
    });

    test('Validate renewal actions & amendment actions are disabled beyond the 30-day window while contract details remain viewable @DXP-T230 @DXP-T231', async ({ summaryScreenPage, renewalPlanningTab }) => {
        await summaryScreenPage.summaryScreenPageAssertion();
        expect(await summaryScreenPage.isAmendContractButtonVisible()).toBe(false);
        await expect(summaryScreenPage.contractStatusText).toContainText('Expired');
        await renewalPlanningTab.assertLateRenewalNotEligibleStatus();

    });
});