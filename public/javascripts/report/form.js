var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: {

            },
            studentEnt: {

            },
            teacherEnt: {

            },
            studentList: [],
            teacherList: [],
            show1: true,
            show2: true,
            disable: false
        },
        methods: {
            addTeacher: function() {
                if (this.teacherEnt.name == '' || this.teacherEnt.title == '' || this.teacherEnt.phone == '' || this.teacherEnt.email == '') {
                    alert("教师信息还不全");
                    return;
                }
                this.teacherList.push(this.teacherEnt);
                this.teacherEnt = {};
            },
            addStudent: function() {
                if (this.studentEnt.name == '' || this.studentEnt.major == '' || this.studentEnt.phone == '' || this.studentEnt.email == '') {
                    alert("教师信息还不全");
                    return;
                }
                this.studentList.push(this.studentEnt);
                this.studentEnt = {};
            },
            removeTeacher: function(index) {
                this.teacherList.splice(index, 1);
            },
            removeStudent: function(index) {
                this.studentList.splice(index, 1);
            },
            editTeacher: function(index) {
                this.teacherEnt = this.teacherList[index];
                this.teacherList.splice(index, 1);
            },
            editStudent: function(index) {
                this.studentEnt = this.studentList[index];
                this.studentList.splice(index, 1);
            },
            toggleShow1: function(){
                this.show1 = !this.show1;
            },
            toggleShow2: function(){
                this.show2 = !this.show2;
            },
            submit: function() {
                var data = JSON.parse(JSON.stringify(this.table));
                data.students = this.studentList;
                data.teachers = this.teacherList;
                this.disable = true;
                var self = this;
                $.post('', data, function(res) {
                    self.disable = false;
                    if (res.error) {
                        alert(res.message);
                    } else {
                        if (data.id) {
                            alert("保存成功");
                        } else {
                            alert("保存成功，将跳转到您的报告目录，您可以浏览，编辑，提交这份表格。");
                            window.location.href = "/user/reportList";
                        }
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

    if (report.status !== undefined) {
        app.studentList = JSON.parse(report.students) || [];
        app.teacherList = JSON.parse(report.teachers) || [];
        delete report.students;
        delete report.teachers;
        app.table = report;
        if (app.table.status != 0) {
            app.$set('show1', false);
            app.$set('show2', false);
        }
    } else {
        app.table.status = 0;
    };
});
