import { expect } from '@playwright/test';
import { GraphQLClient } from '../GraphQLClient';
import {
    ASSIGN_SUBSCRIPTIONS_TO_USERS_MUTATION,
    AVAILABLE_USER_SUBSCRIPTIONS_QUERY,
    REVOKE_USER_LICENSE_MUTATION,
} from './queries/userQueries';

type LicenseBreakdownSeats = {
    assignedSeats: number;
    unassignedSeats: number;
};

type License =
    | {
        __typename: 'License';
        id: string;
        holderId: string;
    }
    | {
        __typename: 'OfflineLicense';
        id: string;
        checkInDate: string;
        checkOutDate: string;
        holderId: string;
        revokeWhenOnline: boolean;
    };

type LicenseBreakdownWithLicenses = LicenseBreakdownSeats & {
    licenses: License[];
};

type ProductFamily = {
    id?: string;
    description: string;
    type?: string;
};

type Product = {
    id: string;
    description?: string;
    isNonTransferable?: boolean;
    family?: ProductFamily;
};

type Contract = {
    id: string;
    contractNumber: string;
    purchaseOrderNumber?: string;
    renewalDate?: string;
    status?: string;
};

type PendingQuoteLine = {
    id: string;
    action?: string;
    quantity?: number;
    licenseBreakdown?: LicenseBreakdownSeats;
};

type SubscriptionContractLine = {
    id: string;
    status: string;
    contract: Contract;
    licenseBreakdown: LicenseBreakdownSeats;
    pendingQuoteLine?: PendingQuoteLine | null;
    product: Product;
};

type AvailableSubscription = {
    contractLines: SubscriptionContractLine[];
    licenseBreakdown: LicenseBreakdownSeats;
    product: Product;
};

type AvailableUserSubscriptionsResponse = {
    availableUserSubscriptions: {
        subscriptions: AvailableSubscription[];
    };
};

type UserProductLine =
    | {
        __typename: 'ContractLine';
        id: string;
        startDate?: string;
        status?: string;
        contract?: Contract;
        licenseBreakdown?: { licenses: License[] };
        product?: Product;
    }
    | {
        __typename: 'ExternalContractLine';
        id: string;
        startDate?: string;
        endDate?: string;
        product?: Product;
    };

type AssignedUser = {
    id: string;
    createdAt: string;
    email: string;
    firstName: string;
    iamAccountId: string;
    lastName: string;
    status: string;
    roles: string[];
    productLines: UserProductLine[];
};

type AssignContractLine = {
    id: string;
    breakdown?: {
        quoteId: string;
        licenseBreakdown: LicenseBreakdownSeats;
    };
    licenseBreakdown: LicenseBreakdownSeats;
    pendingQuoteLine?: {
        id: string;
        licenseBreakdown?: LicenseBreakdownSeats;
    } | null;
    users: Array<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        status: string;
    }>;
};

export type AssignSubscriptionsToUsersPayload = {
    users: AssignedUser[];
    contractLines: AssignContractLine[];
};

type RevokeUserLicensePayload = {
    contractLine: {
        id: string;
        amendmentBreakdown?: Array<{
            id: string;
            licenseBreakdown: LicenseBreakdownWithLicenses;
            users?: Array<{
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                roles: string[];
                status: string;
            }> | null;
        }> | null;
        licenseBreakdown: LicenseBreakdownSeats;
    };
    user: {
        id: string;
        productLines: Array<Pick<UserProductLine, 'id' | '__typename'>>;
    };
};

export class CustomerUsersApi {
    constructor(private readonly graphQLClient: GraphQLClient) { }

    async getAvailableUserSubscriptions(
        customerAccountId: string,
        dealerAccountId: string,
        userId?: string | null,
    ): Promise<AvailableUserSubscriptionsResponse> {
        return this.graphQLClient.post<AvailableUserSubscriptionsResponse>(
            AVAILABLE_USER_SUBSCRIPTIONS_QUERY,
            {
                customerAccountId,
                dealerAccountId,
                userId: userId ?? null,
            },
        );
    }

    expectValidAvailableUserSubscriptionsResponse(
        response: AvailableUserSubscriptionsResponse,
        expectedSubscriptionIds: string[] = [],
    ): void {
        expect(Array.isArray(response.availableUserSubscriptions.subscriptions)).toBeTruthy();
        for (const subscription of response.availableUserSubscriptions.subscriptions) {
            expect(subscription.product.id).toEqual(expect.any(String));
            expect(subscription.licenseBreakdown).toEqual(expect.objectContaining({
                assignedSeats: expect.any(Number),
                unassignedSeats: expect.any(Number),
            }));
            expect(Array.isArray(subscription.contractLines)).toBeTruthy();
        }

        const availableContractLineIds = response.availableUserSubscriptions.subscriptions
            .flatMap((subscription) => subscription.contractLines.map((line) => line.id));

        for (const expectedSubscriptionId of expectedSubscriptionIds) {
            expect(
                availableContractLineIds,
                `Expected contractLine id "${expectedSubscriptionId}" to be present in availableUserSubscriptions`,
            ).toContain(expectedSubscriptionId);
        }
    }

