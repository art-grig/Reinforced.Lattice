namespace PowerTables
{
    public interface ITokenStorage
    {
        LatticeRequest Lookup(string token);
        string StoreRequest(LatticeRequest request);
    }
}
