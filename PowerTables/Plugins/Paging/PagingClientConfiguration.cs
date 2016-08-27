namespace PowerTables.Plugins.Paging
{
    /// <summary>
    /// Client configuration for Paging plugin. 
    /// See <see cref="PagingExtensions"/>
    /// </summary>
    public class PagingClientConfiguration : IProvidesTemplate
    {
        public bool ArrowsMode { get; set; }

        public bool UsePeriods { get; set; }

        public int PagesToHideUnderPeriod { get; set; }

        public bool UseFirstLastPage { get; set; }

        public bool UseGotoPage { get; set; }

        public bool EnableClientPaging { get; set; }

        public string DefaultTemplateId { get { return "paging"; } }
    }
}
