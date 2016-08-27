using System.Reflection;

namespace PowerTables.Editing
{
    public interface IEditFieldUsage<TFieldClientConfig>
        where TFieldClientConfig : EditFieldUiConfigBase
    {
        TFieldClientConfig UiConfig { get; }
    }

    public sealed class EditFieldUsage<TForm, TField,TFieldClientConfig> : IEditFieldUsage<TFieldClientConfig> where TFieldClientConfig : EditFieldUiConfigBase, new()
    {
        public TFieldClientConfig UiConfig { get; private set; }

        public EditFieldUsage(PropertyInfo propertyInfo)
        {
            UiConfig = new TFieldClientConfig();
            UiConfig.FieldName = propertyInfo.Name;
            Property = propertyInfo;
        }

        public EditFieldUsage<TForm, TField, TFieldClientConfig> TemplateId(string templateId)
        {
            UiConfig.TemplateId = templateId;
            return this;
        }

        public PropertyInfo Property { get; private set; }
    }
}
