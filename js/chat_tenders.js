function tenders($div, action, offerId, rqId, touristId, type, view) {
  var requisitions;

  function getRequisitions() {
    var objParams = {
      action: action,
      offerId: offerId,
      rqId: rqId,
      touristId: touristId,
      type: type // 0- все, 1-туристы, 2- заявки
    };

    $.ajax({
      url: CTRL_URL,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        // console.log(data);
        showRequisitions(data);
      }
    });
  }

  function showRequisitions(data) {
    var htmlRequisition;
    var btn;
    var msg, color;

    requisitions = data;

    $div.html('');

    if (requisitions === null) {
      return;
    }

    // console.log(requisitions);

    for (var key in requisitions) {
      var rqId = requisitions[key]['rqId'];
      var header = requisitions[key]['header'];
      var place = requisitions[key]['place'];
      var place_out = requisitions[key]['place_out'];
      var quantity_tourist = requisitions[key]['quantity_tourist'];
      var quantity_children = requisitions[key]['quantity_children'];
      var quantity_baby = requisitions[key]['quantity_baby'];
      var rest_begin = phpToCal(requisitions[key]['rest_begin']);
      var rest_end = phpToCal(requisitions[key]['rest_end']);
      var description = requisitions[key]['description'];
      var name = requisitions[key]['name']; // имя туриста
      var theme = requisitions[key]['theme'];
      var rq_published = requisitions[key]['rq_published'];
      var rq_deleted = requisitions[key]['rq_deleted'];
      var tourist_messages = requisitions[key]['tourist_messages'];
      // var price = offers[key]['price'];
      var message = requisitions[key]['message'];
      var msg_date = requisitions[key]['msg_date'];
      var msg_time = requisitions[key]['msg_time'];

      color = '';
      if (rq_deleted === 1) {
        header += ' (снято с публикации)';
        color = 'chat__item-title--no-active';
      }

      msg = '';

      if (tourist_messages > 0) {
        msg =
          '<span class="chat_mail_tender-new">' + tourist_messages + '</span>';
      }

      var notMember = ' class="not-member" ';
      var touristNotMember = '';
      var childrenNotMember = '';
      var babyNotMember = '';

      if (quantity_tourist < 1) {
        touristNotMember = notMember;
      }

      if (quantity_children < 1) {
        childrenNotMember = notMember;
      }

      if (quantity_baby < 1) {
        babyNotMember = notMember;
      }

      var placeAll = '';

      if (place) {
        placeAll = 'Из ' + place + ' в ' + place_out;
      } else {
        placeAll = 'В ' + place_out;
      }

      if (rqId > 0) {
        htmlRequisition =
          '<div class="block-main chat-item">' +
          '<div class="chat__line chat__line--title">' +
          '<h2 class="chat__item-title ' +
          color +
          '">' +
          header +
          '</h2>' +
          '<span class="chat__item-number">' +
          rqId +
          '</span>' +
          '</div>' +
          '<div class="chat__line chat__line--address">' +
          '<div class="chat__item-address">' +
          placeAll +
          '</div>' +
          '<div class="chat__item-date">' +
          '<span>с </span>' +
          rest_begin +
          '<span> по </span>' +
          rest_end +
          '</div>' +
          '<div class="chat__item-member">' +
          '<span' +
          touristNotMember +
          ' >Взрослых: ' +
          quantity_tourist +
          ' </span>' +
          '<span' +
          childrenNotMember +
          ' >детей (7-14 лет): ' +
          quantity_children +
          ' </span>' +
          '<span' +
          babyNotMember +
          ' >детей (до 7 лет): ' +
          quantity_baby +
          ' </span>' +
          '</div>' +
          '</div>' +
          '<div class="chat__line chat__line--user-text">' +
          description +
          '</div>' +
          '<div class="chat__line chat__line--last ">' +
          '<a class="mail chat_mail_tender' +
          offerId +
          '" href="#" data-key="' +
          offerId +
          '_' +
          key +
          '">' +
          msg +
          '<span class="chat_mail_tender-mail"></span>' +
          '</a>' +
          '</div>' +
          '</div>';

        var act = tourist_messages > 0 ? 'active' : '';

        message = message == '' ? '' : message;

        htmlRequisition +=
          '<div class="block-chats hidden ' +
          act +
          ' " id="tender_user_' +
          offerId +
          '_' +
          key +
          '">' +
          '<a href="#" class="block-chats__link chat chat_tender' +
          offerId +
          '" data-key="' +
          key +
          '">' +
          '<div class="block-chats__info"><span>' +
          name +
          '</span><span class="block-chats__date">' +
          date_short(msg_date, msg_time) +
          '</span></div>' +
          '<div class="block-chats__user-text">' +
          message +
          '</div>' +
          '</a>' +
          '</div>';

        $div.append(htmlRequisition);
      }
    }

    $('.chat_mail_tender' + offerId).click(function(e) {
      e.preventDefault();
      $('#tender_user_' + $(this).data('key')).toggleClass('hidden');
    });

    $('.chat_tender' + offerId).click(function(e) {
      e.preventDefault();
      relate($(this).data('key'), 'chat_offer_rq');
    });
  }

  function relate(key, action) {
    var $form = $('<form>', {
      action: CTRL_URL,
      method: 'POST'
    })
      .append(
        $('<input>', {
          type: 'hidden',
          name: 'action',
          value: action
        })
      )
      .append(
        $('<input>', {
          type: 'hidden',
          name: 'offerId',
          value: requisitions[key]['offerId']
        })
      )
      .append(
        $('<input>', {
          type: 'hidden',
          name: 'rqId',
          value: requisitions[key]['rqId']
        })
      )
      .append(
        $('<input>', {
          type: 'hidden',
          name: 'relationId',
          value: requisitions[key]['relationId']
        })
      )
      .append(
        $('<input>', {
          type: 'hidden',
          name: 'tourist_id',
          value: requisitions[key]['tourist_id']
        })
      );

    $div.append($form);
    $form.submit();
  }

  getRequisitions();
}
