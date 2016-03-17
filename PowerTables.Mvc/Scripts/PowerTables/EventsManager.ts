module PowerTables {
    export class TableEvent<TFunc> {
        private _handlers: { [key: string]: TFunc[] } = {};

        public invoke(thisArg: any, args?: any[]): void {

            let hndlrs = this._handlers;
            var i = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        (<any>kHandlers[i]).apply(thisArg, args);
                    }
                    i = 0;
                }
            }
        }

        public subscribe(handler: TFunc, key: string): void {
            if (!this._handlers[key]) {
                this._handlers[key] = [];
            }
            this._handlers[key].push(handler);
        }

        public unsubscribe(key: string): void {
            this._handlers[key] = null;
            delete this._handlers[key];
        }
    }
    export class EventsManager {

        public AfterInit: TableEvent<(table: PowerTable) => void> = new TableEvent<(table: PowerTable) => void>();

        public BeforeColumnsRender: TableEvent<(table: PowerTable) => void> = new TableEvent<(table: PowerTable) => void>();
        public AfterColumnsRender: TableEvent<(table: PowerTable) => void> = new TableEvent<(table: PowerTable) => void>();

        public BeforeFiltersRender: TableEvent<(table: PowerTable) => void> = new TableEvent<(table: PowerTable) => void>();

        public BeforeFilterRender: TableEvent<(column: IColumn) => void> = new TableEvent<(column: IColumn) => void>();
        public AfterFilterRender: TableEvent<(column: IColumn) => void> = new TableEvent<(column: IColumn) => void>();

        public AfterFiltersRender: TableEvent<(table: PowerTable) => void> = new TableEvent<(table: PowerTable) => void>();

        public BeforeColumnHeaderRender: TableEvent<(column: IColumn) => void> = new TableEvent<(column: IColumn) => void>();
        public AfterColumnHeaderRender: TableEvent<(column: IColumn) => void> = new TableEvent<(column: IColumn) => void>();

        public BeforeLoading: TableEvent<(table: PowerTable) => void> = new TableEvent<(table: PowerTable) => void>();
        public DataReceived: TableEvent<(data: any) => void> = new TableEvent<(data: any) => void>();
        public AfterLoading: TableEvent<(table: PowerTable) => void> = new TableEvent<(table: PowerTable) => void>();

        public BeforeResponseDrawing: TableEvent<(response: IPowerTablesResponse) => void> = new TableEvent<(response: IPowerTablesResponse) => void>();
        public ResponseDrawing: TableEvent<(response: IPowerTablesResponse) => void> = new TableEvent<(response: IPowerTablesResponse) => void>();

        public ColumnsOrdering: TableEvent<(table: PowerTable, columnOrder: string[]) => void> = new TableEvent<(table: PowerTable, columnOrder: string[]) => void>();

        public BeforeFilterGathering: TableEvent<(query: IQuery) => void> = new TableEvent<(query: IQuery) => void>();
        public AfterFilterGathering: TableEvent<(query: IQuery) => void> = new TableEvent<(query: IQuery) => void>();

        public BeforeRowDraw: TableEvent<(table: PowerTable, row: IRow) => void> = new TableEvent<(table: PowerTable, row: IRow) => void>();
        public AfterRowDraw: TableEvent<(table: PowerTable, row: IRow) => void> = new TableEvent<(table: PowerTable, row: IRow) => void>();

        public BeforeCellDraw: TableEvent<(cell: ICell) => void> = new TableEvent<(cell: ICell) => void>();
        public AfterCellDraw: TableEvent<(cell: ICell) => void> = new TableEvent<(cell: ICell) => void>();

        public BeforeLayoutDraw: TableEvent<(cell: ICell) => void> = new TableEvent<(cell: ICell) => void>();
        public AfterLayoutDraw: TableEvent<(cell: ICell) => void> = new TableEvent<(cell: ICell) => void>();

        public SelectionChanged: TableEvent<(selection: string[]) => void> = new TableEvent<(selection: string[]) => void>();
    }
} 