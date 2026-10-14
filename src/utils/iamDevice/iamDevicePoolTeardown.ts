import { expect } from '@playwright/test';
import { test as setup } from '../../fixture/TestFixture';
// import { deleteIamDevice } from './iamDeviceApi';
import { getIamDevicePoolPath, popAllAvailableDevicesFromPool, poolShardLabel } from './iamDevicePool';
import { smokeDealerAccountId } from '../../config/featureTestConfig';

setup.describe.configure({ mode: 'serial' });

setup('Feature: teardown IAM device pool — delete available devices', async ({}, testInfo) => {
    expect(smokeDealerAccountId, 'Pool teardown dealer id').toBeTruthy();

    const poolPath = getIamDevicePoolPath(smokeDealerAccountId, testInfo.config.shard);
    const devices = await popAllAvailableDevicesFromPool(poolPath);

    console.log(
        `[iamDevicePoolTeardown] shard=${poolShardLabel(testInfo.config.shard)} deleting ${devices.length} available device(s)`,
    );

    for (const device of devices) {
        console.log(`[iamDevicePoolTeardown] skipping delete for device id=${device.id} serial=${device.serialNumber}`);
        // Not able to delete IAM devices currently.
        // await deleteIamDevice(request, device.id);
    }

    console.log('[iamDevicePoolTeardown] finished');
});
