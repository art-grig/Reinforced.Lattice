using System;
using System.Collections.Generic;

namespace Reinforced.Lattice.CellTemplating
{
    public static class SwitchExtensions
    {
        /// <summary>
        /// Specifies template for single condition
        /// </summary>
        /// <param name="caseExpression">Case `{@}`-expression</param>
        /// <param name="template">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public static SwitchBuilder When(this SwitchBuilder x, string caseExpression, Action<Template> content)
        {
            Template tpl = new Template();
            content(tpl);
            return x.When(caseExpression, tpl.Compile("v", x._objectProperty, x._defaultProperty));
        }
        

        

        /// <summary>
        /// Specifies template for default condition
        /// </summary>
        /// <param name="content">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public static SwitchBuilder Default(this SwitchBuilder x, Action<Template> content)
        {
            Template tpl = new Template();
            content(tpl);
            return x.Default(tpl.Compile("v", x._objectProperty, x._defaultProperty));
        }

        

        

        
        /// <summary>
        /// Specifies template builders for several cases
        /// </summary>
        /// <typeparam name="T">Case option element type</typeparam>
        /// <param name="options">Set of available options for cases</param>
        /// <param name="expression">Case `{@}`-expression builder for every option</param>
        /// <param name="template">Template builder for every option</param>
        /// <returns></returns>
        public static SwitchBuilder Cases<T>(this SwitchBuilder x, IEnumerable<T> options, Func<T, string> expression, Action<Template, T> template)
        {
            foreach (var option in options)
            {
                Template tpl = new Template();
                template(tpl, option);
                x.When(expression(option), tpl.Compile("v", x._objectProperty, x._defaultProperty));
            }
            return x;
        }


        /// <summary>
        /// Specifies template builders for several cases
        /// </summary>
        /// <typeparam name="T">Case option element type</typeparam>
        /// <param name="options">Set of available options for cases</param>
        /// <param name="expression">Case `{@}`-expression builder for every option</param>
        /// <param name="template">Template builder for every option</param>
        /// <returns></returns>
        public static SwitchBuilder Cases<T>(this SwitchBuilder x, IEnumerable<T> options, Func<T, string> expression, Func<T, string> template)
        {
            foreach (var option in options)
            {
                x.When(expression(option), String.Format("'{0}'", template(option)));
            }
            return x;
        }


        

        /// <summary>
        /// Adds switch Switch operator to templating function
        /// </summary>
        /// <param name="expression">Expression to switch</param>
        /// <param name="swtch">Switch builder action</param>
        /// <returns></returns>
        public static CellTemplateBuilder Switch(this CellTemplateBuilder x, string expression, Action<SwitchBuilder> swtch)
        {
            SwitchBuilder swb = new SwitchBuilder(expression, x.Flow.ObjectProperty, x.Flow.DefaultProperty);
            swtch(swb);
            x.Flow.Line(swb.Build());
            return x;
        }


        

        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <param name="swtch">Switch to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder SwitchIfNotPresent(this CellTemplateBuilder x, string expression, string switchExpression, Action<SwitchBuilder> swtch)
        {
            return x.SwitchIf(string.Format("(({0})==null)||(({0})==undefined)", expression), switchExpression, swtch);
        }

        

        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <param name="switchExpression">Switch expression</param>
        /// <param name="swtch">Switch to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder SwitchIf(this CellTemplateBuilder x, string expression, string switchExpression, Action<SwitchBuilder> swtch)
        {
            SwitchBuilder swb = new SwitchBuilder(switchExpression, x.Flow.ObjectProperty, x.Flow.DefaultProperty);
            swtch(swb);
            expression = CellTemplating.Template.CompileExpression(expression, "v", x.Flow.ObjectProperty, x.Flow.DefaultProperty);
            var line = string.Format("if ({0}) {{ {1} }} ", expression, swb.Build());
            x.Flow.Line(line);
            return x;
        }

        
    }
}
