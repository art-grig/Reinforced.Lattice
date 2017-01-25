module PowerTables.Services.Partition {
    export class ClientPartitionService implements IPartitionService {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
        }

        private _masterTable: IMasterTable;
        public setSkip(skip: number): void {
            if (skip < 0) skip = 0;
            var prevSkip = this.Skip;
            if (prevSkip === skip) return;
            
            
            if (this.Take > 0) {
                if (skip >= prevSkip + this.Take || skip <= prevSkip - this.Take) {
                    this.cutDisplayed(skip, this.Take);
                    this._masterTable.Controller.redrawVisibleData();
                } else {
                    var prevIdx = this.displayedIndexes();
                    this.cutDisplayed(skip, this.Take);
                    var curIdx = this.displayedIndexes();
                    var diff = Math.abs(prevSkip - skip);

                    var rows = this._masterTable.Controller.produceRows();
                    for (var i = 0; i < diff; i++) {
                        if (skip > prevSkip) {

                        } else {

                        }
                    }
                    

                    
                    for (var j = 0; j < rows.length; j++) {
                        if (rows[j].IsSpecial) this._masterTable.Renderer.Modifier.redrawRow(rows[j]);
                        else {
                            var di = rows[j].Index;
                            if (!Q.contains(prevIdx,di))
                        }
                    }
                }
            } else {
                
            }
        }
        private displayedIndexes(): number[] {
            var currentIndexes = [];
            for (var i = 0; i < this._masterTable.DataHolder.DisplayedData.length; i++) {
                currentIndexes.push(this._masterTable.DataHolder.DisplayedData[i]['__i']);
            }
            return currentIndexes;
        }

        public setTake(take?: number): void {
            if (take == null) take = 0;
            if (take === 0) {

            }
            var prevTake = this.Take;
            if (take < prevTake) {
                var dd = this._masterTable.DataHolder.DisplayedData;
                for (var i = take; i < prevTake; i++) {
                    this._masterTable.Renderer.Modifier.destroyRowByIndex(dd[i]['__i']);
                }

            } else {

            }
            this.Take = take;
        }

        public partitionBeforeQuery(serverQuery: IQuery, scope: QueryScope): QueryScope {
            serverQuery.Partition = {
                NoCount: true,
                Take: 0,
                Skip: 0
            };
            return scope;
        }

        public partitionBeforeCommand(serverQuery: IQuery): void {
            serverQuery.Partition = {
                NoCount: true,
                Take: this.Take,
                Skip: this.Skip
            };
        }

        public partitionAfterQuery(initialSet: any[], query: IQuery): any[] {
            this.IsAllDataRetrieved = true;
            this.IsTotalCountKnown = true;
            this.TotalCount = this._masterTable.DataHolder.StoredData.length;
            return this.skipTakeSet(initialSet, query);
        }

        private skipTakeSet(ordered: any[], query: IQuery): any[] {
            return this.cut(ordered, this.Skip, this.Take);
        }

        private cut(ordered: any[], skip: number, take: number) {
            var selected = ordered;
            if (skip > ordered.length) skip = 0;
            if (take === 0) selected = ordered.slice(skip);
            else selected = ordered.slice(skip, skip + take);
            return selected;
        }

        private cutDisplayed(skip: number, take: number) {
            this._masterTable.DataHolder.DisplayedData = this.cut(this._masterTable.DataHolder.Ordered, skip, take);
        }

        public Skip: number;
        public Take: number;
        public TotalCount: number;

        public IsAllDataRetrieved: boolean;
        public IsTotalCountKnown: boolean;
    }
}