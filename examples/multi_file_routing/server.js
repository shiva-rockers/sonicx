const sonicx = require('sonicx');

require('./routes/user_routes');
require('./routes/admin_routes');

sonicx.listen(4000, () => console.log("Magic on port 4000"));