import playerSession = require("../services/rpg-player-session");

class PlayersController {

    static $inject = ["rpgPlayerSession"];
    constructor(private rpgPlayerSession: playerSession.RPGPlayerSession) {

    }

    get isAuthenticated():boolean{
        return  this.rpgPlayerSession.isAuthenticated;
    }
}

let state: angular.ui.IState = {
    name: "players",
    templateUrl: "/players/players.html",
    url: "/players",
    controller: PlayersController,
    controllerAs: "$ctrl"
};

export = state;