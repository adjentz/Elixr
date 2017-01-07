import ApiService from "services/api-service";
import Stat = Elixr.Api.Models.Stat;
import playerSession = require("services/rpg-player-session");

class RPGOathsController {

    forResult: angular.IDeferred<Elixr.Api.ViewModels.OathViewModel>;
    oaths: Elixr.Api.ViewModels.OathViewModel[];

    searchQuery: Elixr.Api.ApiModels.SearchInput;
    private noMoreResults = false;
    showThanksForSubmitting = false;
    loading = true;

    newOath: Elixr.Api.ViewModels.OathViewModel = null;

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

    viewingDetailsOfOathIds: number[] = [];

    static $inject = ["apiService", "rpgPlayerSession"];
    constructor(private apiService: ApiService, public rpgPlayerSession: playerSession.RPGPlayerSession) {


        this.availableStats = [Stat.AbilityPool, Stat.Acrobatics, Stat.AgilityMisc, Stat.AnimalHandling, Stat.Athletics,
        Stat.CharmMisc, Stat.Climb, Stat.Concentration, Stat.Deception, Stat.Defense, Stat.Diplomacy,
        Stat.Engineer, Stat.EscapeArtist, Stat.FocusMisc, Stat.Initiative, Stat.Insight, Stat.Intimidation,
        Stat.MaxEnergy, Stat.Medicine, Stat.Perception, Stat.Perform, Stat.Recall, Stat.SkillPool, Stat.SleightOfHand,
        Stat.Speed, Stat.Stealth, Stat.StrengthMisc, Stat.Survival, Stat.Swim, Stat.Wealth, Stat.WeaponAttackIncrease, Stat.WeaponDamageIncrease];

        this.currentStat = this.availableStats[0];

        this.availableModifierTypes = [Elixr.Api.Models.ModifierType.Normal, Elixr.Api.Models.ModifierType.Double, Elixr.Api.Models.ModifierType.Halve];
        this.currentModifierType = this.availableModifierTypes[0];

        this.searchQuery = {
            searchMode: Elixr.Api.ApiModels.SearchMode.JustOfficial,
            name: "",
            skip: 0,
            take: 25
        };
        this.searchOaths();
    }

    get disableAmountInput(): boolean {
        return this.currentModifierType !== Elixr.Api.Models.ModifierType.Normal;
    }

    addMod(): void {
        this.newOath.mods.push({
            modifier: this.currentModifier,
            modifierType: this.currentModifierType,
            stat: this.currentStat,
            reason: "",
            statModId: 0
        });
    }
    cancelOath(): void {
        this.newOath = null;
    }
    createOath(): void {
        this.showThanksForSubmitting = false;
        this.newOath = {
            description: "",
            oathId: -1,
            name: "",
            mods: []
        };
    }
    editDescription(): void {
        this.editingDescription = true;
    }

    viewDetailsOfOath(oath: Elixr.Api.ViewModels.OathViewModel) {
        this.viewingDetailsOfOathIds.push(oath.oathId);
    }
    isViewingDetailsOfOath(oath: Elixr.Api.ViewModels.OathViewModel) {
        return this.viewingDetailsOfOathIds.indexOf(oath.oathId) !== -1;
    }

    submitOath($element: angular.IAugmentedJQueryStatic): void {
        if (!this.newOath)
            return;

        if (this.currentModifierType !== Elixr.Api.Models.ModifierType.Normal || this.currentModifier !== 0) {
            this.addMod();
        }

        for (let statMod of this.newOath.mods) {
            statMod.reason = `Oath: ${this.newOath.name}`;
        }
        this.apiService.post<Elixr.Api.ViewModels.OathViewModel, Elixr.Api.ViewModels.OathViewModel>("oaths/create", this.newOath).then(result => {
            this.oaths = [result.data].concat(this.oaths);

            this.newOath = null;
            this.showThanksForSubmitting = true;



            this.currentModifier = 0;
            this.currentModifierType = this.availableModifierTypes[0];
            this.currentStat = this.availableStats[0];

            this.isFun = this.isBalanced = this.abidesTOS = false;

            let myAnchor = document.getElementById("createOathsAnchor");

            window.scrollTo(0, myAnchor.offsetTop - 50);

        });
    }
    searchOaths(append = false): void {
        this.loading = true;

        if (append) {
            this.searchQuery.skip += this.searchQuery.take;
        }
        else {
            this.noMoreResults = false;
            this.searchQuery.skip = 0;
        }

        this.apiService.post<Elixr.Api.ApiModels.SearchInput, Elixr.Api.ViewModels.OathViewModel[]>("oaths/search", this.searchQuery)
            .then(result => {
                if (append) {
                    this.oaths = this.oaths.concat(result.data);
                }
                else {
                    this.oaths = result.data;
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
        return !(this.oaths && this.oaths.length > 0);
    }

    shouldShowLoadMore(): boolean {
        return !this.noMoreResults && !this.shouldShowEmptyBox() && !this.loading;
    }

    oathClicked(oath: Elixr.Api.ViewModels.OathViewModel): void {

        if (this.forResult) {

            this.forResult.resolve(oath);
        }

    }

    newNameKeyDown($evt: KeyboardEvent) {

        if ($evt.keyCode === 9) {
            $evt.preventDefault();
            this.editDescription();
        }
    }



    get disableSubmitButton(): boolean {
        if (!this.newOath) {
            return false;
        }
        if (!(this.abidesTOS && this.isFun && this.isBalanced)) {
            return true;
        }

        if (!this.newOath.description || !this.newOath.name) {
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
    controller: RPGOathsController,
    controllerAs: "$ctrl",
    name: "rpgOaths",
    replace: true,
    templateUrl: "/oaths/directives/rpg-oaths.html"
};

export = directive;