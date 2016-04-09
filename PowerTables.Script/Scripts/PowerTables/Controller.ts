module PowerTables {
    /**
     * This entity is responsible for integration of data between storage and rendere. 
     * Also it provides functionality for table events subscription and 
     * elements location
     */
    export class Controller {
        private _masterTable: IMasterTable;
        private _rootSelector:string;

        /**
         * Initializes full reloading cycle
         * @returns {} 
         */
        public reload(): void {

        }

        private redrawCurrentlyDisplayingObjects() {
            
        }

        public subscribeCellEvent(eventId: string, selector: string, subscriptionId: string, handler: (e: ICellEventArgs) => any) {

        }

        public subscribeRowEvent(eventId: string, selector: string, subscriptionId: string, handler: (e: ICellEventArgs) => any) {

        }

        public insertLocalRow(object: any, index: number) {

        }

        public deleteLocalRow(index: number) {

        }

        public updateLocalRow(index: number, updateFn: (object: any) => void) {

        }

        public produceRow(dataObject: any, columns: IColumn[], idx: number): IRow {
            var rw = <IRow>{
                DataObject: dataObject[idx],
                Index: idx,
                MasterTable: this._masterTable
            }
            var cells: { [key: string]: ICell } = {};

            for (var j = 0; j < columns.length; j++) {
                var col = columns[j];
                var cell: ICell = {
                    Column: col,
                    Data: dataObject[col.RawName],
                    DataObject: dataObject,
                    Row: rw,
                    renderContent: null,
                    renderElement: null
                };
                cells[col.RawName] = cell;
            }
            rw.Cells = cells;
            return rw;
        }

        private produceRows(): IRow[] {
            var result: IRow[] = [];
            var columns = this._masterTable.InstanceManager.getUiColumns();

            for (var i = 0; i < this._masterTable.DataHolder.CurrentlyDisplaying.length; i++) {
                result.push(this.produceRow(this._masterTable.DataHolder.CurrentlyDisplaying[i], columns, i));
            }
            return result;
        }
    }

    /**
     * Event arguments for particular cell event
     */
    export interface ICellEventArgs extends IRowEventArgs {
        /**
         * Column related to particular cell
         */
        Column: IColumn;
        
    }

    export interface IRowEventArgs {
        /**
        * Master table reference
        */
        Table: IMasterTable;

        /**
         * Cell data object
         */
        DataObject: any;

        /**
         * Original event reference
         */
        OriginalEvent: Event;

        /**
         * Row index
         */
        Index: number;
    }
} 