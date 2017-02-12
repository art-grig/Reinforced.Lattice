using System;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Processing;

namespace Reinforced.Lattice.Plugins.ResponseInfo
{
    /// <summary>
    /// Response modifier providing separate action/delegate to response modifier. 
    /// Nongeneric variation. 
    /// See <see cref="IResponseModifier"/> 
    /// See <see cref="Configurator{TSourceData,TTableData}.RegisterResponseModifier"/>
    /// </summary>
    public class ActionBasedResponseModifier : IResponseModifier
    {
        private readonly Action<LatticeData, LatticeResponse> _action;

        /// <summary>
        /// Constructs new action-based response modifier
        /// </summary>
        /// <param name="action">Action modifying response</param>
        public ActionBasedResponseModifier(Action<LatticeData, LatticeResponse> action)
        {
            _action = action;
        }

        public void ModifyResponse(LatticeData data, LatticeResponse response)
        {
            if (_action != null)
            {
                _action(data, response);
            }
        }
    }

    /// <summary>
    /// Response modifier providing separate action/delegate to response modifier. 
    /// Generic variation. 
    /// See <see cref="IResponseModifier"/> 
    /// See <see cref="Configurator{TSourceData,TTableData}.RegisterResponseModifier"/>
    /// </summary>
    public class ActionBasedResponseModifier<TSourceData,TTableData> : IResponseModifier where TTableData : new()
    {
        private readonly Action<LatticeData<TSourceData, TTableData>, LatticeResponse> _action;

        /// <summary>
        /// Constructs new action-based response modifier
        /// </summary>
        /// <param name="action">Action modifying response</param>
        public ActionBasedResponseModifier(Action<LatticeData<TSourceData, TTableData>, LatticeResponse> action)
        {
            _action = action;
        }

        public void ModifyResponse(LatticeData data, LatticeResponse response)
        {
            if (_action != null)
            {
                _action(new LatticeData<TSourceData, TTableData>(data), response);
            }
        }
    }
}
