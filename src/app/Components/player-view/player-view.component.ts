import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { Player } from '../../../../../../trilogy-core/src/Player';

@Component({
    selector: 'player-view',
    templateUrl: './player-view.component.html',
    styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit {

    public found: boolean = false;

    public inviteCode: string = '';

    public player: Player | null = null;

    constructor(public gameService: TrilogyGameService, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            if (params['invite']) {
                this.inviteCode = params['invite'];
            }
        });
    }

    ngOnInit(): void {

    }

    public startPlayer() {
        if (this.inviteCode != '') {
            this.player = this.gameService.findPlayerFromInvite(this.inviteCode);
        }
    }

}
