var dbfile = "./test.db";

var sqlite3 = require("sqlite3").verbose();
//  fs = require('fs');
var db = new sqlite3.Database(dbfile);

// var exists = fs.existsSync(dbfile);

// if (!exists) {
//     process.exit(0);
// }

db.get('select * from user where email=?',"moevery@gmail.com", function(err, data) {
    console.log(data);
});

// db.run("insert into user(email, password) values(?,?)", "userna","pass", function(err,data) {
//     console.log(err);
// });