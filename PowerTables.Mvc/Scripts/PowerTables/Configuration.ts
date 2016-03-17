module PowerTables {
    export interface IPowerTableConfiguration {
        TableRootId: string;
        OperationalAjaxUrl: string;
        Columns: IColumnConfiguration[];
        PluginsConfiguration: { [key: string]: IPluginConfiguration };
        RawColumnNames: string[];
}

    export interface IColumnConfiguration {
        Title:string;
        RawColumnName: string;
        Order: number;
        Filter: IColumnFilterConfiguration;
        CellRenderingTemplateId: string;
        CellRenderingHtmlFunction: string;
        CellRenderingValueFunction: string;
        EnableOrdering: boolean;
        CellPluginsConfiguration: { [key: string]: IPluginConfiguration };
    }

    export interface IColumnFilterConfiguration {
        FilterKey: string;
        FilterConfiguration: any;
    }

    export interface IPluginConfiguration {
        Placement: string;
        Configuration:any;
    }

}