    async assignSubscriptionsToUsers(
        customerAccountId: string,
        dealerAccountId: string,
        subscriptionIds: string[],
        userIds: string[],
    ): Promise<{ assignSubscriptionsToUsers: AssignSubscriptionsToUsersPayload }> {
        return this.graphQLClient.post<{ assignSubscriptionsToUsers: AssignSubscriptionsToUsersPayload }>(
            ASSIGN_SUBSCRIPTIONS_TO_USERS_MUTATION,
            {
                customerAccountId,
                dealerAccountId,
                subscriptionIds,
                userIds,
            },
        );
    }

    expectValidAssignSubscriptionsToUsersResponse(
        response: { assignSubscriptionsToUsers: AssignSubscriptionsToUsersPayload },
        expectedUserIds: string[],
        expectedSubscriptionIds: string[] = [],
    ): void {
        const payload = response.assignSubscriptionsToUsers;

        expect(Array.isArray(payload.users)).toBeTruthy();
        expect(Array.isArray(payload.contractLines)).toBeTruthy();

        for (const expectedUserId of expectedUserIds) {
            const user = payload.users.find((u) => u.id.includes(expectedUserId));

            expect(user, `Expected user with id ${expectedUserId} in assignSubscriptionsToUsers result`).toBeTruthy();
            expect(user!.id.includes(expectedUserId)).toBeTruthy();
            expect(Array.isArray(user!.productLines)).toBeTruthy();

            const userProductLineIds = user!.productLines.map((line) => line.id);

            for (const expectedSubscriptionId of expectedSubscriptionIds) {
                expect(
                    userProductLineIds,
                    `Expected user ${expectedUserId} to have productLine id "${expectedSubscriptionId}" after assignSubscriptionsToUsers`,
                ).toContain(expectedSubscriptionId);
            }
        }

        for (const expectedSubscriptionId of expectedSubscriptionIds) {
            const contractLine = payload.contractLines.find((line) => line.id === expectedSubscriptionId);

            expect(contractLine, `Expected contractLine with id "${expectedSubscriptionId}" in assignSubscriptionsToUsers result`).toBeTruthy();
            expect(Array.isArray(contractLine!.users)).toBeTruthy();

            const contractLineUserIds = contractLine!.users.map((u) => u.id);

            for (const expectedUserId of expectedUserIds) {
                expect(
                    contractLineUserIds.some((id) => id.includes(expectedUserId)),
                    `Expected contractLine "${expectedSubscriptionId}" to have user id "${expectedUserId}" after assignSubscriptionsToUsers`,
                ).toBeTruthy();
            }
        }
    }

    async revokeUserLicense(
        customerAccountId: string,
        dealerAccountId: string,
        subscriptionId: string,
        userId: string,
    ): Promise<{ revokeUserLicense: RevokeUserLicensePayload }> {
        return this.graphQLClient.post<{ revokeUserLicense: RevokeUserLicensePayload }>(
            REVOKE_USER_LICENSE_MUTATION,
            {
                customerAccountId,
                dealerAccountId,
                subscriptionId,
                userId,
            },
        );
    }

    expectValidRevokeUserLicenseResponse(
        response: { revokeUserLicense: RevokeUserLicensePayload },
        expectedUserId: string,
        revokedSubscriptionId: string,
    ): void {
        const payload = response.revokeUserLicense;

        expect(payload.contractLine.id).toEqual(expect.any(String));
        expect(payload.contractLine.licenseBreakdown).toEqual(expect.objectContaining({
            assignedSeats: expect.any(Number),
            unassignedSeats: expect.any(Number),
        }));
        expect(payload.user.id).toContain(expectedUserId);
        expect(Array.isArray(payload.user.productLines)).toBeTruthy();

        const userProductLineIds = payload.user.productLines.map((line) => line.id);
        expect(
            userProductLineIds,
            `Expected user ${expectedUserId} to no longer have productLine id "${revokedSubscriptionId}" after revokeUserLicense`,
        ).not.toContain(revokedSubscriptionId);

        const amendmentUserIds = (payload.contractLine.amendmentBreakdown ?? [])
            .flatMap((breakdown) => breakdown.users ?? [])
            .map((u) => u.id);
        expect(
            amendmentUserIds.some((id) => id.includes(expectedUserId)),
            `Expected contractLine "${payload.contractLine.id}" to no longer have user id "${expectedUserId}" after revokeUserLicense`,
        ).toBeFalsy();
    }
}