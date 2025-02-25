declare namespace jest {
  interface Mock<T = unknown, Y extends unknown[] = unknown[]> {
    (...args: Y): T;
    mockClear(): void;
    mockReset(): void;
    mockRestore(): void;
    mockImplementation(fn: (...args: Y) => T): this;
    mockImplementationOnce(fn: (...args: Y) => T): this;
    mockReturnValue(value: T): this;
    mockReturnValueOnce(value: T): this;
  }
}
