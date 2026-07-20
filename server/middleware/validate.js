const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors,
      });
    }

    if (source === "body") {
      req.body = result.data;
    } else if (source === "params") {
      req.params = result.data;
    } else if (source === "query") {
      req.validatedQuery = result.data;
    }

    next();
  };
};

module.exports = validate;