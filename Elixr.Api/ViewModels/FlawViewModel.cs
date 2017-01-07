using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class FlawViewModel
    {
        public int FlawId { get; set; }
        public List<StatModViewModel> Mods { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public PlayerViewModel Author { get; set; }
    }
}