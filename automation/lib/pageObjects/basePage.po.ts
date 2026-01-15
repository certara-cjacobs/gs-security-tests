import { Locator, Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;
    readonly loadingSpinner: Locator;

    constructor(page: Page) {
        this.page = page;
        // MUI Snackbar success message
        this.successMessage = page.locator('.MuiSnackbar-root .MuiAlert-standardSuccess');
        // MUI Snackbar error message
        this.errorMessage = page.locator('.MuiSnackbar-root .MuiAlert-standardError');
        // MUI CircularProgress loading spinner
        this.loadingSpinner = page.locator('.MuiCircularProgress-root');
    }

    async waitForLoadingComplete() {
        // Wait for any loading spinners to disappear
        await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {
            // Spinner may not exist, which is fine
        });
    }

    async getSuccessMessageText(): Promise<string | null> {
        if (await this.successMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
            return await this.successMessage.textContent();
        }
        return null;
    }

    async getErrorMessageText(): Promise<string | null> {
        if (await this.errorMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
            return await this.errorMessage.textContent();
        }
        return null;
    }
}
