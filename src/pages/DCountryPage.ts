import { expect, Locator, Page } from "@playwright/test";

export class DCountryPage {

    readonly page: Page;
    readonly EEUCBannerTitle: Locator;
    readonly firstBannerMessage: Locator;
    readonly EEUCBannerReviewTermsButton: Locator;
    readonly EEUCPurchaserBannerTitle: Locator;
    readonly secondBannerMessage: Locator;
    readonly EEUCPurchaserBannerReviewTermsButton: Locator;
    readonly EEUCIndividualFormHeader: Locator;
    readonly EEUCBackButton: Locator;
    readonly EEUCCommodityValueInput: Locator;
    readonly EEUCAgreeRadio: Locator;
    readonly EEUCYesIAcceptCheckbox: Locator;
    readonly EEUCSubmitButton: Locator;
    readonly EEUCFormSubmittedText: Locator;
    readonly EEUCSubmittedForEndUserText: Locator;
    readonly EEUCSubmittedForPurchaserText: Locator;
    readonly EEUCReleaseHoldMessage: Locator;
    readonly EEUCPurchaserReleaseHoldMessage: Locator;
    readonly EEUCInfoIcon: Locator;
    readonly EEUCIndividualFormParagraph: Locator;
    readonly EEUCExportEndUseCertificationHeading: Locator;
    readonly EEUCPurchaserInformationParagraph: Locator;
    readonly EEUCEndUserConsigneeParagraph: Locator;
    readonly EEUCDispositionParagraph: Locator;
    readonly EEUCAnnualFormParagraph: Locator;
    readonly cancelContractButton: Locator;
    readonly cancelContractDialogHeading: Locator;
    readonly cancelContractDialogMessage: Locator;
    readonly cancelContractYesButton: Locator;
    readonly cancelContractNoButton: Locator;
    readonly cancelContractToast: Locator;

    constructor(page: Page) {
        this.page = page;
        this.EEUCBannerTitle = this.page.getByText('Contract on hold: Export End Use Certification (EEUC) for End User/ultimate');
        this.firstBannerMessage = this.page.getByText('Trimble cannot proceed with').first();
        this.EEUCBannerReviewTermsButton = this.page.getByRole('button', { name: 'Review Terms' }).first();
        this.EEUCPurchaserBannerTitle = this.page.getByText('Contract on hold: Export End Use Certification (EEUC) for purchaser has expired');
        this.secondBannerMessage = this.page.getByText('Trimble cannot proceed with').nth(1);
        this.EEUCPurchaserBannerReviewTermsButton = this.page.getByRole('button', { name: 'Review Terms' }).nth(1);
        this.EEUCIndividualFormHeader = this.page.getByText('INDIVIDUAL FORMExport End Use Certification (EEUC)Orders shipped to or billed');
        this.EEUCBackButton = this.page.getByRole('button', { name: 'Back' });
        this.EEUCCommodityValueInput = this.page.getByRole('textbox', { name: '7c. Commodity Value (USD) *' });
        this.EEUCAgreeRadio = this.page.getByRole('radio', { name: 'Agree', exact: true });
        this.EEUCYesIAcceptCheckbox = this.page.getByRole('checkbox', { name: 'Yes, I accept' });
        this.EEUCSubmitButton = this.page.getByRole('button', { name: 'Submit' });
        this.EEUCFormSubmittedText = this.page.getByText('EEUC Form Submitted');
        this.EEUCSubmittedForEndUserText = this.page.getByText('Export End Use Certification (EEUC) submitted for End User/Ultimate consignee');
        this.EEUCSubmittedForPurchaserText = this.page.getByText('Export End Use Certification (EEUC) submitted for purchaser');
        this.EEUCReleaseHoldMessage = this.page.getByText('Export End Use Certification (EEUC) submitted for End User/Ultimate consignee');
        this.EEUCPurchaserReleaseHoldMessage = this.page.getByText('Export End Use Certification (EEUC) submitted for purchaser');
        this.EEUCInfoIcon = this.page.getByText('info', { exact: true });
        this.EEUCIndividualFormParagraph = this.page.getByRole('paragraph').filter({ hasText: 'INDIVIDUAL FORM' });
        this.EEUCExportEndUseCertificationHeading = this.page.getByRole('heading', { name: 'Export End Use Certification' });
        this.EEUCPurchaserInformationParagraph = this.page.getByRole('paragraph').filter({ hasText: 'Purchaser Information' });
        this.EEUCEndUserConsigneeParagraph = this.page.getByRole('paragraph').filter({ hasText: 'End User/ Ultimate Consignee' });
        this.EEUCDispositionParagraph = this.page.getByRole('paragraph').filter({ hasText: /^Disposition or Use of Commodities$/ });
        this.EEUCAnnualFormParagraph = this.page.getByRole('paragraph').filter({ hasText: 'ANNUAL FORM' });
        this.cancelContractButton = this.page.getByRole('button', { name: 'Cancel Contract' });
        this.cancelContractDialogHeading = this.page.locator('div').filter({ hasText: /^Cancel Contract$/ }).first();
        this.cancelContractDialogMessage = this.page.locator('div').filter({ hasText: /^Are you sure you want to cancel the contract\?$/ }).first();
        this.cancelContractYesButton = this.page.getByRole('button', { name: 'Yes', exact: true });
        this.cancelContractNoButton = this.page.getByRole('button', { name: 'No', exact: true });
        this.cancelContractToast = this.page.locator('div').filter({ hasText: 'Contract has been cancelled' }).nth(3);
    }

