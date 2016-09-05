using System;
using System.Reflection;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Editing
{
    public interface INongenericEditFieldUsage
    {
        EditFieldUiConfigBase BaseUiConfig { get; }
    }

    public interface IEditFieldUsage<out TFieldClientConfig> : INongenericEditFieldUsage where TFieldClientConfig : EditFieldUiConfigBase, new()
    {
        TFieldClientConfig UiConfig { get; }
    }

    public sealed class EditFieldUsage<TForm, TField, TFieldClientConfig> : IEditFieldUsage<TFieldClientConfig> where TFieldClientConfig : EditFieldUiConfigBase, new()
    {
        public TFieldClientConfig UiConfig { get; private set; }

        public EditFieldUsage(string fieldName)
        {
            UiConfig = new TFieldClientConfig();
            UiConfig.FieldName = fieldName;
            Property = fieldName;
        }

        public string Property { get; private set; }
        public EditFieldUiConfigBase BaseUiConfig { get { return UiConfig; } }
    }
}
