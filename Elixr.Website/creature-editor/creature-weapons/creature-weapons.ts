import CreatureEditor from "../creature-editor";
import ModalService from '../../services/modal-service';

export default class CreatureWeaponsController {

    editor: CreatureEditor;
    addingWeapon = false;
    askReduceWealth = false;
    acquiredWeapon: Elixr.Api.ViewModels.WeaponViewModel;
    addWeaponResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.WeaponViewModel>;
    viewingDetailOfWeapon: Elixr.Api.ViewModels.WeaponInfoViewModel;

    static $inject = ["$q", "modalService"];
    constructor(private $q: angular.IQService, private modalService: ModalService) {

    }
    addWeapon(): void {
        this.addingWeapon = true;
        this.modalService.modalActive = true;
        this.askReduceWealth = false;
        this.addWeaponResultDeferred = this.$q.defer();

        this.addWeaponResultDeferred.promise.then(weapon => {
            let weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel = {
                featuresApplied: [],
                notes: "",
                weapon: weapon,
                weaponInfoId: 0
            };
            this.editor.addWeaponInfo(weaponInfo);
            this.acquiredWeapon = weapon;
            this.askReduceWealth = true;
        });
    }
    reduceWealthOptionSelected(reduce: boolean): void {

        if (reduce) {
            let purchaseStatMod = {
                modifier: this.acquiredWeapon.cost * -1,
                modifierType: Elixr.Api.Models.ModifierType.Normal,
                reason: `Purchased ${this.acquiredWeapon.name}`,
                stat: Elixr.Api.Models.Stat.Wealth,
                statModId: 0
            };
            this.editor.addBaseStat(purchaseStatMod);
        }
        this.addingWeapon = false;
        this.modalService.modalActive = false;
    }
    removeWeapon(weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel): void {
        this.editor.removeWeaponInfo(weaponInfo);
    }

    removeFeatureFromWeapon(featureInfo: Elixr.Api.ViewModels.FeatureInfoViewModel): void {
        if (!this.viewingDetailOfWeapon) {
            return;
        }
        this.editor.removeFeatureInfoFromWeaponInfo(featureInfo, this.viewingDetailOfWeapon);
    }

    viewWeaponDetail(weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel): void {
        this.viewingDetailOfWeapon = weaponInfo;
    }

    closeSlideouts(): void {
        this.addingWeapon = false;
        this.viewingDetailOfWeapon = null;
        this.modalService.modalActive = false;
    }

    getWeaponBonus(weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel): string {
        let bonus = 0;

        switch (weaponInfo.weapon.attackAbility) {
            case Elixr.Api.Models.Stat.StrengthMisc:
            case Elixr.Api.Models.Stat.NaturalStrengthScore:
                bonus += this.editor.creature.strengthBonus;
                break;
            case Elixr.Api.Models.Stat.AgilityMisc:
            case Elixr.Api.Models.Stat.NaturalAgilityScore:
                bonus += this.editor.creature.agilityBonus;
                break;
            case Elixr.Api.Models.Stat.FocusMisc:
            case Elixr.Api.Models.Stat.NaturalFocusScore:
                bonus += this.editor.creature.focusBonus;
                break;
            case Elixr.Api.Models.Stat.CharmMisc:
            case Elixr.Api.Models.Stat.NaturalCharmScore:
                bonus += this.editor.creature.charmBonus;
                break;
        }

        let bonusMods: Elixr.Api.ViewModels.StatModViewModel[] = [];
        weaponInfo.featuresApplied.forEach(fi => {
            fi.feature.mods.forEach(m => {
                if (m.stat === Elixr.Api.Models.Stat.WeaponAttackIncrease) {
                    bonusMods.push(m);
                }
            });
        });

        let bonusFromMods = 0;
        bonusMods.filter(m => m.modifierType === Elixr.Api.Models.ModifierType.Normal).forEach(m => bonusFromMods += m.modifier);

        let bonusFromModsMultiplier = 1;
        bonusMods.filter(m => m.modifierType !== Elixr.Api.Models.ModifierType.Normal).forEach(m => {
            if (m.modifierType === Elixr.Api.Models.ModifierType.Double) {
                bonusFromModsMultiplier *= 2;
            }
            else if (m.modifierType === Elixr.Api.Models.ModifierType.Halve) {
                bonusFromModsMultiplier *= 0.5;
            }
        });

        let totalBonus = bonus + (bonusFromMods * bonusFromModsMultiplier);
        let sign = "";
        if (totalBonus >= 0) {
            sign = "+";
        }
        return sign + totalBonus;
    }

    getWeaponDamage(weaponInfo: Elixr.Api.ViewModels.WeaponInfoViewModel): string {
        let damage = weaponInfo.weapon.damage;

        let extraDamage = 0;
        switch (weaponInfo.weapon.damageAbility) {
            case Elixr.Api.Models.Stat.StrengthMisc:
            case Elixr.Api.Models.Stat.NaturalStrengthScore:
                extraDamage += this.editor.creature.strengthBonus;
                break;
            case Elixr.Api.Models.Stat.AgilityMisc:
            case Elixr.Api.Models.Stat.NaturalAgilityScore:
                extraDamage += this.editor.creature.agilityBonus;
                break;
            case Elixr.Api.Models.Stat.FocusMisc:
            case Elixr.Api.Models.Stat.NaturalFocusScore:
                extraDamage += this.editor.creature.focusBonus;
                break;
            case Elixr.Api.Models.Stat.CharmMisc:
            case Elixr.Api.Models.Stat.NaturalCharmScore:
                extraDamage += this.editor.creature.charmBonus;
                break;
        }

        let damageMods: Elixr.Api.ViewModels.StatModViewModel[] = [];
        weaponInfo.featuresApplied.forEach(fi => {
            fi.feature.mods.forEach(m => {
                if (m.stat === Elixr.Api.Models.Stat.WeaponDamageIncrease) {
                    damageMods.push(m);
                }
            });
        });

        let damageFromMods = 0;
        damageMods.filter(m => m.modifierType === Elixr.Api.Models.ModifierType.Normal).forEach(m => damageFromMods += m.modifier);

        let damageFromModsMultiplier = 1;
        damageMods.filter(m => m.modifierType !== Elixr.Api.Models.ModifierType.Normal).forEach(m => {
            if (m.modifierType === Elixr.Api.Models.ModifierType.Double) {
                damageFromModsMultiplier *= 2;
            }
            else if (m.modifierType === Elixr.Api.Models.ModifierType.Halve) {
                damageFromModsMultiplier *= 0.5;
            }
        });

        let totalExtraDamage = extraDamage + (damageFromMods * damageFromModsMultiplier);
        let sign = "+";
        if (totalExtraDamage < 0) {
            totalExtraDamage *= -1;
            sign = "-";
        }

        return `${damage} ${sign} ${totalExtraDamage}`;
    }

    static directive: angular.IDirective = {
        bindToController: {
            editor: "="
        },
        scope: {},
        controller: CreatureWeaponsController,
        controllerAs: "$ctrl",
        name: "creatureWeapons",
        replace: true,
        templateUrl: "creature-editor/creature-weapons/creature-weapons.html"
    };
}

