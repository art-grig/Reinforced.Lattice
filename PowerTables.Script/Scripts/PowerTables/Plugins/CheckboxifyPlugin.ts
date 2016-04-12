module PowerTables.Plugins {
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;
    import CheckboxifyClientConfig = PowerTables.Plugins.Checkboxify.ICheckboxifyClientConfig;
    import ColumnConfiguration = PowerTables.Configuration.Json.IColumnConfiguration;

    export class CheckboxifyPlugin extends PluginBase<CheckboxifyClientConfig> {
        private _selectedItems: string[] = [];
        private _visibleAll: boolean = false;
        private _allSelected: boolean = false;
        private _ourColumn: IColumn;
        private _valueColumnName: string;

        public selectAll() {
            this._allSelected = !this._allSelected;
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
                renderElement: (tp) => tp.getCachedTemplate('checkboxifySelectAll')({ IsAllSelected: this._allSelected }),
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

        private selectByRowIndex(rowIndex: number) {
            var displayedLookup = this.MasterTable.DataHolder.localLookupDisplayedData(rowIndex);
            var v = displayedLookup.DataObject[this._valueColumnName].toString();
            var idx = this._selectedItems.indexOf(v);
            var overrideRow = false;
            if (idx > -1) {
                this._selectedItems.splice(idx, 1);
            } else {
                this._selectedItems.push(v);
                overrideRow = true;
            }
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
        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            var col = this.createColumn();
            this.MasterTable.InstanceManager.Columns['_checkboxify'] = col;
            this._ourColumn = col;
            this._valueColumnName = this.Configuration.SelectionColumnName;
            this.MasterTable.Events.AfterLayoutRendered.subscribe(this.afterLayoutRender.bind(this), 'checkboxify');
        }
    }

    interface ISpecialHeader extends IColumnHeader {
        selectAllEvent(e: TemplateBoundEvent<CheckboxifyPlugin>): void;
    }

    ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);
} 