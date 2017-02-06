import ApiService from "../../../services/api-service";
import Stat = Elixr.Api.Models.Stat;
import playerSession = require("../../../services/rpg-player-session");

export default class RPGWeaponsController {

    forResult: angular.IDeferred<Elixr.Api.ViewModels.WeaponViewModel>;
    weapons: Elixr.Api.ViewModels.WeaponViewModel[];

    searchQuery: Elixr.Api.ApiModels.SearchInput;
    private noMoreResults = false;
    showThanksForSubmitting = false;
    loading = true;

    newWeapon: Elixr.Api.ViewModels.WeaponViewModel = null;
    useRecommendedCost = true;
    customCost = 0;

    newEnchantment: Elixr.Api.ViewModels.EnchantmentViewModel;
    enchantmentSpellIsAttack = false;
    magicDamageFromEnchantment: string[];
    noneMagicDamage = "None";

    choosingSpell = false;
    chooseSpellResultDeferred: angular.IDeferred<Elixr.Api.ViewModels.SpellViewModel>;
    enchantmentIssue = "";

    standard = Elixr.Api.ApiModels.SearchMode.JustOfficial;
    community = Elixr.Api.ApiModels.SearchMode.JustCommunity;
    all = Elixr.Api.ApiModels.SearchMode.All;

    editingDescription = false;

    isBalanced = false;
    isFun = false;
    abidesTOS = false;

    viewingDetailsOfWeaponIds: number[] = [];

    gold = 0;
    silver = 0;
    copper = 0;

    attackAndDamageAbilities: Stat[];
    rangeOptions: Elixr.Api.Models.Range[];
    damageOptions: string[];

    static $inject = ["apiService", "rpgPlayerSession", "$q"];
    constructor(private apiService: ApiService, public rpgPlayerSession: playerSession.RPGPlayerSession, private $q: angular.IQService) {

        this.searchQuery = {
            searchMode: Elixr.Api.ApiModels.SearchMode.JustOfficial,
            name: "",
            skip: 0,
            take: 25
        };
        this.searchWeapons();
        this.magicDamageFromEnchantment = [this.noneMagicDamage, "1d4", "1d6", "1d8", "1d10", "1d12", "1d20"];
        this.attackAndDamageAbilities = [Stat.NaturalStrengthScore, Stat.NaturalAgilityScore];
        this.rangeOptions = [Elixr.Api.Models.Range.None, Elixr.Api.Models.Range.Short, Elixr.Api.Models.Range.Medium, Elixr.Api.Models.Range.Long, Elixr.Api.Models.Range.Extreme];
        this.damageOptions = ["1d4", "1d6", "1d8", "2d4", "1d10", "1d12", "2d6"];
    }


    formatAttackAndDamageAbility(ability: Stat): string {
        if (ability === Stat.NaturalStrengthScore || ability === Stat.StrengthMisc) {
            return "Strength";
        }
        else {
            return "Agility";
        }
    }

    shouldShowEdit(weapon: Elixr.Api.ViewModels.WeaponViewModel): boolean {
        return weapon.author.playerId === this.rpgPlayerSession.playerId;
    }
    editWeapon(weapon: Elixr.Api.ViewModels.WeaponViewModel) {
        this.newWeapon = weapon;
        this.scrollToAnchor();
    }
    private scrollToAnchor(): void {
        let anchorElement = document.getElementById("createWeaponsAnchor");
        window.scrollTo(window.scrollX, anchorElement.offsetTop);
    }

    cancelWeapon(): void {
        this.newWeapon = null;
    }
    createWeapon(): void {
        this.showThanksForSubmitting = false;
        this.newWeapon = {
            description: "",
            equipmentId: -1,
            name: "",
            imageUrl: "",
            cost: 0,
            enchantments: [],
            author: null,
            createdAtMS: 0,
            weightInPounds: 0,
            attackAbility: this.attackAndDamageAbilities[0],
            damageAbility: this.attackAndDamageAbilities[0],
            damage: "1d4",
            range: this.rangeOptions[0]
        };
    }

    cancelEnchantment(): void {
        this.newEnchantment = null;
    }

