using Elixr.Api.Models;
using Elixr.Api.ApiModels;
using Microsoft.EntityFrameworkCore;

namespace Elixr.Api
{
    public class ElixrDbContext : DbContext
    {
        public ElixrDbContext(DbContextOptions<ElixrDbContext> options)
        : base(options)
        { }

        public DbSet<SeedInfo> SeedInformation { get; set; }

        public DbSet<Race> Races { get; set; }
        public DbSet<Armor> Armor { get; set; }
        public DbSet<Weapon> Weapons { get; set; }
        public DbSet<Creature> Creatures { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Spell> Spells { get; set; }
        public DbSet<Player> Players { get; set; }

        public DbSet<Flaw> Flaws { get; set; }
        public DbSet<Oath> Oaths { get; set; }
        public DbSet<Item> Items { get; set; }
    }
}