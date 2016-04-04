using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Filters.Value;

namespace PowerTables.Filters.Select
{
    public static class SelectFilterExtensions
    {
        public const string PluginId = "SelectFilter";

        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterSelect<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn,
            Action<SelectFilterUiConfig> ui = null) where TTableData : new()
        {
            
            FilterSelectNoUi(column,sourceColumn);

            
        }

        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterSelectNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn) where TTableData : new()
        {
            var filter = ValueColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            var configurator = column;
            configurator.ThrowIfFilterPresents();
            configurator.TableConfigurator.RegisterFilter(filter);
            return filter;
        }

        public static void FilterSelectUi<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
           Action<SelectFilterUiConfig> ui) where TTableData : new()
        {
            SelectFilterUiConfig cc = new SelectFilterUiConfig();
            if (ui != null) ui(cc);

            filter.ClientConfig = cc;
            configurator.ColumnConfiguration.ReplaceFilterConfig(PluginId, cc);

            return filter;
        }

        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterSelect<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn,
            Func<IEnumerable<SelectListItem>> selectListItems, bool allowSelectNothing = true,
            string nothingText = null,
            string defaultValue = null) where TTableData : new()
        {
            var filter = ValueColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            var configurator = column;
            configurator.ThrowIfFilterPresents();
            configurator.TableConfigurator.RegisterFilter(filter);

            var col = column.ColumnConfiguration;
            SelectFilterUiConfig newCc = new SelectFilterUiConfig()
            {
                AllowSelectNothing = allowSelectNothing,
                Items = selectListItems().ToList(),
                NothingText = nothingText,
                SelectedValue = defaultValue
            };
            col.ReplaceFilterConfig(PluginId, newCc);
            return filter;
        }
    }
}
