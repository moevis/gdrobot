var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: {

            },
            message: "",
            notice: false,
            limit: 10,
            list: [],
            curr: 0,
            count: 0,
            entry: config.entry
        },
        methods: {
            search: function(flag) {
                if (flag) {
                    this.curr = 0;
                }
                var date = '';
                if (this.table.date) {
                    date = new Date(this.table.date);
                    date = date.getTime()/1000;
                }
                var status = this.table.status || '';
                var offset = this.limit * this.curr;
                var self = this;
                $.get('/report/search?date=' + date + '&status=' + status + '&offset=' + offset + '&limit=' + this.limit, function(data) {
                    if (!data.error) {
                        self.count = data.result.count;
                        self.list = data.result.data;
                    }
                });
            },
            changePage: function(index) {
                this.curr = index;
                app.search(false);
            },
            dismiss: function() {
                notice = false;
            },
            showNotice: function(msg) {
                this.message = msg;
                this.notice = true;
            },
            reset: function (index) {
                var id = this.list[index].id;
                $.post('/admin/form/' + id + '/reset').done(function(data) {
                    app.showNotice("操作成功");
                    app.list[index].status = 0;
                }).fail(function(xhr) {
                    var data = xhr.responseJSON;
                    app.showNotice(data.message);
                });
            },
            submit: function (index) {
                var id = this.list[index].id;
                $.post('/admin/form/' + id + '/submit').done(function(data) {
                    app.showNotice("操作成功");
                    app.list[index].status = 1;
                }).fail(function(xhr) {
                    var data = xhr.responseJSON;
                    app.showNotice(data.message);
                });
            },
            accept: function(index) {
                var id = this.list[index].id;
                $.post('/admin/form/' + id + '/accept').done(function(data) {
                    app.showNotice("操作成功");
                    app.list[index].status = 2;
                }).fail(function(xhr) {
                    var data = xhr.responseJSON;
                    app.showNotice(data.message);
                });
            },
            decline: function(index) {
                var id = this.list[index].id;
                $.post('/admin/form/' + id + '/decline').done(function(data) {
                    app.showNotice("拒绝成功");
                    app.list[index].status = 3;
                }).fail(function(xhr) {
                    var data = xhr.responseJSON;
                    app.showNotice(data.message);
                });
            }
        }
    });
});