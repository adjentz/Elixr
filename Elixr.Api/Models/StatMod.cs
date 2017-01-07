
namespace Elixr.Api.Models
{
    public class StatMod
    {
        public int Id { get; set; }
        public Stat Stat { get; set; }
        public float Modifier { get; set; }
        public ModifierType ModifierType { get; set; }
        public string Reason { get; set; }
    }
}
