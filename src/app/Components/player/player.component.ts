import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { Player, IPlayer } from '../../../../../../trilogy-core/src/Player';
import { TrilogyCharacter } from '../../../../../../trilogy-core/src/Character/TrilogyCharacter';

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

    @Input() id: string = '';

    @Input() gmView: boolean = false;

    public playerSummary: IPlayer;

    public player: Player | null = null;

    public editing = true;

    public showCharacterForm = false;

    public open = false;

    public characters = new Subject<Array<TrilogyCharacter>>();

    public editCharacterId = "";

    constructor(public gameService: TrilogyGameService, public changeDetector: ChangeDetectorRef) {
        this.playerSummary = this.emptyPlayer();
        this.gameService.players.subscribe(players => {
            if (this.player) {
                let updatedPlayer = players.find(x => x.id == this.player!.id);
                if (updatedPlayer) {
                    this.player = updatedPlayer;
                    this.characters.next(this.player!.characters);
                }
            }
        });
    }

    ngOnInit(): void {
        if (this.id != '') {
            this.player = this.gameService.getPlayer(this.id);
            this.playerSummary = this.player!.toStore();
            this.editing = false;
        } else {
            this.open = true;
        }
    }

    public toggleOpen() {
        this.open = !this.open;
        if (this.open) {
            if (this.player) {
                this.changeDetector.detectChanges();
                setTimeout(() => {
                    this.characters.next(this.player!.characters);
                }, 1);
            }
        }
    }

    public getLink(): string {
        if (this.player != null) {
            var url = window.location.href + "?invite=" + this.player.inviteCode;
            return url;
        }
        return '';
    }

    public createCharacter(): void {
        if (this.player != null) {
            this.showCharacterForm = true;
            this.editing = true;
        }
    }

    public characterCreated(made: boolean): void {
        if (this.player != null) {
            console.log("created I guess.");
            this.editing = false;
            this.editCharacterId = "";
        }
    }

    public editCharacter(characterId: string) {
        this.editCharacterId = characterId;
        this.editing = true;
    }

    private emptyPlayer(): IPlayer {
        return {
            id: '',
            name: '',
            characters: [],
            activeCharacterId: '',
            isGM: false
        };
    }

}
