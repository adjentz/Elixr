using Elixr.Api.Models;

namespace Elixr.Api.ViewModels
{
    public class WeaponViewModel : EquipmentViewModel
    {
        public Stat AttackAbility { get; set; }
        public Stat DamageAbility { get; set; }
        public Range Range { get; set; }
        public string Damage { get; set; }
    }
}