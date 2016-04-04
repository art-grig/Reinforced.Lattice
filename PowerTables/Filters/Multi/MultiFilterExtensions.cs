using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;

namespace PowerTables.Filters.Multi
{
    public static class MultiFilterExtensions
    {
        public static MultiColumnFilter<TSourceData, TSourceColumn> FilterMultiSelect<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn,
            IEnumerable<SelectListItem> selectListItems) where TTableData : new()
        {
            var filter = MultiColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty,column.Configurator,sourceColumn);
            var configurator = column;
            configurator.ThrowIfFilterPresents();
            SelectFilterUiConfig cc = new SelectFilterUiConfig()
            {
                AllowSelectNothing = false,
                Items = selectListItems.ToList(),
                IsMultiple = true
            };

            configurator.ColumnConfiguration.ReplaceFilterConfig(SelectFilterExtensions.PluginId, cc);
            configurator.TableConfigurator.RegisterFilter(filter);
            return filter;
        }
    }
}
