namespace Elixr.Api.Models
{
    interface IVotable
    {
        int UpVotes { get; set; }
        int DownVotes { get; set; }
        long CreatedAtMS { get; set; }
    }
}