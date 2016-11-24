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

    public class CommandConfirmationConfigurator<T>
    {
        internal ConfirmationConfiguration Configuration { get; set; }

        public CommandConfirmationConfigurator(ConfirmationConfiguration configuration)
        {
            Configuration = configuration;
        }
    }

    public class ConfirmationDetailsConfigurator
    {
        internal DetailLoadingConfiguration Configuration { get; set; }

        public ConfirmationDetailsConfigurator(DetailLoadingConfiguration configuration)
        {
            Configuration = configuration;
        }
    }
}
