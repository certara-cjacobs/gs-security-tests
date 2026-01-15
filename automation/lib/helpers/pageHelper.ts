import { Page, TestInfo } from '@playwright/test';
import { XrayConstants } from 'xray-report/lib/xrayConstansts';

export class PageHelper {
    static async addScreenshot(
        testInfo: TestInfo,
        page: Page,
        fileName: string
    ) {
        const fileNameWithExtension = fileName.endsWith('.png')
            ? fileName
            : fileName + '.png';
        const path = testInfo.outputPath(fileNameWithExtension);
        const screenshot = await page.screenshot({ path });
        testInfo.attach(fileName, {
            body: screenshot,
            contentType: 'image/png',
        });
    }

    static async waitForPageLoad(page: Page) {
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
    }

    static addTestInfo(
        testInfo: TestInfo,
        testKey: string,
        jiraTitle: string,
        testDefinition: string
    ) {
        testInfo.annotations.push({
            type: XrayConstants.test_key,
            description: testKey,
        });
        testInfo.annotations.push({
            type: XrayConstants.testInfo_type,
            description: 'Automated',
        });
        testInfo.annotations.push({
            type: XrayConstants.testInfo_projectKey,
            description: 'SB',
        });
        testInfo.annotations.push({
            type: XrayConstants.testInfo_summary,
            description: jiraTitle,
        });
        testInfo.annotations.push({
            type: XrayConstants.testInfo_definition,
            description: testDefinition,
        });
    }
}
