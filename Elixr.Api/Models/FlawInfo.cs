
namespace Elixr.Api.Models
{
    public class FlawInfo
    {
        public int Id { get; set; }
        public string Notes { get; set; }
        public int FlawId { get; set; }
        public Flaw Flaw { get; set; }
    }
}
