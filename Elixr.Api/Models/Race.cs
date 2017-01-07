using System;
using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class Race : IGameElement, IVotable
    {
        public Race()
        {
            FlawInformation = new List<FlawInfo>();
            FeatureInformation = new List<FeatureInfo>();
        }
        public int Id { get; set; }

        public List<FlawInfo> FlawInformation { get; set; }
        public List<FeatureInfo> FeatureInformation { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public long CreatedAtMS { get; set; }
        public int AuthorId { get; set; }

        public Player Author { get; set; }

        public int UpVotes { get; set; }

        public int DownVotes { get; set; }
    }
}
