
declare module Elixr.Api.ApiModels {
	export const enum EquipmentSearchMode {
		Mundane = 0,
		Enchanted = 1,
		All = 2
	}
	export const enum SearchMode {
		JustOfficial = 0,
		JustCommunity = 1,
		All = 2
	}
	interface AuthToken {
		playerId: number;
		playerName: string;
		signature: string;
	}
	interface CreateResult {
		message: string;
		newId: number;
		success: boolean;
	}
	interface CreatureEditInput {
		ageChangedTo: string;
		creatureId: number;
		currentEnergyLedgerIs: string;
		deletedArmorInformationIds: number[];
		deletedFeatureInformationIds: number[];
		deletedFlawInformationIds: number[];
		deletedItemInformationIds: number[];
		deletedOathInformationIds: number[];
		deletedSkillIds: number[];
		deletedSpellInfoIds: number[];
		deletedStatModIds: number[];
		deletedWeaponInformationIds: number[];
		descriptionChangedTo: string;
		eyesChangedTo: string;
		genderChangedTo: string;
		hairChangedTo: string;
		heightChangedTo: string;
		isPlayerCharacter: boolean;
		levelIs: number;
		nameChangedTo: string;
		newArmorInformation: Elixr.Api.ViewModels.ArmorInfoViewModel[];
		newFeatureInformation: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		newFlawInformation: Elixr.Api.ViewModels.FlawInfoViewModel[];
		newItemInformation: Elixr.Api.ViewModels.ItemInfoViewModel[];
		newOathInformation: Elixr.Api.ViewModels.OathInfoViewModel[];
		newSkills: Elixr.Api.ViewModels.SkillViewModel[];
		newSpellInformation: Elixr.Api.ViewModels.SpellInfoViewModel[];
		newStatMods: Elixr.Api.ViewModels.StatModViewModel[];
		newWeaponInformation: Elixr.Api.ViewModels.WeaponInfoViewModel[];
		portraitChangedTo: string;
		raceIdChangedTo: number;
		skinChangedTo: string;
		spellFeatureChanges: Elixr.Api.ApiModels.SpellFeatureChanges[];
		weaponFeatureChanges: Elixr.Api.ApiModels.WeaponFeatureChanges[];
		weightChangedTo: string;
	}
	interface EquipmentSearchInput extends Elixr.Api.ApiModels.SearchInput {
		equipmentMode: Elixr.Api.ApiModels.EquipmentSearchMode;
	}
	interface SearchInput {
		name: string;
		searchMode: Elixr.Api.ApiModels.SearchMode;
		skip: number;
		take: number;
	}
	interface SpellFeatureChanges {
		deletedFeatureInfoIds: number[];
		newFeatures: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		spellInfoId: number;
	}
	interface WeaponFeatureChanges {
		deletedFeatureInfoIds: number[];
		newFeatures: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		weaponInfoId: number;
	}
}
declare module Elixr.Api.Models {
	export const enum FeatureApplyingType {
		Self = 0,
		Weapon = 1,
		Armor = 2,
		Item = 3,
		Spell = 4
	}
	export const enum ModifierType {
		Normal = 0,
		Double = 1,
		Halve = 2
	}
	export const enum Range {
		None = 0,
		Short = 1,
		Medium = 2,
		Long = 3,
		Extreme = 4
	}
	export const enum Stat {
		None = 0,
		FeaturePool = 1,
		AbilityPool = 2,
		GenericAbilityPool = 3,
		SkillPool = 4,
		NaturalStrengthScore = 5,
		SpecialStrengthScore = 6,
		GenericStrengthScore = 7,
		NaturalAgilityScore = 8,
		SpecialAgilityScore = 9,
		GenericAgilityScore = 10,
		NaturalFocusScore = 11,
		GenericFocusScore = 12,
		SpecialFocusScore = 13,
		NaturalCharmScore = 14,
		SpecialCharmScore = 15,
		GenericCharmScore = 16,
		StrengthMisc = 17,
		AgilityMisc = 18,
		FocusMisc = 19,
		CharmMisc = 20,
		Speed = 21,
		Initiative = 22,
		MaxEnergy = 23,
		Wealth = 24,
		Defense = 25,
		Athletics = 26,
		Climb = 27,
		Intimidation = 28,
		Swim = 29,
		Acrobatics = 30,
		EscapeArtist = 31,
		SleightOfHand = 32,
		Stealth = 33,
		Concentration = 34,
		Engineer = 35,
		Insight = 36,
		Medicine = 37,
		Perception = 38,
		Recall = 39,
		Survival = 40,
		AnimalHandling = 41,
		Deception = 42,
		Diplomacy = 43,
		Perform = 44,
		WeaponDamageIncrease = 45,
		WeaponAttackIncrease = 46,
		SpellSpeedCost = 47
	}
}
declare module Elixr.Api.ViewModels {
	interface ArmorInfoViewModel {
		armor: Elixr.Api.ViewModels.ArmorViewModel;
		armorInfoId: number;
		featuresApplied: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		notes: string;
	}
	interface ArmorViewModel extends Elixr.Api.ViewModels.EquipmentViewModel {
		bestowsDisadvantage: boolean;
		defenseBonus: number;
		roundsToDon: number;
		speedPenalty: number;
	}
	interface CreatureViewModel {
		age: string;
		armorInformation: Elixr.Api.ViewModels.ArmorInfoViewModel[];
		author: Elixr.Api.ViewModels.PlayerViewModel;
		baseStats: Elixr.Api.ViewModels.StatModViewModel[];
		createdAtMS: number;
		creatureId: number;
		currentEnergyLedger: string;
		description: string;
		eyes: string;
		featureInformation: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		flawInformation: Elixr.Api.ViewModels.FlawInfoViewModel[];
		gender: string;
		hair: string;
		height: string;
		isPlayerCharacter: boolean;
		itemInformation: Elixr.Api.ViewModels.ItemInfoViewModel[];
		level: number;
		name: string;
		oathInformation: Elixr.Api.ViewModels.OathInfoViewModel[];
		portraitUrl: string;
		race: Elixr.Api.ViewModels.RaceViewModel;
		skills: Elixr.Api.ViewModels.SkillViewModel[];
		skin: string;
		spellInformation: Elixr.Api.ViewModels.SpellInfoViewModel[];
		weaponInformation: Elixr.Api.ViewModels.WeaponInfoViewModel[];
		weight: string;
	}
	interface EnchantmentViewModel {
		baseSpell: Elixr.Api.ViewModels.SpellViewModel;
		description: string;
		enchantmentId: number;
		energyUsedInEnchantment: number;
		magicDamage: string;
		name: string;
		usesOrRoundsPerDay: number;
	}
	interface EquipmentViewModel {
		author: Elixr.Api.ViewModels.PlayerViewModel;
		cost: number;
		createdAtMS: number;
		description: string;
		enchantments: Elixr.Api.ViewModels.EnchantmentViewModel[];
		equipmentId: number;
		imageUrl: string;
		name: string;
		weightInPounds: number;
	}
	interface FeatureInfoViewModel {
		costWhenTaken: number;
		energySacrificedWhenTaken: number;
		feature: Elixr.Api.ViewModels.FeatureViewModel;
		featureInfoId: number;
		notes: string;
		takenAtLevel: number;
	}
	interface FeatureViewModel {
		applyType: Elixr.Api.Models.FeatureApplyingType;
		author: Elixr.Api.ViewModels.PlayerViewModel;
		canBeTakenEachLevel: boolean;
		cost: number;
		createdAtMS: number;
		description: string;
		downVotes: number;
		featureId: number;
		mods: Elixr.Api.ViewModels.StatModViewModel[];
		mustSacrificeEnergy: boolean;
		name: string;
		requiredFlaws: Elixr.Api.ViewModels.FlawViewModel[];
		requiredOaths: Elixr.Api.ViewModels.OathViewModel[];
		upVotes: number;
	}
	interface FlawInfoViewModel {
		flaw: Elixr.Api.ViewModels.FlawViewModel;
		flawInfoId: number;
		notes: string;
	}
	interface FlawViewModel {
		author: Elixr.Api.ViewModels.PlayerViewModel;
		description: string;
		flawId: number;
		mods: Elixr.Api.ViewModels.StatModViewModel[];
		name: string;
	}
	interface ItemInfoViewModel {
		featuresApplied: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		item: Elixr.Api.ViewModels.ItemViewModel;
		itemInfoId: number;
		notes: string;
	}
	interface ItemViewModel extends Elixr.Api.ViewModels.EquipmentViewModel {
	}
	interface OathInfoViewModel {
		broken: boolean;
		notes: string;
		oath: Elixr.Api.ViewModels.OathViewModel;
		oathInfoId: number;
	}
	interface OathViewModel {
		author: Elixr.Api.ViewModels.PlayerViewModel;
		description: string;
		mods: Elixr.Api.ViewModels.StatModViewModel[];
		name: string;
		oathId: number;
	}
	interface PlayerViewModel {
		playerId: number;
		playerName: string;
	}
	interface RaceViewModel {
		description: string;
		featureInformation: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		flawInformation: Elixr.Api.ViewModels.FlawInfoViewModel[];
		name: string;
		raceId: number;
	}
	interface SkillViewModel {
		belongsTo: Elixr.Api.Models.Stat;
		hasDefense: boolean;
		misc: number;
		name: string;
		ranks: number;
		skillId: number;
	}
	interface SpellInfoViewModel {
		featuresApplied: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		notes: string;
		spell: Elixr.Api.ViewModels.SpellViewModel;
		spellInfoId: number;
	}
	interface SpellViewModel {
		author: Elixr.Api.ViewModels.PlayerViewModel;
		createdAtMS: number;
		description: string;
		energyCost: string;
		movementCost: number;
		name: string;
		regenTimeInRounds: number;
		spellId: number;
	}
	interface StatModViewModel {
		modifier: number;
		modifierType: Elixr.Api.Models.ModifierType;
		reason: string;
		stat: Elixr.Api.Models.Stat;
		statModId: number;
	}
	interface WeaponInfoViewModel {
		featuresApplied: Elixr.Api.ViewModels.FeatureInfoViewModel[];
		notes: string;
		weapon: Elixr.Api.ViewModels.WeaponViewModel;
		weaponInfoId: number;
	}
	interface WeaponViewModel extends Elixr.Api.ViewModels.EquipmentViewModel {
		attackAbility: Elixr.Api.Models.Stat;
		damage: string;
		damageAbility: Elixr.Api.Models.Stat;
		range: Elixr.Api.Models.Range;
	}
}
