import { QueryResult, QueryResultRow } from 'pg';
import * as dotenv from 'dotenv';
import { createClient, DbEnv } from './globalCookieSetup';

dotenv.config();

/**
 * Resolve environment (default → dev)
 */
function getEnv(): DbEnv {
    return (process.env.ENV as DbEnv) || 'qa';
}

/**
 * 🔥 Generic Query Executor
 */
export async function executeQuery<T extends QueryResultRow = any>(
    query: string,
    values: any[] = [],
    env?: DbEnv
): Promise<QueryResult<T>> {
    const resolvedEnv = env || getEnv();
    const client = await createClient(resolvedEnv);

    try {
        if (process.env.DEBUG_DB === 'true') {
            console.log(`[DB:${resolvedEnv}] ${query}`);
        }

        return await client.query<T>(query, values);
    } catch (error) {
        console.error(`[DB ERROR - ${resolvedEnv}]`, error);
        throw error;
    } finally {
        await client.end();
    }
}