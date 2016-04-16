using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Editors;
using PowerTables.Editors.Check;
using PowerTables.Editors.Memo;
using PowerTables.Editors.PlainText;
using PowerTables.Editors.SelectList;
using PowerTables.Filters;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.Hideout;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.LoadingOverlap;
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
                .WithPublicProperties();
            builder.ExportAsInterface<DatepickerOptions>()
                .WithProperty(c => c.CreateDatePicker, c => c.Type("(element:HTMLElement, isNullableDate: boolean) => void"))
                .WithProperty(c => c.PutToDatePicker, c => c.Type("(element:HTMLElement, date?:Date) => void"))
                .WithProperty(c => c.GetFromDatePicker, c => c.Type("(element:HTMLElement) => Date"))
                .OverrideNamespace("PowerTables")
                ;
            builder.ExportAsInterface<CoreTemplateIds>().WithPublicProperties().OverrideNamespace("PowerTables");
            builder.ExportAsInterface<ColumnConfiguration>()
                .WithPublicProperties()
                .WithProperty(c => c.CellRenderingValueFunction, c => c.Type("(a:any) => string"))
                ;

            builder.ExportAsInterface<PluginConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<CheckboxifyClientConfig>().WithPublicProperties();
            builder.ExportAsInterface<FormwatchClientConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<FormwatchFieldData>().WithPublicProperties()
                .WithProperty(c => c.FieldValueFunction, a => a.Type<Func<object>>())
                .WithProperty(c => c.Key, a => a.Ignore())
                ;
            builder.ExportAsInterface<FormWatchFilteringsMappings>().WithAllProperties();

            builder.ExportAsInterface<HideoutPluginConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<RangeFilterUiConfig>().WithPublicProperties().WithProperty(c => c.ClientFilteringFunction, c => c.Type("(object: any, fromValue:string, toValue:string, query: IQuery)=>boolean"));
            builder.ExportAsInterface<ValueFilterUiConfig>().WithPublicProperties().WithProperty(c => c.ClientFilteringFunction, c => c.Type("(object: any, filterValue:string, query: IQuery)=>boolean"));
            builder.ExportAsInterface<ResponseInfoClientConfiguration>().WithPublicProperties()
                .WithProperty(c => c.ClientEvaluationFunction, c => c.Type("(data:IClientDataResults, currentPage:number, totalPages:number) => any"))
                .WithProperty(c => c.ClientTemplateFunction, c => c.Type("(data:any) => string"))

                ;
            builder.ExportAsInterface<SelectListItem>()
                .WithPublicProperties()
                .WithProperty(c => c.Group, c => c.Ignore());


            builder.ExportAsInterface<SelectFilterUiConfig>().WithPublicProperties().WithProperty(c => c.ClientFilteringFunction, c => c.Type("(object: any, selectedValues:string[], query: IQuery)=>boolean"));

            builder.ExportAsInterface<LimitClientConfiguration>()
                .WithPublicProperties();

            builder.ExportAsInterface<OrderingConfiguration>()
                .WithPublicProperties()
                .WithProperty(c => c.ClientSortableColumns, a => a.Type("{[key:string]:(a:any,b:any) => number}"));

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
                .WithProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
                .WithProperty(c => c.CommandCallbackFunction,
                    c => c.Type("(table:any /*PowerTables.PowerTable*/,response:IPowerTablesResponse)=>void"))
                .WithProperty(c => c.ConfirmationFunction,
                    c => c.Type("(continuation:(queryModifier?:(a:IQuery)=>void)=>void)=>void"))
                .WithProperty(c => c.OnClick,
                    c => c.Type("(table:any /*PowerTables.PowerTable*/,menuElement:any)=>void"));

            builder.ExportAsInterface<TotalResponse>().WithPublicProperties();
            builder.ExportAsInterface<TotalClientConfiguration>().WithPublicProperties()
                .WithProperty(c => c.ColumnsValueFunctions, c => c.Type("{ [key:string] : (a:any)=>string }"))
                .WithProperty(c => c.ColumnsCalculatorFunctions, c => c.Type("{ [key:string] : (data:IClientDataResults) => any }"));

            builder.ExportAsInterface<CellEditorUiConfigBase>().WithPublicProperties();
            builder.ExportAsInterface<EditorUiConfig>().WithPublicProperties().WithProperty(c => c.IntegrityCheckFunction, c => c.Type("(dataObject:any)=>boolean"));
            builder.ExportAsInterface<SelectListEditorUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<MemoEditorUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<CheckEditorUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<PlainTextEditorUiConfig>()
                .WithPublicProperties()
                .WithProperty(c => c.FormatFunction, c => c.Type("(value:any,column:IColumn) => string"))
                .WithProperty(c => c.ParseFunction, c => c.Type("(value:string,column:IColumn,errors:PowerTables.Plugins.IValidationMessage[]) => any"))
                ;

            builder.ExportAsInterface<LoadingOverlapUiConfig>().WithPublicProperties();
            builder.ExportAsEnums(new[] { typeof(OverlapMode) });


            builder.ExportAsEnums(new[] { typeof(EditorRefreshMode) });
        }

    }
}
