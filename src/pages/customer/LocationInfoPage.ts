import { expect, Locator, Page } from "@playwright/test";
import { cancelCreateCustomer, type CreateCustomerBasePage } from "./CreateCustomerNavigation";
import { ShipToContactInfoPage } from "./ShipToContactInfoPage";
import { AddressMatchModal } from "../modals/AddressMatchModal";
import { AddressSearch } from "../../ui-components/AddressSearch";

export class LocationInfoPage {
    readonly page: Page;
    readonly pageHeader: Locator;
    readonly locationInfoHeader: Locator;
    readonly countryCmb: Locator;
    readonly streetAddressSearch: AddressSearch;
    readonly streetAddressTxt: Locator;
    readonly streetAddressLineTwoTxt: Locator;
    readonly cityTxt: Locator;
    readonly stateCmb: Locator;
    readonly zipCodeTxt: Locator;
    readonly backBtn: Locator;
    readonly cancelBtn: Locator;
    readonly nextBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator('h2', { hasText: /^Create New Customer$/ });
        this.locationInfoHeader = page.getByRole('heading', { name: 'Location Information', exact: true });
        this.countryCmb = page.getByTestId('address-country-select').getByRole('combobox');
        this.streetAddressSearch = new AddressSearch(page, page.getByTestId('address-street-address-input'));
        this.streetAddressTxt = this.streetAddressSearch.Input;
        this.streetAddressLineTwoTxt = page.getByTestId('address-street-address-two-input').getByRole('textbox');
        this.cityTxt = page.getByTestId('address-city-input').getByRole('textbox');
        this.stateCmb = page.getByTestId('address-state-select').getByRole('combobox');
        this.zipCodeTxt = page.getByTestId('address-zip-input').getByRole('textbox');
        this.backBtn = page
            .getByTestId('back-create-customer-location-information-button')
            .getByRole('button', { name: 'Back', exact: true });
        this.cancelBtn = page
            .getByTestId('cancel-create-customer-location-information-button')
            .getByRole('button', { name: 'Cancel', exact: true });
        this.nextBtn = page
            .getByTestId('next-create-customer-location-information-button')
            .getByRole('button', { name: /^Next: / });
    }

    static async init(page: Page): Promise<LocationInfoPage> {
        const locationInfoPage = new LocationInfoPage(page);
        await expect(locationInfoPage.locationInfoHeader).toBeVisible();
        return locationInfoPage;
    }

    async assertBasicFields(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.locationInfoHeader).toBeVisible();
        await expect(this.countryCmb).toBeVisible();
        await expect(this.streetAddressTxt).toBeVisible();
        await expect(this.streetAddressLineTwoTxt).toBeVisible();
        await expect(this.cityTxt).toBeVisible();
        await expect(this.stateCmb).toBeVisible();
        await expect(this.zipCodeTxt).toBeVisible();
        await expect(this.backBtn).toBeVisible();
        await expect(this.cancelBtn).toBeVisible();
        await expect(this.nextBtn).toBeVisible();
    }

    async Cancel(): Promise<CreateCustomerBasePage> {
        return cancelCreateCustomer(this.page, this.cancelBtn);
    }

    async EnterLocationInformation(country: string, streetAddress: string, city: string, region: string, zipCode: string): Promise<void> {
        await this.countryCmb.selectOption({ label: country });
        await this.streetAddressSearch.Search(`${streetAddress}`);
        await this.cityTxt.fill(city);
        await this.stateCmb.selectOption({ label: region });
        await this.zipCodeTxt.fill(zipCode);
    }

    async NextShipToContactInfo(): Promise<ShipToContactInfoPage> {
        await this.Next();
        return ShipToContactInfoPage.init(this.page);
    }

    async NextAddressMatch() : Promise<AddressMatchModal> {
        await this.Next();
        return AddressMatchModal.init(this.page);
    }

    async Next(){
        await this.nextBtn.scrollIntoViewIfNeeded();
        await expect(this.nextBtn).toBeEnabled();
        await this.nextBtn.click();
    }
}
