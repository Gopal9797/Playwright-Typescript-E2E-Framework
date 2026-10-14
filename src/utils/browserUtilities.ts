import { Locator, Page } from '@playwright/test';
import log from '../../src/utils/Logger';

/**
 * Utilities class provides common utility functions for interacting with web pages using Playwright.
 */
export class Utilities {
    page: Page;
    loc: Locator;
    sel1;
    sel2;

    /**
     * Creates a new Utilities instance.
     *
     * @param page - The Playwright Page instance on which interactions will occur.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Clicks an element on the page.
     *
     * @param selector - The selector or attribute value to locate the element.
     * @param locatorType - The type of locator (e.g., 'placeholder', 'locator', 'role', 'text').
     * @returns A boolean indicating whether the click was successful.
     */
    async clickElement(selector, locatorType: string) {
        try {
            await this.parseElement(this.page, selector, locatorType);
            await this.loc.first().click();
            return true;
        } catch (error) {
            log.error('Error clicking element:', error);
            return false;
        }
    }

    /**
     * Fills a value into an input element on the page.
     *
     * @param selector - The selector or attribute value to locate the element.
     * @param locatorType - The type of locator (e.g., 'placeholder', 'locator', 'role', 'text').
     * @param value - The value to be filled into the input element.
     * @returns A boolean indicating whether the value was successfully filled.
     */
    async fillValue(selector, locatorType: string, value: string) {
        try {
            await this.parseElement(this.page, selector, locatorType);
            await this.loc.first().fill(value);
            return true;
        } catch (error) {
            log.error('Error in filling value:', error);
            return false;
        }
    }

    /**
     * Takes a screenshot of an element on the page.
     *
     * @param selector - The selector or attribute value to locate the element.
     * @param locatorType - The type of locator (e.g., 'placeholder', 'locator', 'role', 'text').
     * @returns A boolean indicating whether the screenshot was successfully captured.
     */
    async elementScreenshot(selector: string, locatorType: string) {
        try {
            await this.parseElement(this.page, selector, locatorType);
            await this.loc.screenshot({ path: 'screenshot1.png' });
            return true;
        } catch (error) {
            log.error('Error in filling value:', error);
            return false;
        }
    }

    /**
     * Downloads a file after clicking an element.
     *
     * @param selector - The selector or attribute value to locate the element for clicking.
     * @param locatorType - The type of locator (e.g., 'placeholder', 'locator', 'role', 'text').
     * @param path - The path where the downloaded file should be saved.
     */
    async downloadFile(
        page: Page,
        selector: string,
        locatorType: string,
        path: string
    ) {
        const downloadPromise = this.page.waitForEvent('download');
        await this.clickElement(selector, locatorType);
        const download = await downloadPromise;
        log.info(await download.path());
        await download.saveAs(path);
    }

    async parseElement(page: Page, selector: string, locatorType: string) {
        switch (locatorType) {
            case 'placeholder':
                try {
                    this.loc = await page.getByPlaceholder(selector);
                } catch (e) {
                    log.error(
                        'Exception while clicking element' +
                        selector +
                        'Exception' +
                        e
                    );
                }
                break;
            case 'locator':
                try {
                    this.loc = await page.locator(selector);
                } catch (e) {
                    log.error(
                        'Exception while clicking element' +
                        selector +
                        'Exception' +
                        e
                    );
                }
                break;
            case 'role':
                try {
                    (this.sel1 = selector[0]),
                        (this.sel2 = selector[1]),
                        (this.loc = page.getByRole(this.sel1, this.sel2));
                } catch (e) {
                    log.error(
                        'Exception while clicking element' +
                        selector +
                        'Exception' +
                        e
                    );
                }
                break;
            case 'text':
                try {
                    this.loc = await page.getByText(selector);
                } catch (e) {
                    log.error(
                        'Exception while clicking element' +
                        selector +
                        'Exception' +
                        e
                    );
                }
                break;
        }
    }

    /**
     * Generates a random integer within the specified range [min, max].
     *
     * @param {number} min - The minimum value of the range (inclusive).
     * @param {number} max - The maximum value of the range (inclusive).
     * @returns {Promise<number>} A promise that resolves to the generated random number.
     *
     * @example
     * const randomNumber = await generateRandomNumber(100, 1000);
     * // Example output: 567
     */
    async generateRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generates a random email address by replacing a placeholder with a random number.
     *
     * @param {string} mailId - The base email address without the random number.
     * @returns {Promise<string>} A promise that resolves to the generated random email address.
     *
     * @example
     * const mailId = "axpautomationtesting";
     * const randomEmail = await generateRandomEmail(mailId);
     * // Example output: "axpautomationtesting+567@gmail.com"
     */
    async generateRandomEmail(mailId: string) {
        const randomNumber = this.generateRandomNumber(100, 10000);
        const emailTemplate = `${mailId}+{randomNumber}@gmail.com`;
        const randomEmail = emailTemplate.replace(
            '{randomNumber}',
            randomNumber.toString()
        );
        return randomEmail;
    }
    async uploadCSV(fileInputSelector: string, filePath: string) {
        const targetElementSelector = fileInputSelector;
        await this.page.setInputFiles(targetElementSelector, filePath);
    }
}

export default Utilities;
