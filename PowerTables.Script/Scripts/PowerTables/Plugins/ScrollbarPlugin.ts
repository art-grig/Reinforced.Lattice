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
            var newCoords = this.getCoords();

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

            this._scollbar = this.MasterTable.Renderer.renderObjectTo(this.RawConfig.TemplateId, this, document.body);
            
            this.updateCoords();
        }

        public subscribe(e: PowerTables.Services.EventsService): void {
            e.LayoutRendered.subscribeAfter(this.onLayoutRendered.bind(this), 'scrollbar');
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