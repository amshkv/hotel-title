var relationId;
var reqId = 0;
var tourist_id = 0;
var offerId;
var myChat;
var type;
var offers;

$.datetimepicker.setLocale('ru');

$(document).ready(function () {
  $(document).ajaxComplete(function (event, request, settings) {
    console.log(event, request, settings);

    if (settings.data.indexOf('offer_list_full') >= 0) {
      offers = request.responseJSON;
    }

    $('.fancybox').fancybox({
      nextClick: true
    });
  });
});

$(document).ready(function () {
  tenders($('.tender-page__wrapper'), 'tender_by_id', rqId);

  getOffers();
});

function tenders($div, action, rqId) {
  var requisitions;
  getRequisitions();

  function getRequisitions() {
    var objParams = {
      action: action,
      rqId: rqId
    };

    $.ajax({
      url: CTRL_URL,
      type: 'POST',
      data: objParams,
      dataType: 'json',
      success: function (data) {
        showRequisitions(data);
      }
    });
  }

  function showRequisitions(data) {
    var htmlRequisition;
    var btn;

    var favoriteColor;

    requisitions = data;

    // console.log(requisitions);

    if (!requisitions) {
      $('.breadcrumb').after(
        '<div class="tender-page__none">Тендера с номером ' +
        rqId +
        ' не существует.</div>'
      );
      return;
    }

    for (var key in requisitions) {
      var reqId = requisitions[key]['id'];
      var header = requisitions[key]['header'];
      var place = requisitions[key]['place'];
      var place_out = requisitions[key]['place_out'];
      var favorite_id = requisitions[key]['favorite_id'];
      var quantity_tourist = requisitions[key]['quantity_tourist'];
      var quantity_children = requisitions[key]['quantity_children'];
      var quantity_baby = requisitions[key]['quantity_baby'];
      var rest_begin = phpToCal(requisitions[key]['rest_begin']);
      var rest_end = phpToCal(requisitions[key]['rest_end']);
      var description = requisitions[key]['description'];
      var published = requisitions[key]['published'];
      var published_date = requisitions[key]['published_date'];

      $('.bredcrumb-page').text(header);

      var docTitle = 'Предложение на турпортале 8h.ru ' + header;

      document.title = docTitle;

      var notActive = 'class="chat-toggle__people--no-active"';
      var notTourist = '';
      var notChildren = '';
      var notBaby = '';
      if (quantity_tourist <= 0) {
        notTourist = notActive;
      }
      if (quantity_children <= 0) {
        notChildren = notActive;
      }
      if (quantity_baby <= 0) {
        notBaby = notActive;
      }

      var placeAll = '';

      if (place) {
        placeAll = 'Из ' + place + ' в ' + place_out;
      } else {
        placeAll = 'В ' + place_out;
      }

      var isPublished = 1;

      if (published == 0) {
        if (!published_date) {
          $('.breadcrumb').after(
            '<div class="tender-page__none">Предложения с номером ' +
            reqId +
            ' не существует.</div>'
          );
          return;
        } else {
          isPublished = 0;
        }
      }

      var dropdown = isAuthorized ? ' data-toggle="dropdown" ' : '';

      var headerPublished = '';

      if (!isPublished) {
        header += ' (снято с публикации)';
        headerPublished = 'tender-page__title--no-active';
      }

      favoriteColor = favorite_id > 0 ? 'heart' : 'like';

      if (reqId > 0) {
        var sliced = description.slice(0, 200);

        if (sliced.length < description.length) {
          sliced += '...';
        }

        var share =
          '<div class="share">' +
          '<button class="share__button" type="button"></button>' +
          '<div class="share__wrapper">' +
          '<div class="share__text">Поделиться</div>' +
          '<div class="ya-share2" data-services="vkontakte,facebook,gplus,whatsapp,odnoklassniki"' +
          'data-title="Тендер на турпортале 8h.ru ' +
          header +
          '" data-description="' +
          sliced +
          '">Поделиться</div>' +
          '</div>' +
          '</div>';

        htmlRequisition =
          '<div class="tender-page__line">' +
          '<h2 class="tender-page__title ' +
          headerPublished +
          '">' +
          header +
          '</h2>' +
          '<div class="tender-page__address">' +
          placeAll +
          '</div>' +
          '<div class="tender-page__people">' +
          '<span ' +
          notTourist +
          '>Взрослые: ' +
          quantity_tourist +
          ',&ensp;</span>' +
          '<span ' +
          notChildren +
          '>дети (7-14 лет): ' +
          quantity_children +
          ',&ensp;</span>' +
          '<span ' +
          notBaby +
          '>дети до 7 лет: ' +
          quantity_baby +
          '</span>' +
          '</div>' +
          '</div>' +
          '<div class="tender-page__line">' +
          '<div class="tender-page__date">' +
          '<span class="tender-page__text-def">с</span> ' +
          rest_begin +
          ' <span class="tender-page__text-def">по</span> ' +
          rest_end +
          '</div>' +
          '<div class="tender-page__user-text">' +
          description +
          '</div>' +
          '</div>' +
          '<div class="tender-page__line tender-page__line--flex dropdown">' +
          '<div class="tender-page__info-number">' +
          reqId +
          '</div>';

        htmlRequisition +=
          share +
          '<a href="#" data-req-id="' +
          reqId +
          '" class="favorites ' +
          favoriteColor +
          '"></a>' +
          '<a href="#" class="to-offer tender-page__suggest relation dropdown-toggle" data-offer-id="' +
          reqId +
          '" ' +
          'data-place="' +
          place_out +
          '"' + dropdown + 'title="Предложить">Предложить</a>' +
          '<ul class="dropdown-menu tender-page__dropdown-menu">' +
          '</ul>' +
          '</div>';
      }

      $div.append(htmlRequisition);

      $('body').append(
        '<script src="https://yastatic.net/share2/share.js"></script>'
      );

      $('head').append(
        '<meta property="og:type" content="website"/>' +
        '<meta property="og:title" content="Тендер на турпортале 8h.ru ' +
        header +
        '"/>' +
        '<meta property="og:description" content="' +
        description +
        '">'
      );

      $('.share__button').click(function () {
        var $div = $('+ .share__wrapper', this);
        if ($div.is(':visible')) {
          $div.fadeOut(300, function () {
            $div.removeClass('active');
          });
        } else {
          $div
            .addClass('active')
            .hide()
            .fadeIn(300);
        }
      });
    }

    $('.favorites').click(function (event) {
      event.preventDefault();
      if (username == '' || username == null) {
        showRegistrationPage();
        return;
      }

      changeFavorites($(this));
    });

    function changeFavorites($elem) {
      var reqId = $elem.data('reqId');
      var objParams = {
        action: 'favorites_change',
        tenderId: reqId
      };

      $.ajax({
        url: CTRL_URL,
        type: 'POST',
        data: objParams,
        dataType: 'json',
        success: function (data) {
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

    function showRegistrationPage(params) {
      if (
        confirm(
          'Для использования данного функционала необходимо зарегистрироваться. Перейти на страницу регистрации?'
        )
      ) {
        document.location.href = '/';
      } else {
        return false;
      }
    }

    $('.to-offer').on('click', function () {
      event.preventDefault();
      if (username == '' || username == null) {
        showRegistrationPage();
        return;
      }

      offerListShow(
        $(this)
          .parent()
          .find('.dropdown-menu'),
        offers,
        $(this).data('reqId'),
        $(this).data('place')
      );
    });
  }
}

function offerListShow($div, arr, reqId, placeOut) {
  var count = 0;
  var id_prev = 0;

  $div.empty();

  if (!arr) {
    $div.append(
      $('<li>', {}).append(
        $('<a>', {
          html:
            '<span class="tender-page__text-def">В вашем кабинете не создано ни одного предложения. Создайте и прикрепите его к заявке.</span>',
          on: {
            click: function (e) {
              e.preventDefault();
            }
          },
          class: 'not-hover'
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

    if (id === id_prev) {
      continue;
    }

    $div.append(
      $('<li>', {}).append(
        $('<a>', {
          href: '#',
          'data-offer-id': id,
          html:
            '<span>' +
            header +
            '</span><span class="tender-page__text-def">' +
            id +
            '</span>',
          on: {
            click: function (e) {
              e.preventDefault();
              relateOffer($(this).data('offerId'), rqId);
            }
          }
        })
      )
    );

    count += 1;

    id_prev = id;
  }

  if (count === 0) {
    $div.append(
      $('<li>', {}).append(
        $('<a>', {
          html:
            '<span class="tender-page__text-def">У вас еще нет опубликованных предложений для данного региона.</span>',
          on: {
            click: function (e) {
              e.preventDefault();
            }
          },
          class: 'not-hover'
        })
      )
    );
  }
}

function getOffers() {
  var objParams = {
    action: 'offer_list_full'
  };

  sendData(objParams);
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

  $('body').append($form);
  $form.submit();
}
