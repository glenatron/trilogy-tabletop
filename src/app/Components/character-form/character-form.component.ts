import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from '../../../../../../trilogy-core/src/Game';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { ITrilogyCharacterTemplate } from '../../../../../../trilogy-core/src/Character/ITrilogyCharacterTemplate';
import { IArcSummary } from '../../../../../../trilogy-core/src/Character/IArcSummary';
import { TrilogyCharacter } from '../../../../../../trilogy-core/src/Character/TrilogyCharacter';
import { Armour } from '../../../../../../trilogy-core/src/Character/Armour';
import { ArcList } from '../../../../../../trilogy-core/src/Character/arcs/ArcList';
import { IEquipment, EquipmentQuality } from '../../../../../../trilogy-core/src/Character/IEquipment';
import { Equipment } from '../../../../../../trilogy-core/src/Character/Equipment';
import { IMoveSummary } from '../../../../../../trilogy-core/src/Character/IMoveSummary';
import { ArcComponent } from '../arc/arc.component';
import { IStoredTwoWayCounter, TwoWayCounter } from '../../../../../../trilogy-core/src/Character/TwoWayCounter';
import { BoxSize, ModalWindowComponent } from '../modal-window/modal-window.component';

@Component({
    selector: 'character-form',
    templateUrl: './character-form.component.html',
    styleUrls: ['./character-form.component.scss']
})
export class CharacterFormComponent implements OnInit {

    @Input() public playerId: string = '';

    @Input() public set characterId(value: string) {
        this._characterId = value;
        this.findCharacter();
    }

    public get characterId(): string {
        return this._characterId;
    }

    @Input() public open: boolean = false;

    @Input() public modalSize: BoxSize | null = null;

    @Output() public done = new EventEmitter<BoxSize>();

    @ViewChild(ModalWindowComponent) modalWindow!: ModalWindowComponent;

    public step = 0;

    public titleText = "New Character";

    public character = TrilogyCharacter.emptyCharacter().toStore();

    public chosenArc = this.emptyICharacterArc();

    public chosenBackground = TrilogyCharacter.emptyCharacter().background;

    public equipment = new Subject<Array<Equipment>>();

    public armour = new Subject<Armour | null>();

    public editMove: IMoveSummary | null = null;

    public customStatName = "";

    public customStatWarning = "";

    public customCounter = { name: "", size: 5, description: "", value: 0 };

    public customCounterWarning = "";

    public addTwoWayCounter = false;

    public twoWayCounterWarning = "";

    private editMoveName = "";

    private _characterId = "";

    private game: Game | null = null;



    constructor(public gameService: TrilogyGameService) {
    }

    ngOnInit(): void {
        this.gameService.game.subscribe(gm => this.game = gm);
        if (this.characterId != '') {
            this.findCharacter();
        }
    }

    public modalWidth(): number {
        return Math.ceil(window.innerWidth * 0.75);
    }

    public modalHeight(): number {
        return Math.ceil(window.innerHeight * 0.75);
    }

    public arcNames(): Array<string> {
        return ArcList.ArcNames();
    }

    public saveStep0() {
        if (this.character.name.trim() != '' && this.chosenArc.name != '') {
            const actualArc = ArcList.getArc(this.chosenArc.name);
            this.chosenArc = actualArc;
            this.step = 1;
        }
    }

    public saveStep1() {
        if (this.chosenBackground.name.trim() != '') {
            this.character.background = this.chosenBackground;
            this.equipment.next([]);
            this.step = 2;
        }

    }



    public startEditMove(moveName: string) {
        var found = this.character.customMoves.find(cm => cm.name == moveName);
        if (found) {
            this.editMove = found;
            this.editMoveName = found.name;
        } else {
            this.editMove = this.emptyIMoveSummary();
        }
    }

    public saveMove() {
        const move = this.editMove!;
        move.name = move.name.trim();
        let moveAdded = false;
        if (this.editMoveName != "") {
            var foundIdx = this.character.customMoves.findIndex(x => x.name == this.editMoveName);
            if (0 <= foundIdx) {
                this.character.customMoves[foundIdx] = move;
                moveAdded = true;
            }
        }
        if (!moveAdded) {
            this.character.customMoves.push(move);
        }
        this.cancelMoveEdit();
    }

    public cancelMoveEdit() {
        this.editMove = null;
        this.editMoveName = "";
    }

    public saveAll() {
        this.character.background = this.chosenBackground;
        const charm = TrilogyCharacter.fromStore(this.character);
        charm.addArcByName(this.chosenArc.name);
        this.gameService.addCharacter(charm, this.playerId);
        this.done.emit(this.modalWindow.getSize());
        this.open = false;
    }

