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

export function readFile(file: File): Promise<ArrayBuffer> {
  const reader = new FileReader();

  return new Promise((r) => {
    reader.onload = function (e: ProgressEvent<FileReader>): void {
        const arrayBuffer = e.target.result as ArrayBuffer;
        r(arrayBuffer);
    }

    reader.readAsArrayBuffer(file);
  });
}

export function reScale(target: number, targetOriginalAnotherDimension: number, targetRescaledAnotherDimension: number): number {
    return target * (targetRescaledAnotherDimension / targetOriginalAnotherDimension);
}
