namespace PowerTables.ResponseProcessing
{
    /// <summary>
    /// Response modifier applier API. 
    /// Some plugins use ResponseModifier mechanism to provide generated tables data response 
    /// with some custom data (usually - AdditionalData). 
    /// This behavior should also interact with custom user's commands handling to do not lose additional plugins data. 
    /// So here IResponseModifiersApplier comes. Each custom user's command handler is provided with instance of 
    /// this interface. And in case of user producing him own Result then he should call ApplyResponseModifiers 
    /// to make plugins append additional data to it. 
    /// </summary>
    public interface IResponseModifiersApplier
    {
        /// <summary>
        /// Calls response modifiers from plugins on supplied response with supplied data. 
        /// </summary>
        /// <param name="data">Evaluated data</param>
        /// <param name="response">Response</param>
        void ApplyResponseModifiers(PowerTablesData data, PowerTablesResponse response);
    }
}
