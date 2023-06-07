import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
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

@Component({
    selector: 'character-form',
    templateUrl: './character-form.component.html',
    styleUrls: ['./character-form.component.scss']
})
export class CharacterFormComponent implements OnInit {

    @Input() public playerId: string = '';

    @Input() public characterId: string = '';

    @Output() public done = new EventEmitter<boolean>();

    public step = 0;

    public character = TrilogyCharacter.emptyCharacter().toStore();

    public chosenArc = this.emptyICharacterArc();

    public chosenBackground = TrilogyCharacter.emptyCharacter().background;

    public equipment = new Subject<Array<Equipment>>();

    constructor(public gameService: TrilogyGameService) {
    }

    ngOnInit(): void {
        if (this.characterId != '') {
            this.gameService.game.subscribe(gm => {
                if (gm != null) {
                    const char = gm!.findCharacter(this.characterId);
                    if (char != null) {
                        this.character = char.toStore();
                        this.chosenArc = char.currentArc().summary;
                        this.chosenBackground = char.background;
                        this.step = 2;
                    }
                }
            });
        }
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

    public saveAll() {
        this.character.background = this.chosenBackground;
        const charm = TrilogyCharacter.fromStore(this.character);
        charm.addArcByName(this.chosenArc.name);
        this.gameService.addCharacter(charm, this.playerId);
        this.done.emit(true);
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
        return name.replace(/ /g, '_');
    }

    public armour(): Armour | null {
        if (this.character.armour != null && this.character.armour.name != '') {
            return Armour.fromStore(this.character.armour);
        }
        return null;
    }

    public saveArmour(armour: Armour): void {
        this.character.armour = armour.toStore();
    }

    public saveEquipment(equipment: IEquipment) {
        this.character.equipment.push(equipment);
        this.equipment.next(this.character.equipment.map(x => Equipment.fromStore(x)));
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
