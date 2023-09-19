import { Component, AfterContentInit, QueryList, ContentChildren } from '@angular/core';
import { FocusContainerComponent, ContainerStatus } from '../focus-container/focus-container.component';

@Component({
    selector: 'focus-list-set',
    templateUrl: './focus-list-set.component.html',
    styleUrls: ['./focus-list-set.component.scss']
})
export class FocusListSetComponent implements AfterContentInit {

    @ContentChildren(FocusContainerComponent) focusLists = new QueryList<FocusContainerComponent>();

    private toggleInProgress: boolean = false;

    constructor() { }

    ngAfterContentInit(): void {
        for (let c of this.focusLists) {
            c.status.subscribe(x => this.toggleLists(c, x));
        }

        console.log("And so on.");
    }

    public toggleLists(item: FocusContainerComponent, status: ContainerStatus): void {
        if (!this.toggleInProgress && status != ContainerStatus.Closed) {
            this.toggleInProgress = true;
            for (let fl of this.focusLists) {
                if (fl != item) {
                    if (status == ContainerStatus.Open) {
                        fl.open = ContainerStatus.Closed;
                    } else {
                        fl.open = ContainerStatus.Consistent;
                    }
                }
            }
            setTimeout(() => this.toggleInProgress = false, 1);
        }
    }




}
