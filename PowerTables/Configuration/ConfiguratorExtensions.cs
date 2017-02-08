using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PowerTables.CellTemplating;
using PowerTables.Configuration.Json;
using PowerTables.Plugins;

namespace PowerTables.Configuration
{
    /// <summary>
    /// Extensions for table configurator
    /// </summary>
    public static class ConfiguratorExtensions
    {
        /// <summary>
        /// Checks that specified column belongs to target table data
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="column">Column PropertyInfo</param>
        public static PropertyDescription CheckTableColum(this IConfigurator c, PropertyDescription column)
        {
            CheckTableColum(c, column.Name);

            //if (c.TableColumnsDictionary[column.Name] != column) throw new Exception(
            //     String.Format("Property {0} does not belong to table of type {1}", column.Name, c.TableType.FullName));
            // todo : does not work with inherited properties
            return c.TableColumnsDictionary[column.Name];
        }

        /// <summary>
        /// Determines is there column of specific name in configurator
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="columnName">Raw column name</param>
        /// <returns>True if column presents,false otherwise</returns>
        public static bool HasColumn(IConfigurator conf, string columnName)
        {
            return conf.TableColumnsDictionary.ContainsKey(columnName);
        }

        /// <summary>
        /// Returns type of column with specfied name
        /// </summary>
        /// <param name="conf">Configurator</param>
        /// <param name="columnName">Raw column name</param>
        /// <returns>Type of column having mentioned column name</returns>
        public static Type GetColumnType(IConfigurator conf, string columnName)
        {
            if (!HasColumn(conf, columnName)) return null;
            return conf.TableColumnsDictionary[columnName].PropertyType;
        }

        /// <summary>
        /// Checks that specified column belongs to target table data
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="column">Column name</param>
        public static void CheckTableColum(this IConfigurator c, string column)
        {
            if (!c.TableColumnsDictionary.ContainsKey(column)) throw new Exception(
               String.Format("Property {0} does not belong to table of type {1}", column, c.TableType.FullName));

        }

        /// <summary>
        /// Checks that specified column belongs to target table data
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="column">Column name</param>
        public static bool CheckTableColumNoThrow(this IConfigurator c, string column)
        {
            return c.TableColumnsDictionary.ContainsKey(column);

        }


        /// <summary>
        /// Instructs Lattice to append empty filters when column filter is missing. 
        /// It is usable if you render you table in a way of regular table. 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="configurator"></param>
        /// <param name="placeholder">Location where to append empty filters</param>
        /// <returns></returns>
        public static T AppendEmptyFilters<T>(this T configurator, string placeholder = "filter") where T : IConfigurator
        {
            configurator.TableConfiguration.EmptyFiltersPlaceholder = placeholder;
            return configurator;
        }

        /// <summary>
        /// Disables or enables immediate fetching of table data from server
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="load">Load (or not)</param>
        /// <returns>Fluent</returns>
        public static T LoadImmediately<T>(this T c, bool load) where T : IConfigurator
        {
            c.TableConfiguration.LoadImmediately = load;
            return c;
        }

        /// <summary>
        /// Sets main operational URL of whole table. 
        /// Usually this URL should point to controller action that will return result of .HandleResponse/ await .HandleResponseAsync of table handler
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="url">Server handling URL</param>
        /// <returns></returns>
        public static T Url<T>(this T c, string url) where T : IConfigurator
        {
            c.TableConfiguration.OperationalAjaxUrl = url;
            return c;
        }


        /// <summary>
        /// Sets static data that will be sent with each request to server
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="staticData">Static data instance</param>
        /// <returns></returns>
        public static T Static<T>(this T c, object staticData) where T : IConfigurator
        {
            if (staticData != null)
            {
                c.TableConfiguration.StaticData = JsonConvert.SerializeObject(staticData);
            }
            return c;
        }

        /// <summary>
        /// Sets up datepickers configuration for table.
        /// Since handling DateTime through JSON, JS/HTML and MVC is big problem then here
        /// we have this method which will allow you to specify custom JS function for constructing datepicker
        /// and also specifying client and server date formats.
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="dpo">Datepicker options object</param>
        /// <returns></returns>
        public static T DatePicker<T>(this T c, DatepickerOptions dpo) where T : IConfigurator
        {
            c.TableConfiguration.DatepickerOptions = dpo;
            return c;
        }

