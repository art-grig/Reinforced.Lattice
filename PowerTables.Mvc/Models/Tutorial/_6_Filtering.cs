using System;
using System.Linq;
using System.Web.Mvc.Html;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Multi;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.FrequentlyUsed;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> Filtering(this Configurator<Toy, Row> conf)
        {
            conf.Pagination();
            conf.LoadImmediately(true);
            conf
                .DatePicker(new DatepickerOptions( // set up functions for 3rd party datepickers
                    "createDatePicker",
                    "putDateToDatepicker",
                    "getDateFromDatepicker"))
                .AppendEmptyFilters()              // tell table to draw empty filters for columns without filters
                                                   // it is needed when using table-look-like templating
                    ;
            
            // Value filter (single textbox) on Name column
            conf.Column(c => c.Name).FilterValue(c => c.ToyName, ui =>
            {
                ui.Configuration.DefaultValue = conf.ToFilterDefaultString("Jacks");
            });

            conf.Column(c => c.Price).FilterRange(c => c.Price, ui =>
            {
                ui.Configuration.FromPlaceholder = "> price";
                ui.Configuration.ToPlaceholder = "< price";
            });

            conf.Column(c => c.Preorders).Title("Preorders (pure client)").FilterRangeUi(ui =>
            {
                ui.Configuration.FromPlaceholder = "Min. Id";
                ui.Configuration.ToPlaceholder = "Max. Id";
                ui.Configuration.InputDelay = 50;
                ui.Configuration.ClientFiltering();
            });

            conf.Column(c => c.TypeOfToy).Title("Type (client, multiple)")
                .FilterMultiSelect(c => c.GroupType,
                    ui =>
                    {
                        ui.Configuration.SelectItems(EnumHelper.GetSelectList(typeof(ToyType)));
                        ui.Configuration.ClientFiltering();
                    });

            conf.Column(c => c.IsPaid).Title("Paid (server filter)").FilterBoolean(c => c.Paid, "Paid", "Unpaid", "Any");

            conf.Column(c => c.CreatedDate).FilterValue(c => c.CreatedDate); // datepicker will be added automatically

            /*
             * Ok, here should be few words said
             * When you specify source column and it is nullable then things become complicated,
             * so you can encounter null-related errors from time to time
             * 
             * In this case you should alter column filtering expression with null-coalescing (??) operator or with .GetValueOrDefault
             * to make it suitable for query provider. 
             * Otherwise, Lattice will alter your column expression (if it is nullable) with .Value property. It may not work for all 
             * query providers, so if you dont like this behavior use .By call and handle null values by yourself
             */
            conf.Column(c => c.LastSoldDate).FilterRange(c => c.LastSoldDate.GetValueOrDefault(),
                ui => ui.Configuration.RawDefault(
                    conf.ToFilterDefaultString(DateTime.Now.AddDays(-50)),
                    conf.ToFilterDefaultString(DateTime.Now))
                    );                                                      // filter by range of dates with default values


            /*
             * We hide unrelated columns just for convinence
             */
            conf.Column(c=>c.DeliveryDelay).DataOnly();
            conf.Column(c=>c.Id).DataOnly();
            conf.Column(c=>c.ResponsibleUserName).DataOnly();
            conf.Column(c=>c.ItemsWasInitially).DataOnly();
            return conf;
        }
    }
}