var offers;

$(document).ready(function(){
    getOffers();
    $("#msg").fadeOut( 20000 );

    $("#btnFilter").click(function(){
        filterRq();
    });

    $( document ).ajaxComplete(function( event, request, settings ) {
        // console.log( event, request, settings );

        if(settings.data.indexOf('offer_list') >= 0 ) {
            offers = request.responseJSON;
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

    getRequisitions('get_requisitions_favorites',place_id, d1, d2);
}

function getOffers() {
    var objParams = {
        'action': 'offer_list'
    };

    sendData(objParams);
}
