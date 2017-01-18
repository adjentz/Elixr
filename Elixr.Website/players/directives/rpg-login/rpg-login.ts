class RPGLoginController {
    signingUp = false;
    playerName = "";
    password = "";
    passwordConfirmation = "";
    errorMessage = "";

    private serviceUrl = "/api";
    loggedIn: () => void;
    static $inject = ["$http"];
    constructor(private $http: angular.IHttpService) {

    }

    private saveAuthToken(authToken): void {
        if (authToken) {
            localStorage.setItem("authToken", JSON.stringify(authToken));
        }
    }

    private signUp(): void {
        if (this.password.length < 6) {
            this.errorMessage = "Password not long enough.";
            return;
        }
        if (this.password !== this.passwordConfirmation) {
            this.errorMessage = "Passwords do not match.";
            return;
        }

        let input = {
            playerName: this.playerName,
            initialPassword: this.password
        };
        this.$http.post<Elixr.Api.ApiModels.AuthToken>(`${this.serviceUrl}/authentication/signup`, input).then(result => {
            if (!result.data) {
                this.errorMessage = "There was a problem with your signup. Your Player Name may already be taken.";
                return;
            }
            this.saveAuthToken(result.data);
        });
    }
    private login(): void {
        if (!this.playerName || !this.password) {
            return;
        }

        let input = {
            playerName: this.playerName,
            password: this.password
        };

        this.$http.post(`${this.serviceUrl}/authentication/login`, input).then(result => {
            if (!result.data) {
                this.errorMessage = "There was a problem with your login or your Player Name/Password was invalid.";
                return;
            }
            this.saveAuthToken(result.data);
            if (this.loggedIn) {
                this.loggedIn();
            }
        });

    }
    go(): void {

        if (this.signingUp) {
            this.signUp();
        }
        else {
            this.login();
        }

    }
}

let directive: angular.IDirective = {
    name: "rpgLogin",
    bindToController: {
        loggedIn: "&"
    },
    scope: {},
    controllerAs: "$ctrl",
    controller: RPGLoginController,
    templateUrl: "/players/directives/rpg-login/rpg-login.html"
};

export = directive;
