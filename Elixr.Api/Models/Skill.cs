
namespace Elixr.Api.Models
{
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Ranks { get; set; }
        public Stat BelongsTo { get; set; }
        public bool HasDefense { get; set; }
    }
}
