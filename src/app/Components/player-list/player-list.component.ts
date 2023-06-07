import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { Player, IPlayer } from '../../../../../../trilogy-core/src/Player';

@Component({
    selector: 'player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {

    public open: boolean = true;

    public add: boolean = false;

    public playerSummary: IPlayer;

    public playersExist = false;

    public players = new BehaviorSubject<Array<Player>>([]);


    constructor(public gameService: TrilogyGameService, public changeDetector: ChangeDetectorRef) {
        this.playerSummary = this.emptyPlayer();
        this.gameService.players.subscribe(pl => {
            if (0 < pl.length) {
                this.playersExist = true;
            } else {
                this.open = true;
            }
            this.changeDetector.detectChanges();
            this.players.next(pl);
        });
    }


    ngOnInit(): void {

    }

    public toggleOpen(): void {
        this.open = !this.open;
    }

    public openAddition(): void {
        this.add = true;
    }

    public saveAddition(): void {
        this.gameService.addPlayer(this.playerSummary);
        this.cancelAddition();
    }

    public cancelAddition(): void {
        this.add = false;
        this.playerSummary = this.emptyPlayer();
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
