const { route } = require('sonicx');

const authController = require('./controllers/auth.controller');
const profileController = require('./controllers/profile.controller');

route('/admin/auth', [
    { path: '/register', method: 'post', controller: authController.register },
    { path: '/login', method: 'post', controller: authController.login },
]);

route('/admin/profile', [
    { method: 'get', middleware: isUser, controller: profileController.getAdmin },
    { method: 'post', middleware: isUser, controller: profileController.createAdmin },
]);

/**
 * 
 * 
 * OR
 * 
 */

/** ROUTES INSIDE SINGLE ARRAY */

route('/admin', [
    { path: '/auth/register', method: 'post', controller: authController.register },
    { path: '/auth/login', method: 'post', controller: authController.login },
    { path: '/profile', method: 'get', middleware: isUser, controller: profileController.getAdmin },
    { path: '/profile', method: 'post', middleware: isUser, controller: profileController.createAdmin },
]);