import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { RollType, DicePool, ICharacterRoll } from '../../../../../../trilogy-core/src/Character/DicePool';
@Component({
    selector: 'dice',
    templateUrl: './dice.component.html',
    styleUrls: ['./dice.component.scss']
})
export class DiceComponent implements OnInit, OnChanges {
    @Input() public roll: ICharacterRoll | null = null;

    @Input() public name: string = '';

    @Input() public pool: DicePool = new DicePool(6, 2);

    @Output() public justRolled = new EventEmitter<ICharacterRoll>();

    public dice: Array<VisibleDice> = [];

    public rolled: boolean = false;

    public rolling: boolean = false;

    public modifierLiteral: string = "0";

    constructor() { }

    ngOnInit(): void {
        this.updateDicePool();
    }

    ngOnChanges(): void {
        if (this.roll != null) {
            this.rolled = false;
            this.pool = this.roll.pool;
            this.updateDicePool();
            this.beginRoll();

        }
    }

    public title() {
        var result = 'Dice';
        if (this.roll) {
            result = this.roll.rolledBy + ' rolls';
            if (this.roll.statName) {
                result += ' +' + this.roll.statName;
            }
        }
        return result;
    }

    public hasAdvantage(): boolean {
        return this.pool.rollType == RollType.Advantage;
    }

    public hasDisadvantage(): boolean {
        return this.pool.rollType == RollType.Disadvantage;
    }

    public setAdvantage(): void {
        this.rolled = false;
        if (this.pool.rollType != RollType.Advantage) {
            this.pool.rollType = RollType.Advantage;
        } else {
            this.pool.rollType = RollType.Normal;
        }
        this.updateDicePool();
    }

    public setDisadvantage(): void {
        this.rolled = false;
        if (this.pool.rollType != RollType.Disadvantage) {
            this.pool.rollType = RollType.Disadvantage;
        } else {
            this.pool.rollType = RollType.Normal;
        }
        this.updateDicePool();
    }


    public increaseLiteral(): void {
        this.rolled = false;
        this.pool.modifier++;
        this.modifierLiteral = this.pool.getModifierLiteral();
    }

    public decreaseLiteral(): void {
        this.rolled = false;
        this.pool.modifier--;
        this.modifierLiteral = this.pool.getModifierLiteral();
    }

    public triggerRoll() {
        this.rolled = false;
        this.roll = {
            rolledBy: this.name,
            statName: '',
            pool: this.pool
        };

        this.beginRoll();
    }

    public beginRoll(): void {
        this.rolling = true;
        this.pool.roll();
        let diceCount = 0;
        let duration = 3000;
        for (let res of this.pool.result) {
            this.dice[diceCount].roll(res, duration);
            diceCount++;
        }
        let newDuration = (duration - Math.floor(duration / 2));
        console.log("Started BeginRoll for " + newDuration);
        let finished = timer(duration).subscribe((t) => {
            this.rolled = true;
            this.rolling = false;
            console.log("Finished BeginRoll");

            this.justRolled.emit(this.roll!);
            finished.unsubscribe();
            this.roll = null;
        });
    }

    private updateDicePool() {
        this.dice = new Array<VisibleDice>();
        for (let i = 0; i < this.pool.size; i++) {
            this.dice.push(new VisibleDice(this.pool.sides));
        }
        this.modifierLiteral = this.pool.getModifierLiteral();
    }
}


class VisibleDice {

    public currentValue: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    public rolling: boolean = false;

    constructor(public sides: number) {
        this.currentValue.next(sides);
    }


    public roll(result: number, duration: number = 1000) {
        const step = 200;
        let localDuration = duration;
        this.rolling = true;
        this.currentValue.next(Math.ceil(Math.random() * this.sides));
        console.log("Start VisibleDice.Roll");
        const sub = timer(step, step).subscribe(r => {
            localDuration -= step;
            console.log("Duration remaining: " + localDuration);
            if (0 < localDuration) {
                this.currentValue.next(Math.ceil(Math.random() * this.sides));
            } else {
                this.rolling = false;
                this.currentValue.next(result)
                console.log("Stop VisibleDice.Roll");
                sub.unsubscribe();
            }
        });

    }



}