    public addBackgroundMove(): void {
        this.chosenBackground.move = this.emptyIMoveSummary();
    }

    public cancelBackgroundMove(event: boolean): void {
        this.chosenBackground.move = null;
    }

    public saveBackgroundMove(summary: IMoveSummary): void {
        this.chosenBackground.move = summary;
    }


    public statName(name: string): string {
        return name.trim().replace(/ /g, '_').toLowerCase();
    }

    public addCustomStat(): void {
        if (this.customStatName.length == 0) {
            this.customStatWarning = "Your custom stat has no name.";
        } else {
            let renamedStat = this.statName(this.customStatName);

            if ((0 <= this.character.stats.findIndex(x => this.statName(x.name) == renamedStat))
                || (0 <= this.character.customStats.findIndex(x => this.statName(x.name) == renamedStat))
            ) {
                this.customStatWarning = "There is already a stat called " + this.customStatName + ".";
            } else {
                this.character.customStats.push({ name: this.customStatName, modifier: 0 });
                this.customStatName = "";
                this.customStatWarning = "";
            }
        }
    }

    public removeCustomStat(name: string): void {
        let renamedStat = this.statName(name);
        this.character.customStats = this.character.customStats.filter(x => this.statName(x.name) != renamedStat);
    }

    public addCustomCounter(): void {
        if (this.customCounter.name.trim().length == 0) {
            this.customCounterWarning == "Custom counters need a name.";
        } else if (this.customCounter.size <= 0) {
            this.customCounterWarning == "Custom counters need a length.";
        } else {
            let renamedCount = this.statName(this.customCounter.name);
            if (0 <= this.character.customCounters.findIndex(x => this.statName(x.name) == renamedCount)) {
                this.customCounterWarning = "There is already a custom counter called " + this.customCounter.name;
            } else {
                this.character.customCounters.push(this.customCounter);
                this.customCounter = { name: "", size: 5, description: "", value: 0 };
            }
        }
    }

    public removeCustomCounter(name: string): void {
        let renamedCounter = this.statName(name);
        this.character.customCounters = this.character.customCounters.filter(x => this.statName(x.name) != renamedCounter);
    }

    public showTwoWayCounterEditor(): void {
        this.addTwoWayCounter = true;
    }

    public updateTwoWayCounter(update: IStoredTwoWayCounter): void {
        this.twoWayCounterWarning = "";
        try {
            this.game!.findCharacter(this.characterId)!.addTwoWayCounter(update);
            this.character.customTwoWayCounters = this.game!.findCharacter(this.characterId)!.twoWayCounters.map(x => x.toStore());
        } catch (e) {
            if (typeof e === "string") {
                this.twoWayCounterWarning = e;
            } else if (e instanceof Error) {
                this.twoWayCounterWarning = e.message;
            }
        }
    }

    public removeTwoWayCounter(id: string): void {
        this.game!.findCharacter(this.characterId)!.removeTwoWayCounter(id);
        this.character.customTwoWayCounters = this.character.customTwoWayCounters.filter(x => x.id != id);
    }


    public saveArmour(newArmour: Armour): void {
        this.character.armour = newArmour.toStore();
        this.armour.next(newArmour);
    }

    public saveEquipment(equipment: IEquipment) {
        this.character.equipment.push(equipment);
        this.equipment.next(this.character.equipment.map(x => Equipment.fromStore(x)));
    }

    public editableMoves(): Array<IMoveSummary> {
        var result = this.character!.customMoves || [];
        if (this.editMove != null) {
            result = result.filter(x => x.name != this.editMove!.name);
        }
        return result;
    }

    public editMoveByName(name: string) {
        this.editMove = this.editableMoves().find(x => x.name == name) || null;
    }

    private findCharacter() {

        if (this.game != null) {
            const char = this.game!.findCharacter(this.characterId);
            if (char != null) {
                this.character = char.toStore();
                this.chosenArc = char.currentArc().summary;
                this.chosenBackground = char.background;
                this.step = 2;
                this.titleText = char.name;
            }
        }
    }

    private emptyICharacterArc(): IArcSummary {
        return {
            name: "",
            summary: "",
            arcNoteFields: [],

            startingEquipment: [],

            positivePoleSuggestions: [],

            negativePoleSuggestions: [],

            initialTrigger: { positive: '', negative: '' },

            turningPoints: [],

            conclusions: [],

            startingMoves: [],

            advancedMoves: [],

            customStatistics: null,

            customCounters: null
        };
    }

    private emptyIMoveSummary(): IMoveSummary {
        return {
            name: '',

            trigger: '',

            stat: '',

            fullSuccess: '',

            intermediate: '',

            failure: '',

            notes: '',

            source: ''
        }
    }


}
