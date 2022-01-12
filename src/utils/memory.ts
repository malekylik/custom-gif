export function align(size: number, alignment: number): number {
  return (size + alignment - 1) & ~(alignment - 1);
}
