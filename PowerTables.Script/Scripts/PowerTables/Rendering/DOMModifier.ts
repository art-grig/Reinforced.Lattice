module PowerTables.Rendering {
    /**
     * Class that is responsible for particular HTML elements redrawing/addition/removal
     */
    export class DOMModifier {
        /*
        * @internal
        */
        constructor(executor: PowerTables.Templating.TemplatesExecutor, locator: DOMLocator, backBinder: BackBinder, instances: PowerTables.Services.InstanceManagerService, ed: PowerTables.Services.EventsDelegatorService, bodyElement: HTMLElement) {
            this._locator = locator;
            this._backBinder = backBinder;
            this._instances = instances;
            this._ed = ed;
            this._tpl = executor;
            this._bodyElement = bodyElement;
        }

        private _tpl: PowerTables.Templating.TemplatesExecutor;
        private _ed: PowerTables.Services.EventsDelegatorService;
        private _locator: DOMLocator;
        private _backBinder: BackBinder;
        private _instances: PowerTables.Services.InstanceManagerService;
        private _bodyElement: HTMLElement;

        public destroyPartitionRow() {
            var rowElement = this._locator.getPartitionRowElement();
            if (!rowElement) return;
            this.destroyElement(rowElement);
        }

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
        public cleanSelector(targetSelector: string) {
            var parent = <HTMLElement>document.querySelector(targetSelector);
            for (var i = 0; i < parent.children.length; i++) {
                this._ed.handleElementDestroy(<HTMLElement>parent.children.item(i));
            }
            parent.innerHTML = '';
        }

        public destroyElement(element: Element) {
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
            var oldPluginElement: HTMLElement = this._locator.getPluginElement(plugin);
            var t = this._tpl.beginProcess();
            PowerTables.Templating.Driver.renderPlugin(t, plugin);
            var result = this._tpl.endProcess(t);
            var newPluginElement = this.replaceElement(oldPluginElement, result.Html);
            this._backBinder.backBind(newPluginElement, result.BackbindInfo);
            return newPluginElement;
        }

        public renderPlugin(plugin: IPlugin): HTMLElement {
            var t = this._tpl.beginProcess();
            PowerTables.Templating.Driver.renderPlugin(t, plugin);
            var result = this._tpl.endProcess(t);
            return this.createElement(result.Html);
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
            var p = this._tpl.beginProcess();
            PowerTables.Templating.Driver.row(p, row);
            var result = this._tpl.endProcess(p);
            var oldElement: HTMLElement = this._locator.getRowElement(row);
            var newElem = this.replaceElement(oldElement, result.Html);
            this._backBinder.backBind(newElem, result.BackbindInfo);
            return newElem;
        }

        public destroyRow(row: IRow): void {
            var rowElement = this._locator.getRowElement(row);
            if (!rowElement) return;
            this.destroyElement(rowElement);
        }

        public hideRow(row: IRow): void {
            var rowElement = this._locator.getRowElement(row);
            if (!rowElement) return;
            this.hideElement(rowElement);
        }

        public showRow(row: IRow): void {
            var rowElement = this._locator.getRowElement(row);
            if (!rowElement) return;
            this.showElement(rowElement);
        }


        /**
         * Redraws specified row refreshing all its graphical state
         * 
         * @param row 
         * @returns {} 
         */
        public appendRow(row: IRow, beforeRowAtIndex?: number): HTMLElement {
            var p = this._tpl.beginProcess();
            PowerTables.Templating.Driver.row(p, row);
            var result = this._tpl.endProcess(p);
            var newRowElement: HTMLElement = this.createElement(result.Html);

            if (beforeRowAtIndex != null && beforeRowAtIndex != undefined) {
                var referenceNode: HTMLElement = this._locator.getRowElementByIndex(beforeRowAtIndex);
                referenceNode.parentNode.insertBefore(newRowElement, referenceNode);
            } else {
                if (this._locator.isSpecialRow(this._bodyElement.lastElementChild)) {
                    var refNode = null;
                    var idx = this._bodyElement.childElementCount;
                    do {
                        idx--;
                        refNode = this._bodyElement.children.item(idx);
                    } while (this._locator.isSpecialRow(refNode));
                    refNode.parentNode.insertBefore(newRowElement, refNode);
                }
                this._bodyElement.appendChild(newRowElement);
            }
            this._backBinder.backBind(newRowElement, result.BackbindInfo);
            return newRowElement;
        }

        /**
         * Redraws specified row refreshing all its graphical state
         * 
         * @param row 
         * @returns {} 
         */
        public prependRow(row: IRow): HTMLElement {
            var p = this._tpl.beginProcess();
            PowerTables.Templating.Driver.row(p, row);
            var result = this._tpl.endProcess(p);
            var newRowElement: HTMLElement = this.createElement(result.Html);
            if (this._bodyElement.childElementCount === 0) {
                this._bodyElement.appendChild(newRowElement);
            } else {
                var referenceNode: HTMLElement = <HTMLElement>this._bodyElement.firstElementChild;
                if (this._locator.isSpecialRow(referenceNode)) {
                    var idx = 0;
                    do {
                        idx++;
                        referenceNode = <HTMLElement>this._bodyElement.children.item(idx);
                    } while (this._locator.isSpecialRow(referenceNode) || idx < this._bodyElement.childElementCount);
                    if (idx === this._bodyElement.childElementCount) {
                        this._bodyElement.appendChild(newRowElement);
                    } else {
                        referenceNode.parentNode.insertBefore(newRowElement, referenceNode);
                    }
                } else {
                    referenceNode.parentNode.insertBefore(newRowElement, referenceNode);
                }
            }
            this._backBinder.backBind(newRowElement, result.BackbindInfo);
            return newRowElement;
        }

        /**
         * Removes referenced row by its index
         * 
         * @param rowDisplayIndex 
         * @returns {} 
         */
        public destroyRowByIndex(rowDisplayIndex: number): void {
            var rowElement: HTMLElement = this._locator.getRowElementByIndex(rowDisplayIndex);
            if (!rowElement) return;
            this.destroyElement(rowElement);
        }

        public destroyRowByNumber(rowNumber: number): void {
            var rows = this._locator.getRowElements();
            if (rowNumber > rows.length) return;
            this.destroyElement(<Element>rows.item(rowNumber));
        }

        public hideRowByIndex(rowDisplayIndex: number): void {
            var rowElement = this._locator.getRowElementByIndex(rowDisplayIndex);
            if (!rowElement) return;
            this.hideElement(rowElement);
        }

        public showRowByIndex(rowDisplayIndex: number): void {
            var rowElement = this._locator.getRowElementByIndex(rowDisplayIndex);
            if (!rowElement) return;
            this.showElement(rowElement);
        }

        //#endregion

        //#region Cells
        public redrawCell(cell: ICell): HTMLElement {
            var p = this._tpl.beginProcess();
            PowerTables.Templating.Driver.cell(p, cell);
            var result = this._tpl.endProcess(p);
            var oldElement: HTMLElement = this._locator.getCellElement(cell);
            var newElem = this.replaceElement(oldElement, result.Html);
            this._backBinder.backBind(newElem, result.BackbindInfo);
            return newElem;
        }

        public destroyCell(cell: ICell): void {
            var e = this._locator.getCellElement(cell);
            if (!e) return;
            e.parentElement.removeChild(e);
        }

        public hideCell(cell: ICell) {
            var e = this._locator.getCellElement(cell);
            if (!e) return;
            this.hideElement(e);
        }

        public showCell(cell: ICell) {
            var e = this._locator.getCellElement(cell);
            if (!e) return;
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

        //#region Headers
        /**
         * Redraws header for specified column
         * 
         * @param column Column which header is to be redrawn         
         */
        public redrawHeader(column: IColumn): HTMLElement {
            var p = this._tpl.beginProcess();
            PowerTables.Templating.Driver.header(p, column);
            var result = this._tpl.endProcess(p);

            var oldHeaderElement: HTMLElement = this._locator.getHeaderElement(column.Header);
            var newElement: HTMLElement = this.replaceElement(oldHeaderElement, result.Html);
            this._backBinder.backBind(newElement, result.BackbindInfo);
            return newElement;
        }

        public destroyHeader(column: IColumn): void {
            var e = this._locator.getHeaderElement(column.Header);
            if (!e) return;
            this.destroyElement(e);
        }

        public hideHeader(column: IColumn): void {
            var e = this._locator.getHeaderElement(column.Header);
            if (!e) return;
            this.hideElement(e);
        }

        public showHeader(column: IColumn): void {
            var e = this._locator.getHeaderElement(column.Header);
            if (!e) return;
            this.showElement(e);
        }
        //#endregion

        public createElement(html: string): HTMLElement {
            var parser: Rendering.Html2Dom.HtmlParser = new Rendering.Html2Dom.HtmlParser();
            return parser.html2Dom(html);
        }

        public createElementFromTemplate(templateId: string, viewModelBehind: any): HTMLElement {
            var p = this._tpl.execute(viewModelBehind, templateId);
            var parser: Rendering.Html2Dom.HtmlParser = new Rendering.Html2Dom.HtmlParser();
            var element = parser.html2Dom(p.Html);
            this._backBinder.backBind(element, p.BackbindInfo);
            return element;
        }

        private replaceElement(element: HTMLElement, html: string): HTMLElement {
            if (!element) return null;
            var node: HTMLElement = this.createElement(html);
            element.parentElement.replaceChild(node, element);
            this._ed.handleElementDestroy(element);
            return node;
        }

    }
} 