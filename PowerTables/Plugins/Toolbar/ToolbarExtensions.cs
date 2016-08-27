using System;
using Newtonsoft.Json;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Toolbar
{
    public static class ToolbarExtensions
    {
        public const string PluginId = "Toolbar";
        private const string ConfirmationFormKey = "Confirmation";

        /// <summary>
        /// Adds toolbar to table
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conf">Table configurator</param>
        /// <param name="where">Toolbar position</param>
        /// <param name="toolbar">Toolbar confguration action</param>
        /// <param name="templateId">Overrides standard toolbar template ID</param>
        /// <param name="order">Plugin order among specified placement</param>
        /// <returns>Fluent</returns>
        public static T Toolbar<T>(this T conf, string where, Action<ToolbarBuilder> toolbar, string templateId = "toolbar",int order = 0) where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig<ToolbarButtonsClientConfiguration>(PluginId, c =>
            {
                ToolbarBuilder tb = new ToolbarBuilder(c.Configuration.Buttons);
                toolbar(tb);
                tb.AssignIds();
                c.TemplateId(templateId);
                c.Order = order;
            }, where);
            return conf;
        }

        /// <summary>
        /// Retrieves values of ConfirmationForm
        /// </summary>
        /// <typeparam name="T">ConfirmationForm ViewModel type</typeparam>
        /// <param name="clientQuery">Query</param>
        /// <returns>ConfirmationForm ViewModel</returns>
        public static T ConfirmationForm<T>(this Query clientQuery)
        {
            return clientQuery.RetrieveAdditionalObject<T>(ConfirmationFormKey);
        }

        /// <summary>
        /// Retrieves values of ConfirmationForm
        /// </summary>
        /// <typeparam name="T">ConfirmationForm ViewModel type</typeparam>
        /// <param name="clientQuery">Query</param>
        /// <param name="converters">Converters to be supplied to Json.Net</param>
        /// <returns>ConfirmationForm ViewModel</returns>
        public static T ConfirmationForm<T>(this Query clientQuery, params JsonConverter[] converters)
        {
            return clientQuery.RetrieveAdditionalObject<T>(ConfirmationFormKey, converters);
        }

        /// <summary>
        /// Retrieves values of ConfirmationForm
        /// </summary>
        /// <typeparam name="T">ConfirmationForm ViewModel type</typeparam>
        /// <param name="clientQuery">Query</param>
        /// <param name="serializerSettings">Serializer settings to be supplied to Json.Net</param>
        /// <returns>ConfirmationForm ViewModel</returns>
        public static T ConfirmationForm<T>(this Query clientQuery, JsonSerializerSettings serializerSettings)
        {
            return clientQuery.RetrieveAdditionalObject<T>(ConfirmationFormKey, serializerSettings);
        }

        /// <summary>
        /// Retrieves values of ConfirmationForm
        /// </summary>
        /// <typeparam name="T">ConfirmationForm ViewModel type</typeparam>
        /// <param name="request">PowerTables request</param>
        /// <returns>ConfirmationForm ViewModel</returns>
        public static T ConfirmationForm<T>(this PowerTableRequest request)
        {
            return ConfirmationForm<T>(request.Query);
        }

        /// <summary>
        /// Retrieves values of ConfirmationForm
        /// </summary>
        /// <typeparam name="T">ConfirmationForm ViewModel type</typeparam>
        /// <param name="request">PowerTables request</param>
        /// <param name="converters">Converters to be supplied to Json.Net</param>
        /// <returns>ConfirmationForm ViewModel</returns>
        public static T ConfirmationForm<T>(this PowerTableRequest request, params JsonConverter[] converters)
        {
            return ConfirmationForm<T>(request.Query, converters);
        }

        /// <summary>
        /// Retrieves values of ConfirmationForm
        /// </summary>
        /// <typeparam name="T">ConfirmationForm ViewModel type</typeparam>
        /// <param name="request">PowerTables request</param>
        /// <param name="serializerSettings">Serializer settings to be supplied to Json.Net</param>
        /// <returns>ConfirmationForm ViewModel</returns>
        public static T ConfirmationForm<T>(this PowerTableRequest request, JsonSerializerSettings serializerSettings)
        {
            return ConfirmationForm<T>(request.Query, serializerSettings);
        }
    }
}
