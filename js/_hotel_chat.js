
var offers1;



$(document).ready(function(){

    getOffers();
    $( document ).ajaxComplete(function( event, request, settings ) {
        // console.log( event, request, settings );

        if(settings.data.indexOf('offer_list') >= 0 ) {
            showOffers(request.responseJSON);
        }

    });

    $('#filter_type').change(function() {
        filter($(this).val());
    });

});



function getOffers() {
    var objParams = {
        'action': 'offer_list'
    };

    sendData(objParams);
}


function showOffers(data) {
    offers1 = data;
    var $offer;
    var $tender;
    console.log(offers1);

    if( offers1  === null ) {
        return;
    }

    for (var key in offers1) {
        var offerId = offers1[key]['id'];
        var published = offers1[key]['published'];
        var cnt_tenders = offers1[key]['cnt_tenders'];
        var off = 'offer'+ offerId;
        var tender = 'tender'+ offerId;
        console.log(published);
        console.log(cnt_tenders);

        if(published > 0 && cnt_tenders > 0) {

            // добавить оффер
            $offer =
                $('<div>', {
                    class: 'row'
                }).append($('<div>', {
                    class: 'col-sm-12',
                    id: off
                }));

            $('#chats').append($offer);

            offers( $('#'+off), 'get_offers', offerId);

            // добавить тендер
            $tender =
                $('<div>', {
                    class: 'row'
                }).append($('<div>', {
                    class: 'col-sm-12',
                    id: tender
                }));

            $('#chats').append($tender);

            tenders( $('#'+tender), 'tenders_by_offerId', offerId, 0, 0, 0, '');

        }



    }


}

function filter(type) {

    switch(type) {
        case '0' :
            $('.tender').show();
            $('.user').show();
            break;
        case '1' :
            $('.tender').show();
            $('.user').hide();
            break;
        case '2' :
            $('.tender').hide();
            $('.user').show();
            break;

    }
}