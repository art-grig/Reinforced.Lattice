using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;

namespace PowerTables.Plugins.Formwatch
{
    internal interface IFormWatchBuilder
    {
        void RemoveField(FormwatchFieldData data);
    }

    /// <summary>
    /// Configuration builder for FormWatch plugin
    /// </summary>
    /// <typeparam name="TFormViewModel"></typeparam>
    public class FormWatchBuilder<TFormViewModel> : IFormWatchBuilder
    {
        private readonly FormwatchClientConfiguration _clientConfig = new FormwatchClientConfiguration();
        private readonly Dictionary<string, IFormWatchFieldBuilder> _fieldsConfig = new Dictionary<string, IFormWatchFieldBuilder>();

        internal FormwatchClientConfiguration ClientConfig
        {
            get { return _clientConfig; }
        }

        /// <summary>
        /// Prevent FormWatch from embedding additional data to query
        /// </summary>
        /// <param name="dont"></param>
        /// <returns></returns>
        public FormWatchBuilder<TFormViewModel> DoNotEmbedAdditionalData(bool dont = true)
        {
            _clientConfig.DoNotEmbed = dont;
            return this;
        }

        /// <summary>
        /// Retrieves fluent configuration wrapper for form field
        /// </summary>
        /// <typeparam name="TData">Field type</typeparam>
        /// <param name="field">Field expression</param>
        /// <returns>Formwatch field configuration builder</returns>
        public FormWatchFieldBuilder<TData> Field<TData>(Expression<Func<TFormViewModel, TData>> field)
        {
            var prop = LambdaHelpers.ParsePropertyLambda(field);
            AssureFieldConfiguration<TData>(prop);
            return (FormWatchFieldBuilder<TData>)_fieldsConfig[prop.Name];
        }

        private void AssureFieldConfiguration<TData>(PropertyInfo prop)
        {
            if (!_fieldsConfig.ContainsKey(prop.Name))
            {
                var fld = DefaultConfig(prop);
                _fieldsConfig[prop.Name] = new FormWatchFieldBuilder<TData>(fld, this);
                _clientConfig.FieldsConfiguration.Add(fld);
            }
        }

        private bool IsEnumerable(Type t)
        {
            if (t == typeof (string)) return false;
            if (t.IsArray) return true;
            if (typeof(IEnumerable).IsAssignableFrom(t)) return true;
            if (t.IsGenericType)
            {
                var tg = t.GetGenericTypeDefinition();
                if (typeof(IEnumerable<>).IsAssignableFrom(tg)) return true;
            }
            return false;
        }
        private FormwatchFieldData DefaultConfig(PropertyInfo prop)
        {
            var fld = new FormwatchFieldData
            {
                FieldJsonName = prop.Name,
                FieldSelector = "#" + prop.Name,
                SearchTriggerDelay = 500,
                Key = prop.Name,
                IsDateTime = typeof(DateTime) == prop.PropertyType || typeof(DateTime?) == prop.PropertyType,
                IsArray = IsEnumerable(prop.PropertyType)
            };
            return fld;
        }

        private void AssureFieldConfiguration(PropertyInfo prop)
        {
            if (!_fieldsConfig.ContainsKey(prop.Name))
            {
                var fld = DefaultConfig(prop);
                var type = typeof(FormWatchFieldBuilder<>).MakeGenericType(prop.PropertyType);
                var obj = Activator.CreateInstance(type, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance, null, new object[] { fld, this }, CultureInfo.InvariantCulture);
                _fieldsConfig[prop.Name] = (IFormWatchFieldBuilder)obj;
                _clientConfig.FieldsConfiguration.Add(fld);
            }
        }

        /// <summary>
        /// Automatically configures Formwatch plugin to watch all fields
        /// </summary>
        /// <returns>Fluent</returns>
        public FormWatchBuilder<TFormViewModel> WatchAllFields()
        {
            var props = typeof(TFormViewModel).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (var propertyInfo in props)
            {
                AssureFieldConfiguration(propertyInfo);
            }
            return this;
        }

        /// <summary>
        /// Applies specified configuration function to all fields
        /// </summary>
        /// <returns>Fluent</returns>
        public FormWatchBuilder<TFormViewModel> ForAll(Action<IFormWatchFieldBuilder> config)
        {
            foreach (var value in _fieldsConfig.Values)
            {
                config(value);
            }
            return this;
        }

        void IFormWatchBuilder.RemoveField(FormwatchFieldData data)
        {
            _clientConfig.FieldsConfiguration.Remove(data);
            _fieldsConfig.Remove(data.Key);
        }
    }
}
