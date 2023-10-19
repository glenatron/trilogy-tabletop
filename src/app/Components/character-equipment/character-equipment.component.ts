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

    @Output() removeEquipment = new EventEmitter<IEquipment>();

    public localEquipment = new Array<Equipment>();

    public addFormOpen: boolean = false;

    public editEquipment: IEquipment = this.resetEditEquipment();

    public ComponentEquipmentQuality = EquipmentQuality;

    constructor() {

    }

    ngOnInit(): void {
        if (this.equipment != null) {
            this.localEquipment = this.equipment;
        }
    }

    public editItem(item: IEquipment): void {
        this.editEquipment = item;
        this.addFormOpen = true;
    }

    public removeItem(item: IEquipment): void {
        this.removeEquipment.emit(item);
        this.localEquipment = this.localEquipment.filter(x => x != item);
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
            let idx = this.localEquipment.findIndex(x => x.id == this.editEquipment.id)
            if (0 <= idx) {

                this.localEquipment[idx] = Equipment.fromStore(this.editEquipment);

            } else {
                this.editEquipment.originalQuality = this.editEquipment.currentQuality;
                this.localEquipment.push(Equipment.fromStore(this.editEquipment));
            }
            this.updateEquipment.emit(this.editEquipment);
        }
        this.editEquipment = this.resetEditEquipment();
        this.hideAddForm();
    }


    private resetEditEquipment(): IEquipment {
        return {
            id: crypto.randomUUID(),
            name: "",
            originalQuality: EquipmentQuality.Basic,
            currentQuality: EquipmentQuality.Basic,
            notes: ""
        };
    }

}
