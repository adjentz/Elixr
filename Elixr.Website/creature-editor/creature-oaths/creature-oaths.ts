import CreatureEditor from "../creature-editor";
import ModalService from "services/modal-service";

class CreatureOathsController {
    editor: CreatureEditor;
    addingOath = false;
    addOathResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.OathViewModel>;

    static $inject = ["$q", "modalService"];
    constructor(private $q: angular.IQService, private modalService: ModalService) {

    }

    addOath(): void {
        this.modalService.modalActive = true;
        this.addingOath = true;
        this.addOathResultDeferred = this.$q.defer();
        this.addOathResultDeferred.promise.then(oath => {
            let oathInfo: Elixr.Api.ViewModels.OathInfoViewModel = {
                oath: oath,
                notes: "",
                broken: false,
                oathInfoId: 0
            };
            this.editor.addOathInfo(oathInfo);
        }).finally(() => {
            this.addingOath = false;
            this.modalService.modalActive = false;
        });
    }

    removeOath(oathInfo: Elixr.Api.ViewModels.OathInfoViewModel) {

        let featureInformationRequiringThisOath:Elixr.Api.ViewModels.FeatureInfoViewModel[] = [];
        for(let fi of this.editor.creature.allFeatureInformation) {
            for(let requiredOath of fi.feature.requiredOaths) {
                if(requiredOath.oathId === oathInfo.oath.oathId) {
                    featureInformationRequiringThisOath.push(fi);
                }
            }
        }

        if (featureInformationRequiringThisOath.length > 0) {
            if (!confirm("This will remove Features that require this Oath. Are you sure?")) {
                return;
            }
            
            for (let fi of featureInformationRequiringThisOath) {
                switch (fi.feature.applyType) {
                    case Elixr.Api.Models.FeatureApplyingType.Self:
                        this.editor.removeFeatureInfo(fi);
                        break;
                    case Elixr.Api.Models.FeatureApplyingType.Weapon:
                        for (let wi of this.editor.creature.weaponInformation) {
                            for (let weaponFi of wi.featuresApplied) {
                                if (weaponFi.feature.featureId === fi.feature.featureId) {
                                    this.editor.removeFeatureInfoFromWeaponInfo(fi, wi);
                                }
                            }
                        }
                        break;
                    case Elixr.Api.Models.FeatureApplyingType.Spell:
                        for (let si of this.editor.creature.spellInformation) {
                            for (let spellFi of si.featuresApplied) {
                                if (spellFi.feature.featureId === fi.feature.featureId) {
                                    this.editor.removeFeatureInfoFromSpellInfo(fi, si);
                                }
                            }
                        }
                        break;
                    default:
                        throw "NotImplemented"
                }

            }

        }

        this.editor.removeOathInfo(oathInfo);
    }

    notifyOathUpdated(oathInfo: Elixr.Api.ViewModels.OathInfoViewModel): void {
        this.editor.addOathInfo(oathInfo, true);
    }

    closeSlideout(): void {
        this.addingOath = false;
        this.modalService.modalActive = false;
    }
}

export = <angular.IDirective>{
    bindToController: {
        editor: "="
    },
    scope: {},
    controller: CreatureOathsController,
    controllerAs: "$ctrl",
    name: "creatureOaths",
    replace: true,
    templateUrl: "creature-editor/creature-oaths/creature-oaths.html"
};