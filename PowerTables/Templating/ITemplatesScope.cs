using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating
{
    public interface ITemplatesScope
    {
        TextWriter Output { get; }

        string TemplatesPrefix { get; }

        IViewPlugins Plugin { get; }
    }
}
