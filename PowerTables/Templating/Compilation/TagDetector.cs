using System.Collections.Generic;
using System.Text;

namespace PowerTables.Templating.Compilation
{
    internal class TagDetector
    {
        internal int TagStackDeep { get; private set; }
        private long _currentPos = 0;
        private Stack<TdState> _statesStack = new Stack<TdState>();

        private TdState CurrentState
        {
            get { return _statesStack.Peek(); }
            set { _statesStack.Push(value); }
        }

        public TagDetector()
        {
            CurrentState = TdState.AwaitOpenTagStart;
        }

        private readonly StringBuilder _tagBodyAccumulator = new StringBuilder(10, 10);

        internal void Feed(string s, int pos)
        {
            var stream = new CharStream(s, _currentPos, pos);
            State(stream);
        }

        internal void AwaitOpenTagStart(CharStream s)
        {
            foreach (var c in s.Chars)
            {
                if (c == '<')
                {
                    if (s.Ahead("!--")) { CurrentState = TdState.AwaitCommentClose; break; }
                    if (s.Ahead("script")) { CurrentState = TdState.AwaitCloseScript; break; }
                    if (s.LetterAhead) { CurrentState = TdState.AwaitTagName; break; }
                }
            }
            State(s);
        }

        private void Pop()
        {
            _statesStack.Pop();
        }

        private void State(CharStream s)
        {
            if (!s.Any) return;
            switch (CurrentState)
            {
                case TdState.AwaitCommentClose: FeedAwaitCommentClose(s); break;
                case TdState.AwaitCloseScript: FeedAwaitCloseScript(s); break;
                case TdState.AwaitTagName: FeedAwaitTagName(s); break;
                case TdState.AwaitOpenTagFinish: FeedAwaitOpenTagFinish(s); break;
                case TdState.AwaitTagAttribute: FeedAwaitTagAttribute(s); break;
                case TdState.AwaitTagAttributeValue: FeedAwaitTagAttributeValue(s); break;
            }
        }

        private char _attributeQuote = '\0';
        private void FeedAwaitTagAttributeValue(CharStream s)
        {
            foreach (var c in s.Chars)
            {
                if (s.LetterAhead)
                {
                    if (_attributeQuote == '\0') _attributeQuote = c;
                }

            }
            State(s);
        }

        private void FeedAwaitTagAttribute(CharStream s)
        {
            foreach (var c in s.Chars)
            {
                if (char.IsWhiteSpace(c))
                {
                    if (s.CharAhead == '=') { CurrentState = TdState.AwaitTagAttributeValue; break;}
                    if (s.LetterAhead) { Pop(); CurrentState = TdState.AwaitTagAttribute; break;}
                }
            }
            State(s);
        }

        private void FeedAwaitOpenTagFinish(CharStream s)
        {
            foreach (var c in s.Chars)
            {
                if (s.LetterAhead) { CurrentState = TdState.AwaitTagAttribute; break; }
                _tagBodyAccumulator.Append(c);
            }
            State(s);
        }

        private void FeedAwaitTagName(CharStream s)
        {
            foreach (var c in s.Chars)
            {
                if (s.SpaceAhead)
                {
                    _tagBodyAccumulator.Append(c);
                    //todo tagopen event here
                    var openedTag = _tagBodyAccumulator.ToString();
                    _tagBodyAccumulator.Clear();
                    TagStackDeep++;
                    CurrentState = TdState.AwaitOpenTagFinish;
                    break;
                }
                _tagBodyAccumulator.Append(c);
            }
            State(s);
        }

        private void FeedAwaitCloseScript(CharStream s)
        {
            s.Skip("script");
            foreach (var c in s.Chars)
            {
                if (c == '<')
                {
                    if (s.Ahead("/script>")) { Pop(); break; }
                }
            }
            State(s);
        }

        private void FeedAwaitCommentClose(CharStream s)
        {
            s.Skip("!--");
            foreach (var c in s.Chars)
            {
                if (c == '-')
                {
                    if (s.Ahead("-->")) { Pop(); break; }
                }
            }
            State(s);
        }

    }

    internal enum TdState
    {
        AwaitOpenTagStart,
        AwaitTagName,
        AwaitTagAttribute,
        AwaitTagAttributeValue,
        AwaitOpenTagFinish,

        AwaitCloseTagMark,
        AwaitCloseTagBody,
        AwaitCloseScript,
        AwaitCommentClose
    }
}
