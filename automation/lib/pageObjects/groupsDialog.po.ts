import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './basePage.po';

export class GroupsDialog extends BasePage {
    readonly about: string;

    // Dialog container
    readonly dialog: Locator;
    readonly dialogTitle: Locator;

    // Group list/selection
    readonly groupList: Locator;
    readonly groupItems: Locator;
    readonly searchInput: Locator;

    // Action buttons
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly closeButton: Locator;
    readonly addGroupButton: Locator;
    readonly removeGroupButton: Locator;

    constructor(page: Page) {
        super(page);
        this.about = 'Groups Dialog';

        // MUI Dialog
        this.dialog = page.locator('[role="dialog"]');
        this.dialogTitle = this.dialog.locator('.MuiDialogTitle-root');

        // Group list elements
        this.groupList = this.dialog.locator('.MuiList-root').or(this.dialog.locator('[role="listbox"]'));
        this.groupItems = this.dialog.locator('.MuiListItem-root').or(this.dialog.locator('[role="option"]'));
        this.searchInput = this.dialog.getByPlaceholder(/search/i);

        // Action buttons
        this.saveButton = this.dialog.getByRole('button', { name: /save|apply|submit/i });
        this.cancelButton = this.dialog.getByRole('button', { name: /cancel/i });
        this.closeButton = this.dialog.locator('[aria-label="close"]').or(
            this.dialog.getByRole('button', { name: /close/i })
        );
        this.addGroupButton = this.dialog.getByRole('button', { name: /add/i });
        this.removeGroupButton = this.dialog.getByRole('button', { name: /remove/i });
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

    async getGroupCount(): Promise<number> {
        await this.groupItems.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
            // No groups visible
        });
        return await this.groupItems.count();
    }

    async selectGroup(groupName: string) {
        const groupItem = this.dialog.getByText(groupName, { exact: false });
        await groupItem.click();
    }

    async searchGroups(searchText: string) {
        await this.searchInput.fill(searchText);
        await this.page.waitForTimeout(300);
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

    async getDialogTitle(): Promise<string | null> {
        return await this.dialogTitle.textContent();
    }
}
