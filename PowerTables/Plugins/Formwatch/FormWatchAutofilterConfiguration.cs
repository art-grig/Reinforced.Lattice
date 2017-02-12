using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Reinforced.Lattice.Plugins.Formwatch
{
    public class FormWatchAutofilterConfiguration<TCol, TForm>
    {
        private readonly FormwatchClientConfiguration _configuration;
        private readonly string _columnName;

        public FormWatchAutofilterConfiguration(FormwatchClientConfiguration configuration, string columnName)
        {
            _configuration = configuration;
            _columnName = columnName;
        }

        private void EnsureEntry()
        {
            if (_configuration.FiltersMappings.ContainsKey(_columnName)) return;
            _configuration.FiltersMappings[_columnName] = new FormWatchFilteringsMappings();
        }

        public void Update(FormWatchFilteringsMappings mappings)
        {
            _configuration.FiltersMappings[_columnName] = mappings;
        }

        /// <summary>
        /// This field will only affect client filtering
        /// </summary>
        /// <param name="only"></param>
        /// <returns></returns>
        public FormWatchAutofilterConfiguration<TCol, TForm> OnlyForClient(bool only = true)
        {
            EnsureEntry();
            _configuration.FiltersMappings[_columnName].ForClient = true;
            _configuration.FiltersMappings[_columnName].ForServer = false;
            return this;
        }

        /// <summary>
        /// This field will only affect server filtering
        /// </summary>
        /// <param name="only"></param>
        /// <returns></returns>
        public FormWatchAutofilterConfiguration<TCol, TForm> OnlyForServer(bool only = true)
        {
            EnsureEntry();
            _configuration.FiltersMappings[_columnName].ForClient = false;
            _configuration.FiltersMappings[_columnName].ForServer = true;
            return this;
        }
    }

    public static class FormWatchAutofilterExtensions
    {
        /// <summary>
        /// Filters specified target table field with form field treated as ValueFilter. 
        /// Warning! ValueFilter should be configured for column
        /// </summary>
        /// <param name="expr">Property expression</param>
        /// <param name="af">Filter</param>
        public static void FilterValueExpr<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, LambdaExpression expr)
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 0,
                FieldKeys = new[] { LambdaHelpers.ParsePropertyLambda(expr).Name }
            });
        }

        /// <summary>
        /// Filters specified target table field with form field treated as ValueFilter. 
        /// Warning! ValueFilter should be configured for column
        /// </summary>
        /// <param name="formField">Field where take value from</param>
        public static void FilterValue<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, TCol>> formField)
        {
            af.FilterValueExpr(formField);
        }

        /// <summary>
        /// Filters specified target table field with form field treated as ValueFilter. 
        /// Warning! ValueFilter should be configured for column
        /// </summary>
        /// <param name="formField">Field where take value from</param>
        public static void FilterValue<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, TCol?>> formField)
            where TCol : struct
        {
            af.FilterValueExpr(formField);
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! RangeFilter should be configured for column
        /// </summary>
        /// <param name="expr">Property expression</param>
        /// <param name="af">Filter</param>
        public static void FilterRangeExpr<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, LambdaExpression from, LambdaExpression to)
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 1,
                FieldKeys = new[] { LambdaHelpers.ParsePropertyLambda(from).Name,
                LambdaHelpers.ParsePropertyLambda(to).Name, }
            });
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! RangeFilter should be configured for column
        /// </summary>
        /// <param name="from">Field containig from value</param>
        /// <param name="to">Field containing to value</param>
        public static void FilterRange<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, TCol>> from, Expression<Func<TForm, TCol>> to)
        {
            FilterRangeExpr(af, from, to);
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! RangeFilter should be configured for column
        /// </summary>
        /// <param name="from">Field containig from value</param>
        /// <param name="to">Field containing to value</param>
        public static void FilterRange<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, TCol?>> from, Expression<Func<TForm, TCol?>> to)
            where TCol : struct
        {
            FilterRangeExpr(af, from, to);
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! RangeFilter should be configured for column
        /// </summary>
        /// <param name="from">Field containig from value</param>
        /// <param name="to">Field containing to value</param>
        public static void FilterRange<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, TCol>> from, Expression<Func<TForm, TCol?>> to)
            where TCol : struct
        {
            FilterRangeExpr(af, from, to);
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! RangeFilter should be configured for column
        /// </summary>
        /// <param name="from">Field containig from value</param>
        /// <param name="to">Field containing to value</param>
        public static void FilterRange<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, TCol?>> from, Expression<Func<TForm, TCol>> to)
            where TCol : struct
        {
            FilterRangeExpr(af, from, to);
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! RangeFilter should be configured for column
        /// </summary>
        /// <param name="from">Field containig from value</param>
        /// <param name="to">Field containing to value</param>
        public static void FilterRange<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, IEnumerable<TCol>>> values)
            where TCol : struct
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 1,
                FieldKeys = new[] { LambdaHelpers.ParsePropertyLambda(values).Name }
            });
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! RangeFilter should be configured for column
        /// </summary>
        /// <param name="from">Field containig from value</param>
        /// <param name="to">Field containing to value</param>
        public static void FilterRange<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, IEnumerable<TCol?>>> values)
            where TCol : struct
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 1,
                FieldKeys = new[] { LambdaHelpers.ParsePropertyLambda(values).Name }
            });
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! SelectFilter with multiple options should be configured for column
        /// </summary>
        /// <param name="fields">Fields that will be merged into multiple filter values</param>
        public static void FilterMultipleExpr<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, params LambdaExpression[] fields)
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 2,
                FieldKeys = fields.Select(c => LambdaHelpers.ParsePropertyLambda(c).Name).ToArray()
            });
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! SelectFilter with multiple options should be configured for column
        /// </summary>
        /// <param name="fields">Fields that will be merged into multiple filter values</param>
        public static void FilterMultiple<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, params Expression<Func<TForm, TCol>>[] fields)
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 2,
                FieldKeys = fields.Select(c => LambdaHelpers.ParsePropertyLambda(c).Name).ToArray()
            });
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// Warning! SelectFilter with multiple options should be configured for column
        /// </summary>
        /// <param name="fields">Fields that will be merged into multiple filter values</param>
        public static void FilterMultiple<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, params Expression<Func<TForm, TCol?>>[] fields)
            where TCol : struct
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 2,
                FieldKeys = fields.Select(c => LambdaHelpers.ParsePropertyLambda(c).Name).ToArray()
            });
        }
        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// In this case field is list or array (e.g. mapped to multiple select)
        /// Warning! SelectFilter with multiple options should be configured for column
        /// </summary>
        /// <param name="field">Fields that will be merged into multiple filter values</param>
        public static void FilterMultiple<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, IEnumerable<TCol>>> field)
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 2,
                FieldKeys = new []{LambdaHelpers.ParsePropertyLambda(field).Name}
            });
        }

        /// <summary>
        /// Filters specified target table field with form field treated as Range Filter. 
        /// In this case field is list or array (e.g. mapped to multiple select)
        /// Warning! SelectFilter with multiple options should be configured for column
        /// </summary>
        /// <param name="field">Fields that will be merged into multiple filter values</param>
        public static void FilterMultiple<TCol, TForm>(this FormWatchAutofilterConfiguration<TCol, TForm> af, Expression<Func<TForm, IEnumerable<TCol?>>> field)
            where TCol : struct
        {
            af.Update(new FormWatchFilteringsMappings()
            {
                FilterType = 2,
                FieldKeys = new[] { LambdaHelpers.ParsePropertyLambda(field).Name }
            });
        }
        
    }
}
