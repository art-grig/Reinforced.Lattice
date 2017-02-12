using System;
using PowerTables.Configuration;

namespace PowerTables.Editing
{
    public static class CommonEditingExtensions
    {
        public static EditFieldUsage<TForm, T, TFieldConfig> FakeColumn<TForm, T, TFieldConfig>(
            this EditFieldUsage<TForm, T, TFieldConfig> conf, Action<IColumnTargetProperty<T>> fakeColumnConfiguration) where TFieldConfig : EditFieldUiConfigBase, new()
        {
            FakeColumn<T> fc = new FakeColumn<T>(conf.BaseUiConfig.FieldName);
            fakeColumnConfiguration(fc);
            conf.UiConfig.FakeColumn = fc.ColumnConfiguration;
            return conf;
        }

        public static INongenericEditFieldUsage FakeColumn<T>(this INongenericEditFieldUsage conf, Action<IColumnTargetProperty<T>> fakeColumnConfiguration)
        {
            FakeColumn<T> fc = new FakeColumn<T>(conf.BaseUiConfig.FieldName);
            fakeColumnConfiguration(fc);
            conf.BaseUiConfig.FakeColumn = fc.ColumnConfiguration;
            return conf;
        }


        public static T EditorTemplateId<T>(this T conf, string templateId) where T : INongenericEditFieldUsage
        {
            conf.BaseUiConfig.TemplateId = templateId;
            return conf;
        }


        public static T OverrideErrorMessage<T>(this T conf, string key, string message) where T : INongenericEditFieldUsage
        {
            conf.BaseUiConfig.ValidationMessagesOverride[key] = message;
            return conf;
        }
        
    }
}
