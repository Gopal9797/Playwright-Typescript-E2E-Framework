import { expect, Locator, Page } from "@playwright/test";
import { cancelCreateCustomer, type CreateCustomerBasePage } from "./CreateCustomerNavigation";
import { NotificationPopup } from "../common/NotificationPopup";
import { CustomerDetailsPage } from "./CustomerDetailsPage";

export class ReviewNewCustomerPage {
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly accuracyWarning: Locator;
    readonly ownerEmailTxt: Locator;
    readonly companyNameTxt: Locator;
    readonly languageTxt: Locator;
    readonly industryTxt: Locator;
    readonly optInChk: Locator;
    readonly organizationNameTxt: Locator;
    readonly organizationCityTxt: Locator;
    readonly organizationStateTxt: Locator;
    readonly organizationCountryTxt: Locator;
    readonly streetAddressTxt: Locator;
    readonly streetAddressLineTwoTxt: Locator;
    readonly cityTxt: Locator;
    readonly stateTxt: Locator;
    readonly zipCodeTxt: Locator;
    readonly countryTxt: Locator;
    readonly firstNameTxt: Locator;
    readonly lastNameTxt: Locator;
    readonly contactEmailTxt: Locator;
    readonly phoneNumberTxt: Locator;
    readonly backBtn: Locator;
    readonly cancelBtn: Locator;
    readonly createNewCustomerBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.getByRole('heading', { name: 'Review New Customer', exact: true });
        this.accuracyWarning = page.getByText(/Carefully check all customer information is accurate before creating the account/);
        // Modus TextInput hosts expose value on the host; the disabled inner <input> often does not.
        this.ownerEmailTxt = page.getByTestId('review-customer-email-tid');
        this.companyNameTxt = page.getByTestId('review-customer-company-name');
        this.languageTxt = page.getByTestId('review-customer-language');
        this.industryTxt = page.getByTestId('review-customer-industry');
        this.optInChk = page.getByRole('checkbox', { name: 'Send an Opt-In request', exact: true });
        this.organizationNameTxt = page.getByTestId('review-customer-organization-name');
        this.organizationCityTxt = page.getByTestId('review-customer-organization-city');
        this.organizationStateTxt = page.getByTestId('review-customer-organization-state');
        this.organizationCountryTxt = page.getByTestId('review-customer-organization-country');
        this.streetAddressTxt = page.getByTestId('review-customer-street-address');
        this.streetAddressLineTwoTxt = page.getByTestId('review-customer-street-address-2');
        this.cityTxt = page.getByTestId('review-customer-city');
        this.stateTxt = page.getByTestId('review-customer-state');
        this.zipCodeTxt = page.getByTestId('review-customer-zip');
        this.countryTxt = page.getByTestId('review-customer-country');
        this.firstNameTxt = page.getByTestId('review-customer-contact-first-name');
        this.lastNameTxt = page.getByTestId('review-customer-contact-last-name');
        this.contactEmailTxt = page.getByTestId('review-customer-contact-email');
        this.phoneNumberTxt = page.getByTestId('review-customer-contact-phone-number');
        this.backBtn = page.getByTestId('back-create-customer-review-button').getByRole('button', { name: 'Back', exact: true });
        this.cancelBtn = page.getByTestId('cancel-create-customer-review-button').getByRole('button', { name: 'Cancel', exact: true });
        this.createNewCustomerBtn = page.getByTestId('next-create-customer-review-button')
            .getByRole('button', { name: 'Create New Customer', exact: true });
    }

    static async init(page: Page): Promise<ReviewNewCustomerPage> {
        const reviewPage = new ReviewNewCustomerPage(page);
        await expect(reviewPage.pageHeader).toBeVisible();
        return reviewPage;
    }

    async assertBasicFields(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.accuracyWarning).toBeVisible();
        for (const field of [
            this.ownerEmailTxt, this.companyNameTxt, this.languageTxt, this.industryTxt,
            this.organizationNameTxt, this.organizationCityTxt, this.organizationStateTxt,
            this.organizationCountryTxt, this.streetAddressTxt, this.streetAddressLineTwoTxt,
            this.cityTxt, this.stateTxt, this.zipCodeTxt, this.countryTxt,
            this.firstNameTxt, this.lastNameTxt, this.contactEmailTxt, this.phoneNumberTxt,
        ]) {
            await expect(field).toBeVisible();
            await expect(field.locator('input')).toBeDisabled();
        }
        await expect(this.optInChk).toBeVisible();
        await expect(this.optInChk).toBeDisabled();
        await expect(this.backBtn).toBeVisible();
        await expect(this.cancelBtn).toBeVisible();
        await expect(this.createNewCustomerBtn).toBeVisible();
    }

    // TODO: Return to contract customer confirmation when creation originates from Create Contract.
    async CreateNewCustomer(companyName: string): Promise<CustomerDetailsPage> {
        await this.createNewCustomerBtn.scrollIntoViewIfNeeded();
        const notificationPopup = new NotificationPopup(this.page);

        await Promise.all([
            notificationPopup.assertMessage('Customer created successfully'),
            this.createNewCustomerBtn.click(),
        ]);
        return CustomerDetailsPage.init(this.page, companyName);
    }

    async Cancel(): Promise<CreateCustomerBasePage> {
        return cancelCreateCustomer(this.page, this.cancelBtn);
    }
}
