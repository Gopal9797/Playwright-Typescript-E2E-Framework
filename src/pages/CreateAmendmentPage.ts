import { expect, Locator, Page } from "@playwright/test";
import { readFileSync, writeFileSync } from "fs";
import { ProductsPage } from "./ProductsPage";

type CustomerInitiatedDraftOptions = {
    schedule?: 'orderPlaced' | 'futureDate';
    futureDate?: {
        month: number;
        day: number;
        year: number | string;
    };
};

export class CreateAmendmentPage {

    readonly page: Page;
    readonly MAX_FUTURE_DAYS = 30;

    //creating contract amendment page elements
    readonly contractId: Locator;
    readonly clickContractsTab: Locator;
    readonly creatingContactAmendmentText: Locator;
    readonly contractAmendmentDraftText: Locator;
    readonly activeStatus: Locator;
    readonly moreOptionsButton: Locator;
    readonly viewOriginalContractButton: Locator;
    readonly amendContractButton: Locator;
    readonly addProductButton: Locator;
    readonly addToCartButton: Locator;
    readonly backToHistory: Locator;
    //add seats
    readonly subscriptionToggle: Locator;
    readonly manageCurrentSubscriptionsText: Locator;
    readonly amendmentTypeText: Locator;
    readonly selectSubscriptionToModifyText: Locator;
    readonly selectAmendmentTypeDropDown: Locator;
    readonly selectSubscriptionToModifyDropDown: Locator;
    readonly targetSubscriptionDropdown: Locator;
    readonly targetSubscription: Locator;
    readonly addSeatsOption: Locator;
    readonly upgradeOption: Locator;
    readonly numberOfLicensesToAddText: Locator;
    readonly numberOfLicenseInputField: Locator;
    readonly licenseIncrementButton: Locator;
    readonly licenseDecrementButton: Locator;
    //summary of changes frame
    readonly viewDetails: Locator;
    readonly hideDetailsButton: Locator;
    readonly generatePricingButton: Locator;
    readonly generatePricingButtonInAddonDialog: Locator;
    readonly summaryOfChangesText: Locator;
    readonly immediateTextinSummaryOfChanges: Locator;
    readonly addLicenseTextInSummaryOfChanges: Locator;
    readonly removeChangeButton: Locator;
    readonly licenseCountInSummaryOfChanges: Locator;
    //readonly licenseTextinSummaryOfChanges: Locator;
    readonly licenseCountinSummaryOfChanges: Locator;
    readonly priceDetailsInSummaryOfChanges: Locator;
    readonly datePickerButton: Locator;
    readonly enterMonth: Locator;
    readonly enterDay: Locator;
    readonly enterYear: Locator;
    readonly PONumberTextField: Locator;
    readonly effectiveDateCannotBeInThePastText: Locator;
    readonly amendmentInProgressStatus: Locator;
    readonly accountDropdown: Locator;
    readonly NoUpgradesAvailableText: Locator;

    //Add Products
    readonly addProductSubmitButton: Locator;
    readonly addProductsproductNameText: Locator;
    readonly addProductsLicenseText: Locator;
    readonly addproductsListPriceYearlyText: Locator;
    readonly addproductsSelectAllCheckbox: Locator;
    readonly addproductsUnselectAllCheckbox: Locator;
    readonly selectRowCheckbox: Locator;
    readonly unselectRowCheckbox: Locator;
    readonly addProductSearchBox: Locator;
    readonly addproductsClearSearchBoxButton: Locator;
    readonly productListRowsInAddProduct: Locator;
    readonly addProductHeadingText: Locator;
    readonly noResultsFoundText: Locator;
    readonly subscriptionNameLabels: Locator;
    readonly subscriptionSkuName: Locator;
    readonly availableLicenseCount: Locator;

    //remove seats
    readonly removeLicensesOption: Locator;
    readonly numberOfLicensesToAddTextRemove: Locator;
    readonly numberOfLicenseInputFieldRemove: Locator;
    readonly randomSelectionText: Locator;
    readonly availableLicnesesText: Locator;
    readonly saveButtonInSummaryOfChanges: Locator;
    readonly atRenewalText: Locator;
    readonly deleteIcon: Locator;
    readonly conflictCancel: Locator;
    readonly conflictCancelScbscriptions: Locator;
    readonly conflictSaveButton: Locator;
    readonly saveButton: Locator;
    readonly yesOptionOnDeleteConfirmationInSummaryOfChanges: Locator;
    readonly generatePricingDraftConfirmationYesButton: Locator;

    //downgrade
    readonly downgradeOption: Locator;
    readonly numberOfLicensesToDowngradeText: Locator;
    readonly NoDowngradesAvailableText: Locator;

    //cancellation
    readonly cancellationOption: Locator;
    readonly cancellationConfirmationPopupYesButton: Locator;

    //product SKU ID's
    readonly BS_CAT_1M_catalyst60: Locator;
    readonly BS_CAT_DM_catalyst10: Locator;
    readonly BS_CAT_PRECISION_catalyst1: Locator;
    readonly BS_CAT_SM_catalyst30: Locator;
    readonly BS_TA_GENGNSS: Locator;
    readonly BS_TBC_STA: Locator;
    readonly BS_TBC_SAM: Locator;
    readonly BS_TA_ROADS: Locator;
    readonly BS_TBC_ENT: Locator;
    readonly BS_TBC_SAF: Locator;
    readonly BS_TA_GENSURV: Locator;
    readonly BS_TBC_ANZ: Locator;
    readonly BN_TRM_TBC_SCR_TCBP: Locator;
    readonly BN_TRM_TBC_SPO_TCBP: Locator;
    readonly BS_CAT_PACKAGE: Locator;

    // Customer requests - Amendments
    readonly customerRequestBanner: Locator;
    readonly manageRequestButton: Locator;
    readonly reviewCustomerRequestHeading: Locator;
    readonly acceptAndGeneratePricingButton: Locator;
    readonly orderPlacedScheduleOption: Locator;
    readonly futureDateScheduleOption: Locator;
    readonly placeOrderButtonInAmendmentSummary: Locator;
    readonly declineRequestButton: Locator;
    readonly declineRequestConfirmButton: Locator;
    readonly declinedRequestConfirmationToast: Locator;
    readonly conflictPopup: Locator;

    //baseAddons
    readonly cancelButtonInAddonDialogAmendment: Locator;
    readonly warningOkayButtonInAddonDialogAmendment: Locator;
    readonly amendmentTypeDropdownListAddSeats: Locator;
    readonly visibleListbox: Locator;
    readonly visibleListboxOptions: Locator;

