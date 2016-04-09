module PowerTables {
    /**
     * Base class for plugins. 
     * It contains necessary infrastructure for convinence of plugins creation
     */
    export class PluginBase<TConfiguration> implements IPlugin {

        init(masterTable: IMasterTable, configuration: PowerTables.Configuration.Json.IPluginConfiguration): void {
            if (configuration) this.Configuration = configuration.Configuration;
            this.MasterTable = masterTable;
            this.subscribe(masterTable.Events);
            this.registerAdditionalHelpers(masterTable.Renderer.HandlebarsInstance);
        }

        Configuration: PowerTables.Configuration.Json.IPluginConfiguration;
        PluginLocation: string;

        /**
         * Plugin configuration object
         */
        protected PluginConfiguration: TConfiguration;

        /**
         * Reference to master table this plugin belongs to
         */
        protected MasterTable: IMasterTable;

        /**
         * Events subscription method. 
         * In derived class here should be subscription to various events
         * 
         * @param e Events manager         
         */
        protected subscribe(e: EventsManager): void {}

        /**
         * In this method you can register any additional Handlebars.js helpers in case of your 
         * templates needs ones
         * 
         * @param hb Handlebars instance
         * @returns {} 
         */
        protected registerAdditionalHelpers(hb: Handlebars.IHandlebars): void { }
       
    }
} 