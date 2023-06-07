import { Component, OnInit, Input, Output } from '@angular/core';
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

    public npc: NPC;

    public open: boolean = true;

    public editing: boolean = true;

    public showPlayers: boolean = false;

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
