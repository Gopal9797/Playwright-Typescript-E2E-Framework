import { test } from '../../src/fixture/TestFixture';
import { expect } from '@playwright/test';
import { TermsPage } from '../pages/TermsPage';
import { ProductsPage } from '../pages/ProductsPage';

// Use a stored auth state for this file's tests
test.describe('test Contract  ', () => {
  test.use({ storageState: '.auth/upgaccountuser.json' });
  test('@Monthly - Term length validation', async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, summaryScreenPage, productsPage }) => {
    await page.goto('/');
    await homePage.navigateToContracts("sms");
    await contractsPage.VerifyCreateANewContractButton();
    await customerSelectionPage.customerSelectionPageAssertion();
    await customerSelectionPage.findAndSelectingCustomerWithPartialName("SCOTT STEEL LTD");
    await termsPage.termsPageAssertion();

    // Enter 0 months -> expect 'Too small' validation
    await termsPage.enterTermLength("0", "month");
    await termsPage.assertMonthlyValidationLT1Visible();
    console.log('Term length validation assertions passed for 0 month.');

    // Enter 12 months -> expect 'Too big' validation (based on app rules)
    await termsPage.enterTermLength("12", "month");
    await termsPage.assertMonthlyValidationGT11Visible();
    console.log('Term length validation assertions passed for 12 months');
    // monthlyToggle
    await termsPage.assertAutoRenewalTextMonthlyVisible();
    console.log('Auto renewal text visibility assertion passed for monthly contract.');

    // Products page validation "List Price Monthly"
    await termsPage.enterTermLength("1", "month");
    await termsPage.chooseCurrencyDropdown('USD');
    await termsPage.continueButton.click();
    await productsPage.productsPageAssertionMonthly();
    console.log('List Price Monthly text is displayed in Products page.');
  });


  test('@Monthly - Compare products price between monthly and yearly', async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage }) => {
    await page.goto('/');
    await homePage.navigateToContracts("sms");
    await contractsPage.VerifyCreateANewContractButton();
    await customerSelectionPage.customerSelectionPageAssertion();
    await customerSelectionPage.findAndSelectingCustomerWithPartialName("SCOTT STEEL LTD");
    await termsPage.termsPageAssertion();
    //monthly
    await termsPage.enterTermLength("1", "month");
    await termsPage.chooseCurrencyDropdown('USD');
    await termsPage.continueButton.click();
    const monthlyPrice = await productsPage.getCatalyst60PriceMonthly();
    //yearly
    await productsPage.backToTermsPage.click();
    await termsPage.enterTermLength("1", "year");
    await termsPage.continueButton.click();
    const yearlyPrice = await productsPage.getCatalyst60PriceYearly();
    // Compare
    expect(monthlyPrice).not.toBe(yearlyPrice);
    console.log(`Monthly: ${monthlyPrice}, Yearly: ${yearlyPrice}`);
    console.log('Price comparison assertion passed: Monthly and Yearly prices are different as expected.');
  });
});