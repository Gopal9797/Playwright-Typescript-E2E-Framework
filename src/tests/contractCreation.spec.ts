import { test } from '../../src/fixture/TestFixture';
import { expect } from "@playwright/test";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
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

test.describe('Contract Creation ', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("BPC");
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
    });

    // Commenting out the below test cases as part of the contract creation flow 
    // since we are covering the happy flow of contract creation in a different test case with multiple accounts. 
    // We can always come back and enable these negative test cases if needed in the future.
    // test('Selecting a Customer', async ({ customerSelectionPage }) => {
    //     await customerSelectionPage.findAndSelectingCustomer(testdata[0].customer ?? '');

    // });

    test('Cancel Creation of Contracts Flow', async ({ contractsPage, customerSelectionPage }) => {
        await customerSelectionPage.cancelButtonValidation();
        await contractsPage.assertContractsPage();
    });

    test('Customer is requried validation', async ({ contractsPage, customerSelectionPage }) => {
        await customerSelectionPage.customerIsRequiredValidation();

    })
});

// Data-driven Happy Flow for multiple storage states
const isDevEnv = (process.env.ENV ?? '').toLowerCase() === 'dev';
const happyFlowAccounts = [
    // { label: 'bpc', storageState: '.auth/multiaccountsuser.json', billToEmailEnv: 'BPC_ACCOUNT_EMAIL' },
    ...(!isDevEnv ? [{ label: 'srm', customerAcc: 'Gilmore', storageState: '.auth/upgaccountuser.json', billToEmailEnv: 'SRM_ACCOUNT_EMAIL' }] : []),
    ...(!isDevEnv ? [{ label: 'upg', customerAcc: 'CRM', storageState: '.auth/upgaccountuser.json', billToEmailEnv: 'UPG_ACCOUNT_EMAIL' }] : []),
    ...(isDevEnv ? [{ label: 'ntjv', customerAcc: 'Kumagai', storageState: '.auth/upgaccountuser.json', billToEmailEnv: 'UPG_ACCOUNT_EMAIL' }] : []),
];

for (const account of happyFlowAccounts) {
    test.describe(`Contract Creation - Happy Flow @DevSanityTests (${account.label})`, () => {
        test.use({ storageState: account.storageState });
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts(`${account.label}`);
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
        });

        test(`Contract Creation - Happy Flow @NZDEV-T78 Contract Activation @dailysanity (${account.label})`, async ({ page, orderNotificationsPage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage, contractHistoryPage, auditLogPage }) => {
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(account.customerAcc);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength("1", "year");
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            const billToEmail = process.env[account.billToEmailEnv] ?? '';
            // await termsPage.BillToValidation(billToEmail);
            console.log(`account Choosen is : ${account.label}`);
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertion();
            const { price, name, sku } = await productsPage.selectFirstProduct((new Date().getDate() + 100).toString());
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion()
            const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPO');
            await summaryScreenPage.verifyProductDetails(name ?? '', sku ?? '', price ?? '');
            const contractID = await summaryScreenPage.getContractIDFromHeader();
            await summaryScreenPage.convertToContract();
            await contractsPage.assertContractsPage();
            await contractsPage.searchContractWithGivenContractID(contractID, poReferenceNumber);
            await contractsPage.searchTextBox.clear();
            await page.reload();
            await orderNotificationsPage.notificationAssertionAfterContractCreation(String(contractID));
            await summaryScreenPage.verifyProductDetails(name ?? '', sku ?? '', price ?? '');
            await contractHistoryPage.assertContractHistoryTab();
            await contractHistoryPage.verifyContractHistory_ContractDraftCreated();
            await contractHistoryPage.verifyContractHistory_OrderPlaced();
            await auditLogPage.assertAuditLogPage();
            await auditLogPage.filterAuditLogsByCategory('Contract', 30000);
            await auditLogPage.verifyLatestContractAuditLog(String(contractID), 30000);
        });

    });
}


