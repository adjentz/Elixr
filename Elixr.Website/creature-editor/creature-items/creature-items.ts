import Creature = require("models/creature");
import ModalService from "services/modal-service";
import CreatureEditor from "../creature-editor";

interface ItemCount{
    count:number;
    name:string;
    individualWeight:string;
}

class CreatureItemsController {
    editor:CreatureEditor;
    addItemResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.ItemViewModel>;
    acquiredItem: Elixr.Api.ViewModels.ItemViewModel;
    askReduceCost = false;
    addingItem = false;

    cachedItemCounts:ItemCount[];
    itemCountDirty = true;

    static $inject = ["$q", "modalService"];

    constructor(private $q: angular.IQService, private modalService:ModalService) {

    }
    
    get itemCounts():ItemCount[]{

        if (!this.itemCountDirty) {
            return this.cachedItemCounts;
        }

        let itemInfoById:{[key:number]:Elixr.Api.ViewModels.ItemInfoViewModel[]} = {};

        for(let ii of this.editor.creature.itemInformation){
            let myArray = itemInfoById[ii.item.equipmentId] || [];
            myArray.push(ii);
            itemInfoById[ii.item.equipmentId] = myArray;
        }

        let result:ItemCount[] = [];
        for (var key in itemInfoById) {
            
            if (itemInfoById.hasOwnProperty(key)) {
                var element = itemInfoById[key];
                result.push({
                    count:element.length,
                    individualWeight:element[0].item.weightInPounds.toString(),
                    name:element[0].item.name
                });
            }
        }
        this.cachedItemCounts = result;
        this.itemCountDirty = false;
        
        return this.cachedItemCounts;
    }

    addItem(): void {
        this.askReduceCost = false;
        this.addingItem = true;
        this.modalService.modalActive = true;
        this.addItemResultDeferred = this.$q.defer();

        this.addItemResultDeferred.promise.then(item => {
            this.acquiredItem = item;
            let itemInfo: Elixr.Api.ViewModels.ItemInfoViewModel = {
                featuresApplied: [],
                item: item,
                notes: '',
                itemInfoId:0
            };
            this.editor.addItemInfo(itemInfo);
            this.askReduceCost = true;
            this.itemCountDirty = true;
        });

    }
    reduceOptionSelected(reduce: boolean): void {
        if (reduce) {
            let purchaseStatMod ={
                modifier: this.acquiredItem.cost * -1,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: `Purchased ${this.acquiredItem.name}`,
                stat: Elixr.Api.Models.Stat.Wealth,
                statModId:0
            };
            this.editor.addBaseStat(purchaseStatMod);
        }
        this.addingItem = false;
        this.modalService.modalActive = false;
    }

    closeSlideout():void{
        this.addingItem = false;
        this.modalService.modalActive = false;
    }
}

export = <angular.IDirective>{
    bindToController: {
        editor: "="
    },
    scope: {},
    controller: CreatureItemsController,
    controllerAs: "$ctrl",
    name: "creatureItems",
    replace: true,
    templateUrl: "creature-editor/creature-items/creature-items.html"
};