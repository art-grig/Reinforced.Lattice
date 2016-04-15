

using System;
using Newtonsoft.Json.Linq;
using PowerTables.FrequentlyUsed;

namespace PowerTables.Plugins.ResponseInfo
{
    public class ResponseInfoClientConfiguration : IProvidesTemplate
    {
        /// <summary>
        /// Client function for evaluating template information
        /// </summary>
        public JRaw ClientEvaluationFunction { get; internal set; }

        /// <summary>
        /// Client function for template rendering
        /// </summary>
        public JRaw ClientTemplateFunction { get; internal set; }

        /// <summary>
        /// Used to point that response info resulting object has been changed
        /// </summary>
        public bool ResponseObjectOverriden { get; internal set; }

        public string DefaultTemplateId { get; private set; }
    }

    public static class ResponseInfoClientConfigurationExtensions
    {
        /// <summary>
        /// Specifies client ResponseInfo evaluation function.
        /// 
        /// Evaluation function has type:
        /// (displayedData:any[], storedData:any[], currentPage:number, totalPages:number) => any
        /// displayedData: currently displayed data in page
        /// storedData: all data loaded to client-side
        /// currentPage: currently displaying page
        /// totalPages: all locally available pages 
        /// </summary>
        /// <returns></returns>
        public static ResponseInfoClientConfiguration ClientEvaluationFunction(this ResponseInfoClientConfiguration c, string function)
        {
            c.ClientEvaluationFunction = new JRaw(string.IsNullOrEmpty(function)?"null":function);
            return c;
        }

        /// <summary>
        /// Client template functions. Works exactly like column .Template call
        /// </summary>
        /// <param name="c"></param>
        /// <param name="templateBuilder">Template builder</param>
        /// <returns></returns>
        public static ResponseInfoClientConfiguration ClientTemplate(this ResponseInfoClientConfiguration c, Action<CellTemplateBuilder> templateBuilder)
        {
            CellTemplateBuilder teb = new CellTemplateBuilder();
            templateBuilder(teb);
            c.ClientTemplateFunction = new JRaw(teb.Build());
            return c;
        }

        
    }
}