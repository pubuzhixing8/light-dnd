import { Component, ElementRef, Input, OnInit } from "@angular/core";

@Component({
    selector: 'div[tri-snapshot]',
    template: '',
    host: {
        class: 'triton-snapshot-container'
    }
})
export class TriSnapshotComponent implements OnInit {
    @Input()
    target?: HTMLElement;

    @Input()
    isClone = false;

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit() {
        console.log('create snapshot');
        if (this.target) {
            if (this.isClone) {
                const snapshotTarget = this.target.cloneNode(true) as HTMLElement;
                this.elementRef.nativeElement.appendChild(snapshotTarget);
            } else {
                this.elementRef.nativeElement.appendChild(this.target);
            }
        }
    }
}