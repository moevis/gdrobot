var dbfile = __dirname + "/test.db";

var sqlite3 = require("sqlite3").verbose();
//  fs = require('fs');
var db = new sqlite3.Database(dbfile);

// var exists = fs.existsSync(dbfile);

// if (!exists) {
//     process.exit(0);
// }

module.exports = db;