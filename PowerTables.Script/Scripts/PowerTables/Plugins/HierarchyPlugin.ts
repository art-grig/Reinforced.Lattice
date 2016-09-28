module PowerTables.Plugins.Hierarchy {
    export class HierarchyPlugin extends PluginBase<IHierarchyUiConfiguration> implements IClientFilter {

        public expandSubtree(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.localLookupDisplayedData(args.DisplayingRowIndex).DataObject, true, args.DisplayingRowIndex);
        }

        public collapseSubtree(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.localLookupDisplayedData(args.DisplayingRowIndex).DataObject, false, args.DisplayingRowIndex);
        }

        public toggleSubtree(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.localLookupDisplayedData(args.DisplayingRowIndex).DataObject, null, args.DisplayingRowIndex);
        }

        public toggleSubtreeByObject(dataObject: any, turnOpen?: boolean, index?: number) {
            if (dataObject == null || dataObject == undefined) return;
            if (index == null || index == undefined) {
                var lookup = this.MasterTable.DataHolder.localLookupDisplayedDataObject(dataObject);
                index = lookup.DisplayedIndex;
            }
            if (turnOpen == null || turnOpen == undefined) turnOpen = !dataObject.IsVisible;
            if (dataObject.IsExpanded === turnOpen) return;
            if (turnOpen) this.expand(dataObject, index);
            else this.collapse(dataObject, index);
        }

        private expand(dataObject: any, index: number) {
            dataObject.IsExpanded = true;

            if (this.Configuration.ExpandBehavior === NodeExpandBehavior.AlwaysLoadRemotely ||
                ((dataObject.ChildrenCount > 0) && (!dataObject._subtree) || (dataObject._subtree.length === 0))) {
                dataObject.IsLoading = true;
                if (index >= 0) this.MasterTable.Controller.redrawVisibleDataObject(dataObject, index);

                this.MasterTable.Loader.requestServer('GetHierarchyChildren', d => {
                    var children = <any[]>d.HierarchyItems;
                    for (var i = 0; i < children.length; i++) {
                        children[i].IsVisible = true;
                        children[i]._parent = dataObject;
                        children[i]._subtree = [];
                    }
                    var ar: PowerTables.Editing.IAdjustmentData = {
                        Updates: children,
                        AdditionalData: {},
                        Removals: []
                    };
                    dataObject.IsLoading = false;
                    this.MasterTable.DataHolder.proceedAdjustments(ar);
                    this.refilterStoredData();
                    this.MasterTable.Controller.redrawVisibleData();
                }, q => {
                    q.AdditionalData['HierarchyParent'] = dataObject.RootKey;
                    return q;
                });
                return;
            }
            this.toggleVisibleRec(dataObject);
            this.refilterStoredData();
            this.MasterTable.Controller.redrawVisibleData();
        }

        private toggleVisibleRec(dataObject: any) {
            for (var j = 0; j < dataObject._subtree.length; j++) {
                dataObject._subtree[j].IsVisible = true;
                if (dataObject._subtree[j].IsExpanded) {
                    this.toggleVisibleRec(dataObject._subtree[j]);
                }
            }
        }

        private collapse(dataObject: any, index: number) {
            this.collapseChildren(dataObject);
            dataObject.IsExpanded = false;
            if (index >= 0) {
                this.MasterTable.Controller.redrawVisibleDataObject(dataObject, index);
            }
        }

        private collapseChildren(dataObject: any) {
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

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MasterTable.DataHolder.registerClientOrdering("TreeOrder", this.hierarchicalOrder.bind(this));
        }

        private hierarchicalOrder(a: any, b: any): number {
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

        private _hierarchyFiltered: boolean = false;
        private stackOrder(data: any[]) {

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
                        stack.push(stackCur._subtree[stackCur._subtree.length-l]);
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
                    if (data[j].ParentKey === obj.RootKey) {
                        obj._subtree.push(data[j]);
                        data[j]._parent = obj;
                        if (!obj.IsExpanded) data[j].IsVisible = false;
                        else data[j].IsVisible = true;
                    }
                }
            }
            this.stackOrder(data);

        }

        private _isFunctionsStolen: boolean = false;
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

        subscribe(e: EventsService): void {
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
            //var cNode = rowObject;
            //while (cNode._parent) {
            //    var parentAcceptable = this.filterPredicate(cNode._parent, query);
            //    if (parentAcceptable) {
            //        acceptableParent = true;
            //        break;
            //    }
            //    cNode = cNode._parent;
            //}
            rowObject._filtered = true;
            rowObject._acceptable = acceptableChild || acceptableFilter;
            if (rowObject._acceptable && rowObject._parent) {
                rowObject._parent.filtered = true;
                rowObject._acceptable = true;
            }
            return rowObject._acceptable;
        }

        private onBeforeClientDataProcessing() {
            for (var i = 0; i < this.MasterTable.DataHolder.StoredData.length; i++) {
                delete this.MasterTable.DataHolder.StoredData[i]['_filtered'];
            }
        }
    }
    ComponentsContainer.registerComponent('Hierarchy', HierarchyPlugin);
}