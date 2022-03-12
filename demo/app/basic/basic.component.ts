import { Component } from "@angular/core";

@Component({
    selector: 'app-basic',
    templateUrl: 'basic.component.html',
    styleUrls: ['basic.component.scss']
})
export class AppBasicComponent {
    constructor() {}

    triDragStart(event: MouseEvent) {
        console.log('drag start');
    }

    triDragOver(event: MouseEvent) {
        console.log('drag over');
    }

    triDragEnd(event: MouseEvent) {
        console.log('drag end');
    }
}