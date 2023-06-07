import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { RollType } from '../../../../../../trilogy-core/src/Character/DicePool';
import { IMoveSummary, IMoveRoll } from '../../../../../../trilogy-core/src/Character/IMoveSummary';
import { IMoveResult, Move } from '../../../../../../trilogy-core/src/Character/Move';

@Component({
    selector: 'move',
    templateUrl: './move.component.html',
    styleUrls: ['./move.component.scss']
})
export class MoveComponent implements OnInit {

    @Input() public moveSummary: IMoveSummary = {
        name: '',
        trigger: '',
        stat: '',
        fullSuccess: '',
        intermediate: '',
        failure: '',
        notes: '',
        source: ''
    };

    @Output() public roll = new EventEmitter<IMoveRoll>();

    public open: boolean = false;

    public editing: boolean = false;

    public selectedStat: string = '';

    public rollType = RollType.Normal;

    public stats: Array<string> = new Array<string>();

    constructor() {

    }

    ngOnInit(): void {
        if (this.moveSummary.name == '') {
            this.editing = true;
            this.open = true;
        }
    }

    public statsCount(): number {
        return this.getStats().length;
    }

    public getStats(): Array<string> {
        if (!this.stats || this.stats.length == 0) {
            this.stats = this.moveSummary.stat.split(',');
            if (this.stats.length == 1) {
                this.selectedStat = this.stats[0];
            }
        }
        return this.stats;
    }

    public toggleOpen(): void {
        this.open = !this.open;
    }

    public takeAdvantage(checked: boolean): void {
        if (checked) {
            this.rollType = RollType.Advantage;
        } else {
            this.rollType = RollType.Normal;
        }
    }

    public takeDisadvantage(checked: boolean): void {
        if (checked) {
            this.rollType = RollType.Disadvantage;
        } else {
            this.rollType = RollType.Normal;
        }
    }

    public rollStat(): void {
        this.roll.emit({
            summary: this.moveSummary,
            selectedStat: this.selectedStat,
            rollType: this.rollType
        });
    }
}
