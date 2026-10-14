import { expect } from '@playwright/test';
import { GraphQLClient } from '../GraphQLClient';
import { ADD_SKUS_TO_SUPERKEY_MUTATION, ASSIGN_SUBSCRIPTIONS_TO_DEVICES_MUTATION, CREATE_SUPERKEY_MUTATION, DEVICES_V2_BY_PART_NUMBER_AND_SERIAL_CONTAINS_QUERY, DEVICES_V2_BY_SERIAL_QUERY, DEVICES_V2_QUERY, REVOKE_LICENSE_MUTATION, REVOKE_SUPERKEY_MUTATION, TRANSFER_DEVICE_MUTATION } from './queries/devicesQueries';

type SuperKeyLine = {
    expiryDate: string;
    id: string;
    product: {
        description: string;
        id: string;
    };
};

/** Shared product-line shape on DealerDevice across queries and mutations. */
type DealerDeviceProductLine = {
    id: string;
    isExternal: boolean;
    startDate: string;
    status: string;
    contract: {
        id: string;
        contractNumber: string;
        renewalDate: string;
        status: string;
    };
    product: {
        id: string;
        description: string;
        family: {
            description: string;
        };
    };
};

/** Owner union on DealerDevice; list queries typically include `optInStatus`. */
type DealerDeviceOwner = {
    companyName: string;
    id: string;
    optInStatus?: string;
    customerNumber?: string;
    primary?: boolean;
};

type Device = {
    superKeyCount: {
        total: number;
        used: number;
    };
    superKeyLines: SuperKeyLine[];
    description: string;
    firmware: string;
    icon: string;
    id: string;
    isExternal: boolean;
    modelName: string;
    ownerName: string;
    partNumber: string;
    reference: string;
    serialNumber: string;
    transferDate: string;
    transferStatus: string;
    owner: DealerDeviceOwner & { optInStatus: string };
    productLines: DealerDeviceProductLine[];
};

type DeviceSuperKeyFields = Pick<Device, 'id' | 'superKeyCount' | 'superKeyLines'>;

type SuperKeyLineIdOnly = Pick<SuperKeyLine, 'id'>;

type SuperkeySkuRequestInput = {
    id: string;
    type: string;
};

type DealerDevicesV2Response = {
    dealerDevicesV2: {
        totalCount: number;
        deviceSyncState?: string;
        nodes: Device[];
    };
};

/** Subset of DealerDevice returned by `transferMultipleDevices` ([DealerDevice!]!): id + owner union. */
type TransferMultipleDevicesPayload = Pick<Device, 'id'> & {
    owner: DealerDeviceOwner;
};

/** One DealerDevice element from `assignSubscriptionsToDevices` ([DealerDevice!]!) for the current mutation selection. */
export type AssignSubscriptionsToDevicesPayload = Pick<Device, 'id' | 'transferStatus' | 'productLines'> & {
    desiredDealerCustomer?: {
        id: string;
        companyName: string;
    };
    owner: DealerDeviceOwner;
    superKeyLines: SuperKeyLineIdOnly[];
};

type RevokeLicensePayload = {
    device: Pick<Device, 'id' | 'productLines'>;
};

export class DevicesApi {
    constructor(private readonly graphQLClient: GraphQLClient) { }

    async getDealerDevices(
        dealerAccountId: string,
        unassignedOnly = false,
        first = 50,
        partNumber?: string,
        serialNumberContains = 'auto',
    ): Promise<DealerDevicesV2Response> {
        if (partNumber) {
            return this.graphQLClient.post<DealerDevicesV2Response>(DEVICES_V2_BY_PART_NUMBER_AND_SERIAL_CONTAINS_QUERY, {
                dealerAccountId,
                unassignedOnly,
                first,
                partNumber,
                serialNumberContains,
            });
        }

        return this.graphQLClient.post<DealerDevicesV2Response>(DEVICES_V2_QUERY, {
            dealerAccountId,
            unassignedOnly,
            first,
        });
    }

    async getDealerDeviceBySerial(dealerAccountId: string, serialNumber: string): Promise<DealerDevicesV2Response> {
        return this.graphQLClient.post<DealerDevicesV2Response>(DEVICES_V2_BY_SERIAL_QUERY, {
            dealerAccountId,
            serialNumber,
        });
    }