    constructor(page: Page) {
        this.page = page;
        this.amendmentTypeDropdownListAddSeats = page.getByTestId('option-add_seats').first();
        this.visibleListbox = page.locator('[role="listbox"]:visible').first();
        this.visibleListboxOptions = page.locator('ul[role="listbox"]:visible li[role="option"]');
        this.contractId = page.locator('[aria-label="contract-number"]');
        this.clickContractsTab = page.getByRole('link', { name: 'Contracts' });
        this.amendContractButton = page.getByRole('button', { name: 'Amend Contract' });
        this.creatingContactAmendmentText = page.getByRole('heading', { name: 'Creating Contract Amendment' });
        this.manageCurrentSubscriptionsText = page.getByRole('heading', { name: 'Manage Current Subscriptions' });
        this.addProductButton = page.getByText('Add Product');
        this.addToCartButton = page
            .locator('modus-wc-button', { hasText: 'Add to Cart' })
            .locator('button');
        this.amendmentTypeText = page.getByText('Amendment Type', { exact: true });
        this.targetSubscription = page.getByText('Target Subscription', { exact: true });
        this.selectSubscriptionToModifyText = page.locator('//p[text()="Select subscription to modify"]');
        this.selectAmendmentTypeDropDown = page.getByTestId('select-amendment-type').locator('[role="combobox"]').first();
        this.selectSubscriptionToModifyDropDown = page.getByText('Select Subscription', { exact: true });
        this.contractAmendmentDraftText = page.getByText('Amendment Draft');
        this.activeStatus = page.getByRole('button', { name: 'contract status' });
        this.moreOptionsButton = page.getByRole('button', { name: 'Actions' });
        this.viewOriginalContractButton = page.getByRole('button', { name: 'View Original Contract' });
        this.addSeatsOption = page.getByTestId('option-add_seats').first();
        this.upgradeOption = page.getByTestId('option-upgrade').first();
        this.numberOfLicensesToAddText = page.getByText('Number of Licenses to Add');
        this.numberOfLicenseInputField = page.getByRole('spinbutton', { name: /quantity input/i });
        this.licenseIncrementButton = page.getByRole('button', { name: 'increment' });
        this.licenseDecrementButton = page.getByRole('button', { name: 'decrement' });
        this.viewDetails = page.getByTestId('toggle-details-button').filter({ hasText: 'View Details' });
        this.hideDetailsButton = page.getByTestId('toggle-details-button').filter({ hasText: 'Hide Details' });
        this.generatePricingButton = page.getByTestId('generate-pricing-button');
        this.generatePricingButtonInAddonDialog = page.getByTestId('warning-okay-button');
        this.summaryOfChangesText = page.getByText('Summary of Changes');
        this.immediateTextinSummaryOfChanges = page.getByTestId('change-effectivity');
        this.addLicenseTextInSummaryOfChanges = page.getByTestId('change-title');
        this.removeChangeButton = page.getByTestId('delete-icon');
        this.subscriptionToggle = page.getByRole('button', { name: 'subscriptions-toggle' });
        // this.licenseTextinSummaryOfChanges = page.locator('//div[@class="MuiStack-root css-1o0y1dn"]/following-sibling::div[1]/div/h5[1]');
        this.licenseCountinSummaryOfChanges = page.locator('//div[@class="MuiStack-root css-1o0y1dn"]/following-sibling::div[1]/div/h5[2]');
        this.priceDetailsInSummaryOfChanges = page.getByTestId('change-net-price');
        this.datePickerButton = page.getByRole('button', { name: 'Choose date' });
        this.enterMonth = page.getByRole('spinbutton', { name: 'Month' })
        this.enterDay = page.getByRole('spinbutton', { name: 'Day' });
        this.enterYear = page.getByRole('spinbutton', { name: 'Year' });
        this.PONumberTextField = page.getByRole('textbox', { name: 'Enter PO #' });
        //this.effectiveDateCannotNotBeInPastText =  page.getByRole('group');
        this.amendmentInProgressStatus = page.locator('//span[contains(text(),"Amendment in Progress")]').first();
        this.effectiveDateCannotBeInThePastText = page.getByText('Effective date cannot be in');
        this.accountDropdown = page.locator('id=dropdown-button').first();
        this.customerRequestBanner = page.getByText('Customer sent a request');
        this.manageRequestButton = page.getByRole('button', { name: /Manage Request/i });
        this.reviewCustomerRequestHeading = page.getByText('Review Customer Request', { exact: true });
        this.acceptAndGeneratePricingButton = page.getByTestId(`generate-pricing-button`);
        this.declineRequestButton = page.getByTestId(`decline-request-button`);
        this.declineRequestConfirmButton = page.getByTestId(`decline-dialog-confirm-button`);
        this.declinedRequestConfirmationToast = page.getByText(/Customer request declined successfully/i);
        this.orderPlacedScheduleOption = page.getByRole('radio', { name: /When the order is placed and activated/i });
        this.futureDateScheduleOption = page.getByRole('radio', { name: /Set a future date/i });
        this.placeOrderButtonInAmendmentSummary = page.getByRole('button', { name: /Place Order/i }).first();
        this.addProductSubmitButton = page.getByRole('button', { name: 'Submit' });
        this.addProductsproductNameText = page.getByText('Product Name');
        this.addProductsLicenseText = page.getByRole('columnheader', { name: 'License' });
        this.addproductsListPriceYearlyText = page.getByText('List Price Yearly');
        this.addProductHeadingText = page.getByRole('heading', { name: 'Add Product' });
        this.addproductsSelectAllCheckbox = page.getByRole('checkbox', { name: 'Select all rows' });
        this.addproductsUnselectAllCheckbox = page.getByRole('checkbox', { name: 'Unselect all rows' });
        this.selectRowCheckbox = page.getByRole('checkbox', { name: 'Select row' });
        this.unselectRowCheckbox = page.getByRole('checkbox', { name: 'Unselect row' });
        this.addProductSearchBox = page.getByPlaceholder('Search for a product, SKU');
        this.addproductsClearSearchBoxButton = page.locator('//button[@aria-label="Clear search"]');
        this.productListRowsInAddProduct = this.page.locator('//div[@data-id]');
        this.noResultsFoundText = page.getByText('No results found.');
        this.availableLicenseCount = page.getByTestId('stored-partial-cancellation-note').locator('h6');
        this.licenseCountInSummaryOfChanges = page.getByTestId('change-title');
        this.targetSubscriptionDropdown = page.getByText('Select Subscription', { exact: true });
        //this.targetSubscriptionDropdown = page.locator('xpath=(//div[@role="combobox" and @tabindex="0" and @aria-haspopup="listbox"])[3]');
        this.NoUpgradesAvailableText = page.getByTestId('tooltip-BS-CAT-PRECISION');
        this.removeLicensesOption = page.getByTestId('option-remove_seats').first();
        this.numberOfLicensesToAddTextRemove = page.getByText('Number of Licenses to Remove');
        this.numberOfLicenseInputFieldRemove = page.getByRole('spinbutton', { name: /quantity input/i });
        this.randomSelectionText = page.getByText('Random selection, Unassigned licenses will be selected first.');
        this.availableLicnesesText = page.getByText('Available Licenses');
        this.saveButtonInSummaryOfChanges = page.getByText('Save');
        this.atRenewalText = page.getByText('At Renewal');
        this.deleteIcon = page.getByTestId('delete-icon');
        this.conflictCancel = page.getByTestId('conflict-cancel-btn');
        this.conflictSaveButton = page.getByTestId('conflict-save-btn');
        this.conflictCancelScbscriptions = page.getByRole('button', { name: 'Cancel' });
        this.conflictPopup = page.getByText('Conflicting Amendments Detected');
        this.saveButton = page.getByTestId('generate-pricing-button');
        this.downgradeOption = page.getByTestId('option-downgrade');
        this.cancellationOption = page.getByTestId('option-remove_product');
        this.yesOptionOnDeleteConfirmationInSummaryOfChanges = page.getByText('Yes');
        this.numberOfLicensesToDowngradeText = page.getByText('Number of Licenses to Downgrade');
        this.NoDowngradesAvailableText = page.getByText('No downgrades available');
        this.cancellationConfirmationPopupYesButton = page.getByRole('button', { name: 'Yes' });
        this.backToHistory = page.getByRole('link', { name: 'Back to History' });
        this.generatePricingDraftConfirmationYesButton = page.getByTestId('create-draft-confirmation-yes').first();

        // CONTRACT SCREEN (existing subscriptions)
        this.subscriptionNameLabels = page.locator('h6[aria-label="subscription-name"]');
        this.subscriptionSkuName = page.locator('p[aria-label="subscription-sku"]');

        //baseAddons
        this.cancelButtonInAddonDialogAmendment = page.getByTestId('cancel-button');
        this.warningOkayButtonInAddonDialogAmendment = page.getByTestId('warning-okay-button');

        //Product SKU ID's
        this.BS_CAT_1M_catalyst60 = page.getByTestId('sku-option-BS-CAT-1M');
        this.BS_CAT_DM_catalyst10 = page.getByTestId('sku-option-BS-CAT-DM');
        this.BS_TA_GENGNSS = page.getByTestId('sku-option-BS-TA-GENGNSS');
        this.BS_TBC_STA = page.getByTestId('sku-option-BS-TBC-STA');
        this.BS_TBC_SAM = page.getByTestId('sku-option-BS-TBC-SAM');
        this.BS_TA_ROADS = page.getByTestId('sku-option-BS-TA-ROADS');
        this.BS_CAT_PRECISION_catalyst1 = page.getByTestId('sku-option-BS-CAT-PRECISION');
        this.BS_CAT_SM_catalyst30 = page.getByTestId('sku-option-BS-CAT-SM');
        this.BS_TBC_ENT = page.getByTestId('sku-option-BS-TBC-ENT');
        this.BS_TBC_SAF = page.getByTestId('sku-option-BS-TBC-SAF');
        this.BS_TA_GENSURV = page.getByTestId('sku-option-BS-TA-GENSURV');
        this.BS_TBC_ANZ = page.getByTestId('sku-option-BS-TBC-ANZ');
        this.BN_TRM_TBC_SCR_TCBP = page.getByTestId('sku-option-BN-TRM-TBC-SCR-TCBP');
        this.BN_TRM_TBC_SPO_TCBP = page.getByTestId('sku-option-BN-TRM-TBC-SPO-TCBP');
        this.BS_CAT_PACKAGE = page.getByTestId('sku-option-BS-CAT-PACKAGE');
    }

