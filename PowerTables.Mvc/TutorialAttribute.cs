using System;

namespace Reinforced.Lattice.DebugSink
{
    public class TutorialAttribute : Attribute
    {
        public string TutorialId { get; set; }

        public string TutorialTitle { get; set; }

        public int TutorialNumber { get; set; }

        public string[] AdditionalCodeFiles { get; set; }

        public TutorialAttribute(string tutorialTitle, params string[] additionalCodePath)
        {
            TutorialTitle = tutorialTitle;
            AdditionalCodeFiles = additionalCodePath;
        }

        public TutorialAttribute(string tutorialTitle, int partial, params string[] additionalCodePath)
        {
            TutorialTitle = tutorialTitle;
            AdditionalCodeFiles = additionalCodePath;
            Partial = partial;
        }

        public int Partial { get; set; }
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