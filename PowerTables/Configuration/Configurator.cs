using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using PowerTables.Configuration.Json;
using PowerTables.Defaults;

namespace PowerTables.Configuration
{
    /// <summary>
    /// PowerTables table configurator. 
    /// This class stores configuration for all columns, filters, plugins etc and also 
    /// server processing configuration. It is able to extract necessary JSON configuration and provide it to 
    /// client side. 
    /// This class is entry point for entire PowerTables. 
    /// It is configurable in a fluent way so feel free to write tables configuration 
    /// as fluent method chains. Then simply create table configurator where it is needed and 
    /// configure with corresponding method chain. 
    /// To draw table on a web page create placeholder div, assign ID to it 
    /// then call <see cref="InitializationExtensions"/> methods to obtain javascript configuration code to be inserted 
    /// to page. 
    /// </summary>
    /// <typeparam name="TSourceData">Type of source raw data</typeparam>
    /// <typeparam name="TTableData">Type of target table data</typeparam>
    public class Configurator<TSourceData, TTableData> : NongenericConfigurator where TTableData : new()
    {
        #region Private fields
        private readonly Dictionary<string, PropertyDescription> _sourceColumnsDictionary;
        private readonly Dictionary<PropertyDescription, Delegate> _mappingDelegates = new Dictionary<PropertyDescription, Delegate>();
        private Func<IQueryable<TSourceData>, IQueryable<TTableData>> _projection;
        #endregion

        /// <summary>
        /// Projection function used to map source IQueryable to target IQueryable
        /// </summary>
        public Func<IQueryable<TSourceData>, IQueryable<TTableData>> Projection
        {
            get { return _projection; }
            internal set
            {
                if (_mappingDelegates.Any())
                {
                    throw new Exception(
                        "Mapping delegates and projection could not be used at the same time. Please don't configure projection either remove all .MappedFrom(...) calls");
                }
                _projection = value;
            }
        }

        /// <summary>
        /// Constructs new table configurator
        /// </summary>
        public Configurator()
        {
            List<PropertyDescription> sourceColumns;
            ReflectionCache.GetCachedProperties<TTableData>(out _tableColumns, out _tableColumnsDictionary);
            ReflectionCache.GetCachedProperties<TSourceData>(out sourceColumns, out _sourceColumnsDictionary);
            SourceType = typeof(TSourceData);
            TableType = typeof(TTableData);

            _tableConfiguration = new TableConfiguration();
            InitializeColumnsConfiguration();
            RegisterCommandHandler<DefaultCommandHandler>(DefaultCommandHandler.CommandId);
        }

        /// <summary>
        /// Register delegate for evaluating specific colum from source data
        /// </summary>
        /// <param name="tableColumn">Table column</param>
        /// <param name="mappingMethod">Function for evaluation</param>
        public void RegisterMapping(PropertyDescription tableColumn, Delegate mappingMethod)
        {
            tableColumn = this.CheckTableColum(tableColumn);
            if (_projection != null)
            {
                throw new Exception(
                        "Mapping delegates and projection could not be used at the same time. Please don't configure projection either remove all .MappedFrom(...) calls");

            }
            _mappingDelegates[tableColumn] = mappingMethod;
        }

        /// <summary>
        /// Excludes column from processing pipeline. Column value will not be passed to client-side nor 
        /// processe by get/set column value. After calling of this method you wont be able to 
        /// obtain configurator for this column, but property itself will remain in the columns object.
        /// </summary>
        /// <param name="column">Column to exclude</param>
        public void NotAColumn<TColType>(Expression<Func<TTableData, TColType>> column)
        {
            var tp = LambdaHelpers.ParsePropertyLambda(column);
            base.NotAColumn(tp.Name);
        }

        /// <summary>
        /// Retrieves column configurator
        /// </summary>
        /// <typeparam name="TColType">Column type</typeparam>
        /// <param name="column">Expression pointing to the TTargetData's property which column is being configured</param>
        /// <returns>Corresponding column configurator</returns>
        public ColumnUsage<TSourceData, TTableData, TColType> Column<TColType>(Expression<Func<TTableData, TColType>> column)
        {
            var tp = LambdaHelpers.ParsePropertyLambda(column);
            return (ColumnUsage<TSourceData, TTableData, TColType>) base.Column(tp.Name);
        }

