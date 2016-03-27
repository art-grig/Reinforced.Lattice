using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Reinforced.Typings.Attributes;

namespace PowerTables.Typings.Infrastructure
{
    interface ITemplatesProvider
    {
        /// <summary>
        /// Current handlebars.js engine instance
        /// </summary>
        [TsProperty(Type = "Handlebars.IHandlebars")]
        object HandlebarsInstance { get; }

        /// <summary>
        /// Retrieves cached template handlebars function
        /// </summary>
        /// <param name="templateId">Template id</param>
        /// <returns>Handlebars function</returns>
        Func<object, string> GetCachedTemplate(string templateId);
    }
}
