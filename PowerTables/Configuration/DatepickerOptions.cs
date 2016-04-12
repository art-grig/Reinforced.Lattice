using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace PowerTables.Configuration
{
    /// <summary>
    /// Unified point of working with dates. 
    /// Server side uses standard CLR DateTime type and serializing/deserializing dates using ISO 8601 Date format
    /// Client-side uses standard jsDate objects and successfully parses/converts dates from/to server
    /// Datepickers may vary. So this piece of code is single point of 
    /// solving all datetime-related problems with datepickers
    /// </summary>
    public class DatepickerOptions
    {

        /// <summary>
        /// JS function or function name to turn specified HTML element to datepicker
        /// Signature: (element:HTMLElement, isNullableDate: boolean) => void
        /// </summary>
        public JRaw CreateDatePicker { get; private set; }

        /// <summary>
        /// JS function to provide datepicker with date from inside tables
        /// Signature: (element:HTMLElement, date?:Date) => void
        /// </summary>
        public JRaw PutToDatePicker { get; private set; }


        /// <summary>
        /// JS function used to retrieve selected date from datepicker
        /// Signature: (element:HTMLElement) => Date
        /// </summary>
        public JRaw GetFromDatePicker { get; private set; }

        public DatepickerOptions(string createDatepicker, string putToDatepicker, string getFromDatePicker)
        {
            if (string.IsNullOrEmpty(createDatepicker) || string.IsNullOrEmpty(putToDatepicker) ||
                string.IsNullOrEmpty(getFromDatePicker))
            {
                throw new Exception("All 3 datepicker-related function should be sprcified");
            }

            CreateDatePicker = new JRaw(createDatepicker);

            PutToDatePicker = new JRaw(putToDatepicker);

            GetFromDatePicker = new JRaw(getFromDatePicker);
        }
    }
}
