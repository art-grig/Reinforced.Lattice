using System;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using PowerTables.Adjustments;
using PowerTables.Commands;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Editing;
using PowerTables.Editing.Cells;
using PowerTables.Editing.Editors.Check;
using PowerTables.Editing.Editors.Display;
using PowerTables.Editing.Editors.Memo;
using PowerTables.Editing.Editors.PlainText;
using PowerTables.Editing.Editors.SelectList;
using PowerTables.Editing.Form;
using PowerTables.Editing.Rows;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.Hideout;
using PowerTables.Plugins.Hierarchy;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.LoadingOverlap;
using PowerTables.Plugins.MouseSelect;
using PowerTables.Plugins.Ordering;
using PowerTables.Plugins.Paging;
using PowerTables.Plugins.RegularSelect;
using PowerTables.Plugins.Reload;
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
                .WithProperty(c => c.CallbackFunction, c => c.Type("(table:IMasterTable) => void"))
                .WithProperty(c => c.TemplateSelector, c => c.Type("(row:IRow)=>string"))
                .WithProperty(c => c.MessageFunction, c => c.Type("(msg: ITableMessage) => void"))
                .WithProperty(c => c.QueryConfirmation, c => c.Type("(query:IPowerTableRequest,scope:QueryScope,continueFn:any) => void"))
                ;
            builder.ExportAsInterface<DatepickerOptions>()
                .WithProperty(c => c.CreateDatePicker, c => c.Type("(element:HTMLElement, isNullableDate: boolean) => void"))
                .WithProperty(c => c.PutToDatePicker, c => c.Type("(element:HTMLElement, date?:Date) => void"))
                .WithProperty(c => c.GetFromDatePicker, c => c.Type("(element:HTMLElement) => Date"))
                .WithProperty(c => c.DestroyDatepicker, c => c.Type("(element:HTMLElement) => void"))
                .OverrideNamespace("PowerTables")
                ;
            builder.ExportAsInterface<CoreTemplateIds>().WithPublicProperties().OverrideNamespace("PowerTables");
            builder.ExportAsInterface<TableMessage>().WithPublicProperties().OverrideNamespace("PowerTables").WithProperty(c => c.IsMessage, c => c.Ignore());
            builder.ExportAsEnum<MessageType>().OverrideNamespace("PowerTables");

            builder.ExportAsInterface<ColumnConfiguration>()
                .WithPublicProperties()
                .WithProperty(c => c.CellRenderingValueFunction, c => c.Type("(a:any) => string"))
                .WithProperty(c => c.ClientValueFunction, c => c.Type("(a:any) => any"))
                .WithProperty(c => c.Meta, v => v.ForceNullable(true))
                .WithProperty(c => c.TemplateSelector, c => c.Type("(cell:ICell)=>string"))
                ;

            builder.ExportAsInterface<PluginConfiguration>().WithPublicProperties();
            //builder.ExportAsInterface<CheckboxifyClientConfig>().WithPublicProperties()
            //    .WithProperty(c => c.CanSelectFunction, c => c.Type("(v:any)=>boolean"));

            //builder.ExportAsInterface<SelectionAdditionalData>().WithPublicProperties();

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
                .WithProperty(c => c.ClientCalculators, c => c.Type("{ [key:string] : (data:IClientDataResults) => any }"))
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

            builder.ExportAsInterface<EditFieldUiConfigBase>().WithPublicProperties();
            builder.ExportAsInterface<EditFormUiConfigBase>().WithPublicProperties();
            builder.ExportAsInterface<CellsEditUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<FormEditUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<RowsEditUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<DisplayingEditorUiConfig>().WithPublicProperties()
                .WithProperty(c => c.Template, c => c.Type("(cell:ICell) => string"));



            builder.ExportAsInterface<SelectListEditorUiConfig>().WithPublicProperties()
                .WithProperty(c => c.MissingValueFunction, a => a.Type("(a:any)=>any"))
                .WithProperty(c => c.MissingKeyFunction, a => a.Type("(a:any)=>any"))
                ;
            builder.ExportAsInterface<MemoEditorUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<TableAdjustment>().WithAllProperties();
            builder.ExportAsInterface<CheckEditorUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<PlainTextEditorUiConfig>()
                .WithPublicProperties()
                .WithProperty(c => c.FormatFunction, c => c.Type("(value:any,column:IColumn) => string"))
                .WithProperty(c => c.ParseFunction, c => c.Type("(value:string,column:IColumn,errors:PowerTables.Editing.IValidationMessage[]) => any"))
                ;

            builder.ExportAsInterface<LoadingOverlapUiConfig>().WithPublicProperties();
            builder.ExportAsEnums(new[] { typeof(OverlapMode) });

            builder.ExportAsInterface<ReloadUiConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<ConfiguredSubscriptionInfo>()
                .WithPublicProperties()
                .WithProperty(c => c.Handler, c => c.Type("(dataObject:any, originalEvent:any) => void"));

            builder.ExportAsInterface<HierarchyUiConfiguration>().WithPublicProperties();
            builder.ExportAsEnums(new[] { typeof(NodeExpandBehavior), typeof(TreeCollapsedNodeFilterBehavior) });


            builder.ExportAsInterface<MouseSelectUiConfig>();
            builder.ExportAsInterface<CheckboxifyUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<SelectionConfiguration>()
                .WithPublicProperties()
                .WithProperty(c => c.CanSelectRowFunction, c => c.Type("(dataObject:any)=>boolean"))
                .WithProperty(c => c.CanSelectCellFunction, c => c.Type("(dataObject:any,column:string,select:boolean)=>boolean"))
                ;
            builder.ExportAsInterface<SelectionAdditionalData>().WithPublicProperties();
            builder.ExportAsEnum<SelectionToggle>();

            builder.ExportAsEnum<PowerTables.Configuration.Json.SelectAllBehavior>();
            builder.ExportAsEnum<PowerTables.Configuration.Json.ResetSelectionBehavior>();


            builder.ExportAsInterface<RegularSelectUiConfig>().WithPublicProperties();
            builder.ExportAsEnum<RegularSelectMode>();

            builder.ExportAsEnum<CommandType>();
            builder.ExportAsInterface<CommandDescription>()
                .WithPublicProperties()
                .WithProperty(c => c.CanExecute, x => x.Type("(dataObject:any)=>boolean"))
                .WithProperty(x => x.ClientFunction, x => x.Type("(param:ICommandExecutionParameters)=>any"))
                ;

            builder.ExportAsInterface<ConfirmationConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<CommandAutoformConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<DetailLoadingConfiguration>()
                .WithPublicProperties()
                .WithProperty(x => x.ValidateToLoad, x => x.Type("(param:ICommandExecutionParameters)=>boolean"));
        }

    }
}
