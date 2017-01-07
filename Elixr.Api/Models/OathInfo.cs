
namespace Elixr.Api.Models
{
    public class OathInfo
    {
        public int Id { get; set; }

        public bool Broken { get; set; }
        public int OathId { get; set; }
        public Oath Oath { get; set; }
        public string Notes { get; set; }
    }
}
