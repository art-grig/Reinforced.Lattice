using System;
using System.Collections.Generic;
using System.Linq;
using PowerTables.Plugins;

namespace PowerTables.Filters.Select
{
    /// <summary>
    /// Extensions for Select Filter UI
    /// </summary>
    public static class SelectFilterUiConfigExtensions
    {
        /// <summary>
        /// Allows or disallows "any" selection
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="anyText">"any" select item text</param>
        /// <param name="allowAny">Add "any" element to select item or not</param>
        /// <returns></returns>
        public static ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> SelectAny<TColumn>(this ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> config, bool allowAny = true, string anyText = "Any")
        {
            if (allowAny)
            {
                config.Configuration.Items.Add(new UiListItem() {Text = anyText, Value = ""});
            }
            else
            {
                config.Configuration.Items.RemoveAll(c => c.Value == "");
            }
            return config;
        }

        /// <summary>
        /// Allows or disallows "not present" selection that will filter out items where specified column is null
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="notPresentText">"Not-Present" select item text</param>
        /// <param name="allowNotPresent">Add "Not-Present" element to select list or not</param>
        /// <returns></returns>
        public static ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn?> SelectNotPresent<TColumn>(this ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn?> config, bool allowNotPresent = true, string notPresentText = "Not present")
            where TColumn : struct
        {
            if (allowNotPresent)
            {
                config.Configuration.Items.Add(new UiListItem() { Text = notPresentText, Value = ValueConverter.NotPresentValue });
            }
            else
            {
                config.Configuration.Items.RemoveAll(c => c.Value == ValueConverter.NotPresentValue);
            }
            return config;
        }

        /// <summary>
        /// Sets select items for filter UI
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="items">Select list with available values</param>
        /// <param name="replaceItems">When true, currently presented items will be replaced with newly supplied ones</param>
        /// <returns></returns>
        public static ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> SelectItems<TColumn>(this ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> config,
            IEnumerable<UiListItem> items, bool replaceItems = false)
        {
            if (replaceItems)
            {
                config.Configuration.Items = (items.ToList());
            }
            else
            {
                config.Configuration.Items.AddRange(items.ToList());
            }
            return config;
        }

        /// <summary>
        /// Specifies raw default value for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="value">Raw value string</param>
        /// <returns>UI builder</returns>
        public static ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> RawDefault<TColumn>(this ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> config, string value)
        {
            if (config.Configuration.Items == null)
            {
                throw new Exception("Please specify default value for range filter AFTER setting its items. We cannot select default value from empty possible values list.");
            }
            config.Configuration.Items.ForEach(c => c.Selected = false);
            if (value != null)
            {
                var selected = config.Configuration.Items.FirstOrDefault(c => c.Value == value);
                if (selected != null)
                {
                    selected.Selected = true;
                }
                else
                {
                    throw new Exception(String.Format(
                        "Cannot find item in list with value '{0}' to make it default", value));
                }
            }
            config.Configuration.SelectedValue = ValueConverter.ToFilterDefaultString(value);
            return config;
        }

        /// <summary>
        /// Specifies default value for filter. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="selectValue">Filter default value</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> SelectDefault<TColumn>(this ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> config, TColumn selectValue)
        {
            config.RawDefault(ValueConverter.ToFilterDefaultString(selectValue));
            return config;
        }

        /// <summary>
        /// Specifies default value for filter. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="selectValue">Filter default value</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn?> SelectDefault<TColumn>(this ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn?> config, TColumn? selectValue) where TColumn : struct
        {
            config.RawDefault(ValueConverter.ToFilterDefaultString(selectValue));
            return config;
        }

        /// <summary>
        /// Specifies default value for filter. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="selectNullValue">Filter default value</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> SelectDefault<TColumn>(this ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> config, TColumn? selectNullValue) where TColumn : struct
        {
            config.RawDefault(ValueConverter.ToFilterDefaultString(selectNullValue));
            return config;
        }
    }
}