test.describe('Discarding Draft Testcases with Contract Creation', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.describe.configure({ mode: 'serial' }); // Tests inside this block run sequentially
    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts('dxpautomation');
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.dxpAutomation)
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength("1", "month");
        await termsPage.toggleAutoRenew(true);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertionMonthly();
        await productsPage.selectFirstProduct((new Date().getDate()).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        const poReferenceNumber = await summaryScreenPage.fillPOReferenceNumber('AutomationPO');

    });

    test('Verify Discard Draft Button Functionality @NZDEV-T76 @NZDEV-T77 @dailysanity', async ({ contractsPage, summaryScreenPage }) => {
        const contractID = await summaryScreenPage.getContractIDFromHeader();
        await contractsPage.discardDraftFunctionalityInContractCreationScreen();
        await contractsPage.assertContractsPage();
        await contractsPage.verifyNoResultsFoundForGivenContractID(contractID);
    });

    // test.skip('Sidesheet: Delete Button should successfully delete the Expired Draft @NZDEV-T128', async ({ sidesheetPage, contractsPage, summaryScreenPage }) => {
    //     const contractNumber = await summaryScreenPage.getContractIDFromHeader();
    //     const resultSet = await contractsPage.selectQuery(contractNumber);
    //     console.log('ResultSet:', resultSet);
    //     await contractsPage.updateValidUntilDateForGivenContractID(resultSet[0].contract_id, 0);
    //     await summaryScreenPage.backToTableButton.click();
    //     await contractsPage.assertContractsPage();
    //     await contractsPage.searchContractWithGivenContractID(contractNumber, '');
    //     await contractsPage.verifySidesheetOpensOnContractClick();
    //     await expect(sidesheetPage.discardDraftButton).not.toBeVisible();
    //     await sidesheetPage.deleteButton.click();
    //     await sidesheetPage.acceptButton.click();
    //     await sidesheetPage.contractDraftDiscardedText.isVisible();
    //     await contractsPage.verifyNoResultsFoundForGivenContractID(contractNumber);
    // });

    test('Summary Screen: Delete Button should successfully delete the Expired Draft @NZDEV-T135', async ({ sidesheetPage, contractsPage, summaryScreenPage }) => {
        const contractNumber = await summaryScreenPage.getContractIDFromHeader();
        const resultSet = await contractsPage.selectQuery(contractNumber);
        console.log('ResultSet:', resultSet);
        await contractsPage.updateValidUntilDateForGivenContractID(resultSet[0].contract_id, 0);
        await contractsPage.updateStatusAsExpiredForGivenContractID(resultSet[0].contract_id);
        await summaryScreenPage.backToTableButton.click();
        await contractsPage.assertContractsPage();
        await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
        // await contractsPage.verifySidesheetOpensOnContractClick();
        // Commenting out Sidesheet related assertions as they are off under FF 
        // await sidesheetPage.viewSummaryButton.click();
        await summaryScreenPage.summaryScreenPageAssertion();
        await expect(summaryScreenPage.discardDraftButton).not.toBeVisible();
        await expect(summaryScreenPage.deleteButton).not.toBeVisible();
        //contract histroy - draft expired
        // await summaryScreenPage.deleteButton.click();
        // await summaryScreenPage.acceptButton.click();
        // await summaryScreenPage.contractDraftDiscardedText.isVisible();
        // await contractsPage.verifyNoResultsFoundForGivenContractID(contractNumber);
    });

    test('Validate whether Expired Draft is hidden, when validUntil date is behind by more than 30 days from today in DB @NZDEV-T136', async ({ contractsPage, summaryScreenPage }) => {
        const contractNumber = await summaryScreenPage.getContractIDFromHeader();
        const resultSet = await contractsPage.selectQuery(contractNumber);
        console.log('ResultSet:', resultSet);
        await contractsPage.updateValidUntilDateForGivenContractID(resultSet[0].contract_id, 60); // Set validUntil date to 60 days in the past
        await contractsPage.updateStatusAsExpiredForGivenContractID(resultSet[0].contract_id);
        await summaryScreenPage.backToTableButton.click();
        await contractsPage.assertContractsPage();
        await contractsPage.verifyContractStatusIsExpired(contractNumber);
    });
});


