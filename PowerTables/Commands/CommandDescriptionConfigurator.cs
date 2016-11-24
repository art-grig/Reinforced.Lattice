using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Commands
{
    public class CommandDescriptionConfigurator
    {
        internal CommandDescription Description { get; set; }

        public CommandDescriptionConfigurator(CommandDescription description)
        {
            Description = description;
        }
    }
}
