namespace PowerTables.Commands
{
    public class CommandDescriptionConfigurator
    {
        internal CommandDescription Description { get; set; }

        internal CommandDescriptionConfigurator(CommandDescription description)
        {
            Description = description;
        }
    }

    public class CommandConfirmationConfigurator
    {
        internal ConfirmationConfiguration Configuration { get; set; }

        internal CommandConfirmationConfigurator(ConfirmationConfiguration configuration)
        {
            Configuration = configuration;
        }
    }

    public class CommandConfirmationConfigurator<T> : CommandConfirmationConfigurator
    {
        internal CommandConfirmationConfigurator(ConfirmationConfiguration configuration)
            : base(configuration)
        {
        }
    }

    public class ConfirmationDetailsConfigurator
    {
        internal DetailLoadingConfiguration Configuration { get; set; }

        internal ConfirmationDetailsConfigurator(DetailLoadingConfiguration configuration)
        {
            Configuration = configuration;
        }
    }
}
