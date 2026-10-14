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

test.describe('Amendments - Remove Seats UI Assertions', () => {

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
        await createAmendmentPage.selectRemoveLicensesOption();
    });

    test('Validate Remove Licenses - assertion', async ({ createAmendmentPage }) => {
        await createAmendmentPage.assertOnRemoveLicensesOptionElements();
    });

    test('Validate Remove Licenses - add to cart', async ({ createAmendmentPage }) => {
        await createAmendmentPage.verifyAddToCartButtonIsDisabled();
        await createAmendmentPage.EnterTheLicenseAndAssertTheValueToRemove("1", "1");
        await createAmendmentPage.clickAddToCartButton();
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

    test('Verify Summary of Changes Screen after Remove Licenses', async ({ createAmendmentPage, renewalPlanningTab }) => {
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.verifySummaryofChangesForNegativeMotions();
        await createAmendmentPage.verifyRenewalTabContent("Remove 1 license from ");
        await createAmendmentPage.verifyDeleteIconPresent();
        await createAmendmentPage.clickDeleteIcon();
        // Verify page navigates back to Creating Contract Amendment with add to cart disabled
        await expect(createAmendmentPage.creatingContactAmendmentText).toBeVisible();
        await createAmendmentPage.verifyAddToCartButtonIsDisabled();
    });
});

test.describe('Amendments - Remove Seats Save/Renewal Planning', () => {

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
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectRemoveLicensesOption();
    });

    test('Validate the Renewal Planning Tab @DXP-T159', async ({ createAmendmentPage, renewalPlanningTab, summaryScreenPage }) => {
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.clickSaveButton();
        await renewalPlanningTab.assertRenewalPlanningTabDetailsSectionVisibility();
        await summaryScreenPage.validateAllManageLicensesAssignmentsButtonsAreDisabled('negative request');
    });
});

