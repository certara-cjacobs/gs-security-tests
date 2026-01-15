import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './basePage.po';

export class CompanyDialog extends BasePage {
    readonly about: string;

    // Dialog container
    readonly dialog: Locator;
    readonly dialogTitle: Locator;

    // Form fields
    readonly companyNameInput: Locator;
    readonly descriptionInput: Locator;
    readonly activeCheckbox: Locator;

    // Action buttons
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly closeButton: Locator;

    // Validation messages
    readonly validationError: Locator;

    constructor(page: Page) {
        super(page);
        this.about = 'Company Dialog';

        // MUI Dialog
        this.dialog = page.locator('[role="dialog"]');
        this.dialogTitle = this.dialog.locator('.MuiDialogTitle-root');

        // Form fields within the dialog
        this.companyNameInput = this.dialog.getByLabel(/company name|name/i);
        this.descriptionInput = this.dialog.getByLabel(/description/i);
        this.activeCheckbox = this.dialog.getByRole('checkbox', { name: /active/i });

        // Action buttons
        this.saveButton = this.dialog.getByRole('button', { name: /save|submit|create|update/i });
        this.cancelButton = this.dialog.getByRole('button', { name: /cancel/i });
        this.closeButton = this.dialog.locator('[aria-label="close"]').or(
            this.dialog.getByRole('button', { name: /close/i })
        );

        // Validation error messages
        this.validationError = this.dialog.locator('.MuiFormHelperText-root.Mui-error');
    }

    async waitForDialogOpen() {
        await expect(this.dialog).toBeVisible({ timeout: 10000 });
    }

    async waitForDialogClose() {
        await expect(this.dialog).not.toBeVisible({ timeout: 10000 });
    }

    async isDialogOpen(): Promise<boolean> {
        return await this.dialog.isVisible({ timeout: 2000 }).catch(() => false);
    }

    async fillCompanyName(name: string) {
        await this.companyNameInput.fill(name);
    }

    async fillDescription(description: string) {
        await this.descriptionInput.fill(description);
    }

    async toggleActive() {
        await this.activeCheckbox.click();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    async close() {
        await this.closeButton.click();
    }

    async getValidationErrorText(): Promise<string | null> {
        if (await this.validationError.isVisible({ timeout: 2000 }).catch(() => false)) {
            return await this.validationError.first().textContent();
        }
        return null;
    }

    async hasValidationError(): Promise<boolean> {
        return await this.validationError.isVisible({ timeout: 2000 }).catch(() => false);
    }

    async getDialogTitle(): Promise<string | null> {
        return await this.dialogTitle.textContent();
    }
}
