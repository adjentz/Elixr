namespace Elixr.Api.ViewModels
{
    public class SearchFeaturesInputModel
    {
        public CommunitySearchMode SearchMode { get; set; }

        public string Name { get; set; }

        public int Take { get; set; }
        public int Skip { get; set; }
    }
}