import { GraphQLError, GraphQLErrorOptions } from "graphql";

export class CustomError extends GraphQLError {
  public message: string;
  public options?: GraphQLErrorOptions;
  public i18n?: string;

  constructor(
    message: string,
    options?: GraphQLErrorOptions,
    i18n?: string,
  ) {
    super(message, options);
    this.message = message;
    this.options = options;
    this.i18n = i18n;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidProperties extends CustomError {
  constructor(message: string, details?: unknown) {
    super(message, {
      extensions: {
        code: "INVALID_PROPERTIES",
        details,
      }
    });
  }
}

export class NotFound extends CustomError {
  constructor(message: string, details?: unknown) {
    super(message, {
      extensions: {
        code: "NOT_FOUND_ERROR",
        details
      }
    });
  }
}

export class FailedSQL extends CustomError {
  constructor(message: string, details?: unknown, i18n?: string) {
    super(message, {
      extensions: {
        code: "FAILED_SQL",
        details
      }
    }, i18n);
  }
}

export class AlreadyExists extends CustomError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "ALREADY_EXISTS",
      }
    });
  }
}

export class OutOfCuttingTime extends CustomError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "OUT_OF_CUTTING_TIME",
      }
    });
  }
}

export class BadRequest extends CustomError {
  constructor(message: string, details?: unknown) {
    super(message, {
      extensions: {
        code: "BAD_REQUEST",
        details
      }
    });
  }
}

export class InternalServer extends CustomError {
  constructor(message: string, details?: unknown) {
    super(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        details
      }
    });
  }
}