namespace Elixr.Api.ApiModels
{
    public class AuthToken
    {
        public string PlayerName { get; set; }
        public int PlayerId { get; set; }
        public string Signature { get; set; }
    }
}