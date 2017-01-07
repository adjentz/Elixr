using System;
using System.Linq;
using Elixr.Api.Models;

namespace Elixr.Api.Controllers
{
    static class QueryableExtensions
    {
        public static IQueryable<T> OrderByVotes<T>(this IQueryable<T> query) where T : IVotable
        {
            long now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            //net votes * (1 / total votes * 0.07 * number of milliseconds the item has existed for)
            return query.OrderBy(v => (v.UpVotes - v.DownVotes) * (1 / ((v.DownVotes + v.UpVotes) * 0.07 * (now - v.CreatedAtMS))));
        }
    }
}