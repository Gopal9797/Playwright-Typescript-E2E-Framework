/**
 * Env-driven config for the Feature smoke tests.
 * Set values via `.env` locally, or GitHub repo Variables (`vars.SMOKE_*`) in CI.
 *
 * Resolved eagerly to plain strings, but NOT validated here: Playwright loads every test file
 * referenced by any project during discovery (even when you pass `--project=...`), so throwing at
 * module load would break unrelated projects. The feature setup project (`featureIamDevicePoolSetup`)
 * asserts the values it needs at runtime; tests that need the others will fail naturally if those are blank.
 */

const env = (key: string): string => process.env[key]?.trim() ?? '';

export const smokeDealerAccountId = env('SMOKE_DEALER_ACCOUNT_ID');
export const smokeIamAccountId = env('SMOKE_IAM_ACCOUNT_ID');
export const smokeDifferentDealerAccountId = env('SMOKE_DIFFERENT_DEALER_ACCOUNT_ID');
export const smokeDifferentIamAccountId = env('SMOKE_DIFFERENT_IAM_ACCOUNT_ID');
export const smokeCustomerAccountCdhId = env('SMOKE_CUSTOMER_ACCOUNT_CDH_ID');
export const smokeCustomerName = env('SMOKE_CUSTOMER_NAME');
export const smokeAssignSubscriptionIds = env('SMOKE_ASSIGN_SUBSCRIPTION_IDS')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** `SMOKE_ASSIGN_SUBSCRIPTION_IDS` slot 0 — 133611 / BS-SB-T4D-CORE. */
export const smokeAssignSubscriptionCore = smokeAssignSubscriptionIds[0] ?? '';
/** `SMOKE_ASSIGN_SUBSCRIPTION_IDS` slot 1 — 90915-00 standalone bundle. */
export const smokeAssignSubscription90915Standalone = smokeAssignSubscriptionIds[1] ?? '';
/** `SMOKE_ASSIGN_SUBSCRIPTION_IDS` slot 2 — 90915-00 bundle from a package. */
export const smokeAssignSubscription90915Package = smokeAssignSubscriptionIds[2] ?? '';
export const smokeAssignSubscriptionSameFamilySku = env('SMOKE_ASSIGN_SUBSCRIPTION_SAME_FAMILY_SKU');

export const smokeUserAssignSubscriptionIdsAll = env('SMOKE_USER_ASSIGN_SUBSCRIPTION_IDS')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** First three `SMOKE_USER_ASSIGN_SUBSCRIPTION_IDS` slots — standalone user licenses. */
export const smokeUserAssignSubscriptionIds = smokeUserAssignSubscriptionIdsAll.slice(0, 3);
/** Last `SMOKE_USER_ASSIGN_SUBSCRIPTION_IDS` slot — user bundle from a package. */
export const smokeUserAssignSubscriptionPackage = smokeUserAssignSubscriptionIdsAll.at(-1) ?? '';

export const smokeUserAssignUserIds = env('SMOKE_USER_ASSIGN_USER_IDS')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** Account Members email used for the UI-driven user license assignment test. */
export const smokeAccountMemberEmail = env('SMOKE_ACCOUNT_MEMBER_EMAIL');

/** SKU portion of a subscription line id (`<contractLineUuid>::<sku>`). */
export function smokeSubscriptionSku(subscriptionLineId: string): string {
    const sku = subscriptionLineId.split('::')[1]?.trim();
    return sku || subscriptionLineId.trim();
}

/** Contract id portion of a subscription line id (`<contractId>::<sku>`). */
export function smokeContractId(subscriptionLineId: string): string {
    const contractId = subscriptionLineId.split('::')[0]?.trim();
    return contractId || subscriptionLineId.trim();
}
