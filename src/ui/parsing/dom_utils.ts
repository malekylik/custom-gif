import { Component } from '../components/utils';

export function attactComponent(element: HTMLElement, compnent: Component): () => void {
    element.appendChild(compnent.element);

    return () => removeComponent(element, compnent);
}

export function removeComponent(element: HTMLElement, compnent: Component): void {
    compnent.dispose();
    element.removeChild(compnent.element);
}
