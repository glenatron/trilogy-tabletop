import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { IStatistic } from '../../../../../../trilogy-core/src/Character/IStatistic';
import { Counter, IStoredCounter } from '../../../../../../trilogy-core/src/Character/Counter';
import { DicePool } from '../../../../../../trilogy-core/src/Character/DicePool';
import { ITrilogyCharacterTemplate } from '../../../../../../trilogy-core/src/Character/ITrilogyCharacterTemplate';
import { IMoveRoll } from '../../../../../../trilogy-core/src/Character/IMoveSummary';
import { TrilogyCharacter } from '../../../../../../trilogy-core/src/Character/TrilogyCharacter';
import { IHarm } from '../../../../../../trilogy-core/src/Character/HarmTrack';
import { IMoveSummary } from '../../../../../../trilogy-core/src/Character/IMoveSummary';
import { CharacterArc } from '../../../../../../trilogy-core/src/Character/CharacterArc';
import { ITurningPoint, IArcSummary } from '../../../../../../trilogy-core/src/Character/IArcSummary';
import { IEquipment } from '../../../../../../trilogy-core/src/Character/IEquipment';
import { Equipment } from '../../../../../../trilogy-core/src/Character/Equipment';
import { Armour } from '../../../../../../trilogy-core/src/Character/Armour';
import { BoxSize, ModalWindowComponent } from '../modal-window/modal-window.component';

