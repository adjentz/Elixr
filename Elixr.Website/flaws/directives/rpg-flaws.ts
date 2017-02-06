import ApiService from "../../services/api-service";
import Stat = Elixr.Api.Models.Stat;
import playerSession = require("../../services/rpg-player-session");

class RPGFlawsController {

    forResult: angular.IDeferred<Elixr.Api.ViewModels.FlawViewModel>;
    flaws: Elixr.Api.ViewModels.FlawViewModel[];

    searchQuery: Elixr.Api.ApiModels.SearchInput;
    private noMoreResults = false;
    showThanksForSubmitting = false;
    loading = true;

    newFlaw: Elixr.Api.ViewModels.FlawViewModel = null;

    availableStats: Elixr.Api.Models.Stat[];
    currentStat: Elixr.Api.Models.Stat;
    availableModifierTypes: Elixr.Api.Models.ModifierType[];
    currentModifierType: Elixr.Api.Models.ModifierType;
    currentModifier = 0;

    normalModifierType = Elixr.Api.Models.ModifierType.Normal;
    doubleModifierType = Elixr.Api.Models.ModifierType.Double;
    halveModifierType = Elixr.Api.Models.ModifierType.Halve;

    standard = Elixr.Api.ApiModels.SearchMode.JustOfficial;
    community = Elixr.Api.ApiModels.SearchMode.JustCommunity;
    all = Elixr.Api.ApiModels.SearchMode.All;

    editingDescription = false;

    isBalanced = false;
    isFun = false;
    abidesTOS = false;

    viewingDetailsOfFlawIds: number[] = [];

    static $inject = ["apiService", "rpgPlayerSession"];
    constructor(private apiService: ApiService, public rpgPlayerSession: playerSession.RPGPlayerSession) {


        this.availableStats = [Stat.AbilityPool, Stat.Acrobatics, Stat.AgilityMisc, Stat.AnimalHandling, Stat.Athletics,
        Stat.CharmMisc, Stat.Climb, Stat.Concentration, Stat.Deception, Stat.Defense, Stat.Diplomacy,
        Stat.Engineer, Stat.EscapeArtist, Stat.FocusMisc, Stat.Initiative, Stat.Insight, Stat.Intimidation,
        Stat.MaxEnergy, Stat.Medicine, Stat.Perception, Stat.Perform, Stat.Recall, Stat.SkillPool, Stat.SleightOfHand,
        Stat.Speed, Stat.Stealth, Stat.StrengthMisc, Stat.Survival, Stat.Swim, Stat.Wealth, Stat.WeaponAttackIncrease, Stat.WeaponDamageIncrease];

        this.currentStat = this.availableStats[0];

        this.availableModifierTypes = [Elixr.Api.Models.ModifierType.Normal, Elixr.Api.Models.ModifierType.Halve];
        this.currentModifierType = this.availableModifierTypes[0];

        this.searchQuery = {
            searchMode: Elixr.Api.ApiModels.SearchMode.JustOfficial,
            name: "",
            skip: 0,
            take: 25
        };
        this.searchFlaws();
    }

    get disableAmountInput(): boolean {
        return this.currentModifierType !== Elixr.Api.Models.ModifierType.Normal;
    }

    addMod(): void {
        this.newFlaw.mods.push({
            modifier: this.currentModifier,
            modifierType: this.currentModifierType,
            stat: this.currentStat,
            reason: "",
            statModId: 0
        });
        this.currentModifier = 0;
    }
    removeMod(mod:Elixr.Api.ViewModels.StatModViewModel):void {
        let modIndex = _.findIndex(this.newFlaw.mods, m => m === mod || (m.statModId > 0 && m.statModId === mod.statModId));
        if(modIndex > -1) {
            this.newFlaw.mods.splice(modIndex, 1);
        }
    }

    cancelFlaw(): void {
        this.newFlaw = null;
    }
    createFlaw(): void {
        this.showThanksForSubmitting = false;
        this.newFlaw = {
            description: "",
            flawId: -1,
            mods: [],
            name: "",
            author:null
        };
    }
    editDescription(): void {
        this.editingDescription = true;
    }

