﻿using System;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using JetBrains.Annotations;
using Newtonsoft.Json.Linq;
using PowerTables.Configuration;
using PowerTables.Templating;

namespace PowerTables.Mvc
{
    /// <summary>
    /// Extensions for initialization of tables
    /// </summary>
    public static class InitializationExtensions
    {
        /// <summary>
        /// Helper for rendering templates
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="pathToTemplates">Path to templates that should be used</param>
        /// <param name="prefix">Templates prefix</param>
        public static void RenderTemplates(this HtmlHelper helper, string prefix, [AspMvcView] string pathToTemplates)
        {
            helper.RenderPartial(pathToTemplates, new LatticeTemplatesViewModel() { Prefix = prefix });
        }

        /// <summary>
        /// Helper for rendering templates
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="prefix"></param>
        public static void RenderDefaultTemplates(this HtmlHelper helper, string prefix = "lt")
        {
            RenderTemplates(helper, prefix, TemplatesPageBase.DefaultTemplatesView);
        }

        #region Initialization code

        /// <summary>
        /// Returns MvcHtmlString that contains JSON table configuration that is used to construct
        /// Javascript PowerTables object. 
        /// PowerTables client-side is highly dependant on large JSON configuration. 
        /// So <see cref="Configurator{TSourceData,TTableData}"/> is initially set of helper methods 
        /// helping to build this JSON configuration. 
        /// </summary>
        /// <param name="conf">Configurator</param>
        /// <param name="rootId">Id of an HTML element that will contain table</param>
        /// <param name="prefix">Templates prefix. It is used to distinguish several templates sets on single page from each other</param>
        /// <returns>MvcHtmlString containing javascript initialization code</returns>
        public static MvcHtmlString JsonConfig(this IConfigurator conf, string rootId, string prefix = "lt")
        {
            return MvcHtmlString.Create(conf.JsonConfig(rootId, prefix));
        }


        /// <summary>
        /// Returns MvcHtmlString that contains Javascript initialization code (not only config) 
        /// for table. 
        /// PowerTables client-side is highly dependant on large JSON configuration. 
        /// So <see cref="Configurator{TSourceData,TTableData}"/> is initially set of helper methods 
        /// helping to build this JSON configuration. 
        /// This overload of InitializationCode consumes "static data". Static data is data class that 
        /// is well-known before table initialization and is being sent within every request. 
        /// You are not able to change it during request handling but can use it to store any payload 
        /// that is known before table construction.
        /// </summary>
        /// <param name="conf">Configurator</param>
        /// <param name="rootId">Id of an HTML element that will contain table</param>
        /// <param name="variableName">Expression that new PowerTables javascript object will be assigned to</param>
        /// <param name="prefix">Templates prefix. It is used to distinguish several templates sets on single page from each other</param>
        /// <returns>MvcHtmlString containing javascript initialization code</returns>
        public static MvcHtmlString InitializationScript(this IConfigurator conf, string rootId, string variableName, string prefix = "lt")
        {
            var jsonConfig = conf.JsonConfig(rootId, prefix);
            const string codeTemplate = @" 
<script type=""text/javascript"" >
{0} = new PowerTables.PowerTable({1});
</script>
";
            return MvcHtmlString.Create(String.Format(codeTemplate, variableName, jsonConfig));
        }

        #endregion
    }
}
