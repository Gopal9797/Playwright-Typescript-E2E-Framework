import { expect, Locator, Page } from "@playwright/test";
import { executeQuery } from '../../src/utils/postgresDBUtils';

export class OrderNotificationsPage {
    readonly page: Page;
    readonly bellIcon: Locator;
    readonly NotificationDotIcon: Locator;
    readonly scrollBar: Locator;
    readonly orderStatusUpdatesText: Locator;
    readonly markAllAsReadButton: Locator;
    readonly notificationsList: Locator;
    readonly orderStatusList: Locator;
    readonly notificationsTime: Locator;
    readonly unreadNotificationIcon: Locator;
    readonly notificationTitles: Locator;
    readonly notificationDescriptions: Locator;
    readonly customerRequestNotification: Locator;
    readonly customerRequestDeletedNotification: Locator;

    constructor(page: Page) {
        this.page = page;
        this.bellIcon = page.locator('#notification-button').first();
        //this.NotificationDotIcon = page.locator('//*[@id="notification-button"]//span[contains(@class,"MuiBadge-badge")]');
        this.NotificationDotIcon = page.locator(
  '//*[@id="notification-button"]/following-sibling::span[contains(@class,"MuiBadge-root")]//span[contains(@class,"MuiBadge-badge")]'
);
        this.scrollBar = page.locator('.MuiDataGrid-scrollbar MuiDataGrid-scrollbar--vertical css-1ir2opr');
        this.orderStatusUpdatesText = page.getByText(/^(Notifications|Order Status Updates)$/);
        this.markAllAsReadButton = page.getByText('Mark all as read', { exact: true });
        this.notificationsList = page.getByText('The status of contract');
        this.orderStatusList = page.getByText('The status is now Submitted');
        this.notificationsTime = page.getByTestId('notification-item-time');
        this.unreadNotificationIcon = page.getByTestId('notification-badge');

        this.notificationTitles = page.locator('[data-testid="notification-item-title"]');
        this.notificationDescriptions = page.locator('[data-testid="notification-item-description"]');
        // <span class="MuiTypography-root MuiTypography-body2 MuiListItemText-primary css-3tz3j2" data-testid="notification-item-title">Dhanraj Vadivel has sent a request for contract 4592.</span>
        // <span class="MuiTypography-root MuiTypography-body2 MuiListItemText-primary css-3tz3j2" data-testid="notification-item-title">Customer request for contract 4674 has been deleted.</span>
        this.customerRequestDeletedNotification = page.getByText('has been deleted.', { exact: false });
        this.customerRequestNotification = page.getByText('has sent a request for contract', { exact: false });
    }

    async clickOnNotificationBellIcon() {
        await this.bellIcon.click();
    }
    async notificationAssertionAfterContractCreation(contractNumber: string) {
        await expect(this.bellIcon).toBeVisible();
        await expect(this.NotificationDotIcon).toBeVisible({ timeout: 120000 });
        await this.bellIcon.click();
        await expect(this.markAllAsReadButton).toBeVisible();
        await expect(this.orderStatusUpdatesText).toBeVisible();
        // await expect(this.unreadNotificationDotIcon).toBeVisible();
        console.log('Bell icon with unread notification is displayed');
        await expect(this.page.getByRole('link', { name: 'The status of contract ' + contractNumber + ' has changed' }).first()).toBeVisible();
        await this.page.getByRole('link', { name: 'The status of contract ' + contractNumber + ' has changed' }).first().click();
    }

    async markAllNotificationsAsRead() {
        await this.bellIcon.click();
        await this.markAllAsReadButton.click();
        await this.notificationIndicatorIsNotVisible();
        console.log('All notifications are marked as read and unread notification dot icon is not visible');
    }

    async notificationIndicatorIsVisible() {
        await expect(this.NotificationDotIcon).toBeVisible();
    }

    async notificationIndicatorIsNotVisible() {
        await expect(this.NotificationDotIcon).not.toBeVisible();
    }