    shouldShowEdit(flaw:Elixr.Api.ViewModels.FlawViewModel):boolean {
        return flaw.author.playerId === this.rpgPlayerSession.playerId;
    }
    editFlaw(flaw:Elixr.Api.ViewModels.FlawViewModel) {
        this.newFlaw = flaw;
        this.scrollToAnchor();
    }
    private scrollToAnchor():void {
        let anchorElement = document.getElementById("createFlawsAnchor");
        window.scrollTo(window.scrollX, anchorElement.offsetTop);
    }

    viewDetailsOfFlaw(flaw: Elixr.Api.ViewModels.FlawViewModel) {
        this.viewingDetailsOfFlawIds.push(flaw.flawId);
    }
    isViewingDetailsOfFlaw(flaw: Elixr.Api.ViewModels.FlawViewModel) {
        return this.viewingDetailsOfFlawIds.indexOf(flaw.flawId) !== -1;
    }

    submitFlaw($element: angular.IAugmentedJQueryStatic): void {
        if (!this.newFlaw)
            return;

        if (this.newFlaw.mods.filter(mod => mod.modifierType === Elixr.Api.Models.ModifierType.Normal && mod.modifier > 0).length > 0
            || (this.currentModifierType === Elixr.Api.Models.ModifierType.Normal && this.currentModifier > 0)) {
            alert("Flaw modifiers must be negative. Consider making a corresponding Feature with the positive modifiers and adding this Flaw(with the positive modifiers removed) as a Required Flaw.");
            return;
        }

        if (this.currentModifierType !== Elixr.Api.Models.ModifierType.Normal || this.currentModifier !== 0) {
            this.addMod();
        }

        for (let statMod of this.newFlaw.mods) {
            statMod.reason = `Flaw: ${this.newFlaw.name}`;
        }

        this.apiService.post<Elixr.Api.ViewModels.FlawViewModel, Elixr.Api.ViewModels.FlawViewModel>("flaws/create", this.newFlaw).then(result => {
            this.flaws = [result.data].concat(this.flaws);

            this.newFlaw = null;
            this.showThanksForSubmitting = true;



            this.currentModifier = 0;
            this.currentModifierType = this.availableModifierTypes[0];
            this.currentStat = this.availableStats[0];

            this.isFun = this.isBalanced = this.abidesTOS = false;

            this.scrollToAnchor();

        });
    }
    searchFlaws(append = false): void {
        this.loading = true;

        if (append) {
            this.searchQuery.skip += this.searchQuery.take;
        }
        else {
            this.noMoreResults = false;
            this.searchQuery.skip = 0;
        }

        this.apiService.post<Elixr.Api.ApiModels.SearchInput, Elixr.Api.ViewModels.FlawViewModel[]>("flaws/search", this.searchQuery)
            .then(result => {
                if (append) {
                    this.flaws = this.flaws.concat(result.data);
                }
                else {
                    this.flaws = result.data;
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
        return !(this.flaws && this.flaws.length > 0);
    }

    shouldShowLoadMore(): boolean {
        return !this.noMoreResults && !this.shouldShowEmptyBox() && !this.loading;
    }

    flawClicked(flaw: Elixr.Api.ViewModels.FlawViewModel): void {

        if (this.forResult) {

            this.forResult.resolve(flaw);
        }

    }

    newNameKeyDown($evt: KeyboardEvent) {

        if ($evt.keyCode === 9) {
            $evt.preventDefault();
            this.editDescription();
        }
    }


    get disableSubmitButton(): boolean {
        if (!this.newFlaw) {
            return false;
        }
        if (!(this.abidesTOS && this.isFun && this.isBalanced)) {
            return true;
        }

        if (!this.newFlaw.description || !this.newFlaw.name) {
            return true;
        }

        return false;
    }
}


let directive: angular.IDirective = {
    bindToController: {
        forResult: "=?"
    },
    scope: {},
    controller: RPGFlawsController,
    controllerAs: "$ctrl",
    name: "rpgFlaws",
    replace: true,
    templateUrl: "/flaws/directives/rpg-flaws.html"
};

export = directive;