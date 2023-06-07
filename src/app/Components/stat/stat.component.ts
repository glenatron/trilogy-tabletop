import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { IStatistic } from '../../../../../../trilogy-core/src/Character/IStatistic';
import { RollType, DicePool } from '../../../../../../trilogy-core/src/Character/DicePool';
@Component({
    selector: 'stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

    @Input() statistic: IStatistic = { name: '', modifier: 0 };

    @Output() roll = new EventEmitter<DicePool>();

    @Output() updated = new EventEmitter<IStatistic>();

    public advantageToggle: IToggleAdvantage = { advantage: false, disadvantage: false };

    constructor() {
    }

    ngOnInit(): void {
    }

    public statUpdated() {
        this.updated.emit(this.statistic);
    }

    public statIncrease() {
        if (this.statistic.modifier < 3) {
            this.statistic.modifier++;
            this.statUpdated();
        }
    }
    public statDecrease() {
        if (-1 < this.statistic.modifier) {
            this.statistic.modifier--;
            this.statUpdated();
        }
    }

    public triggerRoll() {
        let roller = new DicePool(6, 2);
        roller.modifier = this.statistic.modifier;
        if (this.advantageToggle.advantage) {
            roller.rollType = RollType.Advantage;
        } else if (this.advantageToggle.disadvantage) {
            roller.rollType = RollType.Disadvantage;
        }
        this.roll.emit(roller);
    }

    public toggleAdvantage(): void {
        this.advantageToggle.advantage = !this.advantageToggle.advantage;
        this.advantageToggle.disadvantage = false;
    }

    public toggleDisadvantage(): void {
        this.advantageToggle.disadvantage = !this.advantageToggle.disadvantage;
        this.advantageToggle.advantage = false;
    }

    public getStatisticValue(): string {
        let result = '0';
        if (0 < this.statistic.modifier) {
            result = '+' + this.statistic.modifier;
        } else if (this.statistic.modifier < 0) {
            result = this.statistic.modifier.toString();
        }
        return result;
    }
}

interface IToggleAdvantage {

    advantage: boolean;

    disadvantage: boolean;
}
