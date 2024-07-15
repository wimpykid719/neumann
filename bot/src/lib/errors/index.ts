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

export class PuppeteerError extends AppError {
  url: string

  static {
    this.prototype.name = 'PuppeteerError'
  }

  constructor(message: string, url: string, options?: ErrorOptions) {
    super(message, options)
    this.url = url
  }
}

export class NotBookError extends AppError {
  url: string

  static {
    this.prototype.name = 'NotBookError'
  }

  constructor(message: string, url: string, options?: ErrorOptions) {
    super(message, options)
    this.url = url
  }
}

export class ScrapingRequestError extends AppError {
  url: string

  static {
    this.prototype.name = 'ScrapingRequestError'
  }

  constructor(message: string, url: string, options?: ErrorOptions) {
    super(message, options)
    this.url = url
  }
}
