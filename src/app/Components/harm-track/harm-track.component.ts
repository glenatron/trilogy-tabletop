import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HarmTrack, IHarm } from '../../../../../../trilogy-core/src/Character/HarmTrack';

@Component({
    selector: 'harm-track',
    templateUrl: './harm-track.component.html',
    styleUrls: ['./harm-track.component.scss']
})
export class HarmTrackComponent implements OnInit {

    @Input() track: HarmTrack = new HarmTrack();

    @Output() updated = new EventEmitter<IHarm>();

    @Output() cleared = new EventEmitter<IHarm>();

    private harmOpen: Array<Array<boolean>> = [[], [false, false], [false, false], [false], [false]];

    constructor(private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    public getHarmAtLevel(level: number): Array<IndexedHarm> {
        const harms = this.track.harmLevels.filter(x => x.level == level);
        const found = new Array<IndexedHarm>();
        for (let i = 0; i < harms.length; i++) {
            found.push(new IndexedHarm(this.harmOpen[level][i], harms[i]));
        }
        return found;
    }


    public updateLevel(harm: IHarm) {
        if (harm.value.trim() == '') {
            this.cleared.emit(harm);
        } else {
            this.updated.emit(harm);
        }
    }

    public setUpdateLevel(lv: number) {
        if (!this.harmOpen[lv][0]) {
            this.harmOpen[lv][0] = true;
        } else {
            if (this.harmOpen[lv].length == 2) {
                this.harmOpen[lv][1] = true;
            }
        }
        this.changeDetector.detectChanges();

    }

    public inDanger(): boolean {
        let harms = this.getHarmAtLevel(2);
        let result = true;
        for (let h of harms) {
            if (h.open) {
                if (h.harm.value == '') {
                    result = false;
                }
            } else {
                result = false;
            }
        }
        return result;
    }

    public inSevereHarm(): boolean {
        return this.highLevelHarmExists(3);
    }

    public inMortalDanger(): boolean {
        return this.highLevelHarmExists(4);
    }

    private highLevelHarmExists(level: number): boolean {
        let result = false;
        if (this.harmOpen[level][0]) {
            const harm = this.track.harmLevels.find(x => x.level == level);
            if (harm && harm.value != '') {
                result = true;
            }
        }
        return result;
    }

}

class IndexedHarm {

    constructor(
        public open: boolean,
        public harm: IHarm) { }
}

interface IHarmLevelMeasure {
    1: Array<boolean>,
    2: Array<boolean>,
    3: Array<boolean>,
    4: Array<boolean>

}
