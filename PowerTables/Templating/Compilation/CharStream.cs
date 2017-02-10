using System.Collections.Generic;

namespace PowerTables.Templating.Compilation
{
    internal class CharStream
    {
        private readonly string _s;
        private int _pos;
        private long _totalPos;

        public int CurrentPosition { get { return _pos; } }

        public long TotalPosition { get { return _totalPos; } }


        public CharStream(string s, long totalPos, int startPos = 0)
        {
            _s = s;
            _totalPos = totalPos;
            _pos = startPos;
        }

        public bool Any { get { return _pos < _s.Length; } }

        public char Char()
        {
            var r = _s[_pos];
            _pos++;
            _totalPos++;
            if (_pos + 1 < _s.Length) CharAhead = _s[_pos + 1];
            else CharAhead = '\0';
            return r;
        }
        public char CharAhead { get; private set; }

        public IEnumerable<char> Chars
        {
            get
            {
                while (Any)
                {
                    yield return Char();
                }
            }
        }

        public void Skip(string s)
        {
            _pos += s.Length;
        }

        public bool Ahead(string[] strings)
        {
            foreach (var s in strings)
            {
                if (Ahead(s)) return true;
            }
            return false;
        }

        public bool SpaceAhead
        {
            get
            {
                return char.IsWhiteSpace(CharAhead);
            }
        }

        public bool DigitAhead
        {
            get
            {
                return char.IsDigit(CharAhead);
            }
        }

        public bool LetterAhead
        {
            get
            {
                return char.IsLetter(CharAhead);
            }
        }

        public bool Ahead(string lookup)
        {
            if (_s.Length - _pos < lookup.Length) return false;
            if (lookup.Length == 1) return _s[_pos] == lookup[0];

            int lp = 0;
            while (lp < lookup.Length && lp + _pos < _s.Length)
            {
                if (_s[lp + _pos] != lookup[lp]) return false;
                lp++;
            }
            return true;
        }
    }
}