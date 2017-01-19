module PowerTables.Services {
    export class PartitionService {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
        }

        private _masterTable: IMasterTable;

        public Skip: number;
        public Take: number;

        public IsAllDataRetrieved: boolean;
        public IsTotalCountKnown: boolean;

        public setSkip(skip: number) {

        }

        public setTake(take?: number) {
            
        }

        public partitionBefore(serverQuery: IQuery, cllientQuery: IQuery) {

        }


        public partitionAfter(serverQuery: IQuery, cllientQuery: IQuery) {
            
        }

        private skipTakeSet(ordered: any[], query: IQuery): any[] {
            var selected = ordered;

            if (query.Partition == null) {
                
            }

            var startingIndex: number = query.Paging.PageIndex * query.Paging.PageSize;
            if (startingIndex > ordered.length) startingIndex = 0;
            var take: number = query.Paging.PageSize;
            if (this.EnableClientSkip && this.EnableClientTake) {
                if (take === 0) selected = ordered.slice(startingIndex);
                else selected = ordered.slice(startingIndex, startingIndex + take);
            } else {
                if (this.EnableClientSkip) {
                    selected = ordered.slice(startingIndex);
                } else if (this.EnableClientTake) {
                    if (take !== 0) {
                        selected = ordered.slice(0, query.Paging.PageSize);
                    }
                }
            }
            return selected;
        }
    }
}