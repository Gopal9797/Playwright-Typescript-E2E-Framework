import { expect, FrameLocator, Locator, Page } from "@playwright/test";
import { Utilities } from "../utils/browserUtilities";
export class SidesheetPage {
    readonly page: Page;
    private util: Utilities;
    readonly contractIDInSidesheet: Locator;
    readonly statusSidesheet: Locator;
    readonly maximizeButton: Locator;
    readonly closeButton: Locator;
    readonly dealerNameText: Locator;
    readonly customerNameText: Locator;
    readonly CreatedByText: Locator;
    readonly POReferenceNumberTextBox: Locator;
    readonly POReferenceNumberText: Locator;
    readonly termsExpandButton: Locator;
    readonly customerExpandButton: Locator;
    readonly dealerExpandButton: Locator;
    readonly productExpandButton: Locator;
    readonly termLengthText: Locator;
    readonly startDateText: Locator;
    readonly autoRenewalEnabledText: Locator;
    readonly autoRenewalDisabledText: Locator;
    readonly shipToAddressText: Locator;
    readonly customerAccountNameText: Locator;
    readonly customerAdminNameText: Locator;
    readonly customerAdminEmailText: Locator;
    readonly dealerAccountNameText: Locator;
    readonly dealerNameBilledToText: Locator;
    readonly dealerEmailText: Locator;
    readonly billToAddressText: Locator;
    readonly productsPriceText: Locator;
    readonly productNameText: Locator;
    readonly productSKUText: Locator;
    readonly productQuantityText: Locator;
    readonly KPIText: Locator;
    readonly estimatedTaxText: Locator;
    readonly totalNetPrice: Locator;
    readonly viewSummaryButton: Locator;
    readonly discardDraftButton: Locator;
    readonly deleteButton: Locator;
    readonly contractDraftDiscardedText: Locator;
    readonly closeButtonInDraft: Locator;
    readonly acceptButton: Locator;
    readonly deleteDraftWarningText: Locator;
    readonly EscKeyPressText: Locator;
    readonly contractsIframeContent: FrameLocator; // Added for the iframe
    readonly draftExpiredText: Locator;
    readonly draftExpiredDateText: Locator;


