
import CreatureEditor from "../creature-editor";
import Creature = require("../../models/creature");
import ModalService from "../../services/modal-service";

export default class CreatureDescriptionController {

    editor: CreatureEditor;
    selectRaceResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.RaceViewModel>;
    selectingRace = false;
    imageUri = "";

    static $inject = ["$q", "$timeout", "modalService"];
    constructor(private $q: angular.IQService, private $timeout: angular.ITimeoutService, private modalService: ModalService) {
    }

    levelUp(): void {
        this.editor.creature.level++;
        this.editor.addBaseStat({
            modifier: 8,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: "Level Up",
            stat: Elixr.Api.Models.Stat.AbilityPool,
            statModId: 0
        });

        this.editor.addBaseStat({
            modifier: 8,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: "Level Up",
            stat: Elixr.Api.Models.Stat.MaxEnergy,
            statModId: 0
        });
    }
    levelDown(): void {
        if (this.editor.creature.level - 1 < 1) {
            return;
        }
        if (!confirm("Are you sure? All Features and Stats gained at this level will be lost.")) {
            return;
        }
        this.editor.creature.level--;
        this.editor.addBaseStat({
            modifier: -8,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: "Level Down",
            stat: Elixr.Api.Models.Stat.AbilityPool,
            statModId: 0
        });

        this.editor.addBaseStat({
            modifier: -8,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: "Level Down",
            stat: Elixr.Api.Models.Stat.MaxEnergy,
            statModId: 0
        });

        for (let featureInfo of this.editor.creature.featureInformation) {
            if (featureInfo.takenAtLevel > this.editor.creature.level) {
                this.editor.removeFeatureInfo(featureInfo);
            }
        }

        for (let weaponInfo of this.editor.creature.weaponInformation) {
            for (let featureInfo of weaponInfo.featuresApplied) {
                if (featureInfo.takenAtLevel > this.editor.creature.level) {
                    this.editor.removeFeatureInfoFromWeaponInfo(featureInfo, weaponInfo);
                }
            }
        }

        for (let spellInfo of this.editor.creature.spellInformation) {
            for (let featureInfo of spellInfo.featuresApplied) {
                if (featureInfo.takenAtLevel > this.editor.creature.level) {
                    this.editor.removeFeatureInfoFromSpellInfo(featureInfo, spellInfo);
                }
            }
        }
    }

    private clearGenericAbilities(): void {
        // NB: right now the only way generic abilities exist is from Races. This might change in the future and this method will need to be re-evaluated.
        if (this.editor.creature.genericStrengthScore > 0) {
            this.editor.addBaseStat({
                modifier: -this.editor.creature.genericStrengthScore,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Changed Race",
                stat: Elixr.Api.Models.Stat.GenericStrengthScore,
                statModId: 0
            });
        }
        if (this.editor.creature.genericAgilityScore > 0) {
            this.editor.addBaseStat({
                modifier: -this.editor.creature.genericAgilityScore,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Changed Race",
                stat: Elixr.Api.Models.Stat.GenericAgilityScore,
                statModId: 0
            });
        }
        if (this.editor.creature.genericFocusScore > 0) {
            this.editor.addBaseStat({
                modifier: -this.editor.creature.genericFocusScore,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Changed Race",
                stat: Elixr.Api.Models.Stat.GenericFocusScore,
                statModId: 0
            });
        }

        if (this.editor.creature.genericCharmScore > 0) {
            this.editor.addBaseStat({
                modifier: -this.editor.creature.genericCharmScore,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Changed Race",
                stat: Elixr.Api.Models.Stat.GenericCharmScore,
                statModId: 0
            });
        }
    }

    selectRace(): void {
        this.selectRaceResultDeferred = this.$q.defer();
        this.selectingRace = true;
        this.modalService.modalActive = true;
        this.selectRaceResultDeferred.promise.then(race => {
            this.clearGenericAbilities();
            this.editor.creature.race = race;
            this.editor.notifyRaceChanged();
        }).finally(() => {
            this.selectingRace = false;
            this.modalService.modalActive = false;
        });
    }
    removeRace(): void {
        this.editor.removeRace();
    }

    closeSlideout(): void {
        this.selectingRace = false;
        this.modalService.modalActive = false;
    }

    uploadPhoto(): void {
        var portraitFileInput = <HTMLInputElement>document.getElementById("portraitFileInput");
        if (portraitFileInput.files && portraitFileInput.files[0]) {

            var reader = new FileReader();
            reader.onload = (e: any) => this.$timeout(() => this.imageUri = e.target.result);
            reader.readAsDataURL(portraitFileInput.files[0]);
        }
    }
    uploadPortrait(): void {

        let portraitFileInput = <HTMLInputElement>document.getElementById("portraitFileInput");
        portraitFileInput.onchange = () => this.uploadPhoto();

        this.$timeout(() => portraitFileInput.click(), 0);
    }

    get backgroundColor(): string {

        if (this.imageUri) {
            return "black";
        }

        return "transparent";
    }

    static directive = <angular.IDirective>{
        bindToController: {
            editor: "="
        },
        scope: {},
        controller: CreatureDescriptionController,
        controllerAs: "$ctrl",
        name: "creatureDescription",
        replace: true,
        templateUrl: "creature-editor/creature-description/creature-description.html"
    };
}