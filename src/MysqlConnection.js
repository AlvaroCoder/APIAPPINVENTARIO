const mysql2 = require('mysql2/promise');

const pool =  mysql2.createPool({uri : 'mysql://mqpeea6jxz7pzusmnyuw:pscale_pw_u3ElB7jsBhyFwbIsDKAry2InUCHCAfBH3BcZxUaZ7XF@aws.connect.psdb.cloud/appinventario?ssl={"rejectUnauthorized":true}'});
module.exports = pool;