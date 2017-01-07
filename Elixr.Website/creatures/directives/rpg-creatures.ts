import ApiService from "services/api-service";

class RPGCreaturesController {
    searchQuery: Elixr.Api.ApiModels.SearchInput;
    loading = false;
    noMoreResults = false;

    creatures: Elixr.Api.ViewModels.CreatureViewModel[];

    standard = Elixr.Api.ApiModels.SearchMode.JustOfficial;
    community = Elixr.Api.ApiModels.SearchMode.JustCommunity;
    all = Elixr.Api.ApiModels.SearchMode.All;

    static $inject = ["apiService"];
    constructor(private apiService: ApiService) {
        this.searchQuery = {
            searchMode: Elixr.Api.ApiModels.SearchMode.JustOfficial,
            name: "",
            skip: 0,
            take: 25
        };
        this.searchCreatures();
    }

    searchCreatures(append = false): void {
        this.loading = true;

        if (append) {
            this.searchQuery.skip += this.searchQuery.take;
        }
        else {
            this.noMoreResults = false;
            this.searchQuery.skip = 0;
        }

        this.apiService.post<Elixr.Api.ApiModels.SearchInput, Elixr.Api.ViewModels.CreatureViewModel[]>("creatures/search", this.searchQuery)
            .then(result => {
                if (append) {
                    this.creatures = this.creatures.concat(result.data);
                }
                else {
                    this.creatures = result.data;
                }
                if (result.data.length < this.searchQuery.take) {
                    this.noMoreResults = true;
                }
            })
            .finally(() => this.loading = false);
    }

    shouldShowEmptyBox(): boolean {
        if (this.loading) {
            return false;
        }
        return !(this.creatures && this.creatures.length > 0);
    }

    shouldShowLoadMore(): boolean {
        return !this.noMoreResults && !this.shouldShowEmptyBox() && !this.loading;
    }
}

let directive: angular.IDirective = {
    bindToController: {},
    scope: {},
    controller: RPGCreaturesController,
    controllerAs: "$ctrl",
    name: "rpgCreatures",
    templateUrl: "/creatures/directives/rpg-creatures.html"
};

export = directive;