// ***********************************************
// снипеты
// ***********************************************
var requisitions;
var username = '';
var reqId = 0;

$(document).ready(function() {
  // getRequisitions('get_requisitions',0,'1900-01-01','1900-01-01');

  $(document).ajaxComplete(function(event, request, settings) {
    // console.log(event, request, settings);
    if (settings.data === null) {
      return;
    }
    if (settings.data.indexOf('get_requisitions') >= 0) {
      showRequisitions(request.responseJSON);
    }
  });
});

function getRequisitions(action, place_id, d1, d2) {
  var objParams = {
    action: action,
    PlaceId: place_id,
    dateFrom: d1,
    dateTo: d2,
    reqId: reqId
  };

  sendData(objParams);
}

function showRequisitions(data) {
  var favoriteColor;

  requisitions = data;

  $('.requisition').each(function() {
    $(this).remove();
  });

  if (requisitions === null) {
    $('#requisitions').html(
      '<div class="filter__none">В данном направлении пока не создано ни одной заявки</div>'
    );
    return;
  }

  for (var key in requisitions) {
    var rqId = requisitions[key]['id'];
    var header = requisitions[key]['header'];
    var place = requisitions[key]['place'];
    var place_out = requisitions[key]['place_out'];
    var quantity_tourist = requisitions[key]['quantity_tourist'];
    var quantity_children = requisitions[key]['quantity_children'];
    var quantity_baby = requisitions[key]['quantity_baby'];
    var rest_begin = phpToCal(requisitions[key]['rest_begin']);
    var rest_end = phpToCal(requisitions[key]['rest_end']);
    var description = requisitions[key]['description'];
    var name = requisitions[key]['name'];
    // var price = offers[key]['price'];
    var favorite_id = requisitions[key]['favorite_id'];

    var placeAll = '';
    if (place) {
      placeAll = 'Из ' + place + ' в ' + place_out;
    } else {
      placeAll = 'В ' + place_out;
    }

    var htmlRequisition =
      '<div class="block-main requisition">' +
      '<div class="col col-1">' +
      '<h2>' +
      header +
      '</h2>' +
      '<p>' +
      placeAll +
      '</p>' +
      '<p class="field-item">Взрослые: ' +
      quantity_tourist +
      '</p>' +
      '<p class="field-item">дети (7-14 лет): ' +
      quantity_children +
      '</p>' +
      '<p class="field-item"><span>дети до 7 лет: ' +
      quantity_baby +
      '</span></p>' +
      '</div>' +
      '<div class="col col-2">' +
      '<p class="field-item-1"><span>с</span> ' +
      rest_begin +
      ' <span>по</span> ' +
      rest_end +
      '</p>' +
      '<p>' +
      description +
      '</p>' +
      '<p class="mb-0">Турист: ' +
      name +
      '</p>' +
      '</div>' +
      '<div class="col col-3">' +
      '<div class="number">' +
      rqId +
      '</div>';

    if (reqId === 0) {
      favoriteColor = favorite_id > 0 ? 'heart' : 'like';

      if (username == '' || username == null) {
        var btnOffer = '';
      }

      htmlRequisition +=
        '<div class="dropdown">' +
        '<a href="#" class="suggest to-offer dropdown-toggle"  data-rq-id="' +
        rqId +
        '" ' +
        'data-place="' +
        place_out +
        '" data-toggle="dropdown">Предложить</a>' +
        '<ul class="dropdown-menu">' +
        '</ul>' +
        '<a href="#" data-rq-id="' +
        rqId +
        '" class="favorites ' +
        favoriteColor +
        '"></a>' +
        '</div>';
    }

    htmlRequisition += '</div>';

    htmlRequisition +=
      '<div class="col col-more"><a href="tender/' +
      rqId +
      '" class="tender__link-more">Подробнее</a></div></div>';

    $('#rqBottom').before(htmlRequisition);
  }

  $('.to-offer').on('click', function() {
    event.preventDefault();
    if (username == '' || username == null) {
      $('#newUser').click();
      return;
    }
    offerListShow(
      $(this)
        .parent()
        .find('.dropdown-menu'),
      offers,
      $(this).data('rqId'),
      $(this).data('place')
    );
  });

  $('.favorites').on('click', function(event) {
    event.preventDefault();
    if (username == '' || username == null) {
      $('#newUser').click();
      return;
    }

    changeFavorites($(this));
  });
}

function offerListShow($div, arr, rqId, placeOut) {
  var key;
  var count = 0;

  $div.empty();

  if (arr == null) {
    $div.append(
      $('<li>', {}).append(
        $('<a>', {
          html:
            '<p>В вашем кабинете не создано ни одного предложения. Создайте и прикрепите его к заявке.</p>',
          on: {
            click: function(e) {
              e.preventDefault();
            }
          }
        })
      )
    );
    return;
  }

  for (key in arr) {
    var id = offers[key]['id'];
    var header = offers[key]['header'];
    var published = offers[key]['published'];
    var place_out = offers[key]['place_out'];

    if (placeOut !== place_out) {
      continue;
    }

    if (published == 0) {
      continue;
    }

    // if (id === id_prev) {
    //   continue;
    // }

    $div.append(
      $('<li>', {}).append(
        $('<a>', {
          href: '#',
          'data-offer-id': id,
          html: '<p>' + header + '</p><p class="number">' + id + '</p>',
          on: {
            click: function(e) {
              e.preventDefault();
              relateOffer($(this).data('offerId'), rqId);
            }
          }
        })
      )
    );

    // id_prev = id;

    count += 1;
  }

  if (count === 0) {
    $div.html(
      $('<li>', {}).append(
        $('<a>', {
          html:
            '<p>У вас еще нет опубликованных предложений для данного региона.</p>',
          on: {
            click: function(e) {
              e.preventDefault();
            }
          }
        })
      )
    );
  }
}

function relateOffer(offerId, rqId) {
  var $form = $('<form>', {
    action: CTRL_URL,
    method: 'POST'
  })
    .append(
      $('<input>', {
        type: 'hidden',
        name: 'action',
        value: 'relate_offer'
      })
    )
    .append(
      $('<input>', {
        type: 'hidden',
        name: 'offerId',
        value: offerId
      })
    )
    .append(
      $('<input>', {
        type: 'hidden',
        name: 'rqId',
        value: rqId
      })
    );

  $('#rqBottom').before($form);
  $form.submit();
}

function changeFavorites($elem) {
  var rqId = $elem.data('rqId');
  var objParams = {
    action: 'favorites_change',
    tenderId: rqId
  };

  $.ajax({
    url: CTRL_URL,
    type: 'POST',
    data: objParams,
    dataType: 'json',
    success: function(data) {
      btnFavorites($elem, data[0][0]);
    }
  });
}

function btnFavorites($elem, id) {
  if (id == 0) {
    $elem.removeClass('heart').addClass('like');
  } else {
    $elem.removeClass('like').addClass('heart');
  }
}
