import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../lib/pageObjects/loginPage.po';
import { DashboardPage } from '../lib/pageObjects/dashboardPage.po';
import { credentials } from '../config/environments';
import { XrayHelper } from 'xray-report/lib/xrayHelper';
import { PageHelper } from '../lib/helpers/pageHelper';
import { PageVideoCapture, saveVideo } from 'playwright-video';

test.describe('login suite', () => {
    let login: LoginPage;
    let dashboard: DashboardPage;
    let page: Page;
    let capture: PageVideoCapture;
    const username = credentials.admin.username;
    const password = credentials.admin.password;
    const userInv = credentials.incorrect_user.username;
    const passInv = credentials.incorrect_user.password;
    const incorrectCredsWarning = 'Unable to sign in';

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

        if (testInfo.project.name != 'Edge') {
            const filePath = XrayHelper.getVideoFilePath(testInfo);
            capture = await saveVideo(page, filePath, { followPopups: true, fps: 10 });
        }
    });

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.project.name != 'Edge') {
            await capture.stop();
            await XrayHelper.attachVideoCapture(testInfo);
        }
        await page.close();
    });

    test('@SB-XXXX login test with valid credentials', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Login - User can login with valid credentials',
            'User inputs valid credentials and proceeds to the Security dashboard.'
        );

        await login.navigateTo();

        const newLogin = await login.altUserNameInput.isVisible({
            timeout: 60000,
        }).catch(() => false);

        if (newLogin) {
            await login.altUserNameInput.fill(username);
        } else {
            await login.userNameInput.fill(username);
        }
        await login.nextButton.click();

        await expect(login.passwordInput).toBeVisible();

        await login.passwordInput.fill(password);
        await XrayHelper.addScreenshot(test.info(), page, 'check-login');

        await login.signInButton.click();

        await PageHelper.waitForPageLoad(page);
        await XrayHelper.addScreenshot(test.info(), page, 'dashboard-loaded');

        // Verify user is on the dashboard and not showing access denied
        const isAccessDenied = await dashboard.isAccessDenied();
        expect(isAccessDenied).toBe(false);

        // Logout
        await dashboard.logout();
        await PageHelper.waitForPageLoad(page);
    });

    test('@SB-XXXX negative login test with invalid credentials', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Login - User cannot login with invalid credentials',
            'User inputs invalid credentials and an error message is shown.'
        );

        await login.login(userInv, passInv, false);

        await expect(login.loginErrorPanel).toContainText(incorrectCredsWarning);
        await XrayHelper.addScreenshot(
            test.info(),
            page,
            'check-sign-in-button-and-warning-label'
        );
    });

    test('@SB-XXXX login with no permissions', async () => {
        XrayHelper.addTestInfo(
            test.info(),
            'SB-XXXX',
            '[Auto] Security - Login - Login with no permissions',
            'User logs in with valid username and password but without permissions for Security app.'
        );

        const noPermUsername = credentials.noPermissionsUser.username;
        const noPermPassword = credentials.noPermissionsUser.password;

        await login.login(noPermUsername, noPermPassword);
        await PageHelper.waitForPageLoad(page);

        // Should see access denied message
        const isAccessDenied = await dashboard.isAccessDenied();
        expect(isAccessDenied).toBe(true);

        await XrayHelper.addScreenshot(
            test.info(),
            page,
            'check-access-denied-message'
        );
    });
});
