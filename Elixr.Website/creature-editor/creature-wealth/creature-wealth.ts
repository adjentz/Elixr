import CreatureEdtor from "../creature-editor";

class CreatureWealthController {
    editor: CreatureEdtor;
    editingWealth = false;
    increaseWealth = true;
    editGold = 0;
    editSilver = 0;
    editCopper = 0;
    editMemo = "";

    updateWealth(): void {
        let editWealth = this.editGold + (this.editSilver * 0.1) + (this.editCopper * 0.01);
        editWealth = Math.round(editWealth * 100) / 100;
        if (!this.increaseWealth) {
            editWealth *= -1;
        }

        let wealthMod = {
            modifier: editWealth,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: this.editMemo || "Wealth edit",
            stat: Elixr.Api.Models.Stat.Wealth,
            statModId: 0
        };
        this.editor.addBaseStat(wealthMod);
        
        this.editingWealth = false;
        this.editGold = this.editSilver = this.editCopper = 0;
        this.editMemo = "";
    }
    formatModifier(statMod: Elixr.Api.ViewModels.StatModViewModel): string {
        if (statMod.modifierType === Elixr.Api.Models.ModifierType.Normal) {
            if (statMod.modifier < 0) {
                return statMod.modifier.toString();
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

    get wealthSources(): Elixr.Api.ViewModels.StatModViewModel[] {
        return _.filter(this.editor.creature.allStatMods, sm => sm.stat === Elixr.Api.Models.Stat.Wealth);
    }

    get wealth(): number {
        return this.editor.creature.wealth;
    }

    get gold(): string {
        let goldStr = "";
        if (this.wealth < 0) {
            goldStr += "-";
        }

        goldStr += Math.floor(Math.abs(this.wealth)).toString();
        return goldStr;
    }
    get silver(): string {
        let silverStr = "";
        if (this.wealth < 0) {
            silverStr += "-";
        }
        let justDecimals = Math.abs(this.wealth) - Math.floor(Math.abs(this.wealth));
        justDecimals = Math.round(justDecimals * 100) / 100;
        silverStr += justDecimals.toString()[2] || "0";
        return silverStr;
    }
    get copper(): string {
        let copperStr = "";
        if (this.wealth < 0) {
            copperStr += "-";
        }

        let justDecimals = Math.abs(this.wealth) - Math.floor(Math.abs(this.wealth));
        justDecimals = Math.round(justDecimals * 100) / 100;
        copperStr += justDecimals.toString()[3] || "0";
        return copperStr;
    }

    closeSlideout(): void {
        this.editingWealth = false;
    }
}

export = <angular.IDirective>{
    bindToController: {
        editor: "="
    },
    scope: {},
    controller: CreatureWealthController,
    controllerAs: "$ctrl",
    name: "creatureWealth",
    replace: true,
    templateUrl: "creature-editor/creature-wealth/creature-wealth.html"
};