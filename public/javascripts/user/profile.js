var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: {

            },
            message: "",
            notice: false,
            disable: false
        },
        methods: {
            addTeacher: function() {
                this.teacherList.push(this.teacherEnt);
                this.teacherEnt = {};
            },
            submitProfile: function() {
                var self = this;
                self.disable = true;
                $.post('/user/profile', this.table)
                    .done(function(data) {
                        self.disable = false;
                        app.showNotice("更改成功！");
                    })
                    .fail(function(xhr) {
                        self.disable = false;
                        var data = xhr.responseJSON;
                        app.showNotice(data.message);
                    });
            },
            submitPassword: function() {
                var self = this;
                self.disable = true;
                $.post('/user/password', this.table)
                    .done(function(data) {
                        self.disable = false;
                        app.showNotice("更改成功！");
                    })
                    .fail(function(xhr) {
                        self.disable = false;
                        var data = xhr.responseJSON;
                        app.showNotice(data.message);
                    });
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