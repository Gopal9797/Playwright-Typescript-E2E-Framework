// import { test } from '../../src/fixture/TestFixture';
// import { expect } from "@playwright/test";

// test.describe('Side Sheet Testcases', () => {
//     test.use({ storageState: '.auth/multiaccountsuser.json' });
//     test.beforeEach(async ({ page, homePage, contractsPage }) => {
//         await page.goto('/');
//         await homePage.navigateToContracts("BPC");
//         await contractsPage.verifySidesheetOpensOnContractClick();
//     });

//     test('Validate Dealer Information in Sidesheet @NZDEV-T94', async ({ sidesheetPage, summaryScreenPage }) => {
//         const { dealerAccountName, dealerName, dealerEmail, billToAddress } = await sidesheetPage.dealerInformation();
//         await sidesheetPage.viewSummaryScreen();
//         await summaryScreenPage.summaryScreenPageAssertion();
//         await summaryScreenPage.verifyDealerInformation(dealerAccountName ?? '', dealerName ?? '', dealerEmail ?? '', billToAddress ?? '');
//     });

//     test('Validate Terms Information in Sidesheet @NZDEV-T95', async ({ sidesheetPage, summaryScreenPage }) => {
//         const { termLength, startDate, autoRenewal } = await sidesheetPage.termsInformation();
//         await sidesheetPage.viewSummaryScreen();
//         await summaryScreenPage.summaryScreenPageAssertion();
//         await summaryScreenPage.verifyTermsInformation(termLength ?? '', startDate ?? '', autoRenewal ?? false);
//     });

//     test('Validate Customer Information in Sidesheet @NZDEV-T96', async ({ sidesheetPage, summaryScreenPage }) => {
//         const { customerAccountName, customerAdminName, customerAdminEmail, shipToAddress } = await sidesheetPage.customerInformation();
//         await sidesheetPage.viewSummaryScreen();
//         await summaryScreenPage.summaryScreenPageAssertion();
//         await summaryScreenPage.verifyCustomerInformation(customerAccountName ?? '', customerAdminName ?? '', customerAdminEmail ?? '', shipToAddress ?? '');
//     });

//     test('@NZDEV-T275 Validate Product Information in Sidesheet @NZDEV-T97', async ({ sidesheetPage, summaryScreenPage }) => {
//         const { productName, productSKU, productQuantity, productsPrice, KPI, estimatedTax, totalNetPrice } = await sidesheetPage.productInformation();
//         await sidesheetPage.viewSummaryScreen();
//         await summaryScreenPage.summaryScreenPageAssertion();
//         await summaryScreenPage.verifyProductInformation({
//             productName: productName,
//             productSKU: productSKU,
//             productQuantity: productQuantity,
//             productsPrice: productsPrice,
//             KPI: KPI ?? '',
//             estimatedTax: estimatedTax ?? '',
//             totalNetPrice: totalNetPrice ?? ''
//         });
//     });

//     test('Validate Contract Information in Sidesheet @NZDEV-T98', async ({ sidesheetPage, summaryScreenPage }) => {
//         const { contractID, status, dealerName, customerName, createdBy, poReferenceNumber } = await sidesheetPage.contractInformation();
//         await sidesheetPage.viewSummaryScreen();
//         await summaryScreenPage.summaryScreenPageAssertion();
//         await summaryScreenPage.verifyContractInformation(contractID ?? '', status ?? '', dealerName ?? '', customerName ?? '', createdBy ?? '', poReferenceNumber ?? '');
//     });

//     test('Validate Maximize Button in Sidesheet @NZDEV-T99', async ({ sidesheetPage, summaryScreenPage }) => {
//         await sidesheetPage.maximizeSidesheet();
//         await summaryScreenPage.summaryScreenPageAssertion();
//     });

//     test('Validate Close Button in Sidesheet @NZDEV-T100', async ({ contractsPage, sidesheetPage }) => {
//         await sidesheetPage.closeSidesheet();
//         await contractsPage.assertContractsPage();
//     });

//     test('Validate clicking outside the Sidesheet @NZDEV-T101', async ({ contractsPage, sidesheetPage }) => {
//         await sidesheetPage.clickOutsideSidesheet();
//         await contractsPage.assertContractsPage();
//     });


