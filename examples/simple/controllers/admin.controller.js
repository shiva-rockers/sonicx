const controller = {};

controller.getAdmin = (req, res) => {
    res.send("controller getUser called");
}

controller.createAdmin = (req, res) => {
    res.send("controller createUser called");
}

controller.editAdmin = (req, res) => {
    res.send("controller editUser called");
}

controller.deleteAdmin = (req, res) => {
    res.send("controller deleteUser called");
}

controller.getProfile = (req, res) => {
    res.send("controller getProfile called");
}

module.exports = controller;