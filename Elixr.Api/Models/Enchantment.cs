namespace Elixr.Api.Models
{
    public class Enchantment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int BaseSpellId { get; set; }
        public Spell BaseSpell { get; set; }
        public string MagicDamage { get; set; }
        public int EnergyUsedInEnchantment { get; set; }
        public int UsesOrRoundsPerDay { get; set; }
        public string Description { get; set; }

    }
}
