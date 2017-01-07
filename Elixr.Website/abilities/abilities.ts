class AbilitiesController {
    scores = [];
    constructor() {
        for (let index = 1; index < 25; index++) {
            this.scores.push(index);
        }
    }
    modForScore(score: number): number {
        let mod = score;
        if (score % 2 !== 0) {
            mod--;
        }
        mod -= 10;
        mod /= 2;
        return mod;
    }
}
let state: angular.ui.IState = {
    name: "abilities",
    url: "/abilities",
    templateUrl: "/abilities/abilities.html",
    controllerAs: "$ctrl",
    controller: AbilitiesController,
    data: {
        title: "Abilities"
    }
};

export = state;