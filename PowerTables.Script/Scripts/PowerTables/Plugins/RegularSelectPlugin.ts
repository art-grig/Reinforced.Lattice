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

        public startSelection(e: ICellEventArgs) {
            this._isSelecting = true;
            this._startRow = e.DisplayingRowIndex;
            this._startColumn = e.ColumnIndex;
            this._endRow = e.DisplayingRowIndex;
            this._endColumn = e.ColumnIndex;
            this._reset = false;
            e.OriginalEvent.preventDefault();
        }

        public endSelection(e: ICellEventArgs) {
            this._isSelecting = false;
            e.OriginalEvent.preventDefault();
        }

        private diff(row: number, column: number) {
            // first lets calculate rows by difference
            if (this._endRow !== row) {
                var select = Math.abs(this._endRow - this._startRow) < Math.abs(row - this._startRow);
                var rngStart = row < this._endRow ? row : this._endRow;
                var rngEnd = row > this._endRow ? row : this._endRow;
                for (var i = rngStart; i <= rngEnd; i++) {
                    this.MasterTable.Selection.toggleDisplayingRow(i, select);
                }
            }
            this._endRow = row;
            this._endColumn = column;
        }

        public move(e: ICellEventArgs) {
            if (!this._isSelecting) return;
            if (!this._reset) {
                this.MasterTable.Selection.resetSelection();
                this._reset = true;
            }
            this.diff(e.DisplayingRowIndex, e.ColumnIndex);
            e.OriginalEvent.preventDefault();
        }
    }
    ComponentsContainer.registerComponent('RegularSelect', RegularSelectPlugin);
} 