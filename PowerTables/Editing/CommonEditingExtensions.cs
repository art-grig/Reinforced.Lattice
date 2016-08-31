using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Editing
{
    public static class CommonEditingExtensions
    {
        public static EditFieldUsage<TForm, T, TFieldConfig> FakeColumn<TForm, T, TFieldConfig>(
            this EditFieldUsage<TForm, T, TFieldConfig> conf, Action<IColumnTargetProperty<T>> fakeColumnConfiguration) where TFieldConfig : EditFieldUiConfigBase, new()
        {
            FakeColumn<T> fc = new FakeColumn<T>();
            fakeColumnConfiguration(fc);
            conf.UiConfig.FakeColumn = fc.ColumnConfiguration;
            return conf;
        }

        public static INongenericEditFieldUsage FakeColumn<T>(this INongenericEditFieldUsage conf, Action<IColumnTargetProperty<T>> fakeColumnConfiguration)
        {
            FakeColumn<T> fc = new FakeColumn<T>();
            fakeColumnConfiguration(fc);
            conf.BaseUiConfig.FakeColumn = fc.ColumnConfiguration;
            return conf;
        }
    }
}
