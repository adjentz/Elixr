
namespace Elixr.Api.Models
{
    public class Weapon : Equipment
    {
        public Stat AttackAbility { get; set; }
        public Stat DamageAbility { get; set; }
        public Range Range { get; set; }
        public string Damage { get; set; }
    }
}
