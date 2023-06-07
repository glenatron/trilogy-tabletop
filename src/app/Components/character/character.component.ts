import { Component, OnInit, Input, Output } from '@angular/core';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { IStatistic } from '../../../../../../trilogy-core/src/Character/IStatistic';
import { Counter, IStoredCounter } from '../../../../../../trilogy-core/src/Character/Counter';
import { DicePool } from '../../../../../../trilogy-core/src/Character/DicePool';
import { ITrilogyCharacterTemplate } from '../../../../../../trilogy-core/src/Character/ITrilogyCharacterTemplate';
import { IMoveRoll } from '../../../../../../trilogy-core/src/Character/IMoveSummary';
import { TrilogyCharacter } from '../../../../../../trilogy-core/src/Character/TrilogyCharacter';
import { IHarm } from '../../../../../../trilogy-core/src/Character/HarmTrack';

@Component({
    selector: 'character',
    templateUrl: './character.component.html',
    styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

    @Input() id: string = '';

    public character: TrilogyCharacter | null = null;

    public open = false;

    public editing = false;

    constructor(public gameService: TrilogyGameService) {

    }

    ngOnInit(): void {
        if (this.id == '') {
            this.character = TrilogyCharacter.emptyCharacter();
        } else {
            this.gameService.game.subscribe(gm => {
                if (gm != null) {
                    this.character = gm.findCharacter(this.id);
                }
                if (this.character == null) {
                    this.character = TrilogyCharacter.emptyCharacter();
                }
            });
        }
    }

    public toggleOpen(): void {
        this.open = !this.open;
    }

    public rollStat(stat: DicePool): void {
        this.gameService.roll(stat);
    }

    public statUpdated(stat: IStatistic): void {
        const statIndex = this.character!.stats.findIndex(x => x.name == stat.name);
        if (0 <= statIndex) {
            this.character!.stats[statIndex] = stat;
        } else {
            this.character!.stats.push(stat);
        }
        this.characterUpdated();
    }

    public updateStress(newStress: IStoredCounter): void {
        this.character!.stress = Counter.fromStore(newStress);
        this.characterUpdated();
    }

    public updateStressValue(newValue: number): void {
        this.character!.stress.setValue(newValue);
        this.characterUpdated();
    }

    public updateHarm(newHarm: IHarm): void {
        this.character!.harm.addHarm(newHarm.level, newHarm.value, this.character!);
        this.characterUpdated();
    }

    public clearHarm(newHarm: IHarm): void {
        this.character!.harm.clearHarm(newHarm.order, this.character!);
        this.characterUpdated();
    }

    public updateWealth(newWealth: IStoredCounter): void {
        this.character!.wealth = Counter.fromStore(newWealth);
        this.characterUpdated();
    }

    public updateWealthValue(newValue: number): void {
        this.character!.wealth.setValue(newValue);
        this.characterUpdated();
    }

    public updateXPValue(newValue: number): void {
        this.character!.xp.setValue(newValue);
        this.characterUpdated();
    }

    public rollMove(move: IMoveRoll): void {
        let roller = new DicePool(6, 2);
        const statIndex = this.character!.stats.findIndex(x => x.name == move.selectedStat);
        roller.modifier = this.character!.stats[statIndex].modifier;
        roller.rollType = move.rollType;
        this.gameService.roll(roller, this.character!.name, move.selectedStat);
    }

    private characterUpdated(): void {
        console.log("TODO: update character.");
    }

}