    async verificationOfHoldBannerCopyForD_COUNTRY_HOLD_DEALER_AND_CUSTOMER() {
        await expect(this.EEUCBannerTitle).toBeVisible();
        await expect(this.EEUCBannerTitle).toContainText('Contract on hold: Export End Use Certification (EEUC) for End User/ultimate consignee has expired');
        await expect(this.firstBannerMessage).toBeVisible();
        await expect(this.firstBannerMessage).toContainText('Trimble cannot proceed with your order until your EEUC is submitted. Please review and accept the terms to release the hold.');

        await expect(this.EEUCPurchaserBannerTitle).toBeVisible();
        await expect(this.EEUCPurchaserBannerTitle).toContainText('Contract on hold: Export End Use Certification (EEUC) for purchaser has expired');
        await expect(this.secondBannerMessage).toBeVisible();
        await expect(this.secondBannerMessage).toContainText('Trimble cannot proceed with your order until your EEUC is submitted. Please review and accept the terms to release the hold.');
    }

    async verificationOfBannerMessagesForD_COUNTRY_HOLD_DEALER_AND_CUSTOMER() {
        await this.verificationOfHoldBannerCopyForD_COUNTRY_HOLD_DEALER_AND_CUSTOMER();
        await expect(this.EEUCBannerReviewTermsButton).toBeVisible();
        await expect(this.EEUCPurchaserBannerReviewTermsButton).toBeVisible();
    }

    async verificationOfBannerMessagesForD_COUNTRY_HOLD_DEALER() {
        await expect(this.EEUCPurchaserBannerTitle).toBeVisible();
        await expect(this.EEUCPurchaserBannerTitle).toContainText('Contract on hold: Export End Use Certification (EEUC) for purchaser has expired');
        await expect(this.firstBannerMessage).toBeVisible();
        await expect(this.firstBannerMessage).toContainText('Trimble cannot proceed with your order until your EEUC is submitted. Please review and accept the terms to release the hold.');
        await expect(this.EEUCBannerReviewTermsButton).toBeVisible();
    }

    async verificationOfBannerMessagesForD_COUNTRY_HOLD_CUSTOMER() {
        await expect(this.EEUCBannerTitle).toBeVisible();
        await expect(this.EEUCBannerTitle).toContainText('Contract on hold: Export End Use Certification (EEUC) for End User/ultimate consignee has expired');
        await expect(this.firstBannerMessage).toBeVisible();
        await expect(this.firstBannerMessage).toContainText('Trimble cannot proceed with your order until your EEUC is submitted. Please review and accept the terms to release the hold.');
        await expect(this.EEUCBannerReviewTermsButton).toBeVisible();
    }

