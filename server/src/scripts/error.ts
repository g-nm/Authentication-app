export class AppError extends Error {
  constructor(message: string, stack?: string) {
    super(message);
    this.name = 'AppError';
    this.stack = stack;
  }
}
