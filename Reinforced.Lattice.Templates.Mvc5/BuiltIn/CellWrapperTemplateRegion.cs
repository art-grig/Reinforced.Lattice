﻿using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.BuiltIn
{
    public class CellWrapperTemplateRegion<T> : ModeledTemplateRegion<ICellModel<T>>,
        IProvidesContent
    {
        public CellWrapperTemplateRegion(string prefix, string id, ITemplatesScope writer) : base(TemplateRegionType.Cell, prefix, id, writer)
        {
        }
    }

    public interface ICellModel
    {
        /// <summary>
        /// Column related to cell
        /// </summary>
        IColumn Column { get; }

        /// <summary>
        /// Data for this particular cell
        /// </summary>
        object Data { get; }

        [OverrideTplFieldName("DataObject")]
        IJsDictionary<string, string> DO { get; }

        /// <summary>
        /// True when this cell is selected, false otherwise.
        /// Warning! Do not mess with Row.IsSelected. 
        /// When row is selected then it does not mean that cell is selected.
        /// </summary>
        bool IsSelected { get; }

        /// <summary>
        /// True, when cell is updated during updating data in table
        /// </summary>
        bool IsUpdated { get; }

        /// <summary>
        /// True when row containing this cell was added during updating table
        /// </summary>
        bool IsAdded { get; }
    }

    /// <summary>
    /// Model interface for cell wrapper
    /// </summary>
    public interface ICellModel<T> : ICellModel
    {
        /// <summary>
        /// Row related to cell
        /// </summary>
        IRowModel<T> Row { get; }


        /// <summary>
        /// Data object
        /// </summary>
        [OverrideTplFieldName("DataObject")]
        T TDO { get; }

    }

    public static class CellWrapperExtensions
    {
        public static CellWrapperTemplateRegion<T> CellWrapper<T>(this ITemplatesScope t, string templateId = "cellWrapper")
        {
            return new CellWrapperTemplateRegion<T>(t.TemplatesPrefix, templateId, t);
        }

        public static CellWrapperTemplateRegion<object> CellWrapper(this ITemplatesScope t, string templateId = "cellWrapper")
        {
            return new CellWrapperTemplateRegion<object>(t.TemplatesPrefix, templateId, t);
        }
    }
}
