namespace PowerTables.Templating.Expressions.Visiting
{
    class JsLiteralExpression : JsExpression
    {
        public string Literal { get; set; }

        public override string Build()
        {
            return Literal;
        }
    }
}
