import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import { Client, ClientConfig } from 'pg';

export type DbEnv = 'dev' | 'qa';

function getDbConfig(env: DbEnv) {
    const envUpper = env.toUpperCase();
    const host =
        process.env[`DB_HOST_${env}`] ||
        process.env[`DB_HOST_${envUpper}`] ||
        process.env.DB_HOST;
    const user =
        process.env[`DB_USER_${env}`] ||
        process.env[`DB_USER_${envUpper}`] ||
        process.env.DB_USER;
    const port = Number(
        process.env[`DB_PORT_${env}`] ||
        process.env[`DB_PORT_${envUpper}`] ||
        process.env.DB_PORT ||
        5432
    );
    const database =
        process.env[`DB_NAME_${env}`] ||
        process.env[`DB_NAME_${envUpper}`] ||
        process.env.DB_NAME ||
        'dxp';

    if (!host || !user) {
        throw new Error(
            `Missing DB config for ${env}. Expected one of: DB_HOST_${env}/DB_HOST_${envUpper}/DB_HOST and DB_USER_${env}/DB_USER_${envUpper}/DB_USER`
        );
    }

    return { host, user, port, database };
}

function getAccessToken(): string {
    try {
        return execSync(
            'az account get-access-token --resource-type oss-rdbms --query accessToken --output tsv'
        )
            .toString()
            .trim();
    } catch {
        throw new Error('Failed to fetch Azure access token');
    }
}

function isCI(): boolean {
    return !!process.env.CI;
}

function isRetryableConnectionError(error: unknown): boolean {
    const code = (error as NodeJS.ErrnoException | undefined)?.code;
    return code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'EHOSTUNREACH' || code === 'ENETUNREACH' || code === 'EAI_AGAIN';
}

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCiPassword(env: DbEnv): string | undefined {
    const envUpper = env.toUpperCase();
    return (
        process.env[`DB_PASSWORD_${env}`] ||
        process.env[`DB_PASSWORD_${envUpper}`] ||
        process.env[`DB_PASS_${env}`] ||
        process.env[`DB_PASS_${envUpper}`] ||
        process.env.DB_PASSWORD ||
        process.env.DB_PASS ||
        process.env.PGPASSWORD
    );
}

export async function createClient(env: DbEnv): Promise<Client> {
    const config = getDbConfig(env);
    const connectTimeoutMillis = Number(process.env.DB_CONNECT_TIMEOUT_MS || 15000);
    const maxAttempts = Number(process.env.DB_CONNECT_RETRIES || (isCI() ? 3 : 1));

    const clientConfig: ClientConfig = {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        connectionTimeoutMillis: connectTimeoutMillis,
        ssl: {
            rejectUnauthorized: false
        }
    };

    const explicitPassword = process.env.DB_ACCESS_TOKEN;
    const ciPassword = getCiPassword(env);
    const authMode = explicitPassword ? 'DB_ACCESS_TOKEN' : ciPassword ? 'DB_PASSWORD_OR_PGPASSWORD' : 'PASSWORDLESS';

    if (isCI()) {
        // In CI, DB_ACCESS_TOKEN is optional and can be replaced by DB_PASSWORD/PGPASSWORD.
        if (explicitPassword) {
            clientConfig.password = explicitPassword;
        } else if (ciPassword) {
            clientConfig.password = ciPassword;
        } else {
            console.log(
                `No DB password/token provided in CI for ${env}. Attempting passwordless connection.`
            );
        }

        console.log(`DB auth mode in CI for ${env}: ${authMode}`);
    } else if (explicitPassword) {
        clientConfig.password = explicitPassword;
    } else {
        clientConfig.password = getAccessToken();
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const client = new Client(clientConfig);

        try {
            await client.connect();

            if (attempt > 1) {
                console.log(`DB connection succeeded for ${env} on attempt ${attempt}/${maxAttempts}.`);
            }

            return client;
        } catch (error) {
            await client.end().catch(() => undefined);

            const errorCode = (error as NodeJS.ErrnoException | undefined)?.code || 'UNKNOWN';
            const isRetryable = isRetryableConnectionError(error);

            if (isCI() && authMode === 'PASSWORDLESS' && errorCode === '28P01') {
                console.error(
                    `CI passwordless auth was rejected for ${env}. DB server requires credentials for user ${config.user}.`
                );
            }

            if (!isRetryable || attempt === maxAttempts) {
                console.error(`DB connection failed for ${env} (attempt ${attempt}/${maxAttempts}, code=${errorCode}).`);
                throw error;
            }

            const delayMs = Math.min(2000 * attempt, 5000);
            console.warn(`DB connection retry for ${env} (attempt ${attempt}/${maxAttempts}, code=${errorCode}). Waiting ${delayMs}ms.`);
            await wait(delayMs);
        }
    }

    throw new Error(`Failed to connect to DB for ${env}.`);
}

async function globalCookieSetup(config: FullConfig) {
    console.log('*** Global Setup Running ***');

    const isCI = !!process.env.CI;
    const env = process.env.ENV || 'qa';

    // ---------------------------
    // 🔐 DB TOKEN LOGIC
    // ---------------------------
    let shouldRunDB = env !== 'dev'; // default

    if (process.env.RUN_DB !== undefined) {
        shouldRunDB = process.env.RUN_DB === 'true';
    }
    console.log(`DB Token Setup: ENV=${env}, RUN_DB=${process.env.RUN_DB}, shouldRunDB=${shouldRunDB}`);
    if (shouldRunDB && !isCI) {
        console.log(`🔐 Generating DB token (ENV=${env})`);

        try {
            const token = execSync(
                'az account get-access-token --resource-type oss-rdbms --query accessToken --output tsv'
            )
                .toString()
                .trim();

            process.env.DB_ACCESS_TOKEN = token;
            console.log('✅ DB token ready');

            if (env === 'dev' || env === 'qa') {
                const dbClient = await createClient(env);
                await dbClient.end();
                console.log('✅ DB client connection verified');
            } else {
                console.log(`⏭️ Skipping DB client verification for ENV=${env}`);
            }
        } catch (error) {
            console.error('❌ Token generation failed');
            throw error;
        }
    } else {
        console.log('⏭️ Skipping DB token generation (CI or RUN_DB disabled)');
    }

    // ---------------------------
    // 🌐 COOKIE SETUP
    // ---------------------------
    if (!isCI) {
        console.log('🌐 Running cookie setup (local only)');

        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        const baseURL = config.projects[0]?.use?.baseURL || '/';

        await page.goto(baseURL);
        await page.waitForLoadState();

        await browser.close();
    } else {
        console.log('⏭️ Skipping cookie setup in CI');
    }
}

export default globalCookieSetup;