// });
// test.describe('Side Sheet Testcases - Part 2', () => {
//     // test.describe.configure({ mode: 'serial' }); // Tests inside this block run sequentially
//     test.use({ storageState: '.auth/multiaccountsuser.json' });
//     test.beforeEach(async ({ page, homePage }) => {
//         await page.goto('/');
//         await homePage.navigateToContracts("BPC");
//     });

//     test('Validate entering a value in PO Reference Number TextBox and click view Summary and it will be saved @NZDEV-T102 @NZDEV-T103 @NZDEV-T104', async ({ sidesheetPage, summaryScreenPage, contractsPage }) => {
//         const poReferenceNumber = 'Side_To_Summary';
//         await contractsPage.verifyDraftTab();
//         await contractsPage.verifySidesheetOpensOnContractClick();
//         await sidesheetPage.discardDraftButton.isEnabled();
//         await sidesheetPage.discardDraftButton.isVisible();
//         const poNumberSaved = await sidesheetPage.fillPOReferenceNumber(poReferenceNumber);
//         await sidesheetPage.viewSummaryScreen();
//         await summaryScreenPage.summaryScreenPageAssertion();
//         await summaryScreenPage.verifyPOReferenceNumber(poNumberSaved);
//         await contractsPage.searchContractWithPONumber(poNumberSaved);
//     });

//     test('Validate entering a value in PO Reference Number TextBox and click close button and it will be saved @NZDEV-T105 @NZDEV-T107', async ({ sidesheetPage, summaryScreenPage, contractsPage }) => {
//         const poReferenceNumber = 'Side_&_Close';
//         await contractsPage.verifyDraftTab();
//         await contractsPage.verifySidesheetOpensOnContractClick();
//         await sidesheetPage.POReferenceNumberTextBox.isEnabled();
//         await sidesheetPage.POReferenceNumberTextBox.isEditable();
//         const poNumberSaved = await sidesheetPage.fillPOReferenceNumber(poReferenceNumber);
//         await sidesheetPage.closeSidesheet();
//         await contractsPage.assertContractsPage();
//         await contractsPage.searchContractWithPONumber(poNumberSaved);
//     });

//     test('Validate entering a value in PO Reference Number TextBox and click Outside the Sidesheet and it will be saved @NZDEV-T106', async ({ sidesheetPage, summaryScreenPage, contractsPage }) => {
//         const poReferenceNumber = 'Side_&_Outside';
//         await contractsPage.verifyDraftTab();
//         await contractsPage.verifySidesheetOpensOnContractClick();
//         await sidesheetPage.POReferenceNumberTextBox.isEnabled();
//         await sidesheetPage.POReferenceNumberTextBox.isEditable();
//         const poNumberSaved = await sidesheetPage.fillPOReferenceNumber(poReferenceNumber);
//         await sidesheetPage.clickOutsideSidesheet();
//         await contractsPage.assertContractsPage();
//         await contractsPage.searchContractWithPONumber(poNumberSaved);
//     });
// });


// test.describe('Side Sheet Testcases - Part 3', () => {
//     test.use({ storageState: '.auth/multiaccountsuser.json' });
//     test.beforeEach(async ({ page, homePage }) => {
//         await page.goto('/');
//         await homePage.navigateToContracts("BPC");
//     });
//     test('Validate PONumber TextBox and Discard Draft Button for Submitted in Sidesheet @NZDEV-T108 @NZDEV-T113 @NZDEV-T126', async ({ sidesheetPage, contractsPage }) => {
//         const contractsCount = await contractsPage.listStatuses.count();
//         for (let i = 0; i < contractsCount; i++) {
//             const statusText = await contractsPage.listStatuses.nth(i).textContent();
//             if (statusText === 'Submitted') {
//                 await contractsPage.listStatuses.nth(i).click();
//                 break;
//             }
//         }
//         await expect(sidesheetPage.POReferenceNumberTextBox).not.toBeVisible();
//         await expect(sidesheetPage.discardDraftButton).not.toBeVisible();
//     });