    private get currentEnchantmentIsValid(): boolean {
        if (!this.newEnchantment) {
            return false;
        }
        if (!this.newEnchantment.name) {
            return false;
        }
        if (!this.newEnchantment.description) {
            return false;
        }
        if (!this.newEnchantment.baseSpell) {
            return false;
        }
        if (!(this.newEnchantment.energyUsedInEnchantment > 0)) {
            if (this.newEnchantment.magicDamage === this.noneMagicDamage) {
                return false;
            }
        }

        return true;
    }
    createEnchantment(): void {
        if (this.newEnchantment) {
            if (!this.newEnchantment.name) {
                this.enchantmentIssue = "Current Enchantment does not have a name";
                return;
            }
            if (!this.newEnchantment.description) {
                this.enchantmentIssue = "Current Enchantment does not have a description";
                return;
            }
            if (!this.newEnchantment.baseSpell) {
                this.enchantmentIssue = "Current Enchantment does not have a base spell";
                return;
            }
            if (!(this.newEnchantment.energyUsedInEnchantment > 0)) {
                if (this.newEnchantment.magicDamage !== this.noneMagicDamage) {
                    this.enchantmentIssue = "Current Enchantment does not specify Energy used in creation"
                    return
                }
            }
            this.newWeapon.enchantments.push(this.newEnchantment);
        }
        this.newEnchantment = {
            baseSpell: null,
            description: "",
            enchantmentId: -1,
            energyUsedInEnchantment: 0,
            name: "",
            usesOrRoundsPerDay: 0,
            magicDamage: this.noneMagicDamage
        };
    }
    clearIssue(): void {
        this.enchantmentIssue = "";
    }
    chooseSpell(): void {
        this.choosingSpell = true;
        this.chooseSpellResultDeferred = this.$q.defer();
        this.chooseSpellResultDeferred.promise.then(spell => {
            this.newEnchantment.baseSpell = spell;
        }).finally(() => this.choosingSpell = false);
    }

    editDescription(): void {
        this.editingDescription = true;
    }

    enchantmentsByWeaponId: { [id: number]: Elixr.Api.ViewModels.EnchantmentViewModel[] } = {};

    viewDetailsOfWeapon(weapon: Elixr.Api.ViewModels.WeaponViewModel) {
        this.viewingDetailsOfWeaponIds.push(weapon.equipmentId);
        if (!this.enchantmentsByWeaponId[weapon.equipmentId]) {
            this.apiService.get<Elixr.Api.ViewModels.EnchantmentViewModel[]>(`weapons/enchantments/${weapon.equipmentId}`).then(resp => {
                this.enchantmentsByWeaponId[weapon.equipmentId] = resp.data;
                console.log(resp.data);
            });
        }
    }
    isViewingDetailsOfWeapon(weapon: Elixr.Api.ViewModels.WeaponViewModel) {
        return this.viewingDetailsOfWeaponIds.indexOf(weapon.equipmentId) !== -1;
    }
    submitWeapon($element: angular.IAugmentedJQueryStatic): void {
        if (!this.newWeapon)
            return;

        if (this.useRecommendedCost) {
            this.newWeapon.cost = this.recommendedCost;
        }
        else {
            this.newWeapon.cost = (this.gold) + (this.silver * 0.1) + (this.copper * 0.01);
        }

        if (this.currentEnchantmentIsValid) {
            if (this.newEnchantment.magicDamage !== this.noneMagicDamage) {
                let damage = Number(this.newEnchantment.magicDamage.split('d')[1]);
                this.newEnchantment.energyUsedInEnchantment = damage;
            }
            this.newWeapon.enchantments.push(this.newEnchantment);
        }

        this.newEnchantment = null;

        this.apiService.post<Elixr.Api.ViewModels.WeaponViewModel, Elixr.Api.ViewModels.WeaponViewModel>("weapons/create", this.newWeapon).then(result => {
            this.weapons = [result.data].concat(this.weapons);

            this.newWeapon = null;
            this.showThanksForSubmitting = true;

            this.isFun = this.isBalanced = this.abidesTOS = false;
            this.scrollToAnchor();

        });
    }
    searchWeapons(append = false): void {
        this.loading = true;

        if (append) {
            this.searchQuery.skip += this.searchQuery.take;
        }
        else {
            this.noMoreResults = false;
            this.searchQuery.skip = 0;
        }

        this.apiService.post<Elixr.Api.ApiModels.SearchInput, Elixr.Api.ViewModels.WeaponViewModel[]>("weapons/search", this.searchQuery)
            .then(result => {
                if (append) {
                    this.weapons = this.weapons.concat(result.data);
                }
                else {
                    this.weapons = result.data;
                }
                if (result.data.length < this.searchQuery.take) {
                    this.noMoreResults = true;
                }
            })
            .catch(result => console.log(result))
            .finally(() => this.loading = false);
    }

