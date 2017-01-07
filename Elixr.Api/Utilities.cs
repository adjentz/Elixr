using System;
using System.Text;
using System.Security.Cryptography;

namespace Elixr.Api
{
    static class Utilities
    {
        public static string HashText(string plaintext)
        {
            using(var hasher = SHA256.Create())
            {
                byte[] hashed = hasher.ComputeHash(Encoding.UTF8.GetBytes(plaintext));
                return Convert.ToBase64String(hashed);
            }            
        }
    }
}