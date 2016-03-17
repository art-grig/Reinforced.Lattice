using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Filters.Range
{
    /// <summary>
    /// Range column filter supports 2 values (min. and max.) to be specified.
    /// This filter filters out source query leaving records that are having value denoted by column that is in specified range (between min. and max.)
    /// UI frontend for this filter (by default) is 2 text inputs specifying min and max value. 
    /// See <see cref="RangeFilterExtensions"/>
    /// </summary>
    /// <typeparam name="TSourceData"></typeparam>
    /// <typeparam name="TVal"></typeparam>
    public class RangeColumnFilter<TSourceData, TVal> : ColumnFilterBase<TSourceData, RangeTuple<TVal>>
    {
        private readonly LambdaExpression _sourceExpression;
        private bool _inclusive;

        /// <summary>
        /// Filter client configuration for internal purposes
        /// </summary>
        internal RangeFilterClientConfig ClientConfig { get; set; }

        protected RangeColumnFilter(string columnName, IConfigurator conf, LambdaExpression sourceExpression)
            : base(columnName, conf)
        {
            _sourceExpression = sourceExpression;
            FilterFunction = DefaultFilter;
            ParseFunction = Parse;
        }

        protected RangeColumnFilter(string columnName, IConfigurator conf, Func<IQueryable<TSourceData>, RangeTuple<TVal>, IQueryable<TSourceData>> filterDelegate)
            : base(columnName, conf)
        {
            FilterFunction = filterDelegate;
            ParseFunction = Parse;
        }

        protected override RangeTuple<TVal> Parse(string filterArgument)
        {
            var range = new RangeTuple<TVal>();
            string[] values = filterArgument.Split('|');
            if (values.Length == 0) return range;
            if (!string.IsNullOrEmpty(values[0]))
            {
                range.From = ValueConverter.Convert<TVal>(values[0], Configurator);
                range.HasFrom = true;
            }
            if (values.Length > 1)
            {
                if (!string.IsNullOrEmpty(values[1]))
                {
                    range.To = ValueConverter.Convert<TVal>(values[1], Configurator);
                    range.HasTo = true;
                }
            }
            return range;
        }

        protected override IQueryable<TSourceData> DefaultFilter(IQueryable<TSourceData> source, RangeTuple<TVal> key)
        {
            if (_sourceExpression == null) throw new Exception("Trying to call FilterDelegate with null source expression");
            if (key.HasTo && key.HasFrom)
            {
                var between = LambdaHelpers.BetweenLambdaExpression(_sourceExpression, key.From, key.To, _inclusive);
                return ReflectionCache.CallWhere(source, between);
            }
            if (key.HasTo)
            {
                ExpressionType lt = _inclusive ? ExpressionType.LessThanOrEqual : ExpressionType.LessThan;
                var less = LambdaHelpers.BinaryLambdaExpression(lt, _sourceExpression, key.To);
                return ReflectionCache.CallWhere(source, less);
            }
            if (key.HasFrom)
            {
                ExpressionType gt = _inclusive ? ExpressionType.GreaterThanOrEqual : ExpressionType.GreaterThan;
                var greater = LambdaHelpers.BinaryLambdaExpression(gt, _sourceExpression, key.From);
                return ReflectionCache.CallWhere(source, greater);
            }
            return source;
        }

        public RangeColumnFilter<TSourceData, TVal> Inclusive(bool inclusive)
        {
            _inclusive = inclusive;
            return this;
        }

        public static RangeColumnFilter<TSourceData, TVal> Create<TSourceColumn>(PropertyInfo columnProp, IConfigurator conf,
            Expression<Func<TSourceData, TSourceColumn>> column)
        {
            columnProp = conf.CheckTableColum(columnProp);
            var ex = LambdaHelpers.FixNullableColumn(column);
            var instance = new RangeColumnFilter<TSourceData, TVal>(columnProp.Name, conf, ex);
            return instance;
        }

        public static RangeColumnFilter<TSourceData, TVal> Create(PropertyInfo columnProp, IConfigurator conf, Func<IQueryable<TSourceData>, RangeTuple<TVal>, IQueryable<TSourceData>> filterDelegate)
        {
            columnProp = conf.CheckTableColum(columnProp);
            var instance = new RangeColumnFilter<TSourceData, TVal>(columnProp.Name, conf, filterDelegate);
            return instance;
        }
    }
}