//     test('Validate PONumber TextBox and Discard Draft Button for Activated in Sidesheet @NZDEV-T109 @NZDEV-T114', async ({ sidesheetPage, contractsPage }) => {
//         await contractsPage.verifyActiveTab();
//         const contractsCount = await contractsPage.listStatuses.count();
//         for (let i = 0; i < contractsCount; i++) {
//             if (await contractsPage.listStatuses.nth(i).getByText('Activated')) {
//                 await contractsPage.listStatuses.nth(i).click();
//                 break;
//             }
//         }
//         await expect(sidesheetPage.POReferenceNumberTextBox).not.toBeVisible();
//         await expect(sidesheetPage.discardDraftButton).not.toBeVisible();
//     });

//     test('Validate PONumber TextBox and Discard Draft Button for Expired in Sidesheet @NZDEV-T111 @NZDEV-T116', async ({ sidesheetPage, contractsPage }) => {
//         await contractsPage.verifyExpiredTab();
//         const contractsCount = await contractsPage.listStatuses.count();
//         for (let i = 0; i < contractsCount; i++) {
//             if (await contractsPage.listStatuses.nth(i).getByText('Expired')) {
//                 await contractsPage.listStatuses.nth(i).click();
//                 break;
//             }
//         }
//         await expect(sidesheetPage.POReferenceNumberTextBox).not.toBeVisible();
//         await expect(sidesheetPage.discardDraftButton).not.toBeVisible();
//     });

//     test('Validate PONumber TextBox and Discard Draft Button for Pending Activation in Sidesheet @NZDEV-T112', async ({ sidesheetPage, contractsPage }) => {
//         let found: boolean = false;
//         while (contractsPage.goToNextPageButton.isEnabled()) {
//             const contractsCount = await contractsPage.listStatuses.count();
//             for (let i = 0; i < contractsCount; i++) {
//                 const statusText = await contractsPage.listStatuses.nth(i).textContent();
//                 if (statusText === 'Pending Activation') {
//                     await contractsPage.listStatuses.nth(i).click();
//                     found = true;
//                     break;
//                 }
//             }
//             if (found) break;
//             else { await contractsPage.goToNextPageButton.click(); }
//         }
//         await expect(sidesheetPage.POReferenceNumberTextBox).not.toBeVisible();
//         await expect(sidesheetPage.discardDraftButton).not.toBeVisible();
//     });

//     test('Sidesheet & SummaryScreen should show that draft is Expired Status with Expired Date @NZDEV-T80 @NZDEV-T124 @NZDEV-T129', async ({ sidesheetPage, contractsPage, summaryScreenPage }) => {
//         await contractsPage.verifyExpiredTab();
//         await contractsPage.verifySidesheetOpensOnContractClick();
//         await expect(sidesheetPage.statusSidesheet).toHaveText('Expired');
//         const { expiredDateText, expiredMessageText } = await sidesheetPage.expiredMessageValidation();
//         await sidesheetPage.viewSummaryScreen();
//         await summaryScreenPage.summaryScreenPageAssertion();
//         await summaryScreenPage.verifyDraftExpiredMessage(expiredDateText ?? '', expiredMessageText ?? '');
//         await contractsPage.assertContractsPage();
//     });

//     test('Sidesheet & Summary Screen: Delete Button should be visible and not discard draft and shouldnot perform draft Operations @NZDEV-T81 @NZDEV-T127 @NZDEV-T133 @NZDEV-T132 @NZDEV-T134', async ({ sidesheetPage, contractsPage, summaryScreenPage }) => {
//         await contractsPage.verifyExpiredTab();
//         await contractsPage.verifySidesheetOpensOnContractClick();
//         await expect(sidesheetPage.deleteButton).toBeVisible();
//         await expect(sidesheetPage.discardDraftButton).not.toBeVisible();
//         await expect(sidesheetPage.POReferenceNumberTextBox).not.toBeVisible();
//         await sidesheetPage.viewSummaryScreen();
//         await summaryScreenPage.summaryScreenPageAssertion();
//         await expect(summaryScreenPage.deleteButton).toBeVisible();
//         await expect(summaryScreenPage.discardDraftButton).not.toBeVisible();
//         await expect(summaryScreenPage.deleteButton).toBeEnabled();
//         await expect(summaryScreenPage.placeOrderButton).toBeDisabled();
//         await expect(summaryScreenPage.backToTableButton).toBeEnabled();
//         await expect(summaryScreenPage.POReferenceNumberTextBox).not.toBeVisible();
//         await summaryScreenPage.backToTableButton.click();
//         await contractsPage.assertContractsPage();
//     });



// });