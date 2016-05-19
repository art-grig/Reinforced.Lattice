using System.Linq;
using PowerTables.Configuration;
using PowerTables.FrequentlyUsed;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> ProjectionTitlesAndDataOnly(this Configurator<Toy, Row> conf)
        {
            /* 
             * By default, Lattice is smart enough to map your data automatically
             * But for some cases passing projection (e.g. to EntityFramework)
             * can improve performance
             * And it is easier to track mappings from single place instead of
             * batches of .MappedFrom calls
             */
            conf.ProjectDataWith(c => c.Select(q => new Row()
            {
                Id = q.Id,
                Price = q.Price,
                CreatedDate = q.CreatedDate,
                TypeOfToy = (ToyType)q.GroupType,
                Name = q.ToyName,
                IsPaid = q.Paid,
                ItemsLeft = q.ItemsLeft,
                ItemsSold = q.ItemsSold,
                Preorders = q.PreordersCount ?? 0,
                LastSoldDate = q.LastSoldDate,
                DeliveryDelay = q.DeliveryDelay,
                ResponsibleUserId = q.ResponsibleUser.Id,
                ResponsibleUserName = q.ResponsibleUser.FirstName + " " + q.ResponsibleUser.LastName,
                State = (State)q.StateCode,
                SupplierAddress = q.SupplierAddress
            }));

            conf.Column(c => c.TypeOfToy).Title("Class");
            conf.Column(c => c.ItemsSold).Title("Sold");
            conf.Column(c => c.ItemsWasInitially).Title("Initial");
            conf.Column(c => c.IsPaid).Title("Paid");
            conf.Column(c => c.CreatedDate).Title("Created");
            conf.Column(c => c.LastSoldDate).Title("Last sell");
            conf.Column(c => c.ResponsibleUserName).Title("Responsible");
            conf.Column(c => c.SupplierAddress).Title("Supp. Address");
            conf.PrimaryKey(c => c.Include(v => v.Id));

            /* 
             * .DataOnly columns are passed to clien-side but are not displayed
             * Their purpose to be used in client-side per-row calculations
             * They present in client local storage and you can retrieve them e.g.
             * while templating cell, but they will never display
             */
            conf.Column(c => c.ItemsLeft).DataOnly();
            conf.Column(c => c.ResponsibleUserId).DataOnly();
            conf.Column(c => c.SupplierAddress).DataOnly(); // we hide it because it is long

            /*
             * We didnt use .Basec here, so I have to repeat dates displaying configuration
             */
            conf.Column(c => c.CreatedDate).FormatDateWithDateformatJs("dd mmm yyyy");
            conf.Column(c => c.LastSoldDate).FormatDateWithDateformatJs("dd mmm yyyy");
            return conf;
        }
    }
}