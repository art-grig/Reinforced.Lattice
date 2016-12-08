using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Newtonsoft.Json;
using PowerTables.Configuration.Json;
using PowerTables.Filters;
using PowerTables.ResponseProcessing;

namespace PowerTables.Configuration
{
    public abstract class NongenericConfigurator : IConfigurator
    {
        protected TableConfiguration _tableConfiguration;
        protected List<PropertyDescription> _tableColumns;
        protected Dictionary<string, Type> _commandHandlersTypes = new Dictionary<string, Type>();
        protected readonly Dictionary<PropertyDescription, LambdaExpression> _orderingExpressions = new Dictionary<PropertyDescription, LambdaExpression>();
        protected readonly Dictionary<PropertyDescription, IColumnConfigurator> _configurators = new Dictionary<PropertyDescription, IColumnConfigurator>();
        protected readonly Dictionary<PropertyDescription, ColumnConfiguration> _columnsConfiguration = new Dictionary<PropertyDescription, ColumnConfiguration>();
        protected Dictionary<string, PropertyDescription> _tableColumnsDictionary;
        private readonly HashSet<IResponseModifier> _responseModifiers = new HashSet<IResponseModifier>();
        private readonly HashSet<IFilter> _filters = new HashSet<IFilter>();
        private readonly Dictionary<string, IColumnFilter> _colFilters = new Dictionary<string, IColumnFilter>();

        public TableConfiguration TableConfiguration { get { return _tableConfiguration; } }
        public IReadOnlyDictionary<string, PropertyDescription> TableColumnsDictionary { get { return _tableColumnsDictionary; } }
        internal IReadOnlyDictionary<string, Type> CommandHandlerTypes { get { return _commandHandlersTypes; } }
        public IEnumerable<PropertyDescription> TableColumns { get { return _tableColumns; } }
        internal HashSet<IResponseModifier> ResponseModifiers { get { return _responseModifiers; } }
        public Type SourceType { get; protected set; }
        public Type TableType { get; protected set; }

        internal HashCalculator HashCalculator { get; private set; }

        public bool HasColumn(string columnName)
        {
            return _tableColumnsDictionary.ContainsKey(columnName);
        }

        public object GetColumnValue(object rowObject, string propertyName)
        {
            if (!TableColumnsDictionary.ContainsKey(propertyName))
                throw new Exception(string.Format("Table row does not contain column {0}", propertyName));
            return _tableColumnsDictionary[propertyName].GetValue(rowObject);
        }

        public void SetColumnValue(object rowObject, string propertyName, object value)
        {
            if (!TableColumnsDictionary.ContainsKey(propertyName))
                throw new Exception(string.Format("Table row does not contain column {0}", propertyName));
            _tableColumnsDictionary[propertyName].SetValue(rowObject, value);
        }

        public ColumnConfiguration GetColumnConfiguration(PropertyDescription property)
        {
            return _columnsConfiguration[property];
        }

        public void NotAColumn(string columnName)
        {
            if (!TableColumnsDictionary.ContainsKey(columnName))
                throw new Exception(string.Format("Table row does not contain column {0}", columnName));
            var tcol = _tableColumnsDictionary[columnName];
            _tableColumnsDictionary.Remove(columnName);
            _tableColumns.Remove(tcol);
            var conf = _columnsConfiguration[tcol];
            _columnsConfiguration.Remove(tcol);
            _configurators.Remove(tcol);
            _tableConfiguration.Columns.Remove(conf);
        }

        internal IEnumerable<IColumnConfigurator> GetColumnsByIndexes(int[] indexes)
        {
            for (int index = 0; index < _tableColumns.Count; index++)
            {
                var propertyDescription = _tableColumns[index];
                if (indexes.Contains(index)) yield return _configurators[propertyDescription];
            }
        }

        /// <summary>
        /// Retrieves column configurator
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="throw">Throw error if no column configuration</param>
        /// <returns>Corresponding column configurator</returns>
        public IColumnConfigurator Column(PropertyDescription column, bool @throw = true)
        {
            return Column(column.Name, @throw);
        }

        /// <summary>
        /// Retrieves column configurator
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <param name="throw">Throw error if no column configuration</param>
        /// <returns>Corresponding column configurator</returns>
        public IColumnConfigurator Column(string columnName, bool @throw = true)
        {
            if (!_tableColumnsDictionary.ContainsKey(columnName))
            {
                if (@throw) throw new Exception(string.Format("Column {0} is not defined", columnName));
                return null;
            }
            var column = _tableColumnsDictionary[columnName];
            if (!_configurators.ContainsKey(column))
            {
                if (@throw) throw new Exception(string.Format("No configurator for column {0} defined. Please call .Column(c=>c.Column) or .Column<TColumnType>(ColumnName) to create column configurator first (yes, you need to specify type explicitly using generics first).", column));
                return null;
            }

            return _configurators[column];
        }

