
$(document).ready(function(){

    $("button#btnNext").click(function(){
        hotelLogin();
    });

    $("#btnFilter").click(function(){
        filterRq();
    });

    $( document ).ajaxComplete(function( event, request, settings ) {
        console.log( event, request, settings );

        if(settings.data.indexOf('hotel_login') >= 0 ) {
            hotelAccount(request.responseJSON);
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

    getRequisitions(place_id, d1, d2);
}


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

    var text = "Неверный логин или пароль.";

    $("#divAlert").html(text);
    $("#divAlert").attr( "class", "alert alert-danger" );

}