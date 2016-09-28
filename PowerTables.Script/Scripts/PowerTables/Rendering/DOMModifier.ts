﻿module PowerTables.Rendering {
    /**
     * Class that is responsible for particular HTML elements redrawing/addition/removal
     */
    export class DOMModifier {
        /*
        * @internal
        */
        constructor(stack: RenderingStack, locator: DOMLocator, backBinder: BackBinder, templatesProvider: ITemplatesProvider, layoutRenderer: LayoutRenderer, instances: InstanceManagerService, ed: EventsDelegatorService) {
            this._stack = stack;
            this._locator = locator;
            this._backBinder = backBinder;
            this._templatesProvider = templatesProvider;
            this._layoutRenderer = layoutRenderer;
            this._instances = instances;
            this._ed = ed;
        }

        private _ed: EventsDelegatorService;
        private _stack: RenderingStack;
        private _locator: DOMLocator;
        private _backBinder: BackBinder;
        private _templatesProvider: ITemplatesProvider;
        private _layoutRenderer: LayoutRenderer;
        private _instances: InstanceManagerService;

        

        //#region Show/hide infrastructure
        private getRealDisplay(elem): string {
            if (elem.currentStyle) return elem.currentStyle.display;
            else if (window.getComputedStyle) {
                var computedStyle = window.getComputedStyle(elem, null);
                return computedStyle.getPropertyValue('display');
            }
            return '';
        }

        private displayCache = {}

        public hideElement(el: HTMLElement) {
            if (!el) return;
            if (!el.getAttribute('displayOld')) el.setAttribute("displayOld", el.style.display);
            el.style.display = "none";
        }

        public showElement(el: HTMLElement) {
            if (!el) return;
            if (this.getRealDisplay(el) !== 'none') return;

            var old = el.getAttribute("displayOld");
            el.style.display = old || "";

            if (this.getRealDisplay(el) === "none") {
                var nodeName = el.nodeName, body = document.body, display: any;

                if (this.displayCache[nodeName]) display = this.displayCache[nodeName];
                else {
                    var testElem = document.createElement(nodeName);
                    body.appendChild(testElem);
                    display = this.getRealDisplay(testElem);
                    if (display === "none") display = "block";
                    body.removeChild(testElem);
                    this.displayCache[nodeName] = display;
                }

                el.setAttribute('displayOld', display);
                el.style.display = display;
            }
        }

        private destroyElement(element: HTMLElement) {
            element.parentElement.removeChild(element);
            this._ed.handleElementDestroy(element);
        }

        private destroyElements(elements: NodeList) {
            for (var i = 0; i < elements.length; i++) {
                this.destroyElement(<HTMLElement>elements.item(i));
            }
        }

        public hideElements(element: NodeList) {
            if (!element) return;
            for (var i = 0; i < element.length; i++) {
                this.hideElement(<HTMLElement>element.item(i));
            }
        }

        public showElements(element: NodeList) {
            if (!element) return;
            for (var i = 0; i < element.length; i++) {
                this.showElement(<HTMLElement>element.item(i));
            }
        }
        //#endregion

        //#region Plugins
        /**
         * Redraws specified plugin refreshing all its graphical state 
         * 
         * @param plugin Plugin to redraw
         * @returns {} 
         */
        public redrawPlugin(plugin: IPlugin): HTMLElement {
            this._stack.clear();
            var oldPluginElement: HTMLElement = this._locator.getPluginElement(plugin);
            var html: string = this._layoutRenderer.renderPlugin(plugin);
            var newPluginElement = this.replaceElement(oldPluginElement, html);;
            this._backBinder.backBind(newPluginElement);
            return newPluginElement;
        }

        public renderPlugin(plugin: IPlugin): HTMLElement {
            this._stack.clear();
            var html: string = this._layoutRenderer.renderPlugin(plugin);
            return this.createElement(html);
        }

        /**
         * Redraws specified plugins refreshing all them graphical state (by position)
         * 
         * @param position Plugin position
         * @returns {} 
         */
        public redrawPluginsByPosition(position: string): void {
            var plugins = this._instances.getPlugins(position);
            for (var i = 0; i < plugins.length; i++) {
                this.redrawPlugin(plugins[i]);
            }
        }

        public hidePlugin(plugin: IPlugin): void {
            var pluginElement: HTMLElement = this._locator.getPluginElement(plugin);
            this.hideElement(pluginElement);
        }

        public showPlugin(plugin: IPlugin) {
            var pluginElement: HTMLElement = this._locator.getPluginElement(plugin);
            this.showElement(pluginElement);
        }

        public destroyPlugin(plugin: IPlugin) {
            var pluginElement: HTMLElement = this._locator.getPluginElement(plugin);
            this.destroyElement(pluginElement);
        }

        public hidePluginsByPosition(position: string): void {
            var plugins = this._instances.getPlugins(position);
            for (var i = 0; i < plugins.length; i++) {
                this.hidePlugin(plugins[i]);
            }
        }

        public showPluginsByPosition(position: string): void {
            var plugins = this._instances.getPlugins(position);
            for (var i = 0; i < plugins.length; i++) {
                this.showPlugin(plugins[i]);
            }
        }

        public destroyPluginsByPosition(position: string): void {
            var plugins = this._instances.getPlugins(position);
            for (var i = 0; i < plugins.length; i++) {
                this.destroyPlugin(plugins[i]);
            }
        }

        //#endregion

        //#region Rows

        /**
         * Redraws specified row refreshing all its graphical state
         * 
         * @param row 
         * @returns {} 
         */
        public redrawRow(row: IRow): HTMLElement {
            this._stack.clear();
            this._stack.push(RenderingContextType.Row, row);
            var wrapper: (arg: any) => string = this._templatesProvider.getCachedTemplate('rowWrapper');
            var html: string;
            if (row.renderElement) {
                html = row.renderElement(this._templatesProvider);
            } else {
                html = wrapper(row);
            }
            this._stack.popContext();
            var oldElement: HTMLElement = this._locator.getRowElement(row);
            var newElem = this.replaceElement(oldElement, html);
            this._backBinder.backBind(newElem);
            return newElem;
        }

        public destroyRow(row: IRow): void {
            var rowElement = this._locator.getRowElement(row);
            this.destroyElement(rowElement);
        }

        public hideRow(row: IRow): void {
            var rowElement = this._locator.getRowElement(row);
            this.hideElement(rowElement);
        }

        public showRow(row: IRow): void {
            var rowElement = this._locator.getRowElement(row);
            this.showElement(rowElement);
        }


        /**
         * Redraws specified row refreshing all its graphical state
         * 
         * @param row 
         * @returns {} 
         */
        public appendRow(row: IRow, beforeRowAtIndex: number): HTMLElement {
            this._stack.clear();
            this._stack.push(RenderingContextType.Row, row);
            var wrapper: (arg: any) => string = this._templatesProvider.getCachedTemplate('rowWrapper');
            var html: string;
            if (row.renderElement) {
                html = row.renderElement(this._templatesProvider);
            } else {
                html = wrapper(row);
            }
            var referenceNode: HTMLElement = this._locator.getRowElementByIndex(beforeRowAtIndex);
            var newRowElement: HTMLElement = this.createElement(html);
            referenceNode.parentNode.insertBefore(newRowElement, referenceNode);
            this._backBinder.backBind(newRowElement);
            this._stack.popContext();
            this._stack.clear();
            return newRowElement;
        }

        /**
         * Removes referenced row by its index
         * 
         * @param rowDisplayIndex 
         * @returns {} 
         */
        public destroyRowByIndex(rowDisplayIndex: number): void {
            var referenceNode: HTMLElement = this._locator.getRowElementByIndex(rowDisplayIndex);
            referenceNode.parentElement.removeChild(referenceNode);
        }

        public hideRowByIndex(rowDisplayIndex: number): void {
            var rowElement = this._locator.getRowElementByIndex(rowDisplayIndex);
            this.hideElement(rowElement);
        }

        public showRowByIndex(rowDisplayIndex: number): void {
            var rowElement = this._locator.getRowElementByIndex(rowDisplayIndex);
            this.showElement(rowElement);
        }

        //#endregion

        //#region Cells
        public redrawCell(cell: ICell): HTMLElement {
            this._stack.clear();
            this._stack.push(RenderingContextType.Cell, cell);
            var wrapper: (arg: any) => string = this._templatesProvider.getCachedTemplate('cellWrapper');
            var html: string;
            if (cell.renderElement) {
                html = cell.renderElement(this._templatesProvider);
            } else {
                html = wrapper(cell);
            }
            this._stack.popContext();
            var oldElement: HTMLElement = this._locator.getCellElement(cell);
            var newElem = this.replaceElement(oldElement, html);
            this._backBinder.backBind(newElem);
            return newElem;
        }

        public destroyCell(cell: ICell): void {
            var e = this._locator.getCellElement(cell);
            e.parentElement.removeChild(e);
        }

        public hideCell(cell: ICell) {
            var e = this._locator.getCellElement(cell);
            this.hideElement(e);
        }

        public showCell(cell: ICell) {
            var e = this._locator.getCellElement(cell);
            this.hideElement(e);
        }

        public destroyCellsByColumn(column: IColumn) {
            var e = this._locator.getColumnCellsElements(column);
            this.destroyElements(e);
        }

        public hideCellsByColumn(column: IColumn) {
            var e = this._locator.getColumnCellsElements(column);
            this.hideElements(e);
        }

        public showCellsByColumn(column: IColumn) {
            var e = this._locator.getColumnCellsElements(column);
            this.showElements(e);
        }

        public destroyColumnCellsElementsByColumnIndex(columnIndex: number) {
            var e = this._locator.getColumnCellsElementsByColumnIndex(columnIndex);
            this.destroyElements(e);
        }

        public hideColumnCellsElementsByColumnIndex(columnIndex: number) {
            var e = this._locator.getColumnCellsElementsByColumnIndex(columnIndex);
            this.hideElements(e);
        }

        public showColumnCellsElementsByColumnIndex(columnIndex: number) {
            var e = this._locator.getColumnCellsElementsByColumnIndex(columnIndex);
            this.showElements(e);
        }

        //#endregion

        /**
         * Redraws header for specified column
         * 
         * @param column Column which header is to be redrawn         
         */
        public redrawHeader(column: IColumn): HTMLElement {
            this._stack.clear();
            var html: string = this._layoutRenderer.renderHeader(column);
            var oldHeaderElement: HTMLElement = this._locator.getHeaderElement(column.Header);
            var newElement: HTMLElement = this.replaceElement(oldHeaderElement, html);
            this._backBinder.backBind(newElement);
            return newElement;
        }

        public destroyHeader(column: IColumn): void {
            var e = this._locator.getHeaderElement(column.Header);
            this.destroyElement(e);
        }

        public hideHeader(column: IColumn): void {
            var e = this._locator.getHeaderElement(column.Header);
            this.hideElement(e);
        }

        public showHeader(column: IColumn): void {
            var e = this._locator.getHeaderElement(column.Header);
            this.showElement(e);
        }

        public createElement(html: string): HTMLElement {
            var parser: Rendering.Html2Dom.HtmlParser = new Rendering.Html2Dom.HtmlParser();
            return parser.html2Dom(html);
        }

        private replaceElement(element: HTMLElement, html: string): HTMLElement {
            var node: HTMLElement = this.createElement(html);
            element.parentElement.replaceChild(node, element);
            this._ed.handleElementDestroy(element);
            return node;
        }

    }
} 