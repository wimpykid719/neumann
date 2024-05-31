class AppError extends Error {
  static {
    this.prototype.name = 'AppError'
  }
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class FetchError extends AppError {
  status: number

  static {
    this.prototype.name = 'FetchError'
  }

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options)
    this.status = status
  }
}
