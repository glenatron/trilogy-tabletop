import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { NPC, INPC } from '../../../../../../trilogy-core/src/GM/NPC';
import { IStoredCounter, Counter } from '../../../../../../trilogy-core/src/Character/Counter';
@Component({
    selector: 'npc',
    templateUrl: './npc.component.html',
    styleUrls: ['./npc.component.scss']
})
export class NpcComponent implements OnInit {

    @Input() public id: string = '';

    @Input() public showSummary: boolean = false;

    @Input() public gmView: boolean = false;

    @Output() public created = new EventEmitter<NPC>();

    public npc: NPC;

    public open: boolean = true;

    public editing: boolean = true;

    public showPlayers: boolean = false;

    private newNPC = false;

    constructor(public gameService: TrilogyGameService) {
        this.npc = NPC.create();
    }

    public ngOnInit(): void {
        if (this.id != '') {
            this.npc = this.gameService.getNPC(this.id);
            this.open = false;
            this.editing = false;
        } else {
            this.id = this.npc.id;
            this.newNPC = true;
        }
    }

    public toggleOpen() {
        this.open = !this.open;
    }

    public startEdit() {
        this.editing = true;
    }

    updateNPC(): void {
        this.gameService.setNPC(this.npc);
        if (this.newNPC) {
            this.created.emit(this.npc);
        }
        this.editing = false;
    }

    resetNPC(): void {
        if (this.id == '') {
            this.npc = NPC.create();
        } else {
            this.npc = this.gameService.getNPC(this.id);
            this.editing = false;
        }

    }

    updateResilience(counter: IStoredCounter): void {
        this.npc.resilience.overwrite(counter);
        this.updateNPC();
    }

    updateResilienceValue(value: number): void {
        this.npc.resilience.setValue(value);
        this.updateNPC();
    }



}
