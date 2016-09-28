$(document).ready(function() {
    $('#note').summernote();
    $("#article").change(function(){
        app.getArticle();
    });
});

var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new Vue({
        el: '#app',
        data: {
            table: {
                article: 0,
                title: "",
                content: ""
            },
            key: '',
            value: '',
            entry: config.entry,
            disable: false
        },
        methods: {
            getArticle: function() {
                var index = this.table.article;
                var self = this;
                if (index != 0) {
                    $.get('/admin/article/' + index + "?stamp=" + Date.now(), function(data) {
                        if (data.error) {
                            alert("失败");
                        } else {
                            self.table.title = data.result.title;
                            $('#note').summernote('code',data.result.content);
                        }
                    });
                }

            },
            updateArticle: function() {
                var index = this.table.article;
                if (index != 0) {
                    var self = this;
                    this.disable = true;
                    var data = {};
                    data.title = this.table.title;
                    data.content = $('#note').summernote('code');
                    console.log(data);
                    $.post('/admin/article/' + index, data, function(data) {
                        self.disable = false;
                        if (data.error) {
                            alert(data.message);
                        } else {
                            alert("成功");
                        }
                    });
                }
            }
        }
    });
});