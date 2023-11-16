import { Injectable } from '@angular/core';
import { EMPTY, BehaviorSubject, Subject } from 'rxjs';
import { IGame, Game } from '../../../../../trilogy-core/src/Game';
import { DicePool, ICharacterRoll } from '../../../../../trilogy-core/src/Character/DicePool';
import { NPC, INPC } from '../../../../../trilogy-core/src/GM/NPC'
import { Location } from '../../../../../trilogy-core/src/GM/Location';
import { Player, IPlayer } from '../../../../../trilogy-core/src/Player';
import { TrilogyCharacter } from '../../../../../trilogy-core/src/Character/TrilogyCharacter';
import { MessageType, IChat } from '../../../../../trilogy-core/src/Chat';

@Injectable({
    providedIn: 'root'
})
export class TrilogyGameService {

    private gameInPlay: Game | null = null;

    public game = new BehaviorSubject<Game | null>(null);

    public locations = new BehaviorSubject<Array<Location>>([]);

    public npcs = new BehaviorSubject<Array<NPC>>([]);

    public players = new BehaviorSubject<Array<Player>>([]);

    public rollTrigger = new Subject<ICharacterRoll>();

    public chat = new Subject<Array<IChat>>();

    constructor() {
    }


    public loadGame(gm: IGame) {
        this.gameInPlay = new Game(gm);
        this.updateGame();
        setTimeout(() => {
            this.updateGame();
        }, 1)
    }

    public createGame(name: string, gmName: string) {
        const gm = new Player({ id: '', name: gmName, activeCharacterId: '', characters: [], isGM: true });
        const format = {
            id: '',
            name: name,
            players: [gm.toStore()],
            locations: [],
            npcs: [],
            sessions: [],
            characters: [],
            chat: []
        };
        this.gameInPlay = new Game(format);
        this.updateGame();
    }

    public roll(pool: DicePool, name: string = '', stat: string = '') {

        this.rollTrigger.next({
            rolledBy: name,
            statName: stat,
            pool: pool
        });
    }

    public addLocation(loc: Location, parentId: string = '') {
        if (this.gameInPlay) {
            const locIndex = this.gameInPlay.locations.findIndex(x => x.id == loc.id);
            if (0 <= locIndex) {
                this.gameInPlay.locations[locIndex] = loc;
            } else {
                this.gameInPlay.locations.push(loc);
            }
            if (parentId != '') {
                const idx = this.gameInPlay.locations.findIndex(lc => lc.id == parentId);
                if (0 <= idx) {
                    this.gameInPlay.locations[idx].childLocations.push(loc.id);
                }
            }
            this.updateGame();
        }
    }

    public removeLocation(id: string) {
        if (this.gameInPlay) {
            this.gameInPlay.locations = this.gameInPlay.locations.filter(x => x.id != id);
            this.updateGame();
        }
    }

    public getNPC(id: string): NPC {
        if (this.gameInPlay) {
            const locIndex = this.gameInPlay.npcs.findIndex(x => x.id == id);
            if (0 <= locIndex) {
                return this.gameInPlay.npcs[locIndex];
            }
        }
        throw "Cannot retrieve an NPC when no game is present.";

    }

    public setNPC(newNPC: NPC): void {
        if (this.gameInPlay) {
            const locIndex = this.gameInPlay.npcs.findIndex(x => x.id == newNPC.id);
            if (0 <= locIndex) {
                this.gameInPlay.npcs[locIndex] = newNPC;
            } else {
                this.gameInPlay.npcs.push(newNPC);
            }
            this.updateGame();
        }
    }

    public removeNPC(id: string): void {
        if (this.gameInPlay) {
            this.gameInPlay.npcs = this.gameInPlay.npcs.filter(x => x.id != id);
            this.updateGame();
        }
    }

    public getPlayer(id: string): Player {
        if (this.gameInPlay) {
            const plIndex = this.gameInPlay.players.findIndex(x => x.id == id);;
            return this.gameInPlay.players[plIndex];
        }
        throw "Cannot get a player by Id from an empty game.";
    }

    public findPlayerFromInvite(inviteCode: string): Player | null {
        var result = null;
        if (this.gameInPlay) {
            const plIndex = this.gameInPlay.players.findIndex(x => x.inviteCode == inviteCode.trim().toLowerCase());
            if (0 <= plIndex) {
                result = this.gameInPlay.players[plIndex];
            }
        }
        return result;
    }

    public addPlayer(newPlayer: IPlayer): Player {
        if (this.gameInPlay) {
            var player = new Player(newPlayer);
            if (newPlayer.id != '') {
                let locIndex = this.gameInPlay.players.findIndex(x => x.id == newPlayer.id);
                this.gameInPlay.players[locIndex] = player;
            } else {
                this.gameInPlay.players.push(player);
            }
            this.updateGame()
            return player;
        }
        throw "Cannot add a player until a game has been created.";

    }

    public addCharacter(newCharacter: TrilogyCharacter, playerId: string = ''): void {
        if (this.gameInPlay) {
            if (playerId.trim() != '') {
                const player = this.getPlayer(playerId);
                if (newCharacter.id != '') {
                    const fIndex = player.characters.findIndex(x => x.id == newCharacter.id);
                    if (0 <= fIndex) {
                        player.characters[fIndex] = newCharacter;
                    } else {
                        player.characters.push(newCharacter);
                    }
                } else {
                    player.characters.push(newCharacter);
                }
            } else {

                this.gameInPlay!.characters.push(newCharacter);
            }
        } else {
            throw "Cannot add a character until a game has been created";

        }
    }

    public say(playerId: string, message: string) {
        if (this.gameInPlay != null) {
            const player = this.getPlayer(playerId);
            this.notify(player.name, message, MessageType.Chat);
        }
    }

    public rollNotification(playerId: string, roll: ICharacterRoll) {
        if (this.gameInPlay != null) {
            const player = this.getPlayer(playerId);
            let message = "rolled ";
            if (roll.statName.trim() != '') {
                message += '+' + roll.statName + ' (' + roll.pool.modifier + ') ';
            }
            message += roll.pool.score() + ' (' + roll.pool.analysis() + ')';
            this.notify(player.name, message, MessageType.Roll);
        }
    }

    public notify(name: string, message: string, mType: MessageType) {
        if (this.gameInPlay && message.trim() != '') {
            const convo = {
                playerName: name,
                message: message,
                messageType: mType
            };
            this.gameInPlay.chat.push(convo);
            this.updateGame();
        }
    }

    private updateGame() {
        if (this.gameInPlay) {
            this.locations.next(this.gameInPlay.locations);
            this.npcs.next(this.gameInPlay.npcs);
            this.players.next(this.gameInPlay.players);
            this.chat.next(this.gameInPlay.chat);
            this.game.next(this.gameInPlay);
        }
    }




}
