import ApiService from "services/api-service";
import { RPGPlayerSession } from "services/rpg-player-session";

class RPGSpellsController {

    forResult: angular.IDeferred<Elixr.Api.ViewModels.SpellViewModel>;
    spells: Elixr.Api.ViewModels.SpellViewModel[];
    searchQuery: Elixr.Api.ApiModels.SearchInput;
    loading = false;
    viewingDetailsOfSpellIds: number[] = [];

    all = Elixr.Api.ApiModels.SearchMode.All;
    community = Elixr.Api.ApiModels.SearchMode.JustCommunity;
    standard = Elixr.Api.ApiModels.SearchMode.JustOfficial;

    newSpell: Elixr.Api.ViewModels.SpellViewModel;

    editingDescription = false;

    isBalanced = false;
    isFun = false;
    abidesTOS = false;

    energyCostOptions: string[];
    customEnergyOption = "Custom...";
    customEnergy = "";

    regenTimeOptions: number[];
    customRegenTime: number;

    showThanksForSubmitting = false;

    private noMoreResults = false;

    static $inject = ["apiService", "rpgPlayerSession"];
    constructor(private apiService: ApiService, public rpgPlayerSession: RPGPlayerSession) {

        this.energyCostOptions = ["Up to Current Energy", "See Description", this.customEnergyOption];
        this.regenTimeOptions = [0, -1, 1];

        this.searchQuery = {
            name: "",
            searchMode: Elixr.Api.ApiModels.SearchMode.JustOfficial,
            skip: 0,
            take: 25
        };
        this.searchSpells();
    }

    searchSpells(append = false): void {
        this.loading = true;

        if (append) {
            this.searchQuery.skip += this.searchQuery.take;
        }
        else {
            this.noMoreResults = false;
            this.searchQuery.skip = 0;
        }

        this.apiService.post<Elixr.Api.ApiModels.SearchInput, Elixr.Api.ViewModels.SpellViewModel[]>("spells/search", this.searchQuery)
            .then(result => {
                if (append) {
                    this.spells = this.spells.concat(result.data);
                }
                else {
                    this.spells = result.data;
                }
                if (result.data.length < this.searchQuery.take) {
                    this.noMoreResults = true;
                }
            })
            .catch(result => console.log(result))
            .finally(() => this.loading = false);
    }

    newNameKeyDown($evt: KeyboardEvent) {

        if ($evt.keyCode === 9) {
            $evt.preventDefault();
            this.editDescription();
        }
    }

    createSpell(): void {
        this.showThanksForSubmitting = false;
        this.newSpell = {
            description: "",
            energyCost: this.energyCostOptions[0],
            regenTimeInRounds: this.regenTimeOptions[0],
            movementCost: 30,
            name: "",
            spellId: -1,
            author: null,
            createdAtMS: 0
        };
    }
    cancelSpell(): void {
        this.newSpell = null;
    }

    spellClicked(spell: Elixr.Api.ViewModels.SpellViewModel): void {

        if (this.forResult) {
            this.forResult.resolve(spell);
        }
    }

    formatRegenTime(regenTime: number): string {
        switch (regenTime) {
            case -1:
                return "See Description"
            case 0:
                return "Concentration";
            default:
                return "Other..."
        }
    }

    submitSpell($element: angular.IAugmentedJQueryStatic): void {
        if (!this.newSpell)
            return;


        if (this.newSpell.energyCost === this.customEnergyOption) {
            this.newSpell.energyCost = this.customEnergy;
        }
        if (this.newSpell.regenTimeInRounds > 0) {
            this.newSpell.regenTimeInRounds = this.customRegenTime;
        }

        this.isBalanced = this.isFun = this.abidesTOS = false;

        this.apiService.post<Elixr.Api.ViewModels.SpellViewModel, Elixr.Api.ViewModels.SpellViewModel>("spells/create", this.newSpell).then(result => {
            this.spells = [result.data].concat(this.spells);

            this.newSpell = null;
            this.isFun = this.isBalanced = this.abidesTOS = false;
            this.showThanksForSubmitting = true;
            let myAnchor = document.getElementById("createSpellAnchor");

            window.scrollTo(0, myAnchor.offsetTop - 50);

        });
    }

    viewDetailsOfSpell(spell: Elixr.Api.ViewModels.SpellViewModel) {
        this.viewingDetailsOfSpellIds.push(spell.spellId);
    }
    isViewingDetailsOfSpell(spell: Elixr.Api.ViewModels.SpellViewModel) {
        return this.viewingDetailsOfSpellIds.indexOf(spell.spellId) !== -1;
    }

    shouldShowEmptyBox(): boolean {
        if (this.loading) {
            return false;
        }
        return !(this.spells && this.spells.length > 0);
    }

    shouldShowLoadMore(): boolean {
        return !this.noMoreResults && !this.shouldShowEmptyBox() && !this.loading;
    }

    editDescription(): void {
        this.editingDescription = true;
    }

    shouldShowEdit(spell: Elixr.Api.ViewModels.SpellViewModel): boolean {
        return spell.author.playerId === this.rpgPlayerSession.playerId;
    }
    editSpell(spell: Elixr.Api.ViewModels.SpellViewModel) {
        this.newSpell = spell;
        
        this.customEnergy = spell.energyCost;
        this.newSpell.energyCost = this.customEnergyOption;
        
        this.customRegenTime = spell.regenTimeInRounds;
        this.scrollToAnchor();
    }
    private scrollToAnchor(): void {
        let anchorElement = document.getElementById("createSpellAnchor");
        window.scrollTo(window.scrollX, anchorElement.offsetTop);
    }
}


let directive: angular.IDirective = {
    bindToController: {
        forResult: "=?"
    },
    scope: {},
    controller: RPGSpellsController,
    controllerAs: "$ctrl",
    name: "rpgSpells",
    replace: true,
    templateUrl: "/magic/directives/rpg-spells.html"
};

export = directive;