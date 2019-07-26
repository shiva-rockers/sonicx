const sonicx = require('sonicx');
const path = require('path');

// HOST static website on server from public directory.

sonicx.configuration = {
    staticPath: path.join(__dirname, 'public'),
};

// YOUR ROUTES APIS

sonicx.listen(4000, () => console.log("Magic on port 4000"));