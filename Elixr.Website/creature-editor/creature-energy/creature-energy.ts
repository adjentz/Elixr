import Creature = require("../../models/creature");
import CreatureEditorController from '../creature-editor';

interface IActiveSpell {
    regenTime: number;
    energyChanneled: number;
    spell: Elixr.Api.ViewModels.SpellViewModel;
}

export default class CreatureEnergyController {

    activeSpells: IActiveSpell[];
    editor: CreatureEditorController;

    constructor() {

        let myCoolSpell: Elixr.Api.ViewModels.SpellViewModel = {
            author: null,
            createdAtMS: 0,
            description: "",
            energyCost: "1 per something",
            movementCost: 5,
            name: "My Cool Spell",
            regenTimeInRounds: 9,
            spellId: 0
        };

        this.activeSpells = [{
            energyChanneled: 7,
            regenTime: 3,
            spell: myCoolSpell
        },
        {
            energyChanneled: 1,
            regenTime: 2,
            spell: myCoolSpell
        }];
    }

    get creature(): Creature {
        return this.editor.creature;
    }
    get energySources(): Elixr.Api.ViewModels.StatModViewModel[] {
        return _.filter(this.creature.allStatMods, sm => sm.stat === Elixr.Api.Models.Stat.MaxEnergy);
    }

    formatModifier(statMod: Elixr.Api.ViewModels.StatModViewModel): string {
        if (statMod.modifierType === Elixr.Api.Models.ModifierType.Normal) {
            if (statMod.modifier < 0) {
                return `${statMod.modifier}`;
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
            editor: "="
        },
        scope: {},
        controller: CreatureEnergyController,
        controllerAs: "$ctrl",
        name: "creatureEnergy",
        replace: true,
        templateUrl: "creature-editor/creature-energy/creature-energy.html"
    };

}

