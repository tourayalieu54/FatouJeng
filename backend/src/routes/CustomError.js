export default class CustomError extends Error {
  statusCode;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Restore prototype chain (important for typescript + extending built-ins)
    Object.setPrototypeOf(this, new.target.prototype);

    // making the error message minimal to the right significant part of the code that causes the error(excluding the constructor call)
    Error.captureStackTrace(this, this.constructor);
  }
}