test.describe('Create Contract - Autorenewal OFF and Future Date (pick from calendar, manually enter date)', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.describe.configure({ mode: 'serial' }); // Tests inside this block run sequentially
    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts('kuk');
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.kuk)
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength("1", "month");
        await termsPage.chooseCurrencyDropdown('USD');
    });

    test(`@DXP-T34 @DXP-T564 Verify Autorenewal OFF flag is shown in contract details and summary screen`, async ({ page, orderNotificationsPage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
        await termsPage.toggleAutoRenew(false);
        //await termsPage.setAFutureDate();
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertion();
        await productsPage.selectFirstProduct((new Date().getDate()).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.fillPOReferenceNumber('AutomationPO');
        await summaryScreenPage.verifyAutoRenewalIsOffInSummaryScreen();
        await summaryScreenPage.clickContractDetailsTab();
        await summaryScreenPage.verifyAutoRenewalIsOFFInContractDetailsScreen();
        await summaryScreenPage.clickSubscriptionTab();
        await contractsPage.placeOrderInCreateContractWorkflow();
        expect(summaryScreenPage.contractSubmittedSuccessfullyText).toBeVisible({ timeout: 60000 });
        await summaryScreenPage.verifyNoResultsFoundWhenAmendmentIsDiscarded();
        //await summaryScreenPage.discardDraftFunctionalityInSummaryScreen();
    });

    test('Verify create contract not allowed for future year - manualy enter date', async ({ page, termsPage }) => {
        await termsPage.toggleAutoRenew(false);
        await termsPage.setAFutureDate();
        await termsPage.clearDateButton.click();
        await termsPage.verifyCreateContractNotAllowedForFutureYear();
    });

    test('Verify create contract enabled within allowed range - manually enter date', async ({ page, termsPage }) => {
        await termsPage.toggleAutoRenew(false);
        await termsPage.setAFutureDate();
        await termsPage.clearDateButton.click();
        await termsPage.verifyCreateContractEnabledWithinAllowedRange();
    });

    test('Verify create contract not allowed beyond max days - manually enter date', async ({ page, termsPage }) => {
        await termsPage.toggleAutoRenew(false);
        await termsPage.setAFutureDate();
        await termsPage.clearDateButton.click();
        await termsPage.verifyCreateContractNotAllowedBeyondMaxDays();
    });

    test('Verify create contract not allowed for month beyond two ahead - manually enter date', async ({ page, termsPage }) => {
        await termsPage.toggleAutoRenew(false);
        await termsPage.setAFutureDate();
        await termsPage.clearDateButton.click();
        await termsPage.verifyCreateContractNotAllowedForMonthBeyondTwoAhead();
    });

    test('Verify entering today date shows error - manually enter date', async ({ page, termsPage }) => {
        await termsPage.toggleAutoRenew(false);
        await termsPage.setAFutureDate();
        await termsPage.clearDateButton.click();
        await termsPage.verifyCreateContractNotAllowedForPastDate();
    });

    test(`Verify create contract with future date (pick from calendar)`, async ({ page, orderNotificationsPage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
        await termsPage.toggleAutoRenew(false);
        const { day, month, year } = await termsPage.selectStartDateBasedOnFutureUsingCalendarPickerAndReturnDate();
        const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('en-GB', { month: 'short' });
        const formattedStartDate = `${parseInt(day)} ${monthName} ${year}`;
        await termsPage.chooseCurrencyDropdown('USD');

        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertion();
        const { price, name, sku } = await productsPage.selectFirstProduct((new Date().getDate() + 100).toString());
        await productsPage.generatePricing();
        await summaryScreenPage.summaryScreenPageAssertion();
        await summaryScreenPage.fillPOReferenceNumber('AutomationPO');

        await summaryScreenPage.verifyStartDateInSummaryScreen(formattedStartDate);
        await summaryScreenPage.verifyAutoRenewalIsOffInSummaryScreen();

        await summaryScreenPage.clickContractDetailsTab();
        await summaryScreenPage.verifyAutoRenewalIsOFFInContractDetailsScreen();
        await summaryScreenPage.verifyStartDateInContractDetailsScreen(formattedStartDate);

        await summaryScreenPage.clickSubscriptionTab();
        await contractsPage.placeOrderInCreateContractWorkflow();
    });

});
