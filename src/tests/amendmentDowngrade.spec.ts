import { test } from '../../src/fixture/TestFixture';
import { expect, type Page } from '@playwright/test';
import dealercustomers from '../pages/dealercustomers.json'
import { HomePage } from '../pages/HomePage';
import { ContractsPage } from '../pages/ContractsPage';
import { RenewalPlanningTab } from '../pages/RenewalPlanningTab';

let contract_number: number | undefined;
let contract_dealer: keyof typeof dealercustomers | undefined;
let cleanup_contract_number: number | undefined;
let cleanup_contract_dealer: keyof typeof dealercustomers | undefined;

async function clearRenewalPlanningDataForSelectedContractOnFailure(page: Page): Promise<void> {
    if (!cleanup_contract_number || !cleanup_contract_dealer) {
        console.log('[Failure Cleanup] Skipping cleanup because no contract number was selected.');
        return;
    }

    const homePage = new HomePage(page);
    const contractsPage = new ContractsPage(page);
    const renewalPlanningTab = new RenewalPlanningTab(page);

    await page.goto('/');
    await homePage.navigateToContracts(cleanup_contract_dealer);
    await contractsPage.searchContractWithGivenContractIDAndClickContract(cleanup_contract_number.toString());
    await renewalPlanningTab.clearOutAllRenewalPlanningTabData();
}

test.afterEach(async ({ page }, testInfo) => {
    const status = testInfo.status;
    if (status !== 'failed' && status !== 'timedOut' && status !== 'interrupted') {
        return;
    }

    try {
        await clearRenewalPlanningDataForSelectedContractOnFailure(page);
        console.log(`[Failure Cleanup] Cleared renewal planning data for contract ${cleanup_contract_number}.`);
    } catch (error) {
        console.warn(`[Failure Cleanup] Unable to clear renewal planning data for contract ${cleanup_contract_number}.`, error);
    }
});

test.describe('Amendments - Downgrade UI Assertions', () => {

    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage, summaryScreenPage }, testInfo) => {
        const dealerKey = 'dxpAutomation' as const;
        cleanup_contract_number = undefined;
        cleanup_contract_dealer = undefined;

        await page.goto('/');
        await homePage.navigateToContracts(dealerKey);
        const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers[dealerKey]);
        if (!contract_number || contract_dealer !== dealerKey) {
            if (!result[0].contract_number) {
                throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % result.length;
            const selectedContract = result[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Dealer: ${dealerKey} | Using Contract: ${selectedContract}`);
            contract_number = Number(selectedContract);
        }
        contract_dealer = dealerKey;
        cleanup_contract_number = contract_number;
        cleanup_contract_dealer = dealerKey;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
        await summaryScreenPage.summaryScreenPageAssertion();
        await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_SM');
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
    });

    test('Validate Downgrade Option - assertion', async ({ createAmendmentPage }) => {
        await createAmendmentPage.assertOnDowngradeOptionElements();
    });

    test('Validate PartialDowngrade', async ({ createAmendmentPage }) => {
        await createAmendmentPage.verifyAddToCartButtonIsDisabled();
        await createAmendmentPage.EnterTheLicenseAndAssertTheValueToRemove("1", "1");
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.verifySummaryofChangesForNegativeMotions();
        await createAmendmentPage.verifyRenewalTabContent("Downgrade 1 license from ");
    });

    test('Verify Available License Count is Updated After Removing Licenses', async ({ createAmendmentPage }) => {
        //adding licensing verification steps
        const totalAvailableLicenseCount = await createAmendmentPage.getAvailableLicenseCountInLicenseSelection1();
        await createAmendmentPage.enterLicenseCount(1);
        const expectedAvailable = totalAvailableLicenseCount - 1;
        await createAmendmentPage.verifyAvailableLicenseCount(expectedAvailable);
        console.log(`Total Available License Count: ${totalAvailableLicenseCount}`);
        console.log(`Expected Available License Count after removal: ${expectedAvailable}`);
        console.log('Available license count updated correctly after removing licenses');
    });

    test('Verify Summary of Changes Screen after downgrade Licenses', async ({ createAmendmentPage }) => {
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.verifySummaryofChangesForNegativeMotions();
        await createAmendmentPage.verifyRenewalTabContent("Downgrade 1 license from ");
        await createAmendmentPage.verifyDeleteIconPresent();
        await createAmendmentPage.clickDeleteIcon();
        // Verify page navigates back to Creating Contract Amendment with add to cart disabled
        await expect(createAmendmentPage.creatingContactAmendmentText).toBeVisible();
        await createAmendmentPage.verifyAddToCartButtonIsDisabled();
    });
});

test.describe('Amendments - downgrade - NO Conflicts - when downgrade request is already in Cart -same product', () => {

    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage, summaryScreenPage }, testInfo) => {
        const dealerKey = 'upg' as const;
        cleanup_contract_number = undefined;
        cleanup_contract_dealer = undefined;

        await page.goto('/');
        await homePage.navigateToContracts(dealerKey);
        const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers[dealerKey]);
        if (!contract_number || contract_dealer !== dealerKey) {
            if (!result[0].contract_number) {
                throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % result.length;
            const selectedContract = result[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Dealer: ${dealerKey} | Using Contract: ${selectedContract}`);
            contract_number = Number(selectedContract);
        }
        contract_dealer = dealerKey;
        cleanup_contract_number = contract_number;
        cleanup_contract_dealer = dealerKey;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
        await summaryScreenPage.summaryScreenPageAssertion();
        await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_SM');
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
    });

    test('Validate downgrade vs other amendments for same product @DXP-T166', async ({ createAmendmentPage, page }) => {
        //downgrade vs add seats.
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectAddSeatOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toHaveCount(0);
        //downgrade vs upgrade
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectUpgradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_SM');
        await createAmendmentPage.verifyTargetSubscriptionText();
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_DM');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toHaveCount(0);
        //downgrade vs remove seats
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectRemoveLicensesOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_SM');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toHaveCount(0);
        //downgrade vs downgrade seats
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_SM');
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
        await createAmendmentPage.enterLicenseCount(2);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toHaveCount(0);
        //downgrade vs cancellation conflict should display
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectCancellationOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_SM');
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toBeVisible();
    });
});

