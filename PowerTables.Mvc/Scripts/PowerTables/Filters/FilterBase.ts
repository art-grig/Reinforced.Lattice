module PowerTables {
    export class FilterBase<TConfiguration>
        extends RenderableComponent
        implements IFilter {

        constructor(templateId: string, column: IColumn) {
            super(templateId);

            this.Column = column;
            this.Table = <any>column.MasterTable;
            this.Configuration = column.Configuration.Filter.FilterConfiguration;
            this.IsDateTime = this.Table.isDateTime(column.RawName);
        }

        public Configuration: TConfiguration;
        public Column: IColumn;
        protected  Table: PowerTable;
        public IsDateTime:boolean;

        public reset(): void {
            
        }

        modifyQuery(query: IQuery): void {
            query.Filterings[this.Column.RawName] = this.getArgument();
        }

        getArgument():string {
            return '';
        }
    }
} 