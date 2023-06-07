import { Component, OnInit, Input, Output } from '@angular/core';
import { TrilogyCharacter } from '../../../../../../trilogy-core/src/Character/TrilogyCharacter';
import { CharacterArc } from '../../../../../../trilogy-core/src/Character/CharacterArc';
import { ITurningPoint } from '../../../../../../trilogy-core/src/Character/IArcSummary';


@Component({
    selector: 'arc',
    templateUrl: './arc.component.html',
    styleUrls: ['./arc.component.scss']
})
export class ArcComponent implements OnInit {

    @Input() arc: CharacterArc | null = null;

    private turningPoint: ITurningPoint | null = null;

    constructor() { }

    ngOnInit(): void {
        if (!this.arc) {
            throw "Cannot instantiate the ArcComponent with no arc!";
        } else {
            this.turningPoint = this.arc.lastTurningPoint();
        }
    }

    public positiveXPTrigger(): string {
        return this.turningPoint!.triggers.positive;
    }

    public negativeXPTrigger(): string {
        return this.turningPoint!.triggers.negative;
    }

    public turningPoints(): Array<string> {
        return this.arc!.getAvailableTurningPoints().map(x => x.title);
    }




}
