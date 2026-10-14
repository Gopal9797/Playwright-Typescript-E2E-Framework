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

test.describe.serial('Amendments - Cancellation', () => {

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
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectCancellationOption();
    });

    test('Validate Cancellation - text @DXP-T156', async ({ page }) => {
        await expect(page.getByText(/License Selection/)).toBeVisible();
        await expect(page.getByText(/By adding this action to your cart, the full cancellation of all licenses of this product will be added to your cart./)).toBeVisible();
    });

    test('Validate Cancellation - Addtocart/Summary of changes @DXP-T157 @DXP-T161', async ({ createAmendmentPage }) => {
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.verifySummaryofChangesForNegativeMotions();
        await createAmendmentPage.verifyRenewalTabContent("Cancel");
        await createAmendmentPage.verifyDeleteIconPresent();
        await createAmendmentPage.clickDeleteIcon();
        // Verify page navigates back to Creating Contract Amendment with add to cart disabled
        await expect(createAmendmentPage.creatingContactAmendmentText).toBeVisible();
        // await createAmendmentPage.verifyAddToCartButtonIsDisabled();
    });

    test('Verify Cancellation - Save/Renewal Planning @DXP-T158 @DXP-T162 @DXP-T163', async ({ createAmendmentPage, page }) => {
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.clickSaveButton();
        await expect(page.getByText('Renewal Planning')).toHaveCount(2);
        await expect(page.getByText('These items are saved in the system and will be processed during the renewal phase. If needed, you can remove them by clicking the delete icon or by excluding them from your cart when creating an amendment.')).toHaveCount(1);
        await expect(page.getByText('Product Cancellation (1)')).toHaveCount(1);
        await expect(page.getByText('AT RENEWAL')).toBeVisible();
        await expect(page.getByText('Cancel')).toHaveCount(3);
        await createAmendmentPage.verifyDeleteIconPresent();
        await createAmendmentPage.clickDeleteIcon();
        await expect(page.getByText(/Confirm Action/)).toBeVisible();
        await expect(page.getByText(/Are you sure you want to delete this item?/)).toBeVisible();
        await createAmendmentPage.yesOptionOnDeleteConfirmationInSummaryOfChanges.click();
        await expect(page.getByText(/Product Cancellation (1)/)).not.toBeVisible();
        await expect(page.getByText(/No negative actions are currently planned for this renewal/)).toBeVisible();
    });

});

