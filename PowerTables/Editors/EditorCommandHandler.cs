using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.ResponseProcessing;

namespace PowerTables.Editors
{
    class EditorCommandHandler : ICommandHandler
    {
        public ActionResult Handle(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult> HandleAsync(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            throw new NotImplementedException();
        }

        public bool IsDeferable { get { return false; } }
    }
}
