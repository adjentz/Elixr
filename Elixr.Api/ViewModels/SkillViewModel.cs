using Elixr.Api.Models;

namespace Elixr.Api.ViewModels
{
    public class SkillViewModel
    {
        public string Name { get; set; }
        public int Ranks { get; set; }
        public int Misc { get; set; }
        public Stat BelongsTo { get; set; }
        public bool HasDefense { get; set; }
        public int SkillId { get; set; }
    }
}