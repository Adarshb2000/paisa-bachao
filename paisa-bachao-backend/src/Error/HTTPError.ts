export class HTTPError extends Error {
  constructor(public message: string, public code = 500) {
    super(message)
    this.code = code
  }
}