    async verificationOfCreateAmendmentPage() {
        await expect(this.page).toHaveURL(/\/amend/);
    }

    async verificationOfAmendContractButton() {
        await expect(this.amendContractButton).toBeEnabled();
        await expect(this.amendContractButton).toHaveText('Amend Contract');
    }

    async clickAmendContractButton() {
        await expect(this.amendContractButton).toBeVisible({ timeout: 80000 });
        await this.amendContractButton.click({ timeout: 30000 });
        await expect(this.page).toHaveURL(/\/amend/, { timeout: 30000 });
    }

    async visitExistingContractFromCreateAmendmentPageShouldTakeToCreateAmendmentPage() {
        await this.moreOptionsButton.click();
        await this.viewOriginalContractButton.click();
        await expect(this.backToHistory).toBeVisible();
        await this.backToHistory.click();
        await this.subscriptionToggle.click();
        await expect(this.page).toHaveURL(/tab=subscriptions/);
        await expect(this.amendContractButton).toBeVisible();
        await this.amendContractButton.click();
        await expect(this.page).toHaveURL(/\/amend/);
    }

    async assertCreateAmendmentPageTextElements() {
        await expect(this.creatingContactAmendmentText).toBeVisible();
        await expect(this.creatingContactAmendmentText).toHaveText('Creating Contract Amendment');
        await expect(this.manageCurrentSubscriptionsText).toBeVisible();
        await expect(this.manageCurrentSubscriptionsText).toHaveText('Manage Current Subscriptions');
        await expect(this.addProductButton).toBeEnabled();
        await expect(this.addToCartButton).toHaveAttribute('disabled', '');
        await expect(this.amendmentTypeText).toBeVisible();
        await expect(this.amendmentTypeText).toHaveText('Amendment Type');
        await expect(this.selectAmendmentTypeDropDown).toBeVisible();
        await expect(this.selectAmendmentTypeDropDown).toHaveText('Select Amendment Type');
        await expect(this.selectSubscriptionToModifyDropDown).toBeVisible();
        await expect(this.selectSubscriptionToModifyDropDown).toHaveText('Select Subscription');
        await expect(this.contractAmendmentDraftText).toHaveText('Amendment Draft');
        await expect(this.moreOptionsButton).toBeVisible();

    }

    async selectSubscriptionToModifyAndSelectTheFirstOption() {
        await this.selectSubscriptionOptionByIndex(0);
    }

    async selectSubscriptionToModifyAndSelectTheSecondOption() {
        await this.selectSubscriptionOptionByIndex(1);
    }

    async selectSubscriptionToModify() {
        await this.scrollAmendmentSelectorsIntoView();
        await expect(this.selectSubscriptionToModifyDropDown).toBeVisible({ timeout: 30000 });

        for (let attempt = 0; attempt < 3; attempt++) {
            await this.selectSubscriptionToModifyDropDown.click({ timeout: 10000 }).catch(async () => {
                await this.scrollAmendmentSelectorsIntoView();
            });
            const isExpanded = (await this.selectSubscriptionToModifyDropDown.getAttribute('aria-expanded')) === 'true';
            if (isExpanded) {
                return;
            }
            await this.scrollOpenListboxDown();
        }

        await expect(this.selectSubscriptionToModifyDropDown).toHaveAttribute('aria-expanded', 'true', { timeout: 10000 });
    }

    async selectSubscriptionBySku(sku: string) {
        const option = this.visibleListboxOptions
            .filter({ has: this.page.getByText(sku, { exact: true }) })
            .first();
        await expect(option).toBeVisible({ timeout: 15000 });
        await option.click();
    }

    async selectSubscriptionToModifyBySku(sku: string) {
        await this.selectSubscriptionToModify();
        await this.selectSubscriptionBySku(sku);
    }

    private async scrollOpenListboxDown() {
        await this.visibleListbox.hover({ timeout: 1000 }).catch(() => { });
        await this.page.mouse.wheel(0, 280);
    }

    private async selectSubscriptionOptionByIndex(index: number) {
        await this.scrollAmendmentSelectorsIntoView();
        await expect(this.selectSubscriptionToModifyDropDown).toBeVisible({ timeout: 30000 });
        // TRCPS SKU: it has Add Storage only, so it cannot be used for Add Seats.
        const skippedSku = 'BS-SB-SCAN-200GB';
        let targetIndex = index;

        for (let attempt = 0; attempt < 5; attempt++) {
            const isExpanded = (await this.selectSubscriptionToModifyDropDown.getAttribute('aria-expanded')) === 'true';
            if (!isExpanded) {
                await this.selectSubscriptionToModifyDropDown.click({ timeout: 10000 }).catch(async () => {
                    await this.scrollAmendmentSelectorsIntoView();
                });
            }

            const option = this.visibleListboxOptions.nth(targetIndex);
            const optionVisible = await option.waitFor({ state: 'visible', timeout: 1500 }).then(() => true).catch(() => false);
            if (!optionVisible) {
                await this.scrollOpenListboxDown();
                continue;
            }

            const optionText = ((await option.innerText()) ?? '').replace(/\s+/g, ' ');
            if (optionText.includes(skippedSku)) {
                targetIndex += 1;
                continue;
            }

            await option.scrollIntoViewIfNeeded().catch(() => { });
            const clicked = await option.click({ timeout: 5000 }).then(() => true).catch(() => false);
            if (clicked) {
                return;
            }

            const forceClicked = await option.click({ timeout: 5000, force: true }).then(() => true).catch(() => false);
            if (forceClicked) {
                return;
            }

            await this.scrollOpenListboxDown();
        }

        throw new Error(`Unable to select subscription option at index ${targetIndex}.`);
    }

