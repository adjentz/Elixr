
namespace Elixr.Api.ViewModels
{
    public class SpellViewModel
    {
        public int SpellId { get; set; }
        public int MovementCost { get; set; }
        public string Name { get; set; }
        public int RegenTimeInRounds { get; set; }
        public string EnergyCost { get; set; }
        public string Description { get; set; }
        public PlayerViewModel Author { get; set; }
        public long CreatedAtMS { get; set; }
    }
}