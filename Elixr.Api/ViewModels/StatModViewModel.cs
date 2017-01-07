using Elixr.Api.Models;

namespace Elixr.Api.ViewModels
{
    public class StatModViewModel
    {
        public int StatModId { get; set; }
        public Stat Stat { get; set; }
        public float Modifier { get; set; }
        public ModifierType ModifierType { get; set; }
        public string Reason { get; set; }
    }
}