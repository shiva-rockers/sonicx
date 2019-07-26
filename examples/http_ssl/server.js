const sonicx = require('sonicx');
const fs = require('fs');

const options = {
    key: fs.readFileSync('cert/key.pem', 'utf8'),
    cert: fs.readFileSync('cert/server.crt', 'utf8')
};

sonicx.configuration = {
    // global configuration
    //...
};
sonicx.route('/', [ 
    // all the routes
    //...
]);

// listening securly on https;
sonicx.secureListen(4000, options, () => console.log("Listening securly on 4000"));