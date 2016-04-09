﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;

namespace PowerTables.Filters.Multi
{
    public static class MultiFilterExtensions
    {
        /// <summary>
        /// Attaches Multi-Select filter to column
        /// </summary>
        /// <param name="column">Column configuration</param>
        /// <param name="filterDelegate">Filtering function base on value received from filter</param>
        /// <param name="ui">Filter UI builder</param>
        /// <returns></returns>
        public static MultiColumnFilter<TSourceData, TSourceColumn> FilterMultiSelect<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, IEnumerable<TSourceColumn>, IQueryable<TSourceData>> filterDelegate,
            Action<SelectFilterUiConfig> ui = null
            )
            where TTableData : new()
        {
            var filter = FilterMultiSelectNoUi(column,filterDelegate);
            FilterMultiSelectUi(column,ui);
            return filter;
        }

        /// <summary>
        /// Attaches Multi-Select filter to column
        /// </summary>
        /// <param name="column">Column configuration</param>
        /// <param name="sourceColumn">Source column</param>
        /// <param name="ui">Filter UI builder</param>
        /// <returns></returns>
        public static MultiColumnFilter<TSourceData, TSourceColumn> FilterMultiSelect<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn,
            Action<SelectFilterUiConfig> ui = null
            )
            where TTableData : new()
        {
            var filter = FilterMultiSelectNoUi(column, sourceColumn);
            FilterMultiSelectUi(column, ui);
            return filter;
        }

        /// <summary>
        /// Attaches Multi-Select filter to column
        /// </summary>
        /// <param name="column">Column configuration</param>
        /// <param name="filterDelegate">Filtering function base on value received from filter</param>
        /// <returns></returns>
        public static MultiColumnFilter<TSourceData, TSourceColumn> FilterMultiSelectNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, IEnumerable<TSourceColumn>, IQueryable<TSourceData>> filterDelegate) 
            where TTableData : new()
        {
            var filter = MultiColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty,column.Configurator,filterDelegate);
            var configurator = column;
            configurator.TableConfigurator.RegisterFilter(filter);
            return filter;
        }

        /// <summary>
        /// Attaches Multi-Select filter to column
        /// </summary>
        /// <param name="column">Column configuration</param>
        /// <param name="sourceColumn">Source column</param>
        /// <returns></returns>
        public static MultiColumnFilter<TSourceData, TSourceColumn> FilterMultiSelectNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn
            ) where TTableData : new()
        {
            var filter = MultiColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            var configurator = column;
            configurator.TableConfigurator.RegisterFilter(filter);
            return filter;
        }

        /// <summary>
        /// Attaches Multi-Select filter to column
        /// </summary>
        /// <param name="column">Column configuration</param>
        /// <param name="ui">Filter UI builder</param>
        /// <returns></returns>
        public static void FilterMultiSelectUi<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Action<SelectFilterUiConfig> ui = null
            ) where TTableData : new()
        {
            SelectFilterUiConfig cc = new SelectFilterUiConfig();
            cc.ColumnName = column.ColumnProperty.Name;

            if (ui != null) ui(cc);
            
            cc.AllowSelectNothing = false;
            cc.IsMultiple = true;
            
            column.ReplaceFilterConfig(SelectFilterExtensions.PluginId,cc);
        }
    }
}
