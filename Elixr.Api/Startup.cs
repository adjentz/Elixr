using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Elixr.Api.Services;
using Microsoft.AspNetCore.Mvc.Formatters;
using System.Threading.Tasks;

namespace Elixr.Api
{
    public class Startup
    {
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

            services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin()
                                                                       .AllowAnyMethod()
                                                                        .AllowAnyHeader()));

            services.AddScoped<UserSession>();
            services.AddTransient<Seeder>();
            services.AddDbContext<ElixrDbContext>(options => options.UseNpgsql("Server=127.0.0.1;Database=Elixr.Api;User Id=postgres;Password=Password1"));
        }
    }
}