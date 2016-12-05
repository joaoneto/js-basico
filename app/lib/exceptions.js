class BaseException extends Error {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }
}

class BadRequest extends BaseException {
  constructor(msg = 'Bad Request', code = 'bad_request') {
    super(msg, code);
    this.status = 400;
  }
}
module.exports.BadRequest = BadRequest;

class Unauthorized extends BaseException {
  constructor(msg = 'Unauthorized', code = 'unauthorized') {
    super(msg, code);
    this.status = 401;
  }
}
module.exports.Unauthorized = Unauthorized;

class Forbidden extends BaseException {
  constructor(msg = 'Forbidden', code = 'forbidden') {
    super(msg, code);
    this.status = 403;
  }
}
module.exports.Forbidden = Forbidden;

class NotFound extends BaseException {
  constructor(msg = 'Not Found', code = 'not_found') {
    super(msg, code);
    this.status = 404;
  }
}
module.exports.NotFound = NotFound;

class TooManyRequests extends BaseException {
  constructor(msg = 'Too Many Requests', code = 'too_many_requests') {
    super(msg, code);
    this.status = 429;
  }
}
module.exports.TooManyRequests = TooManyRequests;

class InternalServiceError extends BaseException {
  constructor(msg = 'Internal Service Error', code = 'internal_service_error') {
    super(msg, code);
    this.status = 500;
  }
}
module.exports.InternalServiceError = InternalServiceError;
