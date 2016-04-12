module PowerTables.Plugins {
    import HideoutClientConfiguration = PowerTables.Plugins.Hideout.IHideoutPluginConfiguration;
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;

    export interface IColumnState {
        Visible: boolean;
        RawName: string;
        Name: string;
        DoesNotExists: boolean;
    }

    export class HideoutPlugin extends PluginBase<HideoutClientConfiguration> implements IQueryPartProvider, IHideoutPlugin {

        public ColumnStates: IColumnState[] = [];
        private _columnStates: { [key: string]: IColumnState } = {};
        private _isInitializing: boolean = true;

        public isColumnVisible(columnName: string): boolean {
            return this.isColumnInstanceVisible(this.MasterTable.InstanceManager.Columns[columnName]);
        }

        public isColumnInstanceVisible(col: IColumn): boolean {
            if (!col) return true;
            return this._columnStates[col.RawName].Visible;
        }

        public hideColumnByName(rawColname: string) {
            this.hideColumnInstance(this.MasterTable.InstanceManager.Columns[rawColname]);
        }

        public showColumnByName(rawColname: string) {
            this.showColumnInstance(this.MasterTable.InstanceManager.Columns[rawColname]);
        }

        //#region Events handling
        public toggleColumn(e: TemplateBoundEvent<HideoutPlugin>) {
            e.Receiver.toggleColumnByName(e.EventArguments[0]);
        }

        public showColumn(e: TemplateBoundEvent<HideoutPlugin>) {
            e.Receiver.showColumnByName(e.EventArguments[0]);
        }

        public hideColumn(e: TemplateBoundEvent<HideoutPlugin>) {
            e.Receiver.hideColumnByName(e.EventArguments[0]);
        }
        //#endregion

        //#region Correct showing/hiding
        private getRealDisplay(elem): string {
            if (elem.currentStyle) return elem.currentStyle.display;
            else if (window.getComputedStyle) {
                var computedStyle = window.getComputedStyle(elem, null);
                return computedStyle.getPropertyValue('display');
            }
            return '';
        }

        private displayCache = {}

        private _hideElement(el: HTMLElement) {
            if (!el) return;
            if (!el.getAttribute('displayOld')) el.setAttribute("displayOld", el.style.display);
            el.style.display = "none";
        }

        private _showElement(el: HTMLElement) {
            if (!el) return;
            if (this.getRealDisplay(el) !== 'none') return;

            var old = el.getAttribute("displayOld");
            el.style.display = old || "";

            if (this.getRealDisplay(el) === "none") {
                var nodeName = el.nodeName, body = document.body, display;

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

        private _hideElements(element: NodeList) {
            if (!element) return;
            for (var i = 0; i < element.length; i++) {
                this._hideElement(<HTMLElement>element.item(i));
            }
        }

        private _showElements(element: NodeList) {
            if (!element) return;
            for (var i = 0; i < element.length; i++) {
                this._showElement(<HTMLElement>element.item(i));
            }
        }
        //#endregion

        public toggleColumnByName(columnName: string): boolean {
            if (this.isColumnVisible(columnName)) {
                this.hideColumnByName(columnName);
                return false;
            } else {
                this.showColumnByName(columnName);
                return true;
            }
        }

        modifyQuery(query: IQuery, scope: QueryScope): void {
            var hidden = '';
            var shown = '';
            for (var i = 0; i < this.ColumnStates.length; i++) {

                if (!this.ColumnStates[i].Visible) {
                    hidden = hidden + ',' + this.ColumnStates[i].RawName;
                } else {
                    shown = shown + ',' + this.ColumnStates[i].RawName;
                }
            }
            query.AdditionalData['HideoutHidden'] = hidden;
            query.AdditionalData['HideoutShown'] = shown;
        }

        public hideColumnInstance(c: IColumn) {
            if (!c) return;
            this._columnStates[c.RawName].Visible = false;
            this._columnStates[c.RawName].DoesNotExists = false;


            this._hideElement(this.MasterTable.Renderer.Locator.getHeaderElement(c.Header));
            this._hideElements(this.MasterTable.Renderer.Locator.getPluginElementsByPositionPart(`filter-${c.RawName}`));
            if (this._isInitializing) return;
            this._hideElements(this.MasterTable.Renderer.Locator.getColumnCellsElements(c));

            if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) this.MasterTable.Controller.reload();
            this.MasterTable.Renderer.redrawPlugin(this);
        }

        public showColumnInstance(c: IColumn) {
            if (!c) return;
            this._columnStates[c.RawName].Visible = true;
            var wasNotExist = this._columnStates[c.RawName].DoesNotExists;
            this._columnStates[c.RawName].DoesNotExists = false;

            this._showElement(this.MasterTable.Renderer.Locator.getHeaderElement(c.Header));
            this._showElements(this.MasterTable.Renderer.Locator.getPluginElementsByPositionPart(`filter-${c.RawName}`));

            if (this._isInitializing) return;

            if (wasNotExist) {
                if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                    this.MasterTable.Controller.reload();
                } else {
                    this.MasterTable.Controller.redrawVisibleData();;
                }
            } else {
                this._showElements(this.MasterTable.Renderer.Locator.getColumnCellsElements(c));
                if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                    this.MasterTable.Controller.reload();
                }
            }
            this.MasterTable.Renderer.redrawPlugin(this);
        }

        private onBeforeDataRendered() {
            for (var i = 0; i < this.ColumnStates.length; i++) {
                var col = this.MasterTable.InstanceManager.Columns[this.ColumnStates[i].RawName];
                if (!this.ColumnStates[i].Visible) {
                    col.Configuration.IsDataOnly = true;
                } else {
                    col.Configuration.IsDataOnly = false;
                }
            }
        }

        private onDataRendered() {
            for (var i = 0; i < this.ColumnStates.length; i++) {
                if (!this.ColumnStates[i].Visible) this.ColumnStates[i].DoesNotExists = true;
            }
            this.MasterTable.Renderer.redrawPlugin(this);
        }

        private onLayourRendered() {
            for (var j = 0; j < this.ColumnStates.length; j++) {
                if (this.Configuration.HiddenColumns[this.ColumnStates[j].RawName]) {
                    this.hideColumnByName(this.ColumnStates[j].RawName);
                }
            }
            this._isInitializing = false;
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MasterTable.Loader.registerQueryPartProvider(this);
            for (var i = 0; i < this.Configuration.HideableColumnsNames.length; i++) {
                var hideable = this.Configuration.HideableColumnsNames[i];
                var col = this.MasterTable.InstanceManager.Columns[hideable];
                var instanceInfo = <IColumnState>{
                    DoesNotExists: false,
                    Visible: true,
                    RawName: hideable,
                    Name: col.Configuration.Title
                };
                if (col.Configuration.IsDataOnly) {
                    throw new Error(`Column ${col.RawName} is .DataOnly but
included into hideable columns list.
.DataOnly columns are invalid for Hideout plugin. Please remove it from selectable columns list`);
                }
                this._columnStates[hideable] = instanceInfo;
                this.ColumnStates.push(instanceInfo);
            }

        }



        renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('hideout')(this);
        }

        subscribe(e: EventsManager): void {
            e.AfterDataRendered.subscribe(this.onDataRendered.bind(this), 'hideout');
            e.BeforeDataRendered.subscribe(this.onBeforeDataRendered.bind(this), 'hideout');
            e.AfterLayoutRendered.subscribe(this.onLayourRendered.bind(this), 'hideout');
        }
    }

    ComponentsContainer.registerComponent('Hideout', HideoutPlugin);

} 