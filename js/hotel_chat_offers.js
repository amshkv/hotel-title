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
      var place_out = offers[key]['place_out'];
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
      var priceType = offers[key]['price_type'];
      // var selected_offer_id = offers[key]['selected_offer_id'];

      color = '';
      if (deleted == 1 || is_overdue == 1) {
        header += ' (снято с публикации)';
        color = 'chat__item-title--no-active';
      }

      if (prevOfferId !== offId) {
        // '<div class="col-sm-2" id="imageOfferId_'+offId+'">' +
        // console.log(offId);
        var placeAll = '';
        if (place) {
          placeAll = 'Из ' + place + ' в ' + place_out;
        } else {
          placeAll = 'В ' + place_out;
        }

        var priceTypeWrap = '';

        switch (priceType) {
          case 'stock':
            priceTypeWrap =
              '<span class="chat-price-type">Стоимость за тур:</span>';
            break;
          case 'period':
            priceTypeWrap =
              '<span class="chat-price-type">Стоимость за период:</span>';
            break;
          case 'day':
            priceTypeWrap =
              '<span class="chat-price-type">Стоимость за номер в сутки:</span>';
            break;
          case 'man':
            priceTypeWrap =
              '<span class="chat-price-type">Стоимость за человека:</span>';
            break;
          default:
            break;
        }

        var htmlOffer =
          '<div class="block-main chat-item chat-item--offer">' +
          '<div class="chat__line chat__line--first">' +
          '<div class="chat__line-images carousel slide carousel-generic" data-ride="carousel" id="imageOfferId_' +
          offId +
          '">' +
          // здесь фотографии
          '</div>' +
          '<div class="chat__line-text">' +
          '<h2 class="chat__item-title ' +
          color +
          '">' +
          header +
          '</h2>' +
          '<div class="chat__item-address">' +
          placeAll +
          '</div>' +
          '<div class="chat__item-members">Количество от ' +
          quantity_min +
          '<span> до </span>' +
          quantity_max +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="chat__line chat__line--user-text">' +
          description +
          '</div>' +
          '<div class="chat__line chat__line--price" id="prices_' +
          offId +
          '" >' +
          priceTypeWrap +
          // здесь список цен
          '</div>' +
          '<div class="chat__line chat__line--last">' +
          '<div class="chat__item-offer"><span class="chat__item-offer-text">Предложение</span>' +
          '<span class="chat__item-number">' +
          offId +
          '</span>' +
          '</div>' +
          '<a class="mail chat_mail_tender" id="offer_mail' +
          Id +
          '" href="#" data-key="' +
          offId +
          '"><span class="chat_mail_tender-mail"></span>' +
          // msg +
          '</a>' +
          '</div>' +
          '</div>';

        $div.append(htmlOffer);

        getImages(offId);

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

      var mathrand = Math.floor(Math.random() * 2);

      var stockPrice = '';

      var mathrand = 0;
      if (mathrand === 1) {
        stockPrice = '<span class="offer-stock">-%</span>';
      }

      if (all_year == 1) {
        prices =
          '<div class="chat__item-price--all">' +
          '<span class="price-color-def">Круглый год цена: </span>' +
          price +
          ' руб.' +
          '</div>';
        commonCount++;
        $('#prices_' + prevOfferId).append(prices);
        continue;
      }

      if (count === 1) {
        prices =
          '<div class="chat__item-price' +
          '"><div class="chat__item-price-period">' +
          stockPrice +
          '<span class="price-color-def">с </span>' +
          rest_begin +
          '<span class="price-color-def"> по </span>' +
          rest_end +
          '</div><div class="chat__item-price-numb"><span class="price-color-def">Стоимость: </span>' +
          price +
          ' руб.' +
          '</div >' +
          '</div >';
        commonCount++;
      } else {
        if (key <= 0) {
          var button =
            '<button type="button" class="btn btn-price" data-toggle="collapse" data-target=".prices_' +
            offId +
            '"></button>';

          prices =
            '<div class="chat__item-price' +
            '"><div class="chat__item-price-period">' +
            stockPrice +
            '<span class="price-color-def">с </span>' +
            rest_begin +
            '<span class="price-color-def"> по </span>' +
            rest_end +
            '</div><div class="chat__item-price-numb"><span class="price-color-def">Стоимость: </span>' +
            price +
            ' руб.' +
            '</div >' +
            '</div >' +
            button +
            '<div class="chat__item-price-wrapper prices_' +
            offId +
            ' collapse">';
        } else {
          var textWrapper =
            '<div class="chat__item-price' +
            '"><div class="chat__item-price-period">' +
            stockPrice +
            '<span class="price-color-def">с </span>' +
            rest_begin +
            '<span class="price-color-def"> по </span>' +
            rest_end +
            '</div><div class="chat__item-price-numb"><span class="price-color-def">Стоимость: </span>' +
            price +
            ' руб.' +
            '</div >' +
            '</div >';

          prices = prices + textWrapper;
          commonCount++;
        }
      }

      if (key == count - 1) {
        $('#prices_' + prevOfferId).append(prices);
      }
    }

    getTourists();

    $('#offer_mail' + Id).click(function(e) {
      e.preventDefault();
      // console.log(e);
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

    var htmlImages = '<div class="carousel-inner" id="carousel_' + offId + '">';

    for (var key in images) {
      var imageId = images[key]['id'];
      var name = images[key]['name'];
      var offerId = images[key]['offer_id'];
      var clearPath = images[key]['image'];
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
        '<a class="item fancybox ' +
        active +
        '" rel="fancybox' +
        offerId +
        '" href="' +
        IMAGE_URL +
        clearPath +
        '">' +
        '<img  src="' +
        IMAGE_URL +
        thumbnailPath +
        '" alt="' +
        name +
        '">' +
        '</a>';
    }

    htmlImages += '</div>';

    if (count > 1) {
      // '<a class="carousel-control-prev" href="#carousel_'+ offId +'" role="button" data-slide="prev">' +
      htmlImages +=
        '<a class="left carousel-control" href="#imageOfferId_' +
        offId +
        '" data-slide="prev"></a>' +
        '<a class="right carousel-control" href="#imageOfferId_' +
        offId +
        '" data-slide="next"></a>';
    }

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

      message = message == '' ? '' : message;

      all_msg =
        msg_count > 0
          ? '<span class="chat_mail_tender-new">' + msg_count + '</span>'
          : '';
      $('#offer_mail' + Id).prepend(all_msg);

      htmlTourists =
        '<div class="block-chats hidden ' +
        act +
        ' tourist_' +
        offer_id +
        '">' +
        '<a href="#" class="block-chats__link chat offer_chat' +
        Id +
        '" data-key="' +
        relation_id +
        '">' +
        '<div class="block-chats__info"><span>' +
        tourist_name +
        '</span><span class="block-chats__date">' +
        date_short(msg_date, msg_time) +
        '</span></div>' +
        '<div class="block-chats__user-text">' +
        message +
        '</div>' +
        '</a>' +
        '</div>';

      $div.append(htmlTourists);
    }

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
