using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PowerTables.ResponseProcessing
{
    /// <summary>
    /// Exposes command handler interface. 
    /// With each request here comes the textual command. So table handler could not only 
    /// select desired data and prepare queries but handle custom user's command over specified data. 
    /// Command handler exposes this extension point and provides you with a way to handle selected data in 
    /// any manner and return corresponding ActionResult that will be sent to client.
    /// </summary>
    public interface ICommandHandler
    {
        /// <summary>
        /// Command handling method. Should take in account table data and return any ActionResult. 
        /// Beware here of ActionResults that require GET request. In this case set IsDeferable to true.
        /// </summary>
        /// <param name="data">Data sets</param>
        /// <param name="responseModifiers">Response modifiers. See <see cref="IResponseModifiersApplier"/> for details</param>
        /// <returns></returns>
        ActionResult Handle(PowerTablesData data, IResponseModifiersApplier responseModifiers);

        /// <summary>
        /// Async-friendly command handling method. Should take in account table data and return any ActionResult. 
        /// Beware here of ActionResults that require GET request. In this case set IsDeferable to true.
        /// </summary>
        /// <param name="data">Data sets</param>
        /// <param name="responseModifiers">Response modifiers. See <see cref="IResponseModifiersApplier"/> for details</param>
        /// <returns></returns>
        Task<ActionResult> HandleAsync(PowerTablesData data, IResponseModifiersApplier responseModifiers);

        /// <summary>
        /// Query deferring control. 
        /// You should return true here when you command returns ActionResult that is not supposed to be processed 
        /// with XMLHttpRequest. Set IsDeferable to true/false to make table handler to store request and make client 
        /// side to re-query your handler with GET request. 
        /// Warning! IsDeferable is called BEFORE .Handle/.HandleAsync. So you must evaluate it in advance. 
        /// Also see <see cref="TokenStorage"/>
        /// </summary>
        bool IsDeferable { get; }
    }
}
