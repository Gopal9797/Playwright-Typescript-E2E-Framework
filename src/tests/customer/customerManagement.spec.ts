import { test } from '../../fixture/testDataFixture';
import { smokeCustomerAccountCdhId, smokeDealerAccountId, smokeIamAccountId } from '../../config/featureTestConfig';

test.use({
    storageState: '.auth/upgaccountuser.json',
    dealerAccountId: smokeDealerAccountId,
    iamAccountId: smokeIamAccountId,
});

test.describe('Customers', () => {
    test('lists dealer customers', { tag: '@smoke' }, async ({ customerApi }) => {
        const response = await test.step('Query dealer customers', async () => customerApi.getDealerCustomers(smokeDealerAccountId));

        await test.step('Validate dealer customers response', async () => {
            customerApi.expectValidDealerCustomersResponse(response);
        });
    });
});

test.describe('Link VW customer', () => {
    test.skip('links an existing VW customer', { tag: '@smoke' }, async ({ customerApi }) => {
        const response = await test.step('Call linkExistingVwCustomer mutation', async () =>
            customerApi.linkExistingVwCustomer(smokeDealerAccountId, smokeCustomerAccountCdhId),
        );

        await test.step('Validate linkExistingVwCustomer response', async () => {
            customerApi.expectLinkExistingVwCustomerSucceeded(response);
        });
    });
});
