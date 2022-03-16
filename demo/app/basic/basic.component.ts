import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    selector: 'app-basic',
    templateUrl: 'basic.component.html'
})
export class AppBasicComponent {
    @ViewChild('draggableElement', { static: true })
    draggableElement?: ElementRef<HTMLElement>;

    offsetX = 0;

    offsetY = 0;

    constructor() {}

    triDragStart(e: MouseEvent) {
        console.log('drag start');
        if (this.draggableElement) {
            const targetRect = this.draggableElement.nativeElement.getBoundingClientRect();
            this.offsetX = targetRect.x - e.clientX;
            this.offsetY = targetRect.y - e.clientY;
        }
    }

    triDragOver(event: MouseEvent) {
        console.log('drag over');
    }

    triDragEnd(event: MouseEvent) {
        console.log('drag end');
        if (this.draggableElement) {
            let scrollTop = window.scrollY;
            this.draggableElement.nativeElement.style.left = `${event.clientX + this.offsetX}px`;
            this.draggableElement.nativeElement.style.top = `${event.clientY + this.offsetY + scrollTop}px`;
            this.draggableElement.nativeElement.style.transform = `none`;
        }
    }
}