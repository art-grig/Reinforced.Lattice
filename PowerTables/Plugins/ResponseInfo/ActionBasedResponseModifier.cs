using System;
using PowerTables.Configuration;
using PowerTables.ResponseProcessing;

namespace PowerTables.Plugins.ResponseInfo
{
    /// <summary>
    /// Response modifier providing separate action/delegate to response modifier. 
    /// Nongeneric variation. 
    /// See <see cref="IResponseModifier"/> 
    /// See <see cref="Configurator{TSourceData,TTableData}.RegisterResponseModifier"/>
    /// </summary>
    public class ActionBasedResponseModifier : IResponseModifier
    {
        private readonly Action<PowerTablesData, PowerTablesResponse> _action;

        /// <summary>
        /// Constructs new action-based response modifier
        /// </summary>
        /// <param name="action">Action modifying response</param>
        public ActionBasedResponseModifier(Action<PowerTablesData, PowerTablesResponse> action)
        {
            _action = action;
        }

        public void ModifyResponse(PowerTablesData data, PowerTablesResponse response)
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
        private readonly Action<PowerTablesData<TSourceData, TTableData>, PowerTablesResponse> _action;

        /// <summary>
        /// Constructs new action-based response modifier
        /// </summary>
        /// <param name="action">Action modifying response</param>
        public ActionBasedResponseModifier(Action<PowerTablesData<TSourceData, TTableData>, PowerTablesResponse> action)
        {
            _action = action;
        }

        public void ModifyResponse(PowerTablesData data, PowerTablesResponse response)
        {
            if (_action != null)
            {
                _action(new PowerTablesData<TSourceData, TTableData>(data), response);
            }
        }
    }
}