        /// <summary>
        /// Retrieves column configurator
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <param name="throw">Throw error if no column configuration</param>
        /// <returns>Corresponding column configurator</returns>
        public IColumnTargetProperty<TColumn> Column<TColumn>(string columnName, bool @throw = true)
        {
            if (!_tableColumnsDictionary.ContainsKey(columnName))
            {
                if (@throw) throw new Exception(string.Format("No configurator for column {0}", columnName));
                return null;
            }
            var column = _tableColumnsDictionary[columnName];
            return (IColumnTargetProperty<TColumn>)_configurators[column];
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
        public IColumnTargetProperty<TColumn> AddColumn<TColumn>(string columnName, Func<object, TColumn> getValue, Action<object, TColumn> setValue, string title = null, int? order = null)
        {
            if (!order.HasValue) order = _tableColumns.Count;
            if (title == null) title = columnName;

            PropertyDescription pd = new PropertyDescription(columnName, typeof(TColumn), title,
                (x) => getValue(x),
                (x, y) => setValue(x, (TColumn)y), null);
            if (order < 0) _tableColumns.Insert(0, pd);
            else _tableColumns.Insert(order.Value, pd);
            CreateColumn(pd, order.Value);
            return (IColumnTargetProperty<TColumn>)_configurators[pd];
        }

        /// <summary>
        /// Creates new UI-only column without binding to any existing data
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <param name="title">Column title (optional)</param>
        /// <param name="order">Column order</param>
        /// <returns>Corresponding column configurator</returns>
        public IColumnTargetProperty<T> AddUiColumn<T>(string columnName, string title = null, int? order = null)
        {
            if (!order.HasValue) order = _tableColumns.Count;
            if (title == null) title = columnName;

            PropertyDescription pd = new PropertyDescription(columnName, typeof(T), title,
                (x) => null,
                (x, y) => {}, null);
            
            CreateColumn(pd, order.Value);
            var conf = (IColumnTargetProperty<T>)_configurators[pd];
            conf.ColumnConfiguration.IsSpecial = true;
            return conf;
        }

        protected void InitializeColumnsConfiguration()
        {
            int order = 0;
            foreach (var tableDataProperty in _tableColumns)
            {
                CreateColumn(tableDataProperty, order);
                order++;
            }
        }

        protected void CreateColumn(PropertyDescription tableDataProperty, int order)
        {
            var typeName = tableDataProperty.PropertyType.Name;
            if (tableDataProperty.PropertyType.IsNullable())
            {
                typeName = tableDataProperty.PropertyType.GetArg().Name + "?";
            }
            var columnConfiguration = new ColumnConfiguration
            {
                ColumnType = typeName,
                RawColumnName = tableDataProperty.Name,
                Title = tableDataProperty.Title,
                IsNullable = tableDataProperty.PropertyType.IsNullable(),
                DisplayOrder = order
            };
            if (columnConfiguration.IsNullable)
            {
                columnConfiguration.IsEnum = tableDataProperty.PropertyType.GetGenericArguments()[0].IsEnum;
            }
            else
            {
                columnConfiguration.IsEnum = tableDataProperty.PropertyType.IsEnum;
            }
            _columnsConfiguration[tableDataProperty] = columnConfiguration;
            _tableConfiguration.Columns.Add(columnConfiguration);
            _tableColumnsDictionary[tableDataProperty.Name] = tableDataProperty;

            var cuType = typeof(ColumnUsage<,,>).MakeGenericType(SourceType, TableType, tableDataProperty.PropertyType);
            BindingFlags flags = BindingFlags.NonPublic | BindingFlags.Instance;
            CultureInfo culture = null; // use InvariantCulture or other if you prefer
            var configurator = Activator.CreateInstance(cuType, flags, null,
                new object[] { this, tableDataProperty, columnConfiguration }, culture);
            _configurators[tableDataProperty] = (IColumnConfigurator)configurator;
        }

        private LambdaExpression _fallbackOrdering;

        /// <summary>
        /// Field containing expression for ordering fallback value. 
        /// Use corresponding configuration method to set this property. 
        /// See <see cref="ConfiguratorExtensions.OrderFallback{TSourceData,TTableData,T}"/>
        /// </summary>
        public LambdaExpression FallbackOrdering
        {
            get { return _fallbackOrdering; }
            internal set
            {
                if (_fallbackOrdering != null)
                {
                    throw new Exception("Fallback ordering could be set only once. Probably there is configuration issue. To avoid this message please use Configurator.RegisterFallbackOrdering(...) method.");
                }
                _fallbackOrdering = value;
            }
        }

        #region Result operations

        /// <summary>
        /// Wraps result object into existing array at specified index
        /// </summary>
        /// <param name="dataArray">Existing data array</param>
        /// <param name="index">Index</param>
        /// <param name="value">Result row</param>
        public void EncodeResult(object[] dataArray, ref int index, object value)
        {
            foreach (var p in _tableColumns)
            {
                dataArray[index] = p.GetValue(value);
                index++;
            }
        }

        /// <summary>
        /// Wraps result set into array understandable for client side
        /// </summary>
        /// <param name="resultRows">Result rows set</param>
        public object[] EncodeResults(object[] resultRows)
        {
            object[] result = new object[resultRows.Length * _tableColumns.Count];
            int index = 0;
            foreach (var resultRow in resultRows)
            {
                EncodeResult(result, ref index, resultRow);
            }
            return result;
        }

        public object[] EncodeResults(IEnumerable resultRows, int resultsCount)
        {
            object[] result = new object[resultsCount * _tableColumns.Count];
            int index = 0;
            foreach (var resultRow in resultRows)
            {
                EncodeResult(result, ref index, resultRow);
            }
            return result;
        }

        public object[] EncodeResults<T>(IQueryable<T> resultRows)
        {
            var results = resultRows.ToArray();
            return EncodeResults(results, results.Length);
        }
        #endregion

        #region Registrations

        /// <summary>
        /// Associates ordering expression with column
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="expression">Ordering lambda expression</param>
        public void RegisterOrderingExpression(PropertyDescription column, LambdaExpression expression)
        {
            column = this.CheckTableColum(column);
            _orderingExpressions[column] = expression;
        }

        public void RegisterResponseModifier(IResponseModifier modifier)
        {

            if (!_responseModifiers.Contains(modifier))
            {
                _responseModifiers.Add(modifier);
            }
        }

        public void RegisterFilter(IFilter typedFilter)
        {
            if (_filters.Contains(typedFilter))
            {
                throw new Exception("This instance of filter is already exists on table");
            }
            _filters.Add(typedFilter);
            var columnFilter = typedFilter as IColumnFilter;
            if (columnFilter != null)
            {
                _colFilters[columnFilter.ColumnName] = columnFilter;
            }
        }


        public void RegisterCommandHandler<THandler>(string command)
            where THandler : ICommandHandler
        {
            if (_commandHandlersTypes.ContainsKey(command))
            {
                var existingHandler = _commandHandlersTypes[command];

                string error =
                    String.Format(
                        "Duplicate column handler specification for command '{0}'. This command is already handled by {1}"
                        , command
                        , existingHandler.FullName
                        );

                throw new Exception(error);
            }
            _commandHandlersTypes.Add(command, typeof(THandler));
        }


        public string JsonConfig<TStaticData>(string rootId, TStaticData staticData = null, string prefix = "lt") where TStaticData : class
        {
            TableConfiguration tc = TableConfiguration;
            tc.TableRootId = rootId;
            tc.Prefix = prefix;
            if (staticData != null)
            {
                tc.StaticData = JsonConvert.SerializeObject(staticData);
            }
            string json = JsonConvert.SerializeObject(tc, SerializationSettings.ResponseSerializationSettings);
            return json;
        }
        #endregion

        internal IEnumerable<ITypedFilter<T>> GetFilters<T>()
        {
            return _filters.Cast<ITypedFilter<T>>();
        }

        /// <summary>
        /// Retrieves column ordering expression
        /// </summary>
        public LambdaExpression GetOrderingExpression(string columnName)
        {
            if (!this.CheckTableColumNoThrow(columnName)) return null;
            if (!_orderingExpressions.ContainsKey(_tableColumnsDictionary[columnName])) return null;
            return _orderingExpressions[_tableColumnsDictionary[columnName]];
        }

        public IColumnFilter GetFilter(string columnName)
        {
            if (!_colFilters.ContainsKey(columnName)) return null;
            return _colFilters[columnName];
        }

        internal void SetPrimaryKey(string[] primaryKeyFields)
        {
            HashCalculator = new HashCalculator(_tableColumns, primaryKeyFields, TableType);
            TableConfiguration.KeyFields = primaryKeyFields;
        }


    }
}
