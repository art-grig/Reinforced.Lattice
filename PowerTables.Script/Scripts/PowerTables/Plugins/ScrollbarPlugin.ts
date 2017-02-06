module PowerTables.Plugins.Scrollbar {
    export class ScrollbarPlugin extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.Scrollbar.IScrollbarPluginUiConfig> {
        public IsVertical: boolean;
        public UpArrow: HTMLElement;
        public DownArrow: HTMLElement;
        public Scroller: HTMLElement;
        public ScrollerActiveArea: HTMLElement;

        private _stickElement: HTMLElement;
        private _scrollWidth: number;
        private _scrollHeight: number;
        private _scollbar: HTMLElement;
        private _availableSpace: number;
        private _scrollerPos: number;
        private _scrollerSize: number;

        private _kbListener: HTMLElement;
        private _wheelListener: HTMLElement;

        private _boundScrollerMove: any;
        private _boundScrollerEnd: any;

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.IsVertical = !this.Configuration.IsHorizontal;
            this._boundScrollerMove = this.scrollerMove.bind(this);
            this._boundScrollerEnd = this.scrollerEnd.bind(this);
        }

        //#region Coords calculation

        private updateCoords() {
            if (!this._scollbar) return;
            if (!this._stickElement) return;
            var newCoords = this.getCoords();
            if (newCoords.height != undefined) this._scollbar.style.height = newCoords.height + 'px';
            if (newCoords.width != undefined) this._scollbar.style.width = newCoords.width + 'px';
            if (newCoords.left != undefined) this._scollbar.style.left = newCoords.left + 'px';
            if (newCoords.top != undefined) this._scollbar.style.top = newCoords.top + 'px';
            this.calculateAvailableSpace();
            this.adjustScrollerHeight();
            this.adjustScrollerPosition(this.MasterTable.Partition.Skip);
        }

        private adjustScrollerPosition(skip: number) {
            if (!this.Scroller) return;
            var total = this.MasterTable.Partition.amount();
            var d = this._availableSpace / total;
            var h = d * skip;
            if (skip <= 0) h = 0;
            if (this.Configuration.IsHorizontal) this.Scroller.style.left = h + 'px';
            else this.Scroller.style.top = h + 'px';
            this._scrollerPos = h;
        }

        private _availableSpaceRaw: boolean = false;
        private adjustScrollerHeight() {
            if (!this.Scroller) return;
            var total = this.MasterTable.Partition.amount();
            var sz = (this.MasterTable.Partition.Take * this._availableSpace) / total;
            if (sz < this.Configuration.ScrollerMinSize) {
                var osz = sz;
                sz = this.Configuration.ScrollerMinSize;
                if (this._availableSpaceRaw) {
                    this._availableSpace -= (sz - osz);
                    this._availableSpaceRaw = false;
                    this.adjustScrollerPosition(this.MasterTable.Partition.Skip);
                }

            }
            if (this.Configuration.IsHorizontal) this.Scroller.style.width = sz + 'px';
            else this.Scroller.style.height = sz + 'px';
            this._scrollerSize = sz;
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
            this._availableSpaceRaw = true;
        }

        private getCoords(): Coords {
            var r: Coords = {};
            var erect = this._stickElement.getBoundingClientRect();
            var bodyrect = document.body.getBoundingClientRect();
            var c = {
                top: erect.top - bodyrect.top,
                height: this._stickElement.clientHeight,
                left: erect.left - bodyrect.left,
                width: this._stickElement.clientWidth
            };

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

        private getElement(configSelect: string): HTMLElement {
            if (!configSelect) return null;
            switch (configSelect) {
                case '$Body': return this.MasterTable.Renderer.BodyElement;
                case '$Parent': return this.MasterTable.Renderer.BodyElement.parentElement;
                case '$All': return this.MasterTable.Renderer.RootElement;
                case 'document': return <any>document;
                case 'body': return document.body;
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
            this._sensor = new PowerTables.Rendering.Resensor(this._stickElement.parentElement, this.updateCoords.bind(this));
            this.updateCoords();
            this._sensor.attach();
        }

        //#region UI events
        private subscribeUiEvents() {
            if (this.UpArrow) {
                PowerTables.Services.EventsDelegatorService.addHandler(this.UpArrow, 'mousedown', this.upArrowStart.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(document.body, 'mouseup', this.upArrowEnd.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(this.UpArrow, 'click', this.upArrow.bind(this));
            }
            if (this.DownArrow) {
                PowerTables.Services.EventsDelegatorService.addHandler(this.DownArrow, 'mousedown', this.downArrowStart.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(document.body, 'mouseup', this.downArrowEnd.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(this.DownArrow, 'click', this.downArrow.bind(this));
            }

            if (this._wheelListener) {
                PowerTables.Services.EventsDelegatorService
                    .addHandler(this._wheelListener, 'wheel', this.handleWheel.bind(this));
            }
            if (this.Scroller) {
                PowerTables.Services.EventsDelegatorService.addHandler(this.Scroller, 'mousedown', this.scrollerStart.bind(this));
            }
            if (this.ScrollerActiveArea) {
                PowerTables.Services.EventsDelegatorService.addHandler(this.ScrollerActiveArea, 'mousedown', this.activeAreaMouseDown.bind(this));
                PowerTables.Services.EventsDelegatorService.addHandler(this.ScrollerActiveArea, 'click', this.activeAreaClick.bind(this));
            }
            if (this._kbListener) {
                PowerTables.Services.EventsDelegatorService.addHandler(<any>window, 'keydown', this.keydownHook.bind(this));
                this._kbListener['enableKeyboardScroll'] = this.enableKb.bind(this);
                this._kbListener['disableKeyboardScroll'] = this.disableKb.bind(this);

                if (this.Configuration.FocusMode === PowerTables.Plugins.Scrollbar.KeyboardScrollFocusMode.MouseOver) {
                    PowerTables.Services.EventsDelegatorService
                        .addHandler(this._kbListener, 'mouseenter', this._kbListener['enableKeyboardScroll']);
                    PowerTables.Services.EventsDelegatorService
                        .addHandler(this._kbListener, 'mouseleave', this._kbListener['disableKeyboardScroll']);
                }

                if (this.Configuration.FocusMode === PowerTables.Plugins.Scrollbar.KeyboardScrollFocusMode.MouseClick) {
                    PowerTables.Services.EventsDelegatorService.addHandler(<any>window, 'click', this.trackKbListenerClick.bind(this));

                }
            }
        }

        //#region Keyboard events

        private trackKbListenerClick(e: MouseEvent) {
            var t = <HTMLElement>e.target;
            while (t != null) {
                if (t === this._kbListener) {
                    this._kbActive = true;
                    return;
                }
                t = t.parentElement;
            }
            this._kbActive = false;
        }

        private isKbListenerHidden() {
            return this._kbListener.offsetParent == null;
        }
        private _kbActive: boolean;

        private enableKb() { this._kbActive = true; }
        private disableKb() { this._kbActive = false; }

        private keydownHook(e: KeyboardEvent) {
            if ((<HTMLElement>e.target).tagName === 'input' ||
                (<HTMLElement>e.target).tagName === 'textarea' ||
                (<HTMLElement>e.target).tagName === 'select'
            ) {
                console.log("target is input");
                return true;
            }
            if (!this._kbActive) {
                console.log("kb not active");
                return true;
            }
            if (this.isKbListenerHidden()) {
                console.log("kb listener hidden");
                return true;
            }
            if (this._isHidden) {
                console.log("kb hidden");
                return true;
            }
            if (this.handleKey(e.keyCode)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            } else {
                console.log("key not recognized");
                return true;
            }
        }

        private handleKey(keyCode: number): boolean {
            var result = false;
            var mappings = this.Configuration.Keys;
            if (mappings.SingleDown.indexOf(keyCode) > -1) {
                this.deferScroll(this.MasterTable.Partition.Skip + this.Configuration.Forces.SingleForce);
                result = true;
            }
            if (mappings.SingleUp.indexOf(keyCode) > -1) {
                this.deferScroll(this.MasterTable.Partition.Skip - this.Configuration.Forces.SingleForce);
                result = true;
            }
            if (mappings.PageDown.indexOf(keyCode) > -1) {
                this.deferScroll(this.MasterTable.Partition.Skip + (this.Configuration.UseTakeAsPageForce ? this.MasterTable.Partition.Take : this.Configuration.Forces.PageForce));
                result = true;
            }
            if (mappings.PageUp.indexOf(keyCode) > -1) {
                this.deferScroll(this.MasterTable.Partition.Skip - (this.Configuration.UseTakeAsPageForce ? this.MasterTable.Partition.Take : this.Configuration.Forces.PageForce));
                result = true;
            }
            if (mappings.Home.indexOf(keyCode) > -1) {
                this.deferScroll(0);
                result = true;
            }
            if (mappings.End.indexOf(keyCode) > -1) {
                this.deferScroll(this.MasterTable.Partition.amount() - this.MasterTable.Partition.Take);
                result = true;
            }
            return result;
        }

        //#endregion

        //#region Active area click
        public activeAreaClick(e: MouseEvent) {
            if (e.target !== this.ScrollerActiveArea) return;
            var scrollerPos = this.Scroller.getBoundingClientRect();

            var cs = this.Configuration.IsHorizontal ? scrollerPos.left : scrollerPos.top;
            var pos = this.Configuration.IsHorizontal ? e.clientX : e.clientY;

            var rowsPerPixel = this.MasterTable.Partition.amount() / this._availableSpace;
            var diff = (pos - (cs + (this._scrollerSize / 2))) * rowsPerPixel;
            this.MasterTable.Partition.setSkip(this.MasterTable.Partition.Skip + Math.floor(diff));

            e.stopPropagation();
        }

        public activeAreaMouseDown(e: MouseEvent) {
            this.activeAreaClick(e);
            this.scrollerStart(e); //todo refire mousedown on scroller
        }

        //#endregion

        //#region Scroller drag
        private _mouseStartPos: number;
        private _startSkip: number;

        private scrollerStart(e: MouseEvent) {
            this._mouseStartPos = this.Configuration.IsHorizontal ? e.clientX : e.clientY;
            this._startSkip = this.MasterTable.Partition.Skip;
            this._skipOnUp = -1;

            PowerTables.Services.EventsDelegatorService.addHandler(document.body, 'mousemove', this._boundScrollerMove);
            PowerTables.Services.EventsDelegatorService.addHandler(document.body, 'mouseup', this._boundScrollerEnd);
            this.startDeferring();
        }

        private _skipOnUp: number = -1;
        private scrollerMove(e: MouseEvent) {
            if (e.buttons === 0) {
                this.scrollerEnd(e);
            }
            var cPos = this.Configuration.IsHorizontal ? e.clientX : e.clientY;
            var amt = this.MasterTable.Partition.amount();
            var rowsPerPixel = amt / this._availableSpace;
            var diff = (cPos - this._mouseStartPos) * rowsPerPixel;
            var skp = this._startSkip + Math.floor(diff);
            if (skp < 0) skp = 0;
            if (skp > amt - this.MasterTable.Partition.Take) skp = amt - this.MasterTable.Partition.Take;
            if (this.MasterTable.Partition.isServer()) {
                if (this.MasterTable.Partition.hasEnoughDataToSkip(skp)) {
                    this.deferScroll(skp);
                    this._skipOnUp = -1;
                } else {
                    this._skipOnUp = skp;
                    this.adjustScrollerPosition(skp);
                }
            } else {
                this.deferScroll(skp);
            }

            e.stopPropagation();
            e.preventDefault();
        }

        private scrollerEnd(e: MouseEvent) {
            this.endDeferring();

            PowerTables.Services.EventsDelegatorService.removeHandler(document.body, 'mousemove', this._boundScrollerMove);
            PowerTables.Services.EventsDelegatorService.removeHandler(document.body, 'mouseup', this._boundScrollerEnd);

            if (e != null) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
        //#endregion

        //#region Wheel events
        private handleWheel(e: WheelEvent) {
            if (this._isHidden) return;
            var range = 0;
            if (e.deltaMode === e.DOM_DELTA_PIXEL) {
                range = (e.deltaY > 0 ? 1 : -1) * this.Configuration.Forces.WheelForce;
            }
            if (e.deltaMode === e.DOM_DELTA_LINE) {
                range = e.deltaY * this.Configuration.Forces.WheelForce;
            }
            if (e.deltaMode === e.DOM_DELTA_PAGE) {
                range = e.deltaY * (this.Configuration.UseTakeAsPageForce ? this.MasterTable.Partition.Take : this.Configuration.Forces.PageForce);
            }

            if (range !== 0 && (this.MasterTable.Partition.Skip + range >= 0)) {
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

        private upArrowStart(e: MouseEvent) {
            this._upArrowActive = true;
            this._upArrowInterval = setInterval(this.upArrow.bind(this), this.Configuration.ArrowsDelayMs);
            e.stopPropagation();
        }

        private upArrow() {
            if (this.MasterTable.Partition.Skip == 0) return;
            this.MasterTable.Partition.setSkip(this.MasterTable.Partition.Skip - this.Configuration.Forces.SingleForce);    //todo force
        }

        private upArrowEnd(e: MouseEvent) {
            if (!this._upArrowActive) return;
            this._upArrowActive = false;
            clearInterval(this._upArrowInterval);
            e.stopPropagation();
        }
        //#endregion

        //#region Down arrow
        private _downArrowActive: boolean = false;
        private _downArrowInterval: any;

        private downArrowStart(e: MouseEvent) {
            this._downArrowActive = true;
            this._downArrowInterval = setInterval(this.downArrow.bind(this), this.Configuration.ArrowsDelayMs);
            e.stopPropagation();
        }

        private downArrow() {
            // to make user able to scroll until loader
            if (this.MasterTable.Partition.Type !== PowerTables.PartitionType.Sequential) {
                if (this.MasterTable.Partition.Skip + this.MasterTable.Partition.Take >=
                    this.MasterTable.Partition.amount()) return;
            }
            this.MasterTable.Partition.setSkip(this.MasterTable.Partition.Skip + this.Configuration.Forces.SingleForce);    //todo force
        }

        private downArrowEnd(e: MouseEvent) {
            if (!this._downArrowActive) return;
            this._downArrowActive = false;
            clearInterval(this._downArrowInterval);
            e.stopPropagation();
        }
        //#endregion

        //#endregion

        //#endregion

        //#region Movement deferring
        private _moveCheckInterval: any;
        private startDeferring() {
            this._moveCheckInterval = setInterval(this.moveCheck.bind(this), 30);
        }
        private deferScroll(skip: number) {
            if (!this._moveCheckInterval) this.MasterTable.Partition.setSkip(skip);
            else this._needMoveTo = skip;
        }
        private _needMoveTo: number;
        private _movedTo: number;
        private moveCheck() {
            var nmt = this._needMoveTo;
            if (nmt !== this._movedTo) {
                this.MasterTable.Partition.setSkip(nmt);
                this._movedTo = nmt;
            }
        }
        private endDeferring() {
            clearInterval(this._moveCheckInterval);
            if (this.MasterTable.Partition.isServer()) {
                if (this._skipOnUp !== -1) this._needMoveTo = this._skipOnUp;
            }
            this.moveCheck();

        }
        //#endregion

        private _prevCount: number;
        private _isHidden: boolean;
        private hideScroll() {
            this._isHidden = true;
            this._scollbar.style.visibility = 'hidden';
        }

        private showScroll() {
            this._isHidden = false;
            this._scollbar.style.visibility = 'visible';
        }
        private onPartitionChange(e: ITableEventArgs<IPartitionChangeEventArgs>) {
            if (!this.MasterTable.DataHolder.Ordered
                || (this.MasterTable.Partition.isClient() && this.MasterTable.DataHolder.Ordered.length <= e.MasterTable.Partition.Take)
                || this.MasterTable.DataHolder.DisplayedData.length === 0
                || e.EventArgs.Take === 0
            ) {
                this.hideScroll();
                return;
            } else {
                this.showScroll();
            }
            if (e.EventArgs.Take !== e.EventArgs.PreviousTake) {
                this.adjustScrollerHeight();
            }

            this.adjustScrollerPosition(e.EventArgs.Skip);
        }

        private onClientDataProcessing(e: ITableEventArgs<PowerTables.IClientDataResults>) {
            if (e.MasterTable.Partition.Take === 0
                || (((this.MasterTable.Partition.Type === PowerTables.PartitionType.Client) || (this.MasterTable.Partition.Type === PowerTables.PartitionType.Sequential))
                    && e.EventArgs.Ordered.length <= e.MasterTable.Partition.Take)
                || e.EventArgs.Displaying.length === 0
            ) {
                this.hideScroll();
                return;
            } else {
                this.showScroll();
            }


            this.adjustScrollerHeight();
            this.adjustScrollerPosition(this.MasterTable.Partition.Skip);

        }
        public subscribe(e: PowerTables.Services.EventsService): void {
            e.LayoutRendered.subscribeAfter(this.onLayoutRendered.bind(this), 'scrollbar');
            e.PartitionChanged.subscribeAfter(this.onPartitionChange.bind(this), 'scrollbar');
            e.ClientDataProcessing.subscribeAfter(this.onClientDataProcessing.bind(this), 'scrollbar');
        }

        private _sensor: PowerTables.Rendering.Resensor;

    }

    ComponentsContainer.registerComponent('Scrollbar', ScrollbarPlugin);
    interface Coords {
        top?: number;
        left?: number;
        height?: number;
        width?: number;
    }
}