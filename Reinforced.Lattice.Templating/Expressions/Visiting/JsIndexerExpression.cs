namespace Reinforced.Lattice.Templates.Expressions.Visiting
{
    class JsIndexerExpression : JsExpression
    {
        public JsExpression ExpressionToIndex { get; set; }

        public JsExpression Index { get; set; }
        public override string Build()
        {
            return string.Format("{0}[{1}]", ExpressionToIndex.Build(), Index.Build());
        }
    }
}
