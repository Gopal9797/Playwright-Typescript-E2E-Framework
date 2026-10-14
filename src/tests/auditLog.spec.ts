import { expect } from '@playwright/test';
import { test } from '../../src/fixture/TestFixture';

const defaultAuditLogConfig = {
    dealerId: '300000166572548',
    dealerName: 'ALLTERRA CENTRAL, INC'
};

const auditLogDealerIdOverride = process.env.AUDIT_LOG_DEALER_ID;
const auditLogDealerNameOverride = process.env.AUDIT_LOG_DEALER_NAME;

if ((auditLogDealerIdOverride && !auditLogDealerNameOverride) || (!auditLogDealerIdOverride && auditLogDealerNameOverride)) {
    throw new Error('AUDIT_LOG_DEALER_ID and AUDIT_LOG_DEALER_NAME must be set together.');
}

const auditLogConfig = auditLogDealerIdOverride && auditLogDealerNameOverride
    ? { dealerId: auditLogDealerIdOverride, dealerName: auditLogDealerNameOverride }
    : defaultAuditLogConfig;

test.describe('Audit Logs validations', () => {
    test.describe.configure({ mode: 'serial' });
    test.use({ storageState: '.auth/upgaccountuser.json' });

    test.beforeEach(async ({ auditLogPage }) => {
        await auditLogPage.gotoAuditLogs(auditLogConfig.dealerId, 30000);
    });

    test('navigates to audit logs and shows dealer defaults @DXP-T979 @DXP-T980 @DXP-T981 @DXP-T982 @DXP-T983', async ({ auditLogPage }) => {
        await auditLogPage.assertLoaded(30000);
        await auditLogPage.assertTableColumns();
        await auditLogPage.assertTimestampFormat();
        await auditLogPage.assertDefaultDateRange(30000);
        await auditLogPage.assertDealerSpecificPage(auditLogConfig.dealerId, auditLogConfig.dealerName, 30000);
        expect(await auditLogPage.getResultTotal()).toBeGreaterThan(0);
    });

    test('supports audit log filters and reset @DXP-T984 @DXP-T985 @DXP-T986 @DXP-T987 @DXP-T988 @DXP-T991', async ({ auditLogPage }) => {
        const last7DaysTotal = await auditLogPage.getResultTotal();

        await auditLogPage.setIncludeSystemOperations(false, 30000);
        const withoutSystemTotal = await auditLogPage.getResultTotal();
        expect(withoutSystemTotal).toBeLessThanOrEqual(last7DaysTotal);
        await auditLogPage.assertVisibleUserCellsExclude('System');

        await auditLogPage.setIncludeSystemOperations(true, 30000);
        const withSystemTotal = await auditLogPage.getResultTotal();
        expect(withSystemTotal).toBeGreaterThanOrEqual(withoutSystemTotal);

        await auditLogPage.selectDateRange('Last 1 year', 30000);
        const lastYearTotal = await auditLogPage.getResultTotal();
        expect(lastYearTotal).toBeGreaterThanOrEqual(last7DaysTotal);

        await auditLogPage.setIncludeSystemOperations(false, 30000);
        const userName = await auditLogPage.getFirstNonSystemUserName();
        await auditLogPage.selectUserFilter(userName, 30000);

        const eventName = await auditLogPage.getFirstVisibleEventName();
        await auditLogPage.selectEventFilter(eventName, 30000);

        await auditLogPage.resetFilters(30000);
        await auditLogPage.filterAuditLogsByCategory('Contract', 30000);
        await auditLogPage.resetFilters(30000);
    });

    test('navigates to linked records from category filtered audit rows @DXP-T992 @DXP-T993 @DXP-T994', async ({ auditLogPage, page }) => {
        await auditLogPage.selectDateRange('Last 1 year', 30000);
        await auditLogPage.navigateToFirstReferenceInCategory('Contract', /\/contracts\//, 30000);

        await auditLogPage.gotoAuditLogs(auditLogConfig.dealerId, 30000);
        await auditLogPage.selectDateRange('Last 1 year', 30000);
        await auditLogPage.navigateToFirstReferenceInCategory('Customer', /\/customers\//, 30000);

        await auditLogPage.gotoAuditLogs(auditLogConfig.dealerId, 30000);
        await auditLogPage.selectDateRange('Last 1 year', 30000);
        await auditLogPage.navigateToFirstReferenceInCategory('Device', /\/devices(?:\/|\?)/, 30000);

        await auditLogPage.gotoAuditLogs(auditLogConfig.dealerId, 30000);
        await auditLogPage.selectDateRange('Last 1 year', 30000);
        await auditLogPage.assertDealerCategoryEntry(auditLogConfig.dealerName, 30000);
        expect(page.url()).toContain(`/${auditLogConfig.dealerId}/audit-logs`);
    });

    test('expands and collapses audit log details @DXP-T1187 @DXP-T1188', async ({ auditLogPage }) => {
        await auditLogPage.expandFirstAuditLogRow(30000);
        await auditLogPage.collapseFirstAuditLogRow(30000);
    });
});