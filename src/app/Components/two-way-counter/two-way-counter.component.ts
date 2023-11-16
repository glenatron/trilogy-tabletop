import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { IStoredTwoWayCounter, TwoWayCounter } from '../../../../../../trilogy-core/src/Character/TwoWayCounter';



@Component({
    selector: 'two-way-counter',
    templateUrl: './two-way-counter.component.html',
    styleUrls: ['./two-way-counter.component.scss']
})
export class TwoWayCounterComponent implements OnInit {

    @Input() public counter: IStoredTwoWayCounter = this.getEmptyCounter();

    @Input() public showEdit: boolean = false;

    @Output() public value: EventEmitter<[string, number]> = new EventEmitter<[string, number]>();

    @Output() public updated: EventEmitter<IStoredTwoWayCounter> = new EventEmitter<IStoredTwoWayCounter>();

    public editView: boolean = false;

    public thresholdList = new BehaviorSubject<Array<[number, IThreshold]>>([]);

    constructor() { }

    ngOnInit(): void {
        if (this.counter == null) {
            this.counter = this.getEmptyCounter();
            this.editView = true;
        } else {
            this.editView = this.showEdit;
        }
        this.thresholdList.next(this.getThresholds());
    }

    public getArray() {
        let a = new Array<number>(this.counter.size).fill(0).map((n, idx) => idx + 1);
        return a;
    }

    public updateSize() {
        this.counter.thresholds = this.counter.thresholds.filter(x => x <= this.counter.size);
        this.thresholdList.next(this.getThresholds());
    }

    public getThresholds(): Array<[number, IThreshold]> {
        let result = new Array<[number, IThreshold]>;
        let score = -1;
        let thresholdIndex = 0;
        let lastThreshold = {
            index: 0,
            score: score,
            threshold: true,
            canMoveUp: false,
            canMoveDown: false,
            canAdd: false
        }
        for (let i = 1; i <= this.counter.size; i++) {

            if (thresholdIndex < this.counter.thresholds.length && i == this.counter.thresholds[thresholdIndex]) {
                score++;
                thresholdIndex++;
                let spaceAbove = lastThreshold.threshold == false;
                let spaceBelow = (i < this.counter.size) && ((i + 1) < this.counter.thresholds[thresholdIndex + 1]);
                lastThreshold = {
                    index: thresholdIndex,
                    score: score,
                    threshold: true,
                    canMoveDown: spaceBelow,
                    canMoveUp: spaceAbove,
                    canAdd: false
                };
            } else {
                lastThreshold.threshold = false;
                lastThreshold.canMoveUp = false;
                lastThreshold.canMoveDown = false;
                lastThreshold.canAdd = (thresholdIndex == this.counter.thresholds.length && score < 2);
            }


            result.push([i, lastThreshold]);
        }
        return result;
    }

    public moveThresholdUp(threshIndex: number): void {
        if (threshIndex < this.counter.thresholds.length) {
            let above = this.counter.thresholds[threshIndex - 1];
            let newThreshold = this.counter.thresholds[threshIndex] - 1;
            if (above < newThreshold && 0 < newThreshold) {
                this.counter.thresholds[threshIndex] = newThreshold;
            }
            this.thresholdList.next(this.getThresholds());
        }
    }

    public moveThresholdDown(threshIndex: number): void {
        if (threshIndex < this.counter.thresholds.length) {
            let nextThresh = threshIndex;
            if (threshIndex < this.counter.thresholds.length - 1) {
                let nextValue = this.counter.thresholds[threshIndex + 1];
                if (this.counter.thresholds[threshIndex] < nextValue) {
                    this.counter.thresholds[threshIndex]++;
                }
            } else {
                this.counter.thresholds[threshIndex]++;
            }
            this.thresholdList.next(this.getThresholds());
        }
    }

    public addThreshold(threshIndex: number): void {
        if (threshIndex <= this.counter.size && this.counter.thresholds.length < 5) {
            this.counter.thresholds.push(threshIndex);
            this.thresholdList.next(this.getThresholds());
        }
    }

    public setValue(val: number) {
        if (val < 0 || this.counter.size < val) {
            throw "Setting counter value out of range: " + val + " is not in range 1 - " + this.counter.size;
        }
        if (this.counter.value == val) {
            val--;
        }
        this.counter.value = val;
        this.value.emit([this.counter.id, val]);
    }

    public showEditForm(): void {
        this.editView = true;
    }

    public saveCounter() {
        this.updated.emit(this.counter);
        this.editView = false;
    }

    public cancelEdit() {
        this.editView = false;
    }

    private getEmptyCounter(): IStoredTwoWayCounter {
        return {
            name: '',
            size: 1,
            description: '',
            value: 1,
            leftPole: '',
            rightPole: '',
            thresholds: [],
            id: ''
        };
    }

}

interface IThreshold {

    index: number;

    score: number;

    threshold: boolean;

    canMoveUp: boolean;

    canMoveDown: boolean;

    canAdd: boolean;
}

