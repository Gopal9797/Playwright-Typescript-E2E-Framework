import { expect, type APIRequestContext } from '@playwright/test';
import { readFileSync } from 'fs';
import { smokeDealerAccountId } from '../config/featureTestConfig';

const UPG_ACCOUNT_USER_TOKEN_FILE = '.auth/upgaccountuser-token.json';

type UpgAccountUserTokenState = {
    authorization?: string;
    graphqlUrl?: string;
};

type GraphQLResponse<TData> = {
    data?: TData;
    errors?: unknown;
};

type GraphQLVariables = Record<string, unknown>;

export class GraphQLClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly accountId = smokeDealerAccountId
    ) { }

    async post<TData>(document: string, variables?: GraphQLVariables): Promise<TData> {
        const body = await this.postAllowingErrors<TData>(document, variables);
        expect(body.errors, JSON.stringify(body.errors, null, 2)).toBeFalsy();
        expect(body.data, 'Expected GraphQL data').toBeTruthy();
        return body.data!;
    }

    async postAllowingErrors<TData>(document: string, variables?: GraphQLVariables): Promise<GraphQLResponse<TData>> {
        const { authorization, graphqlUrl } = this.getUpgAccountUserTokenState();
        const headers = {
            accept: 'application/json',
            authorization,
            'content-type': 'application/json',
            'dxp-Account-Ids': this.accountId,
        };

        const headersForLog = {
            ...headers,
            authorization: authorization.startsWith('Bearer ') ? 'Bearer <present>' : '<no Bearer prefix>',
        };

        console.group('GraphQL → REQUEST');
        console.log('url:', graphqlUrl);
        console.log('dxp-Account-Ids:', this.accountId);
        console.log('variables:', JSON.stringify(variables ?? {}, null, 2));
        console.log('headers:', JSON.stringify(headersForLog, null, 2));
        console.log('document:\n', document);
        console.groupEnd();

        const response = await this.request.post(graphqlUrl, {
            data: {
                query: document,
                variables,
            },
            headers,
        });

        const responseText = await response.text();
        const body = responseText ? (JSON.parse(responseText) as GraphQLResponse<TData>) : {};

        console.group('GraphQL ← RESPONSE');
        console.log('status:', response.status(), response.statusText());
        console.log('body:', JSON.stringify(body, null, 2));
        console.groupEnd();

        expect(response.ok(), `GraphQL request failed with status ${response.status()} ${response.statusText()}`).toBeTruthy();
        return body;
    }

    private getUpgAccountUserTokenState(): Required<UpgAccountUserTokenState> {
        const tokenState = JSON.parse(readFileSync(UPG_ACCOUNT_USER_TOKEN_FILE, 'utf-8')) as UpgAccountUserTokenState;

        expect(tokenState.authorization, `Expected authorization header in ${UPG_ACCOUNT_USER_TOKEN_FILE}`).toBeTruthy();
        expect(tokenState.graphqlUrl, `Expected GraphQL URL in ${UPG_ACCOUNT_USER_TOKEN_FILE}`).toBeTruthy();

        return {
            authorization: tokenState.authorization!,
            graphqlUrl: tokenState.graphqlUrl!,
        };
    }
}
