type HasClosablePage = {
    page: {
        isClosed(): boolean;
        close(): Promise<void>;
    };
};

export const closeAxpBrowserIfOpen = async (target: HasClosablePage): Promise<void> => {
    if (!target.page.isClosed()) {
        await target.page.close();
    }
};
