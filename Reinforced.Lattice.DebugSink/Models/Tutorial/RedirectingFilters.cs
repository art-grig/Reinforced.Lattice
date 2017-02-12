using System.Linq;
using System.Web.Mvc;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Filters;
using Reinforced.Lattice.Filters.Select;
using Reinforced.Lattice.Filters.Value;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Plugins.Ordering;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
{
    public static partial class Tutorial
    {
        /*
         * You can "redirect" filters. E.g. use supplied filtering values 
         * and produce completely different data sets. 
         */
        public static Configurator<Toy, Row> RedirectingFilters(this Configurator<Toy, Row> conf)
        {
            conf.Filtering();
            conf.Column(c=>c.DeliveryDelay).DataOnly(false);
            conf.Column(c=>c.CreatedDate).DataOnly();
            conf.Column(c=>c.LastSoldDate).DataOnly();

            // Attach filter to "Sold" column that actually wil filter delivery delay
            conf.Column(c => c.ItemsSold).FilterValue(c => c.DeliveryDelay, ui => ui.Configuration.Placeholder = "Delivery delay!");

            conf.Column(c=>c.ResponsibleUserName).DataOnly(false);
            // Make "responsible" filter actually user's email
            conf.Column(c => c.ResponsibleUserName)
                .FilterValueBy((q, v) => q.Where(c => c.ResponsibleUser.Email.Contains(v)), ui => ui.Configuration.Placeholder = "Try jthomas7@last.fm");

            // Also instead of Filter*By you can user regular .Filter*(...).By

            // And lets create some really complex example
            conf.Column(c => c.SupplierAddress).Title("Select sort order").DataOnly(false);
            SelectListItem[] countries = new SelectListItem[]
            {
                new SelectListItem(){Text = "United States",Value = "0"}, 
                new SelectListItem(){Text = "China",Value = "1"}, 
                new SelectListItem(){Text = "Russia",Value = "2"}, 
                new SelectListItem(){Text = "Ukraine",Value = "3"},
                new SelectListItem(){Text = "Thailand",Value = "4"},
            };
            conf.Column(c => c.Price).OrderableUi(ui => ui.DefaultOrdering(Ordering.Neutral));
            conf.Column(c => c.SupplierAddress).FilterSelectUi(ui => ui.SelectItems(countries));
            conf.Column(c => c.SupplierAddress).FilterValueNoUiBy((query, country) =>
            {
                var q = query.AsEnumerable().OrderByDescending(v => v.SupplierAddress.Split(',')
                    .Select(s => s.IndexOf(country)).Max());
                return q.AsQueryable();

            })
                // Use .Value to extract filtering arguments from PT Query object
                // Use .RawValue to extract filtering argument from Raw filtering value for this particular cell
            .RawValue(rawVal =>
            {
                var country = countries.Where(c => c.Value == rawVal).Select(c => c.Text).FirstOrDefault();
                return country;
            });
            return conf;
        }
    }
}