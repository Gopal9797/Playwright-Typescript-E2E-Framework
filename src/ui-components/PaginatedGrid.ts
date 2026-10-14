import { expect, type Locator, type Page } from '@playwright/test';

export type GridPaginationState = {
    page: number;
    from: number;
    to: number;
    total: number;
    hasNextPage: boolean;
};

export class PaginatedGrid {
    readonly Grid: Locator;
    readonly Rows: Locator;
    readonly PaginationSummary: Locator;
    readonly NextPageButton: Locator;
    readonly PreviousPageButton: Locator;

    constructor(private readonly page: Page) {
        this.Grid = page.getByRole('grid');
        this.Rows = this.Grid.locator('.MuiDataGrid-row');

        this.PaginationSummary = page.locator(
            '.MuiTablePagination-displayedRows',
        );

        this.NextPageButton = page.getByRole('button', {
            name: 'Go to next page',
        });

        this.PreviousPageButton = page.getByRole('button', {
            name: 'Go to previous page',
        });
    }

    /** Asserts how many data rows are rendered. This is the current page, not the pagination total. */
    async ExpectRowCount(count: number): Promise<void> {
        await expect(this.Grid).toBeVisible();
        await expect(this.Grid).not.toHaveAttribute('data-loading');
        await expect(this.Rows).toHaveCount(count);
    }

    async FindCell(headerLabel: string, rowValue: string): Promise<Locator> {
        const header = this.Grid.getByRole('columnheader').filter({
            has: this.page.getByText(headerLabel, { exact: true }),
        });
        await expect(header).toBeVisible();

        const field = await header.getAttribute('data-field');
        if (!field) {
            throw new Error(`Grid header "${headerLabel}" has no data-field attribute`);
        }

        const columnCells = this.Rows.locator(`[role="gridcell"][data-field=${JSON.stringify(field)}]`);
        const escapedValue = rowValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const cell = columnCells.filter({ hasText: new RegExp(`^\\s*${escapedValue}\\s*$`) }).or(
            columnCells.filter({ has: this.page.getByText(rowValue, { exact: true }) }),
        );
        await expect(cell).toBeVisible();
        return cell;
    }

    async GoToNextPage(): Promise<void> {
        await expect(this.NextPageButton).toBeEnabled();
        const initialSummary = await this.PaginationSummary.textContent();

        await this.NextPageButton.click();

        // Wait for the pagination summary to change (indicates page has updated)
        await expect(this.PaginationSummary).not.toHaveText(initialSummary!);

        // Wait for the grid loading to complete
        await this.Grid.evaluate((el) => {
            return new Promise<void>((resolve) => {
                const observer = new MutationObserver(() => {
                    if (!el.getAttribute('data-loading')) {
                        resolve();
                    }
                });
                observer.observe(el, { attributes: true });
            });
        });

        await expect(this.Rows.first()).toBeVisible();
    }

    async GoToPreviousPage(): Promise<void> {
        await expect(this.PreviousPageButton).toBeEnabled();
        const initialSummary = await this.PaginationSummary.textContent();

        await this.PreviousPageButton.click();

        // Wait for the pagination summary to change (indicates page has updated)
        await expect(this.PaginationSummary).not.toHaveText(initialSummary!);

        // Wait for the grid loading to complete
        await this.Grid.evaluate((el) => {
            return new Promise<void>((resolve) => {
                const observer = new MutationObserver(() => {
                    if (!el.getAttribute('data-loading')) {
                        resolve();
                    }
                });
                observer.observe(el, { attributes: true });
            });
        });

        await expect(this.Rows.first()).toBeVisible();
    }
}
