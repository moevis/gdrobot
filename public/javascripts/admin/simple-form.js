var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: form,
            message: "",
            notice: false,
            disable: false,
            students: [],
            teachers: [],
            entry: config.entry
        },
        methods: {
            submit: function() {
                if (this.table.email == '' || this.table.password == '') {
                    app.showNotice("信息不完整，请仔细填写用户名和密码。");
                    return;
                }
                var self = this;
                this.disable = true;
                $.post('#', this.table)
                    .done(function(data) {
                        self.disable = false;
                        window.location.href = "/user/profile";
                    })
                    .fail(function(data) {
                        var data = data.responseJSON;
                        self.disable = false;
                        app.showNotice(data.message);
                        app.times = data.times;
                        app.getCaptcha();
                        app.table.captcha = '';
                    });
            },
            dismiss: function() {
                notice = false;
            },
            showNotice: function(msg) {
                this.message = msg;
                this.notice = true;
            },
            accept: function() {
                $.post('/admin/' + this.table.id + '/accept')
                .done(function(data) {

                })
                .fail(function(xhr) {
                    var data = xhr.responseJSON;
                });
            },
            decline: function() {
                $.post('/admin/' + this.table.id + '/decline')
                .done(function(data) {

                })
                .fail(function(xhr) {
                    var data = xhr.responseJSON;
                });
            }
        }
    });
    app.students = JSON.parse(form.students) || [];
    app.teachers = JSON.parse(form.teachers) || [];
});