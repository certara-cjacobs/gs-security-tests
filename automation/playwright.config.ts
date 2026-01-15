import { PlaywrightTestConfig } from '@playwright/test';

const xrayOptions = {
    outputFile: './test-results/xray-report.json',
};

const config: PlaywrightTestConfig = {
    projects: [
        {
            name: 'Chrome',
            use: {
                browserName: 'chromium',
                headless: true,
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                trace: {
                    mode: 'retain-on-failure',
                    snapshots: true,
                    screenshots: true,
                    sources: true,
                },
                launchOptions: {},
                actionTimeout: 60 * 1000,
                navigationTimeout: 60 * 1000,
            },
        },
        {
            name: 'Firefox',
            use: {
                browserName: 'firefox',
                headless: true,
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                trace: {
                    mode: 'retain-on-failure',
                    snapshots: true,
                    screenshots: true,
                    sources: true,
                },
                launchOptions: { slowMo: 100 },
                actionTimeout: 60 * 1000,
                navigationTimeout: 60 * 1000,
            },
        },
        {
            name: 'Safari',
            use: {
                browserName: 'webkit',
                headless: true,
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                trace: {
                    mode: 'retain-on-failure',
                    snapshots: true,
                    screenshots: true,
                    sources: true,
                },
                launchOptions: { slowMo: 100 },
                actionTimeout: 60 * 1000,
                navigationTimeout: 60 * 1000,
            },
        },
        {
            name: 'Edge',
            use: {
                browserName: 'chromium',
                channel: 'msedge',
                headless: true,
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                trace: {
                    mode: 'retain-on-failure',
                    snapshots: true,
                    screenshots: true,
                    sources: true,
                },
                launchOptions: { slowMo: 100 },
                actionTimeout: 60 * 1000,
                navigationTimeout: 60 * 1000,
            },
        },
    ],
    testDir: './features',
    timeout: 480000,
    reporter: [['html'], ['xray-report\\lib\\xrayReporter', xrayOptions]],
    retries: 1,
    workers: 1,
    expect: {
        timeout: 60 * 1000,
    },
};

export default config;
