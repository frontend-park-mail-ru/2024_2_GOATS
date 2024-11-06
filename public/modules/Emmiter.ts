export class Emitter<T> {
  private listeners: ((value: T) => void)[] = [];
  private value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  set(value: T): void {
    this.value = value;
    this.notifyListeners();
  }

  get(): T {
    return this.value;
  }

  addListener(listener: (value: T) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.value));
  }
}
