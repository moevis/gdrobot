var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: {

            },
            reports: reports,
            message: "",
            notice: false,
            entry: config.entry
        },
        methods: {
            dismiss: function() {
                notice = false;
            },
            showNotice: function(msg) {
                this.message = msg;
                this.notice = true;
            },
            parseStudents: function(obj) {
                var students = JSON.parse(obj);
                var names = students.map(function(n){return n.name;});
                return names.join(', ');
            },
            deleteReport: function(index) {
                if (confirm("删除后将无法恢复，是否继续？")) {
                    var id = this.reports[index].id;
                    var self = this;
                    $.post('/report/' + id + '/delete', function(data) {
                        if (data.error) {
                            alert(data.message);
                        } else {
                            app.showNotice("删除成功");
                            self.reports.splice(index, 1);
                        }
                    });
                }
            },
            submit: function(index) {
                if (confirm("提交后将无法修改，是否继续？")) {
                    var id = this.reports[index].id;
                    var self = this;
                    // self.reports.splice(index, 1);
                    $.post('/report/' + id + '/submit', function(data) {
                        if (data.error) {
                            alert(data.message);
                        } else {
                            app.showNotice("提交成功");
                            self.reports[index].status = 1;
                        }
                    });
                }
            }
        }
    });
});