var offers;
var prices;
var images;

var Id = 0;
var published = 0;
var key_prev = -1;
var itemPrice = 0;

var newsletterTextFalse =
  'Если вы больше не хотите получать оповещения о новых заявках/ответах, отключите.';
var newsletterTextTrue = 'Cообщать о новых ответах и тендерах на почту.';

$(document).ready(function () {
  // Datepicker($('.datepicker'));

  $.datetimepicker.setLocale('ru');

  $('#inpRestBegin').datetimepicker({
    timepicker: false,
    format: 'j M y',
    formatDate: 'j M y',
    minDate: 0,
    scrollInput: false,
    onShow: function (ct) {
      this.setOptions({
        maxDate: $('#inpRestEnd').val() ? $('#inpRestEnd').val() : false
      });
    }
  });
  $('#inpRestEnd').datetimepicker({
    timepicker: false,
    format: 'j M y',
    formatDate: 'j M y',
    minDate: 0,
    scrollInput: false,
    onShow: function (ct) {
      this.setOptions({
        minDate: $('#inpRestBegin').val() ? $('#inpRestBegin').val() : 0
      });
    }
  });

  $('#inpFilterBegin').datetimepicker({
    timepicker: false,
    format: 'j M y',
    formatDate: 'j M y',
    minDate: 0,
    scrollInput: false,
    onShow: function (ct) {
      this.setOptions({
        maxDate: $('#inpFilterEnd').val() ? $('#inpFilterEnd').val() : false
      });
    }
  });
  $('#inpFilterEnd').datetimepicker({
    timepicker: false,
    format: 'j M y',
    formatDate: 'j M y',
    minDate: 0,
    scrollInput: false,
    onShow: function (ct) {
      this.setOptions({
        minDate: $('#inpFilterBegin').val() ? $('#inpFilterBegin').val() : 0
      });
    }
  });

  $('#btnAdd').click(function (e) {
    e.preventDefault();
    addOffer();
  });

  $('#btnCancel').click(function (e) {
    e.preventDefault();
    Clear();
  });
  $('#btnPlus').click(function (e) {
    e.preventDefault();

    var dateIn = $('#inpRestBegin');
    var dateOut = $('#inpRestEnd');
    var price = $('#inpPrice');
    var dateInValue = dateIn.val();
    var dateOutValue = dateOut.val();
    var priceValue = price.val();
    var dataNew = Number($(this).attr('data-counter-id'));

    var lengthItem = $('.offer-completed__item').length;

    if (lengthItem > 10) {
      msgAlert(
        'Уже добавлено 10 ценовых диапазонов. Прежде чем добавить новое предложение, удалите одно из уже добавленных ',
        'danger'
      );
      return;
    }

    if (priceValue > 0 && dateInValue && dateOutValue) {
      // if (calToPhp(dateOutValue) < calToPhp(dateInValue)) {
      //     msgAlert('Не верно указаны даты отдыха.', 'danger');
      //     return;
      // }

      if (crossPeriods()) {
        msgAlert('Периоды не должны пересекаться.', 'danger');
        return;
      }

      $('.date .error').hide();

      addPrice(0, dataNew, dateInValue, dateOutValue, priceValue);
      dataNew++;
      $(this).attr('data-counter-id', dataNew);

      dateIn.val('');
      dateOut.val('');
      price.val('');

      saveOfferDraft();
    } else {
      $('.date .error').hide();
      var inputCounter = $('.date input');

      for (var i = 0; i < inputCounter.length; i++) {
        if (inputCounter[i].value <= 0) {
          $('+ .error', inputCounter[i]).show();
        }
      }
    }
  });

  $('.add-foto').click(function (e) {
    e.preventDefault();
    addImage();

    console.log('Проверили клик');
  });

  $('.edit-field').change(function () {
    // console.log("change");
    saveOfferDraft();
    // if( ! crossPeriods() ) {
    //
    // } else {
    //
    //     // msgAlert('Даты должны быть заполнены. Периоды не должны пересекаться.', 'danger');
    // }
  });

  $('#btnFilter').click(function () {
    filterRq();
  });

  checkBoxEvents();
  // commonPriceEvents();
  getOffers();
  // getRequisitions();

  $(document).ajaxComplete(function (event, request, settings) {
    console.log(event, request, settings);
    if (settings.formData) {
      if (Id <= 0) {
        var str = request.responseText;
        // console.log(str.substring(str.indexOf("}")+3).replace(/"/g, ""));
        Id = str.substring(str.indexOf('}') + 3).replace(/"/g, '');
      }

      getOfferImages();
      return;
    }

    if (settings.data.indexOf('save_offer_draft') >= 0) {
      save_id(request.responseJSON);
      getOffers();
    }
    if (settings.data.indexOf('add_offer') >= 0) {
      offer_result(request.responseJSON);
    }
    if (settings.data.indexOf('offer_list_full') >= 0) {
      showOffers(request.responseJSON);
    }
    if (settings.data.indexOf('offer_price_list') >= 0) {
      showOffersPrice(request.responseJSON);
    }
    if (settings.data.indexOf('offer_images') >= 0) {
      showOfferImages(request.responseJSON);
    }
    // if(settings.data.indexOf('get_requisitions') >= 0 ) {
    //     showRequisitions(request.responseJSON);
    // }

    if (settings.data.indexOf('offer_delete') >= 0) {
      getOffers();
    }
  });

  inputsearch($('#inpPlaceIn'), CTRL_URL, 'city_search');
  inputsearch($('#inpPlaceOut'), CTRL_URL, 'city_search');
  inputsearch($('#inpFilterPlace'), CTRL_URL, 'city_search');

  filterRq();
});

$('#tab_1').click(function (e) {
  e.preventDefault();
  $(this).addClass('active');
  $('#tab_2').removeClass('active');

  $('#divCreateOffer').removeClass('hidden-xs');
  $('#all_offers').addClass('hidden-xs');
});

$('#tab_2').click(function (e) {
  e.preventDefault();
  $(this).addClass('active');
  $('#tab_1').removeClass('active');

  $('#divCreateOffer').addClass('hidden-xs');
  $('#all_offers').removeClass('hidden-xs');
});

function filterRq() {
  var place = $('#inpFilterPlace').val();
  var place_id = $('#inpFilterPlace').data('placeId');
  var place_name = $('#inpFilterPlace').data('placeName');
  var d1 = $('#inpFilterBegin').val();
  var d2 = $('#inpFilterEnd').val();

  d1 = d1 === '' ? '1900-01-01' : calToPhp(d1);
  d2 = d2 === '' ? '1900-01-01' : calToPhp(d2);

  if (place === '') {
    place_id = 0;
    $('#inpFilterPlace').data('placeId', 0);
    $('#inpFilterPlace').data('placeName', '');
  }

  $('#inpFilterPlace').val($('#inpFilterPlace').data('placeName'));

  getRequisitions('get_requisitions', place_id, d1, d2);
}

function checkBoxEvents() {
  $('#inpAllYear').click(function () {
    if ($(this).prop('checked')) {
      // $("input#inpRestBegin").prop('disabled', true);
      // $("input#inpRestEnd").prop('disabled', true);
      // $("input#inpPrice").prop('disabled', true);
      // $("#inpPriceAllYear").css('display', '');
      // $("#inpPriceAllYear").val('');
      // $("#btnPlus").css('display', 'none');

      $('.inpCommonPrice').prop('checked', false);

      $('.offer-completed').hide();
      $('.date').hide();
      $('.string-5').hide();

      return;
    }

    $('.offer-completed').show();
    $('.date').show();
    $('.string-5').show();

    // $("input#inpRestBegin").prop('disabled', false);
    // $("input#inpRestEnd").prop('disabled', false);
    // $("input#inpPrice").prop('disabled', false);
    // $("#inpPriceAllYear").css('display', 'none');
    // $("#btnPlus").css('display', '');
    // // priceDelete($(".priceAllYear").data("price-id"));
    // $(".priceAllYear").data("price-id",0);
    // $("input#inpCommonPrice").prop('disabled', false);
  });
}

// function commonPriceEvents() {
//     $("input.inpCommonPrice").click(function () {
//         if ($(this).prop("checked")) {
//             $("input.inpCommonPrice").prop('checked', false);
//             $(this).prop("checked", true);
//         }
//     });
// }

function addImage() {
  // if(Id <= 0) {
  //     createOffer();
  // }

  $('#fileupload').fileupload({
    formData: { OfferId: Id },
    add: function (e, data) {
      var count = data.files.length;
      var i;
      for (i = 0; i < count; i++) {
        // data.files[i].uploadName = Id + '_' + data.files[i].name;
        if (data.files[i].size > 1440000) {
          msgAlert('Слишком  большой размер фотографии.', 'danger');
          return;
        }
      }
      data.submit();
    }
  });

  $('#fileupload').click();
}

function addPrice(PriceId, CounterId, dateIn, dateOut, pricePeriod) {
  var htmlPrice =
    '<div class="offer-completed__item" data-price-id="' +
    PriceId +
    '">' +
    '<label for="top-price-' +
    CounterId +
    '" class="offer-completed__label-wrapper">' +
    '<div class="offer-completed__radio">' +
    '<input id="top-price-' +
    CounterId +
    '" type="radio" name="offer-completed__top-price" class="offer-completed__input inpCommonPrice">' +
    '<span class="offer-completed__radio-block"></span>' +
    '</div>' +
    '<div class="offer-completed__date">' +
    '<span class="offer-completed__text">с </span>' +
    '<span class="offer-completed__date-number offer-completed__date-number--in">' +
    dateIn +
    '</span>' +
    '<span class="offer-completed__text"> по </span>' +
    '<span class="offer-completed__date-number offer-completed__date-number--out">' +
    dateOut +
    '</span>' +
    '</div>' +
    '<label for="stock_price-' +
    CounterId +
    '" class="offer-completed__price-stock">' +
    '<input type="checkbox" class="offer-completed__price-input" name="stock_price" id="stock_price-' +
    CounterId +
    '">' +
    '<span class="offer-completed__price-stock-text">-%</span>' +
    '</label >' +
    '<div class="offer-completed__price">' +
    '<span class="offer-completed__text">Цена: </span>' +
    '<span class="offer-completed__price-number">' +
    pricePeriod +
    '</span>' +
    '<span class="offer-completed__price-text"> руб.</span>' +
    '</div>' +
    '</label>' +
    '<button type="button" class="btnMinus offer-completed__remove remove-offer">close</button>' +
    '</div>';
  $('.offer-completed').append(htmlPrice);

  $('.btnMinus').click(function (e) {
    e.preventDefault();
    var $curr = $(this).parent();
    // var PriceId = $curr.data("price-id");
    $curr.remove();
    saveOfferDraft(); // priceDelete(PriceId);
  });

  // $(".edit-field").change(function () {
  //     console.log('two change');
  //     saveOfferDraft();
  //     // if( ! crossPeriods() ) {
  //     //     saveOfferDraft();
  //     // } else {
  //     //     msgAlert('Даты должны быть заполнены. Периоды не должны пересекаться.', 'danger');
  //     // }
  // });

  // commonPriceEvents();
  // Datepicker($('.datepicker'));
}

function crossPeriods() {
  // поиск пересечения периодов или пустых дат
  var i;
  var res = false;
  var count = $('.offer-completed__item').length;

  // if ($("#inpAllYear").prop("checked")) {
  //     return res;
  // }

  $('.offer-completed__item').each(function (index) {
    var beg1 = calToPhp($('#inpRestBegin').val());
    var end1 = calToPhp($('#inpRestEnd').val());

    if (beg1 === '' || end1 === '') {
      res = true;
      return false;
    }

    for (i = index; i < count; i++) {
      var beg2 = calToPhp(
        $('.offer-completed__item')
          .eq(i)
          .find('.offer-completed__date-number--in')
          .text()
      );
      var end2 = calToPhp(
        $('.offer-completed__item')
          .eq(i)
          .find('.offer-completed__date-number--out')
          .text()
      );

      if ((beg1 < beg2 && beg2 < end1) || (beg1 < end2 && end2 < end1)) {
        res = true;
        return false;
      }
    }
  });

  return res;
}

function htmlImage(imId, imPath, avatar) {
  var cssSelected = 'style="background-color: green"';
  var imSelected = imId == avatar ? cssSelected : '';

  var htmlImage =
    '<div class="wrapper-foto image">' +
    '<img alt="" src="' +
    imPath +
    '"/>' +
    '<a href="#" class="galleryImage" data-image-id="' +
    imId +
    '"><div class="user" ' +
    imSelected +
    '></div></a>' +
    '<a href="#" class="galleryImageDelete" data-image-id="' +
    imId +
    '"><div class="cart"></div></a>' +
    '</div>';

  $('#image-end').before(htmlImage);

  $('.galleryImage').click(function (e) {
    e.preventDefault();
    setAvatar($(this).data('image-id'));
    $('.galleryImage')
      .children()
      .css('background-color', '');
    $(this)
      .children()
      .css('background-color', 'green');
  });
}

function setAvatar(imageId) {
  var objParams = {
    action: 'offer_set_avatar',
    offerId: Id,
    imageId: imageId
  };
  sendData(objParams);
}

// function priceDelete(PriceId) {
//     var objParams = {
//         'action' : 'offer_price_delete',
//         'PriceId' : PriceId
//     };
//     sendData(objParams);
// }

function imageDelete($curr) {
  var ImageId = $curr.data('image-id');

  var objParams = {
    action: 'offer_image_delete',
    ImageId: ImageId
  };
  sendData(objParams);

  $curr.parent().remove();
}

function saveOfferDraft() {
  if (published == 1) {
    return;
  }

  var PlaceId, inpPlace;

  if ($('#inpPlaceIn').val()) {
    PlaceId = $('#inpPlaceIn').data('placeId');
    PlaceName = $('#inpPlaceIn').data('placeName');
    $('#inpPlaceIn').val(PlaceName);
    inpPlace = $('#inpPlaceIn').val();
  } else {
    PlaceId = '0';
    inpPlace = '';
  }

  var PlaceOutId = $('#inpPlaceOut').data('placeId');
  var PlaceOutName = $('#inpPlaceOut').data('placeName');
  $('#inpPlaceOut').val(PlaceOutName);
  var inpPlaceOut = $('#inpPlaceOut').val();

  var inpHeader = $('#inpHeader').val();

  // var inpRestBegin = $('#inpRestBegin').val();
  // var inpRestEnd = $('#inpRestEnd').val();

  var inpDescription = $('#inpDescription').val();
  var inpQuantityMin = $('#inpQuantityMin').val();
  var inpQuantityMax = $('#inpQuantityMax').val();

  var textLink = $('#account-links__text').val();
  var linkLink = $('#account-links__link').val();

  var priceType = $('.type-price__input:checked').attr('data-price-type');

  var objParams = {
    action: 'save_offer_draft',
    published: 0,
    Id: Id,
    Header: inpHeader,
    Place: inpPlace,
    PlaceId: PlaceId,
    PlaceOutId: PlaceOutId,
    PlaceOut: inpPlaceOut,
    QuantityMin: inpQuantityMin,
    QuantityMax: inpQuantityMax,
    LinkText: textLink,
    Link: linkLink,
    RestBegin: calToPhp(inpRestBegin),
    RestEnd: calToPhp(inpRestEnd),
    Description: inpDescription,
    PriceType: priceType,
    prices: getPrices()
  };
  console.log(objParams);
  sendData(objParams);
}

function addOffer() {
  if ($('#inpPlaceIn').val()) {
    PlaceId = $('#inpPlaceIn').data('placeId');
    PlaceName = $('#inpPlaceIn').data('placeName');
    $('#inpPlaceIn').val(PlaceName);
    inpPlace = $('#inpPlaceIn').val();
  } else {
    PlaceId = '0';
    inpPlace = '';
  }

  var PlaceOutId = $('#inpPlaceOut').data('placeId');
  var PlaceOutName = $('#inpPlaceOut').data('placeName');
  $('#inpPlaceOut').val(PlaceOutName);
  var inpPlaceOut = $('#inpPlaceOut').val();

  var inpHeader = $('#inpHeader').val();

  var textLink = $('#account-links__text').val();
  var linkLink = $('#account-links__link').val();

  var inpDescription = $('#inpDescription').val();
  var inpQuantityMin = $('#inpQuantityMin').val();
  var inpQuantityMax = $('#inpQuantityMax').val();

  var inpPrice = $('#inpPrice').val();

  var dataPreiod = $('.offer-completed__item').length;

  var priceType = $('.type-price__input:checked').attr('data-price-type');

  if (inpHeader == '') {
    msgAlert('Не указан заголовок заявки.', 'danger');
    return;
  }

  if (PlaceOutId == 0) {
    msgAlert('Не выбрано место назначения.', 'danger');
    return;
  }

  if (inpQuantityMin == '') {
    msgAlert('Не указано минимальное количество человек.', 'danger');
    return;
  }

  if (inpQuantityMax == '') {
    msgAlert('Не указано максимальное количество человек.', 'danger');
    return;
  }
  // if (!$("#inpAllYear").prop("checked")) {
  //     if (inpRestBegin == '') {
  //         msgAlert('Не указана дата начала отдыха.', 'danger');
  //         return;
  //     }
  // }

  if (!$('#inpAllYear').prop('checked') && dataPreiod < 1) {
    msgAlert(
      'Укажите цену за круглый год или заполните хотя-бы одно ценовое предложение, нажав на плюсик',
      'danger'
    );
    return;
  }

  if ($('#inpAllYear').prop('checked') && $('#inpPriceAllYear').val() <= 0) {
    msgAlert('Не указана стоимость за круглый год', 'danger');
    return;
  }

  // конкретно этот блок теперь не сработает, т.к. crossperiods работает теперь по другому
  // if (!$("#inpAllYear").prop("checked") && crossPeriods()) {
  //     msgAlert('Даты должны быть заполнены. Периоды не должны пересекаться.', 'danger');
  //     return;
  // }

  // if( inpRestEnd == '' ) {
  //     msgAlert('Не указана дата окончания отдыха.', 'danger');
  //     return;
  // }
  // if( inpOfferEnd == '' ) {
  //     msgAlert('Не указана дата окончания предложения.', 'danger');
  //     return;
  // }

  var objParams = {
    action: 'add_offer',
    published: 1,
    Id: Id,
    Header: inpHeader,
    PlaceId: PlaceId,
    Place: inpPlace,
    PlaceOutId: PlaceOutId,
    PlaceOut: inpPlaceOut,
    QuantityMin: inpQuantityMin,
    QuantityMax: inpQuantityMax,
    RestBegin: calToPhp(inpRestBegin),
    RestEnd: calToPhp(inpRestEnd),
    LinkText: textLink,
    Link: linkLink,
    //        'OfferEnd' : inpOfferEnd,
    //        'Price' : inpPrice,
    Description: inpDescription,
    PriceType: priceType,
    prices: getPrices()
  };

  // console.log(objParams);

  sendData(objParams);
}

function getPrices() {
  var prices = [];

  $('.offer-completed__item').each(function (index) {
    var PriceId = $(this).data('price-id');
    var RestPrice = $(this)
      .find('.offer-completed__price-number')
      .text();
    var RestBegin = $(this)
      .find('.offer-completed__date-number--in')
      .text();
    var RestEnd = $(this)
      .find('.offer-completed__date-number--out')
      .text();
    var CommonPrice = $(this)
      .find('.inpCommonPrice')
      .prop('checked')
      ? 1
      : 0;

    prices.push({
      PriceId: PriceId,
      AllYear: 0,
      RestPrice: RestPrice,
      RestBegin: calToPhp(RestBegin),
      RestEnd: calToPhp(RestEnd),
      CommonPrice: CommonPrice
    });
  });

  if ($('#inpAllYear').prop('checked')) {
    prices.push({
      PriceId: $('.priceAllYear').data('price-id'),
      AllYear: 1,
      RestPrice: $('#inpPriceAllYear').val(),
      RestBegin: '',
      RestEnd: '',
      CommonPrice: 1
    });
  }

  return prices;
}

function msgAlert(text, type) {
  alert(text);

  // $("#msg").html(text);
  //
  // switch (type) {
  //     case 'danger' :
  //         $("#msg").attr( "class", "alert alert-danger" );
  //         break;
  //     case 'success' :
  //         $("#msg").attr( "class", "alert alert-success" );
  //         break;
  // }
  // $("#msg").show().fadeOut( 20000 );
}

function save_id(data) {
  if (Id <= 0) {
    if (data !== null) {
      Id = data[0][0];
    }
  }
}

function offer_result(data) {
  if (data !== null) {
    if (data[0][0] > 0) {
      key_prev = -1;
      Id = 0;
      msgAlert(
        'Ваше предложение успешно сохранено. Туристы уже его видят. Вы можете прикрепить его к заявкам туристов.',
        'success'
      );
      // $("#frmOffer")[0].reset();
      // $("#divCreateOffer").attr( "class", "alert alert-primary" );
      // $("#txtCaption").html( "<b>Сформировать предложение</b>" );
      Clear();
      getOffers();
      return;
    }
  }

  msgAlert('Предложение не сохранено. Повторите попытку позже.', 'danger');
}

function getOffers() {
  var objParams = {
    action: 'offer_list_full'
  };

  sendData(objParams);
}

function getOffersPrice() {
  var objParams = {
    action: 'offer_price_list',
    offerId: Id
  };
  sendData(objParams);
}

function getOfferImages() {
  var objParams = {
    action: 'offer_images',
    offerId: Id
  };
  sendData(objParams);
}

function OfferPublish(id, publish) {
  var objParams = {
    action: 'offer_publish',
    offerId: id,
    publish: publish
  };
  sendData(objParams);
}

function showOffers(data) {
  // console.log(data);
  var messageNull =
    '<div class="messageNull">У Вас еще нет созданных предложений, но Вы можете выбрать заявки от туристов</div>';
  var offer_list = '';
  var cls_active;
  var id_prev = 0;
  var prices = '';
  var count = 0;
  var notify_tenders;

  offers = data;
  if (!offers) {
    $('#offer_list').html(messageNull);
    return;
  }

  for (var i in offers) {
    count++;
  }
  count = (count - 1).toString();

  console.log(offers);

  $('#offer_list').html('');

  for (var key in offers) {
    var id = offers[key]['id'];
    var header = offers[key]['header'];
    var published = offers[key]['published'];
    var cnt_tenders = offers[key]['cnt_tenders'];
    var place = offers[key]['place'];
    var place_out = offers[key]['place_out'];
    var quantity_min = offers[key]['quantity_min'];
    var quantity_max = offers[key]['quantity_max'];
    var description = offers[key]['description'];
    var is_common = offers[key]['is_common'];
    var all_year = offers[key]['all_year'];
    var rest_begin = phpToCal(offers[key]['rest_begin']);
    var rest_end = phpToCal(offers[key]['rest_end']);
    var price = offers[key]['price'];
    var link = offers[key]['link'];
    var linktext = offers[key]['link_text'];
    var priceType = offers[key]['price_type'];
    var publishDate = offers[key]['published_date'];

    if (id_prev !== id) {
      var placeAll;

      if (place) {
        placeAll = 'Из ' + place + ' в ' + place_out;
      } else {
        placeAll = 'В ' + place_out;
      }

      var priceTypeWrap = '';

      switch (priceType) {
        case 'stock':
          priceTypeWrap = '<span class="price-type">Стоимость за тур:</span>';
          break;
        case 'period':
          priceTypeWrap =
            '<span class="price-type">Стоимость за период:</span>';
          break;
        case 'day':
          priceTypeWrap =
            '<span class="price-type">Стоимость за номер в сутки:</span>';
          break;
        case 'man':
          priceTypeWrap =
            '<span class="price-type">Стоимость за человека:</span>';
          break;
        default:
          break;
      }

      var linksWrapper = '';

      if (link) {
        if (linktext) {
          linksWrapper =
            '<a href="' +
            link +
            '" target="_blank" class="link-snippets">' +
            linktext +
            '</a>';
        } else {
          linksWrapper =
            '<a href="' +
            link +
            '" target="_blank" class="link-snippets">' +
            link +
            '</a>';
        }
      }

      var cls_active = '';
      var titlePaused = 'Снять с публикации';

      if (published == 0) {
        if (publishDate == null) {
          cls_active = 'no-active';
          titlePaused = 'Данное предложение не может быть опубликовано';
        } else {
          cls_active = 'not-published';
          titlePaused = 'Опубликовать предложение';
        }
      }

      notify_tenders =
        cnt_tenders > 0
          ? ' <a href="hotel/chats/" class="notify_chat">' +
          cnt_tenders +
          '</a>'
          : '';

      // var monetization =
      //   '<button class="up-btn" type="button">Поднять в топ</button>' +
      //   '<div class="up-popover">' +
      //   '<h4 class="up-popover__title up-popover__title--large">Поднять в топ-15</h4>' +
      //   '<div class="up-popover__body">' +
      //   '<a href="#" class="up-popover__link">' +
      //   '<span class="up-popover__time">На сутки</span>' +
      //   '<span class="up-popover__price">50 руб.</span>' +
      //   '</a>' +
      //   '<a href="#" class="up-popover__link">' +
      //   '<span class="up-popover__time">На неделю</span>' +
      //   '<span class="up-popover__price">320 руб.</span>' +
      //   '</a>' +
      //   '<a href="#" class="up-popover__link">' +
      //   '<span class="up-popover__time">На 28 дней</span>' +
      //   '<span class="up-popover__price">1280 руб.</span>' +
      //   '</a>' +
      //   '<input class="up-popover__agreement" type="checkbox" id="is-agreement-' +
      //   key +
      //   '" checked>' +
      //   '<label class="up-popover__agreement-text" for="is-agreement-' +
      //   key +
      //   '">Я ознакомлен с <a href="http://8h.grandpablo.ru/info/publichnaya-oferta-o-zaklyuchenii-agentskih-dogovorov" target="_blank">публичной офертой</a> и согласен с <a href="http://8h.grandpablo.ru/info/polzovatelskoe-soglashenie" target="_blank">условиями использования сайта</a></label>' +
      //   '</div>' +
      //   '</div>';

      var slicedDescription = description.slice(0, 120);

      if (slicedDescription.length < description.length) {
        slicedDescription += '...';
      }

      offer_list =
        '<div class="panel panel-default  ' +
        cls_active +
        '" >' +
        '<div class="panel-heading">' +
        '<div class="panel-title">' +
        notify_tenders +
        '<a class="panel-toggle collapsed" data-toggle="collapse" data-parent="#offer_list" href="#divOffer_' +
        key +
        '">' +
        '<h4>' +
        header +
        '</h4><p>' +
        id +
        '</p>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '<div id="divOffer_' +
        key +
        '" class="panel-collapse collapse">' +
        '<div class="panel-body">' +
        '<div class="col">' +
        '<p class="map">' +
        placeAll +
        '</p>' +
        '<p class="quantity">Количество от ' +
        quantity_min +
        ' до ' +
        quantity_max +
        '</p>' +
        '</div>' +
        '<div class="col">' +
        '<p>' +
        slicedDescription +
        '</p>' +
        '</div>' +
        priceTypeWrap +
        '<div class="col col-4" id="prices' +
        id +
        '">' +
        // цены
        '</div>' +
        linksWrapper +
        '<div class="col col-button">' +
        '<a class="edit" id="btnOffer_' +
        key +
        '" data-key ="' +
        key +
        '" href="#" title="Редактировать">Редактировать</a>' +
        '<a class="pauseOffer" id="btnOfferPause_' +
        key +
        '" data-key ="' +
        key +
        '" href="#" title="' +
        titlePaused +
        '">' +
        titlePaused +
        '</a>' +
        '<a class="delete" id="btnOfferDelete_' +
        key +
        '" data-key ="' +
        key +
        '" href="#" title="Удалить">Удалить</a>' +
        '<a class="offer-link" href="https://t-dev.8h.ru/offer/' +
        id +
        '" title="Посмотреть предложение со стороны туриста" target="_blank">Подробнее</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        // monetization +
        '</div>';

      $('#offer_list').append(offer_list);

      $('#prices' + id_prev).html(prices);
      prices = '';
      id_prev = id;
      // если не установлена основная цена, то ставим первую
      if (is_common <= 0 && all_year <= 0) {
        is_common = 1;
      }
    }

    if (is_common <= 0) {
      dsp = 'class="prices_' + id + ' collapse"';
      btn = '';
    } else {
      dsp = '';
      btn =
        '<button type="button" class="btn btn-price" data-toggle="collapse" data-target=".prices_' +
        id +
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
    }

    if (count === key) {
      // console.log(prices);
      $('#prices' + id).html(prices);
      prices = '';
    }
  }

  $('a[id ^= "btnOffer_"]').click(function (e) {
    e.preventDefault();
    offerEdit($(this).data('key'));
  });
  $('a[id ^= "btnOfferPause_"]').click(function (e) {
    e.preventDefault();

    var panelParent = $(this).parents('.panel');

    if (!panelParent.hasClass('no-active')) {
      if (panelParent.hasClass('not-published')) {
        OfferPublish(offers[$(this).data('key')]['id'], 1);

        $(this)
          .text('Снять с публикации')
          .attr('title', 'Снять с публикации');

        panelParent.removeClass('not-published');
        msgAlert(
          'Ваше предложение снова опубликовано. Туристы уже его видят. Вы можете прикрепить его к заявкам туристов.',
          'success'
        );
      } else {
        OfferPublish(offers[$(this).data('key')]['id'], 0);

        $(this)
          .text('Опубликовать предложение')
          .attr('title', 'Опубликовать предложение');
        panelParent.addClass('not-published');
        msgAlert(
          'Данное предложение снято с публикации. Туристы его не видят.',
          'danger'
        );
      }
    } else {
      msgAlert(
        'Данное предложение не может быть опубликовано. Отредактируйте предложение, заполните обязательные поля и опубликуйте.',
        'danger'
      );
    }
    // offerEdit($(this).data('key'));
  });
  $('a[id ^= "btnOfferDelete_"]').click(function (e) {
    e.preventDefault();
    offerDelete($(this).data('key'));
  });
  $('.badge').click(function (e) {
    e.preventDefault();
    offerRelate($(this).data('offerId'));
  });

  $('.up-btn:not(.up-btn--no-active)').click(function (e) {
    if (!$(this).hasClass('up-btn--active')) {
      $('.up-btn').removeClass('up-btn--active');
      $(this).addClass('up-btn--active');
      $('.up-popover').fadeOut();
      $('+  .up-popover', this)
        .stop()
        .fadeIn();
    } else {
      $(this).removeClass('up-btn--active');
      $('+  .up-popover', this)
        .stop()
        .fadeOut();
    }
  });

  $(document).mouseup(function (e) {
    // событие клика по веб-документу
    var div = $('#offer_list .panel'); // тут указываем элемента
    if (
      !div.is(e.target) &&
      div.has(e.target).length === 0 &&
      $('.up-popover').is(':visible')
    ) {
      // и не по его дочерним элементам
      $('.up-popover')
        .stop()
        .fadeOut();
      $('.up-btn.up-btn--active').removeClass('up-btn--active');
    }
  });

  $('.up-popover__link').click(function (e) {
    e.preventDefault();
    var agreed = $(this)
      .parent()
      .find('.up-popover__agreement')
      .prop('checked');

    if (agreed) {
      msgAlert('Тут как бы произошел переход на сайт с банком.', 'success');
    } else {
      msgAlert(
        'Для продвижения вы должны быть согласны с условиями пользования.',
        'danger'
      );
      return;
    }
  });

  if (mailing) {
    var newsletter =
      '<div class="newsletter">' +
      '<label class="newsletter__label" for="newsletter_checkbox">' +
      '<input id="newsletter_checkbox" type="checkbox" class="newsletter__input" checked>' +
      '<span class="newsletter__text">' +
      newsletterTextFalse +
      '</span>' +
      '</label>' +
      '</div>';
  } else {
    var newsletter =
      '<div class="newsletter">' +
      '<label class="newsletter__label" for="newsletter_checkbox">' +
      '<input id="newsletter_checkbox" type="checkbox" class="newsletter__input">' +
      '<span class="newsletter__text">' +
      newsletterTextTrue +
      '</span>' +
      '</label>' +
      '</div>';
  }

  $('#offer_list').append(newsletter);

  $('#newsletter_checkbox').change(function () {
    if ($(this).prop('checked')) {
      $('.newsletter__text').text(newsletterTextFalse);
      NewsletterToggle(1);
    } else {
      $('.newsletter__text').text(newsletterTextTrue);
      NewsletterToggle(0);
    }
  });
}

function showOffersPrice(data) {
  prices = data;

  if (prices === null) {
    return;
  }
  var priceAllYear = false;
  var $curr = $('.offer-completed__item');

  var i = 0;

  for (var key in prices) {
    var PriceId = prices[key]['PriceId'];
    var all_year = prices[key]['all_year'];
    var rest_begin = phpToCal(prices[key]['rest_begin']);
    var rest_end = phpToCal(prices[key]['rest_end']);
    var price = prices[key]['price'];
    var is_common = prices[key]['is_common'];

    if (all_year == 1) {
      priceAllYear = true;
      $('.priceAllYear').data('price-id', PriceId);
      $('#inpPriceAllYear').val(price);
      continue;
    }

    addPrice(PriceId, PriceId, rest_begin, rest_end, price);

    $curr = $('[data-price-id = "' + PriceId + '"]');

    if (is_common == 1) {
      $curr.find('.inpCommonPrice').prop('checked', true);
    }

    // if (i === 0) {
    //     $curr = $curr.next(); // чтобы перескачить подсказку
    // }

    i++;
  }

  if (priceAllYear) {
    // $("input#inpRestBegin").prop('disabled', true);
    // $("input#inpRestEnd").prop('disabled', true);
    // $("input#inpPrice").prop('disabled', true);
    // $("#inpPriceAllYear").css('display', '');
    // $("#btnPlus").css('display', 'none');
    $('.offer-completed').hide();
    $('.date').hide();
    $('.string-5').hide();
    $('#inpAllYear').prop('checked', true);
  }
}

function showOfferImages(data) {
  images = data;

  if (images === null) {
    return;
  }

  $('.image').each(function () {
    $(this).remove();
  });

  for (var key in images) {
    var imageId = images[key]['id'];
    var imagePath = images[key]['image'];
    var thumbnailPath = images[key]['thumbnail'];
    var avatar = images[key]['avatar'];
    htmlImage(imageId, thumbnailPath, avatar);
  }

  $('.galleryImageDelete').click(function (e) {
    e.preventDefault();
    imageDelete($(this));
  });
}

function offerEdit(offer_key) {
  Clear();

  // if(key_prev >= 0){
  //     $("#divOffer_"+key_prev).attr( "class", "list-group-item " );
  // }
  key_prev = offer_key;

  Id = offers[offer_key]['id'];
  published = offers[offer_key]['published'];
  $('#inpHeader').val(offers[offer_key]['header']);

  $('#inpPlaceIn').val(offers[offer_key]['place']);
  $('#inpPlaceIn').data('placeName', offers[offer_key]['place']);
  $('#inpPlaceIn').data('placeId', offers[offer_key]['place_id']);

  $('#inpPlaceOut').val(offers[offer_key]['place_out']);
  $('#inpPlaceOut').data('placeName', offers[offer_key]['place_out']);
  $('#inpPlaceOut').data('placeId', offers[offer_key]['place_out_id']);

  $('#inpQuantityMin').val(offers[offer_key]['quantity_min']);
  $('#inpQuantityMax').val(offers[offer_key]['quantity_max']);
  $('#inpDescription').val(offers[offer_key]['description']);

  var priceType = '[data-price-type="' + offers[offer_key]['price_type'] + '"]';

  // console.log(priceType);

  $(priceType).prop('checked', true);

  $('#account-links__text').val(offers[offer_key]['link_text']);
  $('#account-links__link').val(offers[offer_key]['link']);

  // $("#divOffer_"+offer_key).attr( "class", "list-group-item  list-group-item-warning" );
  $('#divCreateOffer').css('background-color', '#fff3cd');
  $('#txtCaption').html('<b>Редактировать предложение</b>');

  $('#bgDraft').css('display', '');
  if (published == 1) {
    $('#btnAdd').html('Сохранить изменения');
    $('#bgDraft').html('Опубликовано');
  } else {
    $('#bgDraft').html('Черновик');
  }

  getOffersPrice();
  getOfferImages();

  $('#divCreateOffer').removeClass('hidden-xs');
  $('#all_offers').addClass('hidden-xs');
  $('#tab_1').addClass('active');
  $('#tab_2').removeClass('active');
}

function Clear() {
  // очистка формы
  Id = 0;
  published = 0;
  // $("#divOffer_"+key_prev).attr( "class", "list-group-item " );
  $('#frmOffer')[0].reset();
  $('#divCreateOffer').css('background-color', '');
  $('#txtCaption').html('<b>Сформировать предложение</b>');
  key_prev = -1;

  $('.offer-completed__item').remove();

  $('.image').each(function () {
    $(this).remove();
  });

  $('#inpPlaceIn').data('placeId', '0');
  $('#inpPlaceIn').data('placeName', '');

  $('#inpPlaceOut').data('placeId', '0');
  $('#inpPlaceOut').data('placeName', '');

  $('[data-price-type="man"]').prop('checked', true);

  // $("#inpRestBegin").prop("disabled", false);
  // $("#inpRestEnd").prop("disabled", false);
  // $("#inpPrice").prop('disabled', false);
  // $("#inpPriceAllYear").css('display', 'none');
  // $("#btnPlus").css('display', '');
  $('#bgDraft').css('display', 'none');
  $('#btnAdd').html('Опубликовать');

  $('.offer-completed').show();
  $('.date').show();
  $('.string-5').show();
}

function offerDelete(offer_key) {
  var offerId = offers[offer_key]['id'];

  //if(offerId == Id) {
  Clear();
  // }

  var objParams = {
    action: 'offer_delete',
    offerId: offerId
  };
  sendData(objParams);
}

function offerRelate(Id) {
  var $form = $('<form>', {
    action: CTRL_URL,
    method: 'POST'
  })
    .append(
      $('<input>', {
        type: 'hidden',
        name: 'action',
        value: 'relates_tenders'
      })
    )
    .append(
      $('<input>', {
        type: 'hidden',
        name: 'offerId',
        value: Id
      })
    );

  $('#offer_list').append($form);
  $form.submit();
}
function NewsletterToggle(mail_numb) {
  var objParams = {
    action: 'user_mailing',
    mailing: mail_numb
  };
  sendData(objParams);
}