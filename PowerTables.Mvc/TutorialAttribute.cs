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

        public string[] AdditionalCodeFiles { get; set; }

        public TutorialAttribute(string tutorialTitle, int tutorialNumber, params string[] additionalCodePath)
        {
            TutorialTitle = tutorialTitle;
            TutorialNumber = tutorialNumber;
            AdditionalCodeFiles = additionalCodePath;
        }
    }

    public class Code
    {
        public string File { get; set; }

        public string Id { get; set; }

        public string Language { get; set; }

        public Code(string file, string language)
        {
            File = file;
            Language = language;
        }
    }
}