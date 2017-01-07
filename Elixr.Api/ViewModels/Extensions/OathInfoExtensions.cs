using Elixr.Api.Models;
namespace Elixr.Api.ViewModels.Extensions
{
    public static class OathInfoExtensions
    {
        public static OathInfoViewModel ToViewModel(this OathInfo oathInfo)
        {
            return new OathInfoViewModel
            {
                OathInfoId = oathInfo.Id,
                Broken = oathInfo.Broken,
                Oath = oathInfo.Oath.ToViewModel(),
                Notes = oathInfo.Notes
            };
        }
    }
}