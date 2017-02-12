using System;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Configuration
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
        private readonly PropertyDescription _columnProperty;
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
        public PropertyDescription ColumnProperty
        {
            get { return _columnProperty; }
        }

        /// <summary>
        /// Reference to table configurator containing this column
        /// </summary>
        public NongenericConfigurator TableConfigurator
        {
            get { return _configurator; }
        }

        public Type ColumnType { get { return typeof(TTableColumn); } }


        internal ColumnUsage(Configurator<TSourceData, TTableData> configurator, PropertyDescription tablePropDescription, ColumnConfiguration columnConfiguration)
        {
            _columnProperty = tablePropDescription;//configurator.CheckTableColum(tablePropDescription);
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
