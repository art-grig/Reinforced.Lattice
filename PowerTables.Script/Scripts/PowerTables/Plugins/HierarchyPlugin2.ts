module PowerTables.Plugins.Hierarchy {

    export interface IHierarchyData {
        IsExpanded: boolean;
        IsVisible: boolean;
        IsLoading: boolean;
        _parent: IHierarchyData;
        _subtree: IHierarchyData[];
        _order: number;
        ChildrenCount: number;
        Deepness: number;

    }
    export class HierarchyPlugin2 extends PluginBase<IHierarchyUiConfiguration> implements IClientFilter {

        private _parentKeyFunction: (x: any) => string;
        private _hierarchyFiltered: boolean = false;
        private _isFunctionsStolen: boolean = false;
        private _children: { [_: number]: number[] } = {};

        //#region Operation methods
        public expandRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredData[args.Row], true);
        }

        public collapseRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredData[args.Row], false);
        }

        public toggleRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredData[args.Row], null);
        }

        public toggleSubtreeByObject(dataObject: IHierarchyData, turnOpen?: boolean) {
            if (dataObject == null || dataObject == undefined) return;
            if (turnOpen == null || turnOpen == undefined) turnOpen = !dataObject.IsVisible;
            if (dataObject.IsExpanded === turnOpen) return;
            if (turnOpen) this.expand(dataObject);
            else this.collapse(dataObject);
        }

        private expand(dataObject: IHierarchyData) {
            dataObject.IsExpanded = true;

            if (this.Configuration.ExpandBehavior === NodeExpandBehavior.AlwaysLoadRemotely ||
                ((dataObject.ChildrenCount > 0) && (!dataObject._subtree) || (dataObject._subtree.length === 0))) {
                dataObject.IsLoading = true;
                this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
                this.MasterTable.Commands.triggerCommand('_Children', dataObject);
                return;
            }
            this.toggleVisibleRec(dataObject);
            this.refilterStoredData();
            this.MasterTable.Controller.redrawVisibleData();
        }

        private toggleVisibleRec(dataObject: IHierarchyData) {
            for (var j = 0; j < dataObject._subtree.length; j++) {
                dataObject._subtree[j].IsVisible = true;
                if (dataObject._subtree[j].IsExpanded) {
                    this.toggleVisibleRec(dataObject._subtree[j]);
                }
            }
        }


        private collapse(dataObject: IHierarchyData) {
            this.collapseChildren(dataObject);
            dataObject.IsExpanded = false;
            this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
        }

        private collapseChildren(dataObject: IHierarchyData) {
            if (!dataObject._subtree || dataObject._subtree.length === 0) return;
            for (var i = 0; i < dataObject._subtree.length; i++) {
                var obj = dataObject._subtree[i];
                if (!obj.IsVisible) continue;
                this.collapseChildren(obj);
                obj.IsVisible = false;
                var displayingIdx = this.MasterTable.DataHolder.localLookupDisplayedDataObject(obj);
                if (!displayingIdx.IsCurrentlyDisplaying) continue;
                this.MasterTable.Renderer.Modifier.destroyRowByIndex(displayingIdx.DisplayedIndex);
            }
        }
        //#endregion

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this._parentKeyFunction = this.MasterTable.DataHolder
                .compileKeyFunction(this.Configuration.ParentKeyFields);

            this.MasterTable.DataHolder.registerClientOrdering("TreeOrder", this.hierarchicalOrder.bind(this));
        }

        private hierarchicalOrder(a: IHierarchyData, b: IHierarchyData): number {
            if (!this._hierarchyFiltered) return 0;
            return a._order - b._order;
        }

        private refilterStoredData() {
            this._hierarchyFiltered = true;
            this.MasterTable.DataHolder.RecentClientQuery.Orderings['TreeOrder'] = PowerTables.Ordering.Ascending;
            this.MasterTable.DataHolder.filterStoredDataWithPreviousQuery();
            delete this.MasterTable.DataHolder.RecentClientQuery.Orderings['TreeOrder'];
            this._hierarchyFiltered = false;
        }


        private stackOrder(data: IHierarchyData[]) {
            var stack = [];
            for (var k = 0; k < data.length; k++) {
                var deep = 0;
                var cNode = data[k];
                while (cNode._parent) {
                    deep++;
                    cNode = cNode._parent;
                }
                if (deep === 0) {
                    stack.push(data[k]);
                }
                data[k].Deepness = deep;
            }

            var stackIdx = 0;
            while (stack.length > 0) {
                var stackCur = stack.pop();
                stackCur._order = stackIdx++;

                if (stackCur._subtree) {
                    for (var l = 1; l <= stackCur._subtree.length; l++) {
                        stack.push(stackCur._subtree[stackCur._subtree.length - l]);
                    }
                }
            }
            this.refilterStoredData();
        }
        private recalculateSubtreeReferences(e: IClientDataResults) {
            if (this._hierarchyFiltered) return;

            if (this.MasterTable.DataHolder.Ordered == null || this.MasterTable.DataHolder.Ordered.length == 1 || this.MasterTable.DataHolder.Ordered.length == 0) {
                return;
            }
            var data = e.Ordered;
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                obj._subtree = [];
                for (var j = 0; j < data.length; j++) {
                    if (this._parentKeyFunction(data[j]) === obj['__key']) {
                        obj._subtree.push(data[j]);
                        data[j]._parent = obj;
                        if (!obj.IsExpanded) data[j].IsVisible = false;
                        else data[j].IsVisible = true;
                    }
                }
            }
            this.stackOrder(data);
        }


        private _stolenFilterFunctions: {
            filterFun: (rowObject: any, query: IQuery) => boolean;
            Filter: IClientFilter;
        }[] = [];

        private stealFilterFunctions() {
            if (this._isFunctionsStolen) return;
            var filters = this.MasterTable.DataHolder.getClientFilters();
            var idPredicate = function (a, b) { return true; }
            for (var i = 0; i < filters.length; i++) {
                this._stolenFilterFunctions.push({
                    filterFun: filters[i].filterPredicate,
                    Filter: filters[i]
                });
                filters[i].filterPredicate = idPredicate;
            }
            this.MasterTable.DataHolder.registerClientFilter(this);
            this._isFunctionsStolen = true;
        }

        private onAfterClientDataProcessing(e: ITableEventArgs<IClientDataResults>) {
            this.recalculateSubtreeReferences(e.EventArgs);
        }

        subscribe(e: PowerTables.Services.EventsService): void {
            e.ClientDataProcessing.subscribeAfter(this.onAfterClientDataProcessing.bind(this), 'Hierarchy');
            e.ClientDataProcessing.subscribeBefore(this.onBeforeClientDataProcessing.bind(this), 'Hierarchy');
            e.LayoutRendered.subscribeAfter(this.onAfterLayoutRendered.bind(this), 'Hierarchy');
        }

        private onAfterLayoutRendered() {
            this.stealFilterFunctions();
        }


        filterPredicate(rowObject, query: IQuery): boolean {
            if (rowObject._filtered) return rowObject._acceptable;

            var searchAlsoCollapsed = this.Configuration.CollapsedNodeFilterBehavior === TreeCollapsedNodeFilterBehavior.IncludeCollapsed;
            if ((!searchAlsoCollapsed) && !rowObject.IsVisible) return false;

            var acceptableFilter = true;

            for (var i = 0; i < this._stolenFilterFunctions.length; i++) {
                var fn = this._stolenFilterFunctions[i];
                var v = fn.filterFun.apply(fn.Filter, [rowObject, query]);
                if (!v) {
                    acceptableFilter = false;
                    break;
                }
            }
            var acceptableChild = false;
            if (rowObject._subtree) {
                if (searchAlsoCollapsed || rowObject.IsExpanded) {
                    for (var j = 0; j < rowObject._subtree.length; j++) {
                        var childAcceptable = this.filterPredicate(rowObject._subtree[j], query);
                        if (childAcceptable) {
                            acceptableChild = true;
                            if (searchAlsoCollapsed) {
                                rowObject._subtree[j].IsVisible = true;
                                rowObject.IsExpanded = true;
                            }
                        }
                    }
                }
            }

            var acceptableParent = false;

            rowObject._filtered = true;
            rowObject._acceptable = acceptableChild || acceptableFilter;
            if (rowObject._acceptable && rowObject._parent) {
                rowObject._parent.filtered = true;
                rowObject._acceptable = true;
            }
            return rowObject._acceptable;
        }

        private onBeforeClientDataProcessing() {
            var d = this.MasterTable.DataHolder.StoredData;
            for (var i = 0; i < d.length; i++) {
                var idx = d[i]['__i'];
                this._children[idx] = [];
                for (var j = 0; j < d.length; j++) {
                    if (!d[j]['__parent']) d[j]['__parent'] = this._parentKeyFunction(d[j]);
                    if (d[j]['__parent'] === d[i]['__key']) {
                        this._children[idx] = d[j]['__i']
                    }

                }
            }
        }
    }
    //ComponentsContainer.registerComponent('Hierarchy', HierarchyPlugin);
}