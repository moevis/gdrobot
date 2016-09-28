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
                disable = true;
                $.post('/user/profile', this.table, function(data) {
                    disable = false;
                    if (data.error) {
                        app.showNotice(data.message);
                    } else {
                        app.showNotice("更改成功！");
                    }
                });
            },
            submitPassword: function() {
                disable = true;
                $.post('/user/password', this.table, function(data) {
                    disable = false;
                    if (data.error) {
                        app.showNotice(data.message);
                    } else {
                        app.showNotice("更改成功！");
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