import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Armour } from '../../../../../../trilogy-core/src/Character/Armour';
import { IStoredCounter } from '../../../../../../trilogy-core/src/Character/Counter';
import { EquipmentQuality } from '../../../../../../trilogy-core/src/Character/IEquipment';

@Component({
    selector: 'armour',
    templateUrl: './armour.component.html',
    styleUrls: ['./armour.component.scss']
})
export class ArmourComponent implements OnInit {

    @Input() armourSet: Armour | null = null;

    @Output() armourSave = new EventEmitter<Armour>();

    public armourUnset: boolean = false;

    public editing: boolean = false;

    constructor() { }

    ngOnInit(): void {
        if (!this.armourSet) {
            this.armourUnset = true;
            this.armourSet = new Armour('', EquipmentQuality.Basic, EquipmentQuality.Basic, '');
        }
    }

    public armourUsed(newArmour: IStoredCounter) {
        if (newArmour.value == (this.armourSet!.uses.getValue() - 1)) {
            this.armourSet!.useArmour();
        }
    }

    public updateArmourValue(newValue: number) {
        while (newValue < this.armourSet!.uses.getValue()) {
            this.armourSet!.useArmour();
        }
        if (this.armourSet!.uses.size == newValue) {
            this.armourSet!.repairArmour();
        }
    }

    public isBroken(): boolean {
        return (this.armourSet!.currentQuality == EquipmentQuality.Broken);
    }

    public needsRepair(): boolean {
        return (this.armourSet!.currentQuality < this.armourSet!.originalQuality);
    }

    repair(): void {
        this.armourSet!.repair();
    }

    reduceQuality(): void {
        this.armourSet!.reduceQuality();
    }

    showEdit(): void {
        this.editing = true;
    }

    cancelEdit(): void {
        this.editing = false;
        if (this.armourUnset) {
            this.armourSet = new Armour('', EquipmentQuality.Basic, EquipmentQuality.Basic, '');
        }
    }

    saveEdit(): void {
        this.armourSave.emit(this.armourSet!);
        this.armourUnset = false;
        this.editing = false;
    }

}