    private async selectSkuOptionWithScrollFallback(option: Locator, productKey: string) {
        for (let attempt = 0; attempt < 6; attempt++) {
            const optionVisible = await option.waitFor({ state: 'visible', timeout: 1500 }).then(() => true).catch(() => false);
            if (!optionVisible) {
                await this.scrollOpenListboxDown();
                continue;
            }

            await option.scrollIntoViewIfNeeded().catch(() => { });
            const clicked = await option.click({ timeout: 5000 }).then(() => true).catch(() => false);
            if (clicked) {
                return;
            }

            const forceClicked = await option.click({ timeout: 5000, force: true }).then(() => true).catch(() => false);
            if (forceClicked) {
                return;
            }

            await this.scrollOpenListboxDown();
        }

        throw new Error(`Unable to select product SKU option ${productKey} from dropdown.`);
    }

    async scrollAmendmentSelectorsIntoView() {
        for (let attempt = 0; attempt < 6; attempt++) {
            const amendmentTypeVisible = await this.selectAmendmentTypeDropDown.isVisible().catch(() => false);
            if (amendmentTypeVisible) {
                await this.selectAmendmentTypeDropDown.scrollIntoViewIfNeeded();
                return;
            }
            await this.page.mouse.wheel(0, 260);
        }
        await this.selectAmendmentTypeDropDown.scrollIntoViewIfNeeded();
    }

    async clickAmendmentTypeDropdown() {
        await this.scrollAmendmentSelectorsIntoView();
        await expect(this.selectAmendmentTypeDropDown).toBeVisible({ timeout: 30000 });

        const amendmentTypeDisabled = (await this.selectAmendmentTypeDropDown.getAttribute('aria-disabled')) === 'true';
        if (amendmentTypeDisabled) {
            // Some contracts land with no preselected subscription; selecting the first option enables Amendment Type.
            await this.selectSubscriptionOptionByIndex(0);
            await expect
                .poll(async () => await this.selectAmendmentTypeDropDown.getAttribute('aria-disabled'))
                .not.toBe('true');
        }

        for (let attempt = 0; attempt < 3; attempt++) {
            await this.scrollAmendmentSelectorsIntoView();
            await this.selectAmendmentTypeDropDown.click({ timeout: 10000 }).catch(async () => {
                await this.scrollAmendmentSelectorsIntoView();
            });
            const isExpanded = (await this.selectAmendmentTypeDropDown.getAttribute('aria-expanded')) === 'true';
            if (!isExpanded) {
                continue;
            }

            const isInteractive = await this.amendmentTypeDropdownListAddSeats
                .click({ trial: true, timeout: 2000 })
                .then(() => true)
                .catch(() => false);

            if (isInteractive) {
                console.log('Amendment Type Dropdown opened');
                return;
            }
        }

        await expect(this.selectAmendmentTypeDropDown).toHaveAttribute('aria-expanded', 'true', { timeout: 10000 });
        await this.amendmentTypeDropdownListAddSeats.click({ trial: true, timeout: 10000 });
        console.log('Amendment Type Dropdown opened');
    }

    async clickTargetSubscriptionDropdown() {
        await this.scrollAmendmentSelectorsIntoView();
        await expect(this.targetSubscriptionDropdown).toBeVisible({ timeout: 30000 });
        await this.targetSubscriptionDropdown.scrollIntoViewIfNeeded();

        for (let attempt = 0; attempt < 3; attempt++) {
            await this.targetSubscriptionDropdown.click({ timeout: 10000 }).catch(async () => {
                await this.scrollAmendmentSelectorsIntoView();
            });
            const listboxVisible = await this.visibleListbox.waitFor({ state: 'visible', timeout: 1500 }).then(() => true).catch(() => false);
            if (listboxVisible) {
                return;
            }
            await this.scrollOpenListboxDown();
        }

        await this.visibleListbox.waitFor({ state: 'visible', timeout: 10000 });
    }

    async verifyTargetSubscriptionText() {
        await expect(this.targetSubscription).toBeVisible();
        await expect(this.targetSubscription).toHaveText('Target Subscription');
    }

    async selectAddSeatOption() {
        await this.addSeatsOption.click();
    }

    async selectUpgradeOption() {
        await this.upgradeOption.click();
    }

    async verifyTrcpsAmendmentOptions() {
        const option = (label: string) => this.visibleListboxOptions.filter({ hasText: new RegExp(`^${label}`) });

        await expect(option('Add Storage')).toHaveCount(1);
        await expect(option('Remove Storage')).toHaveCount(1);
        await expect(option('Cancel Subscription')).toHaveCount(1);
        await expect(this.visibleListboxOptions.filter({ hasText: /^Upgrade/ })).toHaveCount(0);
        await expect(this.visibleListboxOptions.filter({ hasText: /^Downgrade/ })).toHaveCount(0);
    }

    async selectRemoveStorageOption() {
        const removeStorageOption = this.visibleListboxOptions.filter({ hasText: /^Remove Storage/ }).first();
        await expect(removeStorageOption).toBeVisible({ timeout: 10000 });
        await removeStorageOption.click();
        await expect(this.numberOfLicenseInputField).toHaveValue('0');
    }

    async reduceTrcpsStorageToZero() {
        await expect(this.numberOfLicenseInputField).toHaveValue('0');

        const currentStorageText = this.page.getByText(/Current Storage in contract\s*\d+GB/i);
        const newTotalStorageText = this.page.getByText(/New total storage in contract\s*\d+GB/i);
        const storageValue = (text: string | null): number => {
            const match = text?.match(/(\d+)\s*GB/i);
            if (!match) {
                throw new Error(`Could not read storage value from: ${text}`);
            }
            return Number(match[1]);
        };

        const currentStorage = storageValue(await currentStorageText.textContent());
        await this.licenseIncrementButton.click();
        await expect(this.numberOfLicenseInputField).toHaveValue('1');
        await expect(newTotalStorageText).toBeVisible();

        let expectedStorage = storageValue(await newTotalStorageText.textContent());
        const storagePerIncrement = currentStorage - expectedStorage;
        if (storagePerIncrement <= 0) {
            throw new Error(`Storage did not decrease after incrementing: ${currentStorage}GB -> ${expectedStorage}GB`);
        }

        let incrementCount = 1;
        while (expectedStorage > 0) {
            await this.licenseIncrementButton.click();
            incrementCount++;
            await expect(this.numberOfLicenseInputField).toHaveValue(String(incrementCount));
            expectedStorage -= storagePerIncrement;
            await expect(newTotalStorageText).toContainText(`${expectedStorage}GB`);
        }

        await expect(newTotalStorageText).toContainText('0GB');
    }

