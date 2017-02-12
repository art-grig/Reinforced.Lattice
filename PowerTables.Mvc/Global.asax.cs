using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Reinforced.Lattice.Templating;

namespace PowerTables.Mvc
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            TemplatesPageBase.DefaultTemplatesView = "~/Views/Shared/PowerTables_Templates.cshtml";
        }
    }
}
