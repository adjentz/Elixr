import ApiService from "../../services/api-service";
import Stat = Elixr.Api.Models.Stat;
import playerSession = require("../../services/rpg-player-session");

export class RPGFeaturesController {

    forResult: angular.IDeferred<Elixr.Api.ViewModels.FeatureViewModel>;
    features: Elixr.Api.ViewModels.FeatureViewModel[];

    searchQuery: Elixr.Api.ApiModels.SearchInput;
    private noMoreResults = false;
    showThanksForSubmitting = false;
    loading = true;

    newFeature: Elixr.Api.ViewModels.FeatureViewModel = null;

    availableStats: Elixr.Api.Models.Stat[];
    currentStat: Elixr.Api.Models.Stat;
    availableModifierTypes: Elixr.Api.Models.ModifierType[];
    currentModifierType: Elixr.Api.Models.ModifierType;
    currentModifier = 0;

    useRecommendedCost = true;
    customCost = 0;

    selfApplyType = Elixr.Api.Models.FeatureApplyingType.Self;
    spellApplyType = Elixr.Api.Models.FeatureApplyingType.Spell;
    armorApplyType = Elixr.Api.Models.FeatureApplyingType.Armor;
    itemApplyType = Elixr.Api.Models.FeatureApplyingType.Item;
    weaponApplyType = Elixr.Api.Models.FeatureApplyingType.Weapon;

    editingDescription = false;

    isBalanced = false;
    isFun = false;
    abidesTOS = false;

    viewingDetailsOfFeatureIds: number[] = [];

    getFlawResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.FlawViewModel>;
    getOathResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.OathViewModel>;

    static $inject = ["apiService", "rpgPlayerSession", "$q"];
    constructor(private apiService: ApiService, public rpgPlayerSession: playerSession.RPGPlayerSession, private $q: angular.IQService) {


        this.availableStats = [Stat.AbilityPool, Stat.Acrobatics, Stat.AgilityMisc, Stat.AnimalHandling, Stat.Athletics,
        Stat.CharmMisc, Stat.Climb, Stat.Concentration, Stat.Deception, Stat.Defense, Stat.Diplomacy,
        Stat.Engineer, Stat.EscapeArtist, Stat.FocusMisc, Stat.Initiative, Stat.Insight, Stat.Intimidation,
        Stat.MaxEnergy, Stat.Medicine, Stat.Perception, Stat.Perform, Stat.Recall, Stat.SkillPool, Stat.SleightOfHand,
        Stat.Speed, Stat.Stealth, Stat.StrengthMisc, Stat.Survival, Stat.Swim, Stat.Wealth, Stat.WeaponAttackIncrease, Stat.WeaponDamageIncrease];

        this.currentStat = this.availableStats[0];

        this.availableModifierTypes = [Elixr.Api.Models.ModifierType.Normal, Elixr.Api.Models.ModifierType.Double];
        this.currentModifierType = this.availableModifierTypes[0];

        this.searchQuery = {
            searchMode: Elixr.Api.ApiModels.SearchMode.JustOfficial,
            name: "",
            skip: 0,
            take: 25
        };
        this.searchFeatures();
    }

    get disableAmountInput(): boolean {
        return this.currentModifierType !== Elixr.Api.Models.ModifierType.Normal;
    }

    get normalModifierType(): Elixr.Api.Models.ModifierType {
        return Elixr.Api.Models.ModifierType.Normal;
    }
    get doubleModifierType(): Elixr.Api.Models.ModifierType {
        return Elixr.Api.Models.ModifierType.Double;
    }
    get halveModifierType(): Elixr.Api.Models.ModifierType {
        return Elixr.Api.Models.ModifierType.Halve;
    }

    shouldShowEdit(feature:Elixr.Api.ViewModels.FeatureViewModel):boolean {
        return feature.author.playerId === this.rpgPlayerSession.playerId;
    }
    editFeature(feature:Elixr.Api.ViewModels.FeatureViewModel) {
        this.newFeature = feature;
        this.scrollToAnchor();
    }
    private scrollToAnchor():void {
        let anchorElement = document.getElementById("createFeatureAnchor");
        window.scrollTo(window.scrollX, anchorElement.offsetTop);
    }