        /// <summary>
        /// Creates new column and retrieves its configurator
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <param name="getValue">Specifies function for obtaining column value from target object. First parameter = row object, returns column value</param>
        /// <param name="setValue">Specifies function for setting column calue. 1st parameter = row object, 2nd parameter = column value</param>
        /// <param name="title">Column title (optional)</param>
        /// <param name="order">Column order</param>
        /// <returns>Corresponding column configurator</returns>
        public ColumnUsage<TSourceData, TTableData, TColumn> AddColumn<TColumn>(string columnName, Func<TTableData, TColumn> getValue, Action<TTableData, TColumn> setValue, string title = null, int? order = null)
        {
            if (!order.HasValue) order = _tableColumns.Count;
            if (string.IsNullOrEmpty(title)) title = columnName;

            PropertyDescription pd = new PropertyDescription(columnName, typeof(TColumn), title,
                (x) => getValue((TTableData) x),
                (x, y) => setValue((TTableData) x, (TColumn)y));
            _tableColumns.Add(pd);
            CreateColumn(pd, order.Value);
            return (ColumnUsage<TSourceData, TTableData, TColumn>) _configurators[pd];
        }

        /// <summary>
        /// Retrieves column configurator
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <param name="throw">Throw error if no column configuration</param>
        /// <returns>Corresponding column configurator</returns>
        public new ColumnUsage<TSourceData, TTableData, TColumn> Column<TColumn>(string columnName, bool @throw = true)
        {
            return (ColumnUsage<TSourceData, TTableData, TColumn>) base.Column<TColumn>(columnName,@throw);
        }

        /// <summary>
        /// Wraps result object into existing array at specified index
        /// </summary>
        /// <param name="resultRows">Existing data set</param>
        public object[] EncodeResults(IQueryable<TTableData> resultRows)
        {
            var results = resultRows.ToArray();
            return EncodeResults(results, results.Length);
        }

        /// <summary>
        /// Converts source data entry to table row according to mapping functions and property names
        /// </summary>
        /// <param name="src">Source data entry</param>
        /// <returns>Table row data entry</returns>
        public TTableData Map(TSourceData src)
        {
            if (Projection != null)
            {
                return Projection(new[] { src }.AsQueryable()).Single();
            }
            var tableData = new TTableData();
            foreach (var tableDataProperty in _tableColumns)
            {
                if (_mappingDelegates.ContainsKey(tableDataProperty))
                {
                    object val = _mappingDelegates[tableDataProperty].DynamicInvoke(src);
                    tableDataProperty.SetValue(tableData, val);
                }
                else
                {
                    if (_sourceColumnsDictionary.ContainsKey(tableDataProperty.Name))
                    {
                        var srcProp = _sourceColumnsDictionary[tableDataProperty.Name];
                        object val = srcProp.GetValue(src);
                        object converted = ValueConverter.MapValue(val, tableDataProperty.PropertyType, this);
                        tableDataProperty.SetValue(tableData, converted);
                    }
                }
            }
            return tableData;
        }

        /// <summary>
        /// Converts source data entries range to table rows range according to mapping functions and property names
        /// </summary>
        /// <param name="src">Source data entries range</param>
        /// <returns>Table row data entry</returns>
        public TTableData[] MapRange(IQueryable<TSourceData> src)
        {
            if (Projection != null) return Projection(src).ToArray();
            return src.ToArray().Select(Map).ToArray();
        }

        /// <summary>
        /// Converts source data entries range to table rows range according to mapping functions and property names
        /// </summary>
        /// <param name="src">Source data entries range</param>
        /// <returns>Table row data entry</returns>
        public TTableData[] MapRange(IEnumerable<TSourceData> src)
        {
            if (Projection != null) return Projection(src.ToArray().AsQueryable()).ToArray();
            return src.ToArray().Select(Map).ToArray();
        }
    }
}
