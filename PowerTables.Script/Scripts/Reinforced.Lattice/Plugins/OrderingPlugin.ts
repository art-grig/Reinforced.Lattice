module Reinforced.Lattice.Plugins.Ordering {
    export class OrderingPlugin extends Reinforced.Lattice.Filters.FilterBase<IOrderingConfiguration> {
        private _clientOrderings: { [key: string]: Reinforced.Lattice.Ordering } = {};
        private _serverOrderings: { [key: string]: Reinforced.Lattice.Ordering } = {};
        private _boundHandler: any;

        public subscribe(e: Reinforced.Lattice.Services.EventsService): void {
            e.ColumnsCreation.subscribe(v => {
                this.overrideHeadersTemplates(v.EventArgs);
            }, 'ordering');
        }


        private overrideHeadersTemplates(columns: { [key: string]: IColumn }) {
            var templId = this.RawConfig.TemplateId;
            for (var ck in columns) {
                if (columns.hasOwnProperty(ck)) {
                    var ordering = this.Configuration.DefaultOrderingsForColumns[ck];
                    this.updateOrdering(ck, ordering);

                    if (columns[ck].Configuration.IsDataOnly) continue;
                    if (ordering == null || ordering == undefined) continue;
                    var newHeader: ICustomHeader = {
                        Column: columns[ck],
                        switchOrdering: (e) => {
                            this.switchOrderingForColumn(e.Receiver.Column.RawName);
                        },
                        TemplateIdOverride: templId,
                        IsClientOrdering: this.isClient(ck)
                    };
                    
                    this.specifyOrdering(newHeader, ordering);
                    columns[ck].Header = newHeader;

                }
            }
        }

        private updateOrdering(columnName: string, ordering: Reinforced.Lattice.Ordering) {
            if (this.isClient(columnName)) this._clientOrderings[columnName] = ordering;
            else this._serverOrderings[columnName] = ordering;
        }

        private specifyOrdering(object: ICustomHeader, ordering: Reinforced.Lattice.Ordering) {
            object.IsNeutral = object.IsDescending = object.IsAscending = false;
            switch (ordering) {
                case Reinforced.Lattice.Ordering.Neutral: object.IsNeutral = true; break;
                case Reinforced.Lattice.Ordering.Descending: object.IsDescending = true; break;
                case Reinforced.Lattice.Ordering.Ascending: object.IsAscending = true; break;
            }
        }

        private isClient(columnName: string): boolean {
            return this.Configuration.ClientSortableColumns.hasOwnProperty(columnName);
        }
        public switchOrderingForColumn(columnName: string) {
            if (this.Configuration.DefaultOrderingsForColumns[columnName] == null || this.Configuration.DefaultOrderingsForColumns[columnName] == undefined)throw new Error(`Ordering is not configured for column ${columnName}`);
            var orderingsCollection = this.isClient(columnName) ? this._clientOrderings : this._serverOrderings;
            var next = this.nextOrdering(orderingsCollection[columnName]);
            this.setOrderingForColumn(columnName, next);
        }

        public setOrderingForColumn(columnName: string, ordering: Reinforced.Lattice.Ordering) {
            var coolHeader = <ICustomHeader>this.MasterTable.InstanceManager.Columns[columnName].Header;
            this.specifyOrdering(coolHeader, ordering);
            this.updateOrdering(columnName, ordering);
            this.MasterTable.Renderer.Modifier.redrawHeader(coolHeader.Column);
            this.MasterTable.Controller.reload();
        }

        protected nextOrdering(currentOrdering: Reinforced.Lattice.Ordering) : Reinforced.Lattice.Ordering {

            switch (currentOrdering) {
                case Reinforced.Lattice.Ordering.Neutral: return Reinforced.Lattice.Ordering.Ascending;
                case Reinforced.Lattice.Ordering.Descending: return Reinforced.Lattice.Ordering.Neutral;
                case Reinforced.Lattice.Ordering.Ascending: return Reinforced.Lattice.Ordering.Descending;
            }
        }

        private makeDefaultOrderingFunction(fieldName: string) {
            var self = this;
            return (function (field) {
                return function (a, b) {
                    var x = a[field], y = b[field];
                    if (x === y) return 0;
                    if (x == null || x == undefined) return -1;
                    if (y == null || y == undefined) return 1;
                    if (typeof x === "string") {
                        return x.localeCompare(y);
                    }
                    return (x > y) ? 1 : -1;
                }
            })(fieldName);
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            var hasClientOrderings = false;
            var fn: (a: any, b: any) => any;
            for (var cls in this.Configuration.ClientSortableColumns) {
                if (this.Configuration.ClientSortableColumns.hasOwnProperty(cls)) {
                    hasClientOrderings = true;

                    fn = this.Configuration.ClientSortableColumns[cls];
                    if (!fn) {
                        fn = this.makeDefaultOrderingFunction(cls);
                        this.Configuration.ClientSortableColumns[cls] = fn;
                    }
                    this.MasterTable.DataHolder.registerClientOrdering(cls, fn);
                }
            }

            if (hasClientOrderings) {
                // if we have at least 1 client ordering then we have to reorder whole 
                // received data on client
                // to avoid client ordering priority
                for (var serverColumn in this.Configuration.DefaultOrderingsForColumns) {
                    if (this.isClient(serverColumn)) continue;
                    fn = this.makeDefaultOrderingFunction(serverColumn);
                    this.MasterTable.DataHolder.registerClientOrdering(serverColumn, fn);
                }
            }
        }

        private mixinOrderings(orderingsCollection: { [key: string]: Reinforced.Lattice.Ordering }, query: IQuery) {
            for (var clo in orderingsCollection) {
                if (orderingsCollection.hasOwnProperty(clo)) {
                    query.Orderings[clo] = orderingsCollection[clo];
                }
            }
        }

        public modifyQuery(query: IQuery, scope: QueryScope): void {
            this.mixinOrderings(this._serverOrderings, query);
            if (scope === QueryScope.Client || scope === QueryScope.Transboundary) {
                this.mixinOrderings(this._clientOrderings, query);
            }
        }
    }

    interface ICustomHeader extends IColumnHeader {
        switchOrdering: (e: Reinforced.Lattice.ITemplateBoundEvent) => void;
        IsNeutral?: boolean;
        IsAscending?: boolean;
        IsDescending?: boolean;
        IsClientOrdering: boolean;
    }

    ComponentsContainer.registerComponent('Ordering', OrderingPlugin);
} 