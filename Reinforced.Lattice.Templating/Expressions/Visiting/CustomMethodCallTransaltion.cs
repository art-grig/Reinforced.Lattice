using System;
using System.Reflection;

namespace Reinforced.Lattice.Templating.Expressions.Visiting
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