    async assertTextAndVisibilityOfSummaryOfChangesScreenInCreateAmendmentPage() {
        await expect(this.summaryOfChangesText).toBeVisible();
        await expect(this.summaryOfChangesText).toHaveText('Summary of Changes');
        await expect(this.PONumberTextField).toBeVisible();
        await expect(this.page.getByText('When the order is placed and activated')).toBeVisible();
        await expect(this.page.getByText('Set a future date', { exact: true })).toBeVisible();
        // const showDetails = this.page.getByRole('button', { name: 'View Details' });
        // if (await showDetails.isVisible().catch(() => false)) {
        //     await showDetails.click();
        // }
        await expect(this.viewDetails).toBeVisible();
        await this.viewDetails.click();
        // await expect(this.immediateTextinSummaryOfChanges).toBeVisible();
        // await expect(this.immediateTextinSummaryOfChanges).toHaveText('IMMEDIATE');
        await expect(this.addLicenseTextInSummaryOfChanges).toBeVisible();
        await expect(this.removeChangeButton).toBeVisible();
        await expect(this.hideDetailsButton).toBeVisible();
        await this.hideDetailsButton.click();
    }

    async verifyAddToCartButtonIsEnabledWhenIncrementSeatButtonIsGreaterThan0() {
        await this.selectSubscriptionToModifyAndSelectTheFirstOption();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await this.EnterTheLicenseAndAssertTheValue("1", "1");
        await expect(this.addToCartButton).not.toHaveAttribute('disabled');
    }

    async clickAddToCartButton() {
        await this.addToCartButton.click();
    }

    async confirmTrcpsStorageRemoval() {
        await expect(this.cancellationConfirmationPopupYesButton).toBeVisible({ timeout: 10000 });
        await this.cancellationConfirmationPopupYesButton.click();
    }

    async assertConflictPopupIsVisibleAndClickSave() {
        const conflictPopupVisible = await this.conflictPopup
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        if (conflictPopupVisible) {
            await this.conflictSaveButton.click();
        }
        else {
            console.log("No Conflicts");
            await this.clickSaveButton();
        }
    }

    async clickSaveButton() {
        await this.saveButton.click();

        // Should remove the below lines if this is not required for this scenario. (Bug yet to be created)
        // https://chat.google.com/room/AAQAe0p15QY/ptVrWGXJVS8/ptVrWGXJVS8?cls=10
        const draftConfirmationVisible = await this.generatePricingDraftConfirmationYesButton
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        if (draftConfirmationVisible) {
            await this.generatePricingDraftConfirmationYesButton.click();
            console.log("Clicked on Yes button in Generate Pricing Draft Confirmation");
        }
    }

    async clickDeleteIcon() {
        await this.deleteIcon.click();
    }

    async verifyAddToCartButtonIsDisabled() {
        await expect(this.addToCartButton).toHaveAttribute('disabled', '');
    }

    async verifyAddToCartButtonIsEnabled() {
        await expect(this.addToCartButton).not.toHaveAttribute('disabled');
    }

    async verifyAddToCartButtonIsDisabledWhenIncrementSeatButtonIs0() {
        await this.selectSubscriptionToModifyAndSelectTheFirstOption();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await this.EnterTheLicenseAndAssertTheValue("0", "0");
        await expect(this.addToCartButton).toHaveAttribute('disabled', '');
    }

    async verifySeatsCanNotBeAddedMoreThan999AndIncrementButtonIsDisabled() {
        await this.selectSubscriptionToModifyAndSelectTheFirstOption();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await this.EnterTheLicenseAndAssertTheValue("1000", "999");
        await expect(this.licenseIncrementButton).toHaveAttribute('disabled');
        await expect(this.addToCartButton).not.toHaveAttribute('disabled');
    }

    async verifySeatsCanNotBeAddedLessThan0AndVerifyDecrementButtonIsDisabled() {
        await this.selectSubscriptionToModifyAndSelectTheFirstOption();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await this.EnterTheLicenseAndAssertTheValue("-1", "0");
        await expect(this.licenseDecrementButton).toHaveAttribute('disabled');
        await expect(this.addToCartButton).toHaveAttribute('disabled', '');
    }

    async addLicenseSeatsUsingIncrementButton() {
        await this.selectSubscriptionToModifyAndSelectTheFirstOption();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await this.EnterTheLicenseAndAssertTheValue("0", "0");
        await this.licenseIncrementButton.click();
        await expect(this.numberOfLicenseInputField).toHaveValue("1");
        await expect(this.addToCartButton).not.toHaveAttribute('disabled');
    }

    async reduceLicenseSeatsUsingDecrementButton() {
        await this.selectSubscriptionToModifyAndSelectTheFirstOption();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await expect(this.numberOfLicensesToAddText).toHaveText('Number of Licenses to Add');
        await this.EnterTheLicenseAndAssertTheValue("2", "2");
        await this.licenseDecrementButton.click();
        await expect(this.numberOfLicenseInputField).toHaveValue("1");
        await expect(this.addToCartButton).not.toHaveAttribute('disabled');
        await this.licenseDecrementButton.click();
        await expect(this.numberOfLicenseInputField).toHaveValue("0");
        await expect(this.addToCartButton).toHaveAttribute('disabled', '');
    }

    async EnterTheLicenseAndAssertTheValue(enterNumberOfLicense: string, assertValueFilledInLicenseField: string) {
        await expect(this.numberOfLicensesToAddText).toHaveText('Number of Licenses to Add');
        await this.numberOfLicenseInputField.fill(enterNumberOfLicense);
        await expect(this.numberOfLicenseInputField).toHaveValue(assertValueFilledInLicenseField);
    }

    async verifyLicenseCountInSummaryOfChangesInCreateAmendmentScreen(expectedCount: string) {
        await expect(this.addLicenseTextInSummaryOfChanges).toContainText(new RegExp(`\\b${expectedCount}\\b`));
    }

    async verifyAddLicenseTextInSummaryOfChangesInCreateAmendmentScreen(expectedText: string) {
        await expect(this.addLicenseTextInSummaryOfChanges).toContainText(expectedText);
    }

    async enterPONumberInSummaryOfChangesInCreateAmendmentScreen(poNumber: string) {
        await this.PONumberTextField.click();
        await this.PONumberTextField.fill(poNumber);
    }

    async clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreen() {
        await expect(this.generatePricingButton).toBeEnabled();
        await this.generatePricingButton.click({ timeout: 15000 });
        await this.page.waitForTimeout(2000);
        const addonDialogVisible = await this.generatePricingButtonInAddonDialog
            .waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
        if (addonDialogVisible) {
            await this.generatePricingButtonInAddonDialog.click({ timeout: 10000 });
        }
        const warningVisible = await this.warningOkayButtonInAddonDialogAmendment
            .waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
        if (warningVisible) {
            await this.warningOkayButtonInAddonDialogAmendment.click({ timeout: 10000 });
        }
        const draftConfirmationVisible = await this.generatePricingDraftConfirmationYesButton
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        if (draftConfirmationVisible) {
            await this.generatePricingDraftConfirmationYesButton.click();
            console.log("Clicked on Yes button in Generate Pricing Draft Confirmation");
        }
    }

