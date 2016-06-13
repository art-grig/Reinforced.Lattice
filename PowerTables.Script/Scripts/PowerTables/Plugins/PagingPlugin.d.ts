declare module PowerTables.Plugins {
    class PagingPlugin extends FilterBase<Plugins.Paging.IPagingClientConfiguration> {
        Pages: IPagesElement[];
        Shown: boolean;
        NextArrow: boolean;
        PrevArrow: boolean;
        private _selectedPage;
        CurrentPage(): number;
        TotalPages(): number;
        PageSize(): number;
        private _totalPages;
        private _pageSize;
        GotoInput: HTMLInputElement;
        getCurrentPage(): number;
        getTotalPages(): number;
        getPageSize(): number;
        private onFilterGathered(e);
        private onColumnsCreation();
        private onResponse(e);
        private onClientDataProcessing(e);
        goToPage(page: string): void;
        gotoPageClick(e: Rendering.ITemplateBoundEvent): void;
        navigateToPage(e: Rendering.ITemplateBoundEvent): void;
        nextClick(e: Rendering.ITemplateBoundEvent): void;
        previousClick(e: Rendering.ITemplateBoundEvent): void;
        private constructPagesElements();
        renderContent(templatesProvider: ITemplatesProvider): string;
        validateGotopage(): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
    }
    interface IPagesElement {
        Prev?: boolean;
        Period?: boolean;
        ActivePage?: boolean;
        Page: number;
        First?: boolean;
        Last?: boolean;
        Next?: boolean;
        InActivePage?: boolean;
        DisPage?: () => string;
    }
}
