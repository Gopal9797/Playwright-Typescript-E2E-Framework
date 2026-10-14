import type { Page, Request, Response } from '@playwright/test';
import { writeFileSync } from 'fs';

export async function captureNetworkActivity(page: Page, durationMs = 3000, outPath = '.auth/network_logs.json') {
    const networkLogs: Array<any> = [];

    const onRequest = (req: Request) => {
        try {
            networkLogs.push({
                type: 'request',
                url: req.url(),
                method: req.method(),
                headers: req.headers(),
                postData: req.postData(),
                timestamp: Date.now()
            });
        } catch (e) {
            // ignore
        }
    };

    const onResponse = async (res: Response) => {
        try {
            const req = res.request();
            let body: any = null;
            try {
                body = await res.json();
            } catch (e) {
                try {
                    body = await res.text();
                } catch (e2) {
                    body = '<unavailable>';
                }
            }
            networkLogs.push({
                type: 'response',
                url: res.url(),
                status: res.status(),
                headers: res.headers(),
                timestamp: Date.now(),
                request: {
                    url: req.url(),
                    method: req.method(),
                    postData: req.postData()
                },
                body
            });
        } catch (e) {
            // ignore
        }
    };

    page.on('request', onRequest as any);
    page.on('response', onResponse as any);

    // wait to collect activity
    await page.waitForTimeout(durationMs);

    // cleanup
    page.off('request', onRequest as any);
    page.off('response', onResponse as any);

    try {
        writeFileSync(outPath, JSON.stringify(networkLogs, null, 2), 'utf-8');
    } catch (e) {
        // swallow write errors but still return logs
        // eslint-disable-next-line no-console
        console.log('Failed to write network logs:', e);
    }

    return networkLogs;
}
