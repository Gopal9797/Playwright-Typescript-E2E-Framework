export const testConfig = {
    qa: {
        dxpui: ``,
        salesforce: ``,
        axp: ``,
        iamDeviceBaseUrl: ``,
    },

    dev: {
        dxpui: ``,
        salesforce: ``,
        axp: ``,
        iamDeviceBaseUrl: ``,
    },
    sit: {
        dxpui: ``,
        salesforce: ``,
        axp: ``,
        iamDeviceBaseUrl: ``,
    },
    uat: {
        dxpui: ``,
        salesforce: ``,
        axp: ``,
        iamDeviceBaseUrl: ``,
    },

    // Increase default wait-for-element timeout from 120000 (2 minutes)
    // to 1200000 (20 minutes). Prefer fixing locators/waits for stability
    // rather than relying on long global waits.
    waitForElement: 120000,
};
