export class Timer {
  private onceTimerId: number;

  constructor () {
    this.onceTimerId = -1;
  }

  once(callback: () => void, time?: number): void {
    this.onceTimerId = setTimeout(callback, time) as unknown as number;
  }

  clear(): boolean {
    if (this.isOnceTimerSetted()) {
      clearTimeout(this.onceTimerId);

      this.onceTimerId = -1;

      return true;
    }

    return false;
  }

  isOnceTimerSetted(): boolean {
    return this.onceTimerId !== -1;
  }
}
