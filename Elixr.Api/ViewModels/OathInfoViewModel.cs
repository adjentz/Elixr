namespace Elixr.Api.ViewModels
{
    public class OathInfoViewModel
    {
        public int OathInfoId { get; set; }
        public bool Broken { get; set; }
        public OathViewModel Oath { get; set; }
        public string Notes { get; set; }
    }
}