    constructor(page: Page) {
        this.page = page;
        this.util = new Utilities(page);
        this.contractsIframeContent = page.locator('iframe[srcdoc*="Contracts - Dealer Experience"]').contentFrame();
        this.contractIDInSidesheet = page.locator('xpath=//h5').first();
        this.viewSummaryButton = this.page.getByRole('link', { name: 'View Summary' })
        this.discardDraftButton = this.page.getByText('Discard Draft', { exact: true });
        this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
        this.maximizeButton = page.locator('xpath=//a[@class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-mfslm7"]');
        this.closeButton = page.locator('xpath=//button[@class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-mfslm7"]').last();
        this.statusSidesheet = this.contractsIframeContent.locator('xpath=//div[@class="frame-content"]//descendant::span[@class="MuiChip-label MuiChip-labelMedium css-qbwvub"]');
        this.dealerAccountNameText = this.contractsIframeContent.locator('xpath=//span[contains(text(),"Dealer")]//following-sibling::p').last();
        this.customerAccountNameText = this.contractsIframeContent.locator('xpath=//span[contains(text(),"Customer")]//following-sibling::p').last();
        this.dealerNameText = this.contractsIframeContent.locator('p[aria-labelledby="header-card-dealer"]');
        this.customerNameText = this.contractsIframeContent.locator('p[aria-labelledby="header-card-customer"]');
        this.CreatedByText = this.contractsIframeContent.locator('p[aria-labelledby="header-card-created-by"]');
        this.POReferenceNumberText = this.contractsIframeContent.locator('[aria-labelledby="header-card-reference-number"]');
        this.POReferenceNumberTextBox = this.contractsIframeContent.locator('input[type="text"][maxlength="255"]');
        this.termLengthText = this.contractsIframeContent.locator('p[aria-labelledby="term-length"]');
        this.startDateText = this.contractsIframeContent.locator('p[aria-labelledby="start-date"]');
        this.autoRenewalEnabledText = this.contractsIframeContent.getByText('Auto Renewal Enabled', { exact: true });
        this.autoRenewalDisabledText = this.contractsIframeContent.getByText('Auto Renewal Disabled', { exact: true });
        this.shipToAddressText = this.contractsIframeContent.locator('p[aria-labelledby="ship-to"]');
        this.customerAdminNameText = this.contractsIframeContent.locator('[aria-labelledby="customer-admin"]').first();
        this.customerAdminEmailText = this.contractsIframeContent.locator('[aria-labelledby="customer-admin"]').last();
        this.dealerNameBilledToText = this.contractsIframeContent.locator('xpath=//div[@aria-labelledby="bill-to"]/div[1]/p').first();
        this.dealerEmailText = this.contractsIframeContent.locator('xpath=//div[@aria-labelledby="bill-to"]/div[1]/p').last();
        this.billToAddressText = this.contractsIframeContent.locator('xpath=//div[@aria-labelledby="bill-to"]/div[2]');
        this.productsPriceText = this.contractsIframeContent.locator('xpath=//div[@data-field="listColumn"]//descendant::p[contains(text(),"Net Price")]');
        this.productNameText = this.contractsIframeContent.locator('xpath=//div[@data-field="listColumn"]//descendant::p[position() mod 3 = 1]');
        this.productSKUText = this.contractsIframeContent.locator('xpath=//div[@data-field="listColumn"]//descendant::span');
        this.productQuantityText = this.contractsIframeContent.locator('xpath=//div[@data-field="listColumn"]//descendant::p[contains(text(),"Quantity")]');
        this.KPIText = this.contractsIframeContent.locator('td[aria-labelledby="discount-kpi"]');
        this.estimatedTaxText = this.contractsIframeContent.locator('td[aria-labelledby="estimated-tax"]');
        this.totalNetPrice = this.contractsIframeContent.locator('td[aria-labelledby="total-net-price"]');
        this.contractDraftDiscardedText = page.getByText('Draft discarded', { exact: true });
        this.closeButtonInDraft = page.getByRole('button', { name: 'Close' });
        this.acceptButton = page.getByRole('button', { name: 'Accept' });
        this.deleteDraftWarningText = page.getByText('Are you sure that you want to delete?', { exact: true });
        this.EscKeyPressText = page.getByText('Press ESC key or click the button below to close', { exact: true });
        this.dealerExpandButton = this.contractsIframeContent.getByRole('button', { name: 'Dealer' })
        this.customerExpandButton = this.contractsIframeContent.getByRole('button', { name: 'Customer' });
        this.termsExpandButton = this.contractsIframeContent.getByRole('button', { name: 'Terms' });
        this.productExpandButton = this.contractsIframeContent.getByRole('button', { name: 'Product' });
        this.draftExpiredText = this.contractsIframeContent.getByText('Since it is expired, you only have view access.');
        this.draftExpiredDateText = this.contractsIframeContent.getByText('Expired ').last();

    }

    async dealerInformation() {
        await this.dealerExpandButton.waitFor({ state: 'visible', timeout: 30000 });

        if (await this.dealerExpandButton.getAttribute('aria-expanded') === 'false') {
            await this.dealerExpandButton.click();
            console.log('Dealer expand button inside iframe clicked successfully.');
        } else {
            console.log('Dealer expand button inside iframe is already expanded (aria-expanded is not false).');
        }

        await expect(this.dealerAccountNameText).toBeVisible();
        await expect(this.dealerNameBilledToText).toBeVisible();
        await expect(this.dealerEmailText).toBeVisible();
        await expect(this.billToAddressText).toBeVisible();
        return {
            dealerAccountName: await this.dealerAccountNameText.textContent(),
            dealerName: await this.dealerNameBilledToText.textContent(),
            dealerEmail: await this.dealerEmailText.textContent(),
            billToAddress: await this.billToAddressText.textContent()
        };
    }

