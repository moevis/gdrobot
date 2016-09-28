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
                if (this.table.email == '' || this.table.password == '') {
                    app.showNotice("信息不完整，请仔细填写用户名和密码。");
                    return;
                }
                var self = this;
                this.disable = true;
                $.post('#', this.table, function(data) {
                    self.disable = false;
                    if (data.error) {
                        app.showNotice(data.message);
                    } else {
                        window.location.href = "/user/profile";
                    }
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