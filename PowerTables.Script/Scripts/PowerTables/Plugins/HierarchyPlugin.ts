module PowerTables.Plugins.Hierarchy {
    export class HierarchyPlugin extends PluginBase<IHierarchyUiConfiguration> {
        private _parentKeyFunction: (x: any) => string;
        private _hierarchy: { [_: number]: number[] } = {};

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this._parentKeyFunction = this.MasterTable.DataHolder
                .compileKeyFunction(this.Configuration.ParentKeyFields);
            //this.MasterTable.DataHolder.registerClientOrdering("TreeOrder", this.hierarchicalOrder.bind(this));
        }

        private toggleObject(dataObject: any, expand: boolean) {
            
        }

        private onFiltered_after() {
            var src = this.MasterTable.DataHolder.Filtered;
            if (this.Configuration.CollapsedNodeFilterBehavior === TreeCollapsedNodeFilterBehavior.ExcludeCollapsed) {
                var cpy = [];
                for (var i = 0; i < src.length; i++) {
                    if (src[i].IsVisible) cpy.push(src[i]);
                }
                src = cpy;
            }
            var expandParents = this.Configuration.CollapsedNodeFilterBehavior ===
                TreeCollapsedNodeFilterBehavior.IncludeCollapsed;
            var addParents: { [_: number]: boolean } = {};

            for (var j = 0; j < src.length; j++) {
                if (addParents[src[j]['__i']]) delete addParents[src[j]['__i']];
                else {
                    this.addParents(src[j], addParents);
                }
            }

            for (var k in addParents) {
                var obj = this.MasterTable.DataHolder.StoredCache[k];
                if (expandParents) {
                    this.toggleObject(obj,true);
                }
                src.push(obj);
            }
            this.MasterTable.DataHolder.Filtered = src;
        }

        private addParents(o: any, existing: { [_: number]: boolean }) {
            if (o['__parent'] == null) return;
            while (o['__parent'] != null) {
                o = this.MasterTable.DataHolder.getByPrimaryKey(o['__parent']);
                existing[o['__i']] = true;
            }
        }

        private onOrdered_after() {
            var src = this.MasterTable.DataHolder.Ordered;

        }

        private isParentNull(dataObject: any): boolean {
            for (var i = 0; i < this.Configuration.ParentKeyFields.length; i++) {
                if (dataObject[this.Configuration.ParentKeyFields[i]] != null) return false;
            }
            return true;
        }

        private onDataReceived_after(e: ITableEventArgs<IDataEventArgs>) {
            if (e.EventArgs.IsAdjustment) return;
            var d = this.MasterTable.DataHolder.StoredData;
            this._hierarchy = {};
            for (var i = 0; i < d.length; i++) {
                var idx = d[i]['__i'];
                this._hierarchy[idx] = [];
                for (var j = 0; j < d.length; j++) {
                    if (!d[j]['__parent']) {
                        if (this.isParentNull(d[j])) d[j]['__parent'] = null;
                        else d[j]['__parent'] = this._parentKeyFunction(d[j]);
                    }
                    if (d[j]['__parent'] === d[i]['__key']) {
                        this._hierarchy[idx] = d[j]['__i'];
                    }
                }
            }
        }

        public subscribe(e: PowerTables.Services.EventsService): void {
            e.DataReceived.subscribeAfter(this.onDataReceived_after.bind(this), 'hierarchy');
        }
    }
    ComponentsContainer.registerComponent('Hierarchy', HierarchyPlugin);
}