    async clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreenWithOutAddon() {
        await expect(this.generatePricingButton).toBeEnabled();
        await this.generatePricingButton.click({ timeout: 2000 });
    }

    async createAmendmentByAddingSeatsAndGeneratePricing(licenseCount: string, poNumber: string) {
        //selectAmendment Type and Subscription and add seats
        await this.selectSubscriptionToModifyAndSelectTheFirstOption();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await this.EnterTheLicenseAndAssertTheValue(licenseCount, licenseCount);
        await this.clickAddToCartButton();

        //summary of Changes 
        await this.assertTextAndVisibilityOfSummaryOfChangesScreenInCreateAmendmentPage();
        //Bug raised - https://jira.trimble.tools/browse/DXP-237
        //await expect(this.licenseCountinSummaryOfChanges).toHaveText(licenseCount);
        await expect(this.addLicenseTextInSummaryOfChanges).toContainText(licenseCount);
        const today = new Date();
        await this.enterMonthDateYearInSummaryOfchangesPage(0, +6, String(today.getFullYear()));
        await this.PONumberTextField.click().then(() => this.PONumberTextField.fill(poNumber));
        await this.generatePricingButton.click();
    }

    async clickRemoveChangesButtonAndVerifySummaryOfChangesIsDiscarded() {
        //add seats
        await this.selectSubscriptionToModifyAndSelectTheFirstOption();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await this.EnterTheLicenseAndAssertTheValue("2", "2");
        await this.clickAddToCartButton();
        await expect(this.viewDetails).toBeVisible();
        await expect(this.generatePricingButton).toBeVisible();
        await this.viewDetails.click();
        await expect(this.hideDetailsButton).toBeVisible();

        //summary of Changes 
        //Bug raised - https://jira.trimble.tools/browse/DXP-237
        //await expect(this.licenseCountinSummaryOfChanges).toHaveText('2');
        await expect(this.addLicenseTextInSummaryOfChanges).toContainText('2');

        //remove license and verification
        await this.removeChangeButton.click();
        await expect(this.page.getByText('Summary of Changes')).not.toBeVisible();
        await expect(this.addToCartButton).toHaveAttribute('disabled', '');
    }

    async getDaysInMonth(year: number, month: number): Promise<number> {
        // month is 0-indexed (0 = Jan, 11 = Dec)
        return new Date(year, month + 1, 0).getDate();
    }

    async enterMonthDateYearInSummaryOfchangesPage(monthOffset: number, dayOffset: number, year?: string) {
        const today = new Date();
        const validDate = new Date(today);

        // Apply month offset
        validDate.setMonth(validDate.getMonth() + monthOffset);

        // Apply day offset
        validDate.setDate(validDate.getDate() + dayOffset);

        const yearToUse = year && year.trim().length ? year.trim() : String(validDate.getFullYear());

        // New UI: date fields appear only after selecting "Set a future date"
        await this.page.getByText('Set a future date', { exact: true }).click();
        await expect(this.enterMonth).toBeVisible({ timeout: 10000 });

        await this.enterMonth.click();
        await this.enterMonth.fill(String(validDate.getMonth() + 1)); // JS months are 0-based

        await this.enterDay.click();
        await this.enterDay.fill(String(validDate.getDate()));

        await this.enterYear.click();
        await this.enterYear.fill(yearToUse);
    }

    async verifyErrorMessage() {
        await expect(this.effectiveDateCannotBeInThePastText).toBeVisible();
        await expect(this.generatePricingButton).toHaveAttribute('disabled', '');
    }

    async verifyGeneratePricingEnabled() {
        await expect(this.generatePricingButton).not.toHaveAttribute('disabled');
    }

    // CASE 1: Date in past
    async verifyGeneratePricingDisabledForPastDate() {
        await this.enterMonthDateYearInSummaryOfchangesPage(-1, 0, '2025');
        await this.verifyErrorMessage();
    }

    // CASE 2: Different Year (Future Year)
    async verifyGeneratePricingDisabledForFutureYear() {
        await this.enterMonthDateYearInSummaryOfchangesPage(1, 0, '2030');
        await this.verifyErrorMessage();
    }

    // CASE 3: Current date + 2 to +maxDays (enabled)
    async verifyGeneratePricingEnabledWithinAllowedRange() {
        const today = new Date();
        const daysInMonth = await this.getDaysInMonth(today.getFullYear(), today.getMonth());

        // We’ll pick date +2 (minimum allowed)
        await this.enterMonthDateYearInSummaryOfchangesPage(0, 2, String(today.getFullYear()));
        await this.verifyGeneratePricingEnabled();

        // We’ll also test for date +30 (maximum allowed window)
        await this.enterMonthDateYearInSummaryOfchangesPage(0, this.MAX_FUTURE_DAYS, String(today.getFullYear()));
        await this.verifyGeneratePricingEnabled();
    }

    // CASE 4: More than 30/31 days from today
    async verifyGeneratePricingDisabledBeyondMaxDays() {
        const today = new Date();
        const daysInMonth = await this.getDaysInMonth(today.getFullYear(), today.getMonth());
        // pick +31 days to exceed the fixed 30-day limit
        await this.enterMonthDateYearInSummaryOfchangesPage(0, this.MAX_FUTURE_DAYS + 1, String(today.getFullYear()));
        await this.verifyErrorMessage();
    }

    // CASE 5: Month +2 or more → disable directly
    async verifyGeneratePricingDisabledForMonthBeyondTwoAhead() {
        await this.enterMonthDateYearInSummaryOfchangesPage(3, 0, '2025');
        await this.verifyErrorMessage();
    }

    // CASE 6: Validating dynamic month days (30/31 check)
    async validateDaysInCurrentMonthAndLog() {
        const today = new Date();
        const daysInMonth = await this.getDaysInMonth(today.getFullYear(), today.getMonth());
        console.log(`Current month (${today.toLocaleString('default', { month: 'long' })}) has ${daysInMonth} days.`);
    }


    async saveContractInfo() {
        // Fetch contract number from createAmend page
        const fullText = await this.contractId.innerText();
        console.log('Full contract text:', fullText);

        if (!fullText) {
            throw new Error('Contract number not found on page');
        }

        // Extract only the number
        const match = fullText.match(/\d+/);
        if (!match) {
            throw new Error('No numeric contract number found in text: ' + fullText);
        }
        const contract_number = parseInt(match[0], 10);
        // Save to file
        const data = { contract_number };
        writeFileSync('.auth/contract_info_amendment.json', JSON.stringify(data, null, 2), 'utf-8');
        console.log('Contract info saved to file:', data);
    }

    async getContractGuidFromFile() {
        try {
            const fileContent = readFileSync('.auth/contract_info_amendment.json', 'utf-8');
            const data = JSON.parse(fileContent);
            return data.contract_guid; // return only the contract_guid
        } catch (err) {
            throw new Error('Failed to read contract info from file: ' + err);
        }
    }

    /* ADD PRODUCTS */

    async clickAddProductButton() {
        await expect(this.addProductButton).toBeEnabled();
        await this.addProductButton.click();
        await expect(this.addProductHeadingText).toBeVisible({ timeout: 30000 });
    }

    async getExistingContractProductsInSubscriptionsTab(): Promise<string[]> {
        const names = await this.subscriptionSkuName.allTextContents();
        return names.map(n => n.trim());
    }

