export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}
