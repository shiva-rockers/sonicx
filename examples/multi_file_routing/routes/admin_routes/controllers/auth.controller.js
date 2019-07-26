const controller = {};

controller.register = (req, res) => {
    res.send("controller register called");
}

controller.login = (req, res) => {
    res.send("controller login called");
}

module.exports = controller;