        /// <summary>
        /// Method to apply for converting TSourceData (source data records) to TTargetData (data records that should be displayed in table)
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="projectionExpression">Function that will be applied to source set (filtered, ordered and cut) to get resulting set</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData> ProjectDataWith<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> c,
            Func<IQueryable<TSourceData>, IQueryable<TTableData>> projectionExpression) where TTableData : new()
        {
            c.Projection = projectionExpression;
            return c;
        }

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
        /// Sets up ordering fallback. 
        /// Some frameworks are not working if no OrderBy supplied (like EF). 
        /// So this function will specify "ordering fallback" - an .OrderBy that will be applied 
        /// to source set if no ordering provided.
        /// </summary>
        /// <param name="c">Table configurator</param>
        /// <param name="fallbackOrdering">Ordering expression</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData> OrderFallback<TSourceData, TTableData, T>(
            this Configurator<TSourceData, TTableData> c,
            Expression<Func<TSourceData, T>> fallbackOrdering) where TTableData : new()
        {
            c.FallbackOrdering = fallbackOrdering;
            return c;
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
        /// Overrides core table template IDs
        /// </summary>
        /// <param name="t">Configurator</param>
        /// <param name="layout">TemplateID for table layout</param>
        /// <param name="pluginWrapper">TemplateID for plugin wrapper</param>
        /// <param name="rowWrapper">TemplateID for row wrapper</param>
        /// <param name="headerWrapper">TemplateID for header wrapper</param>
        /// <param name="cellWrapper">TemplateID for cell wrapper</param>
        /// <param name="messages">Template ID for messages wrappers</param>
        /// <returns></returns>
        public static T CoreTemplates<T>(this T t,
            string layout = "layout",
            string pluginWrapper = "pluginWrapper",
            string rowWrapper = "rowWrapper",
            string headerWrapper = "headerWrapper",
            string cellWrapper = "cellWrapper"
            ) where T : IConfigurator
        {
            t.TableConfiguration.CoreTemplates.Layout = layout;
            t.TableConfiguration.CoreTemplates.PluginWrapper = pluginWrapper;
            t.TableConfiguration.CoreTemplates.RowWrapper = rowWrapper;
            t.TableConfiguration.CoreTemplates.HeaderWrapper = headerWrapper;
            t.TableConfiguration.CoreTemplates.CellWrapper = cellWrapper;
            return t;
        }





        /// <summary>
        /// Function that should consume IRow instance and return template name for this particular row.
        /// Return null/empty/undefined will let system to choose default template. 
        /// You can access row data via .DataObject property
        /// </summary>
        public static T RowTemplateSelector<T>(this T conf, string selectorFunction) where T : IConfigurator
        {
            conf.TableConfiguration.TemplateSelector = string.IsNullOrEmpty(selectorFunction) ? null : new JRaw(selectorFunction);
            return conf;
        }

        /// <summary>
        /// Function that should consume ITableMessage instance (similar to server's one) and show table message
        /// </summary>
        public static T ShowMessagesWith<T>(this T conf, string messageFunction) where T : IConfigurator
        {
            conf.TableConfiguration.MessageFunction = string.IsNullOrEmpty(messageFunction) ? null : new JRaw(messageFunction);
            return conf;
        }

        /// <summary>
        /// Subscribes event handler of DOM event occured on each row. 
        /// Please use this function to subscribe row events instead of template bindings or onclick to 
        /// improve event handling time and reduce RAM usage. This method actually makes table to subscribe row 
        /// event via events delegator
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="subscription">Event subscription configuration</param>
        /// <returns></returns>
        public static T SubscribeRowEvent<T>(this T conf, Action<TableEventSubscription> subscription) where T : IConfigurator
        {
            TableEventSubscription sub = new TableEventSubscription();
            sub.SubscriptionInfo.IsRowSubscription = true;
            subscription(sub);
            conf.TableConfiguration.Subscriptions.Add(sub.SubscriptionInfo);
            return conf;
        }

        /// <summary>
        /// Subscribes event handler of DOM event occured on each row. 
        /// Please use this function to subscribe row events instead of template bindings or onclick to 
        /// improve event handling time and reduce RAM usage. This method actually makes table to subscribe row 
        /// event via events delegator
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="subscription">Event subscription configuration</param>
        /// <returns></returns>
        public static T SubscribeAllCellsEvent<T>(this T conf, Action<TableEventSubscription> subscription) where T : IConfigurator
        {
            TableEventSubscription sub = new TableEventSubscription();
            sub.SubscriptionInfo.IsRowSubscription = false;
            sub.SubscriptionInfo.ColumnName = null;
            subscription(sub);
            conf.TableConfiguration.Subscriptions.Add(sub.SubscriptionInfo);
            return conf;
        }


        /// <summary>
        /// Subscribes event handler of DOM event occured on each row. 
        /// Please use this function to subscribe row events instead of template bindings or onclick to 
        /// improve event handling time and reduce RAM usage. This method actually makes table to subscribe row 
        /// event via events delegator
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="subscription">Event subscription</param>
        /// <returns></returns>
        public static T SubscribeRowEvent<T>(this T conf, TableEventSubscription subscription) where T : IConfigurator
        {
            subscription.SubscriptionInfo.IsRowSubscription = true;
            conf.TableConfiguration.Subscriptions.Add(subscription.SubscriptionInfo);
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
        /// <param name="columnName">Name of column catching corresponding cell events</param>
        /// <param name="subscription">Event subscription</param>
        /// <returns></returns>
        public static T SubscribeCellEvent<T>(this T conf, string columnName, TableEventSubscription subscription) where T : IConfigurator
        {
            subscription.SubscriptionInfo.ColumnName = columnName;
            subscription.SubscriptionInfo.IsRowSubscription = false;
            conf.TableConfiguration.Subscriptions.Add(subscription.SubscriptionInfo);
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
        /// Sets query confirmation function that is being called every time befor query is performed to bring 
        /// ability to handle heavy queries
        /// </summary>
        public static T QueryConfirmation<T>(this T conf, string confirmationFunction) where T : IConfigurator
        {
            conf.TableConfiguration.QueryConfirmation = string.IsNullOrEmpty(confirmationFunction) ? null : new JRaw(confirmationFunction);
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

        /// <summary>
        /// Sets up data that is embedded to configuration and will be automatically displayed after table is rendered
        /// </summary>
        /// <param name="configurator"></param>
        /// <param name="data">Data to embed to configuration</param>
        /// <returns></returns>
        public static Configurator<TSource, TData> Prefetch<TSource, TData>(this Configurator<TSource, TData> configurator, IEnumerable<TSource> data) where TData : new()
        {
            var mapped = configurator.MapRange(data);
            configurator.TableConfiguration.PrefetchedData = configurator.EncodeResults(mapped, mapped.Length);
            return configurator;
        }


        /// <summary>
        /// Sets up data that is embedded to configuration and will be automatically displayed after table is rendered
        /// </summary>
        /// <param name="configurator"></param>
        /// <param name="data">Data to embed to configuration</param>
        /// <returns></returns>
        public static Configurator<TSource, TData> Prefetch<TSource, TData>(this Configurator<TSource, TData> configurator, IQueryable<TSource> data) where TData : new()
        {
            var mapped = configurator.MapRange(data);
            configurator.TableConfiguration.PrefetchedData = configurator.EncodeResults(mapped, mapped.Length);
            return configurator;
        }

        

        public static Configurator<TSource, TTarget> Selection<TSource, TTarget>(
            this Configurator<TSource, TTarget> conf, Action<GenericSelectionConfigurationWrapper<TTarget>> config) where TTarget : new()
        {
            var wr = new GenericSelectionConfigurationWrapper<TTarget>(conf.TableConfiguration.SelectionConfiguration);
            config(wr);
            return conf;
        }

        public static NongenericConfigurator Selection(this NongenericConfigurator conf, Action<SelectionConfigurationWrapper> config)
        {
            var wr = new SelectionConfigurationWrapper(conf.TableConfiguration.SelectionConfiguration);
            config(wr);
            return conf;
        }


        public static T PrettifyTitles<T>(this T conf,bool firstCapitals = false) where T: IConfigurator
        {
            foreach (var col in conf.TableConfiguration.Columns)
            {
                col.Title = col.Title.PrettifyTitle(firstCapitals);
            }
            return conf;
        }

        public static T OnInitialized<T>(this T conf, string callbackFunction) where T : IConfigurator
        {
            conf.TableConfiguration.CallbackFunction = string.IsNullOrEmpty(callbackFunction)
                ? null
                : new JRaw(callbackFunction);
            return conf;
        }

        public static IConfigurator StaticData<TStaticData>(this IConfigurator conf, TStaticData staticData) where TStaticData : class
        {
            conf.TableConfiguration.StaticData = JsonConvert.SerializeObject(staticData);
            return conf;
        }

        public static T Partition<T>(this T conf, Action<PartitionConfigurationWrapper> p) where T : IConfigurator
        {
            PartitionConfigurationWrapper w = new PartitionConfigurationWrapper(conf.TableConfiguration.Partition);
            p(w);
            return conf;
        }

        public static T RemovePlugin<T>(this T conf, string pluginId,string where = null) where T : IConfigurator
        {
            PluginConfiguration entry = null;
            if (string.IsNullOrEmpty(where))
            {
                entry = conf.TableConfiguration.PluginsConfiguration.FirstOrDefault(c => c.PluginId == pluginId);
            }
            else
            {
                entry = conf.TableConfiguration.PluginsConfiguration.FirstOrDefault(c => c.PluginId == pluginId && c.Placement == where);
            }
            if (entry == null) return conf;
            conf.TableConfiguration.PluginsConfiguration.Remove(entry);
            return conf;
        }
    }
}
