module PowerTables.Plugins.Scrollbar {
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
            var total = this.MasterTable.Partition.IsTotalCountKnown
                ? this.MasterTable.Partition.TotalCount
                : this.MasterTable.DataHolder.StoredData.length;
            var d = this._availableSpace / total;
            var h = d * this.MasterTable.Partition.Skip;
            if (this.Configuration.IsHorizontal) this.Scroller.style.left = h + 'px';
            else this.Scroller.style.top = h + 'px';
        }

        private adjustScrollerHeight() {
            if (!this.Scroller) return;
            var total = this.MasterTable.Partition.IsTotalCountKnown
                ? this.MasterTable.Partition.TotalCount
                : this.MasterTable.DataHolder.StoredData.length;
            var sz = (this.MasterTable.Partition.Take * this._availableSpace) / total;
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

        private onLayoutRendered(e: ITableEventArgs<any>) {
            switch (this.Configuration.StickToElementSelector) {
                case '$Body':
                    this._stickElement = this.MasterTable.Renderer.BodyElement;
                    break;
                case '$Parent':
                    this._stickElement = this.MasterTable.Renderer.BodyElement.parentElement;
                    break;
                case '$All':
                    this._stickElement = this.MasterTable.Renderer.RootElement;
                    break;
                default:
                    this._stickElement = <HTMLElement>document.querySelector(this.Configuration.StickToElementSelector);
                    break;
            }

            this._scollbar = this.MasterTable.Renderer.Modifier.createElementFromTemplate(this.RawConfig.TemplateId, this);
            document.body.appendChild(this._scollbar);
            this._scollbar.style.position = 'absolute';
            var style = this._scollbar.style;
            var coord = this._scollbar.getBoundingClientRect();

            if (this.Configuration.IsHorizontal) {
                if (style.height) this._scrollHeight = parseInt(style.height);
                else this._scrollHeight = coord.height;
            }else
            {
                if (style.width) this._scrollWidth = parseInt(style.width);
                else this._scrollWidth = coord.width;
            }
            this.updateCoords();
        }

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
            e.PartitionChanged.subscribeAfter(this.onPartitionChange.bind(this),'scrollbar');
            PowerTables.Services.EventsDelegatorService.addHandler(<any>window, 'resize', this.updateCoords.bind(this));
        }
     
    }
    ComponentsContainer.registerComponent('Scrollbar', ScrollbarPlugin);
    interface Coords {
        top?: number;
        left?: number;
        height?: number;
        width?:number;
    }
}