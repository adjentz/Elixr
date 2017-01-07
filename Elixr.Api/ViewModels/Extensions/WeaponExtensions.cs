using Elixr.Api.Models;
using System.Linq;

namespace Elixr.Api.ViewModels.Extensions
{
    static class WeaponExtensions
    {
        public static WeaponViewModel ToViewModel(this Weapon weapon)
        {
            return new WeaponViewModel
            {
                AttackAbility = weapon.AttackAbility,
                DamageAbility = weapon.DamageAbility,
                Range = weapon.Range,
                Damage = weapon.Damage,
                WeightInPounds = weapon.WeightInPounds,
                Name = weapon.Name,
                Cost = weapon.Cost,
                Description = weapon.Description,
                Author = weapon.Player?.ToViewModel(),
                EquipmentId = weapon.Id,
                Enchantments = weapon.Enchantments.Select(e => e.ToViewModel()).ToList()
            };
        }
        public static Weapon ToDomainModel(this WeaponViewModel weapon)
        {
            return new Weapon
            {
                AttackAbility = weapon.AttackAbility,
                DamageAbility = weapon.DamageAbility,
                Range = weapon.Range,
                Damage = weapon.Damage,
                WeightInPounds = weapon.WeightInPounds,
                Name = weapon.Name,
                Description = weapon.Description,
                Cost = weapon.Cost,
                Enchantments = weapon.Enchantments.Select(e => e.ToDomainModel()).ToList()
            };
        }
    }
}