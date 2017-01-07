import ApiService from "services/api-service";
import Stat = Elixr.Api.Models.Stat;
import playerSession = require("services/rpg-player-session");
import Armor from "models/armor";

class RPGArmorController {

    forResult: angular.IDeferred<Elixr.Api.ViewModels.ArmorViewModel>;
    armor: Elixr.Api.ViewModels.ArmorViewModel[];

    searchQuery: Elixr.Api.ApiModels.SearchInput;
    private noMoreResults = false;
    showThanksForSubmitting = false;
    loading = true;

    newArmor: Elixr.Api.ViewModels.ArmorViewModel = null;
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

    viewingDetailsOfArmorIds: number[] = [];

    gold = 0;
    silver = 0;
    copper = 0;

    static $inject = ["apiService", "rpgPlayerSession", "$q"];
    constructor(private apiService: ApiService, public rpgPlayerSession: playerSession.RPGPlayerSession, private $q: angular.IQService) {

        this.searchQuery = {
            searchMode: Elixr.Api.ApiModels.SearchMode.JustOfficial,
            name: "",
            skip: 0,
            take: 25
        };
        this.searchArmor();
        this.magicDamageFromEnchantment = [this.noneMagicDamage, "1d4", "1d6", "1d8", "1d10", "1d12", "1d20"];
    }


    formatAttackAndDamageAbility(ability: Stat): string {
        if (ability === Stat.NaturalStrengthScore || ability === Stat.StrengthMisc) {
            return "Strength";
        }
        else {
            return "Agility";
        }
    }
    cancelArmor(): void {
        this.newArmor = null;
    }
    createArmor(): void {
        this.showThanksForSubmitting = false;
        this.newArmor = new Armor();
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
            this.newArmor.enchantments.push(this.newEnchantment);
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

    enchantmentsByArmorId: { [id: number]: Elixr.Api.ViewModels.EnchantmentViewModel[] } = {};

    viewDetailsOfArmor(armor: Elixr.Api.ViewModels.ArmorViewModel) {
        this.viewingDetailsOfArmorIds.push(armor.equipmentId);
        if (!this.enchantmentsByArmorId[armor.equipmentId]) {
            this.apiService.get<Elixr.Api.ViewModels.EnchantmentViewModel[]>(`armor/enchantments/${armor.equipmentId}`).then(resp => {
                this.enchantmentsByArmorId[armor.equipmentId] = resp.data;
            });
        }
    }
    isViewingDetailsOfArmor(armor: Elixr.Api.ViewModels.ArmorViewModel) {
        return this.viewingDetailsOfArmorIds.indexOf(armor.equipmentId) !== -1;
    }

    submitArmor($element: angular.IAugmentedJQueryStatic): void {
        if (!this.newArmor)
            return;

        if (this.useRecommendedCost) {
            this.newArmor.cost = this.recommendedCost;
        }
        else {
            this.newArmor.cost = (this.gold) + (this.silver * 0.1) + (this.copper * 0.01);
        }

        if (this.currentEnchantmentIsValid) {
            if (this.newEnchantment.magicDamage !== this.noneMagicDamage) {
                let damage = Number(this.newEnchantment.magicDamage.split('d')[1]);
                this.newEnchantment.energyUsedInEnchantment = damage;
            }
            this.newArmor.enchantments.push(this.newEnchantment);
        }

        this.newEnchantment = null;

        this.apiService.post<Elixr.Api.ViewModels.ArmorViewModel, Elixr.Api.ViewModels.ArmorViewModel>("armor/create", this.newArmor).then(result => {
            this.armor = [result.data].concat(this.armor);

            this.newArmor = null;
            this.showThanksForSubmitting = true;

            this.isFun = this.isBalanced = this.abidesTOS = false;

            let myAnchor = document.getElementById("createArmorAnchor");

            window.scrollTo(0, myAnchor.offsetTop - 50);

        });
    }
    searchArmor(append = false): void {
        this.loading = true;

        if (append) {
            this.searchQuery.skip += this.searchQuery.take;
        }
        else {
            this.noMoreResults = false;
            this.searchQuery.skip = 0;
        }

        this.apiService.post<Elixr.Api.ApiModels.SearchInput, Elixr.Api.ViewModels.ArmorViewModel[]>("armor/search", this.searchQuery)
            .then(result => {
                if (append) {
                    this.armor = this.armor.concat(result.data);
                }
                else {
                    this.armor = result.data;
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
        return !(this.armor && this.armor.length > 0);
    }
    shouldShowLoadMore(): boolean {
        return !this.noMoreResults && !this.shouldShowEmptyBox() && !this.loading;
    }

    armorClicked(armor: Elixr.Api.ViewModels.ArmorViewModel): void {

        if (this.forResult) {

            this.forResult.resolve(armor);
        }

    }

    newNameKeyDown($evt: KeyboardEvent) {

        if ($evt.keyCode === 9) {
            $evt.preventDefault();
            this.editDescription();
        }
    }


    get disableSubmitButton(): boolean {
        if (!this.newArmor) {
            return false;
        }
        if (!(this.abidesTOS && this.isFun && this.isBalanced)) {
            return true;
        }

        if (!this.newArmor.description || !this.newArmor.name) {
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
        if (!this.newArmor) {
            return 0;
        }
        let appliedEnchantments = [].concat(this.newArmor.enchantments);
        if (this.currentEnchantmentIsValid) {
            appliedEnchantments.push(this.newEnchantment);
        }
        let totalCost = 0;
        totalCost += this.newArmor.weightInPounds * 0.8;

        let factor = 1;
        if (this.newArmor.defenseBonus > 3) {
            factor = 10;
        }

        for (let i = 0; i < this.newArmor.defenseBonus; i++) {
            totalCost += (i + 1) * i;
        }
        totalCost *= factor;

        for (let enchantment of appliedEnchantments) {
            if (!enchantment) {
                continue;
            }

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


        return Math.round(totalCost * 100) / 100;
    }
}


let directive: angular.IDirective = {
    bindToController: {
        forResult: "=?"
    },
    scope: {},
    controller: RPGArmorController,
    controllerAs: "$ctrl",
    name: "rpgArmor",
    replace: true,
    templateUrl: "/equipment/armor/directives/rpg-armor.html"
};

export = directive;