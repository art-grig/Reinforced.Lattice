using System.Collections.Generic;
using System.Reflection;

namespace PowerTables.Editing
{
    public interface IEditHandlerConfiguration<TClientConfig> where TClientConfig : EditFormUiConfigBase
    {
        TClientConfig FormClientConfig { get; }
    }
    public sealed class EditHandlerConfiguration<TForm,TClientConfig> : IEditHandlerConfiguration<TClientConfig> 
        where TClientConfig : EditFormUiConfigBase, new()
    {
        private readonly Dictionary<string, object> _cachedCliendConfigs = new Dictionary<string, object>();
        public TClientConfig FormClientConfig { get; private set; }

        public EditFieldUsage<TForm, T, TFieldConfig> GetFieldConfiguration<T, TFieldConfig>(PropertyInfo name) 
            where TFieldConfig : EditFieldUiConfigBase, new()
        {
            if (_cachedCliendConfigs.ContainsKey(name.Name))
                return (EditFieldUsage<TForm, T, TFieldConfig>)_cachedCliendConfigs[name.Name];

            var editor = new EditFieldUsage<TForm, T, TFieldConfig>(name);
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
