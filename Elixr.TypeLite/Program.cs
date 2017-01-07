using TypeLite;
using Elixr.Api.ViewModels;
using System.IO;

namespace Elixr.TypeLite
{
	class MainClass
	{
		public static void Main()
		{
			var ts = TypeScript.Definitions();
			ts.WithMemberFormatter((identifier) => char.ToLower(identifier.Name[0]) + identifier.Name.Substring(1));
			ts.For<CreatureViewModel>()
			  .For<Api.ApiModels.AuthToken>()
			  .For<Api.ApiModels.CreateResult>()
			  .For<Api.ApiModels.CreatureEditInput>()
			  .For<Api.ApiModels.EquipmentSearchInput>()
			  .For<Api.ApiModels.EquipmentSearchMode>()
			  .For<Api.ApiModels.SearchInput>()
			  .For<Api.ApiModels.SearchMode>();

			File.WriteAllText("ViewModelDefinitions.d.ts", ts.Generate());
		}
	}
}
