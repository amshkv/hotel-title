
// ***********************************************
// снипеты
// ***********************************************
var username = '';
var offerId = 0;
var offers;
var images;
var imageUrl;

$(document).ready(function(){
    getOffers(0,'1900-01-01','1900-01-01');

    $( document ).ajaxComplete(function( event, request, settings ) {
        console.log( event, request, settings );

        if(settings.data.indexOf('get_offers') >= 0 ) {
            showOffers(request.responseJSON);
        }
        if(settings.data.indexOf('offer_images') >= 0 ) {
            showImages(request.responseJSON);
        }

    });

});




function getOffers(place_id, d1, d2) {
    var objParams = {
        'action': 'get_offers',
        'PlaceId' : place_id,
        'dateFrom' : d1,
        'dateTo' : d2,
        'offerId' : offerId
    };
    sendData(objParams);
}


function showOffers(data) {
    var prevOfferId = 0;
    var prices = "";
    var commonCount = 0;
    var dsp, btn;
    offers = data;

    $( ".offer" ).each(function() {
        $(this).remove();
    });

    if( offers === null ) {
        return;
    }

    var count = 0;
    for (var i in offers) {
        count ++;
    }

    for (var key in offers) {
        var offId = offers[key]['id'];
        var header = offers[key]['header'];
        var place = offers[key]['place'];
        var quantity_min = offers[key]['quantity_min'];
        var quantity_max = offers[key]['quantity_max'];
        var rest_begin = phpToCal(offers[key]['rest_begin']);
        var rest_end = phpToCal(offers[key]['rest_end']);
        var description = offers[key]['description'];
        var name = offers[key]['name'];
        var price = offers[key]['price'];
        var is_common = offers[key]['is_common'];
        var all_year = offers[key]['all_year'];

        if( prevOfferId !== offId ) {

            var htmlOffer =
                '<div class="alert alert-primary offer" role="alert" >' +
                '<div class="row">' +
                '<div class="col-sm-2" id="imageOfferId_'+offId+'">' +
                '</div>' +
                '<div class="col-sm-10">' +
                '<h4 class="alert-heading">'+header+'</h4>' +
                '<div class="row">' +
                '<div class="col-sm-8">' +
                '<p class="mb-0">Куда: <b>'+place+'</b></p>' +
                '<p class="mb-0">Количество от <b>'+quantity_min+'</b> до <b>'+quantity_max+'</b></p>' +
                '<div id="prices_'+offId+'">' +
                // здесь список цен
                '</div>' +
                '<p class="mb-0">Предложение: <b>'+description+'</b></p>' +
                '</div>' +
                '<div class="col-sm-4">' +
                '<div class="clearfix" >' +
                // '<div class="float-left">' +
                // '</div>' +
                '<div class="float-right" style="text-align: right">' +
                '<p class="mb-0">№ <b>'+offId+'</b></p>' +
                '<p class="mb-0">Отель: <b>'+name+'</b></p>' ;

            if(offerId === 0) {
                htmlOffer +=
                    '<button class="btn btn-primary float-right relation" data-offer-id="'+offId+'">Связь с агентом</button>' +
                    '<button class="btn btn-warning  float-right">+</button>';
            }

            htmlOffer +=
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $("#offerBottom").before(htmlOffer);
            getImages(offId);

            if(prices !== "" ) {
                $("#prices_" + prevOfferId).html(prices);

                if(commonCount > 0){
                    $("#prices_" + prevOfferId).find(".clsHide").hide();
                }

                prices = "";
            }
            prevOfferId = offId;
            commonCount = 0;
        }

        //console.log(offId +' : '+ price);

        if( is_common <= 0) {
            dsp = 'class="clsHide"';
            btn = '';
        } else {
            commonCount ++;
            dsp = 'class="clsCommon" ';
            btn = '<button class="btn btn-warning btnCommon">...</button>';
        }

        if(all_year <= 0) {
            prices += '<div '+dsp+' >Начало: <b>'+rest_begin+'</b> Окончание: <b>'+rest_end+'</b> Цена: <b>' + price+'</b>'+btn+'</div>';
        } else {
            prices += '<div>Круглый год цена: <b>' + price+'</b></div>';
            commonCount ++;
        }

        if( key == count-1 ) {
            $("#prices_" + prevOfferId).html(prices);
        }

    }


    $(".btnCommon").click(function() {
        $(this).parent().parent().find(".clsHide").toggle();
    });

    $(".relation").click(function() {

        if(username == '' || username == null) {
            var scrollTop = $('#frmLogin').offset().top;
            $(document).scrollTop(scrollTop);
            return;
        }
        relateOffer($(this).data('offerId'));
    });
}



function getImages(offerId) {
    var objParams = {
        'action': 'offer_images',
        'offerId': offerId
    };
    sendData(objParams);
}


function showImages(data) {
    images = data;

    if( images === null ) {
        return;
    }

    var offId = images[0]['offer_id'];

    var act = 0;
    var count = Object.keys(images).length;

    var htmlImages =
        '<div id="carousel_'+ offId +'" class="carousel slide" data-interval="false">' +
        '<div class="carousel-inner" role="listbox">';

    for (var key in images) {

        var imageId = images[key]['id'];
        var name = images[key]['name'];
        var offerId = images[key]['offer_id'];
        var thumbnailPath = images[key]['thumbnail'];
        var avatar = images[key]['avatar'];
        var active = '';

        if (avatar === imageId) {
            active = 'active';
            act += 1;
        }

        if( key == count-1 && act == 0) {
            active = 'active';
        }

        htmlImages +=
            '<div class="carousel-item ' + active + '" >' +
            '<img style="width: 100%" class="d-block img-fluid" src="' + thumbnailPath + '" alt="'+ name +'">' +
            '</div>';
    }

    htmlImages +=
        '</div>' +
        '<a class="carousel-control-prev" href="#carousel_'+ offId +'" role="button" data-slide="prev">' +
        '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
        '<span class="sr-only">Назад</span>' +
        '</a>' +
        '<a class="carousel-control-next" href="#carousel_'+ offId +'" role="button" data-slide="next">' +
        '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
        '<span class="sr-only">Вперед</span>' +
        '</a>' +
        '</div>';

    $("#imageOfferId_" + offerId).html(htmlImages);
}

function relateOffer(offerId) {

    var $form = $('<form>', {
        'action': CTRL_URL,
        'method': 'POST'
    }).append($('<input>', {
        'type' : 'hidden',
        'name' : 'action',
        'value' : 'relate_offer'
    })).append($('<input>', {
        'type' : 'hidden',
        'name' : 'offerId',
        'value' : offerId
    }));

    $("#offerBottom").before($form);
    $form.submit();
}