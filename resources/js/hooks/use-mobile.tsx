import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

const mobileQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onChange: () => void): () => void {
    const mql = window.matchMedia(mobileQuery);

    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile() {
    return useSyncExternalStore(subscribe, getSnapshot);
}
