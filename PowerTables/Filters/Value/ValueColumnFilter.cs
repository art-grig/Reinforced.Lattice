using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using PowerTables.Configuration;

namespace PowerTables.Filters.Value
{
    /// <summary>
    /// Value column filter supports specifying only one value
    /// This filter filters out source query leaving records that are having value denoted by column that is equal to specified value in filter.
    /// UI frontend for this filter (by default) is textbox field. 
    /// See <see cref="ValueFilterExtensions"/>
    /// </summary>
    public class ValueColumnFilter<TSourceData, TFilteringKey> : ColumnFilterBase<TSourceData, TFilteringKey>
    {
        /// <summary>
        /// Filter client configuration for internal purposes
        /// </summary>
        internal object ClientConfig { get; set; }

        protected ValueColumnFilter(string columnName, IConfigurator conf, LambdaExpression sourceColumn)
            : base(columnName, conf)
        {
            _sourceExpression = sourceColumn;
            FilterFunction = DefaultFilter;
            ParseFunction = Parse;
        }
        protected ValueColumnFilter(string columnName, IConfigurator conf, Func<IQueryable<TSourceData>, TFilteringKey, IQueryable<TSourceData>> filterDelegate)
            : base(columnName, conf)
        {
            FilterFunction = filterDelegate;
            ParseFunction = Parse;
        }

        private readonly LambdaExpression _sourceExpression;

        protected override IQueryable<TSourceData> DefaultFilter(IQueryable<TSourceData> source, TFilteringKey key)
        {
            var lambda = LambdaHelpers.BinaryLambdaExpression(ExpressionType.Equal, _sourceExpression, key);
            return ReflectionCache.CallWhere(source, lambda);
        }

        protected override TFilteringKey Parse(string filterArgument)
        {
            return ValueConverter.Convert<TFilteringKey>(filterArgument, Configurator);
        }

        public static ValueColumnFilter<TSourceData, TFilteringKey> Create<TSourceColumn>(PropertyInfo columnProp, IConfigurator conf,
            Expression<Func<TSourceData, TSourceColumn>> column)
        {
            columnProp = conf.CheckTableColum(columnProp);
            var ex = LambdaHelpers.FixNullableColumn(column);
            var instance = new ValueColumnFilter<TSourceData, TFilteringKey>(columnProp.Name, conf, ex);
            return instance;
        }

        public static ValueColumnFilter<TSourceData, TFilteringKey> Create(PropertyInfo columnProp, IConfigurator conf, Func<IQueryable<TSourceData>, TFilteringKey, IQueryable<TSourceData>> filterDelegate)
        {
            columnProp = conf.CheckTableColum(columnProp);
            var instance = new ValueColumnFilter<TSourceData, TFilteringKey>(columnProp.Name, conf, filterDelegate);
            return instance;
        }
    }
}
