import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './basePage.po';

export class UserRolesDialog extends BasePage {
    readonly about: string;

    // Dialog container
    readonly dialog: Locator;
    readonly dialogTitle: Locator;

    // User/Role list elements
    readonly userList: Locator;
    readonly userItems: Locator;
    readonly roleList: Locator;
    readonly roleItems: Locator;
    readonly searchInput: Locator;

    // Role checkboxes/selectors
    readonly adminRoleCheckbox: Locator;
    readonly supportRoleCheckbox: Locator;
    readonly userRoleCheckbox: Locator;

    // Action buttons
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly closeButton: Locator;
    readonly addUserButton: Locator;
    readonly removeUserButton: Locator;

    constructor(page: Page) {
        super(page);
        this.about = 'User Roles Dialog';

        // MUI Dialog
        this.dialog = page.locator('[role="dialog"]');
        this.dialogTitle = this.dialog.locator('.MuiDialogTitle-root');

        // User list elements
        this.userList = this.dialog.locator('.MuiList-root').or(this.dialog.locator('[role="listbox"]'));
        this.userItems = this.dialog.locator('.MuiListItem-root').or(this.dialog.locator('[role="option"]'));
        this.roleList = this.dialog.locator('.MuiList-root').last();
        this.roleItems = this.dialog.locator('[role="checkbox"]');
        this.searchInput = this.dialog.getByPlaceholder(/search/i);

        // Role checkboxes
        this.adminRoleCheckbox = this.dialog.getByRole('checkbox', { name: /admin/i });
        this.supportRoleCheckbox = this.dialog.getByRole('checkbox', { name: /support/i });
        this.userRoleCheckbox = this.dialog.getByRole('checkbox', { name: /user/i });

        // Action buttons
        this.saveButton = this.dialog.getByRole('button', { name: /save|apply|submit/i });
        this.cancelButton = this.dialog.getByRole('button', { name: /cancel/i });
        this.closeButton = this.dialog.locator('[aria-label="close"]').or(
            this.dialog.getByRole('button', { name: /close/i })
        );
        this.addUserButton = this.dialog.getByRole('button', { name: /add/i });
        this.removeUserButton = this.dialog.getByRole('button', { name: /remove/i });
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

    async selectUser(userName: string) {
        const userItem = this.dialog.getByText(userName, { exact: false });
        await userItem.click();
    }

    async searchUsers(searchText: string) {
        await this.searchInput.fill(searchText);
        await this.page.waitForTimeout(300);
    }

    async toggleAdminRole() {
        await this.adminRoleCheckbox.click();
    }

    async toggleSupportRole() {
        await this.supportRoleCheckbox.click();
    }

    async toggleUserRole() {
        await this.userRoleCheckbox.click();
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

    async getUserCount(): Promise<number> {
        await this.userItems.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
            // No users visible
        });
        return await this.userItems.count();
    }
}
