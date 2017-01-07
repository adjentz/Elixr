import Creature = require("models/creature");
import CreatureEditor from "../creature-editor";

class CreatureAbilitiesController {
    editor: CreatureEditor;
    abilityNames: string[];
    skillsByAbilityName: { [key: string]: Elixr.Api.ViewModels.SkillViewModel[] };

    editStats: Elixr.Api.ViewModels.StatModViewModel[];

    abilityRowMessage = "";
    abilityRowWithMessage = "";

    skillRowMessage = "";
    skillRowWithMessage = "";

    constructor() {
        var strengthSkills = _.filter(this.editor.creature.skills, skill => skill.belongsTo === Elixr.Api.Models.Stat.NaturalStrengthScore);
        var agilitySkills = _.filter(this.editor.creature.skills, skill => skill.belongsTo === Elixr.Api.Models.Stat.NaturalAgilityScore);
        var focusSkills = _.filter(this.editor.creature.skills, skill => skill.belongsTo === Elixr.Api.Models.Stat.NaturalFocusScore);
        var charmSkills = _.filter(this.editor.creature.skills, skill => skill.belongsTo === Elixr.Api.Models.Stat.NaturalCharmScore);

        this.abilityNames = ["Strength", "Agility", "Focus", "Charm"];
        this.skillsByAbilityName = {};
        this.skillsByAbilityName["Strength"] = strengthSkills;
        this.skillsByAbilityName["Agility"] = agilitySkills;
        this.skillsByAbilityName["Focus"] = focusSkills;
        this.skillsByAbilityName["Charm"] = charmSkills;

        let editStrengthStat = {
            modifier: 0,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: "Editing",
            stat: Elixr.Api.Models.Stat.NaturalStrengthScore,
            statModId: 0
        };

        let editFocusStat = {
            modifier: 0,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: "Editing",
            stat: Elixr.Api.Models.Stat.NaturalFocusScore,
            statModId: 0
        };

        let editAgilityStat = {
            modifier: 0,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: "Editing",
            stat: Elixr.Api.Models.Stat.NaturalAgilityScore,
            statModId: 0
        };

        let editCharmStat = {
            modifier: 0,
            modifierType: Elixr.Api.Models.ModifierType.Normal,
            reason: "Editing",
            stat: Elixr.Api.Models.Stat.NaturalCharmScore,
            statModId: 0
        };
        this.editStats = [editStrengthStat, editFocusStat, editCharmStat, editAgilityStat];
        this.editStats.forEach(es => this.editor.addBaseStat(es));
    }

    private increaseAbilityIfCan(naturalScore: number, forStat: Elixr.Api.Models.Stat, genericForStat: Elixr.Api.Models.Stat): boolean {

        if (naturalScore < 18 && this.editor.creature.abilityPoolRemaining > 0) {

            let statToMod = _(this.editStats).find(s => s.stat === forStat);
            if (!statToMod) {
                return false;
            }
            statToMod.modifier++;
            this.editor.addBaseStat(statToMod, true);
            return true;
        }
        else if (this.editor.creature.genericAbilityPoolRemaining > 0) {

            this.editor.addBaseStat({
                modifier: 1,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Editing",
                stat: genericForStat,
                statModId: 0
            });
            return true;
        }

        return false;
    }

    increaseAbility(name: string): void {


        let stat = Elixr.Api.Models.Stat.None;
        let genericStat = Elixr.Api.Models.Stat.None;
        let naturalScore = 0;
        switch (name.toLowerCase()) {
            case "strength":
                naturalScore = this.editor.creature.naturalStrengthScore;
                stat = Elixr.Api.Models.Stat.NaturalStrengthScore;
                genericStat = Elixr.Api.Models.Stat.GenericStrengthScore;
                break;
            case "agility":
                naturalScore = this.editor.creature.naturalAgilityScore;
                stat = Elixr.Api.Models.Stat.NaturalAgilityScore;
                genericStat = Elixr.Api.Models.Stat.GenericAgilityScore;
                break;
            case "focus":
                naturalScore = this.editor.creature.naturalFocusScore;
                stat = Elixr.Api.Models.Stat.NaturalFocusScore;
                genericStat = Elixr.Api.Models.Stat.GenericFocusScore;
                break;
            case "charm":
                naturalScore = this.editor.creature.naturalCharmScore;
                stat = Elixr.Api.Models.Stat.NaturalCharmScore;
                genericStat = Elixr.Api.Models.Stat.GenericCharmScore;
                break;
        }

        let shouldShowNotEnoughMessage = !this.increaseAbilityIfCan(naturalScore, stat, genericStat);
        if (shouldShowNotEnoughMessage) {
            this.abilityRowWithMessage = name;
            this.abilityRowMessage = "Not enough ability points."
        }
    }

