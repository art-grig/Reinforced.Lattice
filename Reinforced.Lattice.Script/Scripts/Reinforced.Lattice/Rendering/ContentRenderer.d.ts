declare module PowerTables.Rendering {
    /**
     * Part of renderer that is responsible for rendering of dynamically loaded content
     */
    class ContentRenderer {
        constructor(templatesProvider: ITemplatesProvider, stack: Rendering.RenderingStack, instances: InstanceManager, coreTemplates: ICoreTemplateIds);
        private _hb;
        private _templatesProvider;
        private _columnsRenderFunctions;
        private _stack;
        private _instances;
        private _templateIds;
        /**
         * Renders supplied table rows to string
         *
         * @param rows Table rows
         * @returns String containing HTML of table rows
         */
        renderBody(rows: IRow[]): string;
        renderCell(cell: ICell): string;
        renderContent(columnName?: string): string;
        private cacheColumnRenderers(columns);
        /**
         * Adds/replaces column rendering function for specified column
         *
         * @param column Column to cache renderer for
         * @param fn Rendering function
         */
        cacheColumnRenderingFunction(column: IColumn, fn: (x: ICell) => string): void;
    }
}
