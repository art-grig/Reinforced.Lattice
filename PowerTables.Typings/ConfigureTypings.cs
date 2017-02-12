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
using PowerTables.Plugins.Scrollbar;
using PowerTables.Plugins.Toolbar;
using PowerTables.Plugins.Total;
using PowerTables.Templating.BuiltIn;
using Reinforced.Typings.Fluent;

namespace PowerTables.Typings
{
    public class TypingsConfiguration
    {
        public static void ConfigureTypings(ConfigurationBuilder builder)
        {
            builder.TryLookupDocumentationForAssembly(typeof(TableConfiguration).Assembly);
           
            builder.ExportAsInterface<TableConfiguration>()
                .OverrideNamespace("PowerTables")
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
                .OverrideNamespace("PowerTables")
                .WithPublicProperties()
                .WithProperty(c => c.CellRenderingValueFunction, c => c.Type("(a:any) => string"))
                .WithProperty(c => c.ClientValueFunction, c => c.Type("(a:any) => any"))
                .WithProperty(c => c.Meta, v => v.ForceNullable(true))
                .WithProperty(c => c.TemplateSelector, c => c.Type("(cell:ICell)=>string"))
                ;

            builder.ExportAsInterface<PluginConfiguration>().OverrideNamespace("PowerTables").WithPublicProperties();

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
            builder.ExportAsInterface<LatticeResponse>()
                .WithPublicProperties()
                .WithMethod(c => c.FormatException(null), c => c.Ignore());

            builder.ExportAsInterface<LatticeRequest>().WithPublicProperties()

                .WithProperty(c => c.Configurator, c => c.Ignore())
                .WithProperty(c => c.IsDeferred, c => c.Ignore())
                ;

            builder.ExportAsInterface<Query>().OverrideNamespace("PowerTables").WithPublicProperties()
                .WithProperty(c => c.Partition, x => x.ForceNullable(true));
            builder.ExportAsInterface<Partition>().OverrideNamespace("PowerTables").WithPublicProperties();
            builder.ExportAsEnum<Ordering>().OverrideNamespace("PowerTables");

            #region Toolbar
            builder.ExportAsInterface<ToolbarButtonsClientConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<ToolbarButtonClientConfiguration>()
                .WithProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
                .WithProperty(c => c.OnClick,
                    c => c.Type("(table:any /*PowerTables.PowerTable*/,menuElement:any)=>void"));
            #endregion

            #region Totals

            builder.ExportAsInterface<TotalResponse>().WithPublicProperties();
            builder.ExportAsInterface<TotalClientConfiguration>().WithPublicProperties()
                .WithProperty(c => c.ColumnsValueFunctions, c => c.Type("{ [key:string] : (a:any)=>string }"))
                .WithProperty(c => c.ColumnsCalculatorFunctions, c => c.Type("{ [key:string] : (data:IClientDataResults) => any }"));


            #endregion

            #region Edit core
            builder.ExportAsInterface<EditFieldUiConfigBase>().WithPublicProperties();
            builder.ExportAsInterface<EditFormUiConfigBase>().WithPublicProperties();
            builder.ExportAsInterface<CellsEditUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<FormEditUiConfig>().WithPublicProperties();
            builder.ExportAsInterface<RowsEditUiConfig>().WithPublicProperties();
            #endregion

            #region Editors
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

            #endregion

            #region Loading overlap
            builder.ExportAsInterface<LoadingOverlapUiConfig>().WithPublicProperties();
            builder.ExportAsEnums(new[] { typeof(OverlapMode) });
            #endregion


            builder.ExportAsInterface<ReloadUiConfiguration>().WithPublicProperties();

            builder.ExportAsInterface<ConfiguredSubscriptionInfo>().OverrideNamespace("PowerTables")
                .WithPublicProperties()
                .WithProperty(c => c.Handler, c => c.Type("(dataObject:any, originalEvent:any) => void"));

            builder.ExportAsInterface<HierarchyUiConfiguration>().WithPublicProperties();
            builder.ExportAsEnums(new[] { typeof(NodeExpandBehavior), typeof(TreeCollapsedNodeFilterBehavior) });


            builder.ExportAsInterface<MouseSelectUiConfig>();
            builder.ExportAsInterface<CheckboxifyUiConfig>().WithPublicProperties();

            #region Selection

            builder.ExportAsInterface<SelectionConfiguration>()
                .OverrideNamespace("PowerTables")
                .WithPublicProperties()
                .WithProperty(c => c.CanSelectRowFunction, c => c.Type("(dataObject:any)=>boolean"))
                .WithProperty(c => c.CanSelectCellFunction, c => c.Type("(dataObject:any,column:string,select:boolean)=>boolean"))
                ;
            builder.ExportAsInterface<SelectionAdditionalData>().WithPublicProperties().OverrideNamespace("PowerTables.Adjustments");
            builder.ExportAsInterface<ReloadAdditionalData>().WithPublicProperties().OverrideNamespace("PowerTables.Adjustments");
            builder.ExportAsEnum<SelectionToggle>().OverrideNamespace("PowerTables.Adjustments");

            builder.ExportAsEnum<PowerTables.Configuration.Json.SelectAllBehavior>().OverrideNamespace("PowerTables");
            builder.ExportAsEnum<PowerTables.Configuration.Json.ResetSelectionBehavior>().OverrideNamespace("PowerTables");

            #endregion

            builder.ExportAsInterface<RegularSelectUiConfig>().WithPublicProperties();
            builder.ExportAsEnum<RegularSelectMode>();

            #region Commands

            builder.ExportAsEnum<CommandType>();
            builder.ExportAsInterface<CommandDescription>()
                .WithPublicProperties()
                .WithProperty(c => c.CanExecute, x => x.Type("(data:{Subject:any,Master:IMasterTable})=>boolean"))

                .WithProperty(c => c.OnSuccess, x => x.Type("(param:ICommandExecutionParameters)=>void"))
                .WithProperty(c => c.OnFailure, x => x.Type("(param:ICommandExecutionParameters)=>void"))
                .WithProperty(c => c.OnBeforeExecute, x => x.Type("(param:ICommandExecutionParameters)=>any"))
                .WithProperty(x => x.ClientFunction, x => x.Type("(param:ICommandExecutionParameters)=>any"))
                .WithProperty(x => x.ConfirmationDataFunction, x => x.Type("(param:ICommandExecutionParameters)=>any"))
                ;

            builder.ExportAsInterface<ConfirmationConfiguration>().WithPublicProperties()
                .WithProperty(x => x.InitConfirmationObject, x => x.Type("(confirmationObject:any,param:ICommandExecutionParameters)=>void"))
                .WithProperty(x => x.ContentLoadingUrl, x => x.Type("(subject:any)=>string"))
                .WithProperty(c => c.OnCommit, x => x.Type("(param:ICommandExecutionParameters)=>void"))
                .WithProperty(c => c.OnDismiss, x => x.Type("(param:ICommandExecutionParameters)=>void"))
                .WithProperty(c => c.OnContentLoaded, x => x.Type("(param:ICommandExecutionParameters)=>void"))
                .WithProperty(c => c.OnDetailsLoaded, x => x.Type("(param:ICommandExecutionParameters)=>void"))
                .WithProperty(c => c.TemplatePieces, x => x.Type("{[_:string]:(param:ICommandExecutionParameters)=>string}"))
                ;
            builder.ExportAsInterface<CommandAutoformConfiguration>().WithPublicProperties();
            builder.ExportAsInterface<DetailLoadingConfiguration>()
                .WithPublicProperties()
                .WithProperty(x => x.ValidateToLoad, x => x.Type("(param:ICommandExecutionParameters)=>boolean"))
                .WithProperty(x => x.DetailsFunction, x => x.Type("(param:ICommandExecutionParameters)=>any"));

            #endregion

            #region Partition
            builder.ExportAsInterface<PartitionConfiguration>().OverrideNamespace("PowerTables").WithPublicProperties();
            builder.ExportAsInterface<IPartitionRowData>().OverrideNamespace("PowerTables").WithPublicProperties()
                .WithProperty(c=>c.CanLoadMore, c => c.Type("()=>boolean"))
                .WithProperty(c=>c.IsClientSearchPending, c => c.Type("()=>boolean"))
                .WithProperty(c=>c.IsLoading, c => c.Type("()=>boolean"))
                .WithProperty(c=>c.UiColumnsCount, c => c.Type("()=>number"))
                .WithProperty(c=>c.Stats, c => c.Type("()=>PowerTables.IStatsModel"))
                .WithProperty(c=>c.LoadAhead, c => c.Type("()=>number"))
                ;
            builder.ExportAsInterface<IStatsModel>().OverrideNamespace("PowerTables")
                .WithProperty(c => c.Skip, c => c.Type("()=>number"))
                .WithProperty(c => c.Mode, c => c.Type("()=>PowerTables.PartitionType"))
                .WithProperty(c => c.Take, c => c.Type("()=>number"))
                .WithProperty(c => c.ServerCount, c => c.Type("()=>number"))
                .WithProperty(c => c.Stored, c => c.Type("()=>number"))
                .WithProperty(c => c.Filtered, c => c.Type("()=>number"))
                .WithProperty(c => c.Displayed, c => c.Type("()=>number"))
                .WithProperty(c => c.Ordered, c => c.Type("()=>number"))
                .WithProperty(c => c.Pages, c => c.Type("()=>number"))
                .WithProperty(c => c.CurrentPage, c => c.Type("()=>number"))
                .WithProperty(c => c.IsAllDataLoaded, c => c.Type("()=>boolean"))
                .WithProperty(c => c.IsSetFinite, c => c.Type("()=>boolean"))
                ;
            builder.ExportAsEnum<PartitionType>().OverrideNamespace("PowerTables");
            builder.ExportAsInterface<ServerPartitionConfiguration>().OverrideNamespace("PowerTables").WithPublicProperties();
            #endregion


            #region Scrollbar
            builder.ExportAsInterface<ScrollbarPluginUiConfig>().WithPublicProperties()
                .WithProperty(c => c.PositionCorrector, c => c.Type("any"));
            builder.ExportAsInterface<ScrollbarKeyMappings>().WithPublicProperties();
            builder.ExportAsInterface<ScrollbarForces>().WithPublicProperties();
            builder.ExportAsEnum<StickDirection>();
            builder.ExportAsEnum<StickHollow>();
            builder.ExportAsEnum<KeyboardScrollFocusMode>();
            #endregion

        }

    }
}
