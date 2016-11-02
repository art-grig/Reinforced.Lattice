using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Plugins.SimpeSelect
{
    public static class SimpleSelectExtensions
    {
        public static T SimpleSelectRow<T>(this T conf) where T : IConfigurator
        {
            conf.SubscribeRowEvent(a => a.Handle("click", "function(c) { c.Master.Selection.toggleObjectSelected(c.Master.DataHolder.localLookupDisplayedData(c.DisplayingRowIndex).DataObject); }"));
            return conf;
        }

        public static T SimpleSelectCell<T>(this T conf) where T : IConfigurator
        {
            conf.SubscribeRowEvent(a => a.Handle("click", "function(c) { c.Master.Selection.toggleCellsByObject(c.Master.DataHolder.localLookupDisplayedData(c.DisplayingRowIndex).DataObject,[c.Master.InstanceManager.getColumnNames()[c.ColumnIndex]]); }"));
            return conf;
        }
    }
}
