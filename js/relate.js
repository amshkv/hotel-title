var relationId;
var reqId = 0;
var tourist_id = 0;
var offerId;
var myChat;
var type;

$.datetimepicker.setLocale('ru');

$(document).ready(function() {
  $(document).ajaxComplete(function(event, request, settings) {
    console.log(event, request, settings);

    if ($('.chat-toggle__button').length > 1) {
      $('.chat-toggle__button').addClass('click');
      $('.chat-toggle').addClass('transform');
    }

    $('.fancybox').fancybox({
      nextClick: true
    });

    $('.chat-body').animate(
      { scrollTop: $('.chat-body').prop('scrollHeight') },
      500
    );
  });
});

$(document).ready(function() {
  $('#addMessage').click(function() {
    chatAddMsg();
  });

  $('#txtMessage').on('keydown', function(event) {
    if (event.ctrlKey && event.keyCode == 13) {
      $('#txtMessage').val(function(i, val) {
        return (val += '\n');
      });
    }
    if (!event.shiftKey && !event.ctrlKey && event.keyCode == 13) {
      event.preventDefault();
      chatAddMsg();
    }
  });

  type = reqId == 0 ? 1 : 2;

  offers($('.chat-toggle'), 'relate_offers', relationId);

  // sleep(2000);

  tenders(
    $('.chat-toggle'),
    'tenders_by_offerId',
    offerId,
    reqId,
    tourist_id,
    type,
    'chat'
  );

  myChat = new chat($('#chat'), $('#chat_header'), CTRL_URL, relationId);
});

function chatAddMsg() {
  var msg;

  msg = $('#txtMessage')
    .val()
    .trim();
  if (msg == '') {
    return;
  }

  myChat.addMsg(msg);
  $('#txtMessage').val('');

  $('.chat-body').animate(
    { scrollTop: $('.chat-body').prop('scrollHeight') },
    500
  );
}
