﻿using System.Web.Mvc;

namespace Reinforced.Lattice.DebugSink
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
