


$(document).ready(function(){

    $("button#btnNext").click(function(){
        hotelRegistration();
    });


    $( document ).ajaxComplete(function( event, request, settings ) {
        console.log( event, request, settings );

        if(settings.data.indexOf('hotel_reg') >= 0 ) {
           msgMailed(request.responseJSON);
        }

    });

});


function hotelRegistration() {

    var name = $('#inpName').val();
    var email = $('#inpEmail').val();
    var userAgree = ($('#inpAgree').is(':checked')) ? 1:0 ;
    console.log(userAgree);
    if( email == '' ) {
        msgAlert('Вы не указали адрес электронной почты.', 'danger');
        return;
    }

    if( name == '' ) {
        msgAlert('Вы не указали название отеля.', 'danger');
        return;
    }

    if( !userAgree ) {
        msgAlert('Для продолжения необходимо согласиться с условиями.', 'danger');
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

function msgAlert(text, type) {

    $("#divAlert").html(text);

    switch (type) {
        case 'danger' :
            $("#divAlert").attr( "class", "alert alert-danger" );
            break;
        case 'success' :
            $("#divAlert").attr( "class", "alert alert-success" );
            break;
    }

}

function msgMailed( data ) {


    var res = data[0];
    var msg = data[1];

    if(res == 0) {
        msgAlert(msg, 'danger');
        return;
    }

    msgAlert(msg, 'success');
    $("#frmMain").hide("slow",arguments.callee);

}