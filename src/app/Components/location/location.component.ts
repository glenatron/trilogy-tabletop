import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { ILocation, Location } from '../../../../../../trilogy-core/src/GM/Location';

@Component({
    selector: 'location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

    @Input() location: ILocation | null = null;

    @Input() gmView: boolean = false;

    @Output() created: EventEmitter<boolean> = new EventEmitter<boolean>()

    constructor(public gameService: TrilogyGameService) {
    }

    ngOnInit(): void {
        if (this.location == null) {
            const loc = new Location({
                id: '',
                name: '',
                description: '',
                GMNotes: '',
                showPlayers: false,
                childLocations: []
            });
            this.location = loc.toStore();
        }
    }

    public saveLocation() {
        const loc = new Location(this.location!);
        this.gameService.addLocation(loc);
        this.created.emit(true);
    }

    public cancel() {
        this.location = null;
        this.created.emit(false);
    }

}
