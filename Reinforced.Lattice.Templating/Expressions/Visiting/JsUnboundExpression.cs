namespace Reinforced.Lattice.Templating.Expressions.Visiting
{
    class JsUnboundExpression : JsExpression
    {
        public JsExpression Boundee { get; set; }

        public bool IsEmpty { get; set; }

        public string Name { get; set; }

        public JsUnboundExpression(string name)
        {
            Name = name;
        }

        public override string Build()
        {
            return Boundee == null ? (IsEmpty ? string.Empty : "<unbound>") : Boundee.Build();
        }
    }
}
