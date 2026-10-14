import { expect, Page } from "@playwright/test";
import { executeQuery } from '../../src/utils/postgresDBUtils';

export class commonSqlQueries {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Formats a Date as an IST timestamp string compatible with Postgres.
     * Example output: 2026-05-07 18:20:07.318 +0530
     * @param date - The UTC Date object to convert.
     * @returns A formatted IST timestamp string.
     */
    private formatAsIstTimestamp(date: Date): string {
        const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(date.getTime() + IST_OFFSET_MS);
        const pad = (n: number, digits = 2) => n.toString().padStart(digits, '0');

        return (
            `${istDate.getUTCFullYear()}-${pad(istDate.getUTCMonth() + 1)}-${pad(istDate.getUTCDate())} ` +
            `${pad(istDate.getUTCHours())}:${pad(istDate.getUTCMinutes())}:${pad(istDate.getUTCSeconds())}.` +
            `${pad(istDate.getUTCMilliseconds(), 3)} +0530`
        );
    }

    /**
     * Fetches the external_quote_id for the AMENDMENT_DRAFT quote belonging to the given contract.
     * @param contractId - The contract ID to look up.
     * @returns The external_quote_id string.
     * @throws If no AMENDMENT_DRAFT quote is found for the contract.
     */
    async getExternalQuoteIdByContractIdForAMENDMENT_DRAFT(contractId: string): Promise<string> {
        const query = `SELECT external_quote_id FROM dxp.contract.quote WHERE contract_id = $1 AND status = 'AMENDMENT_DRAFT' AND is_deleted = false`;
        const results = await executeQuery<{ external_quote_id: string }>(query, [contractId]);
        if (!results.rows.length || !results.rows[0].external_quote_id) {
            throw new Error(`No AMENDMENT_DRAFT quote found for contract_id: ${contractId}`);
        }
        console.log(`External Quote ID for contract ${contractId}: ${results.rows[0].external_quote_id}`);
        return results.rows[0].external_quote_id;
    }

    async getFirstPriceChangeAmendmentDraftContract(billToCdhAccountId: string): Promise<{ contractId: string; contractNumberSearch: string }> {
        const query = `
            SELECT q.contract_id, c.contract_number_search
            FROM dxp.contract.quote AS q
            INNER JOIN dxp.contract.contract_detail AS c ON c.id = q.contract_id
            WHERE q.status_change_reason = 'PRICE_CHANGE'
              AND q.status = 'AMENDMENT_DRAFT'
              AND q.is_deleted = false
              AND c.is_deleted = false
              AND c.bill_to_cdh_account_id = $1
            ORDER BY q.created_date DESC
            LIMIT 1`;
        const results = await executeQuery<{ contract_id: string; contract_number_search: string }>(query, [billToCdhAccountId]);
        if (!results.rows.length || !results.rows[0].contract_id || !results.rows[0].contract_number_search) {
            throw new Error(`No PRICE_CHANGE AMENDMENT_DRAFT quote found for bill_to_cdh_account_id: ${billToCdhAccountId}`);
        }

        const contract = results.rows[0];
        console.log(`Found PRICE_CHANGE AMENDMENT_DRAFT: contract_id=${contract.contract_id}, contract_number_search=${contract.contract_number_search}`);
        return {
            contractId: contract.contract_id,
            contractNumberSearch: contract.contract_number_search,
        };
    }

    /**
     * Fetches the last_price_updated_date for the given external quote.
     * @param externalQuoteId - The external quote ID to query.
     * @returns The last_price_updated_date as a Date object.
     * @throws If no matching record or date is found.
     */
    async getLastPriceUpdatedDateForExternalQuoteId(externalQuoteId: string): Promise<Date> {
        const query = `SELECT last_price_updated_date FROM dxp.contract.quote WHERE external_quote_id = $1`;
        const results = await executeQuery<{ last_price_updated_date: Date }>(query, [externalQuoteId]);
        if (!results.rows.length || !results.rows[0].last_price_updated_date) {
            throw new Error(`last_price_updated_date not found for external_quote_id: ${externalQuoteId}`);
        }
        console.log(`last_price_updated_date for ${externalQuoteId}: ${results.rows[0].last_price_updated_date}`);
        return new Date(results.rows[0].last_price_updated_date);
    }

    /**
     * Updates last_price_updated_date to exactly 2 days (48 hours) before the provided date
     * for the given external quote.
     * @param externalQuoteId - The external quote ID to update.
     * @param currentDate - The reference date from which to subtract 48 hours.
     * @returns void
     */
    async updateLastPriceUpdatedDateTwoDaysBack(externalQuoteId: string, currentDate: Date): Promise<void> {
        await this.updateLastPriceUpdatedDateHoursBack(externalQuoteId, currentDate, 48);
    }

    /**
     * Updates last_price_updated_date by subtracting the specified number of hours from the provided date
     * for the given external quote.
     * @param externalQuoteId - The external quote ID to update.
     * @param currentDate - The reference date from which to subtract hours.
     * @param hoursBack - Number of hours to subtract (default: 30).
     * @returns The number of rows affected.
     */
    async updateLastPriceUpdatedDateHoursBack(externalQuoteId: string, currentDate: Date, hoursBack = 30): Promise<number> {
        const staleDate = new Date(currentDate);
        staleDate.setHours(staleDate.getHours() - hoursBack);
        // Format: 2026-05-21 00:00:00.000 +0530
        const formattedDate = this.formatAsIstTimestamp(staleDate);
        const query = `UPDATE dxp.contract.quote SET last_price_updated_date = $1 WHERE external_quote_id = $2`;
        const result = await executeQuery(query, [formattedDate, externalQuoteId]);
        const rowsAffected = result.rowCount ?? 0;
        console.log(`Updated last_price_updated_date to ${formattedDate} for ${externalQuoteId}. Rows affected: ${rowsAffected}`);
        return rowsAffected;
    }

