var chat = function($div, $head, url, id) {
  var arr;
  var arrHeader;
  var root = this;

  root.construct = function() {
    getChatHeader();
    getChat();
  };

  var getChat = function() {
    var objParams = {
      action: 'chat',
      relationId: id
    };

    console.log(objParams);

    $.ajax({
      url: url,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        root.show(data);
      },
      error: function(data) {
        console.log('Error!!!');
        console.log(data);
      }
    });
  };

  var getChatHeader = function() {
    var objParams = {
      action: 'chat_header',
      relationId: id
    };

    $.ajax({
      url: url,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        root.showHeader(data);
      }
    });
  };

  root.addMsg = function(msg) {
    var objParams = {
      action: 'chat_add_msg',
      relationId: id,
      chatMsg: msg
    };

    $.ajax({
      url: url,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function() {
        getChat();
      }
    });
  };

  root.show = function(data) {
    var $alert, $date;
    var key;
    var cls;
    var date, time;
    var name;

    arr = data;

    console.log(data);
    if (!arr) {
      $div.html(
        '<div class="chat_help">Напишите ваше первое сообщение туристу. Он увидит ваше предложение и информацию, которую вы добавите в чате.</div>'
      );
      return;
    }

    clearMessages();
    date = '';
    // cnt = 0;

    for (key in arr) {
      time = arr[key]['message_time'];

      // вставка даты между сообщениями
      if (phpToCal(arr[key]['message_date']) !== date) {
        date = phpToCal(arr[key]['message_date']);

        $date = $('<p>', {
          class: 'chat-time',
          text: date
        });

        $div.append($date);
      }

      cls = arr[key]['user_type'] == 'tourist' ? 'inbox' : 'outbox';

      $alert = $('<div>', {
        class: cls
      })
        .append(
          $('<p>', {
            html: arr[key]['message'].replace(
              /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
              '$1<br>$2'
            )
          })
        )
        .append(
          $('<p>', {
            class: 'time',
            text: time
          })
        );

      $div.append($alert);
      // cnt++;
    }
  };

  root.showHeader = function(data) {
    var key, name, $header;

    arrHeader = data;
    if (arrHeader == null) {
      return;
    }

    for (key in arrHeader) {
      name = arrHeader[key]['tourist_name'];
    }

    $header = $('<h4>', {
      text: name
    });

    $head.html($header);
  };

  var clearMessages = function() {
    $div.html('');
  };

  root.construct();
};
