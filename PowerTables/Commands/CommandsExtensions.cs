using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using PowerTables.Configuration;

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
            cmd.Description.CanExecute = new JRaw(string.Format("function(data) {{ if (data.Subject==null||data.Subject==undefined) return {1};  return ({0}); }}", ex,canExecuteByDefault?"true":"false"));
            return cmd;
        }
    }
}