    shouldShowEmptyBox(): boolean {
        if (this.loading) {
            return false;
        }
        return !(this.weapons && this.weapons.length > 0);
    }
    shouldShowLoadMore(): boolean {
        return !this.noMoreResults && !this.shouldShowEmptyBox() && !this.loading;
    }

    weaponClicked(weapon: Elixr.Api.ViewModels.WeaponViewModel): void {

        if (this.forResult) {

            this.forResult.resolve(weapon);
        }

    }

    newNameKeyDown($evt: KeyboardEvent) {

        if ($evt.keyCode === 9) {
            $evt.preventDefault();
            this.editDescription();
        }
    }


    get disableSubmitButton(): boolean {
        if (!this.newWeapon) {
            return false;
        }
        if (!(this.abidesTOS && this.isFun && this.isBalanced)) {
            return true;
        }

        if (!this.newWeapon.description || !this.newWeapon.name) {
            return true;
        }

        return false;
    }


    private spellIsConcentration(spell: Elixr.Api.ViewModels.SpellViewModel): boolean {
        return spell.regenTimeInRounds === 0;
    }
    get newEnchantmentSpellIsConcentration(): boolean {
        if (!this.newEnchantment) {
            return false;
        }
        if (!this.newEnchantment.baseSpell) {
            return false;
        }

        return this.spellIsConcentration(this.newEnchantment.baseSpell);
    }
    get newEnchantmentSpellIsAttack(): boolean {
        if (!this.newEnchantment) {
            return false;
        }
        return this.newEnchantment.magicDamage !== this.noneMagicDamage;
    }
    get baseSpellName(): string {
        if (this.newEnchantment && this.newEnchantment.baseSpell) {
            return this.newEnchantment.baseSpell.name;
        }
        return "...";
    }

    get recommendedCost(): number {
        if (!this.newWeapon) {
            return 0;
        }
        let appliedEnchantments = [].concat(this.newWeapon.enchantments);
        if (this.currentEnchantmentIsValid) {
            appliedEnchantments.push(this.newEnchantment);
        }
        let totalCost = 0;
        totalCost += this.newWeapon.weightInPounds * 0.8;

        for (let enchantment of appliedEnchantments) {
            let cost = 0;
            if (enchantment.magicDamage != this.noneMagicDamage) {
                let damage = Number(enchantment.magicDamage.split('d')[1]);

                cost = Math.floor(damage * 100 * 3.5);
            }
            else if (this.spellIsConcentration(enchantment.baseSpell)) {

                if (enchantment.usesOrRoundsPerDay === 0) { // Permanent
                    cost = enchantment.energyUsedInEnchantment * 1000;
                }
                else {
                    let effectiveEnergy = enchantment.energyUsedInEnchantment - Math.min(enchantment.usesOrRoundsPerDay, enchantment.energyUsedInEnchantment - 1);
                    cost = effectiveEnergy * 500;
                }
            }
            else { // not damage based, not concentration

                cost = Math.abs(enchantment.baseSpell.regenTimeInRounds) * enchantment.energyUsedInEnchantment;
                if (enchantment.usesOrRoundsPerDay === 0) { // Permanent
                    cost *= 3500;
                }
                else {
                    cost *= 250 * enchantment.usesOrRoundsPerDay;
                }
            }
            totalCost += cost;
        }

        let parts = this.newWeapon.damage.split("d");
        let dice = Number(parts[0]);
        totalCost += Math.min(dice - 1, 0) * 10;
        let damage = Number(parts[1]);
        totalCost += dice * damage * 2;
        switch (this.newWeapon.range) {
            case Elixr.Api.Models.Range.Short:
                totalCost += 50;
                break;
            case Elixr.Api.Models.Range.Medium:
                totalCost += 75;
                break;
            case Elixr.Api.Models.Range.Long:
                totalCost += 95;
                break;
            case Elixr.Api.Models.Range.Extreme:
                totalCost += 120;
                break;
        }
        return Math.round(totalCost * 100) / 100;
    }

    static directive: angular.IDirective = {
        bindToController: {
            forResult: "=?"
        },
        scope: {},
        controller: RPGWeaponsController,
        controllerAs: "$ctrl",
        name: "rpgWeapons",
        replace: true,
        templateUrl: "/equipment/weapons/directives/rpg-weapons.html"
    };

}


