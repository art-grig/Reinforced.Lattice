module PowerTables.Plugins.Hierarchy {
    export class HierarchyPlugin extends PluginBase<IHierarchyUiConfiguration> {
        private _parentKeyFunction: (x: any) => string;
        private _globalHierarchy: { [_: number]: number[] } = {};
        private _currentHierarchy: { [_: number]: number[] } = {};

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this._parentKeyFunction = this.MasterTable.DataHolder
                .compileKeyFunction(this.Configuration.ParentKeyFields);
            //this.MasterTable.DataHolder.registerClientOrdering("TreeOrder", this.hierarchicalOrder.bind(this));

        }

        //#region Event catchers
        public expandRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredData[args.Row], true);
        }

        public expandLoadRow(args: IRowEventArgs): void {
            this.loadRow(this.MasterTable.DataHolder.StoredData[args.Row]);
        }

        public toggleLoadRow(args: IRowEventArgs): void {
            this.toggleSubtreeOrLoad(this.MasterTable.DataHolder.StoredData[args.Row], null);
        }

        public collapseRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredData[args.Row], false);
        }

        public toggleRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredData[args.Row], null);
        }
        //#endregion

        public toggleSubtreeOrLoad(dataObject: any, turnOpen?: boolean) {
            if (dataObject == null || dataObject == undefined) return;
            if (turnOpen == null || turnOpen == undefined) turnOpen = !dataObject.IsExpanded;
            if (dataObject.IsExpanded === turnOpen) return;
            if (turnOpen) this.loadRow(dataObject);
            else this.collapse(dataObject, true);
        }

        public toggleSubtreeByObject(dataObject: any, turnOpen?: boolean) {
            if (dataObject == null || dataObject == undefined) return;
            if (turnOpen == null || turnOpen == undefined) turnOpen = !dataObject.IsExpanded;
            if (dataObject.IsExpanded === turnOpen) return;
            if (turnOpen) this.expand(dataObject, true);
            else this.collapse(dataObject, true);
        }

        private loadRow(dataObject: IItem) {
            dataObject.IsLoading = true;
            this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
            this.MasterTable.Commands.triggerCommand('_Children', dataObject, () => {
                dataObject.IsLoading = false;
                this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
            });
            return;
        }

        //#region Expand routine
        private expand(dataObject: IItem, redraw: boolean) {
            dataObject.IsExpanded = true;

            var toggled = this.toggleVisibleChildren(dataObject, true);

            if (redraw) {
                var st = this.MasterTable.DataHolder.StoredCache;
                this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
                var src = [];
                for (var i = 0; i < toggled.length; i++) {
                    src.push(st[toggled[i]]);
                }
                src = this.MasterTable.DataHolder.orderWithCurrentOrderings(src);
                src = this.orderHierarchy(src, dataObject.Deepness + 1);
                //this.MasterTable.DataHolder.Filtered =
                //    this.MasterTable.DataHolder.Filtered.concat(src);
                var orderedIdx = this.MasterTable.DataHolder.Ordered.indexOf(dataObject);
                //this.MasterTable.DataHolder.Ordered =
                this.MasterTable.DataHolder.Ordered.splice.apply(
                    this.MasterTable.DataHolder.Ordered,
                    [orderedIdx + 1, 0].concat(src));

                var pos = this.MasterTable.DataHolder.DisplayedData.indexOf(dataObject);
                var newNodes = src;
                // if we added more rows and partition's take was enabled
                // then we must cut it to prevent redundant nodes
                // creation
                var originalDdLength = this.MasterTable.DataHolder.DisplayedData.length;
                var newDdLength = originalDdLength + src.length;


                if (this.MasterTable.Partition.Take > 0) {
                    if (pos === originalDdLength - 1) {
                        // if we expanded last row then it is nothing to add
                        // we can just fire PartitionChanged event and quit
                        this.firePartitionChange();
                        return;
                    }

                    // if we will add all nodes right after original, removing last nodes
                    // - will there be enough space?
                    if (pos + newNodes.length > originalDdLength) {
                        //if not - let's cut src
                        newNodes = newNodes.slice(0, (originalDdLength - pos + newNodes.length));
                        // and also we have to remove all the nodes that
                        // go after original node
                        this.removeNLastRows(originalDdLength - pos);
                        var rows = this.MasterTable.Controller.produceRowsFromData(newNodes);
                        for (var j = 0; j < rows.length; j++) {
                            this.MasterTable.Renderer.Modifier.appendRow(rows[j]);
                        }
                    } else {
                        // otherwise - we do not have to cut our new nodes collection
                        // but we have to remove nodes that are currently displaying
                        // and potentially got out of take
                        this.removeNLastRows(newDdLength - originalDdLength);
                        this.appendNewNodes(newNodes, pos);
                    }
                } else {
                    // if take is set to all - we simply add new rows at needed index
                    this.appendNewNodes(newNodes, pos);
                }

                // this.MasterTable.DataHolder.DisplayedData =
                this.MasterTable.DataHolder.DisplayedData.splice.apply(
                    this.MasterTable.DataHolder.DisplayedData,
                    [pos + 1, 0].concat(newNodes));
                this.firePartitionChange();
            }
        }
        private firePartitionChange() {
            var tk = this.MasterTable.Partition.Take;
            var sk = this.MasterTable.Partition.Skip;

            this.MasterTable.Events.PartitionChanged.invokeAfter(this,
                {
                    Take: tk, PreviousTake: tk, Skip: sk, PreviousSkip: sk
                });
        }
        private appendNewNodes(newNodes: any[], parentPos: number) {
            var beforeIndex = null;
            if (this.MasterTable.DataHolder.DisplayedData.length > (parentPos + 1)) {
                beforeIndex = this.MasterTable.DataHolder.DisplayedData[parentPos + 1]['__i'];
            }
            var rows = this.MasterTable.Controller.produceRowsFromData(newNodes);
            for (var j = 0; j < rows.length; j++) {
                this.MasterTable.Renderer.Modifier.appendRow(rows[j], beforeIndex);
            }
        }

        private removeNLastRows(n: number) {
            var last = this.MasterTable.DataHolder
                .DisplayedData[this.MasterTable.DataHolder.DisplayedData.length - 1];
            var lastRow = this.MasterTable.Renderer.Locator.getRowElementByObject(last);
            for (var i = 0; i < n; i++) {
                var lr = lastRow.previousElementSibling;
                this.MasterTable.Renderer.Modifier.destroyElement(lastRow);
                lastRow = lr;
            }
        }

        private toggleVisibleChildren(dataObject: IItem, visible: boolean): number[] {
            var subtree = this._currentHierarchy[dataObject.__i];
            if (!subtree) return [];
            var result = [];
            for (var i = 0; i < subtree.length; i++) {
                var child = this.MasterTable.DataHolder.StoredCache[subtree[i]];
                var nodeToggled = this.toggleVisible(child, visible);
                result = result.concat(nodeToggled);
            }
            return result;
        }

        private toggleVisible(dataObject: IItem, visible: boolean): number[] {
            var result = [dataObject.__i];
            dataObject.__visible = visible;
            if (!dataObject.IsExpanded) return result;

            var subtree = this._currentHierarchy[dataObject.__i];

            for (var j = 0; j < subtree.length; j++) {
                var obj = this.MasterTable.DataHolder.StoredCache[subtree[j]];
                obj.__visible = visible;
                result = result.concat(this.toggleVisible(obj, visible));
            }
            return result;
        }
        //#endregion

        //#region Collapse
        private collapse(dataObject: IItem, redraw: boolean) {
            var hidden = this.toggleVisibleChildren(dataObject, false);
            var hiddenCount = hidden.length;
            dataObject.IsExpanded = false;
            this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
            var row = this.MasterTable.Renderer.Locator.getRowElementByIndex(dataObject.__i);
            var orIdx = this.MasterTable.DataHolder.Ordered.indexOf(dataObject);
            var dIdx = this.MasterTable.DataHolder.DisplayedData.indexOf(dataObject);
            this.MasterTable.DataHolder.Ordered.splice(orIdx + 1, hiddenCount);
            this.MasterTable.DataHolder.DisplayedData.splice(dIdx + 1, hiddenCount);
            var diEnd = this.MasterTable.DataHolder.DisplayedData.length;
            if (this.MasterTable.Partition.Take !== 0) {
                var piece = this.MasterTable.DataHolder.Ordered.slice(orIdx + 1, hiddenCount);
                this.MasterTable.DataHolder.DisplayedData =
                    this.MasterTable.DataHolder.DisplayedData.concat(piece);
            }
            if (redraw) {
                //first, we remove all the related elements
                var ne = row.nextElementSibling;
                for (var i = 0; i < hiddenCount; i++) {
                    var n = ne.nextElementSibling;
                    this.MasterTable.Renderer.Modifier.destroyElement(ne);
                    ne = n;
                }

                //then we need to append same count to the end, taking "take" into account
                if (this.MasterTable.Partition.Take === 0) {
                    // if take set to showing all - basically we have nothing to do here
                    // just fire partition changed event
                    this.firePartitionChange();
                } else {
                    var pieceToAdd = this.MasterTable.DataHolder.DisplayedData.slice(diEnd, hiddenCount);
                    var rows = this.MasterTable.Controller.produceRowsFromData(pieceToAdd);
                    for (var j = 0; j < rows.length; j++) {
                        this.MasterTable.Renderer.Modifier.appendRow(rows[j]);
                    }
                    this.firePartitionChange();
                }
            }
        }

        //#endregion

        //#region Refilter and reorder
        private onFiltered_after() {
            var src = <IItem[]>this.MasterTable.DataHolder.Filtered;

            var needSeparateHierarchy = true;
            if (src.length === this.MasterTable.DataHolder.StoredData.length) {
                this._currentHierarchy = this._globalHierarchy;
                needSeparateHierarchy = false;
                this.restoreHierarchyData(src);
            }
            var expandParents = this.Configuration.CollapsedNodeFilterBehavior ===
                TreeCollapsedNodeFilterBehavior.IncludeCollapsed;
            if (expandParents) {
                this.expandParents(src);
            }
            //if (this.Configuration.CollapsedNodeFilterBehavior === TreeCollapsedNodeFilterBehavior.ExcludeCollapsed) {
            var cpy = [];
            for (var i = 0; i < src.length; i++) {
                if (src[i].__visible) cpy.push(src[i]);
            }
            src = cpy;
            //}

            if (needSeparateHierarchy) this.buildCurrentHierarchy(src);
            this.MasterTable.DataHolder.Filtered = src;
        }

        private expandParents(src: IItem[]) {
            var addParents: { [_: number]: boolean } = {};

            for (var j = 0; j < src.length; j++) {
                this.addParents(src[j], addParents);
            }

            for (var l = 0; l < src.length; l++) {
                if (addParents[src[l]['__i']]) {
                    delete addParents[src[l]['__i']];
                }
            }

            for (var k in addParents) {
                var obj = this.MasterTable.DataHolder.StoredCache[k];
                this.expand(obj, false);
                src.push(obj);
            }
        }

        private restoreHierarchyData(d: IItem[]) {
            for (var k = 0; k < d.length; k++) {
                var o = d[k];
                o.__serverChildrenCount = o.ChildrenCount;
                o.LocalChildrenCount = this._globalHierarchy[o['__i']].length;
                o.__visible = this.visible(o);
            }
        }

        private buildCurrentHierarchy(d: any[]) {
            this._currentHierarchy = {};
            for (var i = 0; i < d.length; i++) {
                var idx = d[i].__i;
                this._currentHierarchy[idx] = [];
                for (var j = 0; j < d.length; j++) {
                    if (d[j].__parent === d[i].__key) {
                        this._currentHierarchy[idx].push(d[j].__i);
                    }
                }
            }

            for (var k = 0; k < d.length; k++) {
                var o = d[k];
                o.LocalChildrenCount = this._currentHierarchy[o['__i']].length;
            }
        }

        private addParents(o: IItem, existing: { [_: number]: boolean }) {
            if (o.__parent == null) return;
            while (o.__parent != null) {
                o = this.MasterTable.DataHolder.getByPrimaryKey(o.__parent);
                existing[o.__i] = true;
            }
        }

        private onOrdered_after() {
            var src = this.MasterTable.DataHolder.Ordered;
            this.MasterTable.DataHolder.Ordered = this.orderHierarchy(src, 0);
        }

        private orderHierarchy(src: IItem[], minDeepness: number): any[] {
            var filteredHierarchy = this.buildHierarchy(src, minDeepness);
            var target = [];
            for (var i = 0; i < filteredHierarchy.roots.length; i++) {
                this.appendChildren(target, filteredHierarchy.roots[i], filteredHierarchy.Hierarchy);
            }
            return target;
        }

        private appendChildren(target: IItem[], index: number, hierarchy: { [_: number]: number[] }) {
            var thisNode = this.MasterTable.DataHolder.StoredCache[index];
            target.push(thisNode);
            for (var i = 0; i < hierarchy[index].length; i++) {
                this.appendChildren(target, hierarchy[index][i], hierarchy);
            }
        }

        private buildHierarchy(d: IItem[], minDeepness: number): IFilteredPiece {
            var result: { [_: number]: number[] } = {};
            var roots = [];
            for (var i = 0; i < d.length; i++) {
                var idx = d[i].__i;
                result[idx] = [];
                if (d[i].Deepness === minDeepness) roots.push(d[i].__i);
                for (var j = 0; j < d.length; j++) {
                    if (d[j].__parent === d[i].__key) {
                        result[idx].push(d[j].__i);
                    }
                }
            }
            return {
                roots: roots,
                Hierarchy: result
            };
        }
        //#endregion

        //#region Initial cache
        private isParentNull(dataObject: IItem): boolean {
            for (var i = 0; i < this.Configuration.ParentKeyFields.length; i++) {
                if (dataObject[this.Configuration.ParentKeyFields[i]] != null) return false;
            }
            return true;
        }

        private deepness(obj: IItem): number {
            var result = 0;
            while (obj.__parent != null) {
                result++;
                obj = this.MasterTable.DataHolder.getByPrimaryKey(obj.__parent);
            }
            return result;
        }

        private visible(obj: IItem): boolean {
            var vis = this.MasterTable.DataHolder.satisfyCurrentFilters(obj);
            if (!vis) return false;
            while (obj.__parent != null) {
                obj = this.MasterTable.DataHolder.getByPrimaryKey(obj.__parent);
                if (!obj.IsExpanded) return false;
            }
            return true;
        }

        private onDataReceived_after(e: ITableEventArgs<IDataEventArgs>) {
            if (e.EventArgs.IsAdjustment) return;
            var d = <IItem[]>this.MasterTable.DataHolder.StoredData;
            this._globalHierarchy = {};
            for (var i = 0; i < d.length; i++) {
                var idx = d[i].__i;
                this._globalHierarchy[idx] = [];
                for (var j = 0; j < d.length; j++) {
                    if (!d[j].__parent) {
                        if (this.isParentNull(d[j])) d[j].__parent = null;
                        else d[j].__parent = this._parentKeyFunction(d[j]);
                    }
                    if (d[j].__parent === d[i].__key) {
                        this._globalHierarchy[idx].push(d[j].__i);
                    }
                }
            }

            for (var k = 0; k < this.MasterTable.DataHolder.StoredData.length; k++) {
                var o = this.MasterTable.DataHolder.StoredData[k];
                o.__serverChildrenCount = o.ChildrenCount;
                o.LocalChildrenCount = this._globalHierarchy[o['__i']].length;
                o.Deepness = this.deepness(o);
                o.__visible = this.visible(o);
            }
        }
        //#endregion

        private setServerChildrenCount(dataObject: IItem) {
            dataObject.ChildrenCount = dataObject.__serverChildrenCount;
        }

        private setLocalChildrenCount(dataObject: IItem) {
            dataObject.ChildrenCount = dataObject.LocalChildrenCount;
        }

        private setChildrenCount(dataObject: IItem, count: number) {
            dataObject.ChildrenCount = count;
        }

        public subscribe(e: PowerTables.Services.EventsService): void {
            e.DataReceived.subscribeAfter(this.onDataReceived_after.bind(this), 'hierarchy');
            e.Filtered.subscribeAfter(this.onFiltered_after.bind(this), 'hierarchy');
            e.Ordered.subscribeAfter(this.onOrdered_after.bind(this), 'hierarchy');
        }

    }
    interface IFilteredPiece {
        roots: number[],
        Hierarchy: { [_: number]: number[] };
    }

    interface IItem {
        __parent: string;
        __i: number;
        __key: string;
        __visible: boolean;
        __serverChildrenCount: number;
        __isLoaded: boolean;

        LocalChildrenCount: number;
        IsExpanded: boolean;
        ChildrenCount: number;
        IsLoading: boolean;
        Deepness: number;
    }

    ComponentsContainer.registerComponent('Hierarchy', HierarchyPlugin);
}