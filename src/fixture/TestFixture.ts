import { VolumeDiscountPage } from '../pages/VolumeDiscountPage';
import { LockRateDiscretionaryDiscountPage } from '../pages/LockRateDiscretionaryDiscountPage';
import { TariffSurchargePage } from '../pages/TariffSurchargePage';
import { DealerInitiatedTrialsPage } from '../pages/DealerInitiatedTrialsPage';
import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage';
import { ContractsPage } from '../pages/ContractsPage';
import { CustomerSelectionPage } from '../pages/CustomerSelectionPage'
import { TermsPage } from '../pages/TermsPage';
import { ProductsPage } from '../pages/ProductsPage';
import { SummaryScreenPage } from '../pages/ContractSummaryScreenPage';
import { SidesheetPage } from '../pages/SidesheetPage';
import { OrderNotificationsPage } from '../pages/OrderNotificationsPage';
import { CreateAmendmentPage } from '../pages/CreateAmendmentPage';
import { AmendmentSummaryPage } from '../pages/AmendmentSummaryPage';
import { ContractHistoryPage } from '../pages/ContractHistoryPage';
import { AuditLogPage } from '../pages/AuditLogPage';
import { DealerMembersPage } from '../pages/DealerMembersPage';
import { RenewalPlanningTab } from '../pages/RenewalPlanningTab';
import { PromoCodesPage } from '../pages/Promocodes';
import { SalesforcePage } from '../salesforce/SalesforcePage';
import { SearchCustomer } from '../pages/SearchCustomer';
import { RegeneratePricingPage } from '../pages/RegeneratePricingPage';
import { commonSqlQueries } from '../pages/commonSqlQueries';
import { GraphQLClient } from '../api/GraphQLClient';
import { DevicesApi } from '../api/devices/DevicesApi';
import { CustomerApi } from '../api/customer/CustomerApi';
import { CustomerUsersApi } from '../api/customerUsers/customerUsersApi';
import { DevicePage } from '../pages/DevicePage';
import { InvoicePage } from '../pages/InvoicePage';
import { DCountryPage } from '../pages/DCountryPage';
import { AutoRenewalSettingsPage } from '../pages/AutoRenewalSettingsPage';
import { CustomersPage } from '../pages/customer/CustomersPage';
import { RenewalSummaryPage } from '../pages/RenewalSummaryPage';
import { CustomerAccountMembersPage } from '../pages/CustomerAccountMembersPage';
import { NotificationsSettingsPage } from '../pages/NotificationsSettingsPage';
import { RolesAndPermissionsPage } from '../pages/RolesAndPermissionsPage';
import { SuperAdminPage } from '../pages/SuperAdminPage';
import { HomePageNew } from '../pages/HomePageNew';
import { DashboardPage } from '../pages/DashboardPage';
import { OwnerInfoPage } from '../pages/customer/OwnerInfoPage';
import { CompanyInfoPage } from '../pages/customer/CompanyInfoPage';
import { CustomerDetailsPage } from '../pages/customer/CustomerDetailsPage';
import { TrcpsPage } from '../pages/TrcpsPage';
import { NotificationPopup } from '../pages/common/NotificationPopup';

