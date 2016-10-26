﻿module PowerTables.Plugins.Checkboxify {
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
                    { IsAllSelected: this.MasterTable.Selection.isAllSelected(), CanSelectAll: this.MasterTable.Selection.canSelectAll() }),
                selectAllEvent: (e) => this.selectAll()
            }

            col.Header = header;

            this.MasterTable.Renderer.ContentRenderer.cacheColumnRenderingFunction(col, x => {
                if (x.Row.IsSpecial) return '';
                if (this.Configuration.CanSelectFunction && !this.Configuration.CanSelectFunction(x.Row)) return '';
                var selected: boolean = this.MasterTable.Selection.isSelected(x.DataObject);
                var canCheck: boolean = this.canCheck(x.DataObject, x.Row);
                return this.MasterTable.Renderer.getCachedTemplate(this.Configuration.CellTemplateId)(
                    { Value: x.DataObject['__key'], IsChecked: selected, CanCheck: canCheck });
            });
            return col;
        }

        private canCheck(dataObject: any, row: IRow) {
            return dataObject != null && !row.IsSpecial;
        }

        public selectByRowIndex(rowIndex: number, select: boolean = null): boolean {
            var displayedLookup: ILocalLookupResult = this.MasterTable.DataHolder.localLookupDisplayedData(rowIndex);
            if (displayedLookup == null) return false;
            this.toggleInternal(displayedLookup.DataObject, displayedLookup.DisplayedIndex, select);
            return true;
        }

        public selectByDataObject(dataObject: any, select: boolean = null): boolean {
            var displayedLookup: ILocalLookupResult = this.MasterTable.DataHolder.localLookupStoredDataObject(dataObject);
            if (displayedLookup == null) return false;
            this.toggleInternal(displayedLookup.DataObject, displayedLookup.DisplayedIndex, select);
            return true;
        }

        public selectByPredicate(predicate: (dataObject: any) => boolean, select: boolean = null): boolean {
            var displayedLookup: ILocalLookupResult[] = this.MasterTable.DataHolder.localLookup(predicate);
            var result = false;
            for (var i = 0; i < displayedLookup.length; i++) {
                if (!displayedLookup[i].IsCurrentlyDisplaying) continue;
                this.toggleInternal(displayedLookup[i].DataObject, displayedLookup[i].DisplayedIndex, select);
                result = true;
            }
            return result;
        }

        private toggleInternal(dataObject: any, displayedIndex: number, select: boolean = null) {
            var v = dataObject[this.ValueColumnName].toString();
            var idx: number = this._selectedItems.indexOf(v);
            var overrideRow: boolean = false;
            var toggle: boolean = select == null;
            var check: boolean = ((select != null) && (select));
            if (idx > -1) {
                if (toggle || (!check)) {
                    this._selectedItems.splice(idx, 1);
                    this._allSelected = false;
                }
            } else {
                if (toggle || (check)) {
                    this._selectedItems.push(v);
                    overrideRow = true;
                    this._allSelected = this.MasterTable.DataHolder.DisplayedData.length === this._selectedItems.length;
                }
            }
            if (displayedIndex >= 0) {
                this.redrawHeader();
                var row: IRow = this.MasterTable.Controller.produceRow(dataObject, displayedIndex);
                if (overrideRow) {
                    row.renderElement = (e) => e.getCachedTemplate(this.Configuration.RowTemplateId)(row);
                }
                this.MasterTable.Renderer.Modifier.redrawRow(row);
            }
            this.MasterTable.Events.SelectionChanged.invoke(this, this._selectedItems);
        }

        private afterLayoutRender() {
            this.MasterTable.Renderer.Delegator.subscribeCellEvent({
                EventId: 'click',
                Selector: '[data-checkboxify]',
                SubscriptionId: 'checkboxify',
                Handler: (e) => {
                    this.selectByRowIndex(<any>e.DisplayingRowIndex);
                }
            });
            this.MasterTable.Events.SelectionChanged.invoke(this, this._selectedItems);
        }

        private beforeRowsRendering(e: ITableEventArgs<IRow[]>) {
            this._selectables = [];
            var selectedRows = 0;
            for (var i: number = 0; i < e.EventArgs.length; i++) {
                var row: IRow = e.EventArgs[i];
                if (row.IsSpecial) continue;
                if (this._selectedItems.indexOf(row.DataObject[this.ValueColumnName].toString()) > -1) {
                    row.renderElement = (a) => a.getCachedTemplate('checkboxifyRow')(row);
                    selectedRows++;
                }
            }
            if (selectedRows < this._selectedItems.length) {
                this._allSelected = false;
                this.redrawHeader();
            }
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

        private applySelection(a: PowerTables.Plugins.Checkboxify.ISelectionAdditionalData) {
            if (!a) return;
            if (a.ReplaceSelection) {
                this._selectedItems = a.SelectionToReplace;
                this.MasterTable.Events.SelectionChanged.invoke(this, this._selectedItems);
                this.MasterTable.Controller.redrawVisibleData();
            } else if (a.ModifySelection) {
                for (var i = 0; i < a.AddToSelection.length; i++) {
                    if (this._selectedItems.indexOf(a.AddToSelection[i]) < 0) {
                        this._selectedItems.push(a.AddToSelection[i]);
                    }
                }

                for (var i = 0; i < a.RemoveFromSelection.length; i++) {
                    if (this._selectedItems.indexOf(a.RemoveFromSelection[i]) > -1) {
                        this._selectedItems.splice(this._selectedItems.indexOf(a.RemoveFromSelection[i]), 1);
                    }
                }
                this.MasterTable.Events.SelectionChanged.invoke(this, this._selectedItems);
                this.MasterTable.Controller.redrawVisibleData();
            }
        }

        private onBeforeAdjustments(e: ITableEventArgs<PowerTables.Editing.IAdjustmentData>) {

            if (e.EventArgs.AdditionalData['Selection']) this.applySelection(e.EventArgs.AdditionalData['Selection']);
        }

        private onAfterAdjustments(e: ITableEventArgs<PowerTables.Editing.IAdjustmentData>) {
            if (e.EventArgs.Removals.length > 0) {
                for (var i = 0; i < e.EventArgs.Removals.length; i++) {
                    var removal = e.EventArgs.Removals[i];
                    var removalSelected = removal[this.ValueColumnName].toString();
                    var idx = this._selectedItems.indexOf(removalSelected);
                    if (idx > -1) this._selectedItems.splice(idx, 1);
                }
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            var col: IColumn = this.createColumn();
            this.MasterTable.InstanceManager.Columns['_checkboxify'] = col;
            this._ourColumn = col;
            this.ValueColumnName = this.Configuration.SelectionColumnName;
            this._canSelectAll = this.Configuration.EnableSelectAll;
            this.MasterTable.Loader.registerQueryPartProvider(this);
            try {
                this._pagingPlugin = this.MasterTable.InstanceManager.getPlugin<PowerTables.Plugins.Paging.PagingPlugin>('Paging');
            } catch (e) { }
        }


        public modifyQuery(query: IQuery, scope: QueryScope): void {
            if (scope === QueryScope.Transboundary) {
                query.AdditionalData['Selection'] = this._selectedItems.join('|');
                query.AdditionalData['SelectionColumn'] = this.ValueColumnName;
            }
        }

        public subscribe(e: PowerTables.Services.EventsService): void {
            e.LayoutRendered.subscribeAfter(this.afterLayoutRender.bind(this), 'checkboxify');
            e.ClientRowsRendering.subscribeBefore(this.beforeRowsRendering.bind(this), 'checkboxify');
            e.ClientDataProcessing.subscribeAfter(this.onClientReload.bind(this), 'checkboxify');
            e.DataReceived.subscribe(this.onServerReload.bind(this), 'checkboxify');
            e.Adjustment.subscribeBefore(this.onBeforeAdjustments.bind(this), 'checkboxify');
            e.Adjustment.subscribeBefore(this.onAfterAdjustments.bind(this), 'checkboxify');

        }
    }

    interface ISpecialHeader extends IColumnHeader {
        selectAllEvent(e: PowerTables.Rendering.ITemplateBoundEvent): void;
    }

    ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);


}