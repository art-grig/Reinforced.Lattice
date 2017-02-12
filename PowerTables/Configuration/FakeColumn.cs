using System;
using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
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
                columnConfiguration.IsEnum = typeof(TColumn).GetGenericArguments()[0].IsEnum;
            }
            else
            {
                columnConfiguration.IsEnum = typeof(TColumn).IsEnum;
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
