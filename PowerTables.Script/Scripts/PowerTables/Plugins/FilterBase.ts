module PowerTables.Plugins {

    /**
     * Base class for creating filters
     */
    export class FilterBase<T> extends PluginBase<T> implements IQueryPartProvider, IClientFilter,IClientTruncator {
        
        modifyQuery(query: IQuery, scope: QueryScope): void { }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MasterTable.Loader.registerQueryPartProvider(this);
        }

        /**
         * Call this method inside init and override filterPredicate method to make this filter 
         * participate in client-side filtering
         */
        protected itIsClientFilter() :void {
            this.MasterTable.DataHolder.registerClientFilter(this);
        }

        /**
         * Call this method inside init and override selectData method to make this filter 
         * participate in client-side data truncation
         */
        protected itIsClientDataTruncator() {
            this.MasterTable.DataHolder.Selector = this;
        }

        filterPredicate(rowObject, query: IQuery): boolean { throw new Error("Please override this method"); }

        selectData(sourceDataSet: any[], query: IQuery): any[] { throw new Error("Please override this method"); }
    }
} 