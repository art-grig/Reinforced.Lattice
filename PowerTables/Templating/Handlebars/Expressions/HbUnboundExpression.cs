namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbUnboundExpression : HbExpression
    {
        public HbExpression Boundee { get; set; }

        public bool IsEmpty { get; set; }

        public override string Build()
        {
            return Boundee == null ? (IsEmpty ? string.Empty : "<unbound>") : Boundee.Build();
        }
    }
}
