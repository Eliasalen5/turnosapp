export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const error = new Error(
        result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(' | ')
      );
      error.statusCode = 400;
      return next(error);
    }
    Object.defineProperty(req, source, {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    return next();
  };
}
