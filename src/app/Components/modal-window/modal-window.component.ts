import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent implements OnInit {

    @Input() title: string = "Modal";

    @Input() public open = false;

    public left = 100;

    public top = 100;

    public right = 200;

    public bottom = 200;

    public width = 100;

    public height = 100;

    public maximised = true;

    public minimised = false;

    private dragSection = DragSection.None;

    private minWidth = 50;

    private minHeight = 50;

    private lastX = 0;

    private lastY = 0;

    private stashedX = 0;

    private stashedY = 0;

    private lastMaxSize: boxSize = { top: 10, left: 10, width: 100, height: 100 };

    constructor() {
        this.left = Math.floor(window.innerWidth / 4);
        this.top = Math.floor(window.innerHeight / 4);
        this.right = Math.floor(window.innerWidth / 2);
        this.bottom = Math.floor(window.innerHeight / 2);
        this.calculateSize();
    }

    ngOnInit(): void {
    }

    public toggleMinimise(): void {
        if (this.maximised) {
            this.removeDragListeners();
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
    }

    public closeModal(): void {
        this.open = false;
        this.removeDragListeners();
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

    public clearDragEvent(event: MouseEvent): void {
        this.lastX = 0;
        this.lastY = 0;
        this.dragSection = DragSection.None;
        this.removeDragListeners();
    }

    private removeDragListeners() {
        window.removeEventListener("mousemove", (ev) => this.dragEvent(ev));
        document.removeEventListener("mouseleave", (ev) => this.clearDragEvent(ev));
        window.removeEventListener("mouseup", (ev) => this.clearDragEvent(ev));
    }

    private startDragEvent() {
        window.addEventListener("mousemove", (ev) => this.dragEvent(ev));
        window.addEventListener("mouseup", (ev) => this.clearDragEvent(ev));
        document.addEventListener("mouseleave", ev => this.clearDragEvent(ev));
    }

    private dragEvent(event: MouseEvent): void {
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
                break;
        }
        this.lastX = event.x;
        this.lastY = event.y;

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

interface boxSize {
    top: number;
    left: number;
    width: number;
    height: number;

}
