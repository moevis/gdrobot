var config = require("../config.json");
var dbfile = config.db;

var sqlite3 = require("sqlite3").verbose();

var db = new sqlite3.Database(dbfile);

module.exports = db;