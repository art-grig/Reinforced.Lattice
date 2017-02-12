namespace Reinforced.Lattice.Templating
{
    public interface IDeclarator
    {
        string Variable();
        string Iterator();
        string Key();
    }

    public class DeclaratorBase
    {
        private int _variablesDeclared = 0;

        private int _iteratorsDeclared = 0;

        private int _keysDeclared = 0;

        public string Variable()
        {
            _variablesDeclared++;
            return "_" + _variablesDeclared;
        }
        public string Iterator()
        {
            _iteratorsDeclared++;
            return "_i" + _iteratorsDeclared;
        }
        public string Key()
        {
            _keysDeclared++;
            return "_k" + _keysDeclared;
        }
    }
}
