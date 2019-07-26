const controller = {};

controller.getUser = (req, res) => {
    res.send("controller getUser called");
}

controller.editUser = (req, res) => {
    res.send("controller editUser called");
}

module.exports = controller;