import Creature = require("../models/creature");
import ApiService from "../services/api-service";
import { RPGPlayerSession } from "../services/rpg-player-session";

enum EditorMode {
    Editing, 
    Playing,
    Viewing
}

export default class CreatureEditorController {
    creature: Creature
    loading = false;
    saving = false;
    attemptedSave = false;
    currentMode = EditorMode.Editing;
    playing = EditorMode.Playing;
    editing = EditorMode.Editing;
    viewing = EditorMode.Viewing;

    private updateInput: Elixr.Api.ApiModels.CreatureEditInput;

    static $inject = ["apiService", "$state", "$stateParams", "isPlayerCharacter", "rpgPlayerSession"];
    constructor(private apiService: ApiService, private $state: angular.ui.IStateService, $stateParams: angular.ui.IStateParamsService, isPlayerCharacter:boolean,  public rpgPlayerSession: RPGPlayerSession) {
        
        this.updateInput = {
            ageChangedTo: null,
            creatureId: 0,
            currentEnergyLedgerIs: "",
            deletedArmorInformationIds: [],
            deletedFeatureInformationIds: [],
            deletedFlawInformationIds: [],
            deletedItemInformationIds: [],
            deletedOathInformationIds: [],
            deletedSkillIds: [],
            deletedSpellInfoIds: [],
            deletedStatModIds: [],
            deletedWeaponInformationIds: [],
            descriptionChangedTo: null,
            eyesChangedTo: null,
            genderChangedTo: null,
            hairChangedTo: null,
            heightChangedTo: null,
            isPlayerCharacter: isPlayerCharacter,
            levelIs: 1,
            nameChangedTo: null,
            newArmorInformation: [],
            newFeatureInformation: [],
            newFlawInformation: [],
            newItemInformation: [],
            newOathInformation: [],
            newSkills: [],
            newSpellInformation: [],
            newStatMods: [],
            newWeaponInformation: [],
            portraitChangedTo: null,
            raceIdChangedTo: 0,
            skinChangedTo: null,
            weightChangedTo: null,
            spellFeatureChanges: [],
            weaponFeatureChanges: []
        };

        this.initCreature($stateParams, isPlayerCharacter);
    }

