var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_goelzerm',
  password        : '0957',
  database        : 'cs340_goelzerm'
});

module.exports.pool = pool;
