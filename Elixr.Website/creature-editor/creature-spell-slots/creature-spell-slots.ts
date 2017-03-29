import CreatureEditor from '../creature-editor';

interface IActiveSpell {
    regenRemaining: number;
    energyChanneled: number;
    spellId: number;
    activeSpellId: number
}

export class CreatureActiveSpellsController {

    editor: CreatureEditor;
    activeSpells: IActiveSpell[];
    newActiveSpell: IActiveSpell;

    constructor() {
        this.activeSpells = [];
    }

    get castSpellMessage(): string {

        if (this.editor.creature.focusMod <= 0) {
            return "Not enough Focus to cast spell";
        }
        if (this.editor.creature.focusMod === this.activeSpells.length) {
            return "No spell slots remaining";
        }
        if (this.editor.creature.spellInformation.length < 1) {
            return "No known spells";
        }

        return "Cast Spell+";
    }

    spellSelected(spell: Elixr.Api.ViewModels.SpellViewModel): void {
        this.newActiveSpell.regenRemaining = spell.regenTimeInRounds;
        this.newActiveSpell.spellId = spell.spellId;
    }

    get canCastSpell(): boolean {
        return this.editor.creature.focusMod > this.activeSpells.length && this.editor.creature.spellInformation.length > 0;
    }

    get availableSpells(): Elixr.Api.ViewModels.SpellViewModel[] {
        return this.editor.creature.spellInformation.map(si => si.spell);
    }

    getSpellById(id: number) {
        return this.availableSpells.filter(f => f.spellId === id)[0];
    }

    get totalEnergyChanneled(): number {
        let total = 0;
        this.activeSpells.map(as => as.energyChanneled)
            .forEach(val => total += val);
        return total;
    }
    get totalRegenTime(): string {
        let hasAConcentrationSpell = false;
        let totalRegenTime = 0;
        for (let activeSpell of this.activeSpells) {
            if (this.activeSpellIsConcentration(activeSpell)) {
                hasAConcentrationSpell = true;
            }
            totalRegenTime += activeSpell.regenRemaining;
        }

        if (totalRegenTime > 0) {
            let regenMessage = totalRegenTime.toString();
            if (hasAConcentrationSpell) {
                regenMessage += " + Con";
            }
            return regenMessage;
        }
        if (hasAConcentrationSpell) {
            return "Con";
        }
        return "0";
    }
    get showPumpTurn(): boolean {
        return this.activeSpells.filter(as => !this.activeSpellIsConcentration(as) && as.regenRemaining > 0).length > 0;
    }
    stopConcentratingOn(activeSpell: IActiveSpell): void {
        let spellIndex = this.activeSpells.indexOf(activeSpell);
        if (spellIndex > -1) {
            this.activeSpells.splice(spellIndex, 1);
        }
    }

    pumpTurn(): void {

        let nonConcentrationActiveSpells = this.activeSpells.filter(as => !this.activeSpellIsConcentration(as));
        nonConcentrationActiveSpells.forEach(as => as.regenRemaining--);

        nonConcentrationActiveSpells.forEach(nas => {
            let index = this.activeSpells.indexOf(nas);
            if (index > -1) {
                this.activeSpells.splice(index);
            }
        });
    }
    spellCast(): void {
        if (this.totalEnergyChanneled + this.newActiveSpell.energyChanneled > this.editor.creature.currentEnergy) {
            alert("Your Current Energy is too low to channel that much.");
            return;
        }

        this.activeSpells.push(this.newActiveSpell);
        this.newActiveSpell = null;
    }
    activeSpellIsConcentration(activeSpell: IActiveSpell): boolean {
        let spell = this.getSpellById(activeSpell.spellId);
        return spell.regenTimeInRounds < 1;
    }
    castSpell(): void {
        this.newActiveSpell = {
            energyChanneled: 0,
            regenRemaining: 0,
            spellId: 0,
            activeSpellId: this.activeSpells.length * -1
        };
    }
    closeSlideout(): void {
        this.newActiveSpell = null;
    }

    static directive = <angular.IDirective>{
        bindToController: {
            editor: "="
        },
        scope: {},
        controller: CreatureActiveSpellsController,
        controllerAs: "$ctrl",
        name: "creatureSpellSlots",
        replace: true,
        templateUrl: "creature-editor/creature-spell-slots/creature-spell-slots.html"
    };
}