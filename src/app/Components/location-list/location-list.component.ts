import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { TrilogyGameService } from '../../Services/trilogy-game.service';
import { Location, ILocation } from '../../../../../../trilogy-core/src/GM/Location';
@Component({
    selector: 'location-list',
    templateUrl: './location-list.component.html',
    styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

    @Input() gmView: boolean = false;

    @Output() showLocation: EventEmitter<Location> = new EventEmitter<Location>();

    @Output() newLocation: EventEmitter<Location> = new EventEmitter<Location>();

    public liveLocations = new Subject<Array<Location>>();

    public currentLocation = "";

    private liveLocs = new Array<Location>();

    constructor(public gameService: TrilogyGameService) {
        this.gameService.locations.subscribe(x => {
            this.liveLocs = x;
            this.liveLocations.next(x);
        });
    }

    ngOnInit(): void {

    }

    public locationDetail(locName: string): void {
        if (locName == this.currentLocation) {
            this.currentLocation = "";
        } else {
            this.currentLocation = locName;
        }
    }

    public getChildLocations(location: Location): Array<Location> {
        return this.liveLocs.reduce((list, loc) => {
            if (0 <= location.childLocations.indexOf(loc.id)) {
                list.push(loc);
            }
            return list;
        }, new Array<Location>());
    }

    public addToScene(location: Location): void {
        //todo
    }

    public openLocation(location: Location): void {
        this.showLocation.emit(location);
    }

    public createLocation(): void {
        let l = new Location({
            id: '',
            name: '',
            description: '',
            childLocations: [],
            showPlayers: false,
            GMNotes: ''
        });
        this.newLocation.emit(l);
    }



}
