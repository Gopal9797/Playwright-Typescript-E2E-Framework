import { test } from '../../src/fixture/TestFixture';
import dealercustomers from '../pages/dealercustomers.json'

test.describe('test Contract  ', () => {

  let contract_number: number;

  test.use({ storageState: '.auth/upgaccountuser.json' });

  test.beforeEach(async ({ page, homePage, contractsPage, amendmentSummaryPage }, testInfo) => {
    await page.goto('/');
    await homePage.navigateToContracts('kuk');
    const result = await contractsPage.selectActiveStatusContractFromDB(dealercustomers.kuk);
    if (!result[0].contract_number) {
      throw new Error('No contract_number returned from selectActiveStatusContractFromDB');
    }
    const workerIdx = testInfo.workerIndex;
    const safeIndex = workerIdx % result.length;
    const selectedContract = result[safeIndex].contract_number;
    console.log(`Worker ID: ${workerIdx} | Using Contract: ${selectedContract}`);
    contract_number = Number(selectedContract);
  });

  test('Select active status contract from DB', async ({ page, orderNotificationsPage }) => {

    await orderNotificationsPage.markAllNotificationsAsRead();

    const accountId = '300000015596844';
    const userId = '586191f1-26f7-46ba-bb09-33dbbd154d15';
    const contractNumberStr = contract_number.toString();

    const rowsAffected = await orderNotificationsPage.markNotificationsAsUnreadFromDB(contractNumberStr, accountId, userId);
    console.log(`Marked ${rowsAffected} notifications as unread in the database`);

    // Verify the notifications are now visible as unread in the UI
    await page.reload();
    await orderNotificationsPage.notificationIndicatorIsVisible();
    console.log('Unread notification dot icon is now visible after marking notifications as unread from DB');

    await orderNotificationsPage.clickOnNotificationBellIcon();

    await orderNotificationsPage.verifyContractStatusNotificationsForActiveContractRecord(contractNumberStr);

  });
});