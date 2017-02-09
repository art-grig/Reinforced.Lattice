module PowerTables.Plugins.Hierarchy {
    export class HierarchyPlugin extends PluginBase<IHierarchyUiConfiguration> implements IClientFilter {
        private _parentKeyFunction: (x: any) => string;
        private _globalHierarchy: { [_: number]: number[] } = {};
        private _currentHierarchy: { [_: number]: number[] } = {};
        private _notInHierarchy: { [_: string]: string[] } = {};

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this._parentKeyFunction = this.MasterTable.DataHolder
                .compileKeyFunction(this.Configuration.ParentKeyFields);
            //this.MasterTable.DataHolder.registerClientOrdering("TreeOrder", this.hierarchicalOrder.bind(this));
            this.MasterTable.DataHolder.registerClientFilter(this);
        }

        //#region Event catchers
        public expandRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredCache[args.Row], true);
        }

        public expandLoadRow(args: IRowEventArgs): void {
            this.loadRow(this.MasterTable.DataHolder.StoredCache[args.Row]);
        }

        public toggleLoadRow(args: IRowEventArgs): void {
            this.toggleSubtreeOrLoad(this.MasterTable.DataHolder.StoredCache[args.Row], null);
        }

        public collapseRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredCache[args.Row], false);
        }

        public toggleRow(args: IRowEventArgs): void {
            this.toggleSubtreeByObject(this.MasterTable.DataHolder.StoredCache[args.Row], null);
        }
        //#endregion

        public toggleSubtreeOrLoad(dataObject: any, turnOpen?: boolean) {
            if (dataObject == null || dataObject == undefined) return;
            if (turnOpen == null || turnOpen == undefined) turnOpen = !dataObject.__isExpanded;
            if (dataObject.__isExpanded === turnOpen) return;
            if (turnOpen) {
                if (dataObject.__isLoaded) this.expand(dataObject);
                else this.loadRow(dataObject);
            }
            else this.collapse(dataObject, true);
        }

        public toggleSubtreeByObject(dataObject: any, turnOpen?: boolean) {
            if (dataObject == null || dataObject == undefined) return;
            if (turnOpen == null || turnOpen == undefined) turnOpen = !dataObject.__isExpanded;
            if (dataObject.__isExpanded === turnOpen) return;
            if (turnOpen) this.expand(dataObject);
            else this.collapse(dataObject, true);
        }

        private loadRow(dataObject: IItem) {
            dataObject.IsLoading = true;
            dataObject.IsExpanded = true;
            dataObject.__isExpanded = true;
            this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
            this.MasterTable.Commands.triggerCommand('_Children', dataObject, () => {
                dataObject.IsLoading = false;
                dataObject.__isLoaded = true;
                this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
            });
            return;
        }

        private isParentExpanded(dataObject: IItem) {
            if (dataObject.__parent == null) return true;
            var parent = this.MasterTable.DataHolder.getByPrimaryKey(dataObject.__parent);
            return parent.__isExpanded;
        }

        //#region Expand
        private expand(dataObject: IItem) {
            dataObject.IsExpanded = true;
            dataObject.__isExpanded = true;
            if (!this.isParentExpanded(dataObject)) return;
            var toggled = this.toggleVisibleChildren(dataObject, true);


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

            this.MasterTable.DataHolder.Ordered.splice.apply(
                this.MasterTable.DataHolder.Ordered,
                [orderedIdx + 1, 0].concat(src));

            var pos = this.MasterTable.DataHolder.DisplayedData.indexOf(dataObject);
            var newNodes = src;
            // if we added more rows and partition's take was enabled
            // then we must cut it to prevent redundant nodes
            // creation
            var originalDdLength = this.MasterTable.DataHolder.DisplayedData.length;

            if (this.MasterTable.Partition.Take > 0) {
                if (pos === originalDdLength - 1) {
                    // if we expanded last row then it is nothing to add
                    // we can just fire PartitionChanged event and quit
                    this.firePartitionChange();
                    return;
                }

                // if we will add all nodes right after original, removing last nodes
                // - will there be enough space?
                if (pos + newNodes.length > this.MasterTable.Partition.Take) {
                    var takeFirst = this.MasterTable.Partition.Take - pos - 1;
                    //if not - let's cut src
                    newNodes = newNodes.slice(0, takeFirst);
                    // and also we have to remove all the nodes that
                    // go after original node
                    this.removeNLastRows(originalDdLength - pos - 1);
                    var rows = this.MasterTable.Controller.produceRowsFromData(newNodes);
                    for (var j = 0; j < rows.length; j++) {
                        this.MasterTable.Renderer.Modifier.appendRow(rows[j]);
                    }
                    var ddPart = this.MasterTable.DataHolder.DisplayedData.slice(0, pos + 1);
                    this.MasterTable.DataHolder.DisplayedData = ddPart.concat(newNodes);
                } else {
                    // otherwise - we do not have to cut our new nodes collection
                    // but we have to remove nodes that are currently displaying
                    // and potentially got out of take
                    var lastToRemove = originalDdLength - pos - 1;
                    this.removeNLastRows(lastToRemove);
                    this.appendNewNodes(newNodes, pos);
                    var spliceIdx = this.MasterTable.DataHolder.DisplayedData.length - lastToRemove;
                    this.MasterTable.DataHolder.DisplayedData.splice(spliceIdx, lastToRemove);
                    this.MasterTable.DataHolder.DisplayedData.splice.apply(
                        this.MasterTable.DataHolder.DisplayedData,
                        [pos + 1, 0].concat(newNodes));
                }
            } else {
                // if take is set to all - we simply add new rows at needed index
                this.appendNewNodes(newNodes, pos);
                this.MasterTable.DataHolder.DisplayedData.splice.apply(
                    this.MasterTable.DataHolder.DisplayedData,
                    [pos + 1, 0].concat(newNodes));
            }
            this.firePartitionChange();

        }
        private firePartitionChange(tk?: number, sk?: number) {
            tk = tk == null ? this.MasterTable.Partition.Take : tk;
            sk = sk == null ? this.MasterTable.Partition.Skip : sk;
            var prevTk = this.MasterTable.Partition.Take;
            var prevSk = this.MasterTable.Partition.Skip;

            this.MasterTable.Partition.Take = tk;
            this.MasterTable.Partition.Skip = sk;

            this.MasterTable.Events.PartitionChanged.invokeAfter(this,
                {
                    Take: tk, PreviousTake: prevTk, Skip: sk, PreviousSkip: prevSk
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

        private toggleVisibleChildren(dataObject: IItem, visible: boolean, hierarchy?: { [_: number]: number[] }): number[] {
            if (!hierarchy) hierarchy = this._currentHierarchy;
            var subtree = hierarchy[dataObject.__i];
            if (!subtree) return [];
            var result = [];
            for (var i = 0; i < subtree.length; i++) {
                var child = this.MasterTable.DataHolder.StoredCache[subtree[i]];
                var nodeToggled = this.toggleVisible(child, visible);
                result = result.concat(nodeToggled);
            }
            return result;
        }

        private toggleVisible(dataObject: IItem, visible: boolean, hierarchy?: { [_: number]: number[] }): number[] {
            if (!hierarchy) hierarchy = this._currentHierarchy;
            var result = [dataObject.__i];
            dataObject.__visible = visible;
            if (!dataObject.__isExpanded) return result;

            var subtree = hierarchy[dataObject.__i];

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
            dataObject.IsExpanded = false;
            dataObject.__isExpanded = false;

            if (!this.isParentExpanded(dataObject)) return;
            var displayed = this.MasterTable.DataHolder.DisplayedData;
            var ordered = this.MasterTable.DataHolder.Ordered;

            var hidden = this.toggleVisibleChildren(dataObject, false);
            var hiddenCount = hidden.length;

            this.MasterTable.Controller.redrawVisibleDataObject(dataObject);
            var row = this.MasterTable.Renderer.Locator.getRowElementByIndex(dataObject.__i);

            var orIdx = ordered.indexOf(dataObject);
            var dIdx = displayed.indexOf(dataObject);
            ordered.splice(orIdx + 1, hiddenCount);
            var oldDisplayedLength = displayed.length;
            var splice = displayed.splice(dIdx + 1, hiddenCount);
            var displayedHidden = splice.length;

            var dataToAppend = ordered.slice(orIdx + 1, orIdx + 1 + displayedHidden);
            var piece = dataToAppend;

            displayed = displayed.concat(piece);

            var dataToPrepend = [];
            var appendLength = 0;
            var nskip = null;

            if (displayed.length < oldDisplayedLength && this.MasterTable.Partition.Skip > 0) {
                nskip = this.MasterTable.Partition.Skip;
                nskip -= (oldDisplayedLength - displayed.length);
                if (nskip < 0) {
                    appendLength = -nskip;
                    nskip = 0;
                }
                dataToPrepend = ordered.slice(nskip, orIdx - 1);
                displayed = dataToPrepend.concat(displayed);
            }

            if (appendLength > 0) {
                var appendPiece = ordered.slice(orIdx + 1 + displayedHidden, orIdx + 1 + displayedHidden + appendLength);
                dataToAppend = dataToAppend.concat(appendPiece);
                displayed = displayed.concat(appendPiece);
            }
            this.MasterTable.DataHolder.DisplayedData = displayed;

            if (redraw) {
                //first, we remove all the related elements
                var ne = row.nextElementSibling;
                for (var i = 0; i < displayedHidden; i++) {
                    var n = ne.nextElementSibling;
                    this.MasterTable.Renderer.Modifier.destroyElement(ne);
                    ne = n;
                }
                var rows = null;
                if (dataToPrepend.length > 0) {
                    rows = this.MasterTable.Controller.produceRowsFromData(dataToPrepend);
                    for (var k = rows.length - 1; k >= 0; k--) {
                        this.MasterTable.Renderer.Modifier.prependRow(rows[k]);
                    }
                }

                if (dataToAppend.length > 0) {
                    rows = this.MasterTable.Controller.produceRowsFromData(dataToAppend);
                    for (var l = 0; l < rows.length; l++) {
                        this.MasterTable.Renderer.Modifier.appendRow(rows[l]);
                    }
                }

                this.firePartitionChange(null, nskip);
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
                obj.IsExpanded = true;
                obj.__isExpanded = true;
                this.toggleVisibleChildren(obj, true);
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
                if (!obj.__isExpanded) return false;
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
                d[i].__isExpanded = d[i].IsExpanded;

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

        //#region Processing adjustments
        private proceedAddedData(added: IItem[]) {
            for (var i = 0; i < added.length; i++) {
                if (this.isParentNull(added[i])) added[i].__parent = null;
                else added[i].__parent = this._parentKeyFunction(added[i]);
                this._globalHierarchy[added[i]['__i']] = [];
            }

            for (var j = 0; j < added.length; j++) {
                if (added[j].__parent != null) {
                    var parent = this.MasterTable.DataHolder.getByPrimaryKey(added[j].__parent);
                    this._globalHierarchy[parent['__i']].push(added[j]['__i']);
                }
            }

            for (var k = 0; k < added.length; k++) {
                var o = added[k];
                o.__serverChildrenCount = o.ChildrenCount;
                o.LocalChildrenCount = this._globalHierarchy[o['__i']].length;
                o.Deepness = this.deepness(o);
                o.__visible = this.visible(o);
            }
        }

        private proceedUpdatedData(d: IItem[]) {
            var obj = null;
            for (var i = 0; i < d.length; i++) {
                obj = d[i];
                var newParent = null;
                if (!this.isParentNull(d[i])) newParent = this._parentKeyFunction(obj);
                this.moveItem(obj, newParent);

            }
            for (var j = 0; j < d.length; j++) {
                obj = d[j];
                if (obj.__isExpanded !== obj.IsExpanded) {
                    if (obj.IsExpanded) {
                        obj.__isExpanded = true;
                        this.toggleVisibleChildren(obj, true, this._globalHierarchy);
                    } else {
                        obj.__isExpanded = false;
                        this.toggleVisibleChildren(obj, false, this._globalHierarchy);
                    }
                }
            }
        }

        public moveItems(items: any[], newParent: any) {
            var newParentKey = (!newParent) ? null : newParent.__key;
            for (var i = 0; i < items.length; i++) {
                this.moveItem(items[i], newParentKey);
            }
            this.MasterTable.DataHolder.filterStoredDataWithPreviousQuery();
            this.MasterTable.Controller.redrawVisibleData();
        }

        private moveItem(dataObject: IItem, newParentKey: string) {
            var oldParent = dataObject.__parent;
            // first, remove item from old parent
            if (oldParent != null) { // if item was not in root
                var oldParentObj = this.MasterTable.DataHolder.getByPrimaryKey(oldParent);
                if (!oldParentObj) {
                    // old parent is removed => item is out of hierarchy
                    this.moveFromNotInHierarchy(dataObject.__key, newParentKey);
                    return;
                }
                // if not => remove from global hierarchy
                var op = this._globalHierarchy[oldParentObj['__i']];
                var idx = op.indexOf(dataObject['__i']);
                if (idx > -1) op.splice(idx, 1);
            }

            if (newParentKey == null) {
                dataObject.__visible = this.MasterTable.DataHolder.satisfyCurrentFilters(dataObject);
                return;
            } // if we move it to root - no add. action required
            var newParentObj = this.MasterTable.DataHolder.getByPrimaryKey(newParentKey);
            if (!newParentObj) throw new Error(`Cannot find parent ${newParentKey} to move`); // oops
            dataObject.__parent = newParentObj['__i'];
            dataObject.__visible = newParentObj.__isExpanded && this.MasterTable.DataHolder.satisfyCurrentFilters(dataObject);
        }

        private moveFromNotInHierarchy(key: string, newParentKey: string) {
            if (!this._notInHierarchy[key]) return;
            var targetObj = this.MasterTable.DataHolder.getByPrimaryKey(key);
            if (!targetObj) return;

            var subtree: number[] = [];
            this._globalHierarchy[targetObj['__i']] = subtree;

            if (newParentKey == null) {
                targetObj['__parent'] = null;
            } else {
                var newParentObj = this.MasterTable.DataHolder.getByPrimaryKey(newParentKey);
                if (!newParentObj) throw new Error(`Cannot find parent ${newParentKey} to move from outside of tree`); // oops
                targetObj['__parent'] = newParentKey;
                var parentSubtree = this._globalHierarchy[newParentObj['__i']];
                parentSubtree.push(targetObj['__i']);
                targetObj.__visible = newParentObj.__isExpanded && this.MasterTable.DataHolder.satisfyCurrentFilters(targetObj);
            }

            var children = this._notInHierarchy[key];
            for (var i = 0; i < children.length; i++) {
                this.moveFromNotInHierarchy(children[i], targetObj.__key);
            }
            delete this._notInHierarchy[key];
        }

        private cleanupNotInHierarchy() {
            for (var nk in this._notInHierarchy) {
                for (var i = 0; i < this._notInHierarchy[nk].length; i++) {
                    this.MasterTable.DataHolder.detachByKey(this._notInHierarchy[nk][i]);
                }
                this.MasterTable.DataHolder.detachByKey(nk);
            }
            this._notInHierarchy = {};
        }

        private onAdjustment_after(e: ITableEventArgs<IAdjustmentResult>) {
            var data = e.EventArgs;
            this.proceedAddedData(data.AddedData);
            this.proceedUpdatedData(data.TouchedData);
            this.cleanupNotInHierarchy();
            data.NeedRefilter = true;
        }

        private onAdjustment_before(e: ITableEventArgs<ITableAdjustment>) {
            var data = e.EventArgs;
            var rk = data.RemoveKeys;
            this._notInHierarchy = {};
            for (var i = 0; i < rk.length; i++) {
                var toRemove = this.MasterTable.DataHolder.getByPrimaryKey(rk[i]);
                this.removeFromHierarchySubtrees(toRemove, this._globalHierarchy);
                this.removeFromHierarchySubtrees(toRemove, this._currentHierarchy);
                this.moveToNotInHierarchy(toRemove['__i']);
            }
        }
        private moveToNotInHierarchy(parent: number) {
            var subtree = this._globalHierarchy[parent];
            var parentObj = this.MasterTable.DataHolder.StoredCache[parent];
            if (!parentObj) return;
            var childKeys = [];
            this._notInHierarchy[parent['__key']] = childKeys;
            for (var i = 0; i < subtree.length; i++) {
                var subObj = this.MasterTable.DataHolder.StoredCache[subtree[i]];
                if (subObj) {
                    childKeys.push(subObj['__key']);
                }
            }

            for (var j = 0; j < subtree.length; j++) {
                this.moveToNotInHierarchy(subtree[j]);
            }
        }
        private removeFromHierarchySubtrees(toRemove: IItem, hierarchy: { [_: number]: number[] }) {
            if (toRemove.__parent != null) {
                var parent = this.MasterTable.DataHolder.getByPrimaryKey(toRemove.__parent);
                if (hierarchy[parent['__i']]) {
                    var subtree = hierarchy[parent['__i']];
                    var idx = subtree.indexOf(toRemove['__i']);
                    if (idx > -1) {
                        subtree.splice(idx, 1);
                    }
                }
            }
        }
        //#endregion

        public subscribe(e: PowerTables.Services.EventsService): void {
            e.DataReceived.subscribeAfter(this.onDataReceived_after.bind(this), 'hierarchy');
            e.Filtered.subscribeAfter(this.onFiltered_after.bind(this), 'hierarchy');
            e.Ordered.subscribeAfter(this.onOrdered_after.bind(this), 'hierarchy');
            e.Adjustment.subscribeAfter(this.onAdjustment_after.bind(this), 'hierarchy');
            e.Adjustment.subscribeBefore(this.onAdjustment_before.bind(this), 'hierarchy');
        }

        // we implement this only to assure DataHolder to refilter data
        // but actually we are refiltering it later
        public filterPredicate(rowObject: any, query: IQuery): boolean {
            return true;
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
        __isExpanded: boolean;

        LocalChildrenCount: number;
        IsExpanded: boolean;
        ChildrenCount: number;
        IsLoading: boolean;
        Deepness: number;
    }

    ComponentsContainer.registerComponent('Hierarchy', HierarchyPlugin);
}