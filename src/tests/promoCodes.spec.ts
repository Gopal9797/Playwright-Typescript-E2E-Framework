import { test } from '../fixture/AxpFixture';
import { AmendmentSummaryPage } from '../pages/AmendmentSummaryPage';
import dealercustomers from '../pages/dealercustomers.json'
let contract_number: number | undefined;
const INVALID_PROMO_CODE = 'INVALID_PROMO_DO_NOT_EXIST_2026';
const AXP_DXP_AUTOMATION_CUSTOMER_ID = '437d54ac-8a85-5516-be31-9ecda8de19dc';

test.describe('Promo Codes', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.describe.configure({ timeout: 400000 });
    /* Test suite for applying promocodes for contract creation */
    test.describe('Promo codes - Contract Creation workflow', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage, summaryScreenPage }) => {
            await page.goto('/');
            await homePage.navigateToContracts("bpc");
            await contractsPage.VerifyCreateANewContractButton();
            await customerSelectionPage.customerSelectionPageAssertion();
            await customerSelectionPage.findAndSelectingCustomerWithPartialName(dealercustomers.bpc);
            await termsPage.termsPageAssertion();
            await termsPage.enterTermLength("1", "month");
            await termsPage.toggleAutoRenew(true);
            await termsPage.selectStartDateBasedOnOrder();
            await termsPage.chooseCurrencyDropdown('USD');
            await termsPage.continueToProductsPage();
            await productsPage.productsPageAssertionMonthly();
            await productsPage.searchProductByName("Catalyst 60");
            await productsPage.selectRowCheckbox.check();
            await productsPage.generatePricing();
            await summaryScreenPage.summaryScreenPageAssertion();
        });

        test('Verify PromoCodes UI Elements', async ({ promoCodesPage, summaryScreenPage, contractsPage }) => {
            await promoCodesPage.verifyPromoCodePageUIElements();
            await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
            await contractsPage.assertContractsPage();
        });

        test('Enter inactive promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, contractsPage }) => {
            await promoCodesPage.enterPromoCode("PROMO_TEST_INACTIVE");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code is not active yet");
            await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
            await contractsPage.assertContractsPage();
        });


        test('Enter expired promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, contractsPage }) => {
            await promoCodesPage.enterPromoCode("PROMO_TEST_EXPIRY");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code has expired");
            await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
            await contractsPage.assertContractsPage();
        });

        test('Enter Invalid promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, contractsPage }) => {
            await promoCodesPage.enterPromoCode(INVALID_PROMO_CODE);
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code not recognized");
            await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
            await contractsPage.assertContractsPage();
        });

        //apply different product promocode to this catalyst60 product and assert error message
        test('Enter ineligible promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, contractsPage }) => {
            await promoCodesPage.enterPromoCode("30OFF_REPO");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("None of the products are eligible for the applied promo");
            await summaryScreenPage.clickAcceptButtonOnDiscardDraftPopUp();
            await contractsPage.assertContractsPage();
        });

        test('Enter Valid promocode for the product selected', async ({ promoCodesPage, amendmentSummaryPage }) => {
            await promoCodesPage.enterPromoCode("50OFF_REPO");
            await promoCodesPage.placeOrderButtonIsDisabled();
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.placeOrderButtonIsEnabled();
            await promoCodesPage.removeButtonIsVisible();
            await promoCodesPage.verifyPromoCodeIconIsDisplayedOnSuccessfulApplyOfCode();
            await amendmentSummaryPage.clickPlaceOrderButton();
        });
    });

    /* Test suite for applying promo codes for add products */
    test.describe('Promo codes - for midterm positive - add products', () => {
        test.beforeEach(async ({ page, contractsPage, amendmentSummaryPage, createAmendmentPage, summaryScreenPage, productsPage, promoCodesPage, homePage }, testInfo) => {
            await page.goto('/');
            await homePage.navigateToContracts("bpc");
            const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.bpc);
            if (!result || result.length === 0) {
                throw new Error('Database returned no valid active contracts.');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % result.length;
            const selectedContract = result[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
            await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
            await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
            const existingProducts = await createAmendmentPage.getExistingContractProductsInSubscriptionsTab();
            console.log("Existing Contract Products: ", existingProducts);
            await createAmendmentPage.clickAmendContractButton();
            await createAmendmentPage.verificationOfCreateAmendmentPage();
            await createAmendmentPage.clickAddProductButton();
            await productsPage.verifyAddProductUI();
            const chosen = await productsPage.pickAndSelectNewProduct(existingProducts);
            console.log("Selected product:", chosen);
            await productsPage.submitButtonInAddProduct();
            await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
            await amendmentSummaryPage.visibilityOfBackToContractButton();
            await createAmendmentPage.enterPONumberInSummaryOfChangesInCreateAmendmentScreen("Amendment_Promocodes");
            await promoCodesPage.verifyPromoCodePageUIElements();
        });

        test('Enter inactive promocode for the product selected AP', async ({ promoCodesPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage }) => {
            await promoCodesPage.enterPromoCode("PROMO_TEST_INACTIVE");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code is not active yet");
            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await createAmendmentPage.verificationOfAmendContractButton();
        });

        test('Enter expired promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage }) => {
            await promoCodesPage.enterPromoCode("PROMO_TEST_EXPIRY");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code has expired");

            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await createAmendmentPage.verificationOfAmendContractButton();
        });

        test('Enter Invalid promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage }) => {
            await promoCodesPage.enterPromoCode(INVALID_PROMO_CODE);
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code not recognized");
            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await createAmendmentPage.verificationOfAmendContractButton();
        });

        //apply different product promocode to this catalyst60 product and assert error message
        test('Enter ineligible promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage }) => {
            await promoCodesPage.enterPromoCode("30OFF_REPO");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("None of the products are eligible for the applied promo");

            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await createAmendmentPage.verificationOfAmendContractButton();
        });

        test('Enter Valid promocode for the product selected', async ({ promoCodesPage, amendmentSummaryPage, summaryScreenPage }) => {
            await promoCodesPage.enterPromoCode("50OFF_REPO");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.removeButtonIsVisible();
            await promoCodesPage.verifyPromoCodeIconIsDisplayedOnSuccessfulApplyOfCode();

            await amendmentSummaryPage.clickPlaceOrderButton();
            await amendmentSummaryPage.clickBacktoContract();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await promoCodesPage.verifyPromoDiscountIsDisplayed();
        });
    });

    /* Test suite for applying promo codes for add seats */
    test.describe('Promo codes - for midterm positive - add seats', () => {
        test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage, createAmendmentPage, promoCodesPage }, testInfo) => {
            await page.goto('/');
            await homePage.navigateToContracts("bpc");
            const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.bpc);
            if (!result || result.length === 0) {
                throw new Error('Database returned no valid active contracts.');
            }
            const workerIdx = testInfo.workerIndex;
            const safeIndex = workerIdx % result.length;
            const selectedContract = result[safeIndex].contract_number;
            console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
            await contractsPage.searchContractWithGivenContractIDAndClickContract(selectedContract.toString());
            await amendmentSummaryPage.verificationOfAmendmentSummaryPage();
            await createAmendmentPage.clickAmendContractButton();
            await createAmendmentPage.verificationOfCreateAmendmentPage();
            await createAmendmentPage.selectSubscriptionToModifyAndSelectTheFirstOption();
            await createAmendmentPage.clickAmendmentTypeDropdown();
            await createAmendmentPage.selectAddSeatOption();
            await createAmendmentPage.EnterTheLicenseAndAssertTheValue("1", "1");
            await createAmendmentPage.clickAddToCartButton();
            await createAmendmentPage.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen();
            await amendmentSummaryPage.visibilityOfBackToContractButton();
            await createAmendmentPage.enterPONumberInSummaryOfChangesInCreateAmendmentScreen("Amendment_Promocodes");
            await promoCodesPage.verifyPromoCodePageUIElements();
        });

        test('Enter inactive promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage }) => {
            await promoCodesPage.enterPromoCode("PROMO_TEST_INACTIVE");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code is not active yet");

            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await createAmendmentPage.verificationOfAmendContractButton();
        });


        test('Enter expired promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage }) => {
            await promoCodesPage.enterPromoCode("PROMO_TEST_EXPIRY");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code has expired ");
            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await createAmendmentPage.verificationOfAmendContractButton();
        });

        test('Enter Invalid promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage }) => {
            await promoCodesPage.enterPromoCode(INVALID_PROMO_CODE);
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("Promo code not recognized");

            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await createAmendmentPage.verificationOfAmendContractButton();
        });

        //apply different product promocode to this catalyst60 product and assert error message
        test('Enter ineligible promocode for the product selected', async ({ promoCodesPage, summaryScreenPage, amendmentSummaryPage, createAmendmentPage }) => {
            await promoCodesPage.enterPromoCode("30OFF_REPO");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.verifyPromoCodeErrorMessage("None of the products are eligible for the applied promo");

            await amendmentSummaryPage.clickAcceptButtonOnDiscardDraftPopUpShouldTakeToSubscriptionsTabAndVerifyCreateAmendmentButton();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await createAmendmentPage.verificationOfAmendContractButton();
        });

        test('Enter Valid promocode for the product selected', async ({ promoCodesPage, amendmentSummaryPage, summaryScreenPage }) => {
            await promoCodesPage.enterPromoCode("50OFF_REPO");
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.removeButtonIsVisible();
            await promoCodesPage.verifyPromoCodeIconIsDisplayedOnSuccessfulApplyOfCode();

            await amendmentSummaryPage.clickPlaceOrderButton();
            await amendmentSummaryPage.clickBacktoContract();
            // await summaryScreenPage.verifyAmendmentStatusInSubscriptionsTab('Active');
            await promoCodesPage.verifyPromoDiscountIsDisplayed();
        });
    });

    test.describe('Promo codes - customer initiated amendment from AXP', () => {
        test('Apply promo code after accepting an AXP customer initiated request', async ({page,homePage,contractsPage,axpContractPage,axpAmendmentPage,createAmendmentPage,promoCodesPage,amendmentSummaryPage,}) => {
            const contracts = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.dxpAutomation);
            if (!contracts || contracts.length === 0) {
                throw new Error('Database returned no active American Company contracts for the AXP amendment flow.');
            }

            const selectedContract = contracts[0];
            const contractNumber = String(selectedContract.contract_number);
            const contractGuid = String(selectedContract.id);

            await axpContractPage.goToContract(AXP_DXP_AUTOMATION_CUSTOMER_ID, contractGuid);
            await axpContractPage.clickCreateAmendment(contractNumber);
            await axpContractPage.handleTermsAndConditionsPopup();
            await axpAmendmentPage.selectFirstSubscriptionToModify();
            await axpAmendmentPage.selectAmendmentType('addSeats');
            await axpAmendmentPage.setQuantity(1);
            await axpAmendmentPage.saveAmendmentDraft();
            await axpAmendmentPage.submitCustomerInitiatedAmendment('positive');
            await axpAmendmentPage.assertAmendmentSubmissionSuccess('positive');

            await page.goto('/');
            await homePage.navigateToContracts('dxpautomation');
            await contractsPage.searchContractWithGivenContractIDAndClickContract(contractNumber);
            await createAmendmentPage.assertCustomerRequestBannerVisible();
            await createAmendmentPage.acceptCustomerInitiatedRequest();
            await promoCodesPage.verifyPromoCodePageUIElements();
            try {
                await promoCodesPage.enterPromoCode('50OFF_REPO');
                await promoCodesPage.clickOnApplyButton();
                await promoCodesPage.verifyPromoCodeIconIsDisplayedOnSuccessfulApplyOfCode();
            } finally {
                if (await promoCodesPage.promoCodeRemoveButton.isVisible().catch(() => false)) {
                    await promoCodesPage.clickOnRemoveButton();
                }
            }
            await amendmentSummaryPage.clickPlaceOrderButton();
        });
    });

    test.describe('Promo codes - renewal draft', () => {
        test('Apply promo code to a dxpAutomation renewal draft', async ({page,homePage,contractsPage,renewalSummaryPage,promoCodesPage,}) => {
            await page.goto('/');
            await homePage.navigateToContracts('dxpautomation');
            const renewalDrafts = await contractsPage.selectRenewalInitiatedContracts(dealercustomers.dxpAutomation_cdhID);
            if (!renewalDrafts || renewalDrafts.length === 0) {
                throw new Error('Database returned no renewal drafts for American Company.');
            }

            await contractsPage.searchContractWithGivenContractIDAndClickContract(String(renewalDrafts[0].contract_number_search));
            await renewalSummaryPage.validateManualRenewalContractNumberFormat();
            await promoCodesPage.verifyPromoCodePageUIElements();
            await promoCodesPage.enterPromoCode('50OFF_REPO');
            await promoCodesPage.clickOnApplyButton();
            await promoCodesPage.removeButtonIsVisible();
            await promoCodesPage.verifyPromoDiscountIsDisplayed();
        });
    });

});