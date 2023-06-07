import { Component, OnInit } from '@angular/core';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { IGame, Game } from '../../../../../../trilogy-core/src/Game';
@Component({
    selector: 'gm-menu',
    templateUrl: './gm-menu.component.html',
    styleUrls: ['./gm-menu.component.scss']
})
export class GmMenuComponent implements OnInit {

    public open: boolean = false;

    public openUpload: boolean = false;

    public gameExists: boolean = false;

    private game: Game | null = null;

    constructor(public gameService: TrilogyGameService) {
        gameService.game.subscribe(g => {
            this.game = g;
            if (g) {
                this.gameExists = true;
            } else {
                this.gameExists = false;
            }
        });
    }

    ngOnInit(): void {
    }

    public toggleMenu() {
        this.open = !this.open;
    }


    public save() {
        if (this.game != null) {
            const gameEncoded = encodeURIComponent(JSON.stringify(this.game!.toStore()));
            const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute('href', 'data:text/json;charset=utf-8,' + gameEncoded);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }

    public showLoadMenu() {
        this.openUpload = true;
    }

    public hideLoadMenu() {
        this.openUpload = false;
    }

    public loadFileDocument(fileEvent: Event) {
        const file = (fileEvent.target as HTMLInputElement)!.files![0];
        let reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const gameString = reader.result!.toString();
                if (gameString != null) {
                    const rbt = JSON.parse(gameString);
                    const realGame = this.isLegitGame(rbt);
                    if (realGame) {
                        this.gameService.loadGame(realGame);
                    }
                }
                this.openUpload = false;
                this.open = false;
            } catch {
                console.warn("Could not interpret string as JSON");
                console.log("Impossible value: " + reader.result);
            }

        };
        reader.readAsText(file);

    }

    private isLegitGame(obj: any): IGame | null {
        const types = ["id", "name", "players", "locations", "characters", "npcs", "sessions", "chat"];
        var result = true;
        for (let t of types) {
            result = result && obj.hasOwnProperty(t);
        }
        if (result) {
            return obj as IGame;
        }
        return null;
    }

}
