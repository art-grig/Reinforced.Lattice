﻿using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Reinforced.Lattice.Templates;

namespace Reinforced.Lattice.DebugSink
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            TemplatesPageBase.DefaultTemplatesView = "~/Views/Shared/Lattice_Templates.cshtml";
        }
    }
}
