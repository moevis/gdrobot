var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: {

            },
            message: "",
            notice: false,
            limit: 20,
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
                this.curr = this.index;
                search(false);
            },
            dismiss: function() {
                notice = false;
            },
            showNotice: function(msg) {
                this.message = msg;
                this.notice = true;
            }
        }
    });
});