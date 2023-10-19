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

    public mildDanger = false;

    public severeDanger = false;

    public mortalDanger = false;

    public harmLevels: Array<Array<IHarm>> = [[], [], [], []];

    public editHarm = this.emptyHarm();

    public formOpen = false;

    constructor(private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.updateTrack();
    }


    public updateHarm() {
        this.formOpen = false;
        if (this.editHarm.value.trim() == '') {
            this.cleared.emit(this.editHarm);
        } else {
            this.updated.emit(this.editHarm);
        }
        this.setDangerLevel();
        this.updateTrack();
        this.editHarm = this.emptyHarm();
    }

    public clearHarm(harm: IHarm) {
        this.cleared.emit(harm);
        this.setDangerLevel();
        this.updateTrack();
    }

    public addHarm() {
        this.editHarm = this.emptyHarm();
        this.formOpen = true;
    }

    public cancelUpdate() {
        this.formOpen = false;
    }

    private updateTrack() {
        this.harmLevels = [[], [], [], []];
        this.track.harmLevels.forEach(hl => {
            this.harmLevels[hl.level - 1].push(hl);
        });
        this.changeDetector.detectChanges();
    }

    private setDangerLevel() {
        this.mildDanger = false;
        this.severeDanger = false;
        this.mortalDanger = false;
        if (this.highLevelHarmExists(4)) {
            this.mortalDanger = true;
        } else if (this.highLevelHarmExists(3)) {
            this.severeDanger = false;
        } else if (this.inDanger()) {
            this.mildDanger = true;
        }
    }

    private emptyHarm(): IHarm {
        return { level: 1, order: 0, value: '' };
    }

    private inDanger(): boolean {
        let harms = this.harmLevels[1];
        let result = true;
        for (let h of harms) {
            if (h.value == '') {
                result = false;
            }
        }
        return result;
    }

    private highLevelHarmExists(level: number): boolean {
        let result = false;
        level--;
        const harm = this.harmLevels[level][0];
        if (harm && harm.value != '') {
            result = true;
        }

        return result;
    }

}
