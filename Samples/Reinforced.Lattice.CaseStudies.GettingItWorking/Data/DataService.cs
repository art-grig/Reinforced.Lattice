using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Reinforced.Lattice.CaseStudies.GettingItWorking.Data
{
    public class DataService<T>
    {
        private static List<T> _objects;

        public DataService(string dataLocation)
        {
            DataLocation = dataLocation;
        }

        public string DataLocation { get; set; }

        public IQueryable<T> GetAllData()
        {
            return _objects.AsQueryable();
        }

        public Type DataType { get { return typeof(T); } }

        public static void SetData(IList data)
        {
            _objects = (List<T>) data;
        }
    }
}