    addMod(): void {
        this.newFeature.mods.push({
            modifier: this.currentModifier,
            modifierType: this.currentModifierType,
            stat: this.currentStat,
            reason: "",
            statModId: 0
        });
    }
    removeMod(mod:Elixr.Api.ViewModels.StatModViewModel):void {
        let modIndex = _.findIndex(this.newFeature.mods, m => m === mod || (m.statModId > 0 && m.statModId === mod.statModId));
        if(modIndex > -1) {
            this.newFeature.mods.splice(modIndex, 1);
        }
    }

    cancelFeature(): void {
        this.newFeature = null;
    }
    createFeature(): void {
        this.showThanksForSubmitting = false;
        this.newFeature = {
            applyType: Elixr.Api.Models.FeatureApplyingType.Self,
            cost: 0,
            mustSacrificeEnergy: false,
            author: null,
            createdAtMS: 0,
            description: "",
            downVotes: 0,
            upVotes: 0,
            featureId: -1,
            mods: [],
            name: "",
            canBeTakenEachLevel: false,
            requiredFlaws: [],
            requiredOaths: []
        };
    }
    editDescription(): void {
        this.editingDescription = true;
    }

    viewDetailsOfFeature(feature: Elixr.Api.ViewModels.FeatureViewModel) {
        this.viewingDetailsOfFeatureIds.push(feature.featureId);
    }
    isViewingDetailsOfFeature(feature: Elixr.Api.ViewModels.FeatureViewModel) {
        return this.viewingDetailsOfFeatureIds.indexOf(feature.featureId) !== -1;
    }

    submitFeature($element: angular.IAugmentedJQueryStatic): void {
        if (!this.newFeature)
            return;

        if(this.newFeature.mods.filter(mod => mod.modifierType === Elixr.Api.Models.ModifierType.Normal && mod.modifier < 1).length > 0
            || (this.currentModifierType === Elixr.Api.Models.ModifierType.Normal && this.currentModifier < 0)) {
            alert("Feature modifiers must be positive. Consider making a corresponding Flaw with the negative modifiers and adding it as a Required Flaw to this Feature.");
            return;
        }
        
        if (this.useRecommendedCost) {
            this.newFeature.cost = this.recommendedCost;
        }
        else {
            this.newFeature.cost = this.customCost;
        }

        if (this.currentModifierType !== Elixr.Api.Models.ModifierType.Normal || this.currentModifier !== 0) {
            this.addMod();
        }

        //set reasons
        for (let statMod of this.newFeature.mods) {
            statMod.reason = `Feature: ${this.newFeature.name}`;
        }

        this.apiService.post<Elixr.Api.ViewModels.FeatureViewModel, Elixr.Api.ViewModels.FeatureViewModel>("features/create", this.newFeature).then(result => {
            this.features = [result.data].concat(this.features);

            this.newFeature = null;
            this.showThanksForSubmitting = true;



            this.currentModifier = 0;
            this.currentModifierType = this.availableModifierTypes[0];
            this.currentStat = this.availableStats[0];

            this.isFun = this.isBalanced = this.abidesTOS = false;

            this.scrollToAnchor();

        });
    }
    searchFeatures(append = false): void {
        this.loading = true;

        if (append) {
            this.searchQuery.skip += this.searchQuery.take;
        }
        else {
            this.noMoreResults = false;
            this.searchQuery.skip = 0;
        }

        this.apiService.post<Elixr.Api.ApiModels.SearchInput, Elixr.Api.ViewModels.FeatureViewModel[]>("features/search", this.searchQuery)
            .then(result => {
                if (append) {
                    this.features = this.features.concat(result.data);
                }
                else {
                    this.features = result.data;
                }
                if (result.data.length < this.searchQuery.take) {
                    this.noMoreResults = true;
                }
            })
            .catch(result => console.log(result))
            .finally(() => this.loading = false);
    }

    shouldShowEmptyBox(): boolean {
        if (this.loading) {
            return false;
        }
        return !(this.features && this.features.length > 0);
    }

    shouldShowLoadMore(): boolean {
        return !this.noMoreResults && !this.shouldShowEmptyBox() && !this.loading;
    }

    featureClicked(feature: Elixr.Api.ViewModels.FeatureViewModel): void {

        if (this.forResult) {

            this.forResult.resolve(feature);
        }

    }

