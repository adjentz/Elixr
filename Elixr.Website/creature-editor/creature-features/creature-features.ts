import CreatureEditor from "../creature-editor";
import ModalService from "../../services/modal-service";

export default class CreatureFeaturesController {

    editor: CreatureEditor;
    gettingFeature = false;
    inquireOptions = false;
    getFeatureResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.FeatureViewModel>;
    acquiredFeature: Elixr.Api.ViewModels.FeatureViewModel;

    weaponApplyType = Elixr.Api.Models.FeatureApplyingType.Weapon;
    selectedWeaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel;

    armorApplyType = Elixr.Api.Models.FeatureApplyingType.Armor;
    selectedArmorInfo: Elixr.Api.ViewModels.ArmorInfoViewModel;

    itemApplyType = Elixr.Api.Models.FeatureApplyingType.Item;
    selectedItemInfo: Elixr.Api.ViewModels.ItemInfoViewModel;

    spellApplyType = Elixr.Api.Models.FeatureApplyingType.Spell;
    selectedSpellInfo: Elixr.Api.ViewModels.SpellInfoViewModel;

    energySacrificed = 1;

    static $inject = ["$q", "modalService"];
    constructor(private $q: angular.IQService, private modalService: ModalService) {
    }

    featureInfoIsFromRace(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel): boolean {
        if (!this.editor.creature.race) {
            return false;
        }
        return this.editor.creature.race.featureInformation.filter(fi => fi.featureInfoId === featureInfo.featureInfoId).length > 0;
    }

    private canTakeFeature(feature: Elixr.Api.ViewModels.FeatureViewModel): boolean {

        let characterFlawIds = this.editor.creature.flawInformation.map(fi => fi.flaw.flawId);
        let requiredFlawIds = feature.requiredFlaws.map(f => f.flawId);

        for (let requiredFlawId of requiredFlawIds) {
            if (characterFlawIds.indexOf(requiredFlawId) === -1) {
                alert("Missing Required Flaw for this Feature");
                return;
            }
        }

        let characterOathIds = this.editor.creature.oathInformation.map(oi => oi.oath.oathId);
        let requiredOathIds = feature.requiredOaths.map(o => o.oathId);

        for (let requiredOathId of requiredOathIds) {
            if (characterOathIds.indexOf(requiredOathId) === -1) {
                alert("Missing Required Oath for this Feature");
                return;
            }
        }

        if (feature.cost > this.editor.creature.featurePoolRemaining) {
            alert("Not enough Feature points");
            return;
        }

        if (feature.canBeTakenEachLevel) {
            let existingFeature = _(this.editor.creature.allFeatureInformation)
                .filter(fi => fi.takenAtLevel === this.editor.creature.level && fi.feature.featureId === feature.featureId)
                .first();

            if (existingFeature) {
                alert(`You've already taken ${feature.name} at this level.`)
                return;
            }
        }
        else {
            let existingFeature = _(this.editor.creature.allFeatureInformation)
                .filter(fi => fi.feature.featureId === feature.featureId)
                .first();

            if (existingFeature) {
                alert(`You've already taken ${feature.name}, and it's a Feature that can only be taken once.`)
                return false;
            }
        }

        switch (feature.applyType) {
            case Elixr.Api.Models.FeatureApplyingType.Armor:
                if (!this.editor.creature.armorInformation.length) {
                    alert("You don't have any armor to apply this Feature to.");
                    return false;
                }
                break;
            case Elixr.Api.Models.FeatureApplyingType.Weapon:
                if (!this.editor.creature.weaponInformation.length) {
                    alert("You don't have any weapons to apply this Feature to.");
                    return false;
                }
                break;
            case Elixr.Api.Models.FeatureApplyingType.Item:
                if (!this.editor.creature.itemInformation.length) {
                    alert("You don't have any items to apply this Feature to.");
                    return false;
                }
                break;
            case Elixr.Api.Models.FeatureApplyingType.Spell:
                if (!this.editor.creature.spellInformation.length) {
                    alert("You don't have any spells to apply this Feature to.");
                    return false;
                }
                break;
        }

        return true;
    }

