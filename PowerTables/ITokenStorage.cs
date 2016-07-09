using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables
{
    public interface ITokenStorage
    {
        PowerTableRequest Lookup(string token);
        string StoreRequest(PowerTableRequest request);
    }
}
