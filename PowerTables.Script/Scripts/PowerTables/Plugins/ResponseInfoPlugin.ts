module PowerTables.Plugins {
    import ResponseInfoClientConfiguration = PowerTables.Plugins.ResponseInfo.IResponseInfoClientConfiguration;

    export class ResponseInfoPlugin extends PluginBase<ResponseInfoClientConfiguration> {
        private _recentData: any;
        private _recentTemplate: HandlebarsTemplateDelegate;

        renderContent(templatesProvider: ITemplatesProvider): string {
            return this._recentTemplate(this._recentData);
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.TemplateText && this.Configuration.TemplateText.length > 0) {
                this._recentTemplate = this.MasterTable.Renderer.HandlebarsInstance.compile(this.Configuration.TemplateText);
            } else {
                this._recentTemplate = this.MasterTable.Renderer.getCachedTemplate('responseInfo');
            }
        }
    }
    ComponentsContainer.registerComponent('ResponseInfo', ResponseInfoPlugin);
}
 