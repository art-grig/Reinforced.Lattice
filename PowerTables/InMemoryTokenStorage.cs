using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace PowerTables
{
    /// <summary>
    /// It is token storage for deferred requests handling. 
    /// This construction allows to return FileResult and RedirectResult for handling commands. 
    /// So it is easy to implement functionality like export-to-excel and export-to-pdf. 
    /// This works in a following way:
    /// 1) Request handler sees that request should be handled and return FileResult or RedirectResult. 
    /// Otherwise here will be returned JSONed command result and nothing else. 
    /// But since no file nor redirect would take effect while returning to XMLHttpRequest, handler produces to next step.
    /// 2) Handler stores gathered request in dictionary, assigns it a Token and returns Token to client. 
    /// 3) Client looks up for "$Token" field in response and retrieves token
    /// 4) Client redirects browser with GET request to operational URL with ?q=%token%.
    /// 5) Table handler retrieves deferred request from dictionary, performs necessary operations 
    /// and returns FileResult or something else.
    /// </summary>
    public class InMemoryTokenStorage : ITokenStorage
    {
        public static InMemoryTokenStorage Instance { get; private set; }

        static InMemoryTokenStorage()
        {
            Instance = new InMemoryTokenStorage();
        }

        public const string TokenPrefix = "$Token=";

        private struct StoredRequest
        {
            public string Token;
            public DateTime ExpireDate;
        }
        private bool _isDirty = false;
        private readonly ConcurrentDictionary<string, LatticeRequest> StoredRequests = new ConcurrentDictionary<string, LatticeRequest>();
        private readonly List<StoredRequest> ExpirationTokens = new List<StoredRequest>();
        private bool _useSingleRequestTokens;

        /// <summary>
        /// Gets or sets tokens Time to Live. 
        /// Tokens cleanup routine occurs on every token lookup. 
        /// To avoid memory leaks tokens are being removed from time to time. 
        /// Setting up token TTL will instruct token storage to forget all tokens that 
        /// are older than supplied TTL.
        /// Warning! TTL is default behavior. Setting of <see cref="UseSingleRequestTokens"/> to true will disable tokens TTL mechanism!
        /// </summary>
        public TimeSpan TokenTimeToLive { get; set; }

        /// <summary>
        /// Instructs TokenStorage to assure tokens to be used only one time without saving them. 
        /// Requested token will be rogrotten right after request. 
        /// Warning! TTL is default behavior. Setting of <see cref="UseSingleRequestTokens"/> to true will disable tokens TTL mechanism!
        /// </summary>
        public bool UseSingleRequestTokens
        {
            get { return _useSingleRequestTokens; }
            set
            {
                if (_isDirty && _useSingleRequestTokens != value) throw new Exception("Cannot change TokenStorage behavior after it is being used");
                _useSingleRequestTokens = value;
            }
        }

        InMemoryTokenStorage()
        {
            TokenTimeToLive = TimeSpan.FromMinutes(5);
            UseSingleRequestTokens = false;
        }

        /// <summary>
        /// Stores tables request from POST request and returns token back
        /// </summary>
        /// <param name="request">Request to store</param>
        /// <returns>Token value</returns>
        public string StoreRequest(LatticeRequest request)
        {
            _isDirty = true;
            string token = null;
            bool result = false;
            while (!result)
            {
                token = Guid.NewGuid().ToString();
                result = StoredRequests.TryAdd(token, request);
            }
            if (!UseSingleRequestTokens)
            {
                lock (ExpirationTokens)
                {
                    StoredRequest rq = new StoredRequest() { ExpireDate = DateTime.Now.Add(TokenTimeToLive), Token = token };
                    ExpirationTokens.Add(rq);    
                }
            }
            return token;
        }

        /// <summary>
        /// Looks up for request by specified token, returns it and cleans up tokens dictionary 
        /// according to TTL or immediately in case of UseSingleRequestTokens enabled.
        /// </summary>
        /// <param name="token">Token</param>
        /// <returns>Request</returns>
        public LatticeRequest Lookup(string token)
        {
            LatticeRequest result = null;
            if (UseSingleRequestTokens)
            {
                StoredRequests.TryRemove(token, out result);
            }
            else
            {
                StoredRequests.TryGetValue(token, out result);
                Cleanup();
            }
            return result;
        }

        private void Cleanup()
        {
            if (UseSingleRequestTokens) return;
            var cDate = DateTime.Now;
            lock (ExpirationTokens)
            {
                var tokensToClean = ExpirationTokens.Where(c => c.ExpireDate <= cDate).ToArray();
                foreach (var tk in tokensToClean)
                {
                    LatticeRequest req = null;
                    StoredRequests.TryRemove(tk.Token, out req);
                    ExpirationTokens.Remove(tk);
                }
            }
        }


    }
}
