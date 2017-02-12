using System;
using Newtonsoft.Json.Linq;
using Reinforced.Lattice.CellTemplating;

namespace Reinforced.Lattice.Configuration
{
    public static class ColumnConfiguratorExtensions
    {
        /// <summary>
        /// Registers column mapping to be used in case of disabled .ProjectDataWith. 
        /// .MappedFrom functions are being called simultaneously when evaluating resulting data set to be sent to client
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="converter">Mapping function</param>
        /// <returns></returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> MappedFrom<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> conf, Func<TSourceData, TTableColumn> converter) where TTableData : new()
        {
            conf.Configurator.RegisterMapping(conf.ColumnProperty, converter);
            return conf;
        }

        /// <summary>
        /// Sets up column title
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="title">Title text</param>
        /// <returns>Fluent</returns>
        public static T Title<T>(this T conf, string title) where T : IColumnConfigurator
        {
            conf.ColumnConfiguration.Title = title;
            return conf;
        }

        /// <summary>
        /// Sets up column display order
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="displayOrder">Column display order</param>
        /// <returns>Fluent</returns>
        public static T DisplayOrder<T>(this T conf, double displayOrder) where T : IColumnConfigurator
        {
            conf.ColumnConfiguration.DisplayOrder = displayOrder;
            return conf;
        }

        /// <summary>
        /// Sets up column description
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="descriptionHtml">Column description or HTML</param>
        /// <returns>Fluent</returns>
        public static T Description<T>(this T conf, string descriptionHtml) where T : IColumnConfigurator
        {
            conf.ColumnConfiguration.Description = descriptionHtml;
            return conf;
        }


        /// <summary>
        /// Sets up random column metadata object
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="meta">Metadata object</param>
        /// <returns>Fluent</returns>
        public static T Meta<T>(this T conf, object meta) where T : IColumnConfigurator
        {
            conf.ColumnConfiguration.Meta = meta;
            return conf;
        }

        /// <summary>
        /// Specifies handlebarsjs template id to be used for rendering of this column. 
        /// Specified template will be compiled at the beginnig of processing. 
        /// JSON-ed TTableData is used as tempalte model. So you can use all columns and not only current  
        /// column value
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="templateId">Template id (without "#" or other selectors)</param>
        /// <returns>Fluent</returns>
        public static T TemplateId<T>(this T conf, string templateId) where T : IColumnConfigurator
        {
            if ((conf.ColumnConfiguration.CellRenderingValueFunction != null))
            {
                throw new Exception("Column has already specified value function. TemplateId is redundant. Please remove it.");
            }
            conf.ColumnConfiguration.CellRenderingTemplateId = templateId;
            return conf;
        }

        /// <summary>
        /// Specifies function that should return plain text value string to be inserted to resulting table
        /// </summary>
        /// <param name="conf">Column</param>
        /// <param name="function">JS function text. Like "function(v){ ... }"</param>
        /// <returns>Fluent</returns>
        public static T TemplateFunction<T>(this T conf, string function) where T : IColumnConfigurator
        {

            if (!string.IsNullOrEmpty(conf.ColumnConfiguration.CellRenderingTemplateId))
            {
                throw new Exception("Column has already specified TemplateId. TemplateFunction is redundant. Please remove it.");
            }
            conf.ColumnConfiguration.CellRenderingValueFunction = new JRaw(function);
            return conf;
        }

        /// <summary>
        /// Instructs Lattice do not to create column for this property. 
        /// Specified column will be passed to client but will not be displayed in table. 
        /// It is useful to optimize table rendering by excluding data that not required as separate column 
        /// but still used for Value/HTML function
        /// </summary>
        /// <param name="conf">Column configuration</param>
        /// <param name="isDataOnly">Enable or disable .DataOnly</param>
        public static T DataOnly<T>(this T conf, bool isDataOnly = true) where T : IColumnConfigurator
        {
            conf.ColumnConfiguration.IsDataOnly = isDataOnly;
            return conf;
        }

        /// <summary>
        /// Subscribes event handler of DOM event occured on each cell of this column (without headers)
        /// Please use this function to subscribe cell events instead of template bindings or onclick to 
        /// improve event handling time and reduce RAM usage. This method actually makes table to subscribe cell 
        /// event via events delegator
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="subscription">Event subscription configuration</param>
        /// <returns></returns>
        public static T SubscribeCellEvent<T>
            (this T conf, Action<TableEventSubscription> subscription) where T : IColumnConfigurator
        {
            TableEventSubscription sub = new TableEventSubscription();
            sub.SubscriptionInfo.IsRowSubscription = false;
            sub.SubscriptionInfo.ColumnName = conf.ColumnConfiguration.RawColumnName;

            subscription(sub);
            conf.TableConfigurator.TableConfiguration.Subscriptions.Add(sub.SubscriptionInfo);
            return conf;
        }

        /// <summary>
        /// Function that should consume ICell instance and return template name for this particular cell.
        /// Return null/empty/undefined will let system to choose default template. 
        /// You can access cell data via .DataObject property
        /// </summary>
        public static T TemplateSelector<T>(this T conf, string selectorFunction)
            where T : IColumnConfigurator
        {
            conf.ColumnConfiguration.TemplateSelector = string.IsNullOrEmpty(selectorFunction) ? null : new JRaw(selectorFunction);
            return conf;
        }

        /// <summary>
        /// Subscribes event handler of DOM event occured on each cell of this column (without headers)
        /// Please use this function to subscribe cell events instead of template bindings or onclick to 
        /// improve event handling time and reduce RAM usage. This method actually makes table to subscribe cell 
        /// event via events delegator
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="subscription">Event subscription</param>
        /// <returns></returns>
        public static T SubscribeCellEvent<T>(this T conf, TableEventSubscription subscription) where T : IColumnConfigurator
        {
            subscription.SubscriptionInfo.IsRowSubscription = false;
            conf.TableConfigurator.TableConfiguration.Subscriptions.Add(subscription.SubscriptionInfo);
            return conf;
        }
        /// <summary>
        /// Specifies JS function for client-side cell value evaluation for particular mentioned column
        /// </summary>
        /// <param name="conf">Column configurator</param>
        /// <param name="clientValueFunction">Client valuation function. Can be reference to existing JS function or inline one. Function signature is (dataObject:any) => any</param>
        /// <returns></returns>
        public static T ClientFunction<T>(this T conf, string clientValueFunction) where T : IColumnConfigurator
        {
            conf.ColumnConfiguration.ClientValueFunction = string.IsNullOrEmpty(clientValueFunction) ? null : new JRaw(clientValueFunction);
            return conf;
        }

        /// <summary>
        /// Specifies JS function for client-side cell value evaluation for particular mentioned column
        /// </summary>
        /// <param name="conf">Column configurator</param>
        /// <param name="clientValueFunction">Client valuation function. Can be reference to existing JS function or inline one. Function signature is (dataObject:any) => any</param>
        /// <returns></returns>
        public static T ClientExpression<T>(this T conf, string clientValueFunction) where T : IColumnConfigurator
        {
            var expr = Template.CompileExpression(clientValueFunction, "v", null, conf.ColumnConfiguration.RawColumnName);
            clientValueFunction = string.Format("function(v) {{ return {0}; }}", expr);
            conf.ColumnConfiguration.ClientValueFunction = string.IsNullOrEmpty(clientValueFunction) ? null : new JRaw(clientValueFunction);
            return conf;
        }

    }
}
