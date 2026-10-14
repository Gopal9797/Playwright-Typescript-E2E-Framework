import type { Locator, Page } from "@playwright/test";
import { CustomerSelectionPage } from "../CustomerSelectionPage";
import { CustomersPage } from "./CustomersPage";

// Create Customer can be involked from two pages - Customers List page and Create New Contract -> Customer Selection page
// We use this type to handle the dependency based on context as well as to perform cancel action
// Cancel from either pages should return to the appropriate parent page based on the context
export type CreateCustomerBasePage = CustomersPage | CustomerSelectionPage;

export async function cancelCreateCustomer(page: Page, cancelBtn: Locator): Promise<CreateCustomerBasePage> {
    const isFromCreateContract = new URL(page.url()).searchParams.get('source') === 'createContract';
    await cancelBtn.scrollIntoViewIfNeeded();
    await cancelBtn.click();
    return isFromCreateContract ? CustomerSelectionPage.init(page) : CustomersPage.init(page);
}
