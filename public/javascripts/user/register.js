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
            submit: function() {
                if (this.table.email == "" || this.table.password == "") {
                    app.showNotice("邮箱或密码为空，请仔细填写。");
                    return;
                }

                if (this.table.password.length < 6) {
                    app.showNotice("密码不少于 6 个字符");
                    return;
                }

                if (this.table.password != this.table.password2) {
                    app.showNotice("两次密码不一致，请检查");
                    return;
                }
                
                if (isEmail(this.table.email)) {
                    app.showNotice("邮箱格式不正确。");
                    return;
                }
                var self = this;
                self.disable = true;
                $.post('#', this.table)
                    .done(function(data) {
                        self.disable = false;
                        alert("注册成功!");
                        window.location.href = "/user/login";
                    }).fail(function(xhr) {
                        var data = xhr.responseJSON;
                        self.disable = false;
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