const controller = {};

controller.getUser = (req, res) => {
    res.send("controller getUser called");
}

controller.createUser = (req, res) => {
    res.send("controller createUser called");
}

controller.editUser = (req, res) => {
    res.send("controller editUser called");
}

controller.deleteUser = (req, res) => {
    res.send("controller deleteUser called");
}

controller.getProfile = (req, res) => {
    res.send("controller getProfile called");
}


module.exports = controller;