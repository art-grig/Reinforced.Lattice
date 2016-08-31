using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
{
    public class FakeColumn<TColumn> : IColumnTargetProperty<TColumn>
    {
        public FakeColumn()
        {
            ColumnConfiguration = new ColumnConfiguration();
        }

        public ColumnConfiguration ColumnConfiguration { get; private set; }

        public NongenericConfigurator TableConfigurator
        {
            get
            {
                throw new Exception("Cannot configure this property in context of fake column. ");
            }
        }
    }
}
