module Reinforced.Lattice.Plugins.Hideout {
    export interface IColumnState {
        Visible: boolean;
        RawName: string;
        Name: string;
        DoesNotExists: boolean;
    }

    export class HideoutPlugin extends PluginBase<Reinforced.Lattice.Plugins.Hideout.IHideoutPluginConfiguration> implements IQueryPartProvider {

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
        public toggleColumn(e: Reinforced.Lattice.ITemplateBoundEvent) {
            this.toggleColumnByName(e.EventArguments[0]);
        }

        public showColumn(e: Reinforced.Lattice.ITemplateBoundEvent) {
            this.showColumnByName(e.EventArguments[0]);
        }

        public hideColumn(e: Reinforced.Lattice.ITemplateBoundEvent) {
            this.hideColumnByName(e.EventArguments[0]);
        }
        //#endregion

        //#region Correct showing/hiding
        
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
            var hidden = [];
            var shown = [];

            for (var i = 0; i < this.ColumnStates.length; i++) {
                if (scope !== QueryScope.Transboundary) {
                    if (this.Configuration.ColumnInitiatingReload.indexOf(this.ColumnStates[i].RawName) < 0)
                        continue;
                }
                if (!this.ColumnStates[i].Visible) {
                    hidden.push(this.ColumnStates[i].RawName);
                } else {
                    shown.push(this.ColumnStates[i].RawName);
                }
            }
            query.AdditionalData['HideoutHidden'] = hidden.join(',');
            query.AdditionalData['HideoutShown'] = shown.join(',');
        }

        public hideColumnInstance(c: IColumn) {
            if (!c) return;
            this._columnStates[c.RawName].Visible = false;
            this._columnStates[c.RawName].DoesNotExists = false;


            this.MasterTable.Renderer.Modifier.hideHeader(c);
            this.MasterTable.Renderer.Modifier.hidePluginsByPosition(`filter-${c.RawName}`);

            if (this._isInitializing) return;
            this.MasterTable.Renderer.Modifier.hideCellsByColumn(c);
            if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) this.MasterTable.Controller.reload();
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }

        public showColumnInstance(c: IColumn) {
            if (!c) return;
            this._columnStates[c.RawName].Visible = true;
            var wasNotExist = this._columnStates[c.RawName].DoesNotExists;
            this._columnStates[c.RawName].DoesNotExists = false;

            this.MasterTable.Renderer.Modifier.showHeader(c);
            this.MasterTable.Renderer.Modifier.showPluginsByPosition(`filter-${c.RawName}`);

            if (this._isInitializing) return;

            if (wasNotExist) {
                if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                    this.MasterTable.Controller.redrawVisibleData();
                    this.MasterTable.Controller.reload();
                } else {
                    this.MasterTable.Controller.redrawVisibleData();
                }
            } else {
                this.MasterTable.Renderer.Modifier.showCellsByColumn(c);
                if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                    this.MasterTable.Controller.reload();
                }
            }
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
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
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
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
                    DoesNotExists: this.Configuration.HiddenColumns.hasOwnProperty(hideable),
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

        public renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void {
            this.defaultRender(p);
        }

        subscribe(e: Reinforced.Lattice.Services.EventsService): void {
            e.DataRendered.subscribeAfter(this.onDataRendered.bind(this), 'hideout');
            e.DataRendered.subscribeBefore(this.onBeforeDataRendered.bind(this), 'hideout');
            e.LayoutRendered.subscribeAfter(this.onLayourRendered.bind(this), 'hideout');
        }

        public isColVisible(columnName: string) : boolean {
            var visible = false;
            if (this._isInitializing) {
                visible = !this.Configuration.HiddenColumns.hasOwnProperty(columnName);
            } else {
                for (var i = 0; i < this.ColumnStates.length; i++) {
                    if (this.ColumnStates[i].RawName === columnName) {
                        visible = this.ColumnStates[i].Visible;
                        break;
                    }
                }
            }
            return visible;
        }

        
    }

    ComponentsContainer.registerComponent('Hideout', HideoutPlugin);

} 