using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables
{
    /// <summary>
    /// Entry for selection data
    /// </summary>
    /// <typeparam name="T">Data object</typeparam>
    public class CellsSelectionEntry<T>
    {
        /// <summary>
        /// Selected data row
        /// </summary>
        public T SelectedObject { get; internal set; }

        /// <summary>
        /// Set of columns selected in context of this row
        /// </summary>
        public IEnumerable<IColumnConfigurator> SelectedColumns { get; internal set; }

        /// <summary>
        /// Set of selected columns raw names (corresponds to property name)
        /// </summary>
        public IEnumerable<string> SelectedColumnNames
        {
            get
            {
                return SelectedColumns.Select(c => c.ColumnConfiguration.RawColumnName);
            }
        }
    }

    public static class SelectionExtensions
    {
        /// <summary>
        /// Obtains selection made by user from table. Returns set of empty table rows, where only primary key values are set. 
        /// So, here you won't receive full table rows - it is too expensive to pass them to server. You will get set of incomplete table rows. 
        /// Please query exact objects from data source manually
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <param name="data">Data</param>
        /// <returns>Set of selected PK-objects</returns>
        public static IEnumerable<TTableData> Selection<TSourceData, TTableData>(this PowerTablesData<TSourceData, TTableData> data) where TTableData : new()
        {
            return data.Configuration.ParsePrimaryKeys(data.Request.Query.Selection.Keys);
        }

        /// <summary>
        /// Obtains selection made by user from table including selected cells exposed by set of columns for each selected object. 
        /// Returns set of empty table rows, where only primary key values are set. 
        /// So, here you won't receive full table rows - it is too expensive to pass them to server. You will get set of incomplete table rows. 
        /// Please query exact objects from data source manually        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <param name="data">Data</param>
        /// <returns>Set of selected objects and cells</returns>
        public static IEnumerable<CellsSelectionEntry<TTableData>> ExtendedSelection<TSourceData, TTableData>(
            this PowerTablesData<TSourceData, TTableData> data) where TTableData : new()
        {
            foreach (var se in data.Request.Query.Selection)
            {
                yield return new CellsSelectionEntry<TTableData>()
                {
                    SelectedObject = data.Configuration.ParsePrimaryKey(se.Key),
                    SelectedColumns = data.Configuration.GetColumnsByIndexes(se.Value)
                };
            }
        }
    }
}