    removeFeature(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel): void {
        if (this.featureInfoIsFromRace(featureInfo)) {
            alert("Features from Race cannot be removed without removing/changing Race");
            return;
        }
        this.editor.removeFeatureInfo(featureInfo);
    }

    getFeature(): void {
        this.modalService.modalActive = true;
        this.gettingFeature = true;
        this.inquireOptions = false;
        this.energySacrificed = 1;

        this.selectedArmorInfo = this.selectedItemInfo = this.selectedSpellInfo = this.selectedWeaponInfo = null;

        this.getFeatureResultDeferred = this.$q.defer();

        this.getFeatureResultDeferred.promise.then(feature => {

            if (!this.canTakeFeature(feature)) {
                this.getFeature();
                return;
            }

            this.modalService.modalActive = false;
            this.acquiredFeature = feature;
            this.gettingFeature = false;

            if (feature.mustSacrificeEnergy || feature.applyType !== Elixr.Api.Models.FeatureApplyingType.Self) {
                this.modalService.modalActive = true;
                this.inquireOptions = true;
                return;
            }

            let featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel = {
                costWhenTaken: feature.cost,
                feature: feature,
                notes: "",
                takenAtLevel: this.editor.creature.level,
                energySacrificedWhenTaken: 0,
                featureInfoId: 0
            };
            this.editor.addFeatureInfo(featureInfo);
        });
    }
    optionsAccepted(): void {
        if (!this.canTakeFeature(this.acquiredFeature)) {
            return;
        }

        let featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel = {
            costWhenTaken: this.acquiredFeature.cost,
            feature: this.acquiredFeature,
            takenAtLevel: this.editor.creature.level,
            notes: "",
            energySacrificedWhenTaken: 0,
            featureInfoId: 0
        };

        if (this.acquiredFeature.mustSacrificeEnergy) {
            featureInfo.energySacrificedWhenTaken = this.energySacrificed;
            featureInfo.notes += `Sacrificed ${this.energySacrificed} to take.`;
        }

        switch (this.acquiredFeature.applyType) {
            case Elixr.Api.Models.FeatureApplyingType.Armor:
                if (!this.selectedArmorInfo) {
                    alert("Please select armor");
                    return;
                }
                this.selectedArmorInfo.featuresApplied.push(featureInfo);
                break;
            case Elixr.Api.Models.FeatureApplyingType.Weapon:
                if (!this.selectedWeaponInfo) {
                    alert("Please select a weapon");
                    return;
                }
                this.editor.addFeatureInfoToWeaponInfo(featureInfo, this.selectedWeaponInfo);
                break;
            case Elixr.Api.Models.FeatureApplyingType.Item:
                if (!this.selectedItemInfo) {
                    alert("Please select an item");
                    return;
                }
                this.selectedItemInfo.featuresApplied.push(featureInfo);
                break;
            case Elixr.Api.Models.FeatureApplyingType.Spell:
                if (!this.selectedSpellInfo) {
                    alert("Please select a spell");
                    return;
                }
                this.editor.addFeatureInfoToSpellInfo(featureInfo, this.selectedSpellInfo);
                break;
            default:
                this.editor.addFeatureInfo(featureInfo);
                break

        }

        this.energySacrificed = 1;
        this.inquireOptions = false;
        this.modalService.modalActive = false;
    }

    notifyFeatureChanged(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel) {
        this.editor.addFeatureInfo(featureInfo, true);
    }
    closeSlideout(): void {
        this.gettingFeature = false;
        this.inquireOptions = false;
        this.modalService.modalActive = false;
    }

    static directive: angular.IDirective = {
        bindToController: {
            editor: "=editor"
        },
        scope: {},
        controller: CreatureFeaturesController,
        controllerAs: "$ctrl",
        name: "creatureFeatures",
        replace: true,
        templateUrl: "creature-editor/creature-features/creature-features.html"
    };

}

