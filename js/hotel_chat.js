
var offers1;



$(document).ready(function () {

    getOffers();
    $(document).ajaxComplete(function (event, request, settings) {
         console.log( event, request, settings );

        if (settings.data.indexOf('chat_offer_list') >= 0) {
            showOffers(request.responseJSON);
        }

        $('.fancybox').fancybox({
            nextClick: true
        });

    });

    $('.filter').click(function (e) {
        e.preventDefault();
        filter($(this));
    });

    $("#aChats").click(function (e) {
        e.preventDefault();
    })
});

$.datetimepicker.setLocale('ru');

function getOffers() {
    var objParams = {
        'action': 'chat_offer_list'
    };

    sendData(objParams);
}

function showOffers(data) {
    offers1 = data;
    var $offer;
    var $tender;


    if (offers1 === null) {
        return;
    }

    for (var key in offers1) {
        var offerId = offers1[key]['id'];
        var published = offers1[key]['published'];
        var cnt_relates = offers1[key]['cnt_relates'];
        var off = 'offer' + offerId;
        var tender = 'tender' + offerId;
        // console.log(published);
        // console.log(cnt_tenders);


        if (cnt_relates > 0) {

            // sleep(2000);

            // добавить оффер
            $offer =
                $('<div >', {
                    class: "offer",
                    id: off
                });

            $('#chats').append($offer);
            offers($('#' + off), 'get_chat_offers', offerId);

            // sleep(2000);

            // добавить тендер
            $tender =
                $('<div>', {
                    class: "tender",
                    id: tender
                });

            $('#chats').append($tender);
            tenders($('#' + tender), 'tenders_by_offerId', offerId, 0, 0, 0, '');

        }



    }


}

function filter($elem) {

    var type = $elem.prop("id");

    $(".filter").removeClass("active");
    $("#" + type).toggleClass("active");

    console.log(type);
    switch (type) {
        case 'filter_all':

            $('.tender').show();
            $('.offer').show();
            break;
        case 'filter_tender':
            $('.tender').show();
            $('.offer').hide();
            break;
        case 'filter_offers':
            $('.tender').hide();
            $('.offer').show();
            break;
    }
}