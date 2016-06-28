using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using PowerTables.CellTemplating;
using PowerTables.Plugins.Total;

namespace PowerTables.Plugins.ResponseInfo
{
    public class ResponseInfoClientConfiguration : IProvidesTemplate
    {
        /// <summary>
        /// Functions for calculating client-side values
        /// Key = additional field name, Value = function (set) => any to calculate
        /// </summary>
        public Dictionary<string, JRaw> ClientCalculators { get; set; }

        /// <summary>
        /// Client function for template rendering
        /// </summary>
        public JRaw ClientTemplateFunction { get; internal set; }

        /// <summary>
        /// Used to point that response info resulting object has been changed
        /// </summary>
        public bool ResponseObjectOverriden { get; internal set; }

        public string DefaultTemplateId { get { return "responseInfo"; } }

        public ResponseInfoClientConfiguration()
        {
            ClientCalculators = new Dictionary<string, JRaw>();
        }
    }

    public static class ResponseInfoClientConfigurationExtensions
    {
        /// <summary>
        /// Client template functions. Works exactly like column .Template call
        /// </summary>
        /// <param name="c"></param>
        /// <param name="templateBuilder">Template builder</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> ClientTemplate(this PluginConfigurationWrapper<ResponseInfoClientConfiguration> c, Action<CellTemplateBuilder> templateBuilder)
        {
            CellTemplateBuilder teb = new CellTemplateBuilder(null);
            templateBuilder(teb);
            c.Configuration.ClientTemplateFunction = new JRaw(teb.Build());
            return c;
        }

        /// <summary>
        /// Adds client total calculator that produces sum amount of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="name">Name of field to be added to existing ResponseInfo template model</param>
        /// <param name="sumExpression">`{@}`-syntax expression that will be calculated for each row and summarized</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> AddClientSum(
            this PluginConfigurationWrapper<ResponseInfoClientConfiguration> conf,
            string name,
            string sumExpression,
            ClientDataSet clientDataSet
            )
        {
            var function = TotalClientFunctionsExtensions.CreateSumFunction(sumExpression, clientDataSet);
            conf.Configuration.ClientCalculators.Add(name, new JRaw(function));
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces sum amount of supplied row values that match supplied predicate function
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="name">Name of field to be added to existing ResponseInfo template model</param>
        /// <param name="sumExpression">`{@}`-syntax expression that will be calculated for each row and summarized</param>
        /// <param name="predicate">`{@}`-syntax expression that specifies predicate</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> AddClientSumPredicate(
            this PluginConfigurationWrapper<ResponseInfoClientConfiguration> conf,
            string name,
            string sumExpression,
            string predicate,
            ClientDataSet clientDataSet
            )
        {
            var function = TotalClientFunctionsExtensions.CreateSumFunctionWithPredicate(sumExpression, predicate, clientDataSet);
            conf.Configuration.ClientCalculators.Add(name, new JRaw(function));
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces count of rows
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="name">Name of field to be added to existing ResponseInfo template model</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> AddClientCount(
            this PluginConfigurationWrapper<ResponseInfoClientConfiguration> conf,
            string name,
            ClientDataSet clientDataSet
            )
        {
            var function = string.Format("function(v){{ return v.{0}.length; }}", clientDataSet);
            conf.Configuration.ClientCalculators.Add(name, new JRaw(function));
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces count of rows that match supplied predicate function
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="name">Name of field to be added to existing ResponseInfo template model</param>
        /// <param name="predicate">`{@}`-syntax expression that specifies predicate</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> AddClientCountPredicate(
            this PluginConfigurationWrapper<ResponseInfoClientConfiguration> conf,
string name,
            string predicate,
            ClientDataSet clientDataSet

            )
        {

            var function = TotalClientFunctionsExtensions.CreateSumFunctionWithPredicate("1", predicate, clientDataSet);
            conf.Configuration.ClientCalculators.Add(name, new JRaw(function));
            return conf;
        }


        /// <summary>
        /// Adds client total calculator that produces average of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="name">Name of field to be added to existing ResponseInfo template model</param>
        /// <param name="avgExpression">`{@}`-syntax expression that will be calculated for each row and averaged</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> AddClientAverage(
            this PluginConfigurationWrapper<ResponseInfoClientConfiguration> conf,
string name,
            string avgExpression,
            ClientDataSet clientDataSet

            )
        {

            var function = TotalClientFunctionsExtensions.CreateAvgFunction(avgExpression, clientDataSet);
            conf.Configuration.ClientCalculators.Add(name, new JRaw(function));
            return conf;
        }


        /// <summary>
        /// Adds client total calculator that produces weighted average of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="name">Name of field to be added to existing ResponseInfo template model</param>
        /// <param name="avgExpression">`{@}`-syntax expression that will be calculated for each row and averaged</param>
        /// <param name="weightExpression">`{@}`-syntax expression for weight coefficient</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> AddClientWeightedAverage(
            this PluginConfigurationWrapper<ResponseInfoClientConfiguration> conf,
string name,
            string avgExpression,
            string weightExpression,
            ClientDataSet clientDataSet

            )
        {

            var function = TotalClientFunctionsExtensions.CreateWeightedAvgFunction(avgExpression, weightExpression, clientDataSet);
            conf.Configuration.ClientCalculators.Add(name, new JRaw(function));
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces minimum of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="name">Name of field to be added to existing ResponseInfo template model</param>
        /// <param name="expression">`{@}`-syntax expression minimum of which will be found</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> AddClientMin(
            this PluginConfigurationWrapper<ResponseInfoClientConfiguration> conf,
string name,
            string expression,
            ClientDataSet clientDataSet

            )
        {

            var function = TotalClientFunctionsExtensions.CreateExtremumFunction(expression, false, clientDataSet);
            conf.Configuration.ClientCalculators.Add(name, new JRaw(function));
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces maximum of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="name">Name of field to be added to existing ResponseInfo template model</param>
        /// <param name="expression">`{@}`-syntax expression minimum of which will be found</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ResponseInfoClientConfiguration> AddClientMax(
            this PluginConfigurationWrapper<ResponseInfoClientConfiguration> conf,
string name,
            string expression,
            ClientDataSet clientDataSet

            )
        {

            var function = TotalClientFunctionsExtensions.CreateExtremumFunction(expression, true, clientDataSet);
            conf.Configuration.ClientCalculators.Add(name, new JRaw(function));
            return conf;
        }
    }
}