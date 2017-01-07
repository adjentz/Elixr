import ApiService from "services/api-service";
import { RPGPlayerSession } from "services/rpg-player-session";

class RPGRacesController {

    forResult: angular.IDeferred<Elixr.Api.ViewModels.RaceViewModel>;
    races: Elixr.Api.ViewModels.RaceViewModel[];
    newRace: Elixr.Api.ViewModels.RaceViewModel;
    searchQuery: Elixr.Api.ApiModels.SearchInput;

    standard = Elixr.Api.ApiModels.SearchMode.JustOfficial;
    community = Elixr.Api.ApiModels.SearchMode.JustCommunity;
    all = Elixr.Api.ApiModels.SearchMode.All;

    normalModifierType = Elixr.Api.Models.ModifierType.Normal;
    doubleModifierType = Elixr.Api.Models.ModifierType.Double;
    halveModifierType = Elixr.Api.Models.ModifierType.Halve;

    viewingDetailsOfRaceIds: number[];
    loading = false;
    showThanksForSubmitting = false;
    editingDescription = false;
    private noMoreResults = false;

    isFun = false;
    isBalanced = false;
    abidesTOS = false;

    getFeatureResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.FeatureViewModel>;
    getFlawResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.FlawViewModel>;

    static $inject = ["apiService", "rpgPlayerSession", "$q"];
    constructor(private apiService: ApiService, public rpgPlayerSession: RPGPlayerSession, private $q: angular.IQService) {

        this.viewingDetailsOfRaceIds = [];
        this.searchQuery = {
            name: "",
            searchMode: Elixr.Api.ApiModels.SearchMode.JustOfficial,
            skip: 0,
            take: 25
        };

        this.searchRaces(false);
    }

    searchRaces(append = false): void {
        this.loading = true;

        if (append) {
            this.searchQuery.skip += this.searchQuery.take;
        }
        else {
            this.noMoreResults = false;
            this.searchQuery.skip = 0;
        }

        this.apiService.post<Elixr.Api.ApiModels.SearchInput, Elixr.Api.ViewModels.RaceViewModel[]>("races/search", this.searchQuery)
            .then(result => {
                if (append) {
                    this.races = this.races.concat(result.data);
                }
                else {
                    this.races = result.data;
                }
                if (result.data.length < this.searchQuery.take) {
                    this.noMoreResults = true;
                }
            })
            .catch(result => console.log(result))
            .finally(() => this.loading = false);
    }

    addFeature(): void {
        this.getFeatureResultDeferred = this.$q.defer();
        this.getFeatureResultDeferred.promise.then(f => {
            if (f.applyType !== Elixr.Api.Models.FeatureApplyingType.Self) {
                alert("Feature cannot be applied to Race");
                return;
            }

            if (f.requiredOaths.length > 0) {
                alert("Features that require an Oath cannot be included by default with a Race");
                return;
            }

            let raceFlawIds = this.newRace.flawInformation.map(fi => fi.flaw.flawId);

            for (let requiredFlaw of f.requiredFlaws) {
                if (raceFlawIds.indexOf(requiredFlaw.flawId) === -1) {
                    alert(`Feature requires ${requiredFlaw.name} Flaw. Add this Flaw before adding the Feature to this Race`);
                    return;
                }
            }

            this.newRace.featureInformation.push({
                costWhenTaken: 0,
                energySacrificedWhenTaken: 0,
                feature: f,
                featureInfoId: 0,
                notes: "",
                takenAtLevel: 0
            });
        }).finally(() => this.getFeatureResultDeferred = null);
    }
    cancelAddFeature(): void {
        this.getFlawResultDeferred = null;
    }

    addFlaw(): void {
        this.getFlawResultDeferred = this.$q.defer();
        this.getFlawResultDeferred.promise.then(f => {
            this.newRace.flawInformation.push({
                flaw: f,
                flawInfoId: 0,
                notes: ""
            });
        }).finally(() => this.getFlawResultDeferred = null);
    }
    cancelAddFlaw(): void {
        this.getFeatureResultDeferred = null;
    }

