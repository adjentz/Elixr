namespace Elixr.Api.ViewModels
{
    public class FlawInfoViewModel
    {
        public int FlawInfoId { get; set; }
        public string Notes { get; set; }
        public virtual FlawViewModel Flaw { get; set; }
    }
}