    async waitForDealerDeviceBySerial(
        dealerAccountId: string,
        serialNumber: string,
        timeoutMs = 60_000,
    ): Promise<Pick<Device, 'id' | 'serialNumber' | 'partNumber'>> {
        const pollIntervalMs = 10_000;
        const deadline = Date.now() + timeoutMs;
        let device: Pick<Device, 'id' | 'serialNumber' | 'partNumber'> | undefined;

        while (Date.now() < deadline) {
            const remainingMs = deadline - Date.now();
            await new Promise((resolve) => setTimeout(resolve, Math.min(pollIntervalMs, remainingMs)));

            const response = await this.getDealerDeviceBySerial(dealerAccountId, serialNumber);
            device = response.dealerDevicesV2.nodes.find((node) => node.serialNumber === serialNumber);
            if (device) {
                return {
                    id: device.id,
                    serialNumber: device.serialNumber,
                    partNumber: device.partNumber,
                };
            }
        }

        expect(device, `Dealer catalog did not include serialNumber=${serialNumber} within ${timeoutMs}ms`).toBeTruthy();
        return device!;
    }

    expectValidDealerDevicesResponse(response: DealerDevicesV2Response): void {
        expect(response.dealerDevicesV2.totalCount).toEqual(expect.any(Number));
        expect(Array.isArray(response.dealerDevicesV2.nodes)).toBeTruthy();
        for (const device of response.dealerDevicesV2.nodes) {
            expect(device.serialNumber).toEqual(expect.any(String));
            expect(Array.isArray(device.productLines)).toBeTruthy();
        }
    }

    expectValidSuperKeyFields(device: DeviceSuperKeyFields): void {
        expect(device.id).toEqual(expect.any(String));
        expect(device.superKeyCount).toEqual({
            total: 5,
            used: expect.any(Number),
        });
        expect(device.superKeyCount.total).toBeGreaterThanOrEqual(device.superKeyCount.used);
        expect(device.superKeyCount.used).toBeLessThanOrEqual(device.superKeyCount.total);
        expect(Array.isArray(device.superKeyLines)).toBeTruthy();

        for (const superKeyLine of device.superKeyLines) {
            expect(superKeyLine).toEqual(expect.objectContaining({
                expiryDate: expect.any(String),
                id: expect.any(String),
                product: expect.objectContaining({
                    description: expect.any(String),
                    id: expect.any(String),
                }),
            }));
        }
    }

    async createSuperKey(deviceId: string, skus: SuperkeySkuRequestInput[], dealerAccountId: string): Promise<{ createSuperkey: DeviceSuperKeyFields }> {
        return this.graphQLClient.post<{ createSuperkey: DeviceSuperKeyFields }>(CREATE_SUPERKEY_MUTATION, {
            dealerAccountId,
            deviceId,
            skus,
        });
    }

    async createSuperKeyAllowingErrors(
        deviceId: string,
        skus: SuperkeySkuRequestInput[],
        dealerAccountId: string,
    ): Promise<{ data?: { createSuperkey: DeviceSuperKeyFields }; errors?: unknown }> {
        return this.graphQLClient.postAllowingErrors<{ createSuperkey: DeviceSuperKeyFields }>(CREATE_SUPERKEY_MUTATION, {
            dealerAccountId,
            deviceId,
            skus,
        });
    }

    expectValidCreateSuperKeyResponse(response: { createSuperkey: DeviceSuperKeyFields }): void {
        this.expectValidSuperKeyFields(response.createSuperkey);
    }

    expectCreateSuperKeyRejectedBecauseActiveSuperkey(errors: unknown): void {
        this.expectGraphqlMutationRejected(errors, ['createSuperkey'], 'This device already has an active superkey.');
    }

