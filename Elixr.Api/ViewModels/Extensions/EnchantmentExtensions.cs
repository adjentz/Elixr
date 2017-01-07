using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class EnchantmentExtensions
    {
        public static EnchantmentViewModel ToViewModel(this Enchantment enchantment)
        {
            return new EnchantmentViewModel
            {
                EnchantmentId = enchantment.Id,
                BaseSpell = enchantment.BaseSpell.ToViewModel(),
                Description = enchantment.Description,
                EnergyUsedInEnchantment = enchantment.EnergyUsedInEnchantment,
                UsesOrRoundsPerDay = enchantment.UsesOrRoundsPerDay,
                Name = enchantment.Name,
                MagicDamage = enchantment.MagicDamage
            };
        }
        public static Enchantment ToDomainModel(this EnchantmentViewModel enchantment)
        {
            return new Enchantment
            {
                Id = enchantment.EnchantmentId,
                BaseSpell = enchantment.BaseSpell.ToDomainModel(),
                Description = enchantment.Description,
                EnergyUsedInEnchantment = enchantment.EnergyUsedInEnchantment,
                UsesOrRoundsPerDay = enchantment.UsesOrRoundsPerDay,
                Name = enchantment.Name,
                MagicDamage = enchantment.MagicDamage
            };
        }
    }
}