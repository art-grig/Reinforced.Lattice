using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Formwatch
{
    /// <summary>
    /// This class provides extension methods for Formwatch plugin
    /// </summary>
    public static class FormwatchExtensions
    {
        /// <summary>
        /// Formwatch plugin ID
        /// </summary>
        public const string PluginId = "Formwatch";

        private const string AdditionalDataKey = "Formwatch";

        /// <summary>
        /// Retrieves values of form
        /// </summary>
        /// <typeparam name="T">Form ViewModel type</typeparam>
        /// <param name="clientQuery">Query</param>
        /// <returns>Form ViewModel</returns>
        public static T Form<T>(this Query clientQuery)
        {
            return clientQuery.RetrieveAdditionalObject<T>(AdditionalDataKey);
        }

        /// <summary>
        /// Retrieves values of form
        /// </summary>
        /// <typeparam name="T">Form ViewModel type</typeparam>
        /// <param name="clientQuery">Query</param>
        /// <param name="converters">Converters to be supplied to Json.Net</param>
        /// <returns>Form ViewModel</returns>
        public static T Form<T>(this Query clientQuery, params JsonConverter[] converters)
        {
            return clientQuery.RetrieveAdditionalObject<T>(AdditionalDataKey, converters);
        }

        /// <summary>
        /// Retrieves values of form
        /// </summary>
        /// <typeparam name="T">Form ViewModel type</typeparam>
        /// <param name="clientQuery">Query</param>
        /// <param name="serializerSettings">Serializer settings to be supplied to Json.Net</param>
        /// <returns>Form ViewModel</returns>
        public static T Form<T>(this Query clientQuery, JsonSerializerSettings serializerSettings)
        {
            return clientQuery.RetrieveAdditionalObject<T>(AdditionalDataKey, serializerSettings);
        }

        /// <summary>
        /// Retrieves values of form
        /// </summary>
        /// <typeparam name="T">Form ViewModel type</typeparam>
        /// <param name="request">PowerTables request</param>
        /// <returns>Form ViewModel</returns>
        public static T Form<T>(this PowerTableRequest request)
        {
            return Form<T>(request.Query);
        }

        /// <summary>
        /// Retrieves values of form
        /// </summary>
        /// <typeparam name="T">Form ViewModel type</typeparam>
        /// <param name="request">PowerTables request</param>
        /// <param name="converters">Converters to be supplied to Json.Net</param>
        /// <returns>Form ViewModel</returns>
        public static T Form<T>(this PowerTableRequest request, params JsonConverter[] converters)
        {
            return Form<T>(request.Query, converters);
        }

        /// <summary>
        /// Retrieves values of form
        /// </summary>
        /// <typeparam name="T">Form ViewModel type</typeparam>
        /// <param name="request">PowerTables request</param>
        /// <param name="serializerSettings">Serializer settings to be supplied to Json.Net</param>
        /// <returns>Form ViewModel</returns>
        public static T Form<T>(this PowerTableRequest request, JsonSerializerSettings serializerSettings)
        {
            return Form<T>(request.Query, serializerSettings);
        }

        /// <summary>
        /// Attaches instance of Formwatch plugin to table. 
        /// Formwatch plugin brings the ability of automatic triggering specified fields change 
        /// on client, extract specified fields data and include it to request. 
        /// It is possible to retrieve collected form data with <see cref="Form{T}(PowerTables.Query)"/> or <see cref="Form{T}(PowerTables.PowerTableRequest)"/> method. 
        /// Formwatch plugin is quite flexible and allows you to specify selector for each field, constant values, custom 
        /// value evaluation functions etc.
        /// </summary>
        /// <param name="configurator">Table configurator</param>
        /// <param name="formWatchConfig">Formwatch plugin configuration method</param>
        public static void WatchForm<T>(this IConfigurator configurator, Action<FormWatchBuilder<T>> formWatchConfig)
        {
            var builder = new FormWatchBuilder<T>();
            formWatchConfig(builder);
            configurator.TableConfiguration.ReplacePluginConfig(PluginId, builder.ClientConfig);
        }

        /// <summary>
        /// Allows to filter specified column by FormWatch fields value
        /// </summary>
        /// <param name="column">Column to filter</param>
        /// <param name="c">FormWatch builder</param>
        /// <returns></returns>
        public static FormWatchAutofilterConfiguration<TCol, TForm> ByForm<TCol, TForm>(this IColumnTargetProperty<TCol> column, FormWatchBuilder<TForm> c)
        {
            return new FormWatchAutofilterConfiguration<TCol, TForm>(c.ClientConfig, column.ColumnConfiguration.RawColumnName);
        }

        /// <summary>
        /// Allow FormWatch to equip client field with Datepicker according to common table settings
        /// </summary>
        /// <param name="v"></param>
        /// <param name="auto"></param>
        /// <returns></returns>
        public static FormWatchFieldBuilder<DateTime> AutoDatePicker(this FormWatchFieldBuilder<DateTime> v,
            bool auto = true)
        {
            v.FieldData.AutomaticallyAttachDatepicker = auto;
            return v;
        }

        /// <summary>
        /// Allow FormWatch to equip client field with Datepicker according to common table settings
        /// </summary>
        /// <param name="v"></param>
        /// <param name="auto"></param>
        /// <returns></returns>
        public static FormWatchFieldBuilder<DateTime?> AutoDatePicker(this FormWatchFieldBuilder<DateTime?> v,
            bool auto = true)
        {
            v.FieldData.AutomaticallyAttachDatepicker = auto;
            return v;
        }

        /// <summary>
        /// Sets array delimiter for array columns
        /// </summary>
        /// <param name="v"></param>
        /// <param name="arrayDelimiter">Array delimiter string</param>
        /// <returns></returns>
        public static FormWatchFieldBuilder<T> Delimiter<T>(this FormWatchFieldBuilder<T> v,
            string arrayDelimiter) where T:IEnumerable
        {
            v.FieldData.ArrayDelimiter = arrayDelimiter;
            return v;
        }
    }
}
