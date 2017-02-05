namespace PowerTables.Templating.Expressions.Visiting
{
    class JsTernaryExpression : JsExpression
    {
        public JsExpression Condition { get; set; }

        public JsExpression IfTrue { get; set; }

        public JsExpression IfFalse { get; set; }

        public override string Build()
        {
            return string.Format("(({0})?({1}):({2}))", Condition.Build(), IfTrue.Build(), IfFalse.Build());
        }
    }
}