test.describe('Amendments - Full downgrade', () => {

    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage, summaryScreenPage }, testInfo) => {
        const dealerKey = 'dxpAutomation' as const;
        cleanup_contract_number = undefined;
        cleanup_contract_dealer = undefined;

        await page.goto('/');
        await homePage.navigateToContracts(dealerKey);
        const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers[dealerKey]);
        if (!contract_number || contract_dealer !== dealerKey) {
            if (!result[0].contract_number) {
                throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % result.length;
            const selectedContract = result[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Dealer: ${dealerKey} | Using Contract: ${selectedContract}`);
            contract_number = Number(selectedContract);
        }
        contract_dealer = dealerKey;
        cleanup_contract_number = contract_number;
        cleanup_contract_dealer = dealerKey;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
        await summaryScreenPage.summaryScreenPageAssertion();
        await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_SM');
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
    });

    test('Validate full downgrade', async ({ createAmendmentPage, page }) => {
        //adding licensing verification steps
        const totalAvailableLicenseCount = await createAmendmentPage.getAvailableLicenseCountInLicenseSelection1();
        console.log(`Total Available License Count: ${totalAvailableLicenseCount}`);
        await createAmendmentPage.enterLicenseCount(totalAvailableLicenseCount);
        await createAmendmentPage.verifyAvailableLicenseCount(0);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toHaveCount(0);
    });
});

test.describe('Amendments -No downgrade available SKU', () => {

    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage, summaryScreenPage }, testInfo) => {
        const dealerKey = 'upg' as const;
        cleanup_contract_number = undefined;
        cleanup_contract_dealer = undefined;

        await page.goto('/');
        await homePage.navigateToContracts(dealerKey);
        const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers[dealerKey]);
        if (!contract_number || contract_dealer !== dealerKey) {
            if (!result[0].contract_number) {
                throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % result.length;
            const selectedContract = result[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Dealer: ${dealerKey} | Using Contract: ${selectedContract}`);
            contract_number = Number(selectedContract);
        }
        contract_dealer = dealerKey;
        cleanup_contract_number = contract_number;
        cleanup_contract_dealer = dealerKey;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
        await summaryScreenPage.summaryScreenPageAssertion();
        await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
    });

    test('Select No downgrade available SKU and verify target subscription field behaviour', async ({ createAmendmentPage, amendmentSummaryPage, summaryScreenPage }) => {
        // await createAmendmentPage.verifyTargetSubscriptionText();
        await createAmendmentPage.verifyNoDowngradesAvailableMessage();
    });
});

test.describe('Amendments - downgrade Seats Save/Renewal Planning @DXP-T160', () => {

    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage, summaryScreenPage }, testInfo) => {
        const dealerKey = 'upg' as const;
        cleanup_contract_number = undefined;
        cleanup_contract_dealer = undefined;

        await page.goto('/');
        await homePage.navigateToContracts(dealerKey);
        const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers[dealerKey]);
        if (!contract_number || contract_dealer !== dealerKey) {
            if (!result[0].contract_number) {
                throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % result.length;
            const selectedContract = result[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Dealer: ${dealerKey} | Using Contract: ${selectedContract}`);
            contract_number = Number(selectedContract);
        }
        contract_dealer = dealerKey;
        cleanup_contract_number = contract_number;
        cleanup_contract_dealer = dealerKey;
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contract_number.toString());
        await summaryScreenPage.summaryScreenPageAssertion();
        await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.verificationOfCreateAmendmentPage();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_SM');
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
    });

    test('Validate the Renewal Planning Tab', async ({ createAmendmentPage, page }) => {
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.clickSaveButton();
        await expect(page.getByText('Renewal Planning')).toHaveCount(2);
    });
});



