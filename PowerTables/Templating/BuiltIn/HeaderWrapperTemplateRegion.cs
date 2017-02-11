using System.IO;
using PowerTables.Configuration.Json;

namespace PowerTables.Templating.BuiltIn
{
    public class HeaderWrapperTemplateRegion
        : ModeledTemplateRegion<IColumnHeader>, IProvidesContent, IProvidesColumnContent
    {
        public HeaderWrapperTemplateRegion(string prefix, string id, ITemplatesScope writer) : base(TemplateRegionType.Header, prefix, id, writer)
        {
        }
    }

    /// <summary>
    /// Column header model interface
    /// </summary>
    public interface IColumnHeader
    {
        /// <summary>
        /// Column
        /// </summary>
        IColumn Column { get; }
    }

    /// <summary>
    /// Column model interface
    /// </summary>
    public interface IColumn
    {
        /// <summary>
        /// Raw column name
        /// </summary>
        string RawName { get; }

        /// <summary>
        /// Column header
        /// </summary>
        IColumnHeader Header { get; }

        /// <summary>
        /// Order
        /// </summary>
        int Order { get; }

        /// <summary>
        /// Column configuration
        /// </summary>
        ColumnConfiguration Configuration { get; }

        /// <summary>
        /// True when column holds DateTime values
        /// </summary>
        bool IsDateTime { get; }

        /// <summary>
        /// True when column holds Integer numbers
        /// </summary>
        bool IsInteger { get; }

        /// <summary>
        /// True when column holds floating point
        /// </summary>
        bool IsFloat { get; }

        /// <summary>
        /// True when column holds strings
        /// </summary>
        bool IsString { get; }

        /// <summary>
        /// True when column holds enum values
        /// </summary>
        bool IsEnum { get; }

        /// <summary>
        /// True when column holds boolean
        /// </summary>
        bool IsBoolean { get; }
    }

    public static class HeaderTemplatingExtensions
    {
        public static HeaderWrapperTemplateRegion HeaderWrapper(this ITemplatesScope t, string templateId = "headerWrapper")
        {
            return new HeaderWrapperTemplateRegion(t.TemplatesPrefix, templateId, t);
        }
    }
}
