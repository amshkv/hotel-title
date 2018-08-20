$(document).ready(function() {
  $('#btnNext').click(function(event) {
    event.preventDefault();
    hotelLogin();
  });

  $('#btnReg').click(function() {
    hotelRegistration();
  });

  $('#btnFilter').click(function() {
    filterRq();
  });

  $('#scroll-to-authorization').click(function() {
    $('html, body').animate({
      scrollTop: 0
    });
  });

  $('#password-reset').click(function(e) {
    e.preventDefault();
    var email = $('#email-recovery').val();
    resetPassword(email);
  });

  $('#tender').on('shown.bs.collapse', function(event) {
    if (event.target.id == 'tender') {
      $('html, body').animate(
        {
          scrollTop: $('#tender').offset().top
        },
        750
      );
    }
  });

  $(document).ajaxComplete(function(event, request, settings) {
    console.log(event, request, settings);

    if (settings.data.indexOf('hotel_login') >= 0) {
      hotelAccount(request.responseJSON);
    }

    if (settings.data.indexOf('hotel_reg') >= 0) {
      msgMailed(request.responseJSON);
    }
    if (settings.data.indexOf('password_reset') >= 0) {
      resetPasswordWarning(request.responseJSON);
    }
  });
  inputsearch($('#inpFilterPlace'), CTRL_URL, 'city_search');
  // Datepicker( $('.datepicker') );

  $.datetimepicker.setLocale('ru');

  $('#inpFilterBegin').datetimepicker({
    timepicker: false,
    format: 'j M y',
    formatDate: 'j M y',
    minDate: 0,
    scrollInput: false,
    onShow: function(ct) {
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
    onShow: function(ct) {
      this.setOptions({
        minDate: $('#inpFilterBegin').val() ? $('#inpFilterBegin').val() : 0
      });
    }
  });

  filterRq();

  if (!Cookies.get('start_users')) {
    Cookies.set('start_users', '1', { expires: 365 });
    var div =
      '<div class="cookie">' +
      '<div class="cookie__text">Как и практически все сервисы в интернете, мы применяем файлы Cookie для того, чтобы собирать обезличенную информацию о пользователях и улучшать качество услуг на портале. Параметры работы с файлами cookie настраиваются в используемом вами браузере. Ознакомьтесь с <a href="http://8h.grandpablo.ru/info/polzovatelskoe-soglashenie" target="_blank">пользовательским соглашением</a> и <a href="http://8h.grandpablo.ru/info/politika-konfidencialnosti" target="_blank">политикой конфиденциальности</a></div>' +
      '<button type="button" class="cookie__button">Закрыть</button>' +
      '</div>';
    $('body').prepend(div);
  }
  $('.cookie__button').click(function(e) {
    e.preventDefault();
    $('.cookie').fadeOut(100);
  });
});

function filterRq() {
  var place = $('#inpFilterPlace').val();
  var place_id = $('#inpFilterPlace').data('placeId');
  var place_name = $('#inpFilterPlace').data('placeName');
  var d1 = $('#inpFilterBegin').val();
  var d2 = $('#inpFilterEnd').val();

  d1 = d1 === '' ? '1900-01-01' : calToPhp(d1);
  d2 = d2 === '' ? '1900-01-01' : calToPhp(d2);

  // console.log(place, place_id, place_name);

  if (place === '') {
    place_id = 0;
    $('#inpFilterPlace').data('placeId', 0);
    $('#inpFilterPlace').data('placeName', '');
  }

  $('#inpFilterPlace').val($('#inpFilterPlace').data('placeName'));

  getRequisitions('get_requisitions', place_id, d1, d2);
}

function hotelLogin() {
  var inpEmail = $('#inpEmail').val();
  var inpPassword = $('#inpPassword').val();

  if (inpEmail == '') {
    return;
  }
  if (inpPassword == '') {
    return;
  }

  var objParams = {
    action: 'hotel_login',
    username: inpEmail,
    password: inpPassword
  };

  sendData(objParams);
}

function hotelAccount(loggedIn) {
  if (loggedIn) {
    $(location).attr('href', '/hotel/account/');
    return;
  }

  $('#pwdReset').click();

  var inpEmail = $('#inpEmail').val();
  $('#email-recovery').val(inpEmail);
}

function resetPassword(email) {
  var objParams = {
    action: 'password_reset',
    user_type: 'hotel',
    email: email
  };

  sendData(objParams);
}

function resetPasswordWarning(response) {
  var alertsKey = response[0];
  var alertsText = response[1];

  alert(alertsText);

  if (alertsKey === 1) {
    $('#resetModal').modal('toggle');
    return;
  }
}

function hotelRegistration() {
  var name = $('#inpNewName').val();
  var email = $('#inpNewEmail').val();
  var userAgree = $('#inpAgree').is(':checked') ? 1 : 0;
  console.log(userAgree);
  if (email == '') {
    // msgAlert('Вы не указали адрес электронной почты.', 'danger');
    return;
  }

  if (name == '') {
    // msgAlert('Вы не указали название отеля.', 'danger');
    return;
  }

  if (!userAgree) {
    // msgAlert('Для продолжения необходимо согласиться с условиями.', 'danger');
    return;
  }

  var objParams = {
    action: 'hotel_reg',
    user_type: 'hotel',
    name: name,
    email: email,
    userAgree: userAgree
  };
  sendData(objParams);
}

function msgMailed(data) {
  var res = data[0];
  var msg = data[1];

  // if(res == 0) {
  //
  // }

  $('#regModal').click();
  $('#msgReg').html(msg);
  $('#showReg').click();
}
