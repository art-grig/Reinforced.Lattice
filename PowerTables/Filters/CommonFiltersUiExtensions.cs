using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Filters
{

    public interface IHideableFilter
    {
        /// <summary>
        /// When true, filter UI is not being rendered but client query modifier persists
        /// </summary>
        bool Hidden { get; set; }
    }

    public static class CommonFiltersUiExtensions
    {
        /// <summary>
        /// Hides filter from the UI. Filtering functionality persists
        /// </summary>
        /// <param name="c"></param>
        /// <param name="hide">When true, filter will be hidden</param>
        /// <returns></returns>
        public static T HideFilter<T>(this T c, bool hide = true) where T : IHideableFilter
        {
            c.Hidden = hide;
            return c;
        }
    }
}