    private initCreature($stateParams: angular.ui.IStateParamsService, isPlayerCharacter:boolean) {

        let creatureId = $stateParams["creatureId"];

        if (creatureId) {
            this.updateInput.creatureId = +creatureId;
            this.loading = true;
            this.apiService.get<Elixr.Api.ViewModels.CreatureViewModel>(`creatures/${creatureId}`).then(result => {
                this.creature = Creature.fromViewModel(result.data);
                if(this.creature.author.playerId === this.rpgPlayerSession.playerId) {
                    this.currentMode = this.editing;
                }
                else {
                    this.currentMode = this.viewing;
                }
                document.title = `Elixr | ${this.creature.name}`;
            }).finally(() => this.loading = false);
        }
        else {
            this.currentMode = this.editing;
            this.creature = new Creature();
            this.creature.author = {
                playerId: this.rpgPlayerSession.playerId,
                playerName: this.rpgPlayerSession.playerName
            };

            this.creature.isPlayerCharacter = isPlayerCharacter;
            this.creature.level = 1;
            //handle skills
            let strSkills = ["Athletics", "Climb", "Swim"];
            let agilitySkills = ["Acrobatics", "Escape Artist", "Initiative", "Sleight of Hand", "Stealth"];
            let focusSkills = ["Concentration", "Engineer", "Insight", "Medicine", "Perception", "Recall", "Survival"];
            let charmSkills = ["Animal Handling", "Deception", "Diplomacy", "Perform"];

            let defenseSkills = ["Athletics", "Acrobatics", "Concentration"];

            for (let skillStr of strSkills) {
                let skill = {
                    belongsTo: Elixr.Api.Models.Stat.NaturalStrengthScore,
                    ranks: 0,
                    misc: 0,
                    name: skillStr,
                    hasDefense: defenseSkills.indexOf(skillStr) > -1,
                    skillId: 0
                };
                this.creature.skills.push(skill);
                this.updateInput.newSkills.push(skill);
            }
            for (let skillStr of agilitySkills) {
                let skill = {
                    belongsTo: Elixr.Api.Models.Stat.NaturalAgilityScore,
                    ranks: 0,
                    misc: 0,
                    name: skillStr,
                    hasDefense: defenseSkills.indexOf(skillStr) > -1,
                    skillId: 0
                };
                this.creature.skills.push(skill);
                this.updateInput.newSkills.push(skill);
            }
            for (let skillStr of focusSkills) {
                let skill = {
                    belongsTo: Elixr.Api.Models.Stat.NaturalFocusScore,
                    ranks: 0,
                    misc: 0,
                    name: skillStr,
                    hasDefense: defenseSkills.indexOf(skillStr) > -1,
                    skillId: 0
                };
                this.creature.skills.push(skill);
                this.updateInput.newSkills.push(skill);
            }
            for (let skillStr of charmSkills) {
                let skill = {
                    belongsTo: Elixr.Api.Models.Stat.NaturalCharmScore,
                    ranks: 0,
                    misc: 0,
                    name: skillStr,
                    hasDefense: defenseSkills.indexOf(skillStr) > -1,
                    skillId: 0
                };
                this.creature.skills.push(skill);
                this.updateInput.newSkills.push(skill);
            }

            // base stats
            let maxEnergyBaseStat = {
                stat: Elixr.Api.Models.Stat.MaxEnergy,
                modifier: 8,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Base",
                statModId: 0
            }
            this.creature.baseStats.push(maxEnergyBaseStat);
            this.updateInput.newStatMods.push(maxEnergyBaseStat);

            let abilityPoolBaseStat = {
                stat: Elixr.Api.Models.Stat.AbilityPool,
                modifier: 48,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Base",
                statModId: 0
            };
            this.creature.baseStats.push(abilityPoolBaseStat);
            this.updateInput.newStatMods.push(abilityPoolBaseStat);

            let speedBaseStat = {
                stat: Elixr.Api.Models.Stat.Speed,
                modifier: 60,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Base",
                statModId: 0
            };
            this.creature.baseStats.push(speedBaseStat);
            this.updateInput.newStatMods.push(speedBaseStat);

            let featurePoolBaseStat = {
                stat: Elixr.Api.Models.Stat.FeaturePool,
                modifier: 8,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Base",
                statModId: 0
            };
            this.creature.baseStats.push(featurePoolBaseStat);
            this.updateInput.newStatMods.push(featurePoolBaseStat);

            let skillPoolBaseStat = {
                stat: Elixr.Api.Models.Stat.SkillPool,
                modifier: 8,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "New Character",
                statModId: 0
            };
            this.creature.baseStats.push(skillPoolBaseStat);
            this.updateInput.newStatMods.push(skillPoolBaseStat);
        }
    }

    get loggedIn():boolean {
        return this.rpgPlayerSession.isAuthenticated;
    }

    addOathInfo(oathInfo: Elixr.Api.ViewModels.OathInfoViewModel, updateOnly = false) {
        //mark it as added, if it hasn't already been added
        if (this.updateInput.newOathInformation.filter(oi => oi === oathInfo || (oi.oathInfoId > 0 && oi.oathInfoId === oathInfo.oathInfoId)).length === 0) {
            this.updateInput.newOathInformation.push(oathInfo);
            if (!updateOnly) {
                this.creature.oathInformation.push(oathInfo);
            }
        }
        //if it's marked for deletion, well it looks like they changed their mind and actually do want it.
        let markedForDeletionIndex = this.updateInput.deletedOathInformationIds.indexOf(oathInfo.oathInfoId);
        if (markedForDeletionIndex > -1) {
            this.updateInput.deletedOathInformationIds.splice(markedForDeletionIndex, 1);
        }
    }
    removeOathInfo(oathInfo: Elixr.Api.ViewModels.OathInfoViewModel) {

        //check to see if it's pending in the newOathInformation (as it looks like they changed their minds and don't want it after all)
        let existingOathInformation = this.updateInput.newOathInformation.filter(oi => oi === oathInfo || (oi.oathInfoId > 0 && oi.oathInfoId === oathInfo.oathInfoId));
        if (existingOathInformation.length > 0) {

            for (let existing of existingOathInformation) {

                let existingIndex = this.updateInput.newOathInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.updateInput.newOathInformation.splice(existingIndex, 1);
                }
            }
        }
        //if already saved-to-server, still need to mark it to actually be removed 
        if (oathInfo.oathInfoId > 0) {

            this.updateInput.deletedOathInformationIds.push(oathInfo.oathInfoId);
        }

