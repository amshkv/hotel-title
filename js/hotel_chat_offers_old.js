// $(document).ready(function(){
//
//
//     $( document ).ajaxComplete(function( event, request, settings ) {
//         console.log( event, request, settings );
//
//     });
//
//
// });

function offers($div, action, Id) {
  var offers;
  var images;
  var tourists;

  function getOffers() {
    var objParams = {
      action: action,
      PlaceId: 0,
      dateFrom: '1900-01-01',
      dateTo: '1900-01-01',
      offerId: Id,
      isFavorites: 0
    };

    $.ajax({
      url: CTRL_URL,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        showOffers(data);
      }
    });
  }

  function showOffers(data) {
    var prevOfferId = 0;
    var prices = '';
    var commonCount = 0;
    var dsp, btn, btnRel;
    var cnt_overdue = 0;
    var cnt_prices = 0;
    var len;
    var color;

    offers = data;

    // console.log(offers);

    $div.html();

    if (offers === null) {
      return;
    }

    len = Object.getOwnPropertyNames(offers).length;

    var count = 0;
    for (var i in offers) {
      count++;
    }

    for (var key in offers) {
      var offId = offers[key]['id'];
      var header = offers[key]['header'];
      var place = offers[key]['place'];
      var quantity_min = offers[key]['quantity_min'];
      var quantity_max = offers[key]['quantity_max'];
      var rest_begin = phpToCal(offers[key]['rest_begin']);
      var rest_end = phpToCal(offers[key]['rest_end']);
      var description = offers[key]['description'];
      var name = offers[key]['name'];
      var price = offers[key]['price'];
      var is_common = offers[key]['is_common'];
      var all_year = offers[key]['all_year'];
      var relationId = offers[key]['relationId'];
      var selected = offers[key]['selected'];
      var deleted = offers[key]['deleted'];
      var is_overdue = offers[key]['is_overdue'];
      // var selected_offer_id = offers[key]['selected_offer_id'];

      color = '';
      if (deleted == 1 || is_overdue == 1) {
        header += ' (снято с публикации)';
        color = 'style="color: #b7b7b7;"';
      }

      if (prevOfferId !== offId) {
        // '<div class="col-sm-2" id="imageOfferId_'+offId+'">' +

        var htmlOffer =
          '<div class="panel-group">' +
          '<div class="panel panel-default">' +
          '<div class="panel-heading">' +
          '<div class="panel-title">' +
          '<h4 ' +
          color +
          '>' +
          header +
          '</h4><p>' +
          offId +
          '</p>' +
          '</div>' +
          '</div>' +
          '<div class="panel-body">' +
          '<div class="col">' +
          '<p class="map">' +
          place +
          '</p>' +
          '<p class="quantity">Количество от ' +
          quantity_min +
          ' до ' +
          quantity_max +
          '</p>' +
          '</div>' +
          '<div class="col">' +
          '<p>' +
          description +
          '</p>' +
          '</div>' +
          '<div class="col col-price col-4" id="prices_' +
          offId +
          '" >' +
          // здесь список цен
          '</div>' +
          '<div class="col col-button">' +
          '<a class="mail" id="offer_mail' +
          Id +
          '" href="#" data-key="' +
          offId +
          '"></a>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';

        $div.append(htmlOffer);

        // getImages(offId); картинки пока не показываем

        if (prices !== '') {
          $('#prices_' + prevOfferId).html(prices);

          // if(commonCount > 0){
          //     $("#prices_" + prevOfferId).find(".clsHide").hide();
          // }

          prices = '';
        }

        if (prevOfferId > 0) {
          if (cnt_overdue === cnt_prices && cnt_overdue > 0) {
            $('#btn_' + prevOfferId).html(
              '<span><b>Предложение просрочено</b></span>'
            );
          }
          cnt_overdue = 0;
          cnt_prices = 0;
        }

        prevOfferId = offId;
        commonCount = 0;
      }

      cnt_prices++;
      if (is_overdue == 1) {
        cnt_overdue++;
      }

      if (len - 1 == key) {
        if (cnt_overdue === cnt_prices && cnt_overdue > 0) {
          //     $('#btn_' + prevOfferId).html('<span><b>Предложение просрочено</b></span>');
        }
        cnt_overdue = 0;
        cnt_prices = 0;
      }
      //console.log(offId +' : '+ price);

      if (is_common <= 0) {
        dsp = 'class="prices_' + offId + ' collapse out"';
        btn = '';
      } else {
        commonCount++;
        dsp = '';
        btn =
          '<button type="button" class="btn btn-price" data-toggle="collapse" data-target=".prices_' +
          offId +
          '"></button>';
      }

      if (all_year <= 0) {
        prices +=
          '<div ' +
          dsp +
          ' ><p><span>c</span> ' +
          rest_begin +
          ' <span>по</span> ' +
          rest_end +
          ' <span class="price">Стоимость:</span> ' +
          price +
          ' руб.</p></div>' +
          btn;
      } else {
        prices += '<p>Круглый год цена: ' + price + 'руб.</p>';
        commonCount++;
      }

      if (key == count - 1) {
        $('#prices_' + prevOfferId).html(prices);
      }
    }

    getTourists();

    $('#offer_mail' + Id).click(function(e) {
      e.preventDefault();
      console.log(e);
      $('.tourist_' + $(this).data('key')).toggleClass('hidden');
    });

    // $(".btnCommon").click(function() {
    //     $(this).parent().parent().find(".clsHide").toggle();
    // });
    //
    // $(".relation").click(function() {
    //     relate($(this).data('key'), 'relate_offer_rq');
    // });
  }

  function getImages(offerId) {
    var objParams = {
      action: 'offer_images',
      offerId: offerId
    };
    $.ajax({
      url: CTRL_URL,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        showImages(data);
      }
    });
  }

  function showImages(data) {
    images = data;

    if (images === null) {
      return;
    }

    var offId = images[0]['offer_id'];

    var act = 0;
    var count = Object.keys(images).length;

    var htmlImages =
      '<div id="carousel_' +
      offId +
      '" class="carousel slide" data-interval="false">' +
      '<div class="carousel-inner" role="listbox">';

    for (var key in images) {
      var imageId = images[key]['id'];
      var name = images[key]['name'];
      var offerId = images[key]['offer_id'];
      var thumbnailPath = images[key]['thumbnail'];
      var avatar = images[key]['avatar'];
      var active = '';

      if (avatar === imageId) {
        active = 'active';
        act += 1;
      }

      if (key == count - 1 && act == 0) {
        active = 'active';
      }

      htmlImages +=
        '<div class="carousel-item ' +
        active +
        '" >' +
        '<img style="width: 100%" class="d-block img-fluid" src="' +
        IMAGE_URL +
        thumbnailPath +
        '" alt="' +
        name +
        '">' +
        '</div>';
    }

    htmlImages +=
      '</div>' +
      '<a class="carousel-control-prev" href="#carousel_' +
      offId +
      '" role="button" data-slide="prev">' +
      '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
      '<span class="sr-only">Назад</span>' +
      '</a>' +
      '<a class="carousel-control-next" href="#carousel_' +
      offId +
      '" role="button" data-slide="next">' +
      '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
      '<span class="sr-only">Вперед</span>' +
      '</a>' +
      '</div>';

    $('#imageOfferId_' + offerId).html(htmlImages);
  }

  function getTourists() {
    var objParams = {
      action: 'chat_offer_tourist',
      offerId: Id
    };

    $.ajax({
      url: CTRL_URL,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function(data) {
        showTourists(data);
      }
    });
  }

  function showTourists(data) {
    var htmlTourists;
    var msg_count = 0;
    var tourist_count = 0;
    var all_msg;

    tourists = data;

    if (tourists === null) {
      return;
    }

    for (var key in tourists) {
      var offer_id = tourists[key]['offer_id'];
      var relation_id = tourists[key]['relation_id'];
      var tourist_id = tourists[key]['tourist_id'];
      var tourist_name = tourists[key]['tourist_name'];
      var tourist_messages = tourists[key]['tourist_messages'];
      var message = tourists[key]['message'];
      var msg_date = tourists[key]['msg_date'];
      var msg_time = tourists[key]['msg_time'];

      msg_count += parseInt(tourist_messages);
      tourist_count++;

      var act = tourist_messages > 0 ? 'active' : '';

      message = message == '' ? '' : '<p class="name">' + message + '</p>';

      htmlTourists =
        '<div class="block-chats hidden ' +
        act +
        ' tourist_' +
        offer_id +
        '">' +
        '<a href="#" class="offer_chat' +
        Id +
        '" data-key="' +
        relation_id +
        '">' +
        '<div class="panel-heading">' +
        '<p class="name">' +
        tourist_name +
        '</p>' +
        message +
        '</div>' +
        '<div class="panel-body">' +
        '<div class="col"><p></p></div>' +
        '<div class="col"><p>' +
        date_short(msg_date, msg_time) +
        '</p></div>' +
        '<div class="col"><p></p></div>' +
        '</div>' +
        '</a>' +
        '</div>';

      $div.append(htmlTourists);
    }

    all_msg =
      msg_count > 0 ? msg_count + ' сообщений от ' : 'все сообщения от ';
    $('#offer_mail' + Id).html(all_msg + tourist_count + ' пользователей');

    $('.offer_chat' + Id).click(function(e) {
      e.preventDefault();
      relate($(this).data('key'), 'chat_offer_rq');
    });
  }

  function relate(relation_id, action) {
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
          name: 'relationId',
          value: relation_id
        })
      );

    $div.append($form);
    $form.submit();
  }

  getOffers();
}
