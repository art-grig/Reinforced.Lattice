using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Adjustments
{
    public class SelectionAdditionalData
    {
        public SelectionToggle SelectionToggle { get; set; }

        public Dictionary<string, string[]> Unselect { get; set; }

        public Dictionary<string, string[]> Select { get; set; }

        public SelectionAdditionalData()
        {
            Unselect = new Dictionary<string, string[]>();
            Select = new Dictionary<string, string[]>();
        }
    }

    public enum SelectionToggle
    {
        LeaveAsIs,
        All,
        Nothing
    }

    public static class SelectionAdjustmentsExtension
    {
        private const string Key = "Selection";
        public static T ToggleSelection<T>(this T c, SelectionToggle t) where T : IAdditionalDataProvider
        {
            var ad = c.GetOrCreateAdditionalData<SelectionAdditionalData>(Key);
            ad.SelectionToggle = t;
            return c;
        }

        public static T Select<T>(this T c, IEnumerable<string> keys, IEnumerable<string> columns = null) where T : IAdditionalDataProvider
        {
            var ad = c.GetOrCreateAdditionalData<SelectionAdditionalData>(Key);
            foreach (var key in keys)
            {
                ad.Select.Add(key, columns == null ? null : columns.ToArray());
            }
            return c;
        }

        public static T Unselect<T>(this T c, IEnumerable<string> keys, IEnumerable<string> columns = null) where T : IAdditionalDataProvider
        {
            var ad = c.GetOrCreateAdditionalData<SelectionAdditionalData>(Key);
            foreach (var key in keys)
            {
                ad.Select.Add(key, columns == null ? null : columns.ToArray());
            }
            return c;
        }


        public static AdjustmentWrapper<TSource, TData> Select<TSource, TData, TK>(this AdjustmentWrapper<TSource, TData> c, IEnumerable<TSource> keys, Expression<Func<TData, TK>> columns = null)
            where TData : new()
        {
            var colsList = columns == null ? null : LambdaHelpers.ExtractColumnsList(columns);
            var keysList = c.Configurator.ProducePrimaryKeys(c.Configurator.MapRange(keys)).ToList();
            c.Select(keysList, colsList);
            return c;
        }

        public static AdjustmentWrapper<TSource, TData> Unselect<TSource, TData, TK>(this AdjustmentWrapper<TSource, TData> c, IEnumerable<TSource> keys, Expression<Func<TData, TK>> columns = null)
            where TData : new()
        {
            var colsList = columns == null ? null : LambdaHelpers.ExtractColumnsList(columns);
            var keysList = c.Configurator.ProducePrimaryKeys(c.Configurator.MapRange(keys)).ToList();
            c.Unselect(keysList, colsList);
            return c;
        }


        public static AdjustmentWrapper<TSource, TData> Select<TSource, TData, TK>(this AdjustmentWrapper<TSource, TData> c, IEnumerable<TData> keys, Expression<Func<TData, TK>> columns = null)
            where TData : new()
        {
            var colsList = columns == null ? null : LambdaHelpers.ExtractColumnsList(columns);
            var keysList = c.Configurator.ProducePrimaryKeys(keys).ToList();
            c.Select(keysList, colsList);
            return c;
        }

        public static AdjustmentWrapper<TSource, TData> Unselect<TSource, TData, TK>(this AdjustmentWrapper<TSource, TData> c, IEnumerable<TData> keys, Expression<Func<TData, TK>> columns = null)
            where TData : new()
        {
            var colsList = columns == null ? null : LambdaHelpers.ExtractColumnsList(columns);
            var keysList = c.Configurator.ProducePrimaryKeys(keys).ToList();
            c.Unselect(keysList, colsList);
            return c;
        }


        public static AdjustmentWrapper<TSource, TData> Select<TSource, TData, TK>(this AdjustmentWrapper<TSource, TData> c, TSource key, Expression<Func<TData, TK>> columns = null)
            where TData : new()
        {
            var colsList = columns == null ? null : LambdaHelpers.ExtractColumnsList(columns);
            var keysList = c.Configurator.ProducePrimaryKey(c.Configurator.Map(key));
            c.Select(new[] { keysList }, colsList);
            return c;
        }

        public static AdjustmentWrapper<TSource, TData> Unselect<TSource, TData, TK>(this AdjustmentWrapper<TSource, TData> c, TSource key, Expression<Func<TData, TK>> columns = null)
            where TData : new()
        {
            var colsList = columns == null ? null : LambdaHelpers.ExtractColumnsList(columns);
            var keysList = c.Configurator.ProducePrimaryKey(c.Configurator.Map(key));
            c.Unselect(new[] { keysList }, colsList);
            return c;
        }


        public static AdjustmentWrapper<TSource, TData> Select<TSource, TData, TK>(this AdjustmentWrapper<TSource, TData> c, TData key, Expression<Func<TData, TK>> columns = null)
            where TData : new()
        {
            c.Select(new[] { key }, columns);
            return c;
        }

        public static AdjustmentWrapper<TSource, TData> Unselect<TSource, TData, TK>(this AdjustmentWrapper<TSource, TData> c, TData key, Expression<Func<TData, TK>> columns = null)
            where TData : new()
        {
            c.Unselect(new[] { key }, columns);
            return c;
        }
    }
}