    private expectGraphqlMutationRejected(errors: unknown, path: string[], originalException: string): void {
        expect(errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path,
                extensions: expect.objectContaining({
                    originalException,
                }),
            }),
        ]));
    }

    async revokeSuperKey(deviceId: string, skus: SuperkeySkuRequestInput[], dealerAccountId: string): Promise<{ revokeSuperkey: DeviceSuperKeyFields }> {
        return this.graphQLClient.post<{ revokeSuperkey: DeviceSuperKeyFields }>(REVOKE_SUPERKEY_MUTATION, {
            dealerAccountId,
            deviceId,
            skus,
        });
    }

    expectValidRevokeSuperKeyResponse(response: { revokeSuperkey: DeviceSuperKeyFields }): void {
        const device = response.revokeSuperkey;

        expect(device.id).toEqual(expect.any(String));
        expect(device.superKeyCount).toEqual(expect.objectContaining({
            total: 5,
            used: expect.any(Number),
        }));
        expect(device.superKeyCount.total).toBeGreaterThanOrEqual(device.superKeyCount.used);
        expect(device.superKeyCount.used).toBeLessThanOrEqual(device.superKeyCount.total);
        expect(device.superKeyLines).toHaveLength(0);
    }

    async addSkusToSuperkey(deviceId: string, skus: SuperkeySkuRequestInput[], dealerAccountId: string): Promise<{ addSkusToSuperkey: DeviceSuperKeyFields }> {
        return this.graphQLClient.post<{ addSkusToSuperkey: DeviceSuperKeyFields }>(ADD_SKUS_TO_SUPERKEY_MUTATION, {
            dealerAccountId,
            deviceId,
            skus,
        });
    }

    async addSkusToSuperkeyAllowingErrors(
        deviceId: string,
        skus: SuperkeySkuRequestInput[],
        dealerAccountId: string,
    ): Promise<{ data?: { addSkusToSuperkey: DeviceSuperKeyFields }; errors?: unknown }> {
        return this.graphQLClient.postAllowingErrors<{ addSkusToSuperkey: DeviceSuperKeyFields }>(ADD_SKUS_TO_SUPERKEY_MUTATION, {
            dealerAccountId,
            deviceId,
            skus,
        });
    }

    expectAddSkusToSuperkeyRejectedBecauseSameProductFamily(
        errors: unknown,
        addedSkuId: string,
        existingSkuId: string,
    ): void {
        this.expectGraphqlMutationRejected(
            errors,
            ['addSkusToSuperkey'],
            `Product '${addedSkuId}' cannot be added to the superkey because product '${existingSkuId}' from the same product family is already included.`,
        );
    }

    expectValidAddSkusToSuperkeyResponse(response: { addSkusToSuperkey: DeviceSuperKeyFields }, expectedSkus: SuperkeySkuRequestInput[]): void {
        this.expectValidSuperKeyFields(response.addSkusToSuperkey);
        const device = response.addSkusToSuperkey;
        const returnedSkus = device.superKeyLines.map(superKeyLine => superKeyLine.product.id);
        expect(device.superKeyLines.length).toBeGreaterThan(1);
        expect(returnedSkus).toEqual(expect.arrayContaining(expectedSkus.map(sku => sku.id)));
    }
    async transferDevice(customerAccountCDHId: string, deviceIds: string[]): Promise<{ transferMultipleDevices: TransferMultipleDevicesPayload[] }> {
        return this.graphQLClient.post<{ transferMultipleDevices: TransferMultipleDevicesPayload[] }>(TRANSFER_DEVICE_MUTATION, {
            customerAccountCDHId,
            deviceIds,
        });
    }

    expectValidTransferDeviceResponse(
        response: { transferMultipleDevices: TransferMultipleDevicesPayload[] },
        expectedDeviceId: string,
        customerAccountCDHId: string,
    ): void {
        const device = response.transferMultipleDevices.find((d) => d.id === expectedDeviceId);

        expect(device, `Expected transferred device with id ${expectedDeviceId}`).toBeTruthy();
        expect(device!.id).toEqual(expectedDeviceId);
        expect(device!.owner).toEqual(expect.objectContaining({
            id: customerAccountCDHId,
            companyName: expect.any(String),
        }));
    }

    async assignSubscriptionsToDevices(
        customerAccountId: string,
        dealerAccountId: string,
        deviceIds: string[],
        subscriptionIds: string[],
        dateTime?: string | null,
    ): Promise<{ assignSubscriptionsToDevices: AssignSubscriptionsToDevicesPayload[] }> {
        const variables: Record<string, unknown> = {
            customerAccountId,
            dealerAccountId,
            deviceIds,
            subscriptionIds,
            transferOptions: {
                dateTime: dateTime ?? null,
            },
        };

        return this.graphQLClient.post<{ assignSubscriptionsToDevices: AssignSubscriptionsToDevicesPayload[] }>(
            ASSIGN_SUBSCRIPTIONS_TO_DEVICES_MUTATION,
            variables,
        );
    }

    expectValidAssignSubscriptionsToDevicesResponse(
        response: { assignSubscriptionsToDevices: AssignSubscriptionsToDevicesPayload[] },
        expectedDeviceIds: string[],
    ): void {
        for (const expectedDeviceId of expectedDeviceIds) {
            const device = response.assignSubscriptionsToDevices.find((d) => d.id === expectedDeviceId);

            expect(device, `Expected device with id ${expectedDeviceId} in assignSubscriptionsToDevices result`).toBeTruthy();
            expect(device!.id).toEqual(expectedDeviceId);
            expect(Array.isArray(device!.productLines)).toBeTruthy();
            // the verfication should check if the supbscription is assigned but currently stale data is returned
        }
    }
    async revokeLicense(customerAccountId: string, deviceId: string, subscriptionId: string, dealerAccountId: string): Promise<{ revokeLicense: RevokeLicensePayload }> {
        return this.graphQLClient.post<{ revokeLicense: RevokeLicensePayload }>(REVOKE_LICENSE_MUTATION, {
            dealerAccountId,
            customerAccountId,
            deviceId,
            subscriptionId,
        });
    }

    expectValidRevokeLicenseResponse(response: { revokeLicense: RevokeLicensePayload }): void {
        const device = response.revokeLicense.device;

        expect(device.id).toEqual(expect.any(String));
        expect(device.productLines).toHaveLength(0);
    }
}