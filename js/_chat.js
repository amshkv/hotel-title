

var chat = function($div, url, id){
    var arr;
    var root = this;

    root.construct = function(){
        getChat();
    };

    var getChat = function(){

        var objParams = {
            'action' : 'chat',
            'relationId' : id
        };

        $.ajax({
            url: url,
            type: "POST",
            data: objParams,
            dataType: 'json',
            success:function(data){
                root.show(data);
            }
        });
    };

    root.addMsg = function(msg){

        var objParams = {
            'action' : 'chat_add_msg',
            'relationId' : id,
            'chatMsg' : msg
        };

        $.ajax({
            url: url,
            type: "POST",
            data: objParams,
            dataType: 'json',
            success:function(){
                getChat();
            }
        });
    };

    root.show = function(data) {
        var $alert;
        var key;

        arr = data;
        if(arr == null) { return; }

        clearMessages();

        for (key in arr) {
            $alert = $('<div>', {
                class: "alert alert-success",
                role: "alert"
            }).append($('<p>', {
                text: arr[key]['message']
            })).append($('<hr>'
            )).append($('<p>', {
                text: arr[key]['name'] + ' (' + phpToCal(arr[key]['datetime']) + ')'
            }));

            $div.append($alert);
        }

    };

    var clearMessages = function () {
        $div.html('');
    };

    root.construct();

};