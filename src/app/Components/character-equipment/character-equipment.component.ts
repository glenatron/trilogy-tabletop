import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEquipment, EquipmentQuality } from '../../../../../../trilogy-core/src/Character/IEquipment';
import { Equipment } from '../../../../../../trilogy-core/src/Character/Equipment';

@Component({
    selector: 'character-equipment',
    templateUrl: './character-equipment.component.html',
    styleUrls: ['./character-equipment.component.scss']
})
export class CharacterEquipmentComponent implements OnInit {

    @Input() equipment: Array<Equipment> | null = null;

    @Output() updateEquipment = new EventEmitter<IEquipment>();

    public localEquipment = new Array<Equipment>();

    public addFormOpen: boolean = false;

    public editEquipment: IEquipment = this.resetEditEquipment();

    constructor() {

    }

    ngOnInit(): void {
        if (this.equipment != null) {
            this.localEquipment = this.equipment;
        }
    }

    public clearAddForm() {
        this.editEquipment = this.resetEditEquipment();
    }

    public showAddForm() {
        this.addFormOpen = true;
    }

    public hideAddForm() {
        this.addFormOpen = false;
    }

    public saveAddForm() {
        if (this.editEquipment.name.trim() != '') {
            this.updateEquipment.emit(this.editEquipment);
            this.localEquipment.push(Equipment.fromStore(this.editEquipment));
            this.editEquipment = this.resetEditEquipment();
        }
    }

    private resetEditEquipment(): IEquipment {
        return {
            name: "",
            originalQuality: EquipmentQuality.Basic,
            currentQuality: EquipmentQuality.Basic,
            notes: ""
        };
    }

}
