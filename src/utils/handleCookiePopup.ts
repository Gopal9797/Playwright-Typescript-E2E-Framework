import { expect, Page } from '@playwright/test';
import log from '../../src/utils/Logger';


export async function handleCookiePopup(page: Page) {
    console.log('*** Handle Cookies Popup Function Running! ***');
    const cookieAcceptAllCookieSelector = page.getByText('Accept All Cookies', { exact: true }).last();
    // const cookieGainSightSelector = page.getByText('Got it');
    
    // await expect(cookieAcceptAllCookieSelector).toBeVisible({ timeout: 10000 });

    if (await (cookieAcceptAllCookieSelector).isVisible()) {
        await cookieAcceptAllCookieSelector.click()
        log.info('Accepted all cookies');
    }
    // if (await (cookieGainSightSelector).isVisible()) {
    //     await cookieGainSightSelector.click()
    //     log.info('Clicked on Got It');
    // }

    await page.waitForTimeout(500);// Wait for a small amount of time or for the page to reload after cookie acceptance
}