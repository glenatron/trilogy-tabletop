import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMoveSummary } from '../../../../../../trilogy-core/src/Character/IMoveSummary';

@Component({
    selector: 'move-form',
    templateUrl: './move-form.component.html',
    styleUrls: ['./move-form.component.scss']
})
export class MoveFormComponent implements OnInit {

    @Input() moveSummary: IMoveSummary = {
        name: '',
        trigger: '',
        stat: '',
        fullSuccess: '',
        intermediate: '',
        failure: '',
        notes: '',
        source: ''
    };

    @Output() save = new EventEmitter<IMoveSummary>();

    @Output() cancel = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
        if (this.moveSummary == null) {
            throw "Cannot create a move form without a move.";
        }
    }

    public saveMove(): void {
        this.save.emit(this.moveSummary);
    }

    public cancelMove(): void {
        this.cancel.emit(true);
    }

}
