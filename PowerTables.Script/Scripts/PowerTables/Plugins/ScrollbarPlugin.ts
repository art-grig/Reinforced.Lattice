﻿module PowerTables.Plugins.Scrollbar {
    export class ScrollbarPlugin extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.Scrollbar.IScrollbarPluginUiConfig> {

        public UpArrow: HTMLElement;
        public DownArrow: HTMLElement;
        public Scroller: HTMLElement;
        public ScrollerActiveArea: HTMLElement;

        private _stickElement: HTMLElement;
        private _scrollWidth: number;
        private _scrollHeight: number;
        private _scollbar: HTMLElement;
        private _availableSpace: number;

        private _kbListener: HTMLElement;
        private _wheelListener: HTMLElement;

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
        }

        //#region Events

        public upArrowMouseDown(t: ITemplateBoundEvent) {

        }

        public upArrowMouseUp(t: ITemplateBoundEvent) {

        }

        public downArrowMouseDown(t: ITemplateBoundEvent) {

        }

        public downArrowMouseUp(t: ITemplateBoundEvent) {

        }

        public scrollerAreaClick(t: ITemplateBoundEvent) {

        }
        //#endregion

        private total(): number {
            return this.MasterTable.Partition.IsTotalCountKnown
                ? this.MasterTable.Partition.TotalCount
                : this.MasterTable.DataHolder.StoredData.length;
        }

        //#region Coords calculation

        private updateCoords() {
            if (!this._scollbar) return;
            if (!this._stickElement) return;
            if (this.MasterTable.DataHolder.DisplayedData.length === 0) {
                this.MasterTable.Renderer.Modifier.hideElement(this._scollbar);
                return;
            } else {
                this.MasterTable.Renderer.Modifier.showElement(this._scollbar);
            }

            var newCoords = this.getCoords();
            if (newCoords.height != undefined) this._scollbar.style.height = newCoords.height + 'px';
            if (newCoords.width != undefined) this._scollbar.style.width = newCoords.width + 'px';
            if (newCoords.left != undefined) this._scollbar.style.left = newCoords.left + 'px';
            if (newCoords.top != undefined) this._scollbar.style.top = newCoords.top + 'px';
            this.calculateAvailableSpace();
            this.adjustScrollerHeight();
            this.adjustScrollerPosition();
        }

        private adjustScrollerPosition() {
            if (!this.Scroller) return;
            var total = this.total();
            var d = this._availableSpace / total;
            var h = d * this.MasterTable.Partition.Skip;
            if (this.Configuration.IsHorizontal) this.Scroller.style.left = h + 'px';
            else this.Scroller.style.top = h + 'px';
        }

        private adjustScrollerHeight() {
            if (!this.Scroller) return;
            var total = this.total();
            var sz = (this.MasterTable.Partition.Take * this._availableSpace) / total;
            if (sz < this.Configuration.ScrollerMinSize) sz = this.Configuration.ScrollerMinSize;
            if (this.Configuration.IsHorizontal) this.Scroller.style.width = sz + 'px';
            else this.Scroller.style.height = sz + 'px';
        }

        private calculateAvailableSpace() {
            var box = this._scollbar.getBoundingClientRect();
            var aspace = this.Configuration.IsHorizontal ? box.width : box.height;
            if (this.UpArrow) {
                box = this.UpArrow.getBoundingClientRect();
                aspace -= this.Configuration.IsHorizontal ? box.width : box.height;
            }
            if (this.DownArrow) {
                box = this.DownArrow.getBoundingClientRect();
                aspace -= this.Configuration.IsHorizontal ? box.width : box.height;
            }
            this._availableSpace = aspace;
        }

        private getCoords(): Coords {
            var r: Coords = {};
            var c = this._stickElement.getBoundingClientRect();

            switch (this.Configuration.StickDirection) {
                case PowerTables.Plugins.Scrollbar.StickDirection.Right:
                    r.top = c.top;
                    r.height = c.height;
                    switch (this.Configuration.StickHollow) {
                        case PowerTables.Plugins.Scrollbar.StickHollow.External:
                            r.left = c.left + c.width;
                            break;
                        case PowerTables.Plugins.Scrollbar.StickHollow.Internal:
                            r.left = c.left + c.width - this._scrollWidth;
                            break;
                    }
                    break;
                case PowerTables.Plugins.Scrollbar.StickDirection.Left:
                    r.top = c.top;
                    r.height = c.height;
                    switch (this.Configuration.StickHollow) {
                        case PowerTables.Plugins.Scrollbar.StickHollow.External:
                            r.left = c.left;
                            break;
                        case PowerTables.Plugins.Scrollbar.StickHollow.Internal:
                            r.left = c.left - this._scrollWidth;
                            break;
                    }
                    break;
                case PowerTables.Plugins.Scrollbar.StickDirection.Top:
                    r.left = c.left;
                    r.width = c.width;
                    switch (this.Configuration.StickHollow) {
                        case PowerTables.Plugins.Scrollbar.StickHollow.External:
                            r.top = c.top - this._scrollHeight;
                            break;
                        case PowerTables.Plugins.Scrollbar.StickHollow.Internal:
                            r.top = c.top;
                            break;
                    }
                    break;
                case PowerTables.Plugins.Scrollbar.StickDirection.Bottom:
                    r.left = c.left;
                    r.width = c.width;
                    switch (this.Configuration.StickHollow) {
                        case PowerTables.Plugins.Scrollbar.StickHollow.External:
                            r.top = c.top + c.height;
                            break;
                        case PowerTables.Plugins.Scrollbar.StickHollow.Internal:
                            r.top = c.top + c.height - this._scrollHeight;
                            break;
                    }
                    break;
            }
            return r;
        }
        //#endregion
        private getElement(configSelect: string):HTMLElement {
            if (!configSelect) return null;
            switch (configSelect) {
                case '$Body':return  this.MasterTable.Renderer.BodyElement;
                case '$Parent':return this.MasterTable.Renderer.BodyElement.parentElement;
                case '$All': return this.MasterTable.Renderer.RootElement;
            }
            return <HTMLElement>document.querySelector(configSelect);
        }
        private onLayoutRendered(e: ITableEventArgs<any>) {
            this._stickElement = this.getElement(this.Configuration.StickToElementSelector);
            this._kbListener = this.getElement(this.Configuration.KeyboardEventsCatcher);
            this._wheelListener = this.getElement(this.Configuration.WheelEventsCatcher);

            this._scollbar = this.MasterTable.Renderer.Modifier.createElementFromTemplate(this.RawConfig.TemplateId, this);
            document.body.appendChild(this._scollbar);
            this._scollbar.style.position = 'absolute';
            this.subscribeUiEvents();

            var style = this._scollbar.style;
            var coord = this._scollbar.getBoundingClientRect();

            if (this.Configuration.IsHorizontal) {
                if (style.height) this._scrollHeight = parseInt(style.height);
                else this._scrollHeight = coord.height;
            } else {
                if (style.width) this._scrollWidth = parseInt(style.width);
                else this._scrollWidth = coord.width;
            }
            this.updateCoords();
        }

        //#region UI events
        private subscribeUiEvents() {
            if (this.UpArrow) {
                PowerTables.Services.EventsDelegatorService.addHandler(this.UpArrow, 'mousedown', this.upArrowStart.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(this.UpArrow, 'mouseup', this.upArrowEnd.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(this.UpArrow, 'click', this.upArrow.bind(this));
            }
            if (this.DownArrow) {
                PowerTables.Services.EventsDelegatorService.addHandler(this.DownArrow, 'mousedown', this.downArrowStart.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(this.DownArrow, 'mouseup', this.downArrowEnd.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(this.DownArrow, 'click', this.downArrow.bind(this));
            }

            if (this._wheelListener) {
                PowerTables.Services.EventsDelegatorService
                    .addHandler(this._wheelListener, 'wheel', this.handleWheel.bind(this));
            }
        }

        //#region Wheel events
        private handleWheel(e: WheelEvent) {
            var range = 0;
            if (e.deltaMode === e.DOM_DELTA_PIXEL) {
                range = (e.deltaY > 0 ? 1 : -1) * this.Configuration.Forces.WheelForce;
            }
            if (e.deltaMode === e.DOM_DELTA_LINE) {
                range = e.deltaY*this.Configuration.Forces.WheelForce;
            }
            if (e.deltaMode === e.DOM_DELTA_PAGE) {
                range = e.deltaY*this.Configuration.Forces.PageForce;
            }

            if (range !== 0) {
                this.MasterTable.Partition.setSkip(this.MasterTable.Partition.Skip + range);
                e.preventDefault();
                e.stopPropagation();
            }
        }
        //#endregion

        //#region Arrows handling

        //#region Up arrow
        private _upArrowActive: boolean = false;
        private _upArrowInterval: any;

        private upArrowStart() {
            this._upArrowActive = true;
            this._upArrowInterval = setInterval(this.upArrow.bind(this), this.Configuration.ArrowsDelayMs);
        }

        private upArrow() {
            if (this.MasterTable.Partition.Skip == 0) return;
            this.MasterTable.Partition.setSkip(this.MasterTable.Partition.Skip - this.Configuration.Forces.SingleForce);    //todo force
        }

        private upArrowEnd() {
            this._upArrowActive = false;
            clearInterval(this._upArrowInterval);
        }
        //#endregion

        //#region Down arrow
        private _downArrowActive: boolean = false;
        private _downArrowInterval: any;

        private downArrowStart() {
            this._downArrowActive = true;
            this._downArrowInterval = setInterval(this.downArrow.bind(this), this.Configuration.ArrowsDelayMs);
        }

        private downArrow() {
            if (this.MasterTable.Partition.Skip + this.MasterTable.Partition.Take >= this.total()) return;
            this.MasterTable.Partition.setSkip(this.MasterTable.Partition.Skip + this.Configuration.Forces.SingleForce);    //todo force
        }

        private downArrowEnd() {
            this._downArrowActive = false;
            clearInterval(this._downArrowInterval);
        }
        //#endregion

        //#endregion

        //#endregion
        private onDataRendered(e: ITableEventArgs<any>) {
            this.updateCoords();
        }

        private onPartitionChange(e: ITableEventArgs<IPartitionChangeEventArgs>) {
            if (e.EventArgs.Take !== e.EventArgs.PreviousTake) {
                this.adjustScrollerHeight();
                this.adjustScrollerPosition();
            } else if (e.EventArgs.PreviousSkip !== e.EventArgs.Skip) {
                this.adjustScrollerPosition();
            }
        }

        public subscribe(e: PowerTables.Services.EventsService): void {
            e.LayoutRendered.subscribeAfter(this.onLayoutRendered.bind(this), 'scrollbar');
            e.DataRendered.subscribe(this.onDataRendered.bind(this), 'scrollbar');
            e.PartitionChanged.subscribeAfter(this.onPartitionChange.bind(this), 'scrollbar');
            PowerTables.Services.EventsDelegatorService.addHandler(<any>window, 'resize', this.updateCoords.bind(this));
        }

    }
    ComponentsContainer.registerComponent('Scrollbar', ScrollbarPlugin);
    interface Coords {
        top?: number;
        left?: number;
        height?: number;
        width?: number;
    }
}