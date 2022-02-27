import { ScrollDispatcher } from "@angular/cdk/scrolling";
import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, NgZone, OnDestroy, Output } from "@angular/core";
import { fromEvent, interval } from "rxjs";
import { take } from 'rxjs/operators';
import { ScrollingDirection } from "./constants";
import { getAutoScrollDirection, getAutoScrollContainers, handleContainerScroll, handleWindowScroll } from "./scroll";

@Directive({
    selector: '[triDraggable]',
    host: {
        class: 'triton-draggable-origin'
    }
})
export class TriDraggableDirective implements AfterViewInit {
    @HostListener('mousedown', ['$event'])
    mousedownHandle(event: MouseEvent) {
        let dragging = false;
        const defaultCursor = document.body.style.cursor;
        const autoScrollContainers = getAutoScrollContainers(this.scrollDispatcher, this.elementRef.nativeElement);
        let currentAutoScrollContainer: HTMLElement | null = null;
        let autoScrollDirection: ScrollingDirection | null = null;
        this.ngZone.runOutsideAngular(() => {
            const interval$ = interval(20).subscribe(() => {
                if (autoScrollDirection && currentAutoScrollContainer) {
                    handleContainerScroll(currentAutoScrollContainer, autoScrollDirection);
                    return;
                }
                if (autoScrollDirection) {
                    handleWindowScroll(window, autoScrollDirection);
                }
            });
            const mousemove$ = fromEvent<MouseEvent>(document, `mousemove`).subscribe(e => {
                if (!dragging) {
                    this.triDragStart.emit(event);
                    dragging = true;
                    document.body.style.cursor = 'grabbing';
                    document.body.classList.add('dragging');
                }
                this.triDragOver.emit(e);
                currentAutoScrollContainer = null;
                autoScrollContainers.forEach((container) => {
                    autoScrollDirection = getAutoScrollDirection(e, container);
                    if (autoScrollDirection) {
                        currentAutoScrollContainer = container;
                    }
                });
                if (!currentAutoScrollContainer) {
                    autoScrollDirection = getAutoScrollDirection(e, window);
                }
            });
            const mouseup$ = fromEvent<MouseEvent>(document, `mouseup`).pipe(take(1)).subscribe(e => {
                mousemove$.unsubscribe();
                interval$.unsubscribe();
                // keydown$.unsubscribe();
                if (dragging) {
                    this.triDrop.emit(e);
                    this.triDragEnd.emit(e);
                    document.body.style.cursor = defaultCursor;
                    document.body.classList.remove('dragging');
                }
            });
            // const keydown$ = fromEvent<KeyboardEvent>(this.elementRef.nativeElement, `keydown`).subscribe(e => {
            //     if (e.key === 'Escape' && dragging) {
            //         mouseup$.unsubscribe();
            //         mousemove$.unsubscribe();
            //         interval$.unsubscribe();
            //         document.body.style.cursor = defaultCursor;
            //         document.body.classList.remove('dragging');
            //         this.triDragEnd.emit();
            //     }
            // });
        });
    }

    @Output() triDragStart: EventEmitter<MouseEvent> = new EventEmitter();

    @Output() triDragOver: EventEmitter<MouseEvent> = new EventEmitter();

    @Output() triDragEnd: EventEmitter<MouseEvent> = new EventEmitter();

    @Output() triDrop: EventEmitter<MouseEvent> = new EventEmitter();

    constructor(private ngZone: NgZone, private elementRef: ElementRef<HTMLElement>, private scrollDispatcher: ScrollDispatcher) { }

    ngAfterViewInit(): void {
    }
}