    /**
     * Marks notifications as unread in the database for a specific contract and account
     * @param contractNumber - The contract number to filter notifications
     * @param accountId - The account ID to filter notifications
     * @param userId - The user ID to update notification status for
     * @returns Number of rows affected by the update query
     */
    async markNotificationsAsUnreadFromDB(contractNumber: string, accountId: string, userId: string): Promise<number> {
        // Step 1: Get notification IDs based on contract number, account ID, and status
        const selectQuery = `SELECT id, additional_properties, additional_properties::jsonb->>'Status' AS status
        FROM dxp.communication.app_notification WHERE account_id = $1
        AND additional_properties::jsonb->>'ContractNumber' = $2
        AND additional_properties::jsonb->>'Status' = ANY($3);`;

        console.log(`Step 1: Executing SELECT query to fetch notification IDs for Contract: ${contractNumber}, Account: ${accountId}`);
        const statuses = ['SUBMITTED', 'PENDING_ACTIVATION', 'ACTIVATED'];
        const result = await executeQuery<{ id: string }>(selectQuery, [accountId, contractNumber, statuses]);

        if (!result.rows.length) {
            console.log('No notifications found matching the criteria');
            return 0;
        }

        // Extract notification IDs from the result (id column)
        const notificationIds = result.rows.map((row) => row.id);
        console.log(`Found ${notificationIds.length} notification(s) with IDs: ${notificationIds.join(', ')}`);

        // Step 2: Update created_date in notifications table with current UTC datetime
        const currentUtcDateTime = new Date().toISOString().replace('T', ' ').replace('Z', '').substring(0, 23);
        const updateNotificationsQuery = `UPDATE dxp.communication.app_notification SET created_date = $1 WHERE id::text = ANY($2);`;

        console.log(`Step 2: Executing UPDATE query to set created_date to ${currentUtcDateTime}`);
        const notificationsUpdatedResult = await executeQuery(updateNotificationsQuery, [currentUtcDateTime, notificationIds]);
        const notificationsUpdated = notificationsUpdatedResult.rowCount ?? 0;
        console.log(`Updated created_date for ${notificationsUpdated} notification(s)`);

        // Step 3: Update notification status to UNREAD for the user
        const updateUserNotificationQuery = `UPDATE dxp.communication.user_notification_status
SET notification_status = 'UNREAD'
    WHERE user_id = $1 AND notification_id::text = ANY($2);`;

        console.log(`Step 3: Executing UPDATE query to mark notifications as UNREAD for user: ${userId}`);
        const updateUserNotificationResult = await executeQuery(updateUserNotificationQuery, [userId, notificationIds]);
        const rowsAffected = updateUserNotificationResult.rowCount ?? 0;
        console.log(`Successfully updated ${rowsAffected} notification(s) to UNREAD status`);

        return rowsAffected;
    }

    async verifyContractStatusNotificationsForActiveContractRecord(contractNumber: string) {

        const count = await this.notificationTitles.count();
        expect(count).toBeGreaterThan(2);
        //verifying titles text contains "The status of contract {contractNumber} has changed"
        for (let i = 0; i < 3; i++) {
            await expect(this.notificationTitles.nth(i))
                .toContainText(`The status of contract ${contractNumber} has changed`);
        }

        // Verify descriptions text
        await expect(this.notificationDescriptions.nth(0))
            .toHaveText('The status is now Submitted');

        await expect(this.notificationDescriptions.nth(1))
            .toHaveText('The status is now Pending Activation');

        await expect(this.notificationDescriptions.nth(2))
            .toHaveText('The status is now Active');

        console.log(`Verified top 3 status notifications for contract ${contractNumber}`);
    }

    async verifyCustomerRequestNotificationForContract(contractNumber: string) {
        await expect(this.NotificationDotIcon).toBeVisible({ timeout: 10000 });
        await this.bellIcon.click();

        const notification = this.customerRequestNotification
            .filter({ hasText: `has sent a request for contract ${contractNumber}` })
            .first();

        await expect(notification).toBeVisible({ timeout: 20000 });
        console.log(`Verified customer request notification for contract ${contractNumber}`);
        // click outside the notification panel to close it
        await this.page.mouse.click(0, 0);
    }

    async clickOnCustomerRequestNotification(contractNumber: string) {
        await expect(this.NotificationDotIcon).toBeVisible({ timeout: 5000 });
        await this.bellIcon.click();

        const notification = this.customerRequestNotification
            .filter({ hasText: `has sent a request for contract ${contractNumber}` })
            .first();

        await expect(notification).toBeVisible({ timeout: 5000 });
        await notification.click();
        console.log(`Clicked on customer request notification for contract ${contractNumber}`);
    }

    async verifyCustomerRequestDeletedNotificationForContract(contractNumber: string) {
        await expect(this.NotificationDotIcon).toBeVisible({ timeout: 5000 });
        await this.bellIcon.click();

        const notification = this.customerRequestDeletedNotification
            .filter({ hasText: `Customer request for contract ${contractNumber} has been deleted.` })
            .first();

        await expect(notification).toBeVisible({ timeout: 5000 });
        console.log(`Verified customer request deleted notification for contract ${contractNumber}`);
        // click outside the notification panel to close it
        await this.page.mouse.click(0, 0);
    }
}