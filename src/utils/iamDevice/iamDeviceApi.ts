import { randomInt } from 'crypto';
import { expect, type APIRequestContext, type TestInfo } from '@playwright/test';
import { readFileSync } from 'fs';
import { testConfig } from '../../../testConfig';

export const UPG_ACCOUNT_USER_TOKEN_FILE = '.auth/upgaccountuser-token.json';

type TestEnvironment = 'qa' | 'dev' | 'sit' | 'uat';

export function getIamDeviceBaseUrl(envName = process.env.ENV || 'qa'): string {
    const normalizedEnv = envName.trim().toLowerCase() as TestEnvironment;
    const envConfig = testConfig[normalizedEnv];

    if (!envConfig || typeof envConfig !== 'object' || typeof envConfig.iamDeviceBaseUrl !== 'string') {
        throw new Error(`Unsupported ENV "${envName}" for IAM device base URL.`);
    }

    return envConfig.iamDeviceBaseUrl.replace(/\/$/, '');
}

const IAM_DEVICE_BASE = getIamDeviceBaseUrl();

export type CreatedDevice = {
    id: string;
    serialNumber: string;
    /** Catalog part number — set when reserved from dealer inventory pool. */
    partNumber?: string;
};

function readAuthHeader(): string {
    const tokenState = JSON.parse(readFileSync(UPG_ACCOUNT_USER_TOKEN_FILE, 'utf-8')) as {
        authorization?: string;
    };
    expect(tokenState.authorization, `Expected authorization header in ${UPG_ACCOUNT_USER_TOKEN_FILE}`).toBeTruthy();
    return tokenState.authorization!;
}

/**
 * Create an IAM device for the given catalog part number (sent as IAM `model`).
 * Serial defaults to `auto` + digits so dealer inventory can be filtered later.
 */
export async function createIamDevice(
    request: APIRequestContext,
    createdDeviceSerialNumber: string,
    _testInfo: TestInfo,
    dealerAccountId: string,
    iamAccountId: string,
    partNumber: string,
): Promise<CreatedDevice> {
    const generatedSerial = `auto${String(randomInt(0, 1_000_000_000_000)).padStart(12, '0')}`;
    const serialNumber = createdDeviceSerialNumber || generatedSerial;
    const authorization = readAuthHeader();

    expect(iamAccountId, 'Set iamAccountId via test.use(...) — Trimble IAM account UUID for ?accountId= (distinct from GraphQL dealerAccountId)').toBeTruthy();
    expect(partNumber, 'createIamDevice requires a catalog part number (IAM model)').toBeTruthy();

    const response = await request.post(`${IAM_DEVICE_BASE}/devices?accountId=${iamAccountId}`, {
        data: {
            serialNumber,
            model: partNumber,
            manufacturer: 'testM',
            sku: partNumber,
        },
        headers: {
            accept: 'application/json',
            authorization,
            'content-type': 'application/json',
        },
    });
    const responseText = await response.text();
    const body = responseText ? (JSON.parse(responseText) as { id?: string }) : {};

    console.log('Create device with serial number:', serialNumber, 'partNumber/model:', partNumber);
    console.log('Create IAM device response status:', response.status(), response.statusText());
    console.log('Create IAM device response body:', JSON.stringify(body, null, 2));

    expect(response.status(), `Expected IAM device creation to return 201. Response body: ${responseText}`).toBe(201);
    expect(body.id, 'Expected IAM device creation response to include id').toBeTruthy();

    const deviceId = body.id!;

    expect(dealerAccountId, 'Set dealerAccountId via test.use(...) for dealer catalog sync after IAM create').toBeTruthy();

    return {
        id: deviceId,
        serialNumber,
        partNumber,
    };
}

export async function deleteIamDevice(request: APIRequestContext, deviceId: string): Promise<void> {
    const authorization = readAuthHeader();
    const deleteResponse = await request.delete(`${IAM_DEVICE_BASE}/devices/${deviceId}`, {
        headers: {
            accept: 'application/json',
            authorization,
        },
    });
    const deleteBody = await deleteResponse.text();

    console.log('Delete created device response status:', deleteResponse.status(), deleteResponse.statusText());
    console.log('Delete created device response body:', deleteBody || '(empty)');

    expect.soft(deleteResponse.status(), `Expected delete device to return 204. Body: ${deleteBody}`).toBe(204);
}
