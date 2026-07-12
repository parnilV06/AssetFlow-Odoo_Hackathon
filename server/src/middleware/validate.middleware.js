exports.validateMiddleware = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        const issues = err.issues || err.errors || [];
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: issues.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }
};