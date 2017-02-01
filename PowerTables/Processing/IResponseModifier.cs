namespace PowerTables.Processing
{
    /// <summary>
    /// Response modifier interface exposes PowerTables extension point 
    /// that allows to modify response before sending to client. 
    /// Usually this interface is used to supply PowerTablesResponse with some 
    /// AdditionalData values. 
    /// See <see cref="PowerTablesResponse"/>
    /// </summary>
    public interface IResponseModifier
    {
        /// <summary>
        /// Method that performs modification of PowerTablesResponse
        /// </summary>
        /// <param name="data">Queries</param>
        /// <param name="response">Response</param>
        void ModifyResponse(PowerTablesData data, PowerTablesResponse response);
    }
}
