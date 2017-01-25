module PowerTables.Services.Partition {
    export class MixedPartitionService implements IPartitionService {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
        }

        private _masterTable: IMasterTable;
        public setSkip(skip: number): void { }

        public setTake(take?: number): void { }

        public partitionBeforeQuery(serverQuery: IQuery, scope: QueryScope): void { }
        public partitionBeforeCommand(serverQuery: IQuery): void { }

        public partitionAfterQuery(query: IQuery): any { }

        public Skip: number;
        public Take: number;
        public IsAllDataRetrieved: boolean;
        public IsTotalCountKnown: boolean;
    }
}