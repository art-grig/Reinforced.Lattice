using System;
using System.Threading.Tasks;

namespace Reinforced.Lattice.Processing
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
        /// Beware here of ActionResults that require GET request. In this case set ForceDeferred to true.
        /// </summary>
        /// <param name="data">Data sets</param>
        /// <returns></returns>
        object HandleData(LatticeData data);

        /// <summary>
        /// Async-friendly command handling method. Should take in account table data and return any ActionResult. 
        /// Beware here of ActionResults that require GET request. In this case set ForceDeferred to true.
        /// </summary>
        /// <param name="data">Data sets</param>
        /// <returns></returns>
        Task<object> HandleDataAsync(LatticeData data);

        /// <summary>
        /// Query deferring control. 
        /// You should return true here when you command returns ActionResult that is not supposed to be processed 
        /// with XMLHttpRequest. Set ForceDeferred to true/false to make table handler to store request and make client 
        /// side to re-query your handler with GET request. 
        /// Warning! ForceDeferred is called BEFORE .Handle/.HandleAsync. So you must evaluate it in advance. 
        /// Also see <see cref="InMemoryTokenStorage"/>
        /// </summary>
        bool ForceDeferred { get; set; }

        /// <summary>
        /// Reveals uprocessed command result type
        /// </summary>
        Type UnprocessedResultType { get; }
    }

    public abstract class CommandHandleBase<T> : ICommandHandler
    {
        protected abstract T Handle(LatticeData data);
        protected abstract Task<T> HandleAsync(LatticeData data);

        public object HandleData(LatticeData data)
        {
            return Handle(data);
        }

        public async Task<object> HandleDataAsync(LatticeData data)
        {
            return await HandleAsync(data);
        }

        public bool ForceDeferred { get; set; }
        public Type UnprocessedResultType { get { return typeof(T); } }
    }
}
