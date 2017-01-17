module PowerTables.Services {
    export class PartitionService {
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

        public partitionAfter(ordered: any[], serverQuery: IQuery, cllientQuery: IQuery) {
            
        }
    }
}