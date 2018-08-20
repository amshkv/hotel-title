
// ***********************************************
// снипеты
// ***********************************************

function offers($div, action, relationId) {

    var offers;
    var images;

    function getOffers() {
        var objParams = {
            'action': action,
            'relationId': relationId
        };
        $.ajax({
            url: CTRL_URL,
            type: "POST",
            data: objParams,
            dataType: 'json',
            success:function(data){
                showOffers(data);
            }
        });
    }


    function showOffers(data) {
        var prevOfferId = 0;
        var prices = "";
        var commonCount = 0;
        var cnt_overdue = 0;
        var cnt_prices = 0;
        var dsp, btn;
        var favoriteColor;
        offers = data;

        $(".offer").each(function () {
            $(this).remove();
        });

        if (offers === null) {
            return;
        }

        var count = 0;
        for (var i in offers) {
            count++;
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
            var favorite_id = offers[key]['favorite_id'];


            if (prevOfferId !== offId) {

                favoriteColor = (favorite_id > 0) ? "heart" : "like";

                var htmlOffer =
                    '<div class="block-main offer">' +
                    '<div class="col col-1">' +
                    '<div class="carousel slide carousel-generic" data-ride="carousel" id="imageOfferId_' + offId + '">' +
                    // здесь фотографии
                    '</div>' +
                    '<h2>' + header + '</h2>' +
                    '<p>' + place + ', отель ' + name + '</p>' +
                    '<p>Количество от <b>' + quantity_min + '</b> до <b>' + quantity_max + '</b></p>' +
                    '</div>' +
                    '<div class="col col-2">' +
                    '<p>' + description + '</p>' +
                    '</div>' +
                    '<div class="col col-4" id="prices_' + offId + '">' +
                    // здесь список цен
                    '</div>' +

                    '<div class="col col-3">' +
                    '<div class="number">' + offId + '</div>';

                htmlOffer += '</div>';
                $div.html(htmlOffer);

                getImages(offId);

                if (prices !== "") {
                    $("#prices_" + prevOfferId).html(prices);

                    // if(commonCount > 0){
                    //     // $("#prices_" + prevOfferId).find(".clsHide").hide();
                    // }

                    prices = "";
                }
                prevOfferId = offId;
                commonCount = 0;
            }


            if (is_common <= 0) {
                // dsp = 'class="clsHide"';
                // btn = '';
                dsp = 'class="prices_' + offId + ' collapse"';
                btn = '';
            } else {
                commonCount++;
                dsp = '';
                btn = '<button type="button" class="btn btn-price" data-toggle="collapse" data-target=".prices_' + offId + '"></button>';
                // dsp = 'class="clsCommon" ';
                // btn = '<button class="btn btn-warning btnCommon">...</button>';
            }

            if (all_year <= 0) {
                prices += '<div ' + dsp + ' ><p><span>c</span> ' + rest_begin + ' <span>по</span> ' + rest_end + ' <span class="price">Стоимость:</span> ' + price + ' руб.</p></div>' + btn;
            } else {
                prices += '<p>Круглый год цена: ' + price + 'руб.</p>';
                commonCount++;
            }


            if (key == count - 1) {
                $("#prices_" + prevOfferId).html(prices);
            }

        }

    }


    function getImages(offerId) {
        var objParams = {
            'action': 'offer_images',
            'offerId': offerId
        };
        $.ajax({
            url: CTRL_URL,
            type: "POST",
            data: objParams,
            dataType: 'json',
            success:function(data){
                showImages(data);
            }
        });
    }


    function showImages(data) {
        images = data;

        if (images === null) {
            return;
        }

        var offId = images[0]['offer_id'];

        var act = 0;
        var count = Object.keys(images).length;

        var htmlImages =
            '<div class="carousel-inner" id="carousel_' + offId + '">';

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

            if (key == count - 1 && act == 0) {
                active = 'active';
            }

            htmlImages +=
                '<div class="item ' + active + '" >' +
                '<img  src="' + thumbnailPath + '" alt="' + name + '">' +
                '</div>';
        }

        htmlImages +=
            '</div>' +
            // '<a class="carousel-control-prev" href="#carousel_'+ offId +'" role="button" data-slide="prev">' +
            '<a class="left carousel-control" href="#imageOfferId_' + offId + '" data-slide="prev"></a>' +
            '<a class="right carousel-control" href="#imageOfferId_' + offId + '" data-slide="next"></a>'
        ;

        $("#imageOfferId_" + offerId).html(htmlImages);
    }

    getOffers();
}