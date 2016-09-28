var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: data,
            key: '',
            value: '',
            entry: config.entry
        },
        methods: {
            updateOption: function(key, index) {
                var data = {};
                data.key = key;
                data.value = app.$els.options.querySelectorAll('.values')[index].value;
                $.post('/admin/option/update', data, function(data) {
                    if (data.error) {
                        alert("修改失败");
                    } else {
                        alert("修改成功");
                    }
                });
            },
            deleteOption: function(key, index) {
                var data = {};
                data.key = key;
                var self = this;
                $.post('/admin/option/remove', data, function(data) {
                    if (data.error) {
                        alert("删除失败");
                    } else {
                        self.table.option.splice(index, 1);
                    }
                });
            },
            addOption: function() {
                var key = this.key;
                var value = this.value;
                var data = { key: key, value: value};
                var self = this;
                $.post('/admin/option/add', data, function(data) {
                    if (data.error) {
                        alert('添加失败');
                    } else {
                        self.table.option.push({ key: self.key, value: self.value });
                        self.key = '';
                        self.value = '';
                    }
                });
            }
        }
    });
    if (data) {
        app.table = data;
    }
});