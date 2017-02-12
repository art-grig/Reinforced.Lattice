using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using PowerTables.Configuration.Json;
using PowerTables.Filters;
using PowerTables.Processing;

namespace PowerTables.Configuration
{
    /// <summary>
    /// Nongeneric table configurator interface
    /// </summary>
    public interface IConfigurator
    {
        /// <summary>
        /// Table configuration being serialized to JSON. 
        /// Please dont use this field directly
        /// </summary>
        TableConfiguration TableConfiguration { get; }

        /// <summary>
        /// Table coumn properties indexed by names
        /// </summary>
        IReadOnlyDictionary<string, PropertyDescription> TableColumnsDictionary { get; }

        /// <summary>
        /// Wraps result object into existing array
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="resultRows">Queryable of source data</param>
        /// <returns></returns>
        object[] EncodeResults<T>(IQueryable<T> resultRows);

        /// <summary>
        /// Wraps result set into array understandable for client side
        /// </summary>
        /// <param name="resultRows">Result rows set</param>
        object[] EncodeResults(object[] resultRows);

        /// <summary>
        /// Complete set of table columns (TTableData properties)
        /// </summary>
        IEnumerable<PropertyDescription> TableColumns { get; }

        /// <summary>
        /// Wraps result object into existing array 
        /// </summary>
        /// <param name="resultRows">Existing data array</param>
        /// <param name="resultsCount">Count of results in enumerable</param>
        object[] EncodeResults(IEnumerable resultRows, int resultsCount);

        /// <summary>
        /// Registers an response modifier that will modify PowerTableResponse before sending. 
        /// See <see cref="IResponseModifier"/>
        /// </summary>
        /// <returns>Fluent</returns>
        void RegisterResponseModifier(IResponseModifier modifier);

        /// <summary>
        /// Register filter
        /// </summary>
        /// <param name="typedFilter">Filter</param>
        void RegisterFilter(IFilter typedFilter);

        /// <summary>
        /// Returns filter registered for column specified
        /// </summary>
        /// <param name="columnName">Raw column name</param>
        /// <returns>Filter instance or null if filter not presents</returns>
        IColumnFilter GetFilter(string columnName);

        /// <summary>
        /// Retrieves JSON-friendly configuration for column specified
        /// </summary>
        /// <param name="property">Table column property</param>
        /// <returns>Column JSON configuration</returns>
        ColumnConfiguration GetColumnConfiguration(PropertyDescription property);

        /// <summary>
        /// Type of source data
        /// </summary>
        Type SourceType { get; }

        /// <summary>
        /// Type of table row
        /// </summary>
        Type TableType { get; }

        /// <summary>
        /// Returns MvcHtmlString that contains JSON table configuration that is used to construct
        /// Javascript PowerTables object. 
        /// PowerTables client-side is highly dependant on large JSON configuration. 
        /// So <see cref="Configurator{TSourceData,TTableData}"/> is initially set of helper methods 
        /// helping to build this JSON configuration. 
        /// This overload of JsonConfig consumes "static data". Static data is data class that 
        /// is well-known before table initialization and is being sent within every request. 
        /// You are not able to change it during request handling but can use it to store any payload 
        /// that is known before table construction.
        /// </summary>
        /// <param name="rootId">Id of an HTML element that will contain table</param>
        /// <param name="prefix">Templates prefix. It is used to distinguish several templates sets on single page from each other</param>
        /// <returns>String containing javascript initialization code</returns>
        string JsonConfig(string rootId, string prefix = "lt");

        /// <summary>
        /// Creates new column and retrieves its configurator
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <param name="getValue">Specifies function for obtaining column value from target object. First parameter = row object, returns column value</param>
        /// <param name="setValue">Specifies function for setting column calue. 1st parameter = row object, 2nd parameter = column value</param>
        /// <param name="title">Column title (optional)</param>
        /// <param name="order">Column order</param>
        /// <returns>Corresponding column configurator</returns>
        IColumnTargetProperty<TColumn> AddColumn<TColumn>(string columnName, Func<object, TColumn> getValue,
            Action<object, TColumn> setValue, string title = null, int? order = null);


        /// <summary>
        /// Creates new UI-only column without binding to any existing data
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <param name="title">Column title (optional)</param>
        /// <param name="order">Column order</param>
        /// <returns>Corresponding column configurator</returns>
        IColumnTargetProperty<T> AddUiColumn<T>(string columnName, string title = null, int? order = null);

        bool HasColumn(string columnName);

        /// <summary>
        /// Retrieves column value of specified row
        /// </summary>
        /// <param name="rowObject">Row object</param>
        /// <param name="propertyName">Column name</param>
        /// <returns>Column value</returns>
        object GetColumnValue(object rowObject, string propertyName);

        /// <summary>
        /// Sets column value of specified row
        /// </summary>
        /// <param name="rowObject">Row object</param>
        /// <param name="propertyName">Column name</param>
        /// <param name="value">Row's column value</param>
        void SetColumnValue(object rowObject, string propertyName, object value);


        /// <summary>
        /// Excludes column from processing pipeline. Column value will not be passed to client-side nor 
        /// processe by get/set column value. After calling of this method you wont be able to 
        /// obtain configurator for this column, but property itself will remain in the columns object.
        /// </summary>
        /// <param name="columnName">Column name to exclude</param>
        void NotAColumn(string columnName);
    }
}