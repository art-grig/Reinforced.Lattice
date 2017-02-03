module PowerTables.Rendering {
    import RenderingStack = PowerTables.Templating.RenderingStack;

    /**
     * Part of renderer that is responsible for rendering of dynamically loaded content
     */
    export class ContentRenderer {
        constructor(templatesProvider: ITemplatesProvider, stack: Rendering.RenderingStack, instances: PowerTables.Services.InstanceManagerService, coreTemplates: ICoreTemplateIds) {
            this._hb = templatesProvider.HandlebarsInstance;
            this._templatesProvider = templatesProvider;
            this._stack = stack;
            this._instances = instances;
           
            this._templateIds = coreTemplates;
        }

        private _hb: Handlebars.IHandlebars;
        private _templatesProvider: ITemplatesProvider;
       
        private _stack: RenderingStack;
        private _instances: PowerTables.Services.InstanceManagerService;
        private _templateIds: ICoreTemplateIds;

        
        /*
        * @internal
        */
        public renderCell(cell: ICell): string {
            return this._columnsRenderFunctions[cell.Column.RawName](cell);
        }

        /*
        * @internal
        */
        public renderContent(columnName?: string) {
            var result: string = '';
            switch (this._stack.Current.Type) {
                case RenderingContextType.Row:
                   
                    break;
                case RenderingContextType.Cell:
                    
            }
            return result;
        }

        public renderCellAsPartOfRow(cell: ICell, cellWrapper: (arg: any) => string): string {
            this._stack.push(RenderingContextType.Cell, cell, cell.Column.RawName);
            var result = '';
            if (cell.renderElement) result = cell.renderElement(this._templatesProvider);
            else {
                if (cell.Column.Configuration.TemplateSelector) {
                    cell.TemplateIdOverride = cell.Column.Configuration.TemplateSelector(cell);
                }
                if (cell.TemplateIdOverride) {
                    result = this._templatesProvider.getCachedTemplate(cell.TemplateIdOverride)(cell);
                } else {
                    result = cellWrapper(cell);
                }
            }
            this._stack.popContext();
            return result;
        }

        


        /**
         * Adds/replaces column rendering function for specified column
         * 
         * @param column Column to cache renderer for
         * @param fn Rendering function          
         */
        public cacheColumnRenderingFunction(column: IColumn, fn: (x: ICell) => string) {
            this._columnsRenderFunctions[column.Configuration.RawColumnName] = fn;
        }
    }
}