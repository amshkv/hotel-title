var offerId = 0;


$(document).ready(function(){

    offers( $('#offers'), 'get_offers', offerId);
    tenders( $('#tenders'), 'tenders_by_offerId', offerId, 0, 0, 1, '');





    // $( document ).ajaxComplete(function( event, request, settings ) {
    //     console.log( event, request, settings );
    // });
});
