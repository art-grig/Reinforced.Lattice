﻿namespace Reinforced.Lattice
{
    public interface ITokenStorage
    {
        LatticeRequest Lookup(string token);
        string StoreRequest(LatticeRequest request);
    }
}
