import { GlobalPositionStrategy, Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ScrollDispatcher } from "@angular/cdk/scrolling";
import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, NgZone, Output } from "@angular/core";
import { AutoScrollConfig } from "./scroll";
import { fromEvent, interval } from "rxjs";
import { take } from 'rxjs/operators';
import { getAutoScrollConfig, getAutoScrollContainers, handleContainerScroll, handleWindowScroll } from "./scroll";
import { TriSnapshotComponent } from "./snapshot.component";

const TRIGGER_DRAG_THRESHOLD = 5;

@Directive({
    selector: '[triDraggable]',
    host: {
        class: 'triton-draggable-origin',
        tabindex: '-1'
    }
})
export class TriDraggableDirective implements AfterViewInit {
    public target?: HTMLElement;

    @Input() triGetTargetFn = (origin: HTMLElement) => {
        return origin;
    }

    @Input() triHasSnapshot = false;

    @Input() triIsCloneSnapshot = true;

    @HostListener('mousedown', ['$event'])
    mousedownHandle(_event: MouseEvent) {
        let dragging = false;
        const defaultCursor = document.body.style.cursor;
        const autoScrollContainers = getAutoScrollContainers(this.scrollDispatcher, this.elementRef.nativeElement);
        let currentAutoScrollContainer: HTMLElement | null = null;
        let autoScrollConfig: AutoScrollConfig | null = null;
        let snapshotOverlayRef: OverlayRef | null = null;
        let offsetX: number = 0;
        let offsetY: number = 0;
        const start = [_event.clientX, _event.clientY];
        this.ngZone.runOutsideAngular(() => {
            const interval$ = interval(20).subscribe(() => {
                if (autoScrollConfig && currentAutoScrollContainer) {
                    handleContainerScroll(currentAutoScrollContainer, autoScrollConfig);
                    return;
                }
                if (autoScrollConfig) {
                    handleWindowScroll(window, autoScrollConfig);
                }
            });
            const mousemove$ = fromEvent<MouseEvent>(document, `mousemove`).subscribe(e => {
                if (!dragging) {
                    const end = [e.clientX, e.clientY];
                    const maxOffset = Math.max(Math.abs(end[0] - start[0]), Math.abs(end[1] - start[1]));
                    if (maxOffset < TRIGGER_DRAG_THRESHOLD) {
                        return;
                    }
                }
                if (!dragging) {
                    this.triDragStart.emit(e);
                    dragging = true;
                    document.body.style.cursor = 'grabbing';
                    document.body.classList.add('dragging');
                    if (this.triGetTargetFn) {
                        this.target = this.triGetTargetFn(this.elementRef.nativeElement);
                        const targetRect = this.target.getBoundingClientRect();
                        offsetX = targetRect.x - e.clientX;
                        offsetY = targetRect.y - e.clientY;
                    }
                    
                    if (this.triHasSnapshot && this.target) {
                        // 弹出 overlay
                        snapshotOverlayRef = this.createSnapshot(this.target);
                    }

                    if (this.target) {
                        this.target.classList.add(...['drag-and-drop-target', 'drag-and-drop-target-active']);
                    }
                }
                if (snapshotOverlayRef) {
                    this.updatePosition(snapshotOverlayRef, e.clientX + offsetX, e.clientY + offsetY);
                }
                this.triDragOver.emit(e);
                currentAutoScrollContainer = null;
                autoScrollContainers.forEach((container) => {
                    autoScrollConfig = getAutoScrollConfig(e, container);
                    if (autoScrollConfig) {
                        currentAutoScrollContainer = container;
                    }
                });
                if (!currentAutoScrollContainer) {
                    autoScrollConfig = getAutoScrollConfig(e, window);
                }
            });

            // 结束拖拽
            const endDrag = (e: MouseEvent | KeyboardEvent) => {
                mousemove$.unsubscribe();
                interval$.unsubscribe();
                if (dragging) {
                    this.triDragEnd.emit(e);
                    document.body.style.cursor = defaultCursor;
                    document.body.classList.remove('dragging');
                    if (this.target) {
                        this.target.classList.remove(...['drag-and-drop-target', 'drag-and-drop-target-active']);
                    }
                    if (snapshotOverlayRef) {
                        snapshotOverlayRef.detach();
                        snapshotOverlayRef.dispose();
                        snapshotOverlayRef = null;
                    }
                }
            };

            const mouseup$ = fromEvent<MouseEvent>(document, `mouseup`).pipe(take(1)).subscribe(e => {
                if (dragging) {
                    this.triDrop.emit(e);
                }
                endDrag(e);
                keydown$.unsubscribe();
            });

            const keydown$ = fromEvent<KeyboardEvent>(this.elementRef.nativeElement, `keydown`).subscribe(e => {
                if (e.key === 'Escape' && dragging) {
                    mouseup$.unsubscribe();
                    endDrag(e);
                }
            });
        });
    }

    @Output() triDragStart: EventEmitter<MouseEvent> = new EventEmitter();

    @Output() triDragOver: EventEmitter<MouseEvent> = new EventEmitter();

    @Output() triDragEnd: EventEmitter<MouseEvent | KeyboardEvent> = new EventEmitter();

    @Output() triDrop: EventEmitter<MouseEvent> = new EventEmitter();

    constructor(private ngZone: NgZone,
        private elementRef: ElementRef<HTMLElement>,
        private scrollDispatcher: ScrollDispatcher,
        private overlay: Overlay) { }

    ngAfterViewInit(): void {
    }

    createSnapshot(target: HTMLElement) {
        const globalPositionStrategy = this.overlay.position().global();
        const overlayRef = this.overlay.create({
            positionStrategy: globalPositionStrategy, // 位置策略
            scrollStrategy: this.overlay.scrollStrategies.reposition(), // 滚动策略
            hasBackdrop: false // 是否显示遮罩层
        });
        const componentRef = overlayRef.attach(new ComponentPortal(TriSnapshotComponent));
        componentRef.instance.target = target;
        componentRef.instance.isClone = this.triIsCloneSnapshot;
        componentRef.changeDetectorRef.detectChanges();
        return overlayRef;
    }

    updatePosition(overlayRef: OverlayRef, x: number, y: number) {
        const globalPositionStrategy = overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
        globalPositionStrategy.left(`${x}px`).top(`${y}px`);
        overlayRef.updatePosition();
    }
}
