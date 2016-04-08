using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;

namespace PowerTables.Templating.BuiltIn
{
    public class HeaderTemplateRegion
        : ModeledTemplateRegion<IColumnHeader>,
        IProvidesTracking, IProvidesContent, IProvidesColumnContent
    {
        public HeaderTemplateRegion(string prefix, TextWriter writer)
            : base(prefix, "headerWrapper", writer)
        {
        }

        public bool IsTrackSet { get; set; }
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
    }

    public static class HeaderTemplatingExtensions
    {
        public static HeaderTemplateRegion HeaderWrapper(this TemplatesPageBase t)
        {
            return new HeaderTemplateRegion(t.Model.Prefix, t.Output);
        }
    }
}
