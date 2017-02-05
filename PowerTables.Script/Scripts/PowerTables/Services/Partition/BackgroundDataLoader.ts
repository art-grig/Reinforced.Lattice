module PowerTables.Services.Partition {
    export class BackgroundDataLoader {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
            this._indicator = new PowerTables.Services.Partition.PartitionIndicatorRow(masterTable, this);
        }

        private _masterTable: IMasterTable;
        private _dataAppendError: any;
        private  _indicator: PartitionIndicatorRow;

        public AppendLoadingRow: boolean;
        public FinishReached: boolean;
        public IsLoadingNextPart: boolean;
        public UseLoadMore: boolean;

        private _skip: number;
        private _take: number;

        public skipTake(skip: number, take: number) {
            this._skip = skip;
            this._take = take;
        }

        public provideIndicator(rows: IRow[]) {
            this._indicationShown = true;
            rows.push(this._indicator);
        }

        public loadNextDataPart(pages: number) {
            if (this.FinishReached) return;
            this.ClientSearchParameters = BackgroundDataLoader.any(this._masterTable.DataHolder.RecentClientQuery.Filterings);

            this.IsLoadingNextPart = true;
            if (this.AppendLoadingRow) this.showIndication();

            this._masterTable.Loader.query(
                (d) => this.dataAppendLoaded(d, pages),
                (q) => this.modifyDataAppendQuery(q, pages),
                this._dataAppendError,
                true
            );
        }
        private dataAppendError(data: any) {
            this.IsLoadingNextPart = false;
            if (this.AppendLoadingRow) this.destroyIndication();
        }

        private modifyDataAppendQuery(q: IQuery, pages: number): IQuery {
            q.IsBackgroundDataFetch = true;
            q.Partition = {
                NoCount: true,
                Skip: this._masterTable.DataHolder.StoredData.length,
                Take: this._take * pages
            }
            
            return q;
        }

        private static any(o: any) {
            for (var k in o) if (o.hasOwnProperty(k)) return true;
            return false;
        }
        private dataAppendLoaded(data: IPowerTablesResponse, pagesRequested: number) {
            this.IsLoadingNextPart = false;
            if (this.AppendLoadingRow) this.destroyIndication();
            this.FinishReached = (data.BatchSize < this._take * pagesRequested);

            if (this._masterTable.DataHolder.Ordered.length < this._take * pagesRequested) {
                console.log("not enough data, loading");
                if (this.UseLoadMore) {
                    this.destroyIndication();
                    this.showIndication();
                } else {
                    setTimeout(() => this.loadNextDataPart(pagesRequested), 5);
                }
            } else {
                console.log("enough data loaded");
            }
        }

        public ClientSearchParameters: boolean;

        private _indicationShown: boolean = false;
        public showIndication() {
            if (this._indicationShown) return;
            this._masterTable.Renderer.Modifier.appendRow(this._indicator);
            this._indicationShown = true;
        }

        public destroyIndication() {
            if (!this._indicationShown) return;
            this._masterTable.Renderer.Modifier.destroyPartitionRow();
            this._indicationShown = false;
        }

        public loadMore(page?: number) {
            this.destroyIndication();
            this.loadNextDataPart(page);
        }
    }
}