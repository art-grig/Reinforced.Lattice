module PowerTables.Plugins {
    import HideoutClientConfiguration = PowerTables.Plugins.Hideout.IHideoutPluginConfiguration;
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;

    export interface IColumnState {
        Visible: boolean;
        RawName: string;
        Name: string;
        DoesNotExists: boolean;
    }

    export class HideoutPlugin extends PluginBase<HideoutClientConfiguration> implements IQueryPartProvider {

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

        private _hideElement(element: HTMLElement) {
            if (!element) return;
            element.style.visibility = 'collapsed';
        }

        private _showElement(element: HTMLElement) {
            if (!element) return;
            element.style.visibility = 'visible';
        }

        public hideColumnInstance(c: IColumn) {
            if (!c) return;
            c.Configuration.IsDataOnly = true;
            this._columnStates[c.RawName].Visible = false;
            this._columnStates[c.RawName].DoesNotExists = false;
            if (this._isInitializing) return;
            this._hideElement(this.MasterTable.Renderer.Locator.getHeaderElement(c.Header));
            this._hideElements(this.MasterTable.Renderer.Locator.getPluginElementsByPositionPart(`filter-${c.RawName}`));
            this._hideElements(this.MasterTable.Renderer.Locator.getColumnCellsElements(c));

            if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) this.MasterTable.Controller.reload();
            this.MasterTable.Renderer.redrawPlugin(this);
        }

        public showColumnByName(rawColname: string) {
            this.showColumnInstance(this.MasterTable.InstanceManager.Columns[rawColname]);
        }

        public toggleColumn(e: TemplateBoundEvent<HideoutPlugin>) {
            e.Receiver.toggleColumnByName(e.EventArguments[0]);
        }

        public showColumn(e: TemplateBoundEvent<HideoutPlugin>) {
            e.Receiver.showColumnByName(e.EventArguments[0]);
        }

        public hideColumn(e: TemplateBoundEvent<HideoutPlugin>) {
            e.Receiver.showColumnByName(e.EventArguments[0]);
        }

        public showColumnInstance(c: IColumn) {
            if (!c) return;

            this._columnStates[c.RawName].Visible = true;
            this._columnStates[c.RawName].DoesNotExists = false;
            c.Configuration.IsDataOnly = false;

            if (this._isInitializing) return;

            if (this._columnStates[c.RawName].DoesNotExists) {
                if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                    this.MasterTable.Controller.reload();
                } else {
                    this.MasterTable.Controller.redrawVisibleData();;
                }
            } else {
                this._showElement(this.MasterTable.Renderer.Locator.getHeaderElement(c.Header));
                this._showElements(this.MasterTable.Renderer.Locator.getPluginElementsByPositionPart(`filter-${c.RawName}`));
                this._showElements(this.MasterTable.Renderer.Locator.getColumnCellsElements(c));
                if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                    this.MasterTable.Controller.reload();
                }
            }
            this.MasterTable.Renderer.redrawPlugin(this);
        }

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

        private onDataRedrawn() {
            for (var i = 0; i < this.ColumnStates.length; i++) {
                if (!this.ColumnStates[i].Visible) this.ColumnStates[i].DoesNotExists = true;
            }
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MasterTable.Loader.registerQueryPartProvider(this);
            for (var i = 0; i < this.Configuration.HideableColumnsNames.length; i++) {
                var hideable = this.Configuration.HideableColumnsNames[i];
                var instanceInfo = <IColumnState>{
                    DoesNotExists: false,
                    Visible: true,
                    RawName: hideable,
                    Name: this.MasterTable.InstanceManager.Columns[hideable].Configuration.Title
                };

                this._columnStates[hideable] = instanceInfo;
                this.ColumnStates.push(instanceInfo);
            }
            this.MasterTable.Events.AfterDataRendered.subscribe(this.onDataRedrawn.bind(this), 'hideout');
            this._isInitializing = false;
        }

        renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('hideout')(this);
        }
    }

    ComponentsContainer.registerComponent('Hideout',HideoutPlugin);

} 