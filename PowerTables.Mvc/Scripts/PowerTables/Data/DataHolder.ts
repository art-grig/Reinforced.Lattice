module PowerTables {
    export class DataHolder {
        constructor(table: PowerTable) {
            this._table = table;
            this.Rows = [];
        }

        public CurrentPageIndex: number;
        public CurrentTotalResultsCount:number;
        public CurrentData: any[];
        private _table: PowerTable;
        public Rows:IRow[];

        public storeResponse(response: IPowerTablesResponse,data:any[]):void {
            this.CurrentPageIndex = response.PageIndex;
            this.CurrentTotalResultsCount = response.ResultsCount;
            this.CurrentData = data;

            this.Rows = [];
        }

        public storeRow(row:IRow) {
            this.Rows.push(row);
        }
    }
} 