export const test = base.extend<{
    loginPage: LoginPage;
    homePage: HomePage;
    contractsPage: ContractsPage;
    customerSelectionPage: CustomerSelectionPage
    termsPage: TermsPage;
    productsPage: ProductsPage;
    summaryScreenPage: SummaryScreenPage;
    sidesheetPage: SidesheetPage;
    orderNotificationsPage: OrderNotificationsPage
    createAmendmentPage: CreateAmendmentPage
    amendmentSummaryPage: AmendmentSummaryPage
    contractHistoryPage: ContractHistoryPage
    auditLogPage: AuditLogPage
    dealerMembersPage: DealerMembersPage
    renewalPlanningTab: RenewalPlanningTab
    promoCodesPage: PromoCodesPage;
    salesforcePage: SalesforcePage;
    searchCustomer: SearchCustomer;
    regeneratePricingPage: RegeneratePricingPage;
    commonSqlQueries: commonSqlQueries;
    graphQLClient: GraphQLClient;
    devicesApi: DevicesApi;
    customerApi: CustomerApi;
    customerUsersApi: CustomerUsersApi;
    devicePage: DevicePage;
    invoicePage: InvoicePage;
    autorenewalPage: AutoRenewalSettingsPage;
    customersPage: CustomersPage;
    tariffSurcharge: TariffSurchargePage;
    volumeDiscount: VolumeDiscountPage;
    dealerInitiatedTrials: DealerInitiatedTrialsPage;
    dCountryPage: DCountryPage;
    renewalSummaryPage: RenewalSummaryPage;
    lockRateDiscretionaryDiscount: LockRateDiscretionaryDiscountPage;
    customerAccountMembersPage: CustomerAccountMembersPage;
    notificationsSettings: NotificationsSettingsPage;
    rolesAndPermissions: RolesAndPermissionsPage;
    superAdminPage: SuperAdminPage;
    homePageNew: HomePageNew;
    dashboardPage: DashboardPage;
    customerDetailsPage: CustomerDetailsPage;
    OwnerInfoPage: OwnerInfoPage;
    CompanyInfoPage: CompanyInfoPage;
    trcpsPage: TrcpsPage;
    notificationPopup: NotificationPopup;
}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    contractsPage: async ({ page }, use) => {
        await use(new ContractsPage(page));
    },
    customerSelectionPage: async ({ page }, use) => {
        await use(new CustomerSelectionPage(page));
    },
    termsPage: async ({ page }, use) => {
        await use(new TermsPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    summaryScreenPage: async ({ page }, use) => {
        await use(new SummaryScreenPage(page));
    },
    sidesheetPage: async ({ page }, use) => {
        await use(new SidesheetPage(page));
    },
    orderNotificationsPage: async ({ page }, use) => {
        await use(new OrderNotificationsPage(page));
    },
    createAmendmentPage: async ({ page }, use) => {
        await use(new CreateAmendmentPage(page));
    },
    amendmentSummaryPage: async ({ page }, use) => {
        await use(new AmendmentSummaryPage(page));
    },
    contractHistoryPage: async ({ page }, use) => {
        await use(new ContractHistoryPage(page));
    },
    auditLogPage: async ({ page }, use) => {
        await use(new AuditLogPage(page));
    },
    dealerMembersPage: async ({ page }, use) => {
        await use(new DealerMembersPage(page));
    },
    renewalPlanningTab: async ({ page }, use) => {
        await use(new RenewalPlanningTab(page));
    },
    notificationPopup: async ({ page }, use) => {
        await use(new NotificationPopup(page));
    },
    promoCodesPage: async ({ page }, use) => {
        await use(new PromoCodesPage(page));
    },
    salesforcePage: async ({ page }, use) => {
        await use(new SalesforcePage(page));
    },
    searchCustomer: async ({ page }, use) => {
        await use(new SearchCustomer(page));
    },
    regeneratePricingPage: async ({ page }, use) => {
        await use(new RegeneratePricingPage(page));
    },
    commonSqlQueries: async ({ page }, use) => {
        await use(new commonSqlQueries(page));
    },
    graphQLClient: async ({ request }, use) => {
        await use(new GraphQLClient(request));
    },
    devicesApi: async ({ graphQLClient }, use) => {
        await use(new DevicesApi(graphQLClient));
    },
    customerApi: async ({ graphQLClient }, use) => {
        await use(new CustomerApi(graphQLClient));
    },
    customerUsersApi: async ({ graphQLClient }, use) => {
        await use(new CustomerUsersApi(graphQLClient));
    },
    customerAccountMembersPage: async ({ page }, use) => {
        await use(new CustomerAccountMembersPage(page));
    },
    devicePage: async ({ page }, use) => {
        await use(new DevicePage(page));
    },
    invoicePage: async ({ page }, use) => {
        await use(new InvoicePage(page));
    },
    autorenewalPage: async ({ page }, use) => {
        await use(new AutoRenewalSettingsPage(page));
    },
    customersPage: async ({ page }, use) => {
        await use(new CustomersPage(page));
    },
    tariffSurcharge: async ({ page }, use) => {
        await use(new TariffSurchargePage(page));
    },
    volumeDiscount: async ({ page }, use) => {
        await use(new VolumeDiscountPage(page));
    },
    dealerInitiatedTrials: async ({ page }, use) => {
        await use(new DealerInitiatedTrialsPage(page));
    },
    dCountryPage: async ({ page }, use) => {
        await use(new DCountryPage(page));
    },
    renewalSummaryPage: async ({ page }, use) => {
        await use(new RenewalSummaryPage(page));
    },
    lockRateDiscretionaryDiscount: async ({ page }, use) => {
        await use(new LockRateDiscretionaryDiscountPage(page));
    },
    notificationsSettings: async ({ page }, use) => {
        await use(new NotificationsSettingsPage(page));
    },
    rolesAndPermissions: async ({ page }, use) => {
        await use(new RolesAndPermissionsPage(page));
    },
    superAdminPage: async ({ page }, use) => {
        await use(new SuperAdminPage(page));
    },
    homePageNew: async ({ page }, use) => {
        await use(new HomePageNew(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    customerDetailsPage: async ({ page }, use) => {
        await use(new CustomerDetailsPage(page));
    },
    OwnerInfoPage: async ({ page }, use) => {
        await use(new OwnerInfoPage(page));
    },
    CompanyInfoPage: async ({ page }, use) => {
        await use(new CompanyInfoPage(page));
    },
    trcpsPage: async ({ page }, use) => {
        await use(new TrcpsPage(page));
    }
})
// export { expect } from '@playwright/test'
export default test;
