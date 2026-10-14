import { test } from '../../fixture/testDataFixture';
import { expect } from '@playwright/test';
import type { CustomerUsersApi } from '../../api/customerUsers/customerUsersApi';
import { DeviceToast } from '../../pages/DevicePage';
import {
    smokeAccountMemberEmail,
    smokeCustomerAccountCdhId,
    smokeDealerAccountId,
    smokeIamAccountId,
    smokeSubscriptionSku,
    smokeUserAssignSubscriptionIds,
    smokeUserAssignSubscriptionIdsAll,
    smokeUserAssignSubscriptionPackage,
    smokeUserAssignUserIds,
} from '../../config/featureTestConfig';

test.describe('API/UI: User license assignment', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({
        storageState: '.auth/upgaccountuser.json',
        dealerAccountId: smokeDealerAccountId,
        iamAccountId: smokeIamAccountId,
        userLicenseRevokeCustomerAccountId: smokeCustomerAccountCdhId,
        userLicenseRevokeDealerAccountId: smokeDealerAccountId,
        userLicenseRevokeUserIds: smokeUserAssignUserIds,
    });

    async function assignThenRevokeUserSubscriptions(
        customerUsersApi: CustomerUsersApi,
        subscriptionIds: string[],
    ) {
        const assignResponse = await test.step('Assign subscription to user', async () =>
            customerUsersApi.assignSubscriptionsToUsers(
                smokeCustomerAccountCdhId,
                smokeDealerAccountId,
                subscriptionIds,
                smokeUserAssignUserIds,
            ),
        );

        await test.step('Validate assign-subscriptions-to-users response', async () => {
            customerUsersApi.expectValidAssignSubscriptionsToUsersResponse(
                assignResponse,
                smokeUserAssignUserIds,
                subscriptionIds,
            );
        });

        for (const userId of smokeUserAssignUserIds) {
            for (const subscriptionId of subscriptionIds) {
                const revokeResponse = await test.step(`Revoke user license (user=${userId}, subscription=${subscriptionId})`, async () =>
                    customerUsersApi.revokeUserLicense(
                        smokeCustomerAccountCdhId,
                        smokeDealerAccountId,
                        subscriptionId,
                        userId,
                    ),
                );

                await test.step(`Validate revoke-user-license response (user=${userId}, subscription=${subscriptionId})`, async () => {
                    customerUsersApi.expectValidRevokeUserLicenseResponse(revokeResponse, userId, subscriptionId);
                });
            }
        }
    }

    test('API: lists available user subscriptions', { tag: '@smoke' }, async ({ customerUsersApi }) => {
        const response = await test.step('Query available user subscriptions', async () =>
            customerUsersApi.getAvailableUserSubscriptions(smokeCustomerAccountCdhId, smokeDealerAccountId),
        );

        await test.step('Validate available-user-subscriptions response', async () => {
            customerUsersApi.expectValidAvailableUserSubscriptionsResponse(response, smokeUserAssignSubscriptionIdsAll);
        });
    });

    test.describe('first-three user subscriptions', () => {
        test.use({
            userLicenseRevokeSubscriptionIds: smokeUserAssignSubscriptionIds,
        });

        test('API:assigns then revokes standalone, bundle, and package-line user subscriptions', { tag: '@smoke' }, async ({ customerUsersApi, userLicenseAssignmentCleanup }) => {
            void userLicenseAssignmentCleanup;
            await assignThenRevokeUserSubscriptions(customerUsersApi, smokeUserAssignSubscriptionIds);
        });
    });

    test.describe('user package bundle', () => {
        test.use({
            userLicenseRevokeSubscriptionIds: smokeUserAssignSubscriptionPackage ? [smokeUserAssignSubscriptionPackage] : [],
        });

        test('API: assigns then revokes a user package bundle', { tag: '@smoke' }, async ({
            customerUsersApi,
            userLicenseAssignmentCleanup,
        }) => {
            void userLicenseAssignmentCleanup;
            await assignThenRevokeUserSubscriptions(customerUsersApi, [smokeUserAssignSubscriptionPackage]);
        });
    });

    test.describe('User license assignment from customer detail page', () => {
        test.describe.configure({ mode: 'serial' });
        test.use({
            storageState: '.auth/upgaccountuser.json',
            dealerAccountId: smokeDealerAccountId,
            iamAccountId: smokeIamAccountId,
            userLicenseRevokeCustomerAccountId: smokeCustomerAccountCdhId,
            userLicenseRevokeDealerAccountId: smokeDealerAccountId,
            userLicenseRevokeSubscriptionIds: [smokeUserAssignSubscriptionIds[0]],
            userLicenseRevokeUserIds: [smokeUserAssignUserIds[0]],
            userLicenseRevokeOnlyOnFailure: false,
        });
    
        test('Assigns a license to an account member from the customer detail page', { tag: ['@smoke', '@NZDEV-T727', '@NZDEV-T710', '@NZDEV-T723'] }, async ({
            page,
            customerAccountMembersPage,
            userLicenseAssignmentCleanup,
        }) => {
            void userLicenseAssignmentCleanup;
            const sku = smokeSubscriptionSku(smokeUserAssignSubscriptionIds[0]);
    
            await test.step('Open customer detail page', async () => {
                await page.goto(`/${smokeDealerAccountId}/customers/${smokeCustomerAccountCdhId}`);
            });
    
            const assignUserLicenseModal = await test.step('Open Assign a License modal for the account member', async () =>
                customerAccountMembersPage.openAssignLicenseModal(smokeAccountMemberEmail),
            );
    
            await test.step('Select the product and contract', async () => {
                await assignUserLicenseModal.selectProductAndContract(sku);
            });
    
            await test.step('View selection and assign the license', async () => {
                await assignUserLicenseModal.clickViewSelection();
                await assignUserLicenseModal.assignLicenses();
            });
    
            await test.step('Validate the account member shows an assigned subscription', async () => {
                await expect(customerAccountMembersPage.accountMemberSubscriptionStatus(smokeAccountMemberEmail)).not.toHaveText('None');
            });
        });
    
        test.describe('Revokes a license from an account member from the customer detail page', () => {
            // Revokes via UI, so let the fixture only revoke on teardown if the test failed.
            test.use({ userLicenseRevokeOnlyOnFailure: true });
    
            test('Revokes a license from an account member from the customer detail page', { tag: ['@smoke', '@NZDEV-T727', '@NZDEV-T710', '@NZDEV-T723'] }, async ({
                page,
                customerAccountMembersPage,
                userLicenseAssignmentCleanup,
                devicePage,
            }) => {
                void userLicenseAssignmentCleanup;
                const sku = smokeSubscriptionSku(smokeUserAssignSubscriptionIds[0]);
    
                await test.step('Open customer detail page', async () => {
                    await page.goto(`/${smokeDealerAccountId}/customers/${smokeCustomerAccountCdhId}`);
                });
    
                await test.step('Assign a license to the account member', async () => {
                    const assignUserLicenseModal = await customerAccountMembersPage.openAssignLicenseModal(smokeAccountMemberEmail);
                    await assignUserLicenseModal.selectProductAndContract(sku);
                    await assignUserLicenseModal.clickViewSelection();
                    await assignUserLicenseModal.assignLicenses();
                });
    
                await expect(customerAccountMembersPage.accountMemberSubscriptionStatus(smokeAccountMemberEmail)).not.toHaveText('None');
    
                const manageLicensesModal = await test.step('Open Manage Licenses modal for the account member', async () =>
                    customerAccountMembersPage.openManageLicensesModal(smokeAccountMemberEmail),
                );
    
                await test.step('Revoke the subscription', async () => {
                    await manageLicensesModal.revokeSubscription();
                });
    
                await test.step('Validate toast', async () => {
                    await devicePage.validateToast(DeviceToast.subscriptionRevoked);
                });
    
                await test.step('Validate the account member no longer shows an assigned subscription', async () => {
                    await expect(customerAccountMembersPage.accountMemberSubscriptionStatus(smokeAccountMemberEmail)).toHaveText('None');
                });
            });
        });
    });
});
