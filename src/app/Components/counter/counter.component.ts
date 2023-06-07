import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { IStoredCounter, Counter } from '../../../../../../trilogy-core/src/Character/Counter';



@Component({
    selector: 'counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

    @Input() public counter: IStoredCounter = {
        name: '',
        size: 1,
        description: '',
        value: 1
    };

    @Output() public value: EventEmitter<number> = new EventEmitter<number>();

    @Output() public updated: EventEmitter<IStoredCounter> = new EventEmitter<IStoredCounter>();

    public editView: boolean = false;

    constructor() { }

    ngOnInit(): void {
        if (this.counter == null) {
            this.counter = {
                name: 'Counter',
                size: 5,
                description: '',
                value: 3
            };
            this.editView = true;
        }
    }

    public getArray() {
        return new Array<number>(this.counter.size).fill(0).map((n, idx) => idx + 1);
    }

    public setValue(val: number) {
        if (val < 0 || this.counter.size < val) {
            throw "Setting counter value out of range: " + val + " is not in range 1 - " + this.counter.size;
        }
        this.counter.value = val;
        this.value.emit(val);
    }

    public saveCounter() {
        this.updated.emit(this.counter);
        this.editView = false;
    }

    public cancelEdit() {
        this.editView = false;
    }

}
