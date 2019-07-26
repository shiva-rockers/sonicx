const sonicx = require('sonicx');

const userController = require('./controllers/user.controller');
const adminController = require('./controllers/admin.controller');
const authMiddlewares = require('./middlewares/auth.middleware');

// OMMITING PATH PARAMETERS ; 
sonicx.route('/user', [
    { method: 'get', middleware: authMiddlewares.isUser, controller: userController.getUser },
    { method: 'post', middleware: authMiddlewares.isUser, controller: userController.createUser },
    { method: 'put', middleware: authMiddlewares.isUser, controller: userController.editUser },
    { method: 'delete', middleware: authMiddlewares.isUser, controller: userController.deleteUser },
]);

// USING PATH PARAMETERS ; 
sonicx.route('/', [
    { path: 'admin', method: 'get', middleware: authMiddlewares.isAdmin, controller: adminController.getAdmin },
    { path: 'admin', method: 'post', middleware: authMiddlewares.isAdmin, controller: adminController.createAdmin },
    { path: 'admin', method: 'put', middleware: authMiddlewares.isAdmin, controller: adminController.editAdmin },
    { path: 'admin', method: 'delete', middleware: authMiddlewares.isAdmin, controller: adminController.deleteAdmin },
]);

// USING PATH PARAMETERS ; 
sonicx.route('/profile', [
    { path: '/userProfile', method: 'get', middleware: authMiddlewares.isUser, controller: userController.getProfile },
    { path: '/adminProfile', method: 'get', middleware: authMiddlewares.isAdmin, controller: adminController.getProfile },
]);

sonicx.listen(4000, () => console.log("Magic on port 4000"));