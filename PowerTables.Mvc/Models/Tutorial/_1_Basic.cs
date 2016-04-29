using System;
using System.ComponentModel.DataAnnotations;
using PowerTables.Configuration;
using PowerTables.FrequentlyUsed;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        /*
         * Table is operating on 2 classes - 
         * Source data (here it is Toy type) is your DB/raw data type
         * Table data (here it is Row type) is our table row ViewModel
         * 
         * For sure you can use Configurator<Toy,Toy> but in practice 
         * displayed data differs from source data in 80% of cases
         */
        public static Configurator<Toy, Row>Basic(this Configurator<Toy, Row> conf)
        {
            /*
             * Use .MappedFrom to map data from columns in source data type
             */

            conf.Column(c => c.Name).MappedFrom(c => c.ToyName);
            conf.Column(c => c.ResponsibleUserName).MappedFrom(c => c.ResponsibleUser.FirstName + " " + c.ResponsibleUser.LastName);
            conf.Column(c => c.ResponsibleUserId).MappedFrom(c => c.ResponsibleUser.Id);
            conf.Column(c => c.Preorders).MappedFrom(c => c.PreordersCount);
            conf.Column(c => c.TypeOfToy).MappedFrom(c => c.GroupType);

            /*
             * All the columns can be reference by them RawName that corresponds to C# proprty name
             * No columns numeric IDs
             * Event in client side columns are referenced by names
             * Columns order stays same as declared in C# Table data class
             * So, to move column just move property in Table data C# class source up or down and 
             * rebuild your project
             */

            /*
             * Basic tutorial is not about cells templating, but lets add template for date columns
             * Just make your eyes not bleed
             */
            conf.Column(c => c.CreatedDate).FormatDateWithDateformatJs("dd mmm yyyy");
            conf.Column(c => c.LastSoldDate).FormatDateWithDateformatJs("dd mmm yyyy");
            return conf;
        }
    }

    #region Data classes
    public class BaseGood
    {
        public int DeliveryDelay { get; set; }
    }

    public class Row : BaseGood
    {
        public int Id { get; set; }
        public ToyType TypeOfToy { get; set; }
        public string Name { get; set; }
        public int ItemsSold { get; set; }
        public int ItemsLeft { get; set; }
        public int ItemsWasInitially { get; set; }
        public double Price { get; set; }
        public bool IsPaid { get; set; }
        public State State { get; set; }
        public int? Preorders { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastSoldDate { get; set; }
        public int ResponsibleUserId { get; set; }
        public string ResponsibleUserName { get; set; }
        public string SupplierAddress { get; set; }
    }

    public enum ToyType
    {
        [Display(Name = "Action figures")]
        ActionFigures,
        Animals,
        [Display(Name = "Cars and RC")]
        CarsAndRc,
        Construction,
        Creative,
        Dolls,
        Educational,
        Electronic ,
        Executive,
        [Display(Name = "Food-related")]
        FoodRelated,
        Games,
        [Display(Name = "Board games")]
        BoardGames,
        [Display(Name = "Model building")]
        ModelBuilding,
        [Display(Name = "Phys. activity")]
        PhysicalActivity,
        Puzzle,
        Science,
        Sound,
        Spinning,

    }

    public enum State : byte
    {
        InWarehouse,
        Arrived,
        Preordered,
        Shipping,
        Sold
    }

    public class Toy
    {
        public int Id { get; set; }
        public ToyType GroupType { get; set; }
        public string ToyName { get; set; }
        public int ItemsSold { get; set; }
        public int ItemsLeft { get; set; }
        public double Price { get; set; }
        public bool Paid { get; set; }
        public byte StateCode { get; set; }
        public int? PreordersCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastSoldDate { get; set; }
        public int DeliveryDelay { get; set; }
        public ManagerUser ResponsibleUser { get; set; }
        public string SupplierAddress { get; set; }
        public Toy Clone()
        {
            return new Toy()
            {
                Id = Id,
                Price = Price,
                CreatedDate = CreatedDate,
                DeliveryDelay = DeliveryDelay,
                GroupType = GroupType,
                ItemsSold = ItemsSold,
                Paid = Paid,
                LastSoldDate = LastSoldDate,
                PreordersCount = PreordersCount,
                ToyName = ToyName,
                ResponsibleUser = ResponsibleUser
            };
        }
    }

    public class ManagerUser
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public DateTime Registered { get; set; }
    }
    #endregion
}