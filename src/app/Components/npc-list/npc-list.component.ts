import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { NPC, INPC } from '../../../../../../trilogy-core/src/GM/NPC'
@Component({
    selector: 'npc-list',
    templateUrl: './npc-list.component.html',
    styleUrls: ['./npc-list.component.scss']
})
export class NpcListComponent implements OnInit {

    public creating = false;

    public liveNPCs = new Subject<Array<NPC>>();

    private npcs = new Array<NPC>();

    constructor(public gameService: TrilogyGameService) {
        gameService.npcs.subscribe(newNpcs => {
            this.npcs = newNpcs;
            this.creating = false;
            this.liveNPCs.next(this.npcs);
        });
    }

    ngOnInit(): void {
    }

    public createNPC(): void {
        this.creating = true;
    }

    public toggleOpen() {

        setTimeout(() => {
            this.liveNPCs.next(this.npcs);
        }, 1);
    }


}