    /**
     * Sets the valid_until_date to yesterday and status to 'EXPIRED' for the RECEIVED positive_request
     * of the given contract, simulating an expired customer-initiated request.
     * @param contractId - The contract ID whose positive_request record should be updated.
     * @returns The number of rows affected.
     */
    async updateCustomerInitiatedValidUntilDate(contractId: string): Promise<number> {
        const validUntilDate = new Date();
        validUntilDate.setDate(validUntilDate.getDate() - 1); // Set valid until date to 1 day before now
        // Format: 2026-05-21 00:00:00.000 +0530
        const formattedDate = this.formatAsIstTimestamp(validUntilDate);
        const query = `UPDATE dxp.contract.positive_request SET valid_until_date = $1, status = 'EXPIRED'
         WHERE contract_id = $2 AND is_deleted = false AND status = 'RECEIVED'`;
        const result = await executeQuery(query, [formattedDate, contractId]);
        const rowsAffected = result.rowCount ?? 0;
        console.log(`Updated valid_until_date to ${formattedDate} for contract ${contractId}. Rows affected: ${rowsAffected}`);
        return rowsAffected;
    }

    /**
     * Updates approval_status for approval requests belonging to a contract.
     * @param contractId - The contract ID whose approval requests should be updated.
     * @param approvalStatus - The approval status to set.
     * @returns The number of rows affected.
     */
    async updateApprovalRequestStatus(contractId: string, approvalStatus: string): Promise<number> {
        const query = `UPDATE dxp.contract.approval_request
            SET approval_status = $1
            WHERE contract_id::uuid = $2::uuid`;
        const result = await executeQuery(query, [approvalStatus, contractId]);
        const rowsAffected = result.rowCount ?? 0;
        console.log(`Updated approval_request approval_status to ${approvalStatus} for contract ${contractId}. Rows affected: ${rowsAffected}`);
        return rowsAffected;
    }

    /**
     * Updates approval_status for quotes belonging to a contract.
     * @param contractId - The contract ID whose quotes should be updated.
     * @param approvalStatus - The approval status to set.
     * @returns The number of rows affected.
     */
    async updateQuoteApprovalStatus(contractId: string, approvalStatus: string): Promise<number> {
        const query = `UPDATE dxp.contract.quote
            SET approval_status = $1
            WHERE contract_id::uuid = $2::uuid`;
        const result = await executeQuery(query, [approvalStatus, contractId]);
        const rowsAffected = result.rowCount ?? 0;
        console.log(`Updated quote approval_status to ${approvalStatus} for contract ${contractId}. Rows affected: ${rowsAffected}`);
        return rowsAffected;
    }

    /**
     * Updates approval_status for a contract.
     * @param contractId - The contract ID whose approval status should be updated.
     * @param approvalStatus - The approval status to set.
     * @returns The number of rows affected.
     */
    async updateContractApprovalStatus(contractId: string, approvalStatus: string): Promise<number> {
        const query = `UPDATE dxp.contract.contract_detail
            SET approval_status = $1
            WHERE id::uuid = $2::uuid`;
        const result = await executeQuery(query, [approvalStatus, contractId]);
        const rowsAffected = result.rowCount ?? 0;
        console.log(`Updated contract approval_status to ${approvalStatus} for contract ${contractId}. Rows affected: ${rowsAffected}`);
        return rowsAffected;
    }


    /** D COUNTRY HOLD STATUS REASON VERIFICATION IN CONTRACT DB
     * Polls the database until the status_change_reason for the given contract matches the expected value,
     * or until the timeout is reached.
     * @param expectedStatusChangeReason - The expected value of status_change_reason.
     * @param contractNumber - The contract number to query (fetched from UI).
     * @param timeoutMs - Maximum wait time in milliseconds (default: 180000).
     * @param intervalMs - Polling interval in milliseconds (default: 5000).
     * @throws If no contract is found or the expected status is not reached within the timeout.
     */
    async verifyStatusChangeReasonInContractDB(expectedStatusChangeReason: string, contractNumber: string, timeoutMs = 300000, intervalMs = 5000) {
        const query = `SELECT status_change_reason FROM contract.contract_detail WHERE contract_number = $1`;
        const deadline = Date.now() + timeoutMs;
        let actualStatusChangeReason: string | undefined;

        while (Date.now() < deadline) {
            const result = await executeQuery<{ status_change_reason: string }>(query, [contractNumber]);

            if (!result.rows.length) {
                throw new Error(`No contract found in DB for contract_number: ${contractNumber}`);
            }

            actualStatusChangeReason = result.rows[0].status_change_reason;
            console.log(`status_change_reason from DB: ${actualStatusChangeReason}`);

            if (actualStatusChangeReason === expectedStatusChangeReason) {
                return;
            }

            await this.page.waitForTimeout(intervalMs);
        }

        expect(actualStatusChangeReason).toBe(expectedStatusChangeReason);
    }

}