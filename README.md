# Playwright-Typescript E2E Framework

This project is an automated end-to-end testing suite for the DXP Portal, built with [Playwright](https://playwright.dev/) and TypeScript. It covers UI flows, authentication, and database validation for robust regression and feature testing, following a modular and maintainable approach.

## Features

- Playwright-based UI automation for the DXP Portal
- Microsoft Entra (Azure AD) Service Principal authentication for Azure Database for PostgreSQL
- Modular page object model for maintainable tests
- Utility functions for database queries and date handling
- Test data management via JSON files
- Artifacts and reporting for test runs

## Project Structure

```
├── src/
│   ├── fixture/           # Playwright test fixtures which like a baseTest
│   ├── interface/         # TypeScript interfaces
│   ├── pages/             # Page object models
│   ├── tests/             # Main test specs
│   ├── utils/             # Utilities (PostgreSQL, logging, auth, etc.)
│   └── testdata.json      # Test data
├── playwright.config.ts   # Playwright configuration
├── testConfig.ts          # Custom test configuration
├── .env                   # Secrets and environment variables
├── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Access to the DXP Portal and required Azure Database for PostgreSQL
- Azure AD Service Principal credentials for DB token authentication (Client ID, Secret, Tenant ID)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd dxp-ui-testing-suite
   ```
2. Install dependencies:
   ```sh
   npx playwright install
   npx install dotenv
   npm install pg
   npm install --save-dev @types/pg
   npx install fs
   npx install winston
   npm install proper-lockfile
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in the required values (see below).

### .env Example

```
BPC_ACCOUNT_EMAIL=user-email
BPC_ACCOUNT_PASSWORD=user-password
DB_HOST_qa=your-qa-postgres-host.postgres.database.azure.com
DB_USER_qa=your-qa-postgres-user
DB_HOST_dev=your-dev-postgres-host.postgres.database.azure.com
DB_USER_dev=your-dev-postgres-user
DB_PORT=5432
DB_NAME=dxp
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id
```

### Running Tests

To run all tests:

```sh
npx playwright test
```

To run a specific test file:

```sh
npx playwright test src/tests/contractCreation.spec.ts
```

To view the Playwright HTML report:

```sh
npx playwright show-report
```

To view the downloaded Playwright HTML report:

```sh
npm install -g playwright
##ignore above command if you have already installed playwright globally

npx playwright show-report "C:\Users\GSUBRAM\Downloads\playwright-report"
```

### Running a Specific Test by Tag or Title

To run a test with a specific tag (e.g., `@NZDEV-43`) or matching part of the test title, use the `-g` (grep) option:

```sh
npx playwright test -g "@NZDEV-43"
```

You can also use part of the test name:

```sh
npx playwright test -g "Contract Creation"
```

This will run only the tests that match the given pattern in their title or tags.

### Running Tests in Different Environments

The default environment would be 'qa' when no ENV value is passed.

You can execute tests in a specific environment by setting the `ENV` environment variable before running Playwright. For example, to run tests in the `sit` environment and only those matching a specific tag:

```powershell
$env:ENV="sit"; npx playwright test -g "@NZDEV-T43"
```

This sets the `ENV` variable for the current command and runs only tests tagged with `@NZDEV-T43`.

You can use other environment names (e.g., `qa`, `sit`, `dev`) as needed, depending on your configuration.

### Running Failed Test Cases

To re-run only the tests that failed in the previous run, use:

```sh
npx playwright test --last-failed
```

### Triggering PR Playwright from GitHub PR Comments

Use this comment on a pull request:

```text
/run-pr-playwright
```

How it works:

- A lightweight `issue_comment` workflow on the default branch listens for the command.
- That workflow dispatches `pr-playwright.yml` using the PR head branch as the `ref`.
- The actual Playwright run then executes against PR branch workflow/code, not main branch code.

Notes:

- This dispatch flow currently supports PRs from branches in the same repository.
- Default dispatch inputs are `env=qa`, `shards=6`, and empty `grep`.
- You can still run `pr-playwright.yml` manually with `workflow_dispatch` and provide `pr_number`.

### Debugging Tests

To run a test in debug mode (with Playwright Inspector):

```sh
npx playwright test --debug
```

This opens the Playwright Inspector, allowing you to step through your test, pause, and interact with the browser.

You can also use `test.only()` in your test file to focus on a specific test during debugging.

### Database Utilities

- Use the `executeQuery` utility for running PostgreSQL queries in your tests or page objects.
- Example:

  ```typescript
  import { executeQuery } from "../utils/postgresDBUtils";

  const result = await executeQuery(
    "SELECT * FROM dxp.contract.contract_detail WHERE id = $1",
    ["contract-id"],
  );
  console.log(result.rows);
  ```

### Authentication

- Uses Playwright's `storageState` for session management.
- For database tests, uses Azure AD Service Principal credentials from `.env` to get PostgreSQL access tokens.

## Artifacts & Reports

- Test artifacts (screenshots, videos, traces) are stored in `playwright-artifacts/`.
- HTML reports are generated in `playwright-report/`.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

MIT

## Installed Dependencies

**Production dependencies:**

- dotenv (^16.5.0)
- pg (^8.20.0)
- winston (^3.17.0)

**Development dependencies:**

- @playwright/test (^1.51.1)
- @types/node (^22.15.31)
- @types/pg (^8.20.0)

## About package.json

The `package.json` file is the manifest for this project. It defines:

- Project metadata (name, version, description, repository, etc.)
- All npm dependencies and their versions
- Scripts for running and managing tests (see the `scripts` section)
- Development and production dependencies

Key scripts in this project:

- `npm test` or `npx playwright test` — Runs all Playwright tests
- `npm run test-dxp-ui` — Runs UI tests with the specified Playwright config and project
- `npm run test:sanity` — Runs tests tagged with `@sanity` using the test suite project

You can add more scripts or dependencies as needed for your workflow. For full details, see the `package.json` file in the project root.

---

**DXP UI Testing Suite** — Automated, reliable, and scalable UI testing for the DXP Portal.
