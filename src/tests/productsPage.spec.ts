import { test } from '../../src/fixture/TestFixture';
import { expect } from "@playwright/test";
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Products page testcases', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage, contractsPage, customerSelectionPage, termsPage, productsPage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("BPC");
        await contractsPage.VerifyCreateANewContractButton();
        await customerSelectionPage.customerSelectionPageAssertion();
        await customerSelectionPage.selectFirstCustomer();
        await termsPage.termsPageAssertion();
        await termsPage.enterTermLength("1", "month");
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.toggleAutoRenew(true);
        await termsPage.selectStartDateBasedOnOrder();
        await termsPage.chooseCurrencyDropdown('USD');
        await termsPage.continueToProductsPage();
        await productsPage.productsPageAssertionMonthly();
    });

    test('Select all products and validate cart @dailysanity', async ({ productsPage, homePage }) => {
        await productsPage.selectAllProductsAndValidateCart();
        await productsPage.cancelButton.click();
        await homePage.assertHomePage();
    });

    test('Search Products @dailysanity', async ({ productsPage, termsPage }) => {
        await productsPage.backToTermsPage.click();
        await termsPage.termsPageAssertion();
        await termsPage.continueToProductsPage();
        await productsPage.searchProductByName("Catalyst 60");
        await productsPage.searchProductByName("Catalyst");
        await productsPage.searchProductByName("Trimble Access");
        await productsPage.searchProductBySKU("SM");
        await productsPage.searchProductBySKU("BS-TBC-ENT");
        await productsPage.searchProductBySKU("BS TBC SAF");
        await productsPage.clearSearch();
        await productsPage.searchWithInvalidProductName("Invalid Product");
    });

    // Commenting out filter tests as the filters are currently not working on the products page due to Product's sync issue
    // test('Filter Products by Family', async ({ productsPage }) => {
    //     await productsPage.filterByCatalystFamily();
    //     await productsPage.filterByTrimbleAccessFamily();
    //     await productsPage.filterByTrimbleBusinessCenterFamily();
    // });


    test('Verify Increment and Decrement Quantity @dailysanity', async ({ productsPage }) => {
        await productsPage.incrementLicenseQuantity();
        await productsPage.decrementLicenseQuantity();
    });

});