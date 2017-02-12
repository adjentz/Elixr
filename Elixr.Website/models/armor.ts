export default class Armor implements Elixr.Api.ViewModels.ArmorViewModel {

    author: Elixr.Api.ViewModels.PlayerViewModel;
    cost = 0;
    createdAtMS = 0;
    description = "";
    enchantments: Elixr.Api.ViewModels.EnchantmentViewModel[];
    equipmentId = 0;
    imageUrl = "";
    name = "";
    weightInPounds = 0;
    defenseBonus = 0;
    speedPenalty = 0;

    get roundsToDon(): number {
        if (this.weightInPounds < 25) {
            return 5;
        }
        if (this.weightInPounds < 45) {
            return 10;
        }
        return 20;
    }
    get bestowsDisadvantage(): boolean {
        return this.weightInPounds >= 45;
    }

}