    async customerInformation() {
        await this.customerExpandButton.waitFor({ state: 'visible', timeout: 30000 });
        if (await this.customerExpandButton.getAttribute('aria-expanded') === 'false') {
            await this.customerExpandButton.click();
        }
        await expect(this.customerAccountNameText).toBeVisible();
        await expect(this.customerAdminNameText).toBeVisible();
        await expect(this.customerAdminEmailText).toBeVisible();
        await expect(this.shipToAddressText).toBeVisible();
        return {
            customerAccountName: await this.customerAccountNameText.textContent(),
            customerAdminName: await this.customerAdminNameText.textContent(),
            customerAdminEmail: await this.customerAdminEmailText.textContent(),
            shipToAddress: await this.shipToAddressText.textContent()
        };
    }
    async termsInformation() {
        await this.termsExpandButton.waitFor({ state: 'visible', timeout: 30000 });
        if (await this.termsExpandButton.getAttribute('aria-expanded') === 'false') {
            await this.termsExpandButton.click();
        }
        await expect(this.termLengthText).toBeVisible();
        await expect(this.startDateText).toBeVisible();
        if (await this.autoRenewalEnabledText.isVisible()) {
            await expect(this.autoRenewalEnabledText).toBeVisible();
        } else {
            await expect(this.autoRenewalDisabledText).toBeVisible();
        }
        return {
            termLength: await this.termLengthText.textContent(),
            startDate: await this.startDateText.textContent(),
            autoRenewal: await this.autoRenewalEnabledText.isVisible() ? true : false
        };
    }
    async productInformation() {
        await this.productExpandButton.waitFor({ state: 'visible', timeout: 30000 });

        if (await this.productExpandButton.getAttribute('aria-expanded') === 'false') {
            await this.productExpandButton.click();
        }
        await expect(this.productNameText.first()).toBeVisible();
        await expect(this.productSKUText.first()).toBeVisible();
        await expect(this.productQuantityText.first()).toBeVisible();
        await expect(this.productsPriceText.first()).toBeVisible();
        await expect(this.KPIText).toBeVisible();
        await expect(this.estimatedTaxText).toBeVisible();
        await expect(this.totalNetPrice).toBeVisible();
        console.log('ProductNames: ' + await this.productNameText.allTextContents());
        return {
            productName: await this.productNameText.allTextContents(),
            productSKU: await this.productSKUText.allTextContents(),
            productQuantity: await this.productQuantityText.allTextContents(),
            productsPrice: await this.productsPriceText.allTextContents(),
            KPI: await this.KPIText.textContent() ?? '',
            estimatedTax: await this.estimatedTaxText.textContent(),
            totalNetPrice: await this.totalNetPrice.textContent()
        };
    }
    async contractInformation() {
        await expect(this.contractIDInSidesheet).toBeVisible();
        await expect(this.statusSidesheet).toBeVisible();
        await expect(this.dealerNameText).toBeVisible();
        await expect(this.customerNameText).toBeVisible();
        await expect(this.CreatedByText).toBeVisible();
        // await expect(this.POReferenceNumberText).toBeVisible();
        console.log('Contract ID: ' + await this.contractIDInSidesheet.textContent());
        return {
            contractID: await this.contractIDInSidesheet.textContent(),
            status: await this.statusSidesheet.textContent(),
            dealerName: await this.dealerNameText.textContent(),
            customerName: await this.customerNameText.textContent(),
            createdBy: await this.CreatedByText.textContent(),
            poReferenceNumber: await this.POReferenceNumberText.textContent() ?? ''
        };
    }

    async maximizeSidesheet() {
        await expect(this.maximizeButton).toBeVisible();
        await this.maximizeButton.click();
    }

    async closeSidesheet() {
        await expect(this.closeButton).toBeVisible();
        await this.closeButton.click();
    }

    async clickOutsideSidesheet() {
        const body = this.page.locator('body');
        await body.click({ position: { x: 10, y: 10 } });
        await this.page.waitForTimeout(1000); // Wait for the click to be processed
    }

    async viewSummaryScreen() {
        await expect(this.viewSummaryButton).toBeVisible();
        await this.viewSummaryButton.click();
    }

    async discardDraftFunctionalityInSideSheet() {
        await expect(this.discardDraftButton).toBeEnabled();
        await this.discardDraftButton.click();
        await expect(this.deleteDraftWarningText).toBeVisible();
        await expect(this.EscKeyPressText).toBeVisible();
        await this.closeButtonInDraft.click();
        await expect(this.deleteDraftWarningText).not.toBeVisible();
        await this.discardDraftButton.click();
        await this.page.keyboard.press('Escape');
        await expect(this.EscKeyPressText).not.toBeVisible();
        await this.discardDraftButton.click();
        await this.acceptButton.click();
        await expect(this.contractDraftDiscardedText).toBeVisible();
    }

    async fillPOReferenceNumber(poNumber: string) {
        const randomNumber = await this.util.generateRandomNumber(100, 999);
        console.log(`Generated random number: ${randomNumber}`);
        await this.POReferenceNumberTextBox.fill(poNumber + randomNumber.toString());
        await expect(this.POReferenceNumberTextBox).toHaveValue(poNumber + randomNumber.toString());
        await this.totalNetPrice.click();
        await this.page.waitForTimeout(1000); // Wait for the value to be saved
        return poNumber + randomNumber.toString();
    }

    async expiredMessageValidation() {
        await expect(this.draftExpiredText).toBeVisible();
        await expect(this.draftExpiredDateText).toBeVisible();
        await expect(this.draftExpiredText).toContainText('Since it is expired, you only have view access. ');
        return {
            expiredDateText: await this.draftExpiredDateText.textContent(),
            expiredMessageText: await this.draftExpiredText.textContent()
        }
    }
}