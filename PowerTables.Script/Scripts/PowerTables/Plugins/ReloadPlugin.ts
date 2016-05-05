module PowerTables {
    import PluginBase = PowerTables.Plugins.PluginBase;
    import ReloadUiConfiguration = PowerTables.Plugins.Reload.IReloadUiConfiguration;

    export class ReloadPlugin extends PluginBase<ReloadUiConfiguration> {
        private _renderedExternally: boolean;
        private _externalReloadBtn: ReloadButton;
        private _ready: boolean;

        public triggerReload() {
            this.MasterTable.Controller.reload(this.Configuration.ForceReload);
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            if (this._renderedExternally) return '';
            return this.defaultRender(templatesProvider);
        }

        public startLoading() {
            if (this._renderedExternally) {
                if (!this._ready) return;
                this._externalReloadBtn.VisualStates.mixinState('loading');
            } else {
                this.VisualStates.mixinState('loading');
            }
        }

        public stopLoading() {
            if (this._renderedExternally) {
                if (!this._ready) return;
                this._externalReloadBtn.VisualStates.unmixinState('loading');
            } else {
                this.VisualStates.unmixinState('loading');
            }
        }

        public subscribe(e: EventsManager): void {
            super.subscribe(e);
            e.BeforeLoading.subscribe(() => this.startLoading(), 'reload');
            e.AfterLoading.subscribe(() => this.stopLoading(), 'reload');
            e.AfterLayoutRendered.subscribe(() => {
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
        constructor(controller: Controller, forceReload: boolean) {
            this._controller = controller;
            this._forceReload = forceReload;
        }

        public VisualStates: PowerTables.Rendering.VisualState;
        private _controller: Controller;
        private _forceReload: boolean;

        public triggerReload() {
            this._controller.reload(this._forceReload);
        }
    }

    ComponentsContainer.registerComponent('Reload', ReloadPlugin);
} 