import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent implements OnInit {

    @Input() title: string = "Modal";

    @Input() public set open(value: boolean) {
        if (value) {
            if (this.dimensions == null) {
                this.ensureNotOversized();
            }
        }
        this._open = value;
    }
    public get open(): boolean {
        return this._open;
    }

    @Input() public width = 100;

    @Input() public height = 100;

    @Input() public set dimensions(value: BoxSize | null) {
        if (value != null) {
            this.lastMaxSize = value;
            this.recoverSize();
        }
    }


    @Output() public closed = new EventEmitter<boolean>();

    public left = 100;

    public top = 100;

    public right = 200;

    public bottom = 200;

    public maximised = true;

    public minimised = false;

    private _open = false;

    private dragSection = DragSection.None;

    private minWidth = 50;

    private minHeight = 50;

    private lastX = 0;

    private lastY = 0;

    private stashedX = 0;

    private stashedY = 0;

    private dragging = false;

    private lastMaxSize: BoxSize = { top: 10, left: 10, width: 100, height: 100 };

    constructor() {
        this.left = Math.floor(window.innerWidth / 4);
        this.top = Math.floor(window.innerHeight / 4);
        this.right = Math.floor(window.innerWidth / 2);
        this.bottom = Math.floor(window.innerHeight / 2);
    }

    ngOnInit(): void {
    }

    public toggleMinimise(): void {
        if (this.maximised) {
            this.dragging = false;
            this.stashSize();
            this.width = 200;
        }
        if (this.minimised) {
            this.recoverSize();
        }
        this.maximised = !this.maximised;
        this.minimised = !this.minimised;
        this.switchLocation();
    }

    public openModal(): void {
        this.open = true;
        if (this.dimensions) {
            this.lastMaxSize = this.dimensions;
            this.recoverSize();
        }
    }

    public closeModal(): void {
        this.open = false;
        this.dragging = false;
        this.closed.emit(true);
    }

    public getSize(): BoxSize {
        return this.lastMaxSize;
    }

    public startTopDrag(event: MouseEvent) {
        this.dragSection = DragSection.Top;
        this.startDragEvent();
    }

    public startLeftDrag(event: MouseEvent): void {
        this.dragSection = DragSection.Left;
        this.startDragEvent();
    }

    public startRightDrag(event: MouseEvent): void {
        this.dragSection = DragSection.Right;
        this.startDragEvent();
    }

    public startBottomDrag(event: MouseEvent): void {
        this.dragSection = DragSection.Bottom;
        this.startDragEvent();
    }

    public startCornerDrag(event: MouseEvent): void {
        this.dragSection = DragSection.Corner;
        this.startDragEvent();
    }

    public startDragEvent() {
        this.dragging = true;
    }

    @HostListener("window:mouseleave", ["$event"])
    @HostListener("window:mouseup", ["$event"])
    public clearDragEvent(event: MouseEvent): void {
        console.log("Clear drag (if dragging - " + this.dragging + ") " + event.type);
        if (this.dragging) {
            this.lastX = 0;
            this.lastY = 0;
            this.dragSection = DragSection.None;
            this.dragging = false;
        }

    }

    @HostListener("window:mousemove", ["$event"])
    public dragEvent(event: MouseEvent): void {
        if (this.dragging) {
            console.log("Dragging mousemove...");
            switch (this.dragSection) {
                case DragSection.Left: this.left = event.x;
                    this.calculateSize();
                    if (this.width < (this.minWidth)) {
                        this.right = this.left + this.minWidth;
                    }
                    break;
                case DragSection.Right: this.right = event.x;
                    this.calculateSize();
                    if (this.width < this.minWidth) {
                        this.left = this.right - this.minWidth;
                    }
                    break;
                case DragSection.Bottom: this.bottom = event.y;
                    this.calculateSize();
                    if (this.height < this.minHeight) {
                        this.top = this.bottom - this.minHeight;
                        if (this.top < 0) {
                            this.bottom = this.minHeight;
                        }
                    }
                    break;
                case DragSection.Corner:
                    this.right = event.x;
                    this.bottom = event.y;
                    this.calculateSize();
                    if (this.width < (this.minWidth)) {
                        this.right = this.left + this.minWidth;
                    }
                    if (this.height < this.minHeight) {
                        this.top = this.bottom - this.minHeight;
                        if (this.top < 0) {
                            this.bottom = this.minHeight;
                        }
                    }
                    break;
                case DragSection.Top:
                    this.top = event.y;
                    if (0 < this.lastX) {
                        this.left = this.left + (event.x - this.lastX);
                    }
                    this.bottom = this.top + this.height;
                    this.right = this.left + this.width;
                    break;
                default:
                    console.log("Drag event raised when no drag in progress!");
                    this.dragging = false;
                    break;
            }
            this.lastX = event.x;
            this.lastY = event.y;
        }
    }

    public endDragEvent() {
        if (this.dragging) {
            this.dragging = false;
        }
    }

    private ensureNotOversized() {
        if (this.width != 100 || this.height != 100) {
            if (window.innerWidth < this.width) {
                this.width = window.innerWidth;
            }
            if (window.innerHeight < this.height) {
                this.height = window.innerHeight;
            }
            this.right = this.left + this.width;
            this.bottom = this.top + this.height;
            if (window.innerWidth < this.right) {
                let newLeft = window.innerWidth - this.width;
                if (0 < newLeft) {
                    newLeft = Math.floor(newLeft / 2);
                } else {
                    newLeft = 0;
                }
                this.left = newLeft;
            }
            if (window.innerHeight < this.bottom) {
                let newTop = window.innerHeight - this.width;
                if (0 < newTop) {
                    newTop = Math.floor(newTop / 2);
                } else {
                    newTop = 0;
                }
                this.top = newTop;
            }
            this.stashSize();

        } else {
            this.calculateSize();
        }

    }

    private calculateSize(): void {
        this.width = this.right - this.left;
        this.height = this.bottom - this.top;
        this.stashSize();

    }

    private stashSize(): void {
        this.lastMaxSize = {
            top: this.top,
            left: this.left,
            width: this.width,
            height: this.height
        };
    }

    private recoverSize(): void {
        this.top = this.lastMaxSize.top;
        this.left = this.lastMaxSize.left;
        this.width = this.lastMaxSize.width;
        this.height = this.lastMaxSize.height;
        this.bottom = this.height + this.top;
        this.right = this.left + this.width;
    }

    private switchLocation(): void {
        let found = document.getElementById('minimised-modal-bar');
        if (this.minimised) {
            let holdX = this.left;
            let holdY = this.top;

            if (found != null) {
                let foundNode = found as HTMLElement;
                var count = Number(foundNode.dataset['childCount'] || 0);
                this.top = foundNode.offsetTop;
                this.left = foundNode.offsetLeft + (count * (this.width + 2));
                foundNode.dataset['childCount'] = `${count + 1}`;
            }
            setTimeout(() => {
                this.stashedX = holdX;
                this.stashedY = holdY;
            }, 0);

        } else {
            if (found != null) {
                var count = Number(found.dataset['childCount'] || 0);
                found.dataset['childCount'] = `${count - 1}`;
            }
            this.left = this.stashedX;
            this.top = this.stashedY;
        }

    }

}

enum DragSection {
    Top, Bottom, Left, Right, Corner, None
}

export interface BoxSize {
    top: number;
    left: number;
    width: number;
    height: number;
}
