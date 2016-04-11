

using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.ResponseInfo
{
    public class ResponseInfoClientConfiguration
    {
        /// <summary>
        /// Use handlebars syntax with IResponse as context
        /// </summary>
        public string TemplateText { get; set; }

        /// <summary>
        /// Client function for evaluating template information
        /// </summary>
        public JRaw ClientEvaluationFunction { get; set; }

        /// <summary>
        /// Used to point that response info resulting object has been changed
        /// </summary>
        public bool ResponseObjectOverriden { get; internal set; }

        /// <summary>
        /// When true, response information will be refreshed during pure client queries
        /// </summary>
        public bool ReloadOnClientQueries { get; internal set; }
    }
}