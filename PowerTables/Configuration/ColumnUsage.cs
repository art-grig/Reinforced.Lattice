using System;
using System.Linq.Expressions;
using System.Reflection;
using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
{
    /// <summary>
    /// Column usage represents column of table for further configuration
    /// </summary>
    /// <typeparam name="TSourceData">Table source query type</typeparam>
    /// <typeparam name="TTableData">Type of table row</typeparam>
    /// <typeparam name="TTableColumn">Type of column property</typeparam>
    public class ColumnUsage<TSourceData, TTableData, TTableColumn> : IColumnTargetProperty<TTableColumn>
        where TTableData : new()
    {
        private readonly ColumnConfiguration _columnConfiguration;
        private readonly PropertyInfo _columnProperty;
        private readonly Configurator<TSourceData, TTableData> _configurator;

        /// <summary>
        /// Reference to typed table configurator containing this column
        /// </summary>
        public Configurator<TSourceData, TTableData> Configurator
        {
            get { return _configurator; }
        }

        /// <summary>
        /// PropertyInfo belonging to <typeparamref name="TTableData"/> containig data for this column
        /// </summary>
        public PropertyInfo ColumnProperty
        {
            get { return _columnProperty; }
        }

        /// <summary>
        /// Reference to table configurator containing this column
        /// </summary>
        public IConfigurator TableConfigurator
        {
            get { return _configurator; }
        }


        internal ColumnUsage(Configurator<TSourceData, TTableData> configurator, Expression<Func<TTableData, TTableColumn>> tableColumnExpression, ColumnConfiguration columnConfiguration)
        {
            _columnProperty = LambdaHelpers.ParsePropertyLambda(tableColumnExpression);
            _configurator = configurator;
            _columnConfiguration = columnConfiguration;
        }

        /// <summary>
        /// Json object containing configuration for column
        /// </summary>
        public ColumnConfiguration ColumnConfiguration
        {
            get { return _columnConfiguration; }
        }
    }
}
