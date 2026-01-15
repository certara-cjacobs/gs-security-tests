import { expect, Locator, Page } from '@playwright/test';
import { base_url } from '../../config/environments';
import { PageHelper } from '../helpers/pageHelper';

export class LoginPage {
    readonly about: string;
    readonly page: Page;
    readonly pageTitle: Locator;

    // Okta login form elements
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly loginErrorPanel: Locator;

    // Alternative Okta login form elements (newer Okta UI)
    readonly altUserNameInput: Locator;
    readonly nextButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('head > title');
        this.about = 'Login Page';

        // Okta login form selectors
        this.altUserNameInput = page.locator('input[name="fromURI"]');
        this.nextButton = page.locator('input[value="Next"]');
        this.userNameInput = page.locator('input[name="identifier"]');
        this.passwordInput = page.locator('input[name="credentials.passcode"]');
        this.signInButton = page.locator('input[value="Verify"]');
        this.loginErrorPanel = page.locator(
            '#signin-container .okta-form-infobox-error'
        );
    }

    async navigateTo() {
        await this.page.goto(base_url);

        console.log('Navigation to ' + this.about + ' successful');
        try {
            await this.page.goto(base_url, { waitUntil: 'networkidle' });
            await PageHelper.waitForPageLoad(this.page);
        } catch {
            await expect(this.page.url()).toContain('okta');
            await PageHelper.waitForPageLoad(this.page);
        }
    }

    /**
     * Performs login with provided credentials
     * @param login - Username/email
     * @param password - Password
     * @param expectSuccess - Whether login is expected to succeed (default: true)
     */
    async login(login: string, password: string, expectSuccess = true) {
        await this.navigateTo();

        const newLogin = await this.altUserNameInput.isVisible({
            timeout: 60000,
        }).catch(() => false);

        if (newLogin) {
            await this.altUserNameInput.fill(login);
            await this.nextButton.click();
        } else {
            await this.userNameInput.fill(login);
            await this.nextButton.click();
        }

        await expect(this.passwordInput).toBeVisible({ timeout: 30000 });
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        await PageHelper.waitForPageLoad(this.page);

        if (expectSuccess) {
            await expect(this.page).toHaveURL(new RegExp(base_url.replace(/\/$/, '')), { timeout: 30000 });
        }
    }
}
