module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;

    export class LoadingPlugin
        extends PluginBase<any> {

        private _element: JQuery;

        constructor() {
            super('pt-plugin-loading');
        }

        private showLoading() {
            this._element.fadeIn(150);
        }

        private hideLoading() {
            this._element.fadeOut(150);
        }

        IsToolbarPlugin: boolean = false;
        PluginId: string = 'Loading';
        IsRenderable: boolean = true;
        subscribeEvents(parentElement: JQuery): void {
            this._element = parentElement.find('._loading');
            this._element.hide();
        }

        IsQueryModifier: boolean = false;

        subscribe(e: EventsManager): void {
            e.BeforeLoading.subscribe(this.showLoading.bind(this), 'loading');
            e.AfterLoading.subscribe(this.hideLoading.bind(this), 'loading');
        }
    }

    ComponentsContainer.registerComponent('Loading', LoadingPlugin);
} 