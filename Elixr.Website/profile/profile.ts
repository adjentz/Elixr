import { RPGPlayerSession } from "../services/rpg-player-session";
import ApiService from "../services/api-service";

export default class ProfileController {
    characters: Elixr.Api.ViewModels.CreatureViewModel[];
    loading = false;

    static $inject = ["apiService", "rpgPlayerSession"];
    constructor(private apiService: ApiService, private rpgPlayerSession: RPGPlayerSession) {
        if (this.loggedIn) {
            this.getCharacters();
        }
    }

    getCharacters(): void {
        this.loading = true;
        this.apiService.get<Elixr.Api.ViewModels.CreatureViewModel[]>("creatures/characters")
            .then(r => this.characters = r.data)
            .finally(() => this.loading = false);
    }
    deleteCharacter(character: Elixr.Api.ViewModels.CreatureViewModel): void {
        if (!confirm("Are you sure? This cannot be undone")) {
            return;
        }

        this.loading = true;
        this.apiService.get<Elixr.Api.ViewModels.CreatureViewModel[]>(`creatures/delete/${character.creatureId}`)
            .then(r => this.characters = r.data)
            .finally(() => this.loading = false);
    }
    logout():void {
        window.localStorage.removeItem("authToken");
        this.rpgPlayerSession.markDirty();
    }

    get loggedIn(): boolean {
        return this.rpgPlayerSession.isAuthenticated;
    }
    get username(): string {
        if (!this.loggedIn) {
            return "";
        }
        return this.rpgPlayerSession.playerName;
    }


    static state: angular.ui.IState = {
        name: "profile",
        url: "/profile",
        templateUrl: "/profile/profile.html",
        controller: ProfileController,
        controllerAs: "$ctrl",
        data: {
            title: "Profile"
        }
    }
}