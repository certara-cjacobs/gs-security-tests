import { Page, expect } from '@playwright/test';
import { base_url } from '../../config/environments';
import { PageHelper } from './pageHelper';

export class AuthHelper {
    /**
     * Handles the Okta login flow for the Security application
     * @param page - Playwright page instance
     * @param username - User email/username
     * @param password - User password
     * @param expectSuccess - Whether login should succeed (default: true)
     */
    static async performOktaLogin(
        page: Page,
        username: string,
        password: string,
        expectSuccess = true
    ) {
        // Navigate to the Security app - will redirect to Okta
        await page.goto(base_url);
        await PageHelper.waitForPageLoad(page);

        // Wait for Okta login page to load
        const altUserNameInput = page.locator('input[name="fromURI"]');
        const userNameInput = page.locator('input[name="identifier"]');
        
        const isNewLogin = await altUserNameInput.isVisible({ timeout: 60000 }).catch(() => false);

        if (isNewLogin) {
            await altUserNameInput.fill(username);
        } else {
            await userNameInput.fill(username);
        }

        // Click Next button
        const nextButton = page.locator('input[value="Next"]');
        await nextButton.click();

        // Wait for password input
        const passwordInput = page.locator('input[name="credentials.passcode"]');
        await expect(passwordInput).toBeVisible({ timeout: 30000 });

        // Enter password
        await passwordInput.fill(password);

        // Click Sign In/Verify button
        const signInButton = page.locator('input[value="Verify"]');
        await signInButton.click();

        await PageHelper.waitForPageLoad(page);

        if (expectSuccess) {
            // Wait for redirect back to the Security app
            await page.waitForURL(new RegExp(base_url.replace(/\/$/, '')), { timeout: 30000 });
        }
    }

    /**
     * Performs logout from the Security application
     * @param page - Playwright page instance
     */
    static async performLogout(page: Page) {
        // Look for logout button in the navbar
        const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
        
        if (await logoutButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await logoutButton.click();
            await PageHelper.waitForPageLoad(page);
        }
    }

    /**
     * Checks if the user is currently authenticated
     * @param page - Playwright page instance
     * @returns true if user appears to be logged in
     */
    static async isAuthenticated(page: Page): Promise<boolean> {
        // Check if we're on the main Security app page (not Okta login)
        const currentUrl = page.url();
        return currentUrl.includes(base_url) && !currentUrl.includes('okta');
    }
}
