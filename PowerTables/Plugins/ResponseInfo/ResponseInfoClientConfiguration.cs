

namespace PowerTables.Plugins.ResponseInfo
{
    public class ResponseInfoClientConfiguration
    {
        /// <summary>
        /// Use handlebars syntax with IResponse as context
        /// </summary>
        public string TemplateText { get; set; }

        public bool ResponseObjectOverride { get; set; }
    }
}