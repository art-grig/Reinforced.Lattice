using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PowerTables.Plugins.Paging
{
    /// <summary>
    /// Client configuration for Paging plugin. 
    /// See <see cref="PagingExtensions"/>
    /// </summary>
    public class PagingClientConfiguration
    {
        public bool ArrowsMode { get; set; }

        public bool UsePeriods { get; set; }

        public int PagesToHideUnderPeriod { get; set; }

        public bool UseFirstLastPage { get; set; }

        public bool UseGotoPage { get; set; }
    }
}
