class RPGChaptersController{
    visibleSubItems:string[] = [];

    toggleVisible(item:string):void{
        this.visibleSubItems.push(item);
    }
    shouldBeVisible(item:string):boolean{
        return this.visibleSubItems.indexOf(item) > -1;
    }
}

let directive:angular.IDirective = {
    bindToController:{},
    scope:{},
    controller:RPGChaptersController,
    controllerAs:"$ctrl",
    name:"rpgChapters",
    templateUrl:"/directives/rpg-chapters.html"
};
export = directive;