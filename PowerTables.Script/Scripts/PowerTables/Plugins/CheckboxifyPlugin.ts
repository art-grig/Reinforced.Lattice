module PowerTables.Plugins {
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;
    import CheckboxifyClientConfig = PowerTables.Plugins.Checkboxify.ICheckboxifyClientConfig;
    import ColumnConfiguration = PowerTables.Configuration.Json.IColumnConfiguration;

    export class CheckboxifyPlugin extends PluginBase<CheckboxifyClientConfig> implements IQueryPartProvider {
        private _selectedItems: string[] = [];
        private _visibleAll: boolean = false;
        private _allSelected: boolean = false;
        private _ourColumn: IColumn;
        private _valueColumnName: string;
        private _canSelectAll: boolean;

        public selectAll(selected?: boolean): void {
            if (!this._canSelectAll) return;
            this._allSelected = selected == null ? !this._allSelected : selected;
            this.redrawHeader();
            this._selectedItems.splice(0, this._selectedItems.length);
            if (this._allSelected) {
                if (this.Configuration.SelectAllSelectsClientUndisplayedData) {
                    for (var i = 0; i < this.MasterTable.DataHolder.StoredData.length; i++) {
                        this._selectedItems.push(this.MasterTable.DataHolder.StoredData[i][this._valueColumnName].toString());
                    }
                    this.MasterTable.Controller.redrawVisibleData();
                } else if (this.Configuration.SelectAllSelectsServerUndisplayedData) {
                    this.MasterTable.Loader.requestServer('checkboxify_all',data => {
                        this._selectedItems = data;
                        this.MasterTable.Controller.redrawVisibleData();
                    });
                } else {
                    for (var j = 0; j < this.MasterTable.DataHolder.DisplayedData.length; j++) {
                        this._selectedItems.push(this.MasterTable.DataHolder.DisplayedData[j][this._valueColumnName].toString());
                    }
                    this.MasterTable.Controller.redrawVisibleData();
                }
            } else {
                this.MasterTable.Controller.redrawVisibleData();
            }
            
        }

        private redrawHeader() {
            this.MasterTable.Renderer.redrawHeader(this._ourColumn);
        }

        private createColumn(): IColumn {
            var conf: ColumnConfiguration = {
                IsDataOnly: false,
                IsEnum: false,
                IsNullable: false,
                RawColumnName: '_checkboxify',
                CellRenderingTemplateId: null,
                CellRenderingValueFunction: null,
                Title: 'Checkboxify',
                ColumnType: 'Int32'
            };

            var col: IColumn = {
                Configuration: conf,
                Header: null,
                IsBoolean: false,
                IsDateTime: false,
                IsEnum: false,
                IsFloat: false,
                IsInteger: false,
                IsString: false,
                MasterTable: this.MasterTable,
                Order: -1,
                RawName: '_checkboxify'
            }

            var header: ISpecialHeader = {
                Column: col,
                renderContent: null,
                renderElement: (tp) => tp.getCachedTemplate('checkboxifySelectAll')({ IsAllSelected: this._allSelected, CanSelectAll: this._canSelectAll }),
                selectAllEvent: (e) => this.selectAll()
            }

            col.Header = header;

            this.MasterTable.Renderer.ContentRenderer.cacheColumnRenderingFunction(col, x => {
                var value = x.DataObject[this._valueColumnName].toString();
                var selected = this._selectedItems.indexOf(value) > -1;
                var canCheck = this.canCheck(x.DataObject, x.Row);
                return this.MasterTable.Renderer.getCachedTemplate('checkboxifyCell')({ Value: value, IsChecked: selected, CanCheck: canCheck });
            });
            return col;
        }

        private canCheck(dataObject: any, row: IRow) {
            return dataObject != null && !row.IsSpecial;
        }
        public getSelection(): string[] {
            return this._selectedItems;
        }
        public selectByRowIndex(rowIndex: number): void {
            var displayedLookup = this.MasterTable.DataHolder.localLookupDisplayedData(rowIndex);
            var v = displayedLookup.DataObject[this._valueColumnName].toString();
            var idx = this._selectedItems.indexOf(v);
            var overrideRow = false;
            if (idx > -1) {
                this._selectedItems.splice(idx, 1);
                this._allSelected = false;
            } else {
                this._selectedItems.push(v);
                overrideRow = true;
                this._allSelected = this.MasterTable.DataHolder.DisplayedData.length === this._selectedItems.length;
            }
            this.redrawHeader();
            var row = this.MasterTable.Controller.produceRow(displayedLookup.DataObject, displayedLookup.DisplayedIndex);
            if (overrideRow) {
                row.renderElement = (e) => e.getCachedTemplate('checkboxifyRow')(row);
            }
            this.MasterTable.Renderer.redrawRow(row);
        }
        private afterLayoutRender() {
            this.MasterTable.Controller.subscribeCellEvent({
                EventId: 'click',
                Selector: '[data-checkboxify]',
                SubscriptionId: 'checkboxify',
                Handler: (e) => {
                    this.selectByRowIndex(e.DisplayingRowIndex);
                }
            });
        }
        private beforeRowsRendering(e: ITableEventArgs<IRow[]>) {
            for (var i = 0; i < e.EventArgs.length; i++) {
                var row = e.EventArgs[i];
                if (row.IsSpecial) continue;
                if (this._selectedItems.indexOf(row.DataObject[this._valueColumnName].toString()) > -1) {
                    row.renderElement = (e) => e.getCachedTemplate('checkboxifyRow')(row);
                }
            }
        }

        private enableSelectAll(enabled: boolean) {
            var prev = this._canSelectAll;
            if (!this.Configuration.EnableSelectAll) this._canSelectAll = false;
            else this._canSelectAll = enabled;
            if (prev !== this._canSelectAll) {
                this.redrawHeader();
            }
        }

        private onClientReload(e: ITableEventArgs<IClientDataResults>) {
            if (this.Configuration.ResetOnClientReload) {
                this.selectAll(false);
            } 
            if (this.Configuration.SelectAllOnlyIfAllData) {
                if (e.EventArgs.Displaying.length === e.EventArgs.Source.length) this.enableSelectAll(true);
                else this.enableSelectAll(false);
            } else {
                this.enableSelectAll(true);
            }
        }

        private onServerReload(e: ITableEventArgs<IDataEventArgs>) {
            if (this.Configuration.ResetOnReload) {
                this.selectAll(false);
            }
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            var col = this.createColumn();
            this.MasterTable.InstanceManager.Columns['_checkboxify'] = col;
            this._ourColumn = col;
            this._valueColumnName = this.Configuration.SelectionColumnName;
            this.MasterTable.Events.AfterLayoutRendered.subscribe(this.afterLayoutRender.bind(this), 'checkboxify');
            this.MasterTable.Events.BeforeClientRowsRendering.subscribe(this.beforeRowsRendering.bind(this), 'checkboxify');
            this.MasterTable.Events.AfterClientDataProcessing.subscribe(this.onClientReload.bind(this), 'checkboxify');
            this.MasterTable.Events.DataReceived.subscribe(this.onServerReload.bind(this), 'checkboxify');
            this._canSelectAll = this.Configuration.EnableSelectAll;
        }

        modifyQuery(query: IQuery, scope: QueryScope): void {
            query.AdditionalData['Selection'] = this._selectedItems.join('|');
            query.AdditionalData['SelectionColumn'] = this._valueColumnName;
        }

        static registerEvents(e: EventsManager, masterTable: IMasterTable):void {
            e['SelectionChanged'] = new TableEvent(masterTable);
        }
    }

    interface ISpecialHeader extends IColumnHeader {
        selectAllEvent(e: TemplateBoundEvent<CheckboxifyPlugin>): void;
    }

    ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);

    
} 