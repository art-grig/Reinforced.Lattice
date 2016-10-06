module PowerTables.Services {
    export class SelectionService implements IQueryPartProvider {

        constructor(dataHolder: PowerTables.Services.DataHolderService, loader: PowerTables.Services.LoaderService, instanceManager: PowerTables.Services.InstanceManagerService,events:PowerTables.Services.EventsService) {
            this._dataHolder = dataHolder;
            loader.registerQueryPartProvider(this);
            this._instanceManager = instanceManager;
            this._events = events;
        }

        private _dataHolder: PowerTables.Services.DataHolderService;
        private _instanceManager: PowerTables.Services.InstanceManagerService;
        private _events:EventsService;

        private _selectionData: { [primaryKey: string]: number[] } = {};

        public isSelected(dataObject: any) {
            return this._selectionData.hasOwnProperty(dataObject['__key']);
        }

        public isSelectedPrimaryKey(primaryKey: string) {
            return this._selectionData.hasOwnProperty(primaryKey);
        }

        public toggleRowByPrimaryKey(primaryKey: string, selected?: boolean) {
            if (selected == undefined || selected == null) {
                selected = !this.isSelectedPrimaryKey(primaryKey);
            }

            if (selected) {
                delete this._selectionData[primaryKey];
                //todo redraw
            } else {
                this._selectionData[primaryKey] = [];
                // todo redraw
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
                objects.push(this._dataHolder.getByPrimaryKey(k));
            }
            return objects;
        }

        public getSelectedColumns(primaryKey: string): IColumn[] {
            var cols = this._instanceManager.Columns;
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

        public toggleColumns(primaryKey: string, columnNames: string[], select?: boolean) {
            var arr = null;
            if (this._selectionData.hasOwnProperty(primaryKey)) {
                arr = this._selectionData[primaryKey];
            } else {
                arr = [];
                this._selectionData[primaryKey] = arr;
            }
            var cols = this._instanceManager.Columns;
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
                        }
                    } else {
                        if (colIdx > -1) arr.splice(colIdx, 1);
                    }
                }
                if (srcLen !== arr.length) columnsToRedraw.push(cols[columnNames[i]]);
            }
            if (arr.length === 0) {
                delete this._selectionData[primaryKey];
            }
            //todo redraw
        }
    }
} 