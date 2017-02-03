using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.Handlebars
{
    public class ParametrizedCodeBlock<T>: CodeBlock, IModelProvider<T>, IProvidesEventsBinding
    {
        public ParametrizedCodeBlock(string header, string footer, IRawProvider raw, string existingModel = null) : base(header, footer, raw)
        {
            ExistingModel = existingModel;
        }

        public TextWriter Writer { get; }
        public virtual string ExistingModel { get; }
    }
}
