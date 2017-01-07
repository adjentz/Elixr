using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class OathViewModel
    {
        public int OathId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<StatModViewModel> Mods { get; set; }
        public PlayerViewModel Author { get; set; }
    }
}