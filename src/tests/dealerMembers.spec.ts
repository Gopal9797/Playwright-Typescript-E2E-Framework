import { expect } from '@playwright/test';
import { test } from '../../src/fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json';

test.describe('Dealer Members validations', () => {
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ page, homePage }) => {
        await page.goto('/');
        await homePage.accountSwitcherButton.click();
        await expect(homePage.dxpAutomationMenuItem).toBeVisible();
        await homePage.dxpAutomationMenuItem.click();
        await page.waitForURL(new RegExp(dealercustomers.dxpAutomation_cdhID), { timeout: 30000 });
        await expect(homePage.welcomeBackText).toBeVisible({ timeout: 30000 });
    });

    test('Verify dealer members list matches DealerUsers API response @DXP-T911 DXP-T912 DXP-T913 DXP-T914 DXP-T915 DXP-T916 DXP-T917 DXP-T918 DXP-T919 DXP-T920', async ({ dealerMembersPage }) => {
        const dealerUsers = await dealerMembersPage.navigateToDealerMembers();
        await dealerMembersPage.assertDealerMembersScreen(dealerUsers);
        await dealerMembersPage.searchAndVerifyEachMember(dealerUsers);
    });
});
