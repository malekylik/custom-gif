export function onInputNumber(action: (n: number) => void, error: (s: string) => void) {
  return (event: Event) => {
      const valueS = (event.target as any).value;
      if (!isNaN(Number(valueS))) {
        const value = Number(valueS);
        action(value)
      } else {
        error(valueS)
      }
  }
}
