using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Reinforced.Lattice.CaseStudies.GettingItWorking.Data
{
    public class DataService<T>
    {
        private static List<T> _objects;
        private static object _locker = new object();

        public DataService(string dataLocation)
        {
            DataLocation = dataLocation;
        }

        public string DataLocation { get; set; }

        public IQueryable<T> GetAllData()
        {
            if (_objects == null)
            {
                lock (_locker)
                {
                    if (_objects == null)
                    {
                        _objects = JsonConvert.DeserializeObject<List<T>>(File.ReadAllText(DataLocation),
                            new IsoDateTimeConverter());
                    }
                }
                
            }
            return _objects.AsQueryable();
        }
    }
}