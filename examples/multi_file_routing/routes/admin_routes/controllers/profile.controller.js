const controller = {};

controller.getAdmin = (req, res) => {
    res.send("controller getAdmin called");
}

controller.createAdmin = (req, res) => {
    res.send("controller createAdmin called");
}

module.exports = controller;