    async getAvailableLicenseCountInLicenseSelection(): Promise<number> {
        const text = await this.availableLicenseCount.innerText();

        const match = text.match(/\d+/);

        return match ? Number(match[0]) : 0;


    }


    async enterLicenseCount(count: number): Promise<void> {
        await this.numberOfLicenseInputField.fill(count.toString());
        await expect(this.numberOfLicenseInputField).toHaveValue(count.toString());
    }

    async verifyAvailableLicenseCount(expectedCount: number): Promise<void> {
        const locator = this.page.getByTestId('stored-partial-cancellation-note');

        await expect(locator).toContainText(
            `Available licenses: ${expectedCount}`
        );
    }


    async fullUpgradeAndVerify(): Promise<void> {
        const totalLicenses = await this.getAvailableLicenseCountInLicenseSelection();
        await this.enterLicenseCount(totalLicenses);
        await this.verifyAvailableLicenseCount(0);
    }

    async partialUpgradeAndVerify(licenseToUpgrade: number): Promise<void> {
        const totalLicenses = await this.getAvailableLicenseCountInLicenseSelection();
        await this.enterLicenseCount(licenseToUpgrade);
        const expectedAvailable = totalLicenses - licenseToUpgrade;
        await this.verifyAvailableLicenseCount(expectedAvailable);
    }

    async verifyLicenseCountIsDisplayedInShowDetails(expectedCount: number): Promise<void> {
        const text = await this.licenseCountInSummaryOfChanges.innerText();
        const match = text.match(/\d+/);
        const actualCount = match ? Number(match[0]) : null;
        expect(actualCount).toBe(expectedCount);
    }

    async selectTheProduct(productKey: string) {
        const productLocatorMap: Record<string, Locator> = {
            'BS_CAT_1M': this.BS_CAT_1M_catalyst60,
            'BS_CAT_DM': this.BS_CAT_DM_catalyst10,
            'BS_CAT_PRECISION': this.BS_CAT_PRECISION_catalyst1,
            'BS_CAT_SM': this.BS_CAT_SM_catalyst30,
            'BS_TA_GENGNSS': this.BS_TA_GENGNSS,
            'BS_TBC_STA': this.BS_TBC_STA,
            'BS_TBC_SAM': this.BS_TBC_SAM,
            'BS_TA_ROADS': this.BS_TA_ROADS,
            'BS_TBC_ENT': this.BS_TBC_ENT,
            'BS_TBC_SAF': this.BS_TBC_SAF,
            'BS_TA_GENSURV': this.BS_TA_GENSURV,
            'BS_TBC_ANZ': this.BS_TBC_ANZ,
            'BN_TRM_TBC_SCR_TCBP': this.BN_TRM_TBC_SCR_TCBP,
            'BN_TRM_TBC_SPO_TCBP': this.BN_TRM_TBC_SPO_TCBP,
            'BS_CAT_PACKAGE': this.BS_CAT_PACKAGE,
        };

        const productOption = productLocatorMap[productKey];
        if (!productOption) {
            throw new Error(`Invalid product SKU: ${productKey}`);
        }

        await this.selectSkuOptionWithScrollFallback(productOption, productKey);
    }


    async verifyNoUpgradesAvailableMessage() {
        await expect(this.NoUpgradesAvailableText).toBeVisible();
    }

    async expectAddProductEnabled() {
        await expect(this.addProductButton).toBeEnabled();
    }
    async selectRemoveLicensesOption() {
        await this.scrollAmendmentSelectorsIntoView();
        for (let attempt = 0; attempt < 3; attempt++) {
            if ((await this.selectAmendmentTypeDropDown.getAttribute('aria-expanded')) !== 'true') {
                await this.clickAmendmentTypeDropdown();
            }

            try {
                await this.removeLicensesOption.scrollIntoViewIfNeeded();
                await this.removeLicensesOption.click({ timeout: 10000 });
            } catch {
                // Keyboard fallback avoids pointer interception from transient overlays.
                await this.selectAmendmentTypeDropDown.focus();
                await this.page.keyboard.press('ArrowDown');
                await this.page.keyboard.press('ArrowDown');
                await this.page.keyboard.press('ArrowDown');
                await this.page.keyboard.press('Enter');
            }

            const selectedRemoveLicenses = await this.selectAmendmentTypeDropDown
                .filter({ hasText: 'Remove Licenses' })
                .isVisible()
                .catch(() => false);

            if (selectedRemoveLicenses) {
                await expect(this.numberOfLicenseInputFieldRemove).toBeVisible({ timeout: 10000 });
                return;
            }
        }

        throw new Error('Unable to select Remove Licenses from Amendment Type dropdown.');
    }

    async assertOnRemoveLicensesOptionElements() {
        await expect(this.numberOfLicensesToAddTextRemove).toBeVisible();
        await expect(this.numberOfLicenseInputFieldRemove).toBeVisible();
        await expect(this.randomSelectionText).toBeVisible();
        await expect(this.availableLicnesesText).toBeVisible();
        await expect(this.addToCartButton).toBeDisabled();
        // await expect(this.addToCartButton).toBeEnabled();
    }

    async EnterTheLicenseAndAssertTheValueToRemove(enterNumberOfLicense: string, assertValueFilledInLicenseField: string) {
        console.log("Available Licenses:", await this.availableLicnesesText.textContent());
        await this.numberOfLicenseInputFieldRemove.fill(enterNumberOfLicense);
        await expect(this.numberOfLicenseInputFieldRemove).toHaveValue(assertValueFilledInLicenseField);
    }

    async verifySummaryofChangesForNegativeMotions() {
        await this.viewDetails.click();
        await expect(this.hideDetailsButton).toBeVisible();
        await this.hideDetailsButton.click();
        await this.viewDetails.click();
        await expect(this.saveButtonInSummaryOfChanges).toBeVisible();
        await expect(this.PONumberTextField).toBeDisabled();
        await expect(this.datePickerButton).toBeDisabled();
        // await expect(this.atRenewalText).toBeVisible();
    }

    async verifyRenewalTabContent(expectedText: string) {
        await expect(this.addLicenseTextInSummaryOfChanges).toContainText(expectedText);
    }

    async verifyDeleteIconPresent() {
        // this.deleteIcon = page.getByTestId('delete-icon');
        await expect(this.deleteIcon).toBeVisible();
    }


    async getAvailableLicenseCountInLicenseSelection1(): Promise<number> {
        const text = await this.availableLicenseCount.innerText();
        const match = text.match(/Available licenses:\s*(\d+)/);
        return match ? Number(match[1]) : 0;
    }

    async conflictCancelButtonClick() {
        await this.conflictCancelScbscriptions.click();
    }

    async selectDowngradeOption() {
        await this.downgradeOption.click();
    }

    async selectCancellationOption() {
        await this.cancellationOption.click();
    }

    async assertOnDowngradeOptionElements() {
        // await expect(this.downgradeOption).toBeVisible();
        await expect(this.randomSelectionText).toBeVisible();
        await expect(this.numberOfLicensesToDowngradeText).toBeVisible();
        await expect(this.numberOfLicenseInputField).toBeVisible();
        await expect(this.addToCartButton).toBeDisabled();
        await expect(this.availableLicnesesText).toBeVisible();
    }

