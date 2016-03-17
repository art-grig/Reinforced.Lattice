module PowerTables {
    export class PluginBase<TConfiguration>
        extends RenderableComponent
        implements IPlugin {
        protected Configuration: TConfiguration;
        protected MasterTable: PowerTable;

        constructor(templateId?:string) {
            super(templateId);
        }

        public init(table: PowerTable, configuration: PowerTables.Configuration.Json.IPluginConfiguration): void {
            if (configuration) this.Configuration = configuration.Configuration;
            this.MasterTable = table;
            this.subscribe(table.Events);
        }

        protected subscribe(e: EventsManager) {
            
        }

        IsToolbarPlugin: boolean = false;
        IsQueryModifier: boolean = false;
        IsRenderable: boolean = true;
        PluginId: string = '';
    }
} 