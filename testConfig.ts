export const testConfig = {
    qa: {
        dxpui: `https://feqa.dxp.trimble.com/`,
        salesforce: `https://trimbledx--feqa1.sandbox.lightning.force.com/`,
        axp: `https://feqa.accounts.trimble.com/`,
        iamDeviceBaseUrl: `https://cloud.stage.api.trimblecloud.com/platform/iam/1.0`,
    },

    dev: {
        dxpui: `https://fedev.dxp.trimble.com/`,
        salesforce: `https://trimbledx--fedev.sandbox.lightning.force.com/`,
        axp: `https://fedev.accounts.trimble.com/`,
        iamDeviceBaseUrl: `https://cloud.stage.api.trimblecloud.com/platform/iam/1.0`,
    },
    sit: {
        dxpui: `https://fesit.dxp.trimble.com/`,
        salesforce: `https://trimbledx--fesit1.sandbox.lightning.force.com/`,
        axp: `https://fesit.accounts.trimble.com/`,
        iamDeviceBaseUrl: `https://cloud.sit.api.trimblecloud.com/platform/iam/v1`,
    },
    uat: {
        dxpui: `https://feuat.dxp.trimble.com/`,
        salesforce: `https://trimbledx--feuat.sandbox.lightning.force.com/`,
        axp: `https://feuat.accounts.trimble.com/`,
        iamDeviceBaseUrl: `https://cloud.uat.api.trimblecloud.com/platform/iam/v1/`,
    },

    // Increase default wait-for-element timeout from 120000 (2 minutes)
    // to 1200000 (20 minutes). Prefer fixing locators/waits for stability
    // rather than relying on long global waits.
    waitForElement: 120000,
};
