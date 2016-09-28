var db = require('./db.js');

var config = {
    global: null,
    load: function(cb) {
        var self = this;
        db.all('select * from option', function(err, data) {
            self.global = {};
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    self.global[data[i].key] = data[i].value;
                }
            }
            cb();
        });
    }
}

module.exports = config;