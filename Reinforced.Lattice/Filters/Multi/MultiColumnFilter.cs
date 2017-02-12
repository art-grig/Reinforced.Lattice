using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.Filters.Multi
{
    /// <summary>
    /// Column multi-filter supports specifying several fintering values. These values should be separated by "|" (pipeline) symbol.
    /// This filter filters out source query leaving records that are having value denoted by column that is one of specified values. (OR) filter
    /// UI frontend for this filter (by default) is multi-select list. 
    /// See <see cref="MultiFilterExtensions"/>
    /// </summary>
    /// <typeparam name="TSourceData"></typeparam>
    /// <typeparam name="TVal"></typeparam>
    public class MultiColumnFilter<TSourceData, TVal> : ColumnFilterBase<TSourceData, IEnumerable<TVal>>
    {
        private readonly LambdaExpression _sourceExpression;

        protected MultiColumnFilter(string columnName, IConfigurator conf, LambdaExpression sourceExpression)
            : base(columnName, conf)
        {
            _sourceExpression = sourceExpression;
            ParseFunction = Parse;
            FilterFunction = DefaultFilter;
        }

        protected MultiColumnFilter(string columnName, IConfigurator conf, Func<IQueryable<TSourceData>, IEnumerable<TVal>, IQueryable<TSourceData>> filterDelegate)
            : base(columnName, conf)
        {
            FilterFunction = filterDelegate;
            ParseFunction = Parse;
        }

        protected override IEnumerable<TVal> Parse(string filterArgument)
        {
            string[] filterArguments = filterArgument.Split('|');

            return filterArguments.Select(ValueConverter.Convert<TVal>).ToList();
        }

        protected override IQueryable<TSourceData> DefaultFilter(IQueryable<TSourceData> source, IEnumerable<TVal> key)
        {
            var anyNulls = key.Any(c => c == null);

            var expr = ReflectionCache.CallContainsMethod(key.ToArray(), _sourceExpression);
            if (anyNulls)
            {
                var nullcmp = LambdaHelpers.ConstantBinaryLambdaExpression(ExpressionType.Equal, _sourceExpression, null);
                expr = LambdaHelpers.BinaryLambdaExpression(ExpressionType.Or, expr, nullcmp);
            }
            return ReflectionCache.CallWhere(source, expr);
        }

        public static MultiColumnFilter<TSourceData, TVal> Create<TSourceColumn>(PropertyDescription columnProp, IConfigurator conf,
            Expression<Func<TSourceData, TSourceColumn>> column)
        {
            columnProp = conf.CheckTableColum(columnProp);
            var ex = column; //LambdaHelpers.FixNullableColumn(column);
            var instance = new MultiColumnFilter<TSourceData, TVal>(columnProp.Name, conf, ex);
            return instance;
        }

        public static MultiColumnFilter<TSourceData, TVal> Create(PropertyDescription columnProp, IConfigurator conf, Func<IQueryable<TSourceData>, IEnumerable<TVal>, IQueryable<TSourceData>> filterDelegate)
        {
            columnProp = conf.CheckTableColum(columnProp);
            var instance = new MultiColumnFilter<TSourceData, TVal>(columnProp.Name, conf, filterDelegate);
            return instance;
        }
    }
}
