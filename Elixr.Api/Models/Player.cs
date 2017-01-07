
namespace Elixr.Api.Models
{
    public class Player
    {
        public const int TheGameMasterId = 1;
        public string Name { get; set; }
        public string Email { get; set; }
        public string SecurityHash { get; set; }
        public int Id { get; set; }

        public string StrToHash
        {
            get
            {
                return this.Name + Id;
            }
        }
    }
}
