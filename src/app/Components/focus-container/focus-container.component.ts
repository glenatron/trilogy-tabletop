import { Component, Input, Output, AfterContentInit, ContentChildren, EventEmitter } from '@angular/core';
import { FocusList } from '../../Directives/focus-list.directive';

@Component({
    selector: 'focus-container',
    templateUrl: './focus-container.component.html',
    styleUrls: ['./focus-container.component.scss']
})
export class FocusContainerComponent implements AfterContentInit {

    @Input() title: string = '';

    @Input() open: ContainerStatus = ContainerStatus.Consistent;

    @Output() status: EventEmitter<ContainerStatus> = new EventEmitter<ContainerStatus>();

    public maximise = true;

    constructor() { }

    ngAfterContentInit(): void {
        console.log("We golden.");
    }

    public toggleContainer(): void {
        switch (this.open) {
            case ContainerStatus.Closed:
                this.open = ContainerStatus.Open;
                break;
            case ContainerStatus.Open:
                this.open = ContainerStatus.Consistent;
                break;
            case ContainerStatus.Consistent:
                this.open = ContainerStatus.Closed;
                break;
        }
        this.status.emit(this.open);
    }

    public isOpen(): boolean {
        return this.open != ContainerStatus.Closed;
    }

    public isFullHeight(): boolean {
        return this.open == ContainerStatus.Open;
    }

    public isConsistentHeight(): boolean {
        return this.open == ContainerStatus.Consistent
    }

}

// Three clicks - closed, this open, all in column open.
export enum ContainerStatus {
    Closed,
    Open,
    Consistent
}
