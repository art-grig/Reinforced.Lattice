using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.WebPages;
using Newtonsoft.Json.Linq;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Editing;
using PowerTables.Editing.Form;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Commands
{
    public static class CommandsExtensions
    {
        public static T Command<T>(this T conf, string commandName, Action<CommandDescriptionConfigurator> configuration)
            where T : IConfigurator
        {
            if (commandName == "Edit") throw new Exception("'Edit' is reserved command name. Please change another name for your commands");
            if (commandName == "query") throw new Exception("'query' is reserved command name. Please change another name for your commands");

            CommandDescription cd = null;
            if (!conf.TableConfiguration.Commands.ContainsKey(commandName))
            {
                cd = new CommandDescription() { Name = commandName, Type = CommandType.Server };
                conf.TableConfiguration.Commands[commandName] = cd;
            }
            else
            {
                cd = conf.TableConfiguration.Commands[commandName];
            }
            CommandDescriptionConfigurator cnf = new CommandDescriptionConfigurator(cd);
            configuration(cnf);
            return conf;
        }

        public static CommandDescriptionConfigurator ClientFunction(this CommandDescriptionConfigurator cmd, string clientFunction)
        {
            cmd.Description.Type = CommandType.Client;
            cmd.Description.ClientFunction = new JRaw(clientFunction);
            return cmd;
        }

        public static CommandDescriptionConfigurator OnSuccess(this CommandDescriptionConfigurator cmd, string function)
        {
            cmd.Description.OnSuccess = new JRaw(function);
            return cmd;
        }

        public static CommandDescriptionConfigurator OnFailure(this CommandDescriptionConfigurator cmd, string function)
        {
            cmd.Description.OnFailure = new JRaw(function);
            return cmd;
        }

        public static CommandDescriptionConfigurator CanExecute(this CommandDescriptionConfigurator cmd, string function)
        {
            cmd.Description.CanExecute = new JRaw(function);
            return cmd;
        }

        public static CommandDescriptionConfigurator CanExecuteExpression(this CommandDescriptionConfigurator cmd, string expression, bool canExecuteByDefault = true)
        {
            var ex = CellTemplating.Template.CompileExpression(expression, "data.Subject", "data", string.Empty);
            cmd.Description.CanExecute = new JRaw(string.Format("function(data) {{ if (data.Subject==null||data.Subject==undefined) return {1};  return ({0}); }}", ex, canExecuteByDefault ? "true" : "false"));
            return cmd;
        }

        public static CommandDescriptionConfigurator ConfirmationDataFunction(this CommandDescriptionConfigurator cmd, string function)
        {
            cmd.Description.Confirmation = null;
            cmd.Description.ConfirmationDataFunction = new JRaw(function);
            return cmd;
        }

        public static CommandDescriptionConfigurator Window<T>(this CommandDescriptionConfigurator c,
            string templateId, string targetSelector, Action<CommandConfirmationConfigurator<T>> conf)
        {
            if (c.Description.Confirmation == null) c.Description.Confirmation = new ConfirmationConfiguration();
            c.Description.Confirmation.TemplateId = templateId;
            c.Description.Confirmation.TargetSelector = targetSelector;
            var x = new CommandConfirmationConfigurator<T>(c.Description.Confirmation);
            conf(x);
            return c;
        }


        public static CommandConfirmationConfigurator<T> InitConfirmationObjectWith<T>(this CommandConfirmationConfigurator<T> c, string function)
        {
            c.Configuration.InitConfirmationObject = new JRaw(function);
            return c;
        }


        public static CommandConfirmationConfigurator<T> ContentUrl<T>(this CommandConfirmationConfigurator<T> c, string url)
        {
            c.Configuration.ContentLoadingCommand = null;
            c.Configuration.ContentLoadingUrl = new JRaw(string.Format("function(a) {{ return '{0}';}}", url));
            return c;
        }

        public static CommandConfirmationConfigurator<T> ContentUrlExpression<T>(this CommandConfirmationConfigurator<T> c, string expression)
        {
            c.Configuration.ContentLoadingCommand = null;
            CellTemplateBuilder ctb = new CellTemplateBuilder(null, null);
            ctb.Returns(expression);
            c.Configuration.ContentLoadingUrl = new JRaw(ctb.Build());
            return c;
        }


        public static CommandConfirmationConfigurator<T> ContentCommand<T>(this CommandConfirmationConfigurator<T> c, string commandName)
        {
            c.Configuration.ContentLoadingCommand = commandName;
            c.Configuration.ContentLoadingUrl = null;
            return c;
        }


        public static CommandConfirmationConfigurator<T> OnDismiss<T>(this CommandConfirmationConfigurator<T> cmd, string function)
        {
            cmd.Configuration.OnDismiss = new JRaw(function);
            return cmd;
        }

        public static CommandConfirmationConfigurator<T> OnCommit<T>(this CommandConfirmationConfigurator<T> cmd, string function)
        {
            cmd.Configuration.OnCommit = new JRaw(function);
            return cmd;
        }


        public static CommandConfirmationConfigurator<T> WatchForm<T>(this CommandConfirmationConfigurator<T> cmd, Action<FormWatchBuilder<T>> formWatchConfig)
        {
            FormWatchBuilder<T> bld = new FormWatchBuilder<T>();
            formWatchConfig(bld);
            cmd.Configuration.Formwatch = bld.ClientConfig.FieldsConfiguration;
            return cmd;
        }

        public static CommandConfirmationConfigurator<T> AutoForm<T>(this CommandConfirmationConfigurator<T> cmd, Action<EditHandlerConfiguration<T, ConfirmationFormConfig>> form)
        {

            if (cmd.Configuration.Autoform == null) cmd.Configuration.Autoform = new CommandAutoformConfiguration();
            EditHandlerConfiguration<T, ConfirmationFormConfig> c = new EditHandlerConfiguration<T, ConfirmationFormConfig>();
            c.FormClientConfig.AutoformConfig.DisableWhenContentLoading = cmd.Configuration.Autoform.DisableWhenContentLoading;
            c.FormClientConfig.AutoformConfig.DisableWhileDetailsLoading = cmd.Configuration.Autoform.DisableWhileDetailsLoading;
            form(c);
            cmd.Configuration.Autoform.Autoform = c.FormClientConfig.Fields;
            cmd.Configuration.Autoform.DisableWhenContentLoading = c.FormClientConfig.AutoformConfig.DisableWhenContentLoading;
            cmd.Configuration.Autoform.DisableWhileDetailsLoading = c.FormClientConfig.AutoformConfig.DisableWhileDetailsLoading;
            return cmd;
        }

        public static EditHandlerConfiguration<T, ConfirmationFormConfig> DisableWhen<T>(
            this EditHandlerConfiguration<T, ConfirmationFormConfig> c, bool contentLoading = false,
            bool detailsLoading = false)
        {
            c.FormClientConfig.AutoformConfig.DisableWhenContentLoading = contentLoading;
            c.FormClientConfig.AutoformConfig.DisableWhileDetailsLoading = contentLoading;
            return c;
        }

        public static CommandConfirmationConfigurator<T> Details<T>(this CommandConfirmationConfigurator<T> c,
            Action<ConfirmationDetailsConfigurator> configuration)
        {
            if (c.Configuration.Details == null) c.Configuration.Details = new DetailLoadingConfiguration();
            ConfirmationDetailsConfigurator cd = new ConfirmationDetailsConfigurator(c.Configuration.Details);
            configuration(cd);
            return c;
        }

        public static ConfirmationDetailsConfigurator LoadImmediately(this ConfirmationDetailsConfigurator c,
            bool load = true)
        {
            c.Configuration.LoadImmediately = load;
            return c;
        }

        public static ConfirmationDetailsConfigurator Debounce(this ConfirmationDetailsConfigurator c, int delay)
        {
            c.Configuration.LoadDelay = delay;
            return c;
        }

        public static ConfirmationDetailsConfigurator FromCommand(this ConfirmationDetailsConfigurator c, string commandName)
        {
            c.Configuration.DetailsFunction = null;
            c.Configuration.CommandName = commandName;
            return c;
        }

        public static ConfirmationDetailsConfigurator FromFunction(this ConfirmationDetailsConfigurator c, string function)
        {
            c.Configuration.DetailsFunction = new JRaw(function);
            c.Configuration.CommandName = null;
            return c;
        }

        public static ConfirmationDetailsConfigurator ValidateBeforeLoad(this ConfirmationDetailsConfigurator c, string function)
        {
            c.Configuration.ValidateToLoad = new JRaw(function);
            return c;
        }


        public static ConfirmationDetailsConfigurator TemplateId(this ConfirmationDetailsConfigurator c, string templateId)
        {
            c.Configuration.TempalteId = templateId;
            return c;
        }

        public static CommandConfirmationConfigurator<T> Part<T>(this CommandConfirmationConfigurator<T> cmd, string templatePiece, Action<CellTemplateBuilder> template)
        {
            CellTemplateBuilder ctb = new CellTemplateBuilder(null, null);
            template(ctb);
            cmd.Configuration.TemplatePieces[templatePiece] = new JRaw(ctb.Build());
            return cmd;
        }

        public static CommandConfirmationConfigurator<T> RazorPart<T>(this CommandConfirmationConfigurator<T> cmd, string templatePiece, Func<object, HelperResult> content)
        {
            return cmd.Part(templatePiece, x => x.Razor(content));
        }
    }

    public class ConfirmationFormConfig : EditFormUiConfigBase
    {
        internal CommandAutoformConfiguration AutoformConfig { get; set; }
    }
}
