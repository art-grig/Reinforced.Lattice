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
            IEnumerable<SelectListItem> selectListItems,
            bool allowSelectNothing = true,
            string nothingText = null,
            string defaultValue = null) where TTableData : new()
        {
            var filter = ValueColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            var configurator = column;
            configurator.ThrowIfFilterPresents();
            SelectFilterClientConfig cc = new SelectFilterClientConfig()
            {
                AllowSelectNothing = allowSelectNothing,
                Items = selectListItems.ToList(),
                NothingText = nothingText,
                SelectedValue = defaultValue
            };
            filter.ClientConfig = cc;
            configurator.ColumnConfiguration.ReplaceFilterConfig(PluginId, cc);
            configurator.TableConfigurator.RegisterFilter(filter);
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
            SelectFilterClientConfig newCc = new SelectFilterClientConfig()
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
