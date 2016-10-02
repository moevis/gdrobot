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
            subList: [],
            curr: 0,
            count: 0,
            entry: config.entry,
            showModal: false
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
                var email = this.table.email || '';
                var offset = this.limit * this.curr;
                var self = this;
                $.get('/user/search?date=' + date + '&email=' + email + '&offset=' + offset + '&limit=' + this.limit).done(function(data) {
                    self.count = data.result.count;
                    self.list = data.result.data;
                }).fail(function(xhr) {
                    var data = xhr.responseJSON;
                    alert(data.message);
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
            },
            getUserForms: function(index) {
                this.showModal = true;
                $.get('/admin/' + this.list[index].id + '/forms')
                .done(function(data) {
                    app.subList = data.result;
                }).fail(function(xhr){
                    var data = xhr.responseJSON;
                    alert(data.message);
                });
            },
            banUser: function(index) {

            },
            demoteUser: function(index) {
                $.get('/admin/' + this.list[index].id + '/demote')
                .done(function(data) {
                    alert('成功');
                    app.list[index].role = 0;
                }).fail(function(xhr){
                    var data = xhr.responseJSON;
                    alert(data.message);
                });
            },
            promoteUser: function(index) {
                $.get('/admin/' + this.list[index].id + '/promote')
                .done(function(data) {
                    app.list[index].role = 1;
                    alert('成功');
                }).fail(function(xhr){
                    var data = xhr.responseJSON;
                    alert(data.message);
                });
            }
        }
    });
});