namespace Elixr.Api
{
    public class ElixrSettings
    {
        public ElixrSettings(string gameMasterPassword, string hashingSecret)
        {
            GameMasterPassword = gameMasterPassword;
            HashingSecret = hashingSecret;
        }
        public string GameMasterPassword { get; private set; }
        public string HashingSecret {get; private set;}
    }
}