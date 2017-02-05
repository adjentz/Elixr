using Elixr.Api.Models;
using System.Linq;

namespace Elixr.Api.ViewModels.Extensions
{
    static class ArmorExtensions
    {
        public static ArmorViewModel ToViewModel(this Armor armor)
        {
            return new ArmorViewModel
            {
                DefenseBonus = armor.DefenseBonus,
                SpeedPenalty = armor.SpeedPenalty,
                BestowsDisadvantage = armor.BestowsDisadvantage,
                RoundsToDon = armor.RoundsToDon,
                EquipmentId = armor.Id,
                Cost = armor.Cost,
                Name = armor.Name,
                Description = armor.Description,
                ImageUrl = armor.ImageUrl,
                WeightInPounds = armor.WeightInPounds,
                Author = armor.Player?.ToViewModel(),
                Enchantments = armor.Enchantments.Select(e => e.ToViewModel()).ToList()
            };
        }
        public static Armor ToDomainModel(this ArmorViewModel armorVM)
        {
            return new Armor
            {
                Cost = armorVM.Cost,
                Name = armorVM.Name,
                Description = armorVM.Description,
                ImageUrl = armorVM.ImageUrl,
                WeightInPounds = armorVM.WeightInPounds,
                Enchantments = armorVM.Enchantments.Select(e => e.ToDomainModel()).ToList()
            };
        }
    }
}