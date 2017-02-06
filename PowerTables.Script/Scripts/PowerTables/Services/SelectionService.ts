module PowerTables.Services {
    export class SelectionService implements IQueryPartProvider, IAdditionalDataReceiver {

        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
            this._configuration = this._masterTable.Configuration.SelectionConfiguration;
            if (this._configuration.SelectSingle) {
                this._configuration.SelectAllBehavior = PowerTables.SelectAllBehavior.Disabled;
            }
            if (this._configuration.ResetSelectionBehavior ===
                PowerTables.ResetSelectionBehavior.ClientReload) {
                masterTable.Events.ClientDataProcessing.subscribeAfter(x => this.resetSelection(), 'selection');
            }
            if (this._configuration.ResetSelectionBehavior ===
                PowerTables.ResetSelectionBehavior.ServerReload) {
                masterTable.Events.DataReceived.subscribe(x => {
                    if (x.EventArgs.Request.Command === 'query') this.resetSelection();
                }, 'selection');
            }
            masterTable.Loader.registerAdditionalDataReceiver('Selection', this);
        }

        private _configuration: PowerTables.ISelectionConfiguration;

        private _masterTable: IMasterTable;

        private _selectionData: { [primaryKey: string]: number[] } = {};
        private _isAllSelected: boolean = false;

        public isSelected(dataObject: any): boolean {
            return this.isSelectedPrimaryKey(dataObject['__key']);
        }


        public isAllSelected(): boolean {
            //if (this._configuration.SelectAllBehavior === PowerTables.SelectAllBehavior.Disabled) {
            //    return false;
            //}
            //if (this._configuration.SelectAllBehavior === PowerTables.SelectAllBehavior.OnlyIfAllDataVisible) {
            //    return this._isAllSelected;
            //}
            if (this._masterTable.DataHolder.DisplayedData.length === 0) return false;
            // extremely stupid - will be changed later
            for (var i = 0; i < this._masterTable.DataHolder.DisplayedData.length; i++) {
                if (this.canSelect(this._masterTable.DataHolder.DisplayedData[i])) {
                    if (!this._selectionData.hasOwnProperty(this._masterTable.DataHolder.DisplayedData[i]['__key']))
                        return false;
                }
            }
            return true;
        }

        public canSelect(dataObject: any): boolean {
            if (this._configuration.CanSelectRowFunction == null) return true;
            return this._configuration.CanSelectRowFunction(dataObject);
        }

        public canSelectAll(): boolean {
            if (this._masterTable.DataHolder.DisplayedData.length === 0) return false;
            if (this._configuration.SelectAllBehavior === PowerTables.SelectAllBehavior.Disabled) {
                return false;
            }
            if (this._configuration.SelectAllBehavior === PowerTables.SelectAllBehavior.OnlyIfAllDataVisible) {
                return this._masterTable.DataHolder.StoredData.length === this._masterTable.DataHolder.DisplayedData.length;
            }
            return true;
        }

        public resetSelection() {
            this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
            var objectsToRedraw = [];
            for (var k in this._selectionData) {
                var sd = this._selectionData[k];
                if (this._masterTable.DataHolder.DisplayedData.indexOf(sd) >= 0) objectsToRedraw.push(sd);
                delete this._selectionData[k];
            }
            if (objectsToRedraw.length > this._masterTable.DataHolder.DisplayedData.length / 2) {
                this._masterTable.Controller.redrawVisibleData();
            } else {
                for (var j = 0; j < objectsToRedraw.length; j++) {
                    this._masterTable.Controller.redrawVisibleDataObject(objectsToRedraw[j]); //todo    
                }
            }
            this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
        }

        public toggleAll(selected?: boolean) {
            if (this._configuration.SelectAllBehavior === PowerTables.SelectAllBehavior.Disabled) {
                return;
            }
            if (this._configuration.SelectAllBehavior === PowerTables.SelectAllBehavior.OnlyIfAllDataVisible) {
                if (this._masterTable.DataHolder.StoredData.length !==
                    this._masterTable.DataHolder.DisplayedData.length) return;
            }
            this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);

            if (selected == null) {
                selected = !this.isAllSelected();
            }
            var redrawAll = false;

            var objectsToRedraw = [];
            var objSet = null;
            if (this._configuration.SelectAllBehavior === PowerTables.SelectAllBehavior.AllVisible ||
                this._configuration.SelectAllBehavior ===
                PowerTables.SelectAllBehavior.OnlyIfAllDataVisible
            ) {
                objSet = this._masterTable.DataHolder.DisplayedData;
            } else {
                objSet = this._masterTable.DataHolder.StoredData;
            }
            if (selected) {
                for (var i = 0; i < objSet.length; i++) {
                    var sd = objSet[i];
                    if (this.canSelect(sd)) {
                        if (!this._selectionData.hasOwnProperty(sd["__key"])) {
                            objectsToRedraw.push(sd);
                            this._selectionData[sd["__key"]] = [];
                        }
                    }
                }
            } else {
                for (var i = 0; i < objSet.length; i++) {
                    var sd = objSet[i];
                    if (this.canSelect(sd)) {
                        if (this._selectionData.hasOwnProperty(sd["__key"])) {
                            objectsToRedraw.push(sd);
                            delete this._selectionData[sd["__key"]];
                        }
                    }
                }
            }
            this._isAllSelected = selected;
            if (objectsToRedraw.length > this._masterTable.DataHolder.DisplayedData.length / 2) {
                this._masterTable.Controller.redrawVisibleData();
            } else {
                for (var j = 0; j < objectsToRedraw.length; j++) {
                    this._masterTable.Controller.redrawVisibleDataObject(objectsToRedraw[j]); //todo    
                }
            }
            this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
        }


        public isCellSelected(dataObject: any, column: IColumn): boolean {
            var sd = this._selectionData[dataObject['__key']];
            if (!sd) return false;
            return sd.indexOf(column.Order) >= 0;
        }

        public hasSelectedCells(dataObject: any): boolean {
            var sd = this._selectionData[dataObject['__key']];
            if (!sd) return false;
            return sd.length > 0;
        }

        public getSelectedCells(dataObject: any): number[] {
            var sd = this._selectionData[dataObject['__key']];
            if (!sd) return null;
            return sd;
        }

        public getSelectedCellsByPrimaryKey(dataObject: any): boolean {
            var sd = this._selectionData[dataObject['__key']];
            if (!sd) return false;
            return sd.length > 0;
        }

        public isSelectedPrimaryKey(primaryKey: string): boolean {
            var sd = this._selectionData[primaryKey];
            if (!sd) return false;
            return sd.length === 0;
        }

        public toggleRow(primaryKey: string, selected?: boolean): void {
            this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
            if (selected == undefined || selected == null) {
                selected = !this.isSelectedPrimaryKey(primaryKey);
            }

            if (selected) {
                if (!this._selectionData.hasOwnProperty(primaryKey)) {
                    if (this._configuration.SelectSingle) {
                        var rk = [];
                        for (var sk in this._selectionData) {
                            rk.push(sk);
                        }
                        for (var i = 0; i < rk.length; i++) {
                            delete this._selectionData[rk[i]];
                            this._masterTable.Controller
                                .redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(rk[i]));
                        }
                    }
                    this._selectionData[primaryKey] = [];
                    this._masterTable.Controller.redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(primaryKey));
                    this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                }
            } else {

                if (this._selectionData.hasOwnProperty(primaryKey)) {
                    if (this._configuration.SelectSingle) {
                        var rk = [];
                        for (var sk in this._selectionData) {
                            rk.push(sk);
                        }
                        for (var i = 0; i < rk.length; i++) {
                            delete this._selectionData[rk[i]];
                            this._masterTable.Controller
                                .redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(rk[i]));
                        }
                    } else {
                        delete this._selectionData[primaryKey];
                        this._masterTable.Controller.redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(primaryKey));
                    }
                    this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                }
            }

        }

        public toggleDisplayingRow(rowIndex: number, selected?: boolean) {
            this.toggleRow(this._masterTable.DataHolder.StoredCache[rowIndex]['__key'], selected);
        }

        public toggleObjectSelected(dataObject: any, selected?: boolean) {
            this.toggleRow(dataObject['__key'], selected);
        }

        public handleAdjustments(added: any[], removeKeys: string[]) {
            for (var i = 0; i < removeKeys.length; i++) {
                if (this._selectionData.hasOwnProperty(removeKeys[i])) {
                    delete this._selectionData[removeKeys[i]];
                }
            }
        }


        modifyQuery(query: IQuery, scope: QueryScope): void {
            query.Selection = this._selectionData;
        }

        public getSelectedKeys(): string[] {
            var keys = [];
            for (var k in this._selectionData) {
                keys.push(k);
            }
            return keys;
        }

        public getSelectedObjects(): any[] {
            var objects = [];
            for (var k in this._selectionData) {
                objects.push(this._masterTable.DataHolder.getByPrimaryKey(k));
            }
            return objects;
        }

        public getSelectedColumns(primaryKey: string): IColumn[] {
            var cols = this._masterTable.InstanceManager.Columns;
            if (!this.isSelectedPrimaryKey(primaryKey)) return [];
            var selObject = this._selectionData[primaryKey];
            var result = [];
            for (var i = 0; i < selObject.length; i++) {
                for (var k in cols) {
                    if (cols[k].Order === selObject[i]) {
                        result.push(cols[k]);
                    }
                }
            }
            return result;
        }

        public getSelectedColumnsByObject(dataObject: any): IColumn[] {
            return this.getSelectedColumns(dataObject['__key']);
        }

        //#region Cells selection
        public toggleCellsByDisplayIndex(displayIndex: number, columnNames: string[], select?: boolean) {
            if (displayIndex < 0 || displayIndex >= this._masterTable.DataHolder.DisplayedData.length) return;
            this.toggleCells(this._masterTable.DataHolder.DisplayedData[displayIndex]['__key'], columnNames, select);
        }

        public toggleCellsByObject(dataObject: any, columnNames: string[], select?: boolean) {
            this.toggleCells(dataObject['__key'], columnNames, select);
        }

        public toggleCells(primaryKey: string, columnNames: string[], select?: boolean) {
            this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
            var arr = null;
            if (this._selectionData.hasOwnProperty(primaryKey)) {
                arr = this._selectionData[primaryKey];
            } else {
                arr = [];
                this._selectionData[primaryKey] = arr;
            }
            var cols = this._masterTable.InstanceManager.Columns;
            var columnsToRedraw = [];
            var data = this._masterTable.DataHolder.getByPrimaryKey(primaryKey);

            for (var i = 0; i < columnNames.length; i++) {
                var idx = cols[columnNames[i]].Order;
                var colIdx = arr.indexOf(idx);
                var srcLen = arr.length;
                var selectIt = select;
                if ((this._configuration.NonselectableColumns.indexOf(columnNames[i]) < 0)) continue;

                if (selectIt == null || selectIt == undefined) {
                    if (colIdx > -1) selectIt = false;
                    else selectIt = true;
                }
                if (this._configuration.CanSelectCellFunction != null && !this._configuration.CanSelectCellFunction(data, columnNames[i], selectIt)) continue;

                if (selectIt && colIdx < 0) arr.push(idx);
                if ((!selectIt) && colIdx > -1) arr.splice(colIdx, 1);

                if (srcLen !== arr.length) columnsToRedraw.push(cols[columnNames[i]]);
            }
            if (arr.length === 0) {
                delete this._selectionData[primaryKey];
            }
            this._masterTable.Controller.redrawVisibleCells(data, columnsToRedraw);
            this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
        }

        public setCellsByDisplayIndex(displayIndex: number, columnNames: string[]) {
            if (displayIndex < 0 || displayIndex >= this._masterTable.DataHolder.DisplayedData.length) return;
            this.setCells(this._masterTable.DataHolder.DisplayedData[displayIndex]['__key'], columnNames);
        }

        public setCellsByObject(dataObject: any, columnNames: string[]) {
            this.setCells(dataObject['__key'], columnNames);
        }

        public setCells(primaryKey: string, columnNames: string[]) {
            this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
            var arr = null;
            if (this._selectionData.hasOwnProperty(primaryKey)) {
                arr = this._selectionData[primaryKey];
            } else {
                arr = [];
            }
            var cols = this._masterTable.InstanceManager.Columns;
            var columnsToRedraw = [];
            var data = this._masterTable.DataHolder.getByPrimaryKey(primaryKey);
            var newArr = [];

            var allColsNames = this._masterTable.InstanceManager.getColumnNames();

            for (var j = 0; j < columnNames.length; j++) {
                if (this._configuration.NonselectableColumns) {
                    if ((this._configuration.NonselectableColumns.indexOf(columnNames[j]) < 0)) continue;
                }
                if (this._configuration.CanSelectCellFunction != null && !this._configuration.CanSelectCellFunction(data, columnNames[j], true)) continue;

                newArr.push(cols[columnNames[j]].Order);
            }

            var maxArr = newArr.length > arr.length ? newArr : arr;
            for (var k = 0; k < maxArr.length; k++) {
                var colNum = maxArr[k];
                var nw = newArr.indexOf(colNum) > -1;
                var old = arr.indexOf(colNum) > -1;

                if (nw && !old) columnsToRedraw.push(cols[allColsNames[colNum]]);
                if (old && !nw) columnsToRedraw.push(cols[allColsNames[colNum]]);
            }

            if (newArr.length === 0) {
                delete this._selectionData[primaryKey];
            } else {
                this._selectionData[primaryKey] = newArr;

            }
            this._masterTable.Controller.redrawVisibleCells(data, columnsToRedraw);
            this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
        }



        //#endregion
        handleAdditionalData(additionalData): void {
            var ad = additionalData as PowerTables.Adjustments.ISelectionAdditionalData;
            if (ad.SelectionToggle === PowerTables.Adjustments.SelectionToggle.All) {
                this.toggleAll(true);
            } else if (ad.SelectionToggle === PowerTables.Adjustments.SelectionToggle.Nothing) {
                this.resetSelection();
            } else {
                for (var ok in ad.Select) {
                    if (ad.Select[ok] == null || ad.Select[ok].length === 0) {
                        this.toggleRow(ok, true);
                    } else {
                        this.setCells(ok, ad.Select[ok]);
                    }
                }

                for (var ok2 in ad.Unselect) {
                    if (ad.Unselect[ok2] == null || ad.Unselect[ok2].length === 0) {
                        this.toggleRow(ok2, true);
                    } else {
                        this.toggleCells(ok2, ad.Unselect[ok2], false);
                    }
                }
            }

        }
    }
} 