import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { Location, ILocation } from '../../../../../../trilogy-core/src/GM/Location';
import { Game } from '../../../../../../trilogy-core/src/Game';
import { ICharacterRoll } from '../../../../../../trilogy-core/src/Character/DicePool';

@Component({
    selector: 'gm-view',
    templateUrl: './gm-view.component.html',
    styleUrls: ['./gm-view.component.scss']
})
export class GmViewComponent implements OnInit {

    public locationListOpen: boolean = true;

    public game: Game;

    public gameExists = new BehaviorSubject<boolean>(false);

    public openLocation: Location | null = null;

    public currentScene: string | null = null;

    public diceRoll = new BehaviorSubject<ICharacterRoll | null>(null);

    public gmName = "GM";

    public playerId = '';

    public showLocationModal = false;

    constructor(public gameService: TrilogyGameService) {
        this.game = new Game(null);
        this.gameService.game.subscribe(x => {
            if (x) {
                this.game = x;
                this.gameExists.next(true);
                const playa = this.game!.players.find(x => x.isGM);
                if (playa) {
                    this.playerId = playa.id;
                }
            }
        });
        this.gameService.rollTrigger.subscribe(x => {
            this.diceRoll.next(x);
        });

    }

    ngOnInit(): void {

    }

    public createGame(): void {
        console.log("Create");
        this.gameService.createGame(this.game.name, this.gmName);

    }

    public showLocation(loc: Location): void {
        this.openLocation = loc;
        this.showLocationModal = true;
    }

    public closeLocation(): void {
        this.openLocation = null;
        this.showLocationModal = false;
    }
    public gmOptionsClosed(): void {
        this.closeLocation();
    }

    public notifyRoll(roll: ICharacterRoll): void {
        this.gameService.rollNotification(this.playerId, roll);
    }

}

