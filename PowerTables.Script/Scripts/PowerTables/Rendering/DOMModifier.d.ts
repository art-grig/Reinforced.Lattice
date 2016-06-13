declare module PowerTables.Rendering {
    class DOMModifier {
        constructor(stack: RenderingStack, locator: DOMLocator, backBinder: BackBinder, templatesProvider: ITemplatesProvider, layoutRenderer: LayoutRenderer, instances: InstanceManager, ed: EventsDelegator);
        private _ed;
        private _stack;
        private _locator;
        private _backBinder;
        private _templatesProvider;
        private _layoutRenderer;
        private _instances;
        private getRealDisplay(elem);
        private displayCache;
        hideElement(el: HTMLElement): void;
        showElement(el: HTMLElement): void;
        private destroyElement(element);
        private destroyElements(elements);
        hideElements(element: NodeList): void;
        showElements(element: NodeList): void;
        /**
         * Redraws specified plugin refreshing all its graphical state
         *
         * @param plugin Plugin to redraw
         * @returns {}
         */
        redrawPlugin(plugin: IPlugin): HTMLElement;
        renderPlugin(plugin: IPlugin): HTMLElement;
        /**
         * Redraws specified plugins refreshing all them graphical state (by position)
         *
         * @param position Plugin position
         * @returns {}
         */
        redrawPluginsByPosition(position: string): void;
        hidePlugin(plugin: IPlugin): void;
        showPlugin(plugin: IPlugin): void;
        destroyPlugin(plugin: IPlugin): void;
        hidePluginsByPosition(position: string): void;
        showPluginsByPosition(position: string): void;
        destroyPluginsByPosition(position: string): void;
        /**
         * Redraws specified row refreshing all its graphical state
         *
         * @param row
         * @returns {}
         */
        redrawRow(row: IRow): HTMLElement;
        destroyRow(row: IRow): void;
        hideRow(row: IRow): void;
        showRow(row: IRow): void;
        /**
         * Redraws specified row refreshing all its graphical state
         *
         * @param row
         * @returns {}
         */
        appendRow(row: IRow, afterRowAtIndex: number): HTMLElement;
        /**
         * Removes referenced row by its index
         *
         * @param rowDisplayIndex
         * @returns {}
         */
        destroyRowByIndex(rowDisplayIndex: number): void;
        hideRowByIndex(rowDisplayIndex: number): void;
        showRowByIndex(rowDisplayIndex: number): void;
        redrawCell(cell: ICell): HTMLElement;
        destroyCell(cell: ICell): void;
        hideCell(cell: ICell): void;
        showCell(cell: ICell): void;
        destroyCellsByColumn(column: IColumn): void;
        hideCellsByColumn(column: IColumn): void;
        showCellsByColumn(column: IColumn): void;
        destroyColumnCellsElementsByColumnIndex(columnIndex: number): void;
        hideColumnCellsElementsByColumnIndex(columnIndex: number): void;
        showColumnCellsElementsByColumnIndex(columnIndex: number): void;
        /**
         * Redraws header for specified column
         *
         * @param column Column which header is to be redrawn
         */
        redrawHeader(column: IColumn): HTMLElement;
        destroyHeader(column: IColumn): void;
        hideHeader(column: IColumn): void;
        showHeader(column: IColumn): void;
        createElement(html: string): HTMLElement;
        private replaceElement(element, html);
    }
}
