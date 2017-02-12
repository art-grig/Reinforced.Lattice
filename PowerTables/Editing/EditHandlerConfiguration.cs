using System.Collections.Generic;
using System.Reflection;

namespace Reinforced.Lattice.Editing
{
    public interface INongenericHandlerConfiguration
    {
        IEditFieldUsage<TFieldConfig> GetFieldNongenericConfiguration<TColumn, TFieldConfig>(string columnName) where TFieldConfig : EditFieldUiConfigBase, new();

    }

    public interface IEditHandlerConfiguration<out TClientConfig> : INongenericHandlerConfiguration where TClientConfig : EditFormUiConfigBase, new()
    {
        TClientConfig FormClientConfig { get; }

    }

    public sealed class EditHandlerConfiguration<TForm, TClientConfig> 
        : IEditHandlerConfiguration<TClientConfig>
            where TClientConfig : EditFormUiConfigBase, new()
    {
        private readonly Dictionary<string, object> _cachedCliendConfigs = new Dictionary<string, object>();

        public TClientConfig FormClientConfig { get; private set; }


        public IEditFieldUsage<TFieldConfig> GetFieldNongenericConfiguration<TColumn, TFieldConfig>(string columnName) where TFieldConfig : EditFieldUiConfigBase, new()
        {
            if (_cachedCliendConfigs.ContainsKey(columnName))
                return (IEditFieldUsage<TFieldConfig>)_cachedCliendConfigs[columnName];

            
            var editor = new EditFieldUsage<TForm, TColumn, TFieldConfig>(columnName);
            _cachedCliendConfigs[columnName] = editor;
            FormClientConfig.Fields.Add(editor.UiConfig);
            return editor;
        }

        public EditFieldUsage<TForm, T, TFieldConfig> GetFieldConfiguration<T, TFieldConfig>(PropertyInfo name)
            where TFieldConfig : EditFieldUiConfigBase, new()
        {
            if (_cachedCliendConfigs.ContainsKey(name.Name))
                return (EditFieldUsage<TForm, T, TFieldConfig>)_cachedCliendConfigs[name.Name];

            var editor = new EditFieldUsage<TForm, T, TFieldConfig>(name.Name);
            _cachedCliendConfigs[name.Name] = editor;
            FormClientConfig.Fields.Add(editor.UiConfig);
            return editor;
        }

        public EditHandlerConfiguration()
        {
            FormClientConfig = new TClientConfig();
        }
    }
}
