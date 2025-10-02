export type Component = { element: HTMLElement; dispose: () => void; };
type __Component = Component & { __component: true };

export function toComponent(element: HTMLElement, dispose: () => void): Component {
    return ({
        __component: true,
        element,
        dispose
    }) as __Component;
}

export function isComponent(c: unknown): c is Component {
    return c !== null && typeof c === 'object' && (c as __Component).__component;
}

