# Feature smoke tests — design

This document describes the design of the feature smoke suite in the device, customer, and user spec directories, including its fixtures and Playwright setup projects.

## Motivation

- **Critical failures block the team**: When the devices experience breaks—for example, the device page fails to load because of API errors, permission misconfiguration, or newly synced devices with unsupported model or part numbers—day-to-day work and testing stall.
- **Gaps in deployed-environment regression**: Without automated checks or repeated manual regression, it is hard to know whether Feature flows still work on a deployed environment that integrates with external systems (e.g. IAM, EMS).
- **Faster feedback after deployment**: A focused smoke suite shortens the loop on critical features. If something regresses, developers can investigate sooner.

## Goals

- **Fast feedback**: Exercise critical Feature behavior mainly through API calls (GraphQL queries and mutations), with a small number of UI checks where they add confidence.
- **Test independence**: Each test gets its own device data so one failure does not corrupt shared state for the rest.
- **Parallel execution**: Tests can run with multiple workers and, in CI, multiple shards so runtime stays manageable as coverage grows.
- **Maintainability**: Domain logic (queries, mutations, validation) lives in API clients; UI navigation and assertions use the Page Object Model.

## Why API-first + hybrid UI

- **API tests** provide the fastest feedback on backend behavior: correct GraphQL operations, response shape, and core workflows.
- **UI checks** are used sparingly to validate user-visible behavior and reduce the risk that “the API passes but the UI is broken.”
- **Hybrid setup**: APIs can prepare data (devices, subscriptions) quickly; UI steps focus on high-signal assertions instead of repeating full UI setup in every test.

## Smoke suite scope

The feature smoke suite currently covers:

- `src/tests/device/deviceManagement.spec.ts`: device queries and device transfer.
- `src/tests/customer/customerManagement.spec.ts`: dealer customer queries and existing customer linking.
- `src/tests/device/licenseAssignment.spec.ts`: device subscription assignment/revoke API, device UI assignment/transfer/revoke, and contract subscription-tab flows.
- `src/tests/device/superkey.spec.ts`: superkey API, Devices-page, Manage Device, and warning flows.
- `src/tests/user/licenseAssignment.spec.ts`: user-license API and customer-detail UI flows.

## High level flow of tests

The `featureTests` Playwright project runs after feature authentication setup and then executes the selected feature specs.

1. `**featureApiAuthSetup`** (`src/utils/feature-api-auth-setup.ts`)
  - Signs in to DXP as the UPG account user.
  - Writes browser `storageState` to `.auth/upgaccountuser.json` for smoke tests.
  - Captures the first authenticated GraphQL request’s `Authorization` header and URL into `.auth/upgaccountuser-token.json` for API clients.
2. `**featureTests`** (the feature spec directories listed above)
  - Runs smoke tests (mostly API, some UI).
  - Uses per-test fixtures (`createdDevice`, `createdDeviceRetained`, `createdDeviceSubscriptionCleanup`) for isolated devices.

The IAM device-pool setup and teardown projects remain available as optional infrastructure, but are not dependencies of `featureTests`.

Configured in `playwright.config.ts` for `featureTests`:

- **Dependencies**: `featureTests` depends on `featureApiAuthSetup`.
- **Parallelism**: `fullyParallel: true`; CI often uses `workers: 2` (overridable in the workflow).

## Test independence and parallel safety

### Per-test device fixtures

Tests that create an IAM device carry a `@pn-*` part-number tag. The fixtures in `src/fixture/testDataFixture.ts` use that tag as the IAM model/part number:

- `**createdDevice`**
  - Creates and syncs one IAM device for the test.
  - The fixture owns the created device lifecycle according to the configured cleanup behavior.
  - Use when the device should be fully removed after the test.
- `**createdDeviceRetained**`
  - Creates and syncs one IAM device for the test.
  - The IAM device is retained after the test.
  - Use when the device must remain for other systems or later steps in the same run.
- `**createdDeviceSubscriptionCleanup`**
  - Creates and syncs one IAM device for the test.
  - Optionally revokes a subscription (when `subscriptionRevoke*` values are set via `test.use`) during teardown.
  - Use for assign-subscription flows that need best-effort cleanup.

Because each test uses its own device, **tests do not share mutable device state**, which supports parallel workers and reduces cross-test flakiness.

### IAM device pool (shared pool, isolated leases)

Implementation: `src/utils/iamDevice/iamDevicePool.ts`.

- **One pool file per dealer and shard** under `.playwright-iam-pool/`:
  - Path from `getIamDevicePoolPath(dealerAccountId, config.shard)`.
  - Shards do not contend for the same physical pool file.
- **Atomic checkout and leases**
  - `proper-lockfile` serializes updates to the pool file.
  - Checkout moves a device from `available[]` into `leases[leaseKey]` with `leaseKey = testId + retry`.
  - Releasing a lease removes that entry; devices are not returned to `available` (they are treated as consumed for that run).

This optional infrastructure favors **simplicity and isolation** over recycling devices back into the pool: each checkout gets a dedicated device without reuse coupling.

### Pool sizing

`resolveIamDevicePoolSize(config)` decides how many devices to provision:

- **Default**: The pool-size helper retains its tagged-test counting support, but the migrated feature tests no longer use the pool marker tag, so runs use the configured fallback when no marker matches.
- **Override**: Set `IAM_DEVICE_POOL_SIZE` to skip auto-sizing (filtered runs, debugging).

