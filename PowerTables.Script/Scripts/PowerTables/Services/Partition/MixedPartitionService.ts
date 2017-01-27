module PowerTables.Services.Partition {
    export class MixedPartitionService implements IPartitionService {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
        }

        private _masterTable: IMasterTable;

        public setSkip(skip: number): void {}

        public setTake(take?: number): void {}

        public partitionBeforeQuery(serverQuery: IQuery, scope: QueryScope): QueryScope { throw new Error("Not implemented"); }

        public partitionBeforeCommand(serverQuery: IQuery): void {}

        public partitionAfterQuery(initialSet: any[], query: IQuery): any[] { throw new Error("Not implemented"); }

        public Skip: number;
        public Take: number;
        public IsAllDataRetrieved: boolean;
        public IsTotalCountKnown: boolean;
    }
}