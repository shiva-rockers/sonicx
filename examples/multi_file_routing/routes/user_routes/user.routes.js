const { route } = require('sonicx');

const authController = require('./controllers/auth.controller');
const profileController = require('./controllers/profile.controller');

/** ROUTES DEVIDED INTO MANY */

route('/user/auth', [
    { path: '/register', method: 'post', controller: authController.register },
    { path: '/login', method: 'post', controller: authController.login },
]);

route('/user/profile', [
    { method: 'get', middleware: isUser, controller: profileController.getUser },
    { method: 'post', middleware: isUser, controller: profileController.editUser },
]);

/**
 * 
 * 
 * OR
 * 
 */

/** ROUTES INSIDE SINGLE ARRAY */

route('/user', [
    { path: '/auth/register', method: 'post', controller: authController.register },
    { path: '/auth/login', method: 'post', controller: authController.login },
    { path: '/profile', method: 'get', middleware: isUser, controller: profileController.getUser },
    { path: '/profile', method: 'post', middleware: isUser, controller: profileController.editUser },
]);