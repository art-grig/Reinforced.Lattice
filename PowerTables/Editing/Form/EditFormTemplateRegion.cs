using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Plugins.Toolbar;
using PowerTables.Templating;

namespace PowerTables.Editing.Form
{
    public class EditFormTemplateRegion<T> : PluginTemplateRegion, IModelProvider<IEditFormModel<T>>, IProvidesEventsBinding, IProvidesMarking
    {
        
        public string ExistingModel { get; private set; }

        public EditFormTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public interface IEditFormModel<TRow>
    {
        /// <summary>
        /// Data object 
        /// </summary>
        TRow DataObject { get; }
    }

    public static class EditFormExtensions
    {
        public static EditFormTemplateRegion<dynamic> Edit_Form(this IViewPlugins p, string templateId = "editForm")
        {
            return new EditFormTemplateRegion<dynamic>(p, templateId);
        }

        public static EditFormTemplateRegion<TRow> Edit_Form<TRow>(this IViewPlugins p, string templateId = "editForm")
        {
            return new EditFormTemplateRegion<TRow>(p, templateId);
        }

        public static MvcHtmlString BindCommit<TRow>(this  EditFormTemplateRegion<TRow> p, string eventId)
        {
            return p.BindEvent("commit", eventId);
        }

        public static MvcHtmlString BindReject<TRow>(this  EditFormTemplateRegion<TRow> p, string eventId)
        {
            return p.BindEvent("reject", eventId);
        }

        public static MvcHtmlString Editors<TRow>(this  EditFormTemplateRegion<TRow> p)
        {
            return MvcHtmlString.Create("{{{ Editors }}}");
        }

        public static MvcHtmlString EditorFor<TRow, TData>(this  EditFormTemplateRegion<TRow> p, Expression<Func<TRow, TData>> field)
        {
            var name = LambdaHelpers.ParsePropertyLambda(field).Name;
            return EditorFor(p, name);
        }

        public static MvcHtmlString EditorFor<TRow>(this  EditFormTemplateRegion<TRow> p, string fieldName)
        {
            return MvcHtmlString.Create(string.Format("{{{{{{Editor \"{0}\"}}}}}}", fieldName));
        }
    }
}
