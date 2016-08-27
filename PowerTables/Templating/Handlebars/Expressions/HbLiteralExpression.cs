namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbLiteralExpression : HbExpression
    {
        public string Literal { get; set; }

        public override string Build()
        {
            return Literal;
        }
    }
}
