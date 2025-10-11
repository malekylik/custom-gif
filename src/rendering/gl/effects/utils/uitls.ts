export function calculateAnimationProgress(from: number, to: number, currentFrame: number): number {
    return (currentFrame - from) / Math.max(to - from, 1);
}
