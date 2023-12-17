import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IIdHaver } from '../../../../../../trilogy-core/src/Character/IIdHaver';
import { Location, ILocation } from '../../../../../../trilogy-core/src/GM/Location';
import { Player, IPlayer } from '../../../../../../trilogy-core/src/Player';
import { TrilogyCharacter } from '../../../../../../trilogy-core/src/Character/TrilogyCharacter';
import { NPC, INPC } from '../../../../../../trilogy-core/src/GM/NPC';
import { ActionPoint, Scene } from '../../../../../../trilogy-core/src/GM/Scene';
import { TrilogyGameService } from '../../Services/trilogy-game.service';

@Component({
    selector: 'scene-creator',
    templateUrl: './scene-creator.component.html',
})
export class SceneCreatorComponent implements OnInit {

    @Input() public location: Location | null = null;

    @Input() public initiatingPlayer: Player | null = null;

    @Output() public cancel = new EventEmitter<boolean>();

    public playerInitiated = false;

    public createReady = false;

    public sceneTitle: string = "New Scene";

    public rollResult = "0";

    public NPCs = new Array<NPC>();

    public characters = new Array<TrilogyCharacter>();

    public players = new Array<Player>();

    private otherCharacters = new Array<TrilogyCharacter>();

    private otherNPCs = new Array<NPC>();

    constructor(public gameService: TrilogyGameService) { }

    ngOnInit(): void {
        this.gameService.game.subscribe(gm => {
            if (gm != null) {
                this.otherCharacters = gm.getCharacters();
                this.otherNPCs = gm.npcs;
                this.players = gm.players;
                if (this.initiatingPlayer == null) {
                    this.initiatingPlayer = gm.players.find(x => x.isGM) ?? null;
                }
            }
        });
    }

    public allCharacters(): Array<TrilogyCharacter> {
        return this.otherCharacters;
    }

    public allNPCs(): Array<NPC> {
        return this.otherNPCs;
    }

    public addCharacter(id: string): void {
        const swap = this.swapLists(id, { arrayFrom: this.otherCharacters, arrayTo: this.characters });
        this.otherCharacters = swap.arrayFrom;
        this.characters = swap.arrayTo;
        if (0 < this.characters.length) {
            this.createReady = true;
        } else {
            this.createReady = false;
        }
    }

    public removeCharacter(id: string): void {

        const swap = this.swapLists(id, { arrayFrom: this.characters, arrayTo: this.otherCharacters });
        this.characters = swap.arrayFrom;
        this.otherCharacters = swap.arrayTo;
        this.initiatingPlayer = this.players.find(x => x.isGM) ?? null;
        this.playerInitiated == true;
        if (this.characters.length == 0) {
            this.createReady = false;
        }
    }

    public addNPC(id: string): void {
        const swap = this.swapLists(id, { arrayFrom: this.otherNPCs, arrayTo: this.NPCs });
        this.otherNPCs = swap.arrayFrom;
        this.NPCs = swap.arrayTo;
    }

    public removeNPC(id: string): void {
        const swap = this.swapLists(id, { arrayTo: this.otherNPCs, arrayFrom: this.NPCs });
        this.otherNPCs = swap.arrayTo;
        this.NPCs = swap.arrayFrom;
    }

    public playerChanged(ev: Event): void {
        var elem = (ev.target as HTMLInputElement);
        var characterId = elem.value;
        if (characterId == "gm") {
            this.initiatingPlayer = this.players.find(x => x.isGM) ?? null;
        } else {
            let found = this.players.find(x => 0 <= x.characters.findIndex(y => y.id == characterId));
            if (found) {
                this.initiatingPlayer = found;
                this.playerInitiated = !this.initiatingPlayer.isGM;
            }
        }
    }

    public createScene() {
        let actionPoints = this.characters!.map(x => { return { characterId: x.id, points: 0, expended: 0 } });
        if (this.initiatingPlayer!.isGM) {
            actionPoints.forEach(x => x.points = 1);
        } else {

            let iChars = this.initiatingPlayer!.characters!.filter(x => 0 <= this.characters.findIndex(y => y.id == x.id));
            let score = 0;
            const rolled = parseInt(this.rollResult);
            if (6 < rolled) {
                score++;
            }
            if (10 <= rolled) {
                score++;
            }
            if (0 < score) {
                const apIndex = actionPoints.findIndex(x => 0 <= this.initiatingPlayer!.characters.findIndex(y => y.id == x.characterId));
                actionPoints[apIndex].points = score;

            }
        }
        if (this.sceneTitle == "New Scene") {
            this.sceneTitle = "In " + this.location!.name;
        }
        let scene = new Scene({
            id: '',
            name: this.sceneTitle,
            locationId: this.location!.id,
            initiatingPlayerId: this.initiatingPlayer!.id,
            npcIds: this.NPCs.map(x => x.id),
            characterIds: this.characters.map(x => x.id),
            actionPoints: actionPoints,
            events: [],
            GMNotes: "",
            showPlayers: true
        });
        this.gameService.createScene(scene);
    }

    public cancelCreation(): void {
        this.cancel.emit(true);
    }


    private swapLists<T extends IIdHaver>(id: string, swap: IListSwap<T>): IListSwap<T> {
        var found = swap.arrayFrom.find(x => x.id == id);
        if (found) {
            swap.arrayFrom = swap.arrayFrom.filter(x => x.id != id);
            if (swap.arrayTo.findIndex(x => x.id == id) < 0) {
                swap.arrayTo.push(found);
            }
        }
        return swap;
    }
}

interface IListSwap<T extends IIdHaver> {
    arrayFrom: Array<T>;

    arrayTo: Array<T>;
}
