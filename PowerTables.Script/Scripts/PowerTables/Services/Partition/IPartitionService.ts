﻿module PowerTables.Services.Partition {
    export interface IPartitionService {
        Skip: number;
        Take: number;

        setSkip(skip: number, preserveTake?: boolean): void;
        setTake(take?: number): void;
        partitionBeforeQuery(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): void;
        partitionBeforeCommand(serverQuery: IQuery): void;
        partitionAfterQuery(initialSet: any[], query: IQuery): any[];

        amount(): number;
        isAmountFinite(): boolean;
        totalAmount(): number;
        initial(skip: number, take: number);
    }
}