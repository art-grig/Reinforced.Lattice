module Reinforced.Lattice.Plugins.Reload {
    
    export class ReloadPlugin extends Reinforced.Lattice.Plugins.PluginBase<Reinforced.Lattice.Plugins.Reload.IReloadUiConfiguration> {
        private _renderedExternally: boolean;
        private _externalReloadBtn: ReloadButton;
        private _ready: boolean;

        public triggerReload() {
            this.MasterTable.Controller.reload(this.Configuration.ForceReload);
        }

        public renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void {
            if (this._renderedExternally) return;
            this.defaultRender(p);
        }

        public startLoading() {
            if (this._renderedExternally) {
                if (!this._ready) return;
                if (this._externalReloadBtn.VisualStates) this._externalReloadBtn.VisualStates.mixinState('loading');
            } else {
                if (this.VisualStates) this.VisualStates.mixinState('loading');
            }
        }

        public stopLoading() {
            if (this._renderedExternally) {
                if (!this._ready) return;
                if (this._externalReloadBtn.VisualStates) this._externalReloadBtn.VisualStates.unmixinState('loading');
            } else {
                if (this.VisualStates) this.VisualStates.unmixinState('loading');
            }
        }

        public subscribe(e: Reinforced.Lattice.Services.EventsService): void {
            super.subscribe(e);
            e.Loading.subscribeBefore(() => this.startLoading(), 'reload');
            e.Loading.subscribeAfter(() => this.stopLoading(), 'reload');
            e.LayoutRendered.subscribeAfter(() => {
                this.stopLoading();
            }, 'reload');
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this._renderedExternally = this.Configuration.RenderTo != null && this.Configuration.RenderTo != undefined && this.Configuration.RenderTo.length > 0;
        }

        afterDrawn: (e: ITableEventArgs<any>) => void = (e) => {
            if (this._renderedExternally) {
                this._externalReloadBtn = new ReloadButton(this.MasterTable.Controller, this.Configuration.ForceReload);
                this.MasterTable.Renderer.renderObject(this.RawConfig.TemplateId, this._externalReloadBtn, this.Configuration.RenderTo);
                this._ready = true;
            }
        }
    }

    class ReloadButton {
        constructor(controller: Reinforced.Lattice.Services.Controller, forceReload: boolean) {
            this._controller = controller;
            this._forceReload = forceReload;
        }

        public VisualStates: Reinforced.Lattice.Rendering.VisualState;
        private _controller: Reinforced.Lattice.Services.Controller;
        private _forceReload: boolean;

        public triggerReload() {
            this._controller.reload(this._forceReload);
        }
    }

    ComponentsContainer.registerComponent('Reload', ReloadPlugin);
} 