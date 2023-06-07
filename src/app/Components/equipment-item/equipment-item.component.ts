import { Component, OnInit, Input } from '@angular/core';
import { IEquipment, EquipmentQuality } from '../../../../../../trilogy-core/src/Character/IEquipment';
import { Equipment } from '../../../../../../trilogy-core/src/Character/Equipment';

@Component({
    selector: 'equipment-item',
    templateUrl: './equipment-item.component.html',
    styleUrls: ['./equipment-item.component.scss']
})
export class EquipmentItemComponent implements OnInit {

    @Input() item: Equipment | null = null;

    constructor() { }

    ngOnInit(): void {
        if (this.item == null) {
            throw "No item set";
        }
    }

    repair(): void {
        this.item!.repair();
    }

    reduceQuality(): void {
        this.item!.reduceQuality();
    }

    public isBroken(): boolean {
        return (this.item!.currentQuality == EquipmentQuality.Broken);
    }
}
