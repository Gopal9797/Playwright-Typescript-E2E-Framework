import { expect } from '@playwright/test';
import { test as base } from './testDataFixture';
import { HomePageNew } from '../pages/HomePageNew';

export const test = base.extend<{ dealerId: string }>({
	storageState: '.auth/upgaccountuser.json',
	customersPage: async ({ page }, use) => {
		await page.goto('/');
		const homePage = await HomePageNew.init(page);
		await homePage.SelectDealer('Frontier Precision');

		const customersPage = await homePage.SelectCustomersTab();
		await use(customersPage);
	},
	dealerId: async ({ customersPage }, use) => {
		const dealerId = new URL(customersPage.page.url()).pathname.split('/').filter(Boolean)[0];
		expect(dealerId, 'Expected dealer account ID in URL after selecting dealer').toBeTruthy();
		await use(dealerId);
	},
});

export { expect } from '@playwright/test';
