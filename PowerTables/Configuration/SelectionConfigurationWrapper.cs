using System;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;
using PowerTables.CellTemplating;
using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
{
    public class SelectionConfigurationWrapper
    {
        public SelectionConfigurationWrapper(SelectionConfiguration configuration)
        {
            Configuration = configuration;
        }

        internal SelectionConfiguration Configuration { get; private set; }
    }

    public class GenericSelectionConfigurationWrapper<T> : SelectionConfigurationWrapper
    {
        public GenericSelectionConfigurationWrapper(SelectionConfiguration configuration) : base(configuration)
        {
        }
    }

    public static class SelectionConfigurationExtensions
    {
        public static SelectionConfigurationWrapper NonSelectableColumns(this SelectionConfigurationWrapper c, string[] columns)
        {
            c.Configuration.NonselectableColumns = columns;
            return c;
        }

        public static GenericSelectionConfigurationWrapper<T> NonSelectableColumns<T, T2>(this GenericSelectionConfigurationWrapper<T> c, Expression<Func<T, T2>> columns)
        {
            c.Configuration.NonselectableColumns = LambdaHelpers.ExtractColumnsList(columns);
            return c;
        }

        public static SelectionConfigurationWrapper SelectSingle(this SelectionConfigurationWrapper c, bool single = true)
        {
            c.Configuration.SelectSingle = single;
            if (single)
            {
                c.Configuration.SelectAllBehavior = Json.SelectAllBehavior.Disabled;
            }
            return c;
        }


        public static SelectionConfigurationWrapper CanSelectRowExpression(this SelectionConfigurationWrapper c, string expression)
        {
            var ex = Template.CompileExpression(expression,"x",string.Empty,string.Empty);
            c.Configuration.CanSelectRowFunction = new JRaw(string.Format("function(x) {{ return {0}; }}", ex));
            return c;
        }

        public static SelectionConfigurationWrapper CanSelectRowFunction(this SelectionConfigurationWrapper c, string function)
        {
            c.Configuration.CanSelectRowFunction = new JRaw(function);
            return c;
        }


        public static SelectionConfigurationWrapper CanSelectCellExpression(this SelectionConfigurationWrapper c, string expression)
        {
            var ex = Template.CompileExpression(expression, "x", string.Empty, string.Empty);
            c.Configuration.CanSelectCellFunction = new JRaw(string.Format("function(x) {{ return {0}; }}", ex));
            return c;
        }

        public static SelectionConfigurationWrapper CanSelectCellFunction(this SelectionConfigurationWrapper c, string function)
        {
            c.Configuration.CanSelectRowFunction = new JRaw(function);
            return c;
        }

        public static SelectionConfigurationWrapper SelectAllBehavior(this SelectionConfigurationWrapper c, SelectAllBehavior sab)
        {
            c.Configuration.SelectAllBehavior = sab;
            return c;
        }

        public static SelectionConfigurationWrapper ResetSelectionOn(this SelectionConfigurationWrapper c,
            ResetSelectionBehavior rb)
        {
            c.Configuration.ResetSelectionBehavior = rb;
            return c;
        }
    }
}
