namespace PowerTables.Processing
{
    /// <summary>
    /// Response modifier interface exposes PowerTables extension point 
    /// that allows to modify response before sending to client. 
    /// Usually this interface is used to supply LatticeResponse with some 
    /// AdditionalData values. 
    /// See <see cref="LatticeResponse"/>
    /// </summary>
    public interface IResponseModifier
    {
        /// <summary>
        /// Method that performs modification of LatticeResponse
        /// </summary>
        /// <param name="data">Queries</param>
        /// <param name="response">Response</param>
        void ModifyResponse(LatticeData data, LatticeResponse response);
    }
}
