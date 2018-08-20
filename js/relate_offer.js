// ***********************************************
// снипеты
// ***********************************************

function offers($div, action, relationId) {
  var offers;
  var images;

  function getOffers() {
    var objParams = {
      action: action,
      relationId: relationId
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
    var cnt_overdue = 0;
    var cnt_prices = 0;
    var dsp, btn;
    var favoriteColor;
    offers = data;

    // console.log(data);

    $('.offer').each(function() {
      $(this).remove();
    });

    if (offers === null) {
      return;
    }

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
      var favorite_id = offers[key]['favorite_id'];
      var priceType = offers[key]['price_type'];

      if (prevOfferId !== offId) {
        favoriteColor = favorite_id > 0 ? 'heart' : 'like';

        var placeAll;

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
          '<div id="offers" class="chat-toggle__item chat-toggle__item--offer active">' +
          '<div class="chat-toggle__button chat-toggle__button--offer">' +
          '<span>Предложение</span>' +
          '</div>' +
          '<div class="chat-toggle__item-inner ">' +
          '<div class="chat-toggle__line chat-toggle__line--flex">' +
          '<div class="carousel slide carousel-generic" data-ride="carousel" id="imageOfferId_' +
          offId +
          '">' +
          // здесь фотографии
          '</div>' +
          '<div class="chat-toggle__text">' +
          '<h2 class="chat-toggle__title">' +
          header +
          '</h2>' +
          '<div class="chat-toggle__address">' +
          placeAll +
          ', ' +
          name +
          '</div>' +
          '<div class="chat-toggle__people">Количество от ' +
          quantity_min +
          ' до ' +
          quantity_max +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="chat-toggle__line">' +
          '<div class="chat-toggle__user-text">' +
          description +
          '</div>' +
          '</div>' +
          '<div class="chat-toggle__line chat-toggle__line--offers  offers" id="prices_' +
          offId +
          '">' +
          priceTypeWrap +
          // здесь список цен
          '</div>' +
          '<div class="chat-toggle__info chat-toggle__line">' +
          '<div class="chat-toggle__info-name">Предложение</div>' +
          '<div class="chat-toggle__info-button"></div>' +
          '<div class="chat-toggle__info-number">' +
          offId +
          '</div>' +
          '</div>' +
          '</div> ';

        htmlOffer += '</div>';
        $div.append(htmlOffer);

        getImages(offId);

        if (prices !== '') {
          $('#prices_' + prevOfferId).append(prices);

          // if(commonCount > 0){
          //     // $("#prices_" + prevOfferId).find(".clsHide").hide();
          // }

          prices = '';
        }
        prevOfferId = offId;
        commonCount = 0;
      }

      // var mathrand = Math.floor(Math.random() * 2);

      var stockPrice = '';

      var mathrand = 0;

      if (mathrand === 1) {
        stockPrice = '<span class="offer-stock">-%</span>';
      }

      if (all_year == 1) {
        prices =
          '<div class="offers__item">Круглый год цена: ' +
          price +
          ' руб.</div>';
        commonCount++;
        $('#prices_' + prevOfferId).append(prices);
        return;
      }

      if (count === 1) {
        prices =
          '<div class="offers__item' +
          '">' +
          stockPrice +
          '<span class="offers__text-def">с </span>' +
          rest_begin +
          '<span class="offers__text-def"> по </span>' +
          rest_end +
          '<span class="offers__text-def offers__text-def--price">Стоимость: </span>' +
          price +
          ' руб.</p>' +
          '</div >';
        commonCount++;
      } else {
        if (key <= 0) {
          var button =
            '<button type="button" class="btn btn-price" data-toggle="collapse" data-target=".prices_' +
            offId +
            '"></button>';

          prices =
            '<div class="offers__item' +
            '">' +
            stockPrice +
            '<span class="offers__text-def">с </span>' +
            rest_begin +
            '<span class="offers__text-def"> по </span>' +
            rest_end +
            '<span class="offers__text-def offers__text-def--price">Стоимость: </span>' +
            price +
            ' руб.</p>' +
            '</div >' +
            button +
            '<div class="offers__wrapper prices_' +
            offId +
            ' collapse">';
        } else {
          var textWrapper =
            '<div class="offers__item' +
            '">' +
            stockPrice +
            '<span class="offers__text-def">с </span>' +
            rest_begin +
            '<span class="offers__text-def"> по </span>' +
            rest_end +
            '<span class="offers__text-def offers__text-def--price">Стоимость: </span>' +
            price +
            ' руб.</p>' +
            '</div >';

          prices = prices + textWrapper;
          commonCount++;
        }
      }

      if (key == count - 1) {
        $('#prices_' + prevOfferId).append(prices);
      }
    }
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
        clearPath +
        '">' +
        '<img  src="' +
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

  getOffers();
}
