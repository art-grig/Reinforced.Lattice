using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Configuration.Json;
using PowerTables.Filters;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.Hideout;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.Ordering;
using PowerTables.Plugins.Paging;
using PowerTables.Plugins.ResponseInfo;
using PowerTables.Plugins.Toolbar;
using PowerTables.Plugins.Total;
using Reinforced.Typings.Fluent;

namespace PowerTables.Typings
{
    public class TypingsConfiguration
    {
        public static void ConfigureTypings(ConfigurationBuilder builder)
        {
            builder.TryLookupDocumentationForAssembly(typeof(TableConfiguration).Assembly);
            var infrastructureTypes =
                typeof(TypingsConfiguration).Assembly.GetTypes()
                    .Where(c => c.Namespace.Contains("PowerTables.Typings.Infrastructure"));


            builder.ExportAsInterfaces(infrastructureTypes, a => 
                a.WithPublicProperties().WithPublicMethods(c => c.CamelCase()).OverrideNamespace("PowerTables"));


            builder.ExportAsInterface<TableConfiguration>()
                .WithPublicProperties()
                .WithProperty(c => c.DatePickerFunction, c => c.Type("(e:any, format:string) => void"))
                ;


            builder.ExportAsInterface<ColumnConfiguration>()
                .WithPublicProperties()
                .WithProperty(c => c.CellRenderingValueFunction, c => c.Type("(a:any) => string"))
                ;

            builder.ExportAsInterface<ColumnFilterConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<PluginConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<CheckboxifyClientConfig>().WithPublicProperties();
            builder.ExportAsEnum<SelectAllLocation>();
            builder.ExportAsInterface<FormwatchClientConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<FormwatchFieldData>().WithPublicProperties()
                .WithProperty(c => c.FieldValueFunction, a => a.Type<Func<object>>())
                .WithProperty(c => c.Key, a => a.Ignore());
            builder.ExportAsInterface<HideoutCellConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<HideoutClientConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<RangeFilterClientConfig>().WithPublicProperties();
            builder.ExportAsInterface<ValueFilterClientConfig>().WithPublicProperties();
            builder.ExportAsInterface<ResponseInfoClientConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<SelectListItem>()
                .WithPublicProperties()
                .WithProperty(c=>c.Group,c=>c.Ignore()); //todo use mvc

            builder.ExportAsInterface<SelectFilterClientConfig>().WithPublicProperties();

            builder.ExportAsInterface<LimitClientConfiguration>()
                .WithPublicProperties();

            builder.ExportAsInterface<OrderableConfiguration>()
                .WithPublicProperties()
                .WithProperty(c => c.DefaultOrdering, c => c.Type("PowerTables.Ordering"));

            builder.ExportAsInterface<PagingClientConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<PowerTablesResponse>()
                .WithPublicProperties()
                .WithMethod(c => c.FormatException(null), c => c.Ignore());

            builder.ExportAsInterface<PowerTableRequest>().WithPublicProperties()

                .WithProperty(c => c.Configurator, c => c.Ignore())
                .WithProperty(c => c.IsDeferred, c => c.Ignore())
                ;

            builder.ExportAsInterface<Query>().WithPublicProperties();
            builder.ExportAsInterface<Paging>().WithPublicProperties();
            builder.ExportAsEnum<Ordering>();

            builder.ExportAsInterface<ToolbarButtonsClientConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<ToolbarButtonClientConfiguration>()
                .WithPublicProperties()
                .WithProperty(c => c.CommandCallbackFunction,
                    c => c.Type("(table:any /*PowerTables.PowerTable*/,response:IPowerTablesResponse)=>void"))
                .WithProperty(c => c.ConfirmationFunction,
                    c => c.Type("(continuation:(queryModifier?:(a:IQuery)=>void)=>void)=>void"))
                .WithProperty(c => c.OnClick,
                    c => c.Type("(table:any /*PowerTables.PowerTable*/,menuElement:any)=>void"));

            builder.ExportAsInterface<TotalResponse>().WithPublicProperties();
            builder.ExportAsInterface<TotalClientConfiguration>().WithPublicProperties()
                .WithProperty(c => c.ColumnsValueFunctions, c => c.Type("{ [key:string] : (a:any)=>string }"));



        }

    }
}
