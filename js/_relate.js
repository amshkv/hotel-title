
var relationId;
var reqId = 0;
var tourist_id = 0;
var offerId;
var myChat;
var type;

$(document).ready(function(){

    $("#addMessage").click(function(){
        chatAddMsg();
    });

    type = ( reqId == 0 ) ? 1 : 2;
    tenders( $('#requisitions'), 'tenders_by_offerId', offerId, reqId, tourist_id, type, 'chat' );

    myChat = new chat($('#chat'),CTRL_URL, relationId);
    $.datetimepicker.setLocale('ru');

});

function chatAddMsg() {
    var msg;

    msg = $('#txtMessage').val();
    if(msg == '') { return; }

    myChat.addMsg(msg);
    $('#txtMessage').val('');
}


