import { expect } from '@playwright/test';
import { GraphQLClient } from '../GraphQLClient';
import { DEALER_CUSTOMERS_QUERY, LINK_EXISTING_VW_CUSTOMER_MUTATION } from './queries/customerQueries';

type DealerCustomer = {
    companyName: string;
    id: string;
    optInStatus: string;
};

type DealerCustomersResponse = {
    dealerCustomers: DealerCustomer[];
};

export class CustomerApi {
    constructor(private readonly graphQLClient: GraphQLClient) { }

    async getDealerCustomers(dealerAccountId: string): Promise<DealerCustomersResponse> {
        return this.graphQLClient.post<DealerCustomersResponse>(DEALER_CUSTOMERS_QUERY, {
            accountId: dealerAccountId,
        });
    }

    expectValidDealerCustomersResponse(response: DealerCustomersResponse): void {
        expect(Array.isArray(response.dealerCustomers)).toBeTruthy();
        expect(response.dealerCustomers.length).toEqual(expect.any(Number));
    }

    async linkExistingVwCustomer(
        dealerAccountId: string,
        customerAccountId: string,
    ): Promise<{ linkExistingVwCustomer: boolean }> {
        return this.graphQLClient.post<{ linkExistingVwCustomer: boolean }>(LINK_EXISTING_VW_CUSTOMER_MUTATION, {
            dealerAccountId,
            customerAccountId,
        });
    }

    expectLinkExistingVwCustomerSucceeded(response: { linkExistingVwCustomer: boolean }): void {
        expect(response.linkExistingVwCustomer).toBe(true);
    }
}
