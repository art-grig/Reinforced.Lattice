module PowerTables.Services {
    export class SelectionService implements IQueryPartProvider {

        constructor(masterTable: IMasterTable) {
            masterTable.Loader.registerQueryPartProvider(this);
            this._masterTable = masterTable;
            this._configuration = this._masterTable.InstanceManager.Configuration.SelectionConfiguration;
        }

        private _configuration: PowerTables.Configuration.Json.ISelectionConfiguration;

        private _masterTable: IMasterTable;

        private _selectionData: { [primaryKey: string]: number[] } = {};
        private _isAllSelected: boolean = false;

        public isSelected(dataObject: any): boolean {
            return this.isSelectedPrimaryKey(dataObject['__key']);
        }

        public isAllSelected(): boolean {
            return this._isAllSelected;
        }

        public canSelectAll(): boolean {
            if (this._configuration.SelectAllBehavior === PowerTables.Configuration.Json.SelectAllBehavior.OnlyIfAllDataVisible) {
                return this._masterTable.DataHolder.StoredData.length === this._masterTable.DataHolder.DisplayedData.length;
            }
            return true;
        }

        public resetSelection() {
            this.toggleAll(false);
        }

        public toggleAll(selected?: boolean) {
            
            if (this._configuration.SelectAllBehavior === PowerTables.Configuration.Json.SelectAllBehavior.OnlyIfAllDataVisible) {
                if (this._masterTable.DataHolder.StoredData.length !==
                    this._masterTable.DataHolder.DisplayedData.length) return;
            }
            this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);

            if (selected == null) {
                selected = !this._isAllSelected;
            }
            var redrawAll = false;

            var objectsToRedraw = [];
            var objSet = null;
            if (this._configuration.SelectAllBehavior === PowerTables.Configuration.Json.SelectAllBehavior.AllVisible ||
                this._configuration.SelectAllBehavior ===
                PowerTables.Configuration.Json.SelectAllBehavior.OnlyIfAllDataVisible
            ) {
                objSet = this._masterTable.DataHolder.DisplayedData;
            } else {
                objSet = this._masterTable.DataHolder.StoredData;
            }
            if (selected) {
                for (var i = 0; i < objSet.length; i++) {
                    var sd = objSet[i];
                    if (!this._selectionData.hasOwnProperty(sd["__key"])) {
                        objectsToRedraw.push(sd);
                        this._selectionData[sd["__key"]] = [];
                    }
                }
            } else {
                for (var i = 0; i < objSet.length; i++) {
                    var sd = objSet[i];
                    if (this._selectionData.hasOwnProperty(sd["__key"])) {
                        objectsToRedraw.push(sd);
                        delete this._selectionData[sd["__key"]];
                    }
                }
            }
            this._isAllSelected = selected;
            
            this._masterTable.Controller.redrawVisibleData(); //todo
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

        public toggleRowByPrimaryKey(primaryKey: string, selected?: boolean): void {
            this._masterTable.Events.SelectionChanged.invokeBefore(this, this._selectionData);
            if (selected == undefined || selected == null) {
                selected = !this.isSelectedPrimaryKey(primaryKey);
            }

            if (selected) {
                if (!this._selectionData.hasOwnProperty(primaryKey)) {
                    this._selectionData[primaryKey] = [];
                    this._masterTable.Events.SelectionChanged.invoke(this, this._selectionData);
                    this._masterTable.Controller.redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(primaryKey));
                    this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                }
            } else {
                if (this._selectionData.hasOwnProperty(primaryKey)) {
                    delete this._selectionData[primaryKey];
                    this._masterTable.Events.SelectionChanged.invoke(this, this._selectionData);
                    this._masterTable.Controller.redrawVisibleDataObject(this._masterTable.DataHolder.getByPrimaryKey(primaryKey));
                    this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
                }
            }
            
        }

        public toggleObjectSelected(dataObject: any, selected?: boolean) {
            this.toggleRowByPrimaryKey(dataObject['__key'], selected);
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

            for (var i = 0; i < columnNames.length; i++) {
                var idx = cols[columnNames[i]].Order;
                var colIdx = arr.indexOf(idx);
                var srcLen = arr.length;
                if (select == null || select == undefined) {
                    if (colIdx > -1) arr.splice(colIdx, 1);
                    else arr.push(idx);
                } else {
                    if (select) {
                        if (colIdx < 0) {
                            arr.push(idx);
                            //if (!this._selectedColsObjects[idx]) this._selectedColsObjects[idx] = [];
                            //this._selectedColsObjects[idx].push(primaryKey);
                        }
                    } else {
                        if (colIdx > -1) {
                            arr.splice(colIdx, 1);
                            //if (this._selectedColsObjects[idx]) {
                            //    this._selectedColsObjects[idx]
                            //        .splice(this._selectedColsObjects[idx].indexOf(primaryKey));
                            //}
                        }
                    }
                }
                if (srcLen !== arr.length) columnsToRedraw.push(cols[columnNames[i]]);
            }
            if (arr.length === 0) {
                delete this._selectionData[primaryKey];
            }
            this._masterTable.Controller.redrawVisibleCells(this._masterTable.DataHolder.getByPrimaryKey(primaryKey), columnsToRedraw);
            this._masterTable.Events.SelectionChanged.invokeAfter(this, this._selectionData);
        }
    }
} 