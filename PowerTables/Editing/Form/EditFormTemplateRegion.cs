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
using PowerTables.Templating.Expressions;

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
        public static EditFormTemplateRegion<IJsObject> Edit_Form(this IViewPlugins p, string templateId = "editForm")
        {
            return new EditFormTemplateRegion<IJsObject>(p, templateId);
        }

        public static EditFormTemplateRegion<TRow> Edit_Form<TRow>(this IViewPlugins p, string templateId = "editForm")
        {
            return new EditFormTemplateRegion<TRow>(p, templateId);
        }

        public static SpecialString BindCommit<TRow>(this  EditFormTemplateRegion<TRow> p, string eventId)
        {
            return p.BindEvent("commit", eventId);
        }

        public static SpecialString BindReject<TRow>(this  EditFormTemplateRegion<TRow> p, string eventId)
        {
            return p.BindEvent("reject", eventId);
        }

        public static SpecialString Editors<TRow>(this  EditFormTemplateRegion<TRow> p)
        {
            return p._("o.Editors(p);");
        }

        public static SpecialString EditorFor<TRow, TData>(this  EditFormTemplateRegion<TRow> p, Expression<Func<TRow, TData>> field)
        {
            var name = LambdaHelpers.ParsePropertyLambda(field).Name;
            return EditorFor(p, name);
        }

        public static SpecialString EditorFor<TRow>(this  EditFormTemplateRegion<TRow> p, string fieldName)
        {
            return p._("o.Editors(p,'{0}');",fieldName);
        }
    }
}
