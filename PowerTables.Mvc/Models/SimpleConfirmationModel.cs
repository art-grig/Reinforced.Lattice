using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Models
{
    public class SimpleConfirmationModel
    {
        public string ToyName { get; set; }

        public ToyType ToyType { get; set; }
    }
}