@Component({
    selector: 'character',
    templateUrl: './character.component.html',
    styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

    @Input() id: string = '';

    @Output() triggerEdit = new EventEmitter<BoxSize>();

    @Input() modalSize: BoxSize | null = null;

    @ViewChild(ModalWindowComponent) modalWindow!: ModalWindowComponent;

    public character: TrilogyCharacter | null = null;

    public open = false;

    public editing = false;

    public turningPointReached = false;

    public showTurningPointForm = false;

    public turningPointName = "";

    public turningPointMove: IMoveSummary | null = null;

    public characterArmour = new BehaviorSubject<Armour | null>(null);

    private notesRequireSave = false;

    constructor(public gameService: TrilogyGameService) {

    }

    ngOnInit(): void {
        if (this.id == '') {
            this.character = TrilogyCharacter.emptyCharacter();
        } else {
            this.gameService.game.subscribe(gm => {
                if (gm != null) {
                    this.character = gm.findCharacter(this.id);
                }
                if (this.character == null) {
                    this.character = TrilogyCharacter.emptyCharacter();
                } else {
                    this.characterArmour.next(this.character.armour);
                }
            });
        }
    }

    public modalWidth(): number {
        return Math.ceil(window.innerWidth * 0.75);
    }

    public modalHeight(): number {
        return Math.ceil(window.innerHeight * 0.75);
    }

    public toggleEdit(): void {
        var size = this.modalWindow.getSize();
        this.open = false;
        this.triggerEdit.emit(size);
    }

    public toggleOpen(): void {
        if (this.notesRequireSave) {
            this.characterUpdated();
        }
        this.open = !this.open;
    }

    public rollStat(stat: DicePool, statName: string): void {
        this.gameService.roll(stat, this.character!.name, statName);
    }

    public statUpdated(stat: IStatistic): void {
        let statIndex = this.character!.stats.findIndex(x => x.name == stat.name);
        if (0 <= statIndex) {
            this.character!.stats[statIndex] = stat;
        } else {
            statIndex = this.character!.customStats.findIndex(x => x.name == stat.name);
            if (0 <= statIndex) {
                this.character!.customStats[statIndex] = stat;
            } else {
                this.character!.customStats.push(stat);
            }
        }
        this.characterUpdated();
    }

    public updateStress(newStress: IStoredCounter): void {
        this.character!.stress = Counter.fromStore(newStress);
        this.characterUpdated();
    }

    public updateStressValue(newValue: number): void {
        this.character!.stress.setValue(newValue);
        this.characterUpdated();
    }

    public updateHarm(newHarm: IHarm): void {
        if (this.character != null) {
            this.character.harm.addHarm(newHarm.level, newHarm.value, this.character!);
            this.characterUpdated();
        }
    }

    public clearHarm(newHarm: IHarm): void {
        if (this.character != null) {
            this.character.harm.clearHarm(newHarm.order, this.character!);
            this.characterUpdated();
        }
    }

    public updateWealth(newWealth: IStoredCounter): void {
        this.character!.wealth = Counter.fromStore(newWealth);
        this.characterUpdated();
    }

    public updateWealthValue(newValue: number): void {
        this.character!.wealth.setValue(newValue);
        this.characterUpdated();
    }

    public updateXPValue(newValue: number): void {
        this.character!.xp.setValue(newValue);
        if (7 <= this.character!.xp.getValue()) {
            this.turningPointReached = true;
        }
        this.characterUpdated();
    }

    public twoWayCounterChanged(counterValue: [string, number]) {
        this.character!.updateTwoWayCounter(counterValue[0], counterValue[1]);
    }

    public saveArmour(newArmour: Armour): void {
        if (newArmour.name.trim() == "") {
            this.character!.armour = null;
        } else {
            this.character!.armour = newArmour;
        }
        this.characterArmour.next(this.character!.armour);
    }

    public turningPoint() {
        this.showTurningPointForm = true;
    }

    public availableTurningPoints(): Array<ITurningPoint> {
        let arc = this.character!.currentArc();
        return arc.getAvailableTurningPoints();
    }

    public changeSelectedTurningPoint(ev: Event): void {
        this.turningPointName = (ev.target as HTMLSelectElement).selectedOptions[0].value;
    }

    public chooseTurningPoint(): void {
        const arc = this.character!.currentArc();
        const arcIndex = arc.summary.turningPoints.findIndex(x => x.title == this.turningPointName);
        if (0 <= arcIndex) {
            arc.addTurningPoint(arcIndex);
            if (this.turningPointMove != null) {
                arc.addAdvancedMove(this.turningPointMove.name);
                this.character!.addMove(this.turningPointMove!);
                this.turningPointMove = null;
            }
            this.turningPointName = "";
            this.character!.xp.setValue(0);
            this.showTurningPointForm = false;
            this.characterUpdated();
        }
    }

    public availableMoves(): Array<IMoveSummary> {
        let arc = this.character!.currentArc();
        return arc.getAvailableAdvancedMoves();
    }

    public changeShownMove(ev: Event): void {
        const selectbox = (ev.target as HTMLSelectElement);
        const selectedValue = selectbox.selectedOptions[0].value;
        this.turningPointMove = this.availableMoves().find(x => x.name == selectedValue) || null;
    }

    public rollMove(move: IMoveRoll): void {
        let roller = new DicePool(6, 2);
        const statIndex = this.character!.stats.findIndex(x => x.name == move.selectedStat);
        roller.modifier = this.character!.stats[statIndex].modifier;
        roller.rollType = move.rollType;
        this.gameService.roll(roller, this.character!.name, move.selectedStat);
    }

    public handleEquipmentUpdate(item: IEquipment): void {
        if (this.character != null) {
            let idx = this.character.equipment.findIndex(x => x.id == item.id);
            if (0 <= idx) {
                this.character.equipment[idx] = Equipment.fromStore(item);
            } else {
                this.character.equipment.push(Equipment.fromStore(item));
            }
            this.characterUpdated();
        }
    }

    public handleEquipmentRemove(item: IEquipment): void {
        if (this.character != null) {
            let idx = this.character.equipment.findIndex(x => x.id == item.id);
            let equipment = new Array<Equipment>();
            for (let i = 0; i < this.character.equipment.length; i++) {
                if (i != idx) {
                    equipment.push(this.character.equipment[i]);
                }
            }
            this.character.equipment = equipment;
        }
    }

    public notesUpdated() {
        this.notesRequireSave = true;
    }

    public arcNotesUpdated(ev: Event) {

    }

    private characterUpdated(): void {
        console.log("TODO: update character.");
    }

}