    async verifyReviewTermsButtonsAreNotVisibleForTechnician() {
        await expect(this.EEUCBannerReviewTermsButton).not.toBeVisible();
        await expect(this.EEUCPurchaserBannerReviewTermsButton).not.toBeVisible();
    }

    async verificationOfIndividualForm() {
        await expect(this.EEUCIndividualFormHeader).toBeVisible();
        await expect(this.EEUCIndividualFormParagraph).toBeVisible();
        await expect(this.EEUCExportEndUseCertificationHeading).toBeVisible();
        await expect(this.EEUCPurchaserInformationParagraph).toBeVisible();
        await expect(this.EEUCEndUserConsigneeParagraph).toBeVisible();
        await expect(this.EEUCDispositionParagraph).toBeVisible();
    }

    async verificationOfAnnualForm() {
        await expect(this.EEUCAnnualFormParagraph).toBeVisible();
    }

    async acceptReviewTermsForEEUCEndUser() {
        await this.EEUCBannerReviewTermsButton.click();
        await expect(this.EEUCBackButton).toBeVisible();
        await this.EEUCCommodityValueInput.click();
        await this.EEUCCommodityValueInput.fill('788');
        await this.EEUCAgreeRadio.check();
        await this.EEUCYesIAcceptCheckbox.check();
        await this.EEUCSubmitButton.click();
        await expect(this.EEUCFormSubmittedText).toBeVisible();
        await expect(this.EEUCSubmittedForEndUserText).toBeVisible();
        await expect(this.EEUCInfoIcon).toBeVisible();
    }

    async acceptReviewTermsForEEUCForPurchaser() {
        await this.EEUCBannerReviewTermsButton.click();
        await expect(this.EEUCBackButton).toBeVisible();
        await this.EEUCCommodityValueInput.click();
        await this.EEUCCommodityValueInput.fill('788');
        await this.EEUCAgreeRadio.check();
        await this.EEUCYesIAcceptCheckbox.check();
        await this.EEUCSubmitButton.click();
        await expect(this.EEUCFormSubmittedText).toBeVisible();
        await expect(this.EEUCSubmittedForPurchaserText).toBeVisible();
    }

    async clickReviewTermsButton() {
        await this.EEUCBannerReviewTermsButton.click();
    }

    async clickBackButtonOnEEUCFormAndVerifyContractScreenIsShown() {
        //await this.EEUCBannerReviewTermsButton.click();
        await expect(this.EEUCBackButton).toBeVisible();
        //await this.verificationOfIndividualForm();
        await this.EEUCBackButton.click();
        await expect(this.firstBannerMessage).toBeVisible();
    }

    async verifyTrimbleWillReleaseTheHoldTextForPurchaser() {
        await expect(this.EEUCPurchaserReleaseHoldMessage).toBeVisible();
    }

    async verifyTrimbleWillReleaseTheHoldTextForEndUser() {
        await expect(this.EEUCReleaseHoldMessage).toBeVisible();
    }

    async verifyTrimbleWillReleaseTheHoldTextForPurchaserAndEndUser() {
        await expect(this.EEUCReleaseHoldMessage).toBeVisible();
        await expect(this.EEUCPurchaserReleaseHoldMessage).toBeVisible();
    }

    async cancelContract() {
        await this.cancelContractButton.click();
        await expect(this.cancelContractDialogHeading).toBeVisible();
        await expect(this.cancelContractDialogMessage).toBeVisible();
        await expect(this.cancelContractYesButton).toBeVisible();
        await expect(this.cancelContractNoButton).toBeVisible();
        await this.cancelContractYesButton.click();
        await expect(this.cancelContractToast).toBeVisible();
    }
}