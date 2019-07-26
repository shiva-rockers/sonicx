middlewares.isUser = (req, res, next) => {
    // SOME AUTH MECHANISM
    next();
}
middlewares.isAdmin = (req, res, next) => {
    // SOME AUTH MECHANISM
    next();
}
module.exports = middlewares;