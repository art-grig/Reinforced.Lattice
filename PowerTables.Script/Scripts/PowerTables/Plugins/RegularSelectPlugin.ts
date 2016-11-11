module PowerTables.Plugins.RegularSelect {
    export class RegularSelectPlugin extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.RegularSelect.IRegularSelectUiConfig> {

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
        }

        private _isSelecting: boolean = false;
        private _reset: boolean = false;
        private _startRow: number;
        private _startColumn: number;

        private _endRow: number;
        private _endColumn: number;

        private _prevUiCols: string[] = [];

        public startSelection(e: ICellEventArgs) {
            this._isSelecting = true;
            this._startRow = e.DisplayingRowIndex;
            this._startColumn = e.ColumnIndex;
            this._endRow = e.DisplayingRowIndex;
            this._endColumn = this.MasterTable.InstanceManager.getColumnByOrder(e.ColumnIndex).UiOrder;
            this._reset = false;
            e.OriginalEvent.preventDefault();
        }

        public endSelection(e: ICellEventArgs) {
            this._isSelecting = false;
            e.OriginalEvent.preventDefault();
        }

        private diff(row: number, column: number) {
            var select: boolean, rngStart: number, rngEnd: number;
            if (this.Configuration.Mode === RegularSelectMode.Rows) {
                // first lets calculate rows by difference

                select = Math.abs(this._endRow - this._startRow) < Math.abs(row - this._startRow);
                rngStart = row < this._endRow ? row : this._endRow;
                rngEnd = row > this._endRow ? row : this._endRow;
                for (var i = rngStart; i <= rngEnd; i++) {
                    this.MasterTable.Selection.toggleDisplayingRow(i, select);
                }

                this._endRow = row;
                this._endColumn = column;
            } else {
                select = Math.abs(this._endRow - this._startRow) < Math.abs(row - this._startRow);
                rngStart = row < this._endRow ? row : this._endRow;
                rngEnd = row > this._endRow ? row : this._endRow;

                var selColumns = [];
                var colMin = this._startColumn < column ? this._startColumn : column;
                var colMax = this._startColumn > column ? this._startColumn : column;

                var uiCols = this.MasterTable.InstanceManager.getColumnNames();
                for (var j = colMin; j <= colMax; j++) {
                    if (!this.MasterTable.InstanceManager.Columns[uiCols[j]].Configuration.IsDataOnly) {
                        selColumns.push(this.MasterTable.InstanceManager.Columns[uiCols[j]].RawName);
                    }
                }

                if (!select) {
                    for (var k = rngStart; k <= rngEnd; k++) {
                        //this.MasterTable.Selection.toggleCellsByDisplayIndex(k, selColumns, false);
                        this.MasterTable.Selection.toggleDisplayingRow(k, false);
                    }
                }

                var rowMin = this._startRow < row ? this._startRow : row;
                var rowMax = this._startRow > row ? this._startRow : row;

                for (var n = rowMin; n <= rowMax; n++) {
                    this.MasterTable.Selection.setCellsByDisplayIndex(n, selColumns);
                }

                this._prevUiCols = selColumns;
                this._endRow = row;
                this._endColumn = column;
            }
        }

        public move(e: ICellEventArgs) {
            if (!this._isSelecting) return;
            if (!this._reset) {
                //this.MasterTable.Selection.resetSelection();
                this._reset = true;
            }
            this.diff(e.DisplayingRowIndex, e.ColumnIndex);
            e.OriginalEvent.preventDefault();
        }
    }
    ComponentsContainer.registerComponent('RegularSelect', RegularSelectPlugin);
} 