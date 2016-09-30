var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: {
                captcha: ''
            },
            message: "",
            captchaImage: '',
            notice: false,
            disable: false,
            times: times
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
            getCaptcha: function () {
                $.get('/captcha', function(data) {
                    app.captchaImage = data;
                });
            }
        }
    });
    if (times > 3) {
        app.getCaptcha();
    }
});