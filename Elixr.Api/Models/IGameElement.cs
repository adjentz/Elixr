namespace Elixr.Api.Models
{
    interface IGameElement
    {
        int AuthorId { get; set; }
        Player Author { get; set; }
    }
}