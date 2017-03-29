class Creature implements Elixr.Api.ViewModels.CreatureViewModel {

    author: Elixr.Api.ViewModels.PlayerViewModel;
    createdAtMS: number;

    creatureId: number;
    name: string;
    gender: string;
    height: string;
    weight: string;
    hair: string;
    eyes: string;
    skin: string;
    age: string;
    description: string;
    portraitUrl: string;
    isPlayerCharacter: boolean;

    private cachedCurrentEnergyInvalid = true;
    private cachedCurrentEnergy = 0;
    private _currentEnergyLedger = "";

    race: Elixr.Api.ViewModels.RaceViewModel;

    featureInformation: Elixr.Api.ViewModels.FeatureInfoViewModel[];
    flawInformation: Elixr.Api.ViewModels.FlawInfoViewModel[];
    weaponInformation: Elixr.Api.ViewModels.WeaponInfoViewModel[];
    armorInformation: Elixr.Api.ViewModels.ArmorInfoViewModel[];
    itemInformation: Elixr.Api.ViewModels.ItemInfoViewModel[];
    spellInformation: Elixr.Api.ViewModels.SpellInfoViewModel[];
    oathInformation: Elixr.Api.ViewModels.OathInfoViewModel[];

    skills: Elixr.Api.ViewModels.SkillViewModel[];
    baseStats: Elixr.Api.ViewModels.StatModViewModel[];

    level: number;


    constructor() {
        this.baseStats = [];
        this.itemInformation = [];
        this.featureInformation = [];
        this.flawInformation = [];
        this.weaponInformation = [];
        this.armorInformation = [];
        this.spellInformation = [];
        this.oathInformation = [];
        this.skills = [];
    }

    get defense(): number {
        return 10 + this.agilityMod + this.sumStat(Elixr.Api.Models.Stat.Defense) + _.sum(this.armorInformation.map(ai => ai.armor.defenseBonus));
    }

    get maxEnergy(): number {
        return this.sumStat(Elixr.Api.Models.Stat.MaxEnergy) - _(this.allFeatureInformation.map(fi => fi.energySacrificedWhenTaken)).sum();
    }
    get wealth(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Wealth);
    }
    get speed(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Speed);
    }

    get abilityPoolTotal(): number {
        return this.sumStat(Elixr.Api.Models.Stat.AbilityPool);
    }
    get abilityPoolSpent(): number {
        return this.naturalStrengthScore + this.naturalAgilityScore + this.naturalFocusScore + this.naturalCharmScore;
    }
    get abilityPoolRemaining(): number {
        return this.abilityPoolTotal - this.abilityPoolSpent;
    }

    get specialAbilitiesTotal(): number {
        return this.sumStat(Elixr.Api.Models.Stat.SpecialAgilityScore)
            + this.sumStat(Elixr.Api.Models.Stat.SpecialStrengthScore)
            + this.sumStat(Elixr.Api.Models.Stat.SpecialFocusScore)
            + this.sumStat(Elixr.Api.Models.Stat.SpecialCharmScore);
    }

    get genericAbilityPoolSpent(): number {
        return this.genericStrengthScore
            + this.genericAgilityScore
            + this.genericFocusScore
            + this.genericCharmScore;
    }
    get genericAbilityPoolTotal(): number {
        return this.sumStat(Elixr.Api.Models.Stat.GenericAbilityPool);
    }
    get genericAbilityPoolRemaining(): number {
        return this.genericAbilityPoolTotal - this.genericAbilityPoolSpent;
    }

    get skillPoolTotal(): number {
        return this.sumStat(Elixr.Api.Models.Stat.SkillPool);
    }
    get skillPoolSpent(): number {
        return _.sum(this.skills.map(s => s.ranks));
    }
    get skillPoolRemaining(): number {
        return this.skillPoolTotal - this.skillPoolSpent;
    }

    get featurePoolTotal(): number {
        return this.sumStat(Elixr.Api.Models.Stat.FeaturePool);
    }
    get featurePoolSpent(): number {
        let featureCosts = _.sum(this.allFeatureInformation.map(fi => fi.costWhenTaken));

        featureCosts += _.sum(_.flatten(this.spellInformation.map(si => si.featuresApplied.map(fa => fa.costWhenTaken))));
        featureCosts += _.sum(_.flatten(this.armorInformation.map(si => si.featuresApplied.map(fa => fa.costWhenTaken))));
        featureCosts += _.sum(_.flatten(this.itemInformation.map(si => si.featuresApplied.map(fa => fa.costWhenTaken))));
        featureCosts += _.sum(_.flatten(this.weaponInformation.map(si => si.featuresApplied.map(fa => fa.costWhenTaken))));
        return featureCosts;
    }
    get featurePoolRemaining(): number {
        return this.featurePoolTotal - this.featurePoolSpent;
    }

    get naturalStrengthScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.NaturalStrengthScore)
    }
    get genericStrengthScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.GenericStrengthScore);
    }
    get specialStrengthScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.SpecialStrengthScore);
    }
    get strengthScore(): number {
        return this.naturalStrengthScore
            + this.specialStrengthScore
            + this.genericStrengthScore;
    }
    get strengthMod(): number {
        return Creature.calculateMod(this.strengthScore);
    }
    get strengthMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.StrengthMisc);
    }
    get strengthBonus(): number {
        return this.strengthMod + this.strengthMisc;
    }

    get naturalAgilityScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.NaturalAgilityScore);
    }
    get genericAgilityScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.GenericAgilityScore);
    }
    get specialAgilityScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.SpecialAgilityScore);
    }
    get agilityScore(): number {
        return this.naturalAgilityScore
            + this.specialAgilityScore
            + this.genericAgilityScore;
    }
    get agilityMod(): number {
        return Creature.calculateMod(this.agilityScore);
    }
    get agilityMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.AgilityMisc);
    }
    get agilityBonus(): number {
        return this.agilityMod + this.agilityMisc;
    }

    get naturalFocusScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.NaturalFocusScore)
    }
    get genericFocusScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.GenericFocusScore);
    }
    get specialFocusScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.SpecialFocusScore);
    }
    get focusScore(): number {
        return this.naturalFocusScore
            + this.specialFocusScore
            + this.genericFocusScore;
    }
    get focusMod(): number {
        return Creature.calculateMod(this.focusScore);
    }
    get focusMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.FocusMisc);
    }
    get focusBonus(): number {
        return this.focusMod + this.focusMisc;
    }

    get naturalCharmScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.NaturalCharmScore)
    }
    get genericCharmScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.GenericCharmScore);
    }
    get specialCharmScore(): number {
        return this.sumStat(Elixr.Api.Models.Stat.SpecialCharmScore);
    }
    get charmScore(): number {
        return this.naturalCharmScore
            + this.specialCharmScore
            + this.genericCharmScore;
    }
    get charmMod(): number {
        return Creature.calculateMod(this.charmScore);
    }
    get charmMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.CharmMisc);
    }
    get charmBonus(): number {
        return this.charmMod + this.charmMisc;
    }

    get athleticsMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Athletics);
    }
    get climbMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Climb);
    }
    get swimMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Swim);
    }

    get acrobaticsMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Acrobatics);
    }
    get escapeArtistMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.EscapeArtist);
    }
    get sleightOfHandMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.SleightOfHand);
    }
    get stealthMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Stealth);
    }

    get concentrationMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Concentration);
    }
    get engineerMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Engineer);
    }
    get initiativeMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Initiative);
    }
    get insightMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Insight);
    }
    get medicineMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Medicine);
    }
    get perceptionMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Perception);
    }
    get recallMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Recall);
    }
    get survivalMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Survival);
    }

    get animalHandlingMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.AnimalHandling);
    }
    get deceptionMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Deception);
    }
    get diplomacyMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Diplomacy);
    }
    get performMisc(): number {
        return this.sumStat(Elixr.Api.Models.Stat.Perform);
    }


    private static calculateMod(score: number): number {
        if (score % 2 !== 0) {
            score--;
        }
        score -= 10;
        score /= 2;
        return score;
    }
    private sumStat(stat: Elixr.Api.Models.Stat): number {
        let result = 0;
        let statMods = this.allStatMods.filter(sm => sm.stat === stat);
        for (let sm of statMods) {
            if (sm.modifierType === Elixr.Api.Models.ModifierType.Normal) {
                result += sm.modifier;
            }
        }
        let multiplier = 1.0;
        for (let sm of statMods) {
            if (sm.modifierType === Elixr.Api.Models.ModifierType.Double) {
                multiplier *= 2;
            }
            else if (sm.modifierType === Elixr.Api.Models.ModifierType.Halve) {
                multiplier *= 0.5;
            }
        }
        result *= multiplier;

        return result;
    }

    get allStatMods(): Elixr.Api.ViewModels.StatModViewModel[] {
        let modSources: Elixr.Api.ViewModels.StatModViewModel[][] = [];
        modSources.push(this.baseStats);
        modSources.push(_.flatten(this.allFeatureInformation.map(fi => fi.feature.mods)));
        modSources.push(_.flatten(this.allFlawInformation.map(fi => fi.flaw.mods)));
        modSources.push(_.flatten(this.oathInformation.filter(o => !o.broken).map(o => o.oath.mods)));

        return _.flatten(modSources);
    }

    get allFeatureInformation(): Elixr.Api.ViewModels.FeatureInfoViewModel[] {
        let creatureFeatures = this.featureInformation;
        let weaponFeatures = _.flatten(this.weaponInformation.map(w => w.featuresApplied));
        let spellFeatures = _.flatten(this.spellInformation.map(s => s.featuresApplied));

        let results = creatureFeatures.concat(weaponFeatures).concat(spellFeatures);
        if (this.race) {
            results = results.concat(this.race.featureInformation);
        }
        return results;
    }

    get currentEnergyLedger(): string {
        return this._currentEnergyLedger;
    }
    set currentEnergyLedger(value: string) {
        if (this._currentEnergyLedger !== value) {
            this.cachedCurrentEnergyInvalid = true;
            this._currentEnergyLedger = value;
        }
    }

    get currentEnergyLedgerIsValid(): boolean {
        if (!this.currentEnergyLedger) {
            return false;
        }
        let firstChar = this.currentEnergyLedger[0];
        if (firstChar !== "-") {
            return false;
        }

        let validCharacters = ["-", "+", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", " "];
        for (let char of this.currentEnergyLedger) {
            if (validCharacters.indexOf(char) < 0) {
                return false;
            }
        }
        return true;
    }

    get currentEnergy(): number {
        if (!this.cachedCurrentEnergyInvalid) {
            return this.cachedCurrentEnergy;
        }
        if (!this.currentEnergyLedgerIsValid) {
            return this.maxEnergy;
        }

        let opIsMinus = true;
        let currentValueStr = "";
        this.cachedCurrentEnergy = this.maxEnergy;

        let ledger = this.currentEnergyLedger.replace(" ", "");

        for (let i = 1; i < ledger.length; i++) {
            let char = ledger[i];
            if (!isNaN(Number(char))) {
                currentValueStr += char;
            }
            else {
                if (opIsMinus) {
                    this.cachedCurrentEnergy -= Number(currentValueStr);
                }
                else {
                    this.cachedCurrentEnergy += Number(currentValueStr);
                }
                currentValueStr = "";
                opIsMinus = char === "-";
            }
        }

        if (opIsMinus) {
            this.cachedCurrentEnergy -= Number(currentValueStr);
        }
        else {
            this.cachedCurrentEnergy += Number(currentValueStr);
        }
        
        this.cachedCurrentEnergyInvalid = false;
        return this.cachedCurrentEnergy;
    }

    get allFlawInformation(): Elixr.Api.ViewModels.FlawInfoViewModel[] {
        let flaws = this.flawInformation;
        if (this.race) {
            let raceFlaws = this.race.flawInformation;
            flaws = flaws.concat(raceFlaws);
        }
        return flaws;
    }

    static fromViewModel(creatureVM: Elixr.Api.ViewModels.CreatureViewModel): Creature {
        var creature = new Creature();
        angular.extend(creature, creatureVM);

        return creature;
    }
}

export = Creature;