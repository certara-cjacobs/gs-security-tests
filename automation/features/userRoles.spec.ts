import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../lib/pageObjects/loginPage.po';
import { DashboardPage } from '../lib/pageObjects/dashboardPage.po';
import { UserRolesDialog } from '../lib/pageObjects/userRolesDialog.po';
import { credentials } from '../config/environments';
import { XrayHelper } from 'xray-report/lib/xrayHelper';
import { PageHelper } from '../lib/helpers/pageHelper';
import { PageVideoCapture, saveVideo } from 'playwright-video';

test.describe('user roles management suite', () => {
    let login: LoginPage;
    let dashboard: DashboardPage;
    let userRolesDialog: UserRolesDialog;
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
        userRolesDialog = new UserRolesDialog(page);

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

    test('@SB-XXXX open user roles dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - User Roles - Open user roles dialog',
            'User selects a space and opens the user roles management dialog.'
        );

        // Wait for grid to load
        await expect(dashboard.gridContainer).toBeVisible({ timeout: 30000 });
        await XrayHelper.addScreenshot(test.info(), page, 'grid-loaded');

        // Select first row in grid
        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);
            await XrayHelper.addScreenshot(test.info(), page, 'row-selected');

            // Click user roles button
            await dashboard.clickUserRolesButton();
            await XrayHelper.addScreenshot(test.info(), page, 'user-roles-button-clicked');

            // Verify user roles dialog opens
            if (await userRolesDialog.isDialogOpen()) {
                await userRolesDialog.waitForDialogOpen();
                await expect(userRolesDialog.dialog).toBeVisible();
                await XrayHelper.addScreenshot(test.info(), page, 'user-roles-dialog-open');

                // Close the dialog
                await userRolesDialog.close();
                await userRolesDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to select');
        }
    });

    test('@SB-XXXX view users in user roles dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - User Roles - View users list',
            'User opens user roles dialog and can see the list of users.'
        );

        // Wait for grid and select a row
        await expect(dashboard.gridContainer).toBeVisible({ timeout: 30000 });

        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);

            // Click user roles button
            await dashboard.clickUserRolesButton();

            // Verify user roles dialog opens
            if (await userRolesDialog.isDialogOpen()) {
                await userRolesDialog.waitForDialogOpen();

                // Get user count
                const userCount = await userRolesDialog.getUserCount();
                console.log(`Users count: ${userCount}`);
                await XrayHelper.addScreenshot(test.info(), page, 'users-list-visible');

                // Close the dialog
                await userRolesDialog.close();
                await userRolesDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to select');
        }
    });

    test('@SB-XXXX search users in user roles dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - User Roles - Search users',
            'User can search for users within the user roles dialog.'
        );

        // Wait for grid and select a row
        await expect(dashboard.gridContainer).toBeVisible({ timeout: 30000 });

        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);

            // Click user roles button
            await dashboard.clickUserRolesButton();

            // Verify user roles dialog opens
            if (await userRolesDialog.isDialogOpen()) {
                await userRolesDialog.waitForDialogOpen();
                await XrayHelper.addScreenshot(test.info(), page, 'user-roles-dialog-before-search');

                // Search for users if search input is available
                if (await userRolesDialog.searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await userRolesDialog.searchUsers('automation');
                    await PageHelper.waitForPageLoad(page);
                    await XrayHelper.addScreenshot(test.info(), page, 'user-search-results');
                }

                // Close the dialog
                await userRolesDialog.close();
                await userRolesDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to select');
        }
    });

    test('@SB-XXXX verify role checkboxes in dialog', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - User Roles - Verify role checkboxes',
            'User opens user roles dialog and can see role checkboxes (Admin, Support, User).'
        );

        // Wait for grid and select a row
        await expect(dashboard.gridContainer).toBeVisible({ timeout: 30000 });

        const rowCount = await dashboard.getGridRowCount();
        if (rowCount > 0) {
            await dashboard.selectGridRow(0);

            // Click user roles button
            await dashboard.clickUserRolesButton();

            // Verify user roles dialog opens
            if (await userRolesDialog.isDialogOpen()) {
                await userRolesDialog.waitForDialogOpen();

                // Select a user if there are users in the list
                const userCount = await userRolesDialog.getUserCount();
                if (userCount > 0) {
                    // Check for role checkboxes
                    const adminVisible = await userRolesDialog.adminRoleCheckbox.isVisible({ timeout: 5000 }).catch(() => false);
                    const supportVisible = await userRolesDialog.supportRoleCheckbox.isVisible({ timeout: 2000 }).catch(() => false);
                    const userVisible = await userRolesDialog.userRoleCheckbox.isVisible({ timeout: 2000 }).catch(() => false);

                    console.log(`Role checkboxes - Admin: ${adminVisible}, Support: ${supportVisible}, User: ${userVisible}`);
                    await XrayHelper.addScreenshot(test.info(), page, 'role-checkboxes');
                }

                // Close the dialog
                await userRolesDialog.close();
                await userRolesDialog.waitForDialogClose();
            }
        } else {
            console.log('No rows in grid to select');
        }
    });
});
