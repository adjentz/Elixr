using System;
using System.Text;
using System.Security.Cryptography;

namespace Elixr.Api
{
    public class Utilities
    {
        private ElixrSettings settings;
        public Utilities(ElixrSettings settings)
        {
            this.settings = settings;
        }

        public string HashText(string plaintext)
        {
            using(var hasher = SHA256.Create())
            {
                byte[] hashed = hasher.ComputeHash(Encoding.UTF8.GetBytes(plaintext + settings.HashingSecret));
                string result = Convert.ToBase64String(hashed);
                return result;
            }            
        }
    }
}