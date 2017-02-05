namespace PowerTables.Templating.Expressions.Visiting
{
    class JsUnboundExpression : JsExpression
    {
        public JsExpression Boundee { get; set; }

        public bool IsEmpty { get; set; }

        public override string Build()
        {
            return Boundee == null ? (IsEmpty ? string.Empty : "<unbound>") : Boundee.Build();
        }
    }
}
