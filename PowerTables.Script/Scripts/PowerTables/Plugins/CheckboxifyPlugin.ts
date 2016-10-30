module PowerTables.Plugins.Checkboxify {
    export class CheckboxifyPlugin extends PluginBase<Plugins.Checkboxify.ICheckboxifyClientConfig> implements IQueryPartProvider {
        private _ourColumn: IColumn;
        public ValueColumnName: string;
        

        public selectAll(selected?: boolean): void {
            if (!this.MasterTable.Selection.canSelectAll()) return;
            this.MasterTable.Selection.toggleAll(selected);
            this.redrawHeader();
        }

        private redrawHeader() {
            this.MasterTable.Renderer.Modifier.redrawHeader(this._ourColumn);
        }

        private createColumn(): IColumn {
            var conf: Configuration.Json.IColumnConfiguration = {
                IsDataOnly: false,
                IsEnum: false,
                IsNullable: false,
                RawColumnName: '_checkboxify',
                CellRenderingTemplateId: null,
                CellRenderingValueFunction: null,
                Title: 'Checkboxify',
                ColumnType: 'Int32',
                ClientValueFunction: null,
                Description: null,
                TemplateSelector: null,
                DisplayOrder: -1
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
                RawName: '_checkboxify',
                IsSpecial: true
            }

            var header: ISpecialHeader = {
                Column: col,
                renderContent: null,
                renderElement: (tp) => tp.getCachedTemplate(this.Configuration.SelectAllTemplateId)(
                    {
                        IsAllSelected: this.MasterTable.Selection.isAllSelected(),
                        CanSelectAll: this.MasterTable.Selection.canSelectAll()
                    }),
                selectAllEvent: (e) => this.selectAll()
            }

            col.Header = header;

            this.MasterTable.Renderer.ContentRenderer.cacheColumnRenderingFunction(col, x => {
                if (x.Row.IsSpecial) return '';
                if (this.Configuration.CanSelectFunction && !this.Configuration.CanSelectFunction(x.Row)) return '';
                var selected: boolean = this.MasterTable.Selection.isSelected(x.DataObject);
                var canCheck: boolean = this.canCheck(x.DataObject, x.Row);
                return this.MasterTable.Renderer.getCachedTemplate(this.Configuration.CellTemplateId)(
                {
                    Value: x.DataObject['__key'],
                    IsChecked: selected,
                    CanCheck: canCheck
                });
            });
            return col;
        }

        private canCheck(dataObject: any, row: IRow) {
            return dataObject != null && !row.IsSpecial;
        }

        private afterLayoutRender() {
            this.MasterTable.Renderer.Delegator.subscribeCellEvent({
                EventId: 'click',
                Selector: '[data-checkboxify]',
                SubscriptionId: 'checkboxify',
                Handler: (e) => {
                    var obj = this.MasterTable.DataHolder.localLookupDisplayedData(e.DisplayingRowIndex);
                    this.MasterTable.Selection.toggleObjectSelected(obj);
                }
            });
        }

        private enableSelectAll(enabled: boolean) {
            var prev: boolean = this._canSelectAll;
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
                if (this._pagingPlugin !== null && this._pagingPlugin.getTotalPages() === 1) this.enableSelectAll(true);
                else if (e.EventArgs.Displaying.length === e.EventArgs.Source.length) this.enableSelectAll(true);
                else this.enableSelectAll(false);
            } else {
                this.enableSelectAll(true);
            }
        }

        private onServerReload(e: ITableEventArgs<IDataEventArgs>) {
            if (this.Configuration.ResetOnReload) {
                this.selectAll(false);
            }
            if (e.EventArgs.Data.AdditionalData) {
                if (e.EventArgs.Data.AdditionalData['Selection']) this.applySelection(e.EventArgs.Data.AdditionalData['Selection']);
            }
        }

        
        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            var col: IColumn = this.createColumn();
            this.MasterTable.InstanceManager.Columns['_checkboxify'] = col;
            this._ourColumn = col;
            this.ValueColumnName = this.Configuration.SelectionColumnName;
        }


        public subscribe(e: PowerTables.Services.EventsService): void {
            e.LayoutRendered.subscribeAfter(this.afterLayoutRender.bind(this), 'checkboxify');
            e.ClientDataProcessing.subscribeAfter(this.onClientReload.bind(this), 'checkboxify');
            e.DataReceived.subscribe(this.onServerReload.bind(this), 'checkboxify');
        }
    }

    interface ISpecialHeader extends IColumnHeader {
        selectAllEvent(e: PowerTables.Rendering.ITemplateBoundEvent): void;
    }

    ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);


}