import { test } from '../../fixture/testDataFixture';
import { type Page } from '@playwright/test';
import { DeviceToast, type DevicePage } from '../../pages/DevicePage';
import type { HomePage } from '../../pages/HomePage';
import { PN_133611, PN_199020_01, PN_90915_00 } from '../../utils/iamDevice/iamDevicePool';
import { openManageDeviceModal } from '../featureTestHelpers';
import {
    smokeAssignSubscriptionCore,
    smokeCustomerAccountCdhId,
    smokeCustomerName,
    smokeContractId,
    smokeDealerAccountId,
    smokeIamAccountId,
    smokeSubscriptionSku,
} from '../../config/featureTestConfig';

test.use({
    storageState: '.auth/upgaccountuser.json',
    dealerAccountId: smokeDealerAccountId,
    iamAccountId: smokeIamAccountId,
});

test.describe('Superkey', () => {
    const superkeySkus = [
        {
            id: 'BS-SB-T4D-CORE',
            type: 'DEVICE',
        },
    ];
    const superkeySkus90915 = [
        {
            id: 'BNDT-R980-BRO-T-01',
            type: 'DEVICE',
        },
    ];
    const conflictingBundleSuperkeySkus = [
        {
            id: 'BNDT-R580-CFG-4103T',
            type: 'DEVICE',
        },
    ];
    const conflictingBundleItemSku = 'BNDT-R580-CFG-4110T';
    const addSuperkeySkuPayload = [
        {
            id: 'BS-CAT-SM',
            type: 'DEVICE',
        },
    ];

    test.use({
        superkeyRevokeSkus: superkeySkus,
    });

    async function openDeviceActions(
        page: Page,
        homePage: HomePage,
        devicePage: DevicePage,
        serialNumber: string,
    ) {
        await page.goto(`/${smokeDealerAccountId}`);
        await homePage.navigateToDevicesPage();
        await devicePage.searchForDevice(serialNumber);
        await devicePage.validateDeviceRowVisible(serialNumber);
        await devicePage.manageDevice(serialNumber);
    }

    async function assignSuperkeyFromDevicesPage(
        page: Page,
        homePage: HomePage,
        devicePage: DevicePage,
        serialNumber: string,
        sku: string,
    ) {
        await test.step('Assign superkey from devices page', async () => {
            await openDeviceActions(page, homePage, devicePage, serialNumber);
            await devicePage.clickOnAssignSuperkey();
            await devicePage.selectSuperkeySku(sku);
            await devicePage.confirmAssignSuperkey();
            await devicePage.validateToast('Superkey assigned!');
            await devicePage.validateDeviceRowShowsSuperkey(serialNumber);
        });

        await test.step('Validate assigned superkey SKU is visible', async () => {
            await devicePage.manageDevice(serialNumber);
            await devicePage.validateDeviceActionMenu();
            await devicePage.validateSuperkeySkuAssigned(sku);
        });
    }

    test.describe('API', () => {
        test('API: create a standalone Superkey (part 133611)', { tag: ['@smoke', '@NZDEV-T949', PN_133611] }, async ({
            devicesApi,
            createdDeviceSuperkeyCleanup,
        }) => {
            const response = await test.step('Create superkey', async () =>
                devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
            );

            await test.step('Validate create-superkey response', async () => {
                devicesApi.expectValidCreateSuperKeyResponse(response);
            });
        });

        test.describe('part 90915-00', () => {
            test.use({
                superkeyRevokeSkus: superkeySkus90915,
            });

            test('API: creates a bundle superkey (part 90915-00)', { tag: ['@smoke', '@NZDEV-T950', PN_90915_00] }, async ({
                devicesApi,
                createdDeviceSuperkeyCleanup,
            }) => {
                const response = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus90915, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(response);
                });
            });
        });

        test('API: Verify assigning a duplicate or same-family Superkey SKU is prevented when creating superkey or add existing super key (part 133611)', { tag: ['@smoke', '@NZDEV-T930', PN_133611] }, async ({
            devicesApi,
            createdDeviceSuperkeyCleanup,
        }) => {
            const response = await test.step('Create superkey', async () =>
                devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
            );

            await test.step('Validate create-superkey response', async () => {
                devicesApi.expectValidCreateSuperKeyResponse(response);
            });

            const duplicateResponse = await test.step('Create duplicate superkey', async () =>
                devicesApi.createSuperKeyAllowingErrors(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
            );

            await test.step('Validate duplicate create-superkey is rejected', async () => {
                devicesApi.expectCreateSuperKeyRejectedBecauseActiveSuperkey(duplicateResponse.errors);
            });

            const addSkusDuplicateResponse = await test.step('Add SKUs to superkey', async () =>
                devicesApi.addSkusToSuperkeyAllowingErrors(
                    createdDeviceSuperkeyCleanup.id,
                    addSuperkeySkuPayload,
                    smokeDealerAccountId,
                ),
            );

            await test.step('Validate add-SKUs-to-superkey is rejected for same product family', async () => {
                devicesApi.expectAddSkusToSuperkeyRejectedBecauseSameProductFamily(
                    addSkusDuplicateResponse.errors,
                    addSuperkeySkuPayload[0].id,
                    superkeySkus[0].id,
                );
            });
        });

        test.describe('API: creates then revokes a standalone superkey (part 133611)', () => {
            test.use({
                superkeyRevokeOnlyOnFailure: true,
            });

            test('API: creates then revokes a standalone superkey (part 133611)', { tag: ['@smoke', '@NZDEV-T951', PN_133611] }, async ({ devicesApi, createdDeviceSuperkeyCleanup }) => {
                const createResponse = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(createResponse);
                });

                const revokeResponse = await test.step('Revoke superkey', async () =>
                    devicesApi.revokeSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate revoke-superkey response', async () => {
                    devicesApi.expectValidRevokeSuperKeyResponse(revokeResponse);
                });
            });
        });

        // Skip: add-SKU setup is not correct yet.
        test.skip('creates a superkey then adds a SKU (part 133611)', { tag: ['@smoke', '@NZDEV-T952', PN_133611] }, async ({ devicesApi, createdDevice }) => {
            const createResponse = await test.step('Create superkey', async () =>
                devicesApi.createSuperKey(createdDevice.id, superkeySkus, smokeDealerAccountId),
            );

            await test.step('Validate create-superkey response', async () => {
                devicesApi.expectValidCreateSuperKeyResponse(createResponse);
            });

            const addSkusResponse = await test.step('Add SKUs to superkey', async () =>
                devicesApi.addSkusToSuperkey(createdDevice.id, addSuperkeySkuPayload, smokeDealerAccountId),
            );

            await test.step('Validate add-SKUs-to-superkey response', async () => {
                devicesApi.expectValidAddSkusToSuperkeyResponse(addSkusResponse, addSuperkeySkuPayload);
            });
        });

    });

    test.describe('Audit logs', () => {
        test('Verify that the system records the Superkey requestor, Superkey, and request time for assign super key event (part 133611)', { tag: ['@smoke', '@NZDEV-T947', PN_133611] }, async ({
            devicesApi,
            createdDeviceSuperkeyCleanup,
            auditLogPage,
        }) => {
            const response = await test.step('Create superkey', async () =>
                devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
            );

            await test.step('Validate create-superkey response', async () => {
                devicesApi.expectValidCreateSuperKeyResponse(response);
            });

            await test.step('Verify Superkey Created audit log entry', async () => {
                await auditLogPage.gotoAuditLogs(smokeDealerAccountId, 30000);
                await auditLogPage.verifySuperkeyAuditLog(
                    createdDeviceSuperkeyCleanup.serialNumber,
                    superkeySkus[0].id,
                    'Superkey Created',
                    30000,
                );
            });
        });

        test.describe('Superkey revoke audit logs', () => {
            test.use({
                superkeyRevokeOnlyOnFailure: true,
            });

            test('Verify that the system records the Superkey requestor, Superkey, and request time for revoke super key event (part 133611)', { tag: ['@smoke', '@NZDEV-T948', PN_133611] }, async ({
                devicesApi,
                createdDeviceSuperkeyCleanup,
                auditLogPage,
            }) => {
                const createResponse = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(createResponse);
                });

                const revokeResponse = await test.step('Revoke superkey', async () =>
                    devicesApi.revokeSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate revoke-superkey response', async () => {
                    devicesApi.expectValidRevokeSuperKeyResponse(revokeResponse);
                });

                await test.step('Verify Superkey SKUs Revoked audit log entry', async () => {
                    await auditLogPage.gotoAuditLogs(smokeDealerAccountId, 30000);
                    await auditLogPage.verifySuperkeyAuditLog(
                        createdDeviceSuperkeyCleanup.serialNumber,
                        superkeySkus[0].id,
                        'Superkey SKUs Revoked',
                        30000,
                    );
                });
            });
        });
    });

    test.describe('Devices page assignment', () => {
        test('Verify a standalone Superkey can be assigned to a device and a success toast is displayed (part 133611)', { tag: ['@smoke', '@NZDEV-T917', '@NZDEV-T925', '@NZDEV-T933', PN_133611] }, async ({
            createdDeviceSuperkeyCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            await assignSuperkeyFromDevicesPage(
                page,
                homePage,
                devicePage,
                createdDeviceSuperkeyCleanup.serialNumber,
                superkeySkus[0].id,
            );
        });

        test.describe('part 90915-00', () => {
            test.use({
                superkeyRevokeSkus: superkeySkus90915,
            });

            test('Verify a bundle Superkey can be assigned to a device and a success toast is displayed (part 90915-00)', { tag: ['@smoke', '@NZDEV-T926', PN_90915_00] }, async ({
                createdDeviceSuperkeyCleanup,
                devicePage,
                page,
                homePage,
            }) => {
                await assignSuperkeyFromDevicesPage(
                    page,
                    homePage,
                    devicePage,
                    createdDeviceSuperkeyCleanup.serialNumber,
                    superkeySkus90915[0].id,
                );
            });
        });
    });

    test.describe('Manage device', () => {
        test('Verify assigning one Superkey SKU decreases the remaining allowance by one(part 133611)', { tag: ['@smoke', '@NZDEV-T927', '@NZDEV-T931', '@NZDEV-T934', PN_133611] }, async ({
            devicesApi,
            createdDeviceSuperkeyCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            const response = await test.step('Create superkey', async () =>
                devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
            );

            await test.step('Validate create-superkey response', async () => {
                devicesApi.expectValidCreateSuperKeyResponse(response);
            });

            await test.step('Validate superkey allowance is decreased', async () => {
                await openManageDeviceModal(page, homePage, devicePage, createdDeviceSuperkeyCleanup.serialNumber);
                await devicePage.validateManageDeviceModalForAssignedSuperkey(
                    createdDeviceSuperkeyCleanup.serialNumber,
                    superkeySkus[0].id,
                );
                await test.step('Validate Superkey expiry date', async () => {
                    await devicePage.validateAssignedSuperkeyExpiryDate(3);
                });
                await devicePage.openAddSuperkeys();
                await devicePage.validateSuperkeyRemainingAllowance(4);
            });
        });

        test.describe('Contract-side subscription assignment with an active Superkey', () => {
            test.use({
                subscriptionRevokeCustomerAccountId: smokeCustomerAccountCdhId,
                subscriptionRevokeSubscriptionId: smokeAssignSubscriptionCore,
                subscriptionRevokeDealerAccountId: smokeDealerAccountId,
                superkeyRevokeOnlyOnFailure: true,
            });

            test('Verify that assigning a subscription from the Contract Details page displays a Superkey warning banner in the Assign Licenses modal (part 133611)', { tag: ['@smoke', '@NZDEV-T944', PN_133611] }, async ({
                devicesApi,
                createdDeviceSuperkeyCleanup,
                createdDeviceSubscriptionCleanup,
                summaryScreenPage,
                page,
            }) => {
                const subscriptionSku = smokeSubscriptionSku(smokeAssignSubscriptionCore);
                const contractId = smokeContractId(smokeAssignSubscriptionCore);

                const response = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(response);
                });

                const manageLicensesModal = await test.step('Open Manage Licenses modal', async () => {
                    await page.goto(`/${smokeDealerAccountId}/contracts/${contractId}?tab=subscriptions`);
                    return summaryScreenPage.openManageLicensesModal(subscriptionSku);
                });

                await test.step('Select the license line and continue to the assign step', async () => {
                    await manageLicensesModal.selectLicenseLine();
                    await manageLicensesModal.clickAssignLicenses();
                });

                await test.step('Add the Superkey device and continue to assignment', async () => {
                    await manageLicensesModal.addDeviceToAssignment(createdDeviceSubscriptionCleanup.serialNumber);
                    await manageLicensesModal.clickAssignLicenses();
                });

                await test.step('Validate the Superkey warning', async () => {
                    await manageLicensesModal.validateSuperkeyWarningVisible();
                });

                await test.step('Assign subscription and transfer device', async () => {
                    await manageLicensesModal.assignLicenseAndTransferDevice();
                });
            });
        });

        test('Verify device-based Superkeys are restricted to a global limit of five uses per device and cannot assign a Superkey after the allowance reaches zero (part 133611)', { tag: ['@smoke', '@NZDEV-T920', PN_133611] }, async ({
            devicesApi,
            createdDevice,
            devicePage,
            page,
            homePage,
        }) => {
            for (let attempt = 1; attempt <= 5; attempt += 1) {
                const createResponse = await test.step(`Assign Superkey via API (${attempt}/5)`, async () =>
                    devicesApi.createSuperKey(createdDevice.id, superkeySkus, smokeDealerAccountId),
                );
                devicesApi.expectValidCreateSuperKeyResponse(createResponse);

                const revokeResponse = await test.step(`Revoke Superkey via API (${attempt}/5)`, async () =>
                    devicesApi.revokeSuperKey(createdDevice.id, superkeySkus, smokeDealerAccountId),
                );
                devicesApi.expectValidRevokeSuperKeyResponse(revokeResponse);
            }

            await test.step('Verify Assign Superkey is unavailable', async () => {
                await page.goto('/' + smokeDealerAccountId);
                await homePage.navigateToDevicesPage();
                await devicePage.searchForDevice(createdDevice.serialNumber);
                await devicePage.validateDeviceRowVisible(createdDevice.serialNumber);
                await devicePage.manageDevice(createdDevice.serialNumber);
                await devicePage.validateAssignSuperkeyUnavailable();
            });
        });

        test('Verify that user cannot select conflicting stand alone item as additional super key (part 133611)', { tag: ['@smoke', '@NZDEV-T938', PN_133611] }, async ({
            devicesApi,
            createdDeviceSuperkeyCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            const sku = superkeySkus[0].id;

            const response = await test.step('Create superkey', async () =>
                devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
            );

            await test.step('Validate create-superkey response', async () => {
                devicesApi.expectValidCreateSuperKeyResponse(response);
            });

            await test.step('Validate assigned standalone SKU is disabled on Add Superkeys', async () => {
                await openManageDeviceModal(page, homePage, devicePage, createdDeviceSuperkeyCleanup.serialNumber);
                await devicePage.validateManageDeviceModalForAssignedSuperkey(
                    createdDeviceSuperkeyCleanup.serialNumber,
                    sku,
                );
                await devicePage.openAddSuperkeys();
                await devicePage.validateSuperkeyRemainingAllowance(4);
                await devicePage.validateAddSuperkeySkuDisabled(sku);
            });
        });

        test('Verify only one same-family stand alone super key can be selected (part 133611)', { tag: ['@smoke', '@NZDEV-T919', '@NZDEV-T921', '@NZDEV-T923', PN_133611] }, async ({
            createdDevice,
            devicePage,
            page,
            homePage,
        }) => {
            const selectedSku = superkeySkus[0].id;
            const sameFamilySku = addSuperkeySkuPayload[0].id;

            await test.step('Open Assign Superkey modal', async () => {
                await openDeviceActions(page, homePage, devicePage, createdDevice.serialNumber);
                await devicePage.clickOnAssignSuperkey();
                await devicePage.validateAssignSuperkeyRemainingAllowance(5);
            });

            await test.step('Verify the selected Superkey SKU is visible', async () => {
                await devicePage.validateAssignSuperkeySkuVisible(selectedSku);
            });

            await test.step('Select only one same-family stand alone super key', async () => {
                await devicePage.selectSuperkeySku(selectedSku);
                await devicePage.validateAssignSuperkeySkuEnabled(sameFamilySku);
                await devicePage.selectSuperkeySku(sameFamilySku);
                await devicePage.validateOnlyOneAssignSuperkeySkuSelected([selectedSku, sameFamilySku]);
            });
        });

        test.describe('conflicting items', () => {
            test.use({
                superkeyRevokeSkus: conflictingBundleSuperkeySkus,
            });

            test('Verify that user cannot select conflicting bundle item as additional super key (part 199020-01)', { tag: ['@smoke', '@NZDEV-T940', PN_199020_01] }, async ({
                devicesApi,
                createdDeviceSuperkeyCleanup,
                devicePage,
                page,
                homePage,
            }) => {
                const sku = conflictingBundleSuperkeySkus[0].id;

                const response = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, conflictingBundleSuperkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(response);
                });

                await test.step('Validate assigned bundle SKU is disabled on Add Superkeys', async () => {
                    await openManageDeviceModal(page, homePage, devicePage, createdDeviceSuperkeyCleanup.serialNumber);
                    await devicePage.validateManageDeviceModalForAssignedSuperkey(
                        createdDeviceSuperkeyCleanup.serialNumber,
                        sku,
                    );
                    await devicePage.openAddSuperkeys();
                    await devicePage.validateSuperkeyRemainingAllowance(4);
                    await devicePage.openAddSuperkeyBundlesTab();
                    await devicePage.validateAddSuperkeySkuDisabled(sku);
                    await devicePage.validateAddSuperkeySkuDisabled(conflictingBundleItemSku);
                    await devicePage.validateAddSuperkeyConflictWarning(conflictingBundleItemSku);
                });
            });
        });

        test('Verify a warning is displayed when a selected bundle contains conflicting items and users can deselect all conflicting items from a selected bundle(part 199020-01)', { tag: ['@smoke', '@NZDEV-T922', '@NZDEV-T924', PN_199020_01] }, async ({
            createdDevice,
            devicePage,
            page,
            homePage,
        }) => {
            const sku = conflictingBundleSuperkeySkus[0].id;

            await test.step('Open Assign Superkey modal', async () => {
                await openDeviceActions(page, homePage, devicePage, createdDevice.serialNumber);
                await devicePage.clickOnAssignSuperkey();
            });

            await test.step('Deselect conflicting bundle item without assigning a superkey', async () => {
                await devicePage.selectSuperkeySku(sku);
                await test.step('Verify the selected bundleSuperkey SKU is visible', async () => {
                    await devicePage.validateAssignSuperkeySkuVisible(sku);
                });
                await devicePage.validateAssignSuperkeySkuDisabled(conflictingBundleItemSku);
                await devicePage.deselectAllConflictingItemsFromAssignSuperkey(conflictingBundleItemSku);
                await devicePage.validateAssignSuperkeySkuEnabled(conflictingBundleItemSku);
            });
        });

        const showManageDeviceAfterCreateCases = [
            {
                title: 'Verify that the user can see the assigned stand alone Superkey SKU and expiration date by opening the Manage Device option (part 133611)',
                tags: ['@smoke', PN_133611],
                skus: superkeySkus,
            },
            {
                title: 'Verify that the user can see the assigned bundle Superkey SKU and expiration date by opening the Manage Device option (part 90915-00)',
                tags: ['@smoke', PN_90915_00],
                skus: superkeySkus90915,
            },
        ] as const;

        for (const { title, tags, skus } of showManageDeviceAfterCreateCases) {
            test.describe(title, () => {
                test.use({
                    superkeyRevokeSkus: [...skus],
                });

                test(title, { tag: ['@smoke', ...tags] }, async ({
                    devicesApi,
                    createdDeviceSuperkeyCleanup,
                    devicePage,
                    page,
                    homePage,
                }) => {
                    const sku = skus[0].id;

                    const createResponse = await test.step('Create superkey', async () =>
                        devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, [...skus], smokeDealerAccountId),
                    );

                    await test.step('Validate create-superkey response', async () => {
                        devicesApi.expectValidCreateSuperKeyResponse(createResponse);
                    });

                    await test.step('Validate manage device modal is displayed', async () => {
                        await openManageDeviceModal(page, homePage, devicePage, createdDeviceSuperkeyCleanup.serialNumber);
                        await devicePage.validateManageDeviceModalForAssignedSuperkey(
                            createdDeviceSuperkeyCleanup.serialNumber,
                            sku,
                        );
                    });
                });
            });
        }

        const revokeSuperkeyFromUiCases = [
            {
                title: 'Verify that the user can revoke a stand alone Superkey by clicking the bin icon and confirming the action (part 133611)',
                tags: ['@smoke', '@NZDEV-T935', PN_133611],
                skus: superkeySkus,
            },
            {
                title: 'Verify that the user can revoke a bundle Superkey by clicking the bin icon and confirming the action (part 90915-00)',
                tags: ['@smoke', '@NZDEV-T936', PN_90915_00],
                skus: superkeySkus90915,
            },
        ] as const;

        for (const { title, tags, skus } of revokeSuperkeyFromUiCases) {
            test.describe(title, () => {
                test.use({
                    superkeyRevokeSkus: [...skus],
                    superkeyRevokeOnlyOnFailure: true,
                });

                test(title, { tag: ['@smoke', ...tags] }, async ({
                    devicesApi,
                    createdDeviceSuperkeyCleanup,
                    devicePage,
                    page,
                    homePage,
                }) => {
                    const sku = skus[0].id;

                    const createResponse = await test.step('Create superkey', async () =>
                        devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, [...skus], smokeDealerAccountId),
                    );

                    await test.step('Validate create-superkey response', async () => {
                        devicesApi.expectValidCreateSuperKeyResponse(createResponse);
                    });

                    await test.step('Revoke superkey from manage device', async () => {
                        await openManageDeviceModal(page, homePage, devicePage, createdDeviceSuperkeyCleanup.serialNumber);
                        await devicePage.validateManageDeviceModalForAssignedSuperkey(
                            createdDeviceSuperkeyCleanup.serialNumber,
                            sku,
                        );
                        await devicePage.revokeAssignedSuperkey(sku);
                    });
                });
            });
        }

        test('Verify that the user can cancel the Superkey revocation from the confirmation screen and leave the Superkey assigned (part 133611)', { tag: ['@smoke', '@NZDEV-T937', PN_133611] }, async ({
            devicesApi,
            createdDeviceSuperkeyCleanup,
            devicePage,
            page,
            homePage,
        }) => {
            const sku = superkeySkus[0].id;

            const createResponse = await test.step('Create superkey', async () =>
                devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
            );

            await test.step('Validate create-superkey response', async () => {
                devicesApi.expectValidCreateSuperKeyResponse(createResponse);
            });

            await test.step('Cancel revoke from manage device', async () => {
                await openManageDeviceModal(page, homePage, devicePage, createdDeviceSuperkeyCleanup.serialNumber);
                await devicePage.validateManageDeviceModalForAssignedSuperkey(
                    createdDeviceSuperkeyCleanup.serialNumber,
                    sku,
                );
                await devicePage.cancelRevokeAssignedSuperkey(sku);
            });
        });
    });

    test('Verify a customer-owned device cannot be assigned a Superkey (part 133611)', { tag: ['@smoke', '@NZDEV-T918', PN_133611] }, async ({
        devicesApi,
        createdDeviceRetained,
        devicePage,
        page,
        homePage,
    }) => {
        const response = await test.step('Transfer device to customer account', async () =>
            devicesApi.transferDevice(smokeCustomerAccountCdhId, [createdDeviceRetained.id]),
        );

        await test.step('Validate transfer response', async () => {
            devicesApi.expectValidTransferDeviceResponse(response, createdDeviceRetained.id, smokeCustomerAccountCdhId);
        });

        await test.step('Verify Assign Superkey is unavailable', async () => {
            await openDeviceActions(page, homePage, devicePage, createdDeviceRetained.serialNumber);
            await devicePage.validateAssignSuperkeyUnavailable();
        });
    });

    test.describe('Warnings', () => {
        test.describe('Assign subscription to a device with an active Superkey', () => {
            test.use({
                subscriptionRevokeCustomerAccountId: smokeCustomerAccountCdhId,
                subscriptionRevokeSubscriptionId: smokeAssignSubscriptionCore,
                subscriptionRevokeDealerAccountId: smokeDealerAccountId,
                superkeyRevokeOnlyOnFailure: true,
            });

            test('Verify that transferring a device with an assigned Superkey displays a warning banner, removes the Superkey after transfer, and displays a success toast (part 133611)', { tag: ['@smoke', '@NZDEV-T942', PN_133611] }, async ({
                devicesApi,
                createdDeviceSuperkeyCleanup,
                createdDeviceSubscriptionCleanup,
                devicePage,
                page,
                homePage,
            }) => {
                const subscriptionSku = smokeSubscriptionSku(smokeAssignSubscriptionCore);

                const response = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(response);
                });

                await test.step('Open Assign Subscription modal and validate warning', async () => {
                    await openDeviceActions(page, homePage, devicePage, createdDeviceSubscriptionCleanup.serialNumber);
                    await devicePage.clickOnAssignSubscription();
                    await devicePage.assignSubscriptionDeviceModal.validateSuperkeyWarningVisible();
                });

                await test.step('Assign subscription', async () => {
                    await devicePage.assignSubscriptionDeviceModal.selectCustomer(smokeCustomerName);
                    await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(subscriptionSku);
                    await devicePage.assignSubscriptionDeviceModal.assignSubscription(DeviceToast.subscriptionAssignedAndDeviceTransferred);
                });
            });

            test('Verify that bulk assigning a subscription to a device with an assigned Superkey displays a warning banner, removes the Superkey after transfer, and displays a success toast (part 133611)', { tag: ['@smoke', '@NZDEV-T946', PN_133611] }, async ({
                devicesApi,
                createdDeviceSuperkeyCleanup,
                createdDeviceSubscriptionCleanup,
                devicePage,
                page,
                homePage,
            }) => {
                const subscriptionSku = smokeSubscriptionSku(smokeAssignSubscriptionCore);

                const response = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(response);
                });

                await test.step('Open bulk Assign Subscriptions modal and validate warning', async () => {
                    await page.goto('/' + smokeDealerAccountId);
                    await homePage.navigateToDevicesPage();
                    await devicePage.searchForDevice(createdDeviceSubscriptionCleanup.serialNumber);
                    await devicePage.validateDeviceRowVisible(createdDeviceSubscriptionCleanup.serialNumber);
                    await devicePage.selectMultipleDevices();
                    await devicePage.selectDevice(createdDeviceSubscriptionCleanup.serialNumber);
                    await devicePage.clickOnManageSelection();
                    await devicePage.clickOnAssignSubscriptions();
                    await devicePage.assignSubscriptionDeviceModal.validateSuperkeyWarningVisible();
                });

                await test.step('Assign subscription', async () => {
                    await devicePage.assignSubscriptionDeviceModal.selectCustomer(smokeCustomerName);
                    await devicePage.assignSubscriptionDeviceModal.selectSubscriptionSku(subscriptionSku);
                    await devicePage.assignSubscriptionDeviceModal.assignSubscription(DeviceToast.subscriptionAssignedAndDeviceTransferred);
                });
            });
        });

        test.describe('Transfer a device with an active Superkey', () => {
            test.use({
                superkeyRevokeOnlyOnFailure: true,
            });

            test('Verify that transfer a device with an assigned Superkey displays a warning banner, removes the Superkey after assignment, and displays a success toast (part 133611)', { tag: ['@smoke', '@NZDEV-T943', PN_133611] }, async ({
                devicesApi,
                createdDeviceSuperkeyCleanup,
                devicePage,
                page,
                homePage,
            }) => {
                const response = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(response);
                });

                await test.step('Open Transfer Device modal and validate warning', async () => {
                    await openDeviceActions(page, homePage, devicePage, createdDeviceSuperkeyCleanup.serialNumber);
                    await devicePage.clickOnTransferDevice();
                    await devicePage.transferDeviceModal.validateSuperkeyWarningVisible();
                });

                await test.step('Transfer device to customer', async () => {
                    await devicePage.transferDeviceModal.selectCustomer(smokeCustomerName);
                    await devicePage.transferDeviceModal.transferDevice(DeviceToast.deviceTransferSuccessful);
                    await devicePage.validateDeviceRowVisible(createdDeviceSuperkeyCleanup.serialNumber);
                    await devicePage.validateDeviceRowDoesNotShowSuperkey(createdDeviceSuperkeyCleanup.serialNumber);
                });
            });

            test('Verify that bulk transferring a device with an assigned Superkey displays a warning banner, removes the Superkey after transfer, and displays a success toast (part 133611)', { tag: ['@smoke', '@NZDEV-T945', PN_133611] }, async ({
                devicesApi,
                createdDeviceSuperkeyCleanup,
                devicePage,
                page,
                homePage,
            }) => {
                const response = await test.step('Create superkey', async () =>
                    devicesApi.createSuperKey(createdDeviceSuperkeyCleanup.id, superkeySkus, smokeDealerAccountId),
                );

                await test.step('Validate create-superkey response', async () => {
                    devicesApi.expectValidCreateSuperKeyResponse(response);
                });

                await test.step('Open bulk Transfer Devices modal and validate warning', async () => {
                    await page.goto('/' + smokeDealerAccountId);
                    await homePage.navigateToDevicesPage();
                    await devicePage.searchForDevice(createdDeviceSuperkeyCleanup.serialNumber);
                    await devicePage.validateDeviceRowVisible(createdDeviceSuperkeyCleanup.serialNumber);
                    await devicePage.selectMultipleDevices();
                    await devicePage.selectDevice(createdDeviceSuperkeyCleanup.serialNumber);
                    await devicePage.clickOnManageSelection();
                    await devicePage.clickOnTransferDevices();
                    await devicePage.transferDeviceModal.validateSuperkeyWarningVisible();
                });

                await test.step('Transfer device to customer', async () => {
                    await devicePage.transferDeviceModal.selectCustomer(smokeCustomerName);
                    await devicePage.transferDeviceModal.transferDevice(DeviceToast.deviceTransferSuccessful);
                    await devicePage.validateDeviceRowVisible(createdDeviceSuperkeyCleanup.serialNumber);
                    await devicePage.validateDeviceRowDoesNotShowSuperkey(createdDeviceSuperkeyCleanup.serialNumber);
                });
            });
        });
    });
});
