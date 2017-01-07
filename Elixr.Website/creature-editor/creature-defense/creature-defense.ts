import CreatureEditor from "../creature-editor";
import ModalService from "services/modal-service";

class CreatureDefenseController {
    editor: CreatureEditor;
    addingArmor: boolean;
    addArmorResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.ArmorViewModel>;
    askReduceWealth: boolean;
    acquiredArmor: Elixr.Api.ViewModels.ArmorViewModel;

    static $inject = ["$q", "modalService"];
    constructor(private $q: angular.IQService, private modalService: ModalService) {

    }

    get defenseSources(): Elixr.Api.ViewModels.StatModViewModel[] {
        return _.filter(this.editor.creature.allStatMods, sm => sm.stat === Elixr.Api.Models.Stat.Defense);
    }

    formatModifier(statMod: Elixr.Api.ViewModels.StatModViewModel): string {
        if (statMod.modifierType === Elixr.Api.Models.ModifierType.Normal) {
            if (statMod.modifier < 0) {
                return `+${statMod.modifier}`;
            }
            else {
                return `+${statMod.modifier}`;
            }
        }
        if (statMod.modifierType === Elixr.Api.Models.ModifierType.Halve) {
            return "½";
        }
        if (statMod.modifierType === Elixr.Api.Models.ModifierType.Double) {
            return "x2";
        }
        return statMod.modifier.toString();
    }
    formatBonus(bonus: number): string {
        if (bonus < 0) {
            return "-" + bonus;
        }
        return "+" + bonus;
    }

    addArmor(): void {
        this.modalService.modalActive = true;
        this.addingArmor = true;
        this.askReduceWealth = false;
        this.addArmorResultDeferred = this.$q.defer();

        this.addArmorResultDeferred.promise.then(armor => {

            let armorInfo: Elixr.Api.ViewModels.ArmorInfoViewModel = {
                armor: armor,
                featuresApplied: [],
                notes: "",
                armorInfoId: 0
            };
            this.editor.addArmorInfo(armorInfo);
            this.acquiredArmor = armor;
            this.askReduceWealth = true;
        });
    }
    reduceWealthOptionSelected(reduce: boolean): void {
        if (reduce) {
            let purchaseStatMod = {
                modifier: this.acquiredArmor.cost * -1,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: `Purchased ${this.acquiredArmor.name}`,
                stat: Elixr.Api.Models.Stat.Wealth,
                statModId: 0
            };
            this.editor.addBaseStat(purchaseStatMod);
        }

        this.addingArmor = false;
        this.modalService.modalActive = false;
    }
    removeArmor(armorInfo: Elixr.Api.ViewModels.ArmorInfoViewModel): void {
        this.editor.removeArmorInfo(armorInfo);
    }

    closeSlideout(): void {
        this.addingArmor = false;
        this.modalService.modalActive = false;
    }
}

export = <angular.IDirective>{
    bindToController: {
        editor: "="
    },
    scope: {},
    controller: CreatureDefenseController,
    controllerAs: "$ctrl",
    name: "creatureDefense",
    replace: true,
    templateUrl: "creature-editor/creature-defense/creature-defense.html"
};