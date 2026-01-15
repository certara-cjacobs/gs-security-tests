import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage.po';

export class DashboardPage extends BasePage {
    readonly about: string;

    // Toolbar elements
    readonly addButton: Locator;
    readonly searchInput: Locator;

    // Grid elements
    readonly gridContainer: Locator;
    readonly gridRows: Locator;

    // Access denied message
    readonly accessDeniedAlert: Locator;

    // Navigation elements
    readonly navBar: Locator;
    readonly logoutButton: Locator;
    readonly userMenuButton: Locator;

    // Dialog triggers (from grid context menu or actions)
    readonly editButton: Locator;
    readonly deleteButton: Locator;
    readonly groupsButton: Locator;
    readonly userRolesButton: Locator;

    constructor(page: Page) {
        super(page);
        this.about = 'Dashboard Page';

        // Toolbar elements
        this.addButton = page.getByRole('button', { name: /add/i });
        this.searchInput = page.getByPlaceholder(/search/i);

        // Grid elements (MUI DataGrid or custom grid)
        this.gridContainer = page.locator('[data-testid="repo-grid"]').or(page.locator('.MuiDataGrid-root'));
        this.gridRows = page.locator('.MuiDataGrid-row').or(page.locator('[role="row"]'));

        // Access denied alert
        this.accessDeniedAlert = page.getByText(/access denied/i);

        // Navigation
        this.navBar = page.locator('nav').or(page.locator('[role="navigation"]'));
        this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
        this.userMenuButton = page.getByRole('button', { name: /account|menu|user/i });

        // Action buttons (may be in a context menu or action column)
        this.editButton = page.getByRole('button', { name: /edit/i });
        this.deleteButton = page.getByRole('button', { name: /delete/i });
        this.groupsButton = page.getByRole('button', { name: /groups/i });
        this.userRolesButton = page.getByRole('button', { name: /user roles|roles/i });
    }

    async searchSpaces(searchText: string) {
        await this.searchInput.fill(searchText);
        // Wait for debounced search
        await this.page.waitForTimeout(500);
    }

    async clearSearch() {
        await this.searchInput.clear();
        await this.page.waitForTimeout(500);
    }

    async getGridRowCount(): Promise<number> {
        await this.gridRows.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
            // No rows visible
        });
        return await this.gridRows.count();
    }

    async selectGridRow(index: number) {
        const row = this.gridRows.nth(index);
        await row.click();
    }

    async clickAddButton() {
        await this.addButton.click();
    }

    async clickEditButton() {
        await this.editButton.click();
    }

    async clickDeleteButton() {
        await this.deleteButton.click();
    }

    async clickGroupsButton() {
        await this.groupsButton.click();
    }

    async clickUserRolesButton() {
        await this.userRolesButton.click();
    }

    async logout() {
        // Try clicking user menu first if logout is in a dropdown
        if (await this.userMenuButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.userMenuButton.click();
            await this.page.waitForTimeout(500);
        }
        await this.logoutButton.click();
    }

    async isAccessDenied(): Promise<boolean> {
        return await this.accessDeniedAlert.isVisible({ timeout: 5000 }).catch(() => false);
    }
}
