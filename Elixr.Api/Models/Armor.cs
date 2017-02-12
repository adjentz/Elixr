using System;

namespace Elixr.Api.Models
{
    public class Armor : Equipment, IVotable
    {
        public int DefenseBonus {get;set;}
        public int SpeedPenalty { get; set;}
        public int RoundsToDon
        {
            get
            {
                if (WeightInPounds < 25)
                {
                    return 5;
                }
                if (WeightInPounds < 45)
                {
                    return 10;
                }
                return 20;
            }
        }
        public bool BestowsDisadvantage 
        {
            get
            {
                return this.WeightInPounds >= 45;
            }
        }
    }
}
