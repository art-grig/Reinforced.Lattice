/// <reference path="../ExternalTypings.d.ts"/>
/// <reference path="RenderingStack.ts"/>

module PowerTables.Rendering {

    /**
     * Layout renderer
     * Is responsive for common layout rendering (with plugins, columns, etc)
     */
    export class LayoutRenderer {

        private _instances: InstanceManager;
        private _templatesProvider: ITemplatesProvider;
        private _hb: Handlebars.IHandlebars;
        private _stack: RenderingStack;
        private _templateIds:ICoreTemplateIds;
        
        constructor(templates: ITemplatesProvider, stack: RenderingStack, instances: InstanceManager,coreTemplates:ICoreTemplateIds) {
            this._hb = templates.HandlebarsInstance;
            this._templatesProvider = templates;
            this._stack = stack;
            this._instances = instances;
            this._templateIds = coreTemplates;

            this._hb.registerHelper('Body', this.bodyHelper);
            this._hb.registerHelper('Plugin', this.pluginHelper.bind(this));
            this._hb.registerHelper('Plugins', this.pluginsHelper.bind(this));
            this._hb.registerHelper('Header', this.headerHelper.bind(this));
            this._hb.registerHelper('Headers', this.headersHelper.bind(this));
        }


        //#region Handlebars helpers

        private bodyHelper(): string {
            return '<input type="hidden" data-track="tableBodyHere" style="display:none;"/>';
        }

        //#region Plugin helpers
        private pluginHelper(pluginPosition: string, pluginId: string): string {
            var plugin: IPlugin = this._instances.getPlugin<IPlugin>(pluginId, pluginPosition);
            return this.renderPlugin(plugin);
        }

        private pluginsHelper(pluginPosition: string): string {
            var plugins: IPlugin[] = this._instances.getPlugins(pluginPosition);
            if (!plugins) return '';
            var result: string = '';

            for (var a in plugins) {
                if (plugins.hasOwnProperty(a)) {
                    var v: IPlugin = plugins[a];
                    result += this.renderPlugin(v);
                }
            }
            return result;
        }

/**
         * Renders specified plugin into string including its wrapper
         * 
         * @param plugin Plugin interface
         * @returns {} 
         */
        public renderPlugin(plugin: IPlugin): string {
            if (plugin.renderElement) return plugin.renderElement(this._templatesProvider);
            if (!plugin.renderContent) return '';
            this._stack.push(RenderingContextType.Plugin, plugin);
            var result: string = this._templatesProvider.getCachedTemplate(this._templateIds.PluginWrapper)(plugin);
            this._stack.popContext();
            return result;
        }

//#endregion

        // #region headers helper
        private headerHelper(columnName: string): string {
            try {
                return this.renderHeader(this._instances.getColumn(columnName));
            } catch (a) {
                return '';
            }
        }

        /**
         * Renders specified column's header into string including its wrapper
         * 
         * @param column Column which header is about to be rendered
         * @returns {} 
         */
        public renderHeader(column: IColumn): string {
            this._stack.push(RenderingContextType.Header, column.Header, column.RawName);
            var result: string;

            if (column.Header.renderElement) result = column.Header.renderElement(this._templatesProvider);
            else {
                result = this._templatesProvider.getCachedTemplate(column.Header.TemplateIdOverride||this._templateIds.HeaderWrapper)(column.Header);
            }

            this._stack.popContext();
            return result;
        }

        private headersHelper(): string {
            var columns: IColumn[] = this._instances.getUiColumns();
            var result: string = '';
            for (var a in columns) {
                if (columns.hasOwnProperty(a)) {
                    var v: IColumn = columns[a];
                    result += this.renderHeader(v);
                }
            }
            return result;
        }

//#endregion

        //#endregion

        public renderContent(columnName?: string): string {
            switch (this._stack.Current.Type) {
            case RenderingContextType.Header:
                return (<IColumnHeader>this._stack.Current.Object).Column.Configuration.Title
                    || (<IColumnHeader>this._stack.Current.Object).Column.RawName;

            case RenderingContextType.Plugin:
                // if we are here then plugin's renderContent is not 
                // overriden
                throw new Error('It is required to override renderContent for plugin');
            }
            return '';
        }

    }


   
}