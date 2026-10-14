import { test } from '../../fixture/testDataFixture';
import { PN_133611 } from '../../utils/iamDevice/iamDevicePool';
import { smokeCustomerAccountCdhId, smokeDealerAccountId, smokeIamAccountId } from '../../config/featureTestConfig';

test.use({
    storageState: '.auth/upgaccountuser.json',
    dealerAccountId: smokeDealerAccountId,
    iamAccountId: smokeIamAccountId,
});

test.describe('Devices', () => {
    test('lists dealer devices', { tag: '@smoke' }, async ({ devicesApi }) => {
        const response = await test.step('Query dealer devices (DevicesV2)', async () =>
            devicesApi.getDealerDevices(smokeDealerAccountId),
        );

        await test.step('Validate devices list response', async () => {
            devicesApi.expectValidDealerDevicesResponse(response);
        });

        await test.step('Validate superkey fields on each device', async () => {
            for (const device of response.dealerDevicesV2.nodes) {
                devicesApi.expectValidSuperKeyFields(device);
            }
        });
    });
});
test.describe('Transfer device', () => {
    test('transfers a device to a customer (part 133611)', { tag: ['@smoke', PN_133611] }, async ({ devicesApi, createdDeviceRetained }) => {
        const response = await test.step('Transfer device to customer account', async () =>
            devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceRetained.id]),
        );

        await test.step('Validate transfer response', async () => {
            devicesApi.expectValidTransferDeviceResponse(response, createdDeviceRetained.id, smokeCustomerAccountCdhId);
        });
    });
});
