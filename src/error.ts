export class APIError extends Error {
  status: number;
  message: string;
  data: object | undefined;
  constructor({
    message = 'Something went wrong',
    status = 500,
    data = undefined,
  }: {
    message?: string;
    status?: number;
    data?: object;
  }) {
    super(message);
    this.message = message;
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}
