module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import ResponseInfoClientConfiguration = PowerTables.Plugins.ResponseInfo.IResponseInfoClientConfiguration;

    export class ResponseInfoPlugin
        extends PluginBase<ResponseInfoClientConfiguration> {
        private _element: JQuery;

        constructor() {
            super('pt-responseinfo');
        }

        subscribe(e: EventsManager): void {
            e.ResponseDrawing.subscribe(this.onResponse.bind(this), 'ResponseInfo');
        }

        onResponse(response: IPowerTablesResponse) {
            this._element.empty();
            if (this.Configuration.ResponseObjectOverride) {
                this.renderTo(this._element, response.AdditionalData['ResponseInfo']);
            } else {
                this.renderTo(this._element, response);
            }
        }

        IsToolbarPlugin: boolean = false;
        PluginId: string = 'ResponseInfo';
        IsRenderable: boolean = true;
        subscribeEvents(parentElement: JQuery): void {
            if (this._element) return;
            this._element = parentElement;
            parentElement.empty();
        }

        IsQueryModifier: boolean = false;

        getTemplateContent(): string {
            if (this.Configuration.TemplateText) {
                return this.Configuration.TemplateText;
            } else {
                return $('#pt-responseinfo').html();
            }
        }

        
    }

    ComponentsContainer.registerComponent('ResponseInfo', ResponseInfoPlugin);
}  