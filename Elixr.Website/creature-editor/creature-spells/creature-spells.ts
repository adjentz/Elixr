import CreatureEditor from "../creature-editor";
import ModalService from "services/modal-service";

class CreatureSpellsController {
    learningSpell = false;
    learnSpellResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.SpellViewModel>;
    editor: CreatureEditor;
    viewingDetailOfSpell: Elixr.Api.ViewModels.SpellInfoViewModel;

    static $inject = ["$q", "modalService"];
    constructor(private $q: angular.IQService, private modalService: ModalService) {

    }
    learnSpell(): void {
        if (this.editor.creature.featurePoolRemaining < 1) {
            alert("Not enough Feature Points.")
            return;
        }
        this.learningSpell = true;
        this.learnSpellResultDeferred = this.$q.defer();
        this.modalService.modalActive = true;
        this.learnSpellResultDeferred.promise.then(spell => {
            let spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel = {
                notes: "",
                spell: spell,
                featuresApplied: [],
                spellInfoId: 0
            };

            this.editor.addSpellInfo(spellInfo);
            let featurePoolStatMod = {
                modifier: -1,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                stat: Elixr.Api.Models.Stat.FeaturePool,
                reason: `Learned ${spell.name}`,
                statModId: 0
            };
            this.editor.addBaseStat(featurePoolStatMod);
        })
            .finally(() => {
                this.learningSpell = false;
                this.modalService.modalActive = false;
            });
    }
    removeSpell(spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel) {
        let featurePoolStatMod = {
            modifier: 1,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            stat: Elixr.Api.Models.Stat.FeaturePool,
            reason: `Unlearned ${spellInfo.spell.name}`,
            statModId: 0
        };
        this.editor.addBaseStat(featurePoolStatMod);
        this.editor.removeSpellInfo(spellInfo);
    }
    notifySpellChanged(spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel) {
        this.editor.addSpellInfo(spellInfo, true);
    }

    viewDetailOfSpell(spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel): void {
        this.viewingDetailOfSpell = spellInfo;
        this.modalService.modalActive = true;
    }

    closeSlideouts(): void {
        this.learningSpell = false;
        this.viewingDetailOfSpell = null;
        this.modalService.modalActive = false;
    }

    spellHasFeatures(spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel): boolean {
        return spellInfo.featuresApplied.length > 0;
    }

    removeFeatureFromSpell(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel): void {
        if (!this.viewingDetailOfSpell) {
            return;
        }
        this.editor.removeFeatureInfoFromSpellInfo(featureInfo, this.viewingDetailOfSpell);
    }

}

export = <angular.IDirective>{
    bindToController: {
        editor: "="
    },
    scope: {},
    controller: CreatureSpellsController,
    controllerAs: "$ctrl",
    name: "creatureSpells",
    replace: true,
    templateUrl: "creature-editor/creature-spells/creature-spells.html"
};