

function offers( $div, action, Id ) {
    var offers;
    var images;

    function getOffers() {
        // console.log(rqId);
        var objParams = {
            'action'  : action,
            'PlaceId' : 0,
            'dateFrom': '1900-01-01',
            'dateTo'  : '1900-01-01',
            'offerId' : Id
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
        var dsp, btn, btnRel;
        var cnt_overdue = 0;
        var cnt_prices  = 0;
        var len;

        offers = data;

        $div.html();

        if( offers === null ) {
            return;
        }

        len = Object.getOwnPropertyNames(offers).length;

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
            var relationId = offers[key]['relationId'];
            var selected = offers[key]['selected'];
            var is_overdue = offers[key]['is_overdue'];
            // var selected_offer_id = offers[key]['selected_offer_id'];





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
                    '<p class="mb-0">Отель: <b>'+name+'</b></p>';


                // if(selected === ''){
                //     btnRel = '<div id="btn_' + offId + '"><button class="btn btn-primary float-right relation" data-key="'+key+'" >Откликнуться</button></div>';
                // } else {
                //     btnRel = '<div id="btn_' + offId + '"><button class="btn btn-primary float-right chat" data-key="'+key+'">Чат</button></div>';
                // }




                // htmlOffer += btnRel;

                htmlOffer +=
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $div.append(htmlOffer);

                getImages(offId);

                if(prices !== "" ) {
                    $("#prices_" + prevOfferId).html(prices);

                    if(commonCount > 0){
                        $("#prices_" + prevOfferId).find(".clsHide").hide();
                    }

                    prices = "";
                }

                if( prevOfferId > 0 ) {


                    if( cnt_overdue === cnt_prices && cnt_overdue > 0 ) {

                        $('#btn_' + prevOfferId).html('<span><b>Предложение просрочено</b></span>');
                    }
                    cnt_overdue = 0;
                    cnt_prices  = 0;
                }

                prevOfferId = offId;
                commonCount = 0;
            }

            cnt_prices++;
            if( is_overdue == 1 ){ cnt_overdue++; }

            if( len-1 == key ) {

                if( cnt_overdue === cnt_prices && cnt_overdue > 0 ) {

                    //     $('#btn_' + prevOfferId).html('<span><b>Предложение просрочено</b></span>');
                }
                cnt_overdue = 0;
                cnt_prices  = 0;
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
            relate($(this).data('key'), 'relate_offer_rq');
        });
        $(".chat").click(function() {
            relate($(this).data('key'), 'chat_offer_rq');
        });
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
                '<img style="width: 100%" class="d-block img-fluid" src="' + IMAGE_URL + thumbnailPath + '" alt="'+ name +'">' +
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

    function relate(key, action) {

        var $form = $('<form>', {
            'action': CTRL_URL,
            'method': 'POST'
        }).append($('<input>', {
            'type' : 'hidden',
            'name' : 'action',
            'value' : action
        })).append($('<input>', {
            'type' : 'hidden',
            'name' : 'offerId',
            'value' : offers[key]['id']
        })).append($('<input>', {
            'type' : 'hidden',
            'name' : 'rqId',
            'value' : rqId
        })).append($('<input>', {
            'type' : 'hidden',
            'name' : 'relationId',
            'value' : offers[key]['relationId']
        }));

        $div.append($form);
        $form.submit();
    }

    getOffers();
}