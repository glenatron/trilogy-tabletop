import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FocusList } from '../../Directives/focus-list.directive';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { Player, IPlayer } from '../../../../../../trilogy-core/src/Player';

@Component({
    selector: 'player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent extends FocusList implements OnInit {

    public add: boolean = false;

    public playerSummary: IPlayer;

    public playersExist = false;

    public players = new BehaviorSubject<Array<Player>>([]);

    public listType = "player-list";

    private detectorReady = false;

    constructor(public gameService: TrilogyGameService, public changeDetector: ChangeDetectorRef) {
        super();
        this.playerSummary = this.emptyPlayer();
        this.gameService.players.subscribe(pl => {
            if (0 < pl.length) {
                this.playersExist = true;
            }
            if (this.detectorReady) {
                this.changeDetector.detectChanges();
            }
            this.players.next(pl);
        });
    }


    ngOnInit(): void {
        this.detectorReady = true;
        this.changeDetector.detectChanges();
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
