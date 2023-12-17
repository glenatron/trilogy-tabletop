import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IIdHaver } from '../../../../../../trilogy-core/src/Character/IIdHaver';
import { Location, ILocation } from '../../../../../../trilogy-core/src/GM/Location';
import { Player, IPlayer } from '../../../../../../trilogy-core/src/Player';
import { TrilogyCharacter } from '../../../../../../trilogy-core/src/Character/TrilogyCharacter';
import { NPC, INPC } from '../../../../../../trilogy-core/src/GM/NPC';
import { ActionPoint, Scene } from '../../../../../../trilogy-core/src/GM/Scene';
import { TrilogyGameService } from '../../Services/trilogy-game.service';

@Component({
    selector: 'scene',
    templateUrl: './scene.component.html',
    styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

    @Input() public gmView: boolean = false;

    public scene: Scene | null = null;

    public NPCs = new Array<NPC>();

    public characters = new Array<TrilogyCharacter>();

    public players = new Array<Player>();

    public actionPoints = new Map<string, ActionPoint>();

    public createNPC = false;

    public location = new Location({
        id: '',
        name: '',
        description: '',
        GMNotes: '',
        showPlayers: false,
        childLocations: []
    });

    constructor(public gameService: TrilogyGameService) { }

    ngOnInit(): void {

        this.gameService.game.subscribe(gm => {
            if (gm != null) {
                this.scene = gm.currentSession().currentScene();
                if (this.scene) {
                    const loc = gm.locations.find(x => x.id == this.scene!.locationId);
                    if (loc == null) {
                        throw "Cannot load scene with empty location.";
                    }
                    this.location = loc;

                    for (let char of this.scene!.characterIds.map(id => gm.findCharacter(id))) {
                        this.characters = new Array<TrilogyCharacter>();
                        if (char != null) {
                            this.characters.push(char);
                        }
                    }
                    for (let npc of this.scene!.npcIds.map(id => gm.npcs.find(x => x.id == id)).filter(y => y != null)) {
                        this.NPCs = new Array<NPC>();
                        if (npc != null) {
                            this.NPCs.push(npc);
                        }
                    }
                    for (let ap of this.scene.actionPoints) {
                        this.actionPoints.set(ap.characterId, ap);
                    }
                }
            }
        });
    }

    public expendActionPoint(characterId: string): void {
        if (this.actionPoints.has(characterId)) {
            if (0 < this.actionPoints.get(characterId)!.points) {
                this.actionPoints.get(characterId)!.expended++;
            }
        }
    }

    public getActionPoints(id: string): number {

        let result = 0;
        if (this.actionPoints.has(id)) {
            result = this.actionPoints.get(id)!.points - this.actionPoints.get(id)!.expended
        }
        return result;
    }

    public newNPC(): void {
        this.createNPC = true;
    }

    public npcCreated(newNPC: NPC): void {
        this.createNPC = false;
        this.NPCs.push(newNPC);
    }

    public endScene() {
        let found = new Array<ActionPoint>();
        for (let val of this.actionPoints.values()) {
            found.push(val);
        }
        this.gameService.endScene(found);
    }

}

