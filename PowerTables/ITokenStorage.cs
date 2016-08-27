namespace PowerTables
{
    public interface ITokenStorage
    {
        PowerTableRequest Lookup(string token);
        string StoreRequest(PowerTableRequest request);
    }
}
