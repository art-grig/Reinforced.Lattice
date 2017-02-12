using System;
using System.Reflection;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Configuration
{
    public class FakeColumn<TColumn> : IColumnTargetProperty<TColumn>
    {
        public FakeColumn(string name)
        {
            var typeName = typeof(TColumn).Name;
            if (typeof(TColumn).IsNullable())
            {
                typeName = typeof(TColumn).GetArg().Name + "?";
            }
            var columnConfiguration = new ColumnConfiguration
            {
                ColumnType = typeName,
                RawColumnName = name,
                Title = name,
                IsNullable = typeof(TColumn).IsNullable(),
                DisplayOrder = 0
            };

            if (columnConfiguration.IsNullable)
            {
#if NETCORE
                columnConfiguration.IsEnum = typeof(TColumn).GetTypeInfo().GetGenericArguments()[0].GetTypeInfo().IsEnum;
#else
                columnConfiguration.IsEnum = typeof(TColumn).GetGenericArguments()[0].IsEnum;
#endif
            }
            else
            {
#if NETCORE
                columnConfiguration.IsEnum = typeof(TColumn).GetTypeInfo().IsEnum;
#else
                columnConfiguration.IsEnum = typeof(TColumn).IsEnum;
#endif
            }
            ColumnConfiguration = columnConfiguration;
        }

        public ColumnConfiguration ColumnConfiguration { get; private set; }

        public NongenericConfigurator TableConfigurator
        {
            get
            {
                throw new Exception("Cannot configure this property in context of fake column. ");
            }
        }

        public Type ColumnType { get { return typeof(TColumn); } }
        public PropertyDescription ColumnProperty { get { return default(PropertyDescription); } }
    }
}
