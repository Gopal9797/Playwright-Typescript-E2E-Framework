import { test } from '../../src/fixture/TestFixture';

// This test uses stored state of multiple accounts User to validate the Dealers Home page
test.describe('Contracts Page Testcases using BPC', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("BPC");
    });

    test('List of Contracts displayed', async ({ homePage, contractsPage }) => {
        await homePage.assertHomePage();
        await homePage.navigateToContracts("BPC");
        await contractsPage.assertContractsPage();
    });

    // Commented out as this covered in other test cases and this data is failure prone
    // test('Search Contracts With ContractID @NZDEV-T21 @Contracts', async ({ contractsPage }) => {
    //     await contractsPage.searchContractWithContractID();
    // });
    // test('Search Contracts With Partial ContractID @NZDEV-T22 @Contracts', async ({ contractsPage }) => {
    //     await contractsPage.searchContractWithPartialContractID();
    // });
    test('Search Contracts With Customer Name @NZDEV-T23 @Contracts', async ({ contractsPage }) => {
        await contractsPage.searchContractWithCustomerName();
    });
    test('Search Contracts With Partial Customer Name @NZDEV-T24 @Contracts', async ({ contractsPage }) => {
        await contractsPage.searchContractWithPartialCustomerName();
    });

    test('Search Contract with PO# @NZDEV-T33 @Contracts', async ({ contractsPage }) => {
        await contractsPage.searchContractWithPO();
    });
});

test.describe('Contracts Page Testcases using SRM', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("srm");
    });
    test('Verify the appropriate message when no results are found @NZDEV-T37 @Contracts @dailysanity', async ({ contractsPage }) => {
        await contractsPage.verifyNoResultsFound();
    });
    test('Validate Clear Search Text with X button in Search TextBox . @NZDEV-T40 @Contracts @dailysanity', async ({ contractsPage }) => {
        await contractsPage.verifyClearSearchText();
    });

    test('Click the "DRAFT" tab. Verify the table updates to show only Draft contracts and the tab becomes visually active. @NZDEV-T82 @NZDEV-T121 @NZDEV-T41 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyDraftTab();
    });

    test('Click the "ACTIVE" tab. Verify the table updates to show only Active contracts and the tab becomes visually active. @NZDEV-T42 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyActiveTab();
    });

    // Commented out as this covered in other test cases and this data is failure prone
    // test('Verify the search results are limited to the items within a filtered view (Eg: ACTIVE). @NZDEV-T43 @Contracts', async ({ contractsPage }) => {
    //     await contractsPage.verifySearchResultsWithinFilteredView();
    // });

    test('Click the "NEEDS ATTENTION" tab. Verify the table updates to show only contracts that needs attention and the tab becomes visually active. @NZDEV-T44 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyNeedsAttentionTab();
    });

    test.skip('Click the "EXPIRED" tab. Verify the table updates to show only Expired contracts and the tab becomes visually active. @NZDEV-T120 @NZDEV-T45 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyExpiredTab();
    });

    test('After clicking another tab, click back on "ALL DOCUMENTS". Verify the table displays all contracts again (like the initial view) and the tab becomes visually active. @NZDEV-T46 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyAllDocumentsTab();
    });

    test('All Documents tab should also show Expired Contracts too @NZDEV-T119', async ({ contractsPage }) => {
        await contractsPage.allDocumentsHaveExpiredStatusToo();
    });
});
test.describe('Contracts Page Table Functionality Testcases - 1', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("ac");
    });
    test('Click the "Columns" button. Verify a dropdown or modal appears allowing column selection/deselection. @NZDEV-T47 @NZDEV-T50 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyColumnsButton();
    });

    test('Deselect Each Column and Verify the column disappears from the table view. @NZDEV-T48 @Contracts', async ({ contractsPage }) => {
        await contractsPage.deselectEachColumnAndVerifyIfItDisappears();
    });

    test('Verify whether the column reappears in the table, in its same position when reselected. @NZDEV-T49 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyColumnReappearsInSamePositionWhenReselected();
    });

    test('Verify the table sorts ascending and descending. @NZDEV-T52  @NZDEV-T68 @NZDEV-T69 @NZDEV-T70 @NZDEV-T75 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyTableSortAscendingAndDescending();
    });

    test('Verify Sorting Enabled and Disabled @NZDEV-T53 @NZDEV-T54 @NZDEV-T55 @NZDEV-T56 @NZDEV-T57 @NZDEV-T58', async ({ contractsPage }) => {
        await contractsPage.verifySortingEnabledAndDisabled();
    });

    // test('Verify whether Sidesheet is opened when a contract is clicked. @NZDEV-T59 @Contracts', async ({ contractsPage }) => {
    //     await contractsPage.verifySidesheetOpensOnContractClick();
    // });

    test('Verify whether 5 Contracts are displayed when 5 is chosedn from the "Show" dropdown. @NZDEV-T61 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyFiveContractsDisplayedWhenFiveIsChosenFromShowDropdown();
    }
    );
    test('Verify whether 10 Contracts are displayed when 10 is chosen from the "Show" dropdown. @NZDEV-T62 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyTenContractsDisplayedWhenTenIsChosenFromShowDropdown();
    });

    test('Verify whether 20 Contracts are displayed when 20 is chosen from the "Show" dropdown. @NZDEV-T63 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyTwentyContractsDisplayedWhenTwentyIsChosenFromShowDropdown();
    });

});
test.describe('Contracts Page Table Functionality Testcases - 2', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });
    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.navigateToContracts("sms");
    });

    test('Verify whether 50 Contracts are displayed when 50 is chosen from the "Show" dropdown. @NZDEV-T63b @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyFiftyContractsDisplayedWhenFiftyIsChosenFromShowDropdown();
    });

    test('Verify whether Showing 1 out of X Contracts is same Contracts(X) in Contracts Page @NZDEV-T60 @NZDEV-T63 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyContractsCountsAreMatching();
    });

    test('Verify whether it is navigatable between pages (i.e) Page 1 to Page 4 and back to Page 2 @NZDEV-T65', async ({ contractsPage }) => {
        await contractsPage.verifyNavigatableBetweenPages();
    });

    test('Verify whether user is able to navigate to the next page by clicking on the "Next" button and Coming back to First Page using "Previous" Button. @NZDEV-T66 @NZDEV-T67 @Contracts @dailysanity', async ({ contractsPage }) => {
        await contractsPage.verifyNextButtonNavigatesToNextPageAndComingBackToFirstPage();
    });

    test('Verify Pin to Left functionality @NZDEV-T71 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyPinToLeftFunctionality();
    });

    test('Verify Pin to Right functionality @NZDEV-T72 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyPinToRightFunctionality();
    });

    test('Verify Hide Column functionality @NZDEV-T73 @Contracts', async ({ contractsPage }) => {
        await contractsPage.verifyHideColumnFunctionality();
    });

    // test('Verify ManageColumns functionality @NZDEV-T74 @Contracts', async ({ contractsPage }) => {
    //     await contractsPage.verifyManageColumnsFunctionality();
    // });

    test('Click the "Create new contract" button. Verify the user is navigated to a new contract creation form/page. @NZDEV-T51 @Contracts', async ({ contractsPage }) => {
        await contractsPage.VerifyCreateANewContractButton();
    });

});

