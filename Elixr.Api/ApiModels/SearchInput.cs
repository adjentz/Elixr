namespace Elixr.Api.ApiModels
{
    public enum SearchMode
    {
        JustOfficial = 0,
        JustCommunity = 1,
        All = 2
    }
    public class SearchInput
    {
        public string Name { get; set; }
        public SearchMode SearchMode { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }
}