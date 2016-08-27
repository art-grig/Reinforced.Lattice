using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.ResponseProcessing;

namespace PowerTables.Plugins.Checkboxify
{
    /// <summary>
    /// Command handler for checkboxify plugin to make it support server-side selection. 
    /// Also used as command handlers mechanism test. 
    /// See <see cref="CheckboxifyExtensions"/> 
    /// </summary>
    public class CheckboxifyCommandHandler : ICommandHandler
    {
        private IQueryable<string> SelectCheckboxes(PowerTablesData data)
        {
            var column = data.Request.Query.AdditionalData["SelectionColumn"];
            var columnProp = data.Configuration.SourceType.GetProperty(column);
            var selection = LambdaHelpers.MemberExpression(columnProp);
            var q = ReflectionCache.CallSelect(data.Ordered, selection, data.Configuration.SourceType,
                columnProp.PropertyType);
            return q.Cast<object>().Select(c => c.ToString());
        }
        public ActionResult Handle(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            var ar = SelectCheckboxes(data).ToArray();
            return new JsonNetResult() { Data = ar, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public Task<ActionResult> HandleAsync(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            return Task.FromResult(Handle(data, responseModifiers));
        }

        public bool IsDeferable { get { return false; } }
    }
}
