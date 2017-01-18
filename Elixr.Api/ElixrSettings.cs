namespace Elixr.Api
{
    public class ElixrSettings
    {
        public ElixrSettings(string gameMasterPassword)
        {
            GameMasterPassword = gameMasterPassword;
        }
        public string GameMasterPassword { get; private set; }
    }
}