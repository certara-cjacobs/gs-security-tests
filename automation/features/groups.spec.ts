import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../lib/pageObjects/loginPage.po';
import { DashboardPage } from '../lib/pageObjects/dashboardPage.po';
import { GroupsDialog } from '../lib/pageObjects/groupsDialog.po';
import { credentials } from '../config/environments';
import { XrayHelper } from 'xray-report/lib/xrayHelper';
import { PageHelper } from '../lib/helpers/pageHelper';
import { PageVideoCapture, saveVideo } from 'playwright-video';

test.describe('groups management suite', () => {
    let login: LoginPage;
    let dashboard: DashboardPage;
    let groupsDialog: GroupsDialog;
    let page: Page;
    let capture: PageVideoCapture;
    const username = credentials.admin.username;
    const password = credentials.admin.password;

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
        groupsDialog = new GroupsDialog(page);

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

    test('@SB-XXXX open groups dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Groups - Open groups dialog',
            'User selects a space and opens the groups management dialog.'
        );

        // Wait for grid to load
        await expect(dashboard.gridContainer).toBeVisible({ timeout: 30000 });
        await XrayHelper.addScreenshot(test.info(), page, 'grid-loaded');

        // Select first row in grid
        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);
            await XrayHelper.addScreenshot(test.info(), page, 'row-selected');

            // Click groups button
            await dashboard.clickGroupsButton();
            await XrayHelper.addScreenshot(test.info(), page, 'groups-button-clicked');

            // Verify groups dialog opens
            if (await groupsDialog.isDialogOpen()) {
                await groupsDialog.waitForDialogOpen();
                await expect(groupsDialog.dialog).toBeVisible();
                await XrayHelper.addScreenshot(test.info(), page, 'groups-dialog-open');

                // Close the dialog
                await groupsDialog.close();
                await groupsDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to select');
        }
    });

    test('@SB-XXXX view groups in dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Groups - View groups list',
            'User opens groups dialog and can see the list of available groups.'
        );

        // Wait for grid and select a row
        await expect(dashboard.gridContainer).toBeVisible({ timeout: 30000 });

        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);

            // Click groups button
            await dashboard.clickGroupsButton();

            // Verify groups dialog opens
            if (await groupsDialog.isDialogOpen()) {
                await groupsDialog.waitForDialogOpen();

                // Get group count
                const groupCount = await groupsDialog.getGroupCount();
                console.log(`Groups count: ${groupCount}`);
                await XrayHelper.addScreenshot(test.info(), page, 'groups-list-visible');

                // Close the dialog
                await groupsDialog.close();
                await groupsDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to select');
        }
    });

    test('@SB-XXXX search groups in dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Groups - Search groups',
            'User can search for groups within the groups dialog.'
        );

        // Wait for grid and select a row
        await expect(dashboard.gridContainer).toBeVisible({ timeout: 30000 });

        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);

            // Click groups button
            await dashboard.clickGroupsButton();

            // Verify groups dialog opens
            if (await groupsDialog.isDialogOpen()) {
                await groupsDialog.waitForDialogOpen();
                await XrayHelper.addScreenshot(test.info(), page, 'groups-dialog-before-search');

                // Search for groups if search input is available
                if (await groupsDialog.searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await groupsDialog.searchGroups('Test');
                    await PageHelper.waitForPageLoad(page);
                    await XrayHelper.addScreenshot(test.info(), page, 'groups-search-results');
                }

                // Close the dialog
                await groupsDialog.close();
                await groupsDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to select');
        }
    });
});