test.describe('Amendments - Remove Seats Conflicts - Cart', () => {

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
        await createAmendmentPage.selectRemoveLicensesOption();
    });

    test('Validate Conflict on Remove Licenses and Add seats for the same product', async ({ createAmendmentPage, page }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectAddSeatOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toBeVisible();
        await createAmendmentPage.conflictCancelButtonClick();
    });

    test('Validate Conflict on Removing all the available Licenses', async ({ createAmendmentPage, page, summaryScreenPage }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        const totalAvailableLicenseCount = await createAmendmentPage.getAvailableLicenseCountInLicenseSelection1();
        await createAmendmentPage.enterLicenseCount(totalAvailableLicenseCount);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/You are cancelling the Subscription./)).toBeVisible();
        await createAmendmentPage.conflictCancelButtonClick();
    });

    test('Validate Remove Licenses and upgrade is allowed for the same product in the same amendment', async ({ createAmendmentPage, page, productsPage }) => {
        // await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectUpgradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_DM');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).not.toBeVisible();
    });

    test('Validate Remove Licenses and downgrade is allowed for the same product in the same amendment', async ({ createAmendmentPage, page, productsPage }) => {
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.selectTheProduct('BS_CAT_DM');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_DM');
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).not.toBeVisible();
    });

    test('Validate Conflict on  Remove Licenses and cancellation  for the same product in the same amendment', async ({ createAmendmentPage, page }) => {
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.selectSubscriptionToModify();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectCancellationOption();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
        await expect(page.getByText(/License Selection/)).toBeVisible();
        await expect(page.getByText(/By adding this action to your cart, the full cancellation of all licenses of this product will be added to your cart./)).toBeVisible();
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toBeVisible();
        await createAmendmentPage.conflictCancelButtonClick();
    });

    test('Update Remove Licenses ie Product count should be updated in cart)', async ({ createAmendmentPage, page }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.verifyRenewalTabContent("Remove 1 license from ");
        await createAmendmentPage.hideDetailsButton.click();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectRemoveLicensesOption();
        await createAmendmentPage.enterLicenseCount(2);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.verifyRenewalTabContent("Remove 2 licenses from ");
    });

    //Differt products
    test('Validate Remove Licenses and Add seats is  allowed for the dift product in the same amendment', async ({ createAmendmentPage, page, productsPage }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheSecondOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectAddSeatOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).not.toBeVisible();
    });
});
//Saved Negative amendment and creating new amendment with conflicting action
test.describe('Amendments - Remove Seats Conflicts -Renewal Planning', () => {

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
        await createAmendmentPage.selectRemoveLicensesOption();
    });

    test('Validate Conflict when Remove Licenses request is already in renewal planning', async ({ createAmendmentPage, page, summaryScreenPage, renewalPlanningTab }) => {
        //  Remove Licenses presaved vs remove licenses  
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.clickSaveButton();
        await renewalPlanningTab.assertRenewalPlanningTabDetailsSectionVisibility();
        await summaryScreenPage.summaryScreenPageAssertion();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectRemoveLicensesOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toBeVisible();
        await createAmendmentPage.conflictCancelButtonClick();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.clickDeleteIcon();
        await createAmendmentPage.yesOptionOnDeleteConfirmationInSummaryOfChanges.click();
    });

    test('Validate Conflict on Remove Licenses and Add Seats for the same product once Remove Licenses request is raised in renewal Planning', async ({ createAmendmentPage, page, summaryScreenPage, renewalPlanningTab }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.clickSaveButton();
        await renewalPlanningTab.assertRenewalPlanningTabDetailsSectionVisibility();
        await summaryScreenPage.subscriptionTab.click();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectAddSeatOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toBeVisible();
        await expect(page.getByText(/This subscription has multiple amendments that conflict with each other. Select which amendment you want to keep in the cart./)).toBeVisible();
        await createAmendmentPage.conflictCancelButtonClick();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.clickDeleteIcon();
        await createAmendmentPage.yesOptionOnDeleteConfirmationInSummaryOfChanges.click();
    });

    test('Validate Conflict on Remove Licenses and Upgrade for the same product once Remove Licenses request is raised in renewal Planning', async ({ createAmendmentPage, page, summaryScreenPage, renewalPlanningTab }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.clickSaveButton();
        await renewalPlanningTab.assertRenewalPlanningTabDetailsSectionVisibility();
        await summaryScreenPage.subscriptionTab.click();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectUpgradeOption();
        await createAmendmentPage.verifyTargetSubscriptionText();
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_PRECISION');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toBeVisible();
        await expect(page.getByText(/This subscription has multiple amendments that conflict with each other. Select which amendment you want to keep in the cart./)).toBeVisible();
        await createAmendmentPage.conflictCancelButtonClick();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.clickDeleteIcon();
        await createAmendmentPage.yesOptionOnDeleteConfirmationInSummaryOfChanges.click();
    });

    test('Validate Conflict on Remove Licenses and Downgrade for the same product once Remove Licenses request is raised in renewal Planning', async ({ createAmendmentPage, page, summaryScreenPage, renewalPlanningTab }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheSecondOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.clickSaveButton();
        await renewalPlanningTab.assertRenewalPlanningTabDetailsSectionVisibility();
        await summaryScreenPage.subscriptionTab.click();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheSecondOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectDowngradeOption();
        await createAmendmentPage.clickTargetSubscriptionDropdown();
        await createAmendmentPage.selectTheProduct('BS_CAT_1M');
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toBeVisible();
        await expect(page.getByText(/This subscription has multiple amendments that conflict with each other. Select which amendment you want to keep in the cart./)).toBeVisible();
        await createAmendmentPage.conflictCancelButtonClick();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.clickDeleteIcon();
        await createAmendmentPage.yesOptionOnDeleteConfirmationInSummaryOfChanges.click();
    });


    test('Validate Conflict on Remove Licenses and Cancellation for the same product once Remove Licenses request is raised in renewal Planning', async ({ renewalPlanningTab, createAmendmentPage, page, summaryScreenPage }) => {
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.enterLicenseCount(1);
        await createAmendmentPage.clickAddToCartButton();
        await createAmendmentPage.clickSaveButton();
        await renewalPlanningTab.assertRenewalPlanningTabDetailsSectionVisibility();
        await summaryScreenPage.subscriptionTab.click();
        await createAmendmentPage.clickAmendContractButton();
        await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
        await createAmendmentPage.clickAmendmentTypeDropdown();
        await createAmendmentPage.selectCancellationOption();
        await createAmendmentPage.clickAddToCartButton();
        await expect(page.getByText(/Conflicting Amendments Detected/)).toBeVisible();
        await expect(page.getByText(/This subscription has multiple amendments that conflict with each other. Select which amendment you want to keep in the cart./)).toBeVisible();
        await createAmendmentPage.conflictCancelButtonClick();
        await createAmendmentPage.viewDetails.click();
        await createAmendmentPage.clickDeleteIcon();
        await createAmendmentPage.yesOptionOnDeleteConfirmationInSummaryOfChanges.click();

    });

});