Set `IAM_DEVICE_POOL_SIZE` explicitly when running a single feature file or otherwise changing the number of pooled-device tests.

## Maintainability patterns

### Domain API layer

Specs call domain APIs (`devicesApi`, `customerApi`, etc.) instead of ad hoc HTTP:

- **Queries and mutations** live under `src/api/`.
- **Assertions** sit next to clients (e.g. `expectValid…Response`) for one place to update when contracts change.
- **Flows** (transfer, assign subscription, superkey) are methods that keep specs readable.

### Page Object Model

Where the UI matters (e.g. Manage Device modal), tests use page objects (`homePage`, `devicePage`, `loginPage`) so selector and flow changes stay localized.

## Configuration and prerequisites

### Credentials

For `featureApiAuthSetup`:

- `UPG_ACCOUNT_EMAIL`
- `UPG_ACCOUNT_PASSWORD`

Outputs:

- `.auth/upgaccountuser.json` — `storageState` for `test.use({ storageState: ... })`.
- `.auth/upgaccountuser-token.json` — GraphQL `Authorization` header and endpoint URL.

### Smoke test data (environment)

The target environment must already have suitable data:

- **Dealer account ID** (CDH-style; GraphQL `dealerAccountId` and pool file naming).
- **Customer account CDH ID** — opt-in customer used for transfer and subscription assignment.
- **Subscription line ID(s)** — assignable lines, typically `uuid::SKU` (and an active contract behind them).

Environment variables (defaults in `src/config/featureTestConfig.ts`):

- `SMOKE_DEALER_ACCOUNT_ID`
- `SMOKE_IAM_ACCOUNT_ID` (Trimble IAM account UUID)
- `SMOKE_CUSTOMER_ACCOUNT_CDH_ID`
- `SMOKE_CUSTOMER_NAME` (customer display name, used when picking the customer in UI modals)
- `SMOKE_ASSIGN_SUBSCRIPTION_IDS` (comma-separated)
- `SMOKE_USER_ASSIGN_SUBSCRIPTION_IDS` (comma-separated user-license line IDs)
- `SMOKE_USER_ASSIGN_USER_IDS` (comma-separated user IDs)
- `SMOKE_ACCOUNT_MEMBER_EMAIL` (account-member email used by the customer-detail UI tests)

`playwright.config.ts` loads `.env`; you can also set these in the shell before running.

## Risks and limitations

- **Test data**: Running the suite assumes a dealer, an opt-in customer, and contract(s) with assignable subscription lines in the chosen environment. That data is maintained outside this repo and may drift or expire.
- **Full isolation vs. cost**: Ideal isolation would use fresh dealer, customer, contract, and device per test; in practice the suite balances speed and maintenance by sharing stable smoke IDs while still isolating **devices** per test through the fixtures.
- **Provisioning complexity**: Realistic data often touches Salesforce, Oracle, and other systems, which makes spinning up net-new tenants expensive compared to curated smoke accounts.

## How to run

### Environment

`ENV` must be `dev`, `qa` (see `playwright.config.ts`). It selects `baseURL` from `testConfig`. Example with `.env` containing `ENV=dev`, or:

```bash
# Git Bash / macOS / Linux
npm run test-feature-smoke -- --workers=7
```

The default selection is `@smoke`. Select one feature file or provide a title/tag grep when needed:

```bash
npm run test-feature-smoke -- --grep @smoke src/tests/device/licenseAssignment.spec.ts --workers=7
npm run test-feature-smoke -- --grep "creates a standalone superkey" --workers=7
```

Use `--workers=N` on the same side of `--` as other Playwright flags. Do not put `--` before `--workers`; everything after a bare `--` is treated as test file filters, which leads to “No tests found.”

Direct Playwright (explicit config):

```bash
npx playwright test --project=featureTests --grep @smoke --workers=7
```

### Example `.env` entries

```env
ENV=dev
SMOKE_DEALER_ACCOUNT_ID=300000166572548
SMOKE_IAM_ACCOUNT_ID=9f536167-d8c7-5386-9ac5-b948d5c420da
SMOKE_CUSTOMER_ACCOUNT_CDH_ID=300000016059641
SMOKE_CUSTOMER_NAME=Smoke Test Customer
SMOKE_ASSIGN_SUBSCRIPTION_IDS=8b7b7982-789d-4522-9424-e28522fdd457::BS-CAT-1M
# Optional: fixed pool size when filtering tests or debugging
IAM_DEVICE_POOL_SIZE=6
```

Notes:

- `featureTests` automatically runs `featureApiAuthSetup` before the specs.
- The IAM device-pool setup and teardown projects remain available as optional infrastructure, but are not dependencies of `featureTests`.

### CI (GitHub Actions)

`.github/workflows/feature-smoke-tests.yml` supports:

- **Feature selection**: `all`, or one of `device-management`, `customer-management`, `device-license-assignment`, `device-superkey`, or `user-license-assignment`.
- **Optional title/tag grep**: defaults to `@smoke`.
- **Sharding**: `--shard=i/total` across jobs.
- **Workers per shard**: `--workers=N`.
- **Optional overrides** for smoke IDs and `IAM_DEVICE_POOL_SIZE` via `workflow_dispatch` inputs.

For example, choose `device-license-assignment`, leave the grep input as `@smoke`, and set the desired environment, shard count, and worker count in the workflow dispatch form. The equivalent command run by the workflow is:

```bash
npm run test-feature-smoke -- --grep=@smoke src/tests/device/licenseAssignment.spec.ts --workers=2 --shard=1/1
```