    newNameKeyDown($evt: KeyboardEvent) {

        if ($evt.keyCode === 9) {
            $evt.preventDefault();
            this.editDescription();
        }
    }

    addRequiredFlaw(): void {
        this.getFlawResultDeferred = this.$q.defer();
        this.getFlawResultDeferred.promise.then(flaw => this.newFeature.requiredFlaws.push(flaw))
            .finally(() => this.getFlawResultDeferred = null);
    }
    cancelAddRequiredFlaw(): void {
        this.getFlawResultDeferred = null;
    }
    removeRequiredFlaw(flaw: Elixr.Api.ViewModels.FlawViewModel): void {
        let index = this.newFeature.requiredFlaws.indexOf(flaw);
        if(index > -1) {
            this.newFeature.requiredFlaws.splice(index, 1);
        }
    }

    addRequiredOath(): void {
        this.getOathResultDeferred = this.$q.defer();
        this.getOathResultDeferred.promise.then(oath => this.newFeature.requiredOaths.push(oath))
            .finally(() => this.getOathResultDeferred = null);
    }
    cancelAddRequiredOath(): void {
        this.getOathResultDeferred = null;
    }
    removeRequiredOath(oath: Elixr.Api.ViewModels.OathViewModel): void {
        let index = this.newFeature.requiredOaths.indexOf(oath);
        if(index > -1) {
            this.newFeature.requiredOaths.splice(index, 1);
        }
    }

    get recommendedCost(): number {
        if (!this.newFeature) {
            return 0;
        }

        let tempMods = this.newFeature.mods.concat([{
            stat: this.currentStat,
            reason: "",
            modifierType: this.currentModifierType,
            modifier: this.currentModifier,
            statModId: 0
        }]);

        //NB: Generally, factoring in the flaw mods should reduce the cost of the Feature. This is by design.
        let modsFromRequiredFlaws = _.flatten(this.newFeature.requiredFlaws.map(f => f.mods));
        tempMods = tempMods.concat(modsFromRequiredFlaws);
        //NB: mods from Required Oaths aren't taken into consideration here as it's considered that the oath description alone is worth the benefits.

        let cost = 0;
        tempMods.forEach(sm => {

            let weight = 1.0;
            switch (sm.stat) {
                case Stat.Defense:
                    weight = 3.0;
                    break;
                case Stat.Wealth:
                    weight = 1 / 50;
                    break;
                case Stat.Speed:
                    weight = 10 / 7 / 2;
                    break;
                case Stat.Initiative:
                    weight = 2;
                    break;
                case Stat.SkillPool:
                    weight = 1 / 3;
                    break;
            }

            let smCost = 0;
            switch (sm.modifierType) {
                case Elixr.Api.Models.ModifierType.Normal:
                    smCost = sm.modifier;
                    break;
                case Elixr.Api.Models.ModifierType.Double:
                    smCost = 5;
                    break;
                case Elixr.Api.Models.ModifierType.Halve:
                    smCost = -5;
                    break;
            }
            smCost *= weight;
            cost += smCost;
        });

        if (this.newFeature.canBeTakenEachLevel) {
            cost += 1;
        }
        if (this.newFeature.mustSacrificeEnergy) {
            cost -= 1;
        }

        return Math.ceil(cost);
    }

    get standard(): Elixr.Api.ApiModels.SearchMode {
        return Elixr.Api.ApiModels.SearchMode.JustOfficial;
    }
    get community(): Elixr.Api.ApiModels.SearchMode {
        return Elixr.Api.ApiModels.SearchMode.JustCommunity;
    }
    get all(): Elixr.Api.ApiModels.SearchMode {
        return Elixr.Api.ApiModels.SearchMode.All;
    }

    get disableSubmitButton(): boolean {
        if (!this.newFeature) {
            return false;
        }
        if (!(this.abidesTOS && this.isFun && this.isBalanced)) {
            return true;
        }

        if (!this.newFeature.description || !this.newFeature.name) {
            return true;
        }

        return false;
    }

    static directive: angular.IDirective = {
        bindToController: {
            forResult: "=?"
        },
        scope: {},
        controller: RPGFeaturesController,
        controllerAs: "$ctrl",
        name: "rpgFeatures",
        replace: true,
        templateUrl: "/features/directives/rpg-features.html"
    };
}