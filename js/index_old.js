
$(document).ready(function(){

    $("#btnNext").click(function(event){
        event.preventDefault();
        hotelLogin();
    });

    $("#btnReg").click(function(){
        hotelRegistration();
    });

    $("#btnFilter").click(function(){
        filterRq();
    });

    $( document ).ajaxComplete(function( event, request, settings ) {
        console.log( event, request, settings );

        if(settings.data.indexOf('hotel_login') >= 0 ) {
            hotelAccount(request.responseJSON);
        }

        if(settings.data.indexOf('hotel_reg') >= 0 ) {
            msgMailed(request.responseJSON);
        }

    });
    inputsearch( $("#inpFilterPlace"), CTRL_URL, 'city_search' );
    Datepicker( $('.datepicker') );
    filterRq();
});



function filterRq() {
    var place = $("#inpFilterPlace").val();
    var place_id = $("#inpFilterPlace").data('placeId');
    var place_name = $("#inpFilterPlace").data('placeName');
    var d1 = $("#inpFilterBegin").val();
    var d2 = $("#inpFilterEnd").val();

    d1 = (d1 === '') ? '1900-01-01' : calToPhp(d1);
    d2 = (d2 === '') ? '1900-01-01' : calToPhp(d2);

    if(place === '') {
        place_id = 0;
        $("#inpFilterPlace").data('placeId', 0);
        $("#inpFilterPlace").data('placeName', '');
    }

    $("#inpFilterPlace").val($("#inpFilterPlace").data('placeName'));

    getRequisitions('get_requisitions', place_id, d1, d2);
}

function hotelLogin() {

    var inpEmail = $("#inpEmail").val();
    var inpPassword = $("#inpPassword").val();

    if(inpEmail == ''){
        return;
    }
    if(inpPassword == ''){
        return;
    }

    var objParams = {
        'action' : 'hotel_login',
        'username' : inpEmail,
        'password' : inpPassword
    };

    sendData(objParams);

}


function hotelAccount(loggedIn) {

    if(loggedIn) {
        $(location).attr("href", "/hotel/account/");
        return;
    }

    $("#pwdReset").click();
}



function hotelRegistration() {

    var name = $('#inpNewName').val();
    var email = $('#inpNewEmail').val();
    var userAgree = ($('#inpAgree').is(':checked')) ? 1:0 ;
    console.log(userAgree);
    if( email == '' ) {
        // msgAlert('Вы не указали адрес электронной почты.', 'danger');
        return;
    }

    if( name == '' ) {
        // msgAlert('Вы не указали название отеля.', 'danger');
        return;
    }

    if( !userAgree ) {
        // msgAlert('Для продолжения необходимо согласиться с условиями.', 'danger');
        return;
    }



    var objParams = {
        'action' : 'hotel_reg',
        'user_type' : 'hotel',
        'name' : name,
        'email' : email,
        'userAgree' : userAgree
    };
    sendData(objParams);

}

function msgMailed( data ) {
    var res = data[0];
    var msg = data[1];

    // if(res == 0) {
    //
    // }

    $('#regModal').click();
    $('#msgReg').html(msg);
    $('#showReg').click();


}