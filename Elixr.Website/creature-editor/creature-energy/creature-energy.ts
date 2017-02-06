import Creature = require("../../models/creature");

export default class CreatureEnergyController {
    creature: Creature;


    get energySources(): Elixr.Api.ViewModels.StatModViewModel[] {
        return _.filter(this.creature.allStatMods, sm => sm.stat === Elixr.Api.Models.Stat.MaxEnergy);
    }

    formatModifier(statMod: Elixr.Api.ViewModels.StatModViewModel): string {
        if (statMod.modifierType === Elixr.Api.Models.ModifierType.Normal) {
            if (statMod.modifier < 0) {
                return `-${statMod.modifier}`;
            }
            return `+${statMod.modifier}`;
        }
        if (statMod.modifierType === Elixr.Api.Models.ModifierType.Halve) {
            return "½";
        }
        if (statMod.modifierType === Elixr.Api.Models.ModifierType.Double) {
            return "x2";
        }

        return statMod.modifier.toString();
    }

    static directive: angular.IDirective = {
        bindToController: {
            creature: "=creatureEnergy"
        },
        scope: {},
        controller: CreatureEnergyController,
        controllerAs: "$ctrl",
        name: "creatureEnergy",
        replace: true,
        templateUrl: "creature-editor/creature-energy/creature-energy.html"
    };

}

