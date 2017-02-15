using System;
using System.Linq.Expressions;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.Editing.Form
{
    public class EditFormTemplateRegion<T> : PluginTemplateRegion, IModelProvider<IEditFormModel<T>>
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

        public static Inline BindCommit<TRow>(this  EditFormTemplateRegion<TRow> p, string eventId)
        {
            return p.BindEvent("commit", eventId);
        }

        public static Inline BindReject<TRow>(this  EditFormTemplateRegion<TRow> p, string eventId)
        {
            return p.BindEvent("reject", eventId);
        }

        public static Inline Editors<TRow>(this  EditFormTemplateRegion<TRow> p)
        {
            return p._("o.Editors(p);");
        }

        public static Inline EditorFor<TRow, TData>(this  EditFormTemplateRegion<TRow> p, Expression<Func<TRow, TData>> field)
        {
            var name = LambdaHelpers.ParsePropertyLambda(field).Name;
            return EditorFor(p, name);
        }

        public static Inline EditorFor<TRow>(this  EditFormTemplateRegion<TRow> p, string fieldName)
        {
            return p._("o.Editors(p,'{0}');",fieldName);
        }
    }
}