    raceClicked(race: Elixr.Api.ViewModels.RaceViewModel): void {

        if (this.forResult) {
            this.forResult.resolve(race);
        }
    }

    viewDetailsOfRace(race: Elixr.Api.ViewModels.RaceViewModel) {
        this.viewingDetailsOfRaceIds.push(race.raceId);
    }

    isViewingDetailsOfRace(race: Elixr.Api.ViewModels.RaceViewModel) {
        return this.viewingDetailsOfRaceIds.indexOf(race.raceId) !== -1;
    }
    shouldShowEmptyBox(): boolean {
        if (this.loading) {
            return false;
        }
        return !(this.races && this.races.length > 0);
    }

    shouldShowLoadMore(): boolean {
        return !this.noMoreResults && !this.shouldShowEmptyBox() && !this.loading;
    }

    cancelRace(): void {
        this.newRace = null;
    }
    createRace(): void {
        this.showThanksForSubmitting = false;
        this.newRace = {
            description: `### Physical Description\n~enter description~\n### Culture\n~enter culture~\n### Sample Names\nMale:\n\nFemale:
            `,
            featureInformation: [],
            flawInformation: [],
            name: "",
            raceId: 0
        };
    }

    editDescription(): void {
        this.editingDescription = true;
    }

    newNameKeyDown($evt: KeyboardEvent) {

        if ($evt.keyCode === 9) {
            $evt.preventDefault();
            this.editDescription();
        }
    }

    submitRace($element: angular.IAugmentedJQueryStatic): void {
        if (!this.newRace)
            return;


        for (let fi of this.newRace.featureInformation) {
            console.log(fi);
            if (fi.feature.mustSacrificeEnergy && !fi.energySacrificedWhenTaken) {
                alert("Must have positive value for sacrificed Energy");
                return;
            }
        }

        this.apiService.post<Elixr.Api.ViewModels.RaceViewModel, Elixr.Api.ViewModels.RaceViewModel>("races/create", this.newRace).then(result => {
            this.races = [result.data].concat(this.races);

            this.newRace = null;
            this.showThanksForSubmitting = true;

            this.isFun = this.isBalanced = this.abidesTOS = false;

            let myAnchor = document.getElementById("createRaceAnchor");
            window.scrollTo(0, myAnchor.offsetTop - 50);

        });
    }
    removeFeature(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel): void {
        let idx = _(this.newRace.featureInformation).findIndex(fi => fi === featureInfo);
        if (idx > -1) {
            this.newRace.featureInformation.splice(idx, 1);
        }
    }

    removeFlaw(flawInfo: Elixr.Api.ViewModels.FlawInfoViewModel): void {

        let featureInformationRequiringThisFlaw = this.newRace.featureInformation.filter(fi => fi.feature.requiredFlaws.map(f => f.flawId).indexOf(flawInfo.flaw.flawId) > -1);
        if (featureInformationRequiringThisFlaw.length > 0) {
            if (!confirm("This will remove Features that require this Flaw. Are you sure?")) {
                return;
            }

            _.remove(this.newRace.featureInformation, fi => featureInformationRequiringThisFlaw.indexOf(fi) > -1);
        }

        let idx = _(this.newRace.flawInformation).findIndex(fi => fi === flawInfo);
        if (idx > -1) {
            this.newRace.flawInformation.splice(idx, 1);
        }
    }

    get disableSubmitButton(): boolean {
        if (!this.newRace) {
            return false;
        }
        if (!(this.abidesTOS && this.isFun && this.isBalanced)) {
            return true;
        }

        if (!this.newRace.description || !this.newRace.name) {
            return true;
        }

        return false;
    }
}


let directive: angular.IDirective = {
    bindToController: {
        forResult: "="
    },
    scope: {},
    controller: RPGRacesController,
    controllerAs: "$ctrl",
    templateUrl: "/races/directives/rpg-races/rpg-races.html",
    name: "rpgRaces"
};
export = directive;