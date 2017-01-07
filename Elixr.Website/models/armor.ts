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

    get defenseBonus(): number {
        return Math.max(1, Math.floor(this.weightInPounds) / 5 - 1);
    }
    get roundsToDon(): number {
        if (this.weightInPounds < 25) {
            return 5;
        }
        if (this.weightInPounds < 45) {
            return 10;
        }
        return 20;
    }
    get speedPenalty(): number {
        return Math.max(Math.floor(this.weightInPounds) - 35, 0);
    }
    get bestowsDisadvantage():boolean {
        return this.weightInPounds >= 45;
    }

}