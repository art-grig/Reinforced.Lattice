module PowerTables.Services.Partition {
    export interface IPartitionService {
        Skip: number;
        Take: number;

        IsAllDataRetrieved: boolean;
        IsTotalCountKnown: boolean;
        TotalCount: number;

        setSkip(skip: number): void;
        setTake(take?: number): void;
        partitionBeforeQuery(serverQuery: IQuery, scope: QueryScope): QueryScope;
        partitionBeforeCommand(serverQuery: IQuery): void;
        partitionAfterQuery(initialSet:any[],query: IQuery): any[];
    }
}