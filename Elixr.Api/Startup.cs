using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Elixr.Api.Services;
using Microsoft.AspNetCore.Mvc.Formatters;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Elixr.Api
{
    public class Startup
    {
        private readonly IConfigurationRoot configuration;
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder();
            builder.AddJsonFile("AppSettings.json");

            configuration = builder.Build();
        }
        public async void Configure(IApplicationBuilder app, Seeder seeder, ElixrDbContext ctx)
        {
            app.UseCors("AllowAll");
            app.UseMvc();

            await ConfigureAsync(ctx);
            seeder.Seed(); 
        }

        private async Task ConfigureAsync(ElixrDbContext dbContext)
        {
            await dbContext.Database.MigrateAsync();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(Filters.TokenFilter));
                options.OutputFormatters.RemoveType<HttpNoContentOutputFormatter>();
            });

            services.AddSingleton<ElixrSettings>(sp => new ElixrSettings(configuration["GameMasterPassword"]));
            services.AddScoped<UserSession>();
            services.AddTransient<Seeder>();
            services.AddDbContext<ElixrDbContext>(options => options.UseNpgsql(configuration["ConnectionString"]));
        }
    }
}