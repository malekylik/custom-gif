export function calculateAnimationProgress(from: number, to: number, currentFrame: number): number {
    if (to <= from) {
        return 1;
    }

    return (currentFrame - from) / Math.max(to - from, 1);
}
