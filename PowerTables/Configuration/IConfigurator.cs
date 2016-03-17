using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using PowerTables.Configuration.Json;
using PowerTables.Filters;
using PowerTables.ResponseProcessing;

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
        IReadOnlyDictionary<string, PropertyInfo> TableColumnsDictionary { get; }

        /// <summary>
        /// Wraps result object into existing array
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="resultRows">Queryable of source data</param>
        /// <returns></returns>
        object[] EncodeResults<T>(IQueryable<T> resultRows);

        object[] EncodeResults(object[] resultRows);

        /// <summary>
        /// Complete set of table columns (TTableData properties)
        /// </summary>
        PropertyInfo[] TableColumns { get; }

        /// <summary>
        /// Wraps result object into existing array 
        /// </summary>
        /// <param name="resultRows">Existing data array</param>
        /// <param name="resultsCount">Count of results in enumerable</param>
        object[] EncodeResults(IEnumerable resultRows, int resultsCount);

        /// <summary>
        /// Registeres a command handler that will be called to produce needed ActionResult for selected data
        /// </summary>
        /// <typeparam name="THandler">Type of command handler</typeparam>
        /// <param name="command">Command that should be handled</param>
        /// <returns>Fluent</returns>
        void RegisterCommandHandler<THandler>(string command) where THandler : ICommandHandler;

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
        ColumnConfiguration GetColumnConfiguration(PropertyInfo property);

        /// <summary>
        /// Type of source data
        /// </summary>
        Type SourceType { get; }

        /// <summary>
        /// Type of table row
        /// </summary>
        Type TableType { get; }

    }
}