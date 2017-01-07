namespace Elixr.Api.ViewModels
{
    public class EnchantmentViewModel
    {
        public int EnchantmentId { get; set; }
        public string Name { get; set; }
        public string MagicDamage { get; set; }
        public SpellViewModel BaseSpell { get; set; }
        public int EnergyUsedInEnchantment { get; set; }
        public int UsesOrRoundsPerDay { get; set; }
        public string Description { get; set; }
    }
}