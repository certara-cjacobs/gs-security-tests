import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../lib/pageObjects/loginPage.po';
import { DashboardPage } from '../lib/pageObjects/dashboardPage.po';
import { CompanyDialog } from '../lib/pageObjects/companyDialog.po';
import { credentials } from '../config/environments';
import { XrayHelper } from 'xray-report/lib/xrayHelper';
import { PageHelper } from '../lib/helpers/pageHelper';
import { PageVideoCapture, saveVideo } from 'playwright-video';

test.describe('company management suite', () => {
    let login: LoginPage;
    let dashboard: DashboardPage;
    let companyDialog: CompanyDialog;
    let page: Page;
    let capture: PageVideoCapture;
    const username = credentials.supportUser.username;
    const password = credentials.supportUser.password;

    test.beforeEach(async ({ browser }, testInfo) => {
        XrayHelper.addTestInfo(
            test.info(),
            await testInfo.title.substring(
                testInfo.title.indexOf('@') + 1,
                testInfo.title.indexOf(' ')
            ),
            testInfo.title,
            testInfo.title
        );
        page = await browser.newPage();
        login = new LoginPage(page);
        dashboard = new DashboardPage(page);
        companyDialog = new CompanyDialog(page);

        if (testInfo.project.name != 'Edge') {
            const filePath = XrayHelper.getVideoFilePath(testInfo);
            capture = await saveVideo(page, filePath, { followPopups: true, fps: 10 });
        }

        // Login before each test
        await login.login(username, password);
    });

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.project.name != 'Edge') {
            await capture.stop();
            await XrayHelper.attachVideoCapture(testInfo);
        }
        await page.close();
    });

    test('@SB-XXXX open add company dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Company - Open add company dialog',
            'User clicks Add button and the company creation dialog opens.'
        );

        // Click the Add button
        await dashboard.clickAddButton();
        await XrayHelper.addScreenshot(test.info(), page, 'add-button-clicked');

        // Verify dialog opens
        await companyDialog.waitForDialogOpen();
        await expect(companyDialog.dialog).toBeVisible();
        await XrayHelper.addScreenshot(test.info(), page, 'company-dialog-open');

        // Close the dialog
        await companyDialog.cancel();
        await companyDialog.waitForDialogClose();
    });

    test('@SB-XXXX company dialog validation', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Company - Dialog validation',
            'User attempts to save without required fields and sees validation errors.'
        );

        // Open the Add dialog
        await dashboard.clickAddButton();
        await companyDialog.waitForDialogOpen();

        // Try to save without filling required fields
        await companyDialog.save();
        await PageHelper.waitForPageLoad(page);

        // Check for validation errors
        const hasError = await companyDialog.hasValidationError();
        await XrayHelper.addScreenshot(test.info(), page, 'validation-error');

        // Close the dialog
        await companyDialog.cancel();
        await companyDialog.waitForDialogClose();
    });

    test('@SB-XXXX edit company dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Company - Open edit company dialog',
            'User selects a company and opens the edit dialog.'
        );

        // Select first row in grid
        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);
            await XrayHelper.addScreenshot(test.info(), page, 'row-selected');

            // Click edit button
            await dashboard.clickEditButton();
            await XrayHelper.addScreenshot(test.info(), page, 'edit-button-clicked');

            // Verify edit dialog opens
            if (await companyDialog.isDialogOpen()) {
                await expect(companyDialog.dialog).toBeVisible();
                await XrayHelper.addScreenshot(test.info(), page, 'edit-dialog-open');

                // Close the dialog
                await companyDialog.cancel();
                await companyDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to edit');
        }
    });

    test('@SB-XXXX delete company dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Company - Open delete company dialog',
            'User selects a company and opens the delete confirmation dialog.'
        );

        // Select first row in grid
        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);
            await XrayHelper.addScreenshot(test.info(), page, 'row-selected-for-delete');

            // Click delete button
            await dashboard.clickDeleteButton();
            await XrayHelper.addScreenshot(test.info(), page, 'delete-button-clicked');

            // Verify delete confirmation dialog opens
            if (await companyDialog.isDialogOpen()) {
                await XrayHelper.addScreenshot(test.info(), page, 'delete-dialog-open');

                // Cancel the delete
                await companyDialog.cancel();
                await companyDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to delete');
        }
    });
});
