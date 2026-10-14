import { expect, Locator, Page } from "@playwright/test";
import { CreateContractCustomerDetailsPage } from "../CreateContractCustomerDetailsPage";

export class CustomerDetailsPage {
    readonly page: Page;
    readonly customerNameLbl: Locator;
    readonly shipToAddress: Locator;
    readonly shipToContactName: Locator;
    readonly shipToContactEmail: Locator;
    readonly createNewContractButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Name sits in a MuiStack beside the organization modus-wc-badge.
        this.customerNameLbl = page
            .locator('.MuiStack-root')
            .filter({ has: page.locator('modus-wc-badge') })
            .first();
        this.shipToAddress = page.getByTestId('option-label-ship-to-address');
        this.shipToContactName = page.getByTestId('option-label-ship-to-contact');
        this.shipToContactEmail = page.getByTestId('option-subtitle-ship-to-contact');
        this.createNewContractButton = page.getByRole('button', { name: 'Create new contract' });
    }

    /** Customer name only — excludes the sibling organization badge text. */
    async getCustomerName(): Promise<string> {
        return this.customerNameLbl.evaluate((el) => {
            const heading = el.querySelector('h4, modus-wc-typography');
            if (heading?.textContent?.trim()) {
                return heading.textContent.trim();
            }
            const fromTextNodes = Array.from(el.childNodes)
                .filter((n) => n.nodeType === Node.TEXT_NODE)
                .map((n) => (n.textContent ?? '').trim())
                .filter(Boolean)
                .join(' ');
            if (fromTextNodes) {
                return fromTextNodes;
            }
            const clone = el.cloneNode(true) as HTMLElement;
            clone.querySelectorAll('modus-wc-badge').forEach((badge) => badge.remove());
            return (clone.textContent ?? '').trim();
        });
    }

    async assertCustomerName(customerName: string): Promise<void> {
        await expect(this.customerNameLbl).toBeVisible();
        await expect.poll(async () => this.getCustomerName()).toBe(customerName);
    }

    static async init(page: Page, customerName: string): Promise<CustomerDetailsPage> {
        const customerDetailsPage = new CustomerDetailsPage(page);
        await customerDetailsPage.assertCustomerName(customerName);
        return customerDetailsPage;
    }

    async CreateNewContract(): Promise<CreateContractCustomerDetailsPage> {
        await this.createNewContractButton.click();
        return new CreateContractCustomerDetailsPage(this.page);
    }
}
