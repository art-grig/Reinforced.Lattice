using System;
using System.Reflection;

namespace PowerTables.Templating.Handlebars.Expressions
{
    [AttributeUsage(AttributeTargets.Method,AllowMultiple = false)]
    public class CustomMethodCallTranslationAttribute : Attribute
    {
        public MethodInfo TranslationFunction { get; private set; }

        public CustomMethodCallTranslationAttribute(Type translationClass,string translationMethodName)
        {
            TranslationFunction = translationClass.GetMethod(translationMethodName);
        }
    }
}
