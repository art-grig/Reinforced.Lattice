using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Filters
{
    interface ITypedAndKeyedColumnFilter<TSourceData, TFilteringKey> : ITypedAndKeyedFilter<TSourceData, TFilteringKey>
        , IColumnFilter
    {
    }
}
