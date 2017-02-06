import CreatureEditor from "../creature-editor";
import ModalService from "../../services/modal-service";

export default class CreatureFlawsController {
    editor: CreatureEditor;
    addingFlaw = false;
    addFlawResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.FlawViewModel>;

    static $inject = ["$q", "modalService"];
    constructor(private $q: angular.IQService, private modalService: ModalService) {

    }

    addFlaw(): void {
        this.addingFlaw = true;
        this.modalService.modalActive = true;
        this.addFlawResultDeferred = this.$q.defer();
        this.addFlawResultDeferred.promise.then(flaw => {
            let flawInfo: Elixr.Api.ViewModels.FlawInfoViewModel = {
                flaw: flaw,
                notes: "",
                flawInfoId: 0
            };
            this.editor.addFlawInfo(flawInfo);
        }).finally(() => {
            this.addingFlaw = false;
            this.modalService.modalActive = false;
        });
    }

    flawInfoIsFromRace(flawInfo: Elixr.Api.ViewModels.FlawInfoViewModel): boolean {
        if (!this.editor.creature.race) {
            return false;
        }
        return this.editor.creature.race.flawInformation.filter(fi => fi.flawInfoId === flawInfo.flawInfoId).length > 0;
    }

    removeFlaw(flawInfo: Elixr.Api.ViewModels.FlawInfoViewModel): void {
        if (this.flawInfoIsFromRace(flawInfo)) {
            alert("Flaws from Race cannot be removed without removing/changing Race");
            return;
        }

        let featureInformationRequiringThisFlaw: Elixr.Api.ViewModels.FeatureInfoViewModel[] = [];
        for (let fi of this.editor.creature.allFeatureInformation) {
            for (let requiredFlaw of fi.feature.requiredFlaws) {
                if (requiredFlaw.flawId === flawInfo.flaw.flawId) {
                    featureInformationRequiringThisFlaw.push(fi);
                }
            }
        }

        if (featureInformationRequiringThisFlaw.length > 0) {
            if (!confirm("This will remove Features that require this Flaw. Are you sure?")) {
                return;
            }

            for (let fi of featureInformationRequiringThisFlaw) {
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

        this.editor.removeFlawInfo(flawInfo);
    }

    closeSlideout(): void {
        this.addingFlaw = false;
        this.modalService.modalActive = false;
    }
    notifyFlawChanged(flawInfo: Elixr.Api.ViewModels.FlawInfoViewModel): void {
        this.editor.addFlawInfo(flawInfo, true);
    }

    static directive:angular.IDirective = {
        bindToController: {
            editor: "="
        },
        scope: {},
        controller: CreatureFlawsController,
        controllerAs: "$ctrl",
        name: "creatureFlaws",
        replace: true,
        templateUrl: "creature-editor/creature-flaws/creature-flaws.html"
    };

}

