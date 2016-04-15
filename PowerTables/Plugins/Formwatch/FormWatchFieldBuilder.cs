using Newtonsoft.Json.Linq;
using PowerTables.Configuration;
using PowerTables.Filters;

namespace PowerTables.Plugins.Formwatch
{
    /// <summary>
    /// Formwatch configuration builder
    /// </summary>
    public class FormWatchFieldBuilder<TData> : IFormWatchFieldBuilder
    {
        private readonly FormwatchFieldData _fieldData;
        internal readonly IFormWatchBuilder _formWatchBuilder;
        private readonly IConfigurator _configurator;
        public FormwatchFieldData FieldData
        {
            get { return _fieldData; }
        }

        internal FormWatchFieldBuilder(FormwatchFieldData fieldData, IFormWatchBuilder formWatchBuilder, IConfigurator configurator)
        {
            _fieldData = fieldData;
            _formWatchBuilder = formWatchBuilder;
            _configurator = configurator;
        }

        /// <summary>
        /// Specifies selector for input element where to extract field data
        /// </summary>
        /// <param name="fieldSelector">CSS Selector</param>
        /// <returns>Fluent</returns>
        public IFormWatchFieldBuilder Selector(string fieldSelector)
        {
            _fieldData.FieldSelector = fieldSelector;
            return this;
        }

        /// <summary>
        /// Specifies JSON key that will be used to denote this field in Query
        /// </summary>
        /// <param name="jsonName">JSON Key name</param>
        /// <returns>Fluent</returns>
        public IFormWatchFieldBuilder JsonName(string jsonName)
        {
            _fieldData.FieldJsonName = jsonName;
            return this;
        }


        /// <summary>
        /// Specifies JS function to retrieve this field value
        /// </summary>
        /// <param name="function">JS function text. Like "function() { return ... }"</param>
        /// <returns>Fluent</returns>
        public IFormWatchFieldBuilder ValueFunction(string function)
        {
            _fieldData.FieldValueFunction = new JRaw(function);
            return this;
        }


        /// <summary>
        /// Specifies events on this field that will trigger search while happen
        /// </summary>
        /// <param name="events">Javascript event types list</param>
        /// <returns>Fluent</returns>
        public IFormWatchFieldBuilder TriggerSearchOnEvents(params string[] events)
        {
            _fieldData.TriggerSearchOnEvents = events;
            return this;
        }

        /// <summary>
        /// Specifies events on this field that will trigger search while happen
        /// </summary>
        /// <param name="delay">Delay between event happened and request sent to server</param>
        /// <param name="events">Javascript event types list</param>
        /// <returns>Fluent</returns>
        public IFormWatchFieldBuilder TriggerSearchOnEvents(int delay, params string[] events)
        {
            _fieldData.TriggerSearchOnEvents = events;
            _fieldData.SearchTriggerDelay = delay;
            return this;
        }

        /// <summary>
        /// This method will make Formwatch to set specified constant value for current field and ignore 
        /// user input. 
        /// The 2nd purpose of .Constant is to be substituted when user did not supply information for specified field. 
        /// To achieve this behavior use <see cref="SetToConstantIfNoValue"/>
        /// </summary>
        /// <param name="constant">Constant value for form field</param>
        /// <returns>Fluent</returns>
        public FormWatchFieldBuilder<TData> Constant(TData constant)
        {
            _fieldData.ConstantValue = ValueConverter.ToFilterDefaultString(constant);
            return this;
        }

        public IFormWatchFieldBuilder SetToConstantIfNoValue()
        {
            _fieldData.SetConstantIfNotSupplied = true;
            return this;
        }

        /// <summary>
        /// Ignores this field from watching form
        /// </summary>
        public void Ignore()
        {
            _formWatchBuilder.RemoveField(_fieldData);
        }

        

    }
}
