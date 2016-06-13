/// <reference path="../ExternalTypings.d.ts" />
/// <reference path="RenderingStack.d.ts" />
declare module PowerTables.Rendering {
    /**
     * Layout renderer
     * Is responsive for common layout rendering (with plugins, columns, etc)
     */
    class LayoutRenderer {
        private _instances;
        private _templatesProvider;
        private _hb;
        private _stack;
        private _templateIds;
        constructor(templates: ITemplatesProvider, stack: RenderingStack, instances: InstanceManager, coreTemplates: ICoreTemplateIds);
        private bodyHelper();
        private pluginHelper(pluginPosition, pluginId);
        private pluginsHelper(pluginPosition);
        /**
                 * Renders specified plugin into string including its wrapper
                 *
                 * @param plugin Plugin interface
                 * @returns {}
                 */
        renderPlugin(plugin: IPlugin): string;
        private headerHelper(columnName);
        /**
         * Renders specified column's header into string including its wrapper
         *
         * @param column Column which header is about to be rendered
         * @returns {}
         */
        renderHeader(column: IColumn): string;
        private headersHelper();
        renderContent(columnName?: string): string;
    }
}
