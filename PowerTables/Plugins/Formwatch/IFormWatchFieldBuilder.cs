namespace PowerTables.Plugins.Formwatch
{
    public interface IFormWatchFieldBuilder
    {
        FormwatchFieldData FieldData { get; }

        /// <summary>
        /// Specifies selector for input element where to extract field data
        /// </summary>
        /// <param name="fieldSelector">CSS Selector</param>
        /// <returns>Fluent</returns>
        IFormWatchFieldBuilder Selector(string fieldSelector);

        /// <summary>
        /// Specifies JSON key that will be used to denote this field in Query
        /// </summary>
        /// <param name="jsonName">JSON Key name</param>
        /// <returns>Fluent</returns>
        IFormWatchFieldBuilder JsonName(string jsonName);

        /// <summary>
        /// Specifies JS function to retrieve this field value
        /// </summary>
        /// <param name="function">JS function text. Like "function() { return ... }"</param>
        /// <returns>Fluent</returns>
        IFormWatchFieldBuilder ValueFunction(string function);

        /// <summary>
        /// Specifies events on this field that will trigger search while happen
        /// </summary>
        /// <param name="events">Javascript event types list</param>
        /// <returns>Fluent</returns>
        IFormWatchFieldBuilder TriggerSearchOnEvents(params string[] events);

        /// <summary>
        /// Specifies events on this field that will trigger search while happen
        /// </summary>
        /// <param name="delay">Delay between event happened and request sent to server</param>
        /// <param name="events">Javascript event types list</param>
        /// <returns>Fluent</returns>
        IFormWatchFieldBuilder TriggerSearchOnEvents(int delay, params string[] events);

        /// <summary>
        /// Instructs Formwatch to specify value set with .Constant for corresponding form field if no value supplied
        /// </summary>
        /// <returns>Fluent</returns>
        IFormWatchFieldBuilder SetToConstantIfNoValue();

        /// <summary>
        /// Ignores this field from watching form
        /// </summary>
        void Ignore();
    }
}