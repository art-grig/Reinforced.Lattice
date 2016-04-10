using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PowerTables.Mvc
{
    public class TutorialAttribute : Attribute
    {
        public string TutorialId { get; set; }

        public string TutorialTitle { get; set; }

        public int TutorialNumber { get; set; }

        public TutorialAttribute(string tutorialTitle, int tutorialNumber)
        {
            TutorialTitle = tutorialTitle;
            TutorialNumber = tutorialNumber;
        }
    }
}