        //remove it from the editor
        existingOathInformation = this.creature.oathInformation.filter(oi => oi.oathInfoId > 0 && oi.oathInfoId === oathInfo.oathInfoId || angular.equals(oi, oathInfo));
        if (existingOathInformation.length > 0) {

            for (let existing of existingOathInformation) {

                let existingIndex = this.creature.oathInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.creature.oathInformation.splice(existingIndex, 1);
                }
            }
        }
    }

    addFlawInfo(flawInfo: Elixr.Api.ViewModels.FlawInfoViewModel, updateOnly = false) {
        //mark it as added, if it hasn't already been added
        if (this.updateInput.newFlawInformation.filter(fi => fi === flawInfo || (fi.flawInfoId > 0 && fi.flawInfoId === flawInfo.flawInfoId)).length === 0) {
            this.updateInput.newFlawInformation.push(flawInfo);
            if (!updateOnly) {
                this.creature.flawInformation.push(flawInfo);
            }
        }
        //if it's marked for deletion, well it looks like they changed their mind and actually do want it.
        let markedForDeletionIndex = this.updateInput.deletedFlawInformationIds.indexOf(flawInfo.flawInfoId);
        if (markedForDeletionIndex > -1) {
            this.updateInput.deletedFlawInformationIds.splice(markedForDeletionIndex, 1);
        }
    }
    removeFlawInfo(flawInfo: Elixr.Api.ViewModels.FlawInfoViewModel) {
        //check to see if it's pending in the newFlawInformation (as it looks like they changed their minds and don't want it after all)
        let existingFlawInformation = this.updateInput.newFlawInformation.filter(fi => fi === flawInfo || (fi.flawInfoId > 0 && fi.flawInfoId === flawInfo.flawInfoId));
        if (existingFlawInformation.length > 0) {
            for (let existing of existingFlawInformation) {
                let existingIndex = this.updateInput.newFlawInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.updateInput.newFlawInformation.splice(existingIndex, 1);
                }
            }
        }
        //if already saved-to-server, still need to mark it to actually be removed 
        if (flawInfo.flawInfoId > 0) {
            this.updateInput.deletedFlawInformationIds.push(flawInfo.flawInfoId);
        }

        //remove it from the editor
        existingFlawInformation = this.creature.flawInformation.filter(fi => fi.flawInfoId > 0 && fi.flawInfoId === flawInfo.flawInfoId || angular.equals(fi, flawInfo));
        if (existingFlawInformation.length > 0) {
            for (let existing of existingFlawInformation) {
                let existingIndex = this.creature.flawInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.creature.flawInformation.splice(existingIndex, 1);
                }
            }
        }
    }

    get shouldShowModeOptions(): boolean {
        if(!this.creature || !this.creature.author) {
            return false;
        }
        return this.creature.author.playerId === this.rpgPlayerSession.playerId;
    }

    addFeatureInfo(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel, updateOnly = false) {
        //mark it as added, if it hasn't already been added
        if (this.updateInput.newFeatureInformation.filter(fi => fi === featureInfo || (fi.featureInfoId > 0 && fi.featureInfoId === featureInfo.featureInfoId)).length === 0) {
            this.updateInput.newFeatureInformation.push(featureInfo);
            if (!updateOnly) {
                this.creature.featureInformation.push(featureInfo);
            }
        }
        //if it's marked for deletion, well it looks like they changed their mind and actually do want it.
        let markedForDeletionIndex = this.updateInput.deletedFeatureInformationIds.indexOf(featureInfo.featureInfoId);
        if (markedForDeletionIndex > -1) {
            this.updateInput.deletedFeatureInformationIds.splice(markedForDeletionIndex, 1);
        }
    }
    removeFeatureInfo(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel) {
        //check to see if it's pending in the newFeatureInformation (as it looks like they changed their minds and don't want it after all)
        let existingFeatureInformation = this.updateInput.newFeatureInformation.filter(fi => fi === featureInfo || (fi.featureInfoId > 0 && fi.featureInfoId === featureInfo.featureInfoId));
        if (existingFeatureInformation.length > 0) {
            for (let existing of existingFeatureInformation) {
                let existingIndex = this.updateInput.newFeatureInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.updateInput.newFeatureInformation.splice(existingIndex, 1);
                }
            }
        }
        //if already saved-to-server, still need to mark it to actually be removed 
        if (featureInfo.featureInfoId > 0) {
            this.updateInput.deletedFeatureInformationIds.push(featureInfo.featureInfoId);
        }

        //remove it from the editor
        existingFeatureInformation = this.creature.featureInformation.filter(fi => fi.featureInfoId > 0 && fi.featureInfoId === featureInfo.featureInfoId || angular.equals(fi, featureInfo));
        if (existingFeatureInformation.length > 0) {
            for (let existing of existingFeatureInformation) {
                let existingIndex = this.creature.featureInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.creature.featureInformation.splice(existingIndex, 1);
                }
            }
        }
    }

    addSpellInfo(spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel, updateOnly = false) {
        //mark it as added, if it hasn't already been added
        if (this.updateInput.newSpellInformation.filter(si => si === spellInfo || (si.spellInfoId > 0 && si.spellInfoId === spellInfo.spellInfoId)).length === 0) {
            this.updateInput.newSpellInformation.push(spellInfo);
            if (!updateOnly) {
                this.creature.spellInformation.push(spellInfo);
            }
        }
        //if it's marked for deletion, well it looks like they changed their mind and actually do want it.
        let markedForDeletionIndex = this.updateInput.deletedSpellInfoIds.indexOf(spellInfo.spellInfoId);
        if (markedForDeletionIndex > -1) {
            this.updateInput.deletedSpellInfoIds.splice(markedForDeletionIndex, 1);
        }
    }
    removeSpellInfo(spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel) {
        //check to see if it's pending in the newSpellInformation (as it looks like they changed their minds and don't want it after all)
        let existingSpellInformation = this.updateInput.newSpellInformation.filter(si => si === spellInfo || (si.spellInfoId > 0 && si.spellInfoId === spellInfo.spellInfoId));
        if (existingSpellInformation.length > 0) {

            for (let existing of existingSpellInformation) {
                let existingIndex = this.updateInput.newSpellInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.updateInput.newSpellInformation.splice(existingIndex, 1);
                }
            }
        }

        //if already saved-to-server, still need to mark it to actually be removed 
        if (spellInfo.spellInfoId > 0) {
            this.updateInput.deletedSpellInfoIds.push(spellInfo.spellInfoId);
        }

        //remove it from the editor
        existingSpellInformation = this.creature.spellInformation.filter(si => si.spellInfoId > 0 && si.spellInfoId === spellInfo.spellInfoId || angular.equals(si, spellInfo));
        if (existingSpellInformation.length > 0) {

            for (let existing of existingSpellInformation) {
                let existingIndex = this.creature.spellInformation.indexOf(existing);
                if (existingIndex > -1) {

                    this.creature.spellInformation.splice(existingIndex, 1);
                }
            }
        }
    }


    addItemInfo(itemInfo: Elixr.Api.ViewModels.ItemInfoViewModel, updateOnly = false) {
        //mark it as added, if it hasn't already been added
        if (this.updateInput.newItemInformation.filter(ii => ii === itemInfo || (ii.itemInfoId > 0 && ii.itemInfoId === itemInfo.itemInfoId)).length === 0) {
            this.updateInput.newItemInformation.push(itemInfo);
            if (!updateOnly) {
                this.creature.itemInformation.push(itemInfo);
            }
        }
        //if it's marked for deletion, well it looks like they changed their mind and actually do want it.
        let markedForDeletionIndex = this.updateInput.deletedItemInformationIds.indexOf(itemInfo.itemInfoId);
        if (markedForDeletionIndex > -1) {
            this.updateInput.deletedItemInformationIds.splice(markedForDeletionIndex, 1);
        }
    }
    removeItemInfo(itemInfo: Elixr.Api.ViewModels.ItemInfoViewModel) {
        //check to see if it's pending in the newSpellInformation (as it looks like they changed their minds and don't want it after all)
        let existingItemInformation = this.updateInput.newItemInformation.filter(ii => ii === itemInfo || (ii.itemInfoId > 0 && ii.itemInfoId === itemInfo.itemInfoId));
        if (existingItemInformation.length > 0) {

            for (let existing of existingItemInformation) {
                let existingIndex = this.updateInput.newItemInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.updateInput.newItemInformation.splice(existingIndex, 1);
                }
            }
        }

        //if already saved-to-server, still need to mark it to actually be removed 
        if (itemInfo.itemInfoId > 0) {
            this.updateInput.deletedItemInformationIds.push(itemInfo.itemInfoId);
        }

        //remove it from the editor
        existingItemInformation = this.creature.itemInformation.filter(ii => ii.itemInfoId > 0 && ii.itemInfoId === itemInfo.itemInfoId || angular.equals(ii, itemInfo));
        if (existingItemInformation.length > 0) {

            for (let existing of existingItemInformation) {
                let existingIndex = this.creature.itemInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.creature.itemInformation.splice(existingIndex, 1);
                }
            }
        }
    }

    addWeaponInfo(weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel, updateOnly = false) {
        //mark it as added, if it hasn't already been added
        if (this.updateInput.newWeaponInformation.filter(wi => wi === weaponInfo || (wi.weaponInfoId > 0 && wi.weaponInfoId === weaponInfo.weaponInfoId)).length === 0) {
            this.updateInput.newWeaponInformation.push(weaponInfo);
            if (!updateOnly) {
                this.creature.weaponInformation.push(weaponInfo);
            }
        }
        //if it's marked for deletion, well it looks like they changed their mind and actually do want it.
        let markedForDeletionIndex = this.updateInput.deletedWeaponInformationIds.indexOf(weaponInfo.weaponInfoId);
        if (markedForDeletionIndex > -1) {
            this.updateInput.deletedWeaponInformationIds.splice(markedForDeletionIndex, 1);
        }
    }
    removeWeaponInfo(weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel) {
        //check to see if it's pending in the newSpellInformation (as it looks like they changed their minds and don't want it after all)
        let existingWeaponInformation = this.updateInput.newWeaponInformation.filter(wi => wi === weaponInfo || (wi.weaponInfoId > 0 && wi.weaponInfoId === weaponInfo.weaponInfoId));
        if (existingWeaponInformation.length > 0) {

            for (let existing of existingWeaponInformation) {
                let existingIndex = this.updateInput.newWeaponInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.updateInput.newWeaponInformation.splice(existingIndex, 1);
                }
            }
        }

        //if already saved-to-server, still need to mark it to actually be removed 
        if (weaponInfo.weaponInfoId > 0) {
            this.updateInput.deletedWeaponInformationIds.push(weaponInfo.weaponInfoId);
        }

        //remove it from the editor
        existingWeaponInformation = this.creature.weaponInformation.filter(wi => wi.weaponInfoId > 0 && wi.weaponInfoId === weaponInfo.weaponInfoId || angular.equals(wi, weaponInfo));
        if (existingWeaponInformation.length > 0) {

            for (let existing of existingWeaponInformation) {
                let existingIndex = this.creature.weaponInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.creature.weaponInformation.splice(existingIndex, 1);
                }
            }
        }
    }

    addArmorInfo(armorInfo: Elixr.Api.ViewModels.ArmorInfoViewModel, updateOnly = false) {
        //mark it as added, if it hasn't already been added
        if (this.updateInput.newArmorInformation.filter(ai => ai === armorInfo || (ai.armorInfoId > 0 && ai.armorInfoId === armorInfo.armorInfoId)).length === 0) {
            this.updateInput.newArmorInformation.push(armorInfo);
            if (!updateOnly) {
                this.creature.armorInformation.push(armorInfo);
            }
        }
        //if it's marked for deletion, well it looks like they changed their mind and actually do want it.
        let markedForDeletionIndex = this.updateInput.deletedArmorInformationIds.indexOf(armorInfo.armorInfoId);
        if (markedForDeletionIndex > -1) {
            this.updateInput.deletedArmorInformationIds.splice(markedForDeletionIndex, 1);
        }
    }
    removeArmorInfo(armorInfo: Elixr.Api.ViewModels.ArmorInfoViewModel) {
        //check to see if it's pending in the newSpellInformation (as it looks like they changed their minds and don't want it after all)
        let existingArmorInformation = this.updateInput.newArmorInformation.filter(ai => ai === armorInfo || (ai.armorInfoId > 0 && ai.armorInfoId === armorInfo.armorInfoId));
        if (existingArmorInformation.length > 0) {

            for (let existing of existingArmorInformation) {
                let existingIndex = this.updateInput.newArmorInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.updateInput.newArmorInformation.splice(existingIndex, 1);
                }
            }
        }

        //if already saved-to-server, still need to mark it to actually be removed 
        if (armorInfo.armorInfoId > 0) {
            this.updateInput.deletedArmorInformationIds.push(armorInfo.armorInfoId);
        }

        //remove it from the editor
        existingArmorInformation = this.creature.armorInformation.filter(ai => ai.armorInfoId > 0 && ai.armorInfoId === armorInfo.armorInfoId || angular.equals(ai, armorInfo));
        if (existingArmorInformation.length > 0) {

            for (let existing of existingArmorInformation) {
                let existingIndex = this.creature.armorInformation.indexOf(existing);
                if (existingIndex > -1) {
                    this.creature.armorInformation.splice(existingIndex, 1);
                }
            }
        }
    }

    addFeatureInfoToSpellInfo(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel, spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel): void {

        let spellFeatureChange = _.find(this.updateInput.spellFeatureChanges, i => i.spellInfoId === spellInfo.spellInfoId);
        if (!spellFeatureChange) {
            spellFeatureChange = {
                deletedFeatureInfoIds: [],
                newFeatures: [],
                spellInfoId: spellInfo.spellInfoId
            };
            this.updateInput.spellFeatureChanges.push(spellFeatureChange);
        }

        spellFeatureChange.newFeatures.push(featureInfo);
        let index = spellFeatureChange.deletedFeatureInfoIds.indexOf(featureInfo.featureInfoId);
        if (index > -1) {
            spellFeatureChange.deletedFeatureInfoIds.indexOf(index, 1);
        }

        spellInfo.featuresApplied.push(featureInfo);
    }

    removeFeatureInfoFromSpellInfo(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel, spellInfo: Elixr.Api.ViewModels.SpellInfoViewModel): void {

        let spellFeatureChange = _.find(this.updateInput.spellFeatureChanges, i => i.spellInfoId === spellInfo.spellInfoId);
        if (!spellFeatureChange) {
            spellFeatureChange = {
                deletedFeatureInfoIds: [],
                newFeatures: [],
                spellInfoId: spellInfo.spellInfoId
            };
            this.updateInput.spellFeatureChanges.push(spellFeatureChange);
        }
        spellFeatureChange.deletedFeatureInfoIds.push(featureInfo.featureInfoId);

        // they thought they wanted this Feature, then decided against it. Make sure we don't add it server-side
        let index = spellFeatureChange.newFeatures.indexOf(featureInfo);
        if (index >= -1) {
            spellFeatureChange.newFeatures.splice(index, 1);
        }

        //remove the feature from the view
        let editorIndex = spellInfo.featuresApplied.indexOf(featureInfo);
        if (editorIndex > -1) {
            spellInfo.featuresApplied.splice(editorIndex, 1);
        }
    }

    addFeatureInfoToWeaponInfo(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel, weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel): void {

        let weaponFeatureChange = _.find(this.updateInput.weaponFeatureChanges, i => i.weaponInfoId === weaponInfo.weaponInfoId);
        if (!weaponFeatureChange) {
            weaponFeatureChange = {
                deletedFeatureInfoIds: [],
                newFeatures: [],
                weaponInfoId: weaponInfo.weaponInfoId
            };
            this.updateInput.weaponFeatureChanges.push(weaponFeatureChange);
        }

        weaponFeatureChange.newFeatures.push(featureInfo);
        let index = weaponFeatureChange.deletedFeatureInfoIds.indexOf(featureInfo.featureInfoId);
        if (index > -1) {
            weaponFeatureChange.deletedFeatureInfoIds.indexOf(index, 1);
        }

        weaponInfo.featuresApplied.push(featureInfo);
    }

    removeFeatureInfoFromWeaponInfo(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel, weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel): void {

        let weaponFeatureChange = _.find(this.updateInput.weaponFeatureChanges, i => i.weaponInfoId === weaponInfo.weaponInfoId);
        if (!weaponFeatureChange) {
            weaponFeatureChange = {
                deletedFeatureInfoIds: [],
                newFeatures: [],
                weaponInfoId: weaponInfo.weaponInfoId
            };
            this.updateInput.weaponFeatureChanges.push(weaponFeatureChange);
        }
        weaponFeatureChange.deletedFeatureInfoIds.push(featureInfo.featureInfoId);

        // they thought they wanted this Feature, then decided against it. Make sure we don't add it server-side
        let index = weaponFeatureChange.newFeatures.indexOf(featureInfo);
        if (index >= -1) {
            weaponFeatureChange.newFeatures.splice(index, 1);
        }

        //remove the feature from the view
        let editorIndex = weaponInfo.featuresApplied.indexOf(featureInfo);
        if (editorIndex > -1) {
            weaponInfo.featuresApplied.splice(editorIndex, 1);
        }
    }

    addBaseStat(statMod: Elixr.Api.ViewModels.StatModViewModel, updateOnly = false): void {

        if (this.updateInput.newStatMods.filter(s => s === statMod || (s.statModId > 0 && s.statModId === statMod.statModId)).length === 0) {

            this.updateInput.newStatMods.push(statMod);
            let timeStamp = (new Date()).getTime();

            if (!updateOnly) {
                this.creature.baseStats.push(statMod);
            }
        }
    }

    hasBaseStat(statMod: Elixr.Api.ViewModels.StatModViewModel): boolean {
        return this.updateInput.newStatMods.indexOf(statMod) > -1;
    }

    save(): void {
        if(!this.loggedIn) {
            this.attemptedSave = true;
            return;
        }

        this.updateInput.currentEnergyLedgerIs = this.creature.currentEnergyLedger;
        this.updateInput.levelIs = this.creature.level;
        this.saving = true;
        this.apiService.post<Elixr.Api.ApiModels.CreatureEditInput, number>("creatures/save", this.updateInput).then(r => {
            this.$state.go("creature-editor-saved", { creatureId: r.data });
        }).finally(() => this.saving = false);
    }

    notifyNameChanged(): void {
        this.updateInput.nameChangedTo = this.creature.name;
    }
    notifyEyesChanged(): void {
        this.updateInput.eyesChangedTo = this.creature.eyes;
    }
    notifyHeightChanged(): void {
        this.updateInput.heightChangedTo = this.creature.height;
    }
    notifyWeightChanged(): void {
        this.updateInput.weightChangedTo = this.creature.weight;
    }
    notifyDescriptionChanged(): void {
        this.updateInput.descriptionChangedTo = this.creature.description;
    }
    notifyHairChanged(): void {
        this.updateInput.hairChangedTo = this.creature.hair;
    }
    notifySkinChanged(): void {
        this.updateInput.skinChangedTo = this.creature.skin;
    }
    notifyAgeChanged(): void {
        this.updateInput.ageChangedTo = this.creature.age;
    }
    notifyGenderChanged(): void {
        this.updateInput.genderChangedTo = this.creature.gender;
    }

    notifyRaceChanged(): void {
        this.updateInput.raceIdChangedTo = this.creature.race.raceId;
    }

    notifySkillChanged(skill: Elixr.Api.ViewModels.SkillViewModel) {
        if (this.updateInput.newSkills.filter(s => s === skill || (s.skillId > 0 && s.skillId === skill.skillId)).length === 0) {
            this.updateInput.newSkills.push(skill);
        }
    }

    removeRace():void {
        this.creature.race = null;
        this.updateInput.raceIdChangedTo = -1; //indicates to API to remove the Race
    }
     private clearGenericAbilities(): void {
        // NB: right now the only way generic abilities exist is from Races. This might change in the future and this method will need to be re-evaluated.
        if (this.creature.genericStrengthScore > 0) {
            this.addBaseStat({
                modifier: -this.creature.genericStrengthScore,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Changed Race",
                stat: Elixr.Api.Models.Stat.GenericStrengthScore,
                statModId: 0
            });
        }
        if (this.creature.genericAgilityScore > 0) {
            this.addBaseStat({
                modifier: -this.creature.genericAgilityScore,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Changed Race",
                stat: Elixr.Api.Models.Stat.GenericAgilityScore,
                statModId: 0
            });
        }
        if (this.creature.genericFocusScore > 0) {
            this.addBaseStat({
                modifier: -this.creature.genericFocusScore,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Changed Race",
                stat: Elixr.Api.Models.Stat.GenericFocusScore,
                statModId: 0
            });
        }

        if (this.creature.genericCharmScore > 0) {
            this.addBaseStat({
                modifier: -this.creature.genericCharmScore,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Changed Race",
                stat: Elixr.Api.Models.Stat.GenericCharmScore,
                statModId: 0
            });
        }
    }


    static states: angular.ui.IState[] = [{
        name: "creature-editor-saved",
        templateUrl: "creature-editor/creature-editor.html",
        url: "/creature-editor/:creatureId",
        controller: CreatureEditorController,
        controllerAs: "$ctrl",
        resolve: {
            isPlayerCharacter: () => false
        },
        data: {
            title: "Editor"
        }
    },
   {
        controller: CreatureEditorController,
        controllerAs: "$ctrl",
        name: "creature-editor",
        templateUrl: "creature-editor/creature-editor.html",
        url: "/creature-editor",
        resolve: {
            isPlayerCharacter: () => false
        },
        data: {
            title: "Editor"
        }
    },
    {
        name: "character-editor-saved",
        templateUrl: "creature-editor/creature-editor.html",
        url: "/character-editor/:creatureId",
        controller: CreatureEditorController,
        controllerAs: "$ctrl",
        resolve: {
            isPlayerCharacter: () => true
        },
        data: {
            title: "Editor"
        }
    },
    {
        controller: CreatureEditorController,
        controllerAs: "$ctrl",
        name: "character-editor",
        templateUrl: "creature-editor/creature-editor.html",
        url: "/character-editor",
        resolve: {
            isPlayerCharacter: () => true
        },
        data: {
            title: "Editor"
        }
    }]
}