    async verifyNoDowngradesAvailableMessage() {
        await expect(this.NoDowngradesAvailableText).toBeVisible();
    }

    async assertCustomerRequestBannerVisible(timeoutMs = 120000) {
        await expect(this.customerRequestBanner).toBeVisible({ timeout: timeoutMs });
    }

    async assertCustomerRequestBannerNotVisible(timeoutMs = 120000) {
        await expect(this.customerRequestBanner).not.toBeVisible({ timeout: timeoutMs });
    }

    async assertManageRequestButtonVisible(timeoutMs = 120000) {
        await expect(this.manageRequestButton).toBeVisible({ timeout: timeoutMs });
    }

    async assertManageRequestButtonNotVisible(timeoutMs = 120000) {
        await expect(this.manageRequestButton).not.toBeVisible({ timeout: timeoutMs });
    }

    async openManageRequest() {
        await this.manageRequestButton.click();
        await expect(this.reviewCustomerRequestHeading).toBeVisible({ timeout: 30000 });
    }

    async assertOrderPlacedScheduleDefault() {
        await expect(this.orderPlacedScheduleOption).toBeVisible({ timeout: 5000 });
        await expect(this.orderPlacedScheduleOption).toBeChecked();
    }

    async setFutureDateForCustomerRequest(futureDate: { month: number; day: number; year: number | string }) {
        await this.futureDateScheduleOption.click();
        await this.enterMonth.fill(String(futureDate.month));
        await this.enterDay.fill(String(futureDate.day));
        await this.enterYear.fill(String(futureDate.year));
    }

    async confirmCustomerRequestAcceptance() {
        await this.acceptAndGeneratePricingButton.click();
        await expect(this.page.getByText('Amendment Draft', { exact: true })).toBeVisible({ timeout: 20000 });
    }

    async cancelCustomerRequestReview() {
        const dialog = this.page.getByRole('dialog');
        const cancelButton = dialog.getByRole('button', { name: /^Cancel$/ }).first();
        const closeButton = dialog.getByRole('button', { name: /^Close$/ }).first();

        if (await cancelButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await cancelButton.click();
        } else if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeButton.click();
        } else {
            await this.page.keyboard.press('Escape');
        }

        await expect(this.reviewCustomerRequestHeading).not.toBeVisible({ timeout: 10000 });
    }

    async assertCustomerRequestCommentVisible(comment: string) {
        const commentText = this.page.getByRole('dialog').getByText(new RegExp(comment, 'i')).first();
        await expect(commentText).toBeVisible({ timeout: 10000 });
    }

    async acceptCustomerInitiatedRequest(options?: CustomerInitiatedDraftOptions) {
        await this.openManageRequest();
        if (options?.schedule === 'futureDate') {
            if (options.futureDate) {
                await this.setFutureDateForCustomerRequest(options.futureDate);
            } else {
                await this.futureDateScheduleOption.click();
            }
        } else {
            await expect(this.orderPlacedScheduleOption).toBeVisible({ timeout: 5000 });
            await this.orderPlacedScheduleOption.click();
        }
        await this.confirmCustomerRequestAcceptance();
    }

    async declineCustomerInitiatedRequest(message?: string) {
        await this.openManageRequest();
        await this.declineRequestButton.click();
        if (message && message.trim().length > 0) {
            const reasonInput = this.page.locator('textarea').first();

            if (await reasonInput.isVisible({ timeout: 2000 }).catch(() => false)) {
                await reasonInput.fill(message);
            }
        }

        await this.declineRequestConfirmButton.click();
        await expect(this.declinedRequestConfirmationToast).toBeVisible({ timeout: 10000 });
        await this.page.reload();
    }

    async assertRemovingBaseProductWarning() {
        await expect(this.page.getByText(/Removing Base Products/)).toBeVisible();
        await expect(this.page.getByText(/You are removing a Base product while still keeping its Add-on product in the contract. Without the Base Product, the software will not work correctly./)).toBeVisible();
        await expect(this.page.getByText(/The following are the Base product\(s\) you are attempting to remove:/)).toBeVisible();
        await expect(this.page.getByText(/Base Products Removed/)).toBeVisible();
        await expect(this.page.getByText(/1 Bases/)).toBeVisible();
        await expect(this.page.getByText(/The following Add-on product\(s\) do not have a compatible Base product/)).toBeVisible();
        await expect(this.page.getByText(/Unsupported Add-on Products/)).toBeVisible();
        await expect(this.cancelButtonInAddonDialogAmendment).toBeVisible();
        await expect(this.warningOkayButtonInAddonDialogAmendment).toBeVisible();
    }

    async createAmendmentCancellationBaseAddon() {
        await this.clickAmendContractButton();
        await this.clickAmendmentTypeDropdown();
        await this.selectCancellationOption();
        await this.selectSubscriptionToModify();
        await this.selectTheProduct('BS_CAT_SM');
        await this.clickAddToCartButton();
        await this.saveButton.click();
    }

    async saveinAmendmentSummary() {
        await this.saveButton.click();
    }

    async clickCancelButtonInAddonDialogAmendment() {
        await this.cancelButtonInAddonDialogAmendment.click();
    }

    async createAmendmentAddProductBaseAddon() {
        const productsPage = new ProductsPage(this.page);
        await this.clickAmendContractButton();
        await this.clickAddProductButton();
        await productsPage.searchProductBySKU("BS-TBC-ANZ");
        await productsPage.selectRowCheckbox.check();
        await productsPage.submitButtonInAddProduct();
        await this.clickGeneratePricingButtonInSummaryOfChangesInCreateAmendmentScreenWithOutAddon();
    }

    async createAmendmentPackage() {
        await this.clickAmendContractButton();
        await this.clickAmendmentTypeDropdown();
        await this.selectAddSeatOption();
        await this.selectSubscriptionToModify();
        await this.onHoverPackageTooltipTextInCreateAmendment();
        await this.page.keyboard.press('Escape');
        await this.page.locator('[role="combobox"]').first().click();
        await this.selectUpgradeOption();
        await this.selectSubscriptionToModify();
        await this.onHoverPackageTooltipTextInCreateAmendment();
        await this.page.keyboard.press('Escape');
        await this.page.locator('[role="combobox"]').first().click();
        await this.selectDowngradeOption();
        await this.selectSubscriptionToModify();
        await this.onHoverPackageTooltipTextInCreateAmendment();
        await this.page.keyboard.press('Escape');
        await this.page.locator('[role="combobox"]').first().click();
        await this.selectRemoveLicensesOption();
        await this.selectSubscriptionToModify();
        await this.onHoverPackageTooltipTextInCreateAmendment();
        await this.page.keyboard.press('Escape');
        await this.page.locator('[role="combobox"]').first().click();
        await this.selectCancellationOption();
        await this.selectSubscriptionToModify();
        await this.onHoverPackageTooltipTextInCreateAmendment();
    }

    async onHoverPackageTooltipTextInCreateAmendment() {
        await this.page.locator('[data-testid="tooltip-BS-CAT-PACKAGE"]').hover();
        await this.page.waitForTimeout(1000);
        await expect(this.page.getByTestId('tooltip-BS-CAT-PACKAGE')).toHaveAttribute('aria-label', 'Amendments are not supported for packages');
        console.log("Tooltip text verified for package in Create Amendment page successfully");
    }
}
