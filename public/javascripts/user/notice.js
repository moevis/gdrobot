var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: {

            },
            message: "",
            notice: false
        },
        methods: {
            submit: function() {
                $.post('#', this.table, function(data) {
                    console.log(data);
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