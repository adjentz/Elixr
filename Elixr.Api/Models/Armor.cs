using System;

namespace Elixr.Api.Models
{
    public class Armor : Equipment, IVotable
    {
        public int DefenseBonus
        {
            get
            {
                return Math.Max(1, (int)WeightInPounds / 5 - 1);
            }
        }
        public int SpeedPenalty
        {
            get
            {
                int penaltyFactor = 50;
                if (BestowsDisadvantage)
                {
                    penaltyFactor -= 10;
                }

                return Math.Max((int)WeightInPounds - penaltyFactor, 0);
            }
        }
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