    private decreaseAbilityForStat(naturalScore: number, genericScore: number, naturalStat: Elixr.Api.Models.Stat, genericStat: Elixr.Api.Models.Stat): void {
        if (genericScore > 0) {
            this.editor.addBaseStat({
                modifier: -1,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: "Editing",
                stat: genericStat,
                statModId: 0
            });
        }
        else if (naturalScore > 0) {
            let editStat = _(this.editStats).find(sm => sm.stat === naturalStat);
            editStat.modifier--;
            this.editor.addBaseStat(editStat, true);
        }
    }
    decreaseAbility(name: string): void {

        let naturalScore = 0;
        let genericScore = 0;
        let naturalStat = Elixr.Api.Models.Stat.None;
        let genericStat = Elixr.Api.Models.Stat.None;

        switch (name.toLowerCase()) {
            case "strength":
                genericScore = this.editor.creature.genericStrengthScore;
                naturalScore = this.editor.creature.naturalStrengthScore;
                naturalStat = Elixr.Api.Models.Stat.NaturalStrengthScore;
                genericStat = Elixr.Api.Models.Stat.GenericStrengthScore;
                break;
            case "agility":
                genericScore = this.editor.creature.genericAgilityScore;
                naturalScore = this.editor.creature.naturalAgilityScore;
                naturalStat = Elixr.Api.Models.Stat.NaturalAgilityScore;
                genericStat = Elixr.Api.Models.Stat.GenericAgilityScore;
                break;
            case "focus":
                genericScore = this.editor.creature.genericFocusScore;
                naturalScore = this.editor.creature.naturalFocusScore;
                naturalStat = Elixr.Api.Models.Stat.NaturalFocusScore;
                genericStat = Elixr.Api.Models.Stat.GenericFocusScore;
                break;
            case "charm":
                genericScore = this.editor.creature.genericCharmScore;
                naturalScore = this.editor.creature.naturalCharmScore;
                naturalStat = Elixr.Api.Models.Stat.NaturalCharmScore;
                genericStat = Elixr.Api.Models.Stat.GenericCharmScore;
                break;
        }

        this.decreaseAbilityForStat(naturalStat, genericScore, naturalStat, genericStat);
    }

    abilityStatsFor(name: string): number[] {
        switch (name.toLowerCase()) {
            case "strength":
                return [this.editor.creature.strengthScore, this.editor.creature.strengthMod, this.editor.creature.strengthMisc, this.editor.creature.strengthBonus];
            case "agility":
                return [this.editor.creature.agilityScore, this.editor.creature.agilityMod, this.editor.creature.agilityMisc, this.editor.creature.agilityBonus];
            case "focus":
                return [this.editor.creature.focusScore, this.editor.creature.focusMod, this.editor.creature.focusMisc, this.editor.creature.focusBonus];
            case "charm":
                return [this.editor.creature.charmScore, this.editor.creature.charmMod, this.editor.creature.charmMisc, this.editor.creature.charmBonus];
        }
    }

    increaseSkill(skill: Elixr.Api.ViewModels.SkillViewModel): void {

        if (this.editor.creature.skillPoolRemaining <= 0) {
            this.skillRowWithMessage = skill.name;
            this.skillRowMessage = "You don't have any skill points remaining to place.";
            return;
        }
        if (skill.ranks + 1 > this.editor.creature.level + 3) {
            this.skillRowWithMessage = skill.name;
            this.skillRowMessage = "Skill ranks cannot exceed 3 + creature level.";
            return;
        }
        skill.ranks++;
        this.editor.notifySkillChanged(skill);
    }
    decreaseSkill(skill: Elixr.Api.ViewModels.SkillViewModel): void {
        if (skill.ranks > 0) {
            skill.ranks--;
        }
        this.editor.notifySkillChanged(skill);
    }

    skillTotal(skill: Elixr.Api.ViewModels.SkillViewModel, abilityName: string): number {

        let total = skill.ranks + this.getMiscForSkill(skill);
        switch (abilityName.toLowerCase()) {
            case "strength":
                total += this.editor.creature.strengthMod;
                break;
            case "agility":
                total += this.editor.creature.agilityMod;
                break;
            case "focus":
                total += this.editor.creature.focusMod;
                break;
            case "charm":
                total += this.editor.creature.charmMod;
                break;
        }
        return total;
    }

    getMiscForSkill(skill: Elixr.Api.ViewModels.SkillViewModel): number {
        switch (skill.name.toLowerCase()) {
            case "athletics":
                return this.editor.creature.athleticsMisc;
            case "climb":
                return this.editor.creature.climbMisc;
            case "swim":
                return this.editor.creature.swimMisc;
            case "acrobatics":
                return this.editor.creature.acrobaticsMisc;
            case "escape artist":
                return this.editor.creature.escapeArtistMisc;
            case "sleight of hand":
                return this.editor.creature.sleightOfHandMisc;
            case "stealth":
                return this.editor.creature.stealthMisc;
            case "concentration":
                return this.editor.creature.concentrationMisc;
            case "engineer":
                return this.editor.creature.engineerMisc;
            case "initiative":
                return this.editor.creature.initiativeMisc;
            case "insight":
                return this.editor.creature.insightMisc;
            case "medicine":
                return this.editor.creature.medicineMisc;
            case "perception":
                return this.editor.creature.perceptionMisc;
            case "recall":
                return this.editor.creature.recallMisc;
            case "survival":
                return this.editor.creature.survivalMisc;
            case "animal handling":
                return this.editor.creature.animalHandlingMisc;
            case "deception":
                return this.editor.creature.deceptionMisc;
            case "diplomacy":
                return this.editor.creature.diplomacyMisc;
            case "perform":
                return this.editor.creature.performMisc;
            default:
                return 0;
        }
    }

    shouldShowAbilityRowMessage(abilityName: string): boolean {
        return abilityName.toLowerCase() === this.abilityRowWithMessage.toLowerCase();
    }

    shouldShowSkillRowMessage(skillName: string): boolean {
        return skillName.toLowerCase() === this.skillRowWithMessage.toLowerCase();
    }

    dismissMessages(): void {
        this.abilityRowMessage = "";
        this.abilityRowWithMessage = "";

        this.skillRowMessage = "";
        this.skillRowWithMessage = "";
    }
}

export = <angular.IDirective>{
    bindToController: {
        editor: "="
    },
    scope: {},
    controller: CreatureAbilitiesController,
    controllerAs: "$ctrl",
    name: "creatureAbilities",
    replace: true,
    templateUrl: "creature-editor/creature-abilities/creature-abilities.html"
};