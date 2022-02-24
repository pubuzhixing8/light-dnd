import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { ScrollingDirection } from './constants';

export function getAutoScrollContainers(scrollDispatcher: ScrollDispatcher, draggableNativeElement: HTMLElement) {
    let scrollContainers: HTMLElement[] = [];
    scrollDispatcher.scrollContainers.forEach((value, key) => {
        if (key.getElementRef().nativeElement.contains(draggableNativeElement)) {
            scrollContainers.push(key.getElementRef().nativeElement);
        }
    });
    return scrollContainers;
}

export function getAutoScrollDirection(event: MouseEvent, container: HTMLElement | Window, auditOffset: number = 30) {
    let top = 0;
    let bottom = 0;
    if (container instanceof Window) {
        bottom = window.innerHeight;
    } else {
        const rect = container.getBoundingClientRect();
        top = rect.top;
        bottom = rect.bottom;
    }
    if (event.y - auditOffset < top) {
        return ScrollingDirection.top;
    }
    if (event.y + auditOffset > bottom) {
        return ScrollingDirection.bottom;
    }
    return null;
}

export function handleContainerScroll(container: HTMLElement, direction: ScrollingDirection, distance: number = 10) {
    let defultScrollTop = container.scrollTop;
    let scrollTop = 0;
    const scrollHeight = container.scrollHeight;
    const height = container.clientHeight;

    if (direction === ScrollingDirection.top) {
        scrollTop = defultScrollTop - distance;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
    }
    if (direction === ScrollingDirection.bottom) {
        scrollTop = defultScrollTop + distance;
        if (scrollTop + height > scrollHeight) {
            scrollTop = scrollHeight - height;
        }
    }
    container.scrollTop = scrollTop;
}

export function handleWindowScroll(window: Window,direction: ScrollingDirection, distance: number = 10) {
    let scrollTop = window.scrollY;
    let scrollHeight = window.document.body.scrollHeight;
    const height = window.innerHeight;

    if (direction === ScrollingDirection.top) {
        scrollTop = scrollTop - 10;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
    }
    if (direction === ScrollingDirection.bottom) {
        scrollTop = scrollTop + 10;
        if (scrollTop + height > scrollHeight) {
            scrollTop = scrollHeight - height;
        }
    }
    window.scrollTo({ top: scrollTop });
}