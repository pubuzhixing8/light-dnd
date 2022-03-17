import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { auditRules, ScrollAuditRule } from './audit-rule';
import { ScrollingDirection } from './constants';

export interface AutoScrollConfig {
    direction: ScrollingDirection,
    auditRule: ScrollAuditRule
}

export function getAutoScrollContainers(scrollDispatcher: ScrollDispatcher, draggableNativeElement: HTMLElement) {
    let scrollContainers: HTMLElement[] = [];
    scrollDispatcher.scrollContainers.forEach((value, key) => {
        if (key.getElementRef().nativeElement.contains(draggableNativeElement)) {
            scrollContainers.push(key.getElementRef().nativeElement);
        }
    });
    return scrollContainers;
}



export function getAutoScrollConfig(event: MouseEvent, container: HTMLElement | Window): AutoScrollConfig | null {
    let top = 0;
    let bottom = 0;
    if (container instanceof Window) {
        bottom = window.innerHeight;
    } else {
        const rect = container.getBoundingClientRect();
        top = rect.top;
        bottom = rect.bottom;
    }
    const topAuditRule = auditRules.find((rule) => {
        return event.y - rule.audit < top;
    });
    if (topAuditRule) {
        return {
            direction: ScrollingDirection.top,
            auditRule: topAuditRule
        }
    }
    const bottomAuditRule = auditRules.find((rule) => {
        return event.y + rule.audit > bottom;
    });
    if (bottomAuditRule) {
        return {
            direction: ScrollingDirection.bottom,
            auditRule: bottomAuditRule
        };
    }
    return null;
}

export function handleContainerScroll(container: HTMLElement, scrollConfig: AutoScrollConfig) {
    let defultScrollTop = container.scrollTop;
    let scrollTop = 0;
    const scrollHeight = container.scrollHeight;
    const height = container.clientHeight;

    if (scrollConfig.direction === ScrollingDirection.top) {
        scrollTop = defultScrollTop - scrollConfig.auditRule.seed;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
    }
    if (scrollConfig.direction === ScrollingDirection.bottom) {
        scrollTop = defultScrollTop + scrollConfig.auditRule.seed;
        if (scrollTop + height > scrollHeight) {
            scrollTop = scrollHeight - height;
        }
    }
    container.scrollTop = scrollTop;
}

export function handleWindowScroll(window: Window, scrollConfig: AutoScrollConfig) {
    let scrollTop = window.scrollY;
    let scrollHeight = window.document.body.scrollHeight;
    const height = window.innerHeight;

    if (scrollConfig.direction === ScrollingDirection.top) {
        scrollTop = scrollTop - scrollConfig.auditRule.seed;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
    }
    if (scrollConfig.direction === ScrollingDirection.bottom) {
        scrollTop = scrollTop + scrollConfig.auditRule.seed;
        if (scrollTop + height > scrollHeight) {
            scrollTop = scrollHeight - height;
        }
    }
    window.scrollTo({ top: scrollTop });
}