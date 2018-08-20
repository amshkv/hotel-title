
var offers;
var prices;
var images;


var Id = 0;
var published = 0;
var key_prev = -1;
var itemPrice = 0;

$(document).ready(function(){



    $("#msg").fadeOut( 20000 );

    $("#btnAdd").click(function(){
        addOffer();
    });

    $("#btnCancel").click(function(){
        Clear();
    });
    $("#btnPlus").click(function(){
        addPrice(0);
    });

    $(".add-image").click(function(){
        addImage();
    });


    $( ".edit-field" ).change(function() {
        console.log("change");
        if( ! crossPeriods() ) {
            saveOfferDraft();
        } else {
            msgAlert('Даты должны быть заполнены. Периоды не должны пересекаться.', 'danger');
        }
    });

    $("#btnFilter").click(function(){
        filterRq();
    });

    checkBoxEvents();
    commonPriceEvents();
    getOffers();
    // getRequisitions();

    $( document ).ajaxComplete(function( event, request, settings ) {
        // console.log( event, request, settings );
        if(settings.formData) {
            if( Id <= 0 ) {
                var str = request.responseText;
                // console.log(str.substring(str.indexOf("}")+3).replace(/"/g, ""));
                Id = str.substring(str.indexOf("}")+3).replace(/"/g, "");
            }

            getOfferImages();
            return;
        }

        if(settings.data.indexOf('save_offer_draft') >= 0 ) {
            save_id(request.responseJSON);
            getOffers();
        }
        if(settings.data.indexOf('add_offer') >= 0 ) {
            offer_result(request.responseJSON);
        }
        if(settings.data.indexOf('offer_list') >= 0 ) {
            showOffers(request.responseJSON);
        }
        if(settings.data.indexOf('offer_price_list') >= 0 ) {
            showOffersPrice(request.responseJSON);
        }
        if(settings.data.indexOf('offer_images') >= 0 ) {
            showOfferImages(request.responseJSON);
        }
        // if(settings.data.indexOf('get_requisitions') >= 0 ) {
        //     showRequisitions(request.responseJSON);
        // }


        if(settings.data.indexOf('offer_delete') >= 0 ) {
            getOffers();
        }
    });

    inputsearch( $("#inpPlace"), CTRL_URL, 'city_search' );
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


function checkBoxEvents() {
    $("#inpAllYear").click(function(){
        if($(this).prop("checked")) {
            $("input#inpRestBegin").prop('disabled', true);
            $("input#inpRestEnd").prop('disabled', true);
            $("input#inpPrice").prop('disabled', true);
            $("#inpPriceAllYear").css('display', '');
            $("#inpPriceAllYear").val('');
            $("#btnPlus").css('display', 'none');

            $("input#inpCommonPrice").prop('checked', false).prop('disabled', true);

            return;
        }
        $("input#inpRestBegin").prop('disabled', false);
        $("input#inpRestEnd").prop('disabled', false);
        $("input#inpPrice").prop('disabled', false);
        $("#inpPriceAllYear").css('display', 'none');
        $("#btnPlus").css('display', '');
        // priceDelete($(".priceAllYear").data("price-id"));
        $(".priceAllYear").data("price-id",0);
        $("input#inpCommonPrice").prop('disabled', false);
    });



}


function commonPriceEvents() {
    $("input#inpCommonPrice").click(function(){
        if($(this).prop("checked")) {
            $("input#inpCommonPrice").prop('checked', false);
            $(this).prop("checked", true);
        }
    });
}

function addImage() {

    // if(Id <= 0) {
    //     createOffer();
    // }

    $('#fileupload').fileupload({
        formData: {OfferId: Id},
        add: function (e, data) {
            var count = data.files.length;
            var i;
            for (i = 0; i < count; i++) {
                // data.files[i].uploadName = Id + '_' + data.files[i].name;
                if(data.files[i].size > 1440000) {
                    msgAlert('Слишком  большой размер фотографии.', 'danger');
                    return;
                }
            }
            data.submit();
        }
    });

    $('#fileupload').click();
}


function addPrice(PriceId) {

    var htmlPrice =
        '<div class="form-row price" data-price-id="'+PriceId+'">' +
            '<div class="form-group col-sm-1">' +
                '<label class="custom-control custom-checkbox">' +
                    '<input id="inpCommonPrice" type="checkbox" class="custom-control-input edit-field" name="CommonPrice">' +
                    '<span class="custom-control-indicator"></span>' +
                '</label>' +
            '</div>' +
            '<div class="form-group col-sm-4">' +
                '<input id="inpRestBegin" type="text" class="form-control datepicker edit-field" placeholder="Дата начала отдыха">' +
            '</div>' +
            '<div class="form-group col-sm-4">' +
                '<input id="inpRestEnd" type="text" class="form-control datepicker edit-field" placeholder="Дата окончания отдыха">' +
            '</div>' +
            '<div class="form-group col-sm-2">' +
                '<input id="inpPrice" type="number" class="form-control edit-field" placeholder="Цена">' +
            '</div>' +
            '<div class="form-group col-sm-1">' +
                '<button id="btnMinus" type="button" class="btn btn-danger">-</button>' +
            '</div>' +
        '</div>';
    $("#divPlus").before(htmlPrice);

    $("button#btnMinus").click(function(){
        var $curr = $(this).parent().parent();
        var PriceId = $curr.data("price-id");
        $curr.remove();
        saveOfferDraft();
       // priceDelete(PriceId);
    });

    $( ".edit-field" ).change(function() {

        if( ! crossPeriods() ) {
            saveOfferDraft();
        } else {
            msgAlert('Даты должны быть заполнены. Периоды не должны пересекаться.', 'danger');
        }
    });

    commonPriceEvents();
    Datepicker( $('.datepicker') );

}


function crossPeriods() {
    // поиск пересечения периодов или пустых дат
    var i;
    var res = false;
    var count = $(".price").length;

    $(".price").each(function( index ) {

        var beg1 = calToPhp($(this).find("#inpRestBegin").val());
        var end1 = calToPhp($(this).find("#inpRestEnd").val());

        if( beg1 === "" || end1 === "" ) {
            res = true;
            return false;
        }

        for(i = index + 1; i < count; i++ ) {
            var beg2 = calToPhp($(".price").eq(i).find("#inpRestBegin").val());
            var end2 = calToPhp($(".price").eq(i).find("#inpRestEnd").val());

            if( (beg1 <= beg2 && beg2 <= end1) ||
                (beg1 <= end2 && end2 <= end1)
            ) {
                res = true;
                return false;
            }
        }
    });

    return res;

}




function htmlImage(imId, imPath, avatar) {

    var imSelected = (imId == avatar) ? 'hotelImgSelected' : '';

    var htmlImage =
        '<div class="col-md-4 galleryImage '+imSelected+'" data-image-id="'+imId+'" title="Кликните, чтобы сделать фотографию обложкой">' +
        '<div class="galleryImageDelete" data-image-id="'+imId+'" title="Удалить фотографию">' +
        '<i class="glyphicon-trash" aria-hidden="true"><b>-</b></i>' +
        '</div>' +
        '<div class="Clearfix"></div>' +
        '<div class="galleryImageBody">' +
        '<img src="'+ imPath +'">' +
        '</div>' +
        '<div class="Clearfix"></div>' +
        '</div>'
        ;
    $("#image-end").before(htmlImage);

    $(".galleryImage").click(function(){
        setAvatar($(this).data("image-id"));
        $("div.galleryImage").removeClass( "hotelImgSelected" );
        $(this).addClass( "hotelImgSelected" );
    });

}



function setAvatar(imageId) {
    var objParams = {
        'action' : 'offer_set_avatar',
        'offerId' : Id,
        'imageId' : imageId
    };
    sendData(objParams);
}

// function priceDelete(PriceId) {
//     var objParams = {
//         'action' : 'offer_price_delete',
//         'PriceId' : PriceId
//     };
//     sendData(objParams);
// }

function imageDelete($curr) {
    var ImageId = $curr.data("image-id");

    var objParams = {
        'action' : 'offer_image_delete',
        'ImageId' : ImageId
    };
    sendData(objParams);

    $curr.parent().remove();
}


function saveOfferDraft() {

    if(published == 1) {
        return;
    }
    var PlaceId = $('#inpPlace').data('placeId');
    var PlaceName = $('#inpPlace').data('placeName');

    $('#inpPlace').val(PlaceName);

    var inpHeader = $('#inpHeader').val();
    var inpPlace = $('#inpPlace').val();
    var inpRestBegin = $('#inpRestBegin').val();
    var inpRestEnd = $('#inpRestEnd').val();
    var inpDescription = $('#inpDescription').val();
    var inpQuantityMin = $('#inpQuantityMin').val();
    var inpQuantityMax = $('#inpQuantityMax').val();

    var objParams = {
        'action' : 'save_offer_draft',
        'published' : 0,
        'Id' : Id,
        'Header' : inpHeader,
        'Place' : inpPlace,
        'PlaceId' : PlaceId,
        'QuantityMin' : inpQuantityMin,
        'QuantityMax' : inpQuantityMax,
        'RestBegin' : calToPhp(inpRestBegin),
        'RestEnd' : calToPhp(inpRestEnd),
        'Description' : inpDescription,
        'prices' : getPrices()
    };

    sendData(objParams);

}




function addOffer() {
    var PlaceId = $('#inpPlace').data('placeId');
    var PlaceName = $('#inpPlace').data('placeName');

    $('#inpPlace').val(PlaceName);

    var inpHeader = $('#inpHeader').val();
    var inpPlace = $('#inpPlace').val();
    var inpRestBegin = $('#inpRestBegin').val();
    var inpRestEnd = $('#inpRestEnd').val();
    // var inpOfferEnd = $('#inpOfferEnd').val();
    var inpDescription = $('#inpDescription').val();
    var inpQuantityMin = $('#inpQuantityMin').val();
    var inpQuantityMax = $('#inpQuantityMax').val();
    var inpPrice = $('#inpPrice').val();


    if( inpHeader == '' ) {
        msgAlert('Не указан заголовок заявки.', 'danger');
        return;
    }

    if( PlaceId == 0 ) {
        msgAlert('Не выбрано место.', 'danger');
        return;
    }

    if( inpQuantityMin == '' ) {
        msgAlert('Не указано минимальное количество человек.', 'danger');
        return;
    }

    if( inpQuantityMax == '' ) {
        msgAlert('Не указано максимальное количество человек.', 'danger');
        return;
    }
    if( !$("#inpAllYear").prop("checked") ) {
        if (inpRestBegin == '') {
            msgAlert('Не указана дата начала отдыха.', 'danger');
            return;
        }
    }

    if( !$("#inpAllYear").prop("checked") && crossPeriods() ) {
        msgAlert('Даты должны быть заполнены. Периоды не должны пересекаться.', 'danger');
        return;
    }

    // if( inpRestEnd == '' ) {
    //     msgAlert('Не указана дата окончания отдыха.', 'danger');
    //     return;
    // }
    // if( inpOfferEnd == '' ) {
    //     msgAlert('Не указана дата окончания предложения.', 'danger');
    //     return;
    // }

    var objParams = {
        'action' : 'add_offer',
        'published' : 1,
        'Id' : Id,
        'Header' : inpHeader,
        'PlaceId' : PlaceId,
        'Place' : inpPlace,
        'QuantityMin' : inpQuantityMin,
        'QuantityMax' : inpQuantityMax,
        'RestBegin' : calToPhp(inpRestBegin),
        'RestEnd' : calToPhp(inpRestEnd),
//        'OfferEnd' : inpOfferEnd,
//        'Price' : inpPrice,
        'Description' : inpDescription,
        'prices' : getPrices()
    };

    sendData(objParams);


}

function getPrices() {

    var prices = [];

    $( ".price" ).each(function( index ) {

        var PriceId = $(this).data("price-id");
        var RestPrice = $(this).find("#inpPrice").val();
        var RestBegin = $(this).find("#inpRestBegin").val();
        var RestEnd = $(this).find("#inpRestEnd").val();
        var CommonPrice = ($(this).find("#inpCommonPrice").prop("checked")) ? 1 : 0;

        prices.push({
            PriceId     : PriceId,
            AllYear     : 0,
            RestPrice   : RestPrice,
            RestBegin   : calToPhp(RestBegin),
            RestEnd     : calToPhp(RestEnd),
            CommonPrice : CommonPrice
        });
    });

    if( $("#inpAllYear").prop("checked") ) {

        prices.push({
            PriceId     : $(".priceAllYear").data("price-id"),
            AllYear     : 1,
            RestPrice   : $("#inpPriceAllYear").val(),
            RestBegin   : '',
            RestEnd     : '',
            CommonPrice : 1
        });
    }

    return prices;
}



function msgAlert(text, type) {

    $("#msg").html(text);

    switch (type) {
        case 'danger' :
            $("#msg").attr( "class", "alert alert-danger" );
            break;
        case 'success' :
            $("#msg").attr( "class", "alert alert-success" );
            break;
    }
    $("#msg").show().fadeOut( 20000 );

}


function save_id(data) {
    if(Id <= 0){
        if( data !== null ){
            Id = data[0][0];
        }
    }

}

function offer_result(data){
    if( data !== null ){
        if(data[0][0] > 0){
            key_prev = -1;
            Id = 0;
            msgAlert('Ваше предложение успешно сохранено.', 'success');
            // $("#frmOffer")[0].reset();
            // $("#divCreateOffer").attr( "class", "alert alert-primary" );
            // $("#txtCaption").html( "<b>Сформировать предложение</b>" );
            Clear();
            getOffers();
            return;
        }

    }

    msgAlert('Предложение не сохранено. Повторите попытку позже.', 'danger');
}


function getOffers() {
    var objParams = {
        'action': 'offer_list'
    };

    sendData(objParams);
}


function getOffersPrice() {
    var objParams = {
        'action': 'offer_price_list',
        'offerId' : Id
    };
    sendData(objParams);
}

function getOfferImages() {
    var objParams = {
        'action': 'offer_images',
        'offerId' : Id
    };
    sendData(objParams);
}


function showOffers(data) {
    offers = data;
    var bage;
    var offer_list = '<div class="list-group-item list-group-item-primary"><b>Мои предложения</b></div>';

    if( offers  !== null ) {
        for (var key in offers) {
            var id = offers[key]['id'];
            var header = offers[key]['header'];
            var published = offers[key]['published'];
            var cnt_tenders = offers[key]['cnt_tenders'];

            if( published == 0 ) {
                header = '<span style="color:gray">'+header+'</span>';
            }

            bage = ( cnt_tenders > 0 ) ? '&nbsp;&nbsp;<a href="google.com" class="badge badge-success" data-offer-id="'+id+'">'+cnt_tenders+'</a>' : '';

            offer_list = offer_list +

        '<div class="list-group-item " id="divOffer_' + key + '">' +
        header +
                '&nbsp;<button id="btnOffer_' + key + '" value="' + key + '" type="button" title="Редактировать">...</button>' +
                '&nbsp;<button id="btnOfferDelete_' + key + '" value="' + key + '" type="button" title="Удалить">X</button>' +
                bage +
        '</div>';
        }
    }


    $("#offer_list").html(offer_list);

    $('button[id ^= "btnOffer_"]').click(function() {
        offerEdit($(this).val());
    });
    $('button[id ^= "btnOfferDelete_"]').click(function() {
        offerDelete($(this).val());
    });
    $('.badge').click(function(event) {
        event.preventDefault();
        offerRelate($(this).data('offerId'));
    });
}



function showOffersPrice(data) {
    prices = data;

    if( prices === null ) {
        return;
    }
    var priceAllYear = false;
    var $curr = $(".price");

    var i = 0;

    for (var key in prices) {
        var PriceId = prices[key]['PriceId'];
        var all_year = prices[key]['all_year'];
        var rest_begin = phpToCal(prices[key]['rest_begin']);
        var rest_end = phpToCal(prices[key]['rest_end']);
        var price = prices[key]['price'];
        var is_common = prices[key]['is_common'];

        if(all_year == 1) {
            priceAllYear = true;
            $(".priceAllYear").data("price-id", PriceId);
            $("#inpPriceAllYear").val(price);
            continue;
        }

        if(i > 0) {
            addPrice(PriceId);
            $curr = $curr.next();
        }


        $curr.data("price-id", PriceId) ;
        $curr.find("#inpPrice").val(price);
        $curr.find("#inpRestBegin").val(rest_begin);
        $curr.find("#inpRestEnd").val(rest_end);
        if(is_common == 1) {
            // console.log($curr.find("#inpCommonPrice"));
            $curr.find("#inpCommonPrice").prop("checked", true);
        }

        if(i === 0) {
            $curr = $curr.next(); // чтобы перескачить подсказку
        }

        i++;
    }

    if(priceAllYear) {
        $("input#inpRestBegin").prop('disabled', true);
        $("input#inpRestEnd").prop('disabled', true);
        $("input#inpPrice").prop('disabled', true);
        $("#inpPriceAllYear").css('display', '');
        $("#btnPlus").css('display', 'none');
        $("#inpAllYear").prop('checked', true);
    }
}


function showOfferImages(data) {
    images = data;

    if( images === null ) {
        return;
    }

    $( ".galleryImage" ).each(function() {
            $(this).remove();
    });

    for (var key in images) {
        var imageId = images[key]['id'];
        var imagePath = images[key]['image'];
        var thumbnailPath = images[key]['thumbnail'];
        var avatar = images[key]['avatar'];
        htmlImage(imageId, thumbnailPath, avatar);
    }

    $("div.galleryImageDelete").click(function(){
        imageDelete($(this));
    });

}




function offerEdit(offer_key) {

    Clear();

    if(key_prev >= 0){
        $("#divOffer_"+key_prev).attr( "class", "list-group-item " );
    }
    key_prev = offer_key;

    Id = offers[offer_key]['id'];
    published = offers[offer_key]['published'];
    $('#inpHeader').val(offers[offer_key]['header']);

    $('#inpPlace').val(offers[offer_key]['place']);
    $('#inpPlace').data('placeName', offers[offer_key]['place']);
    $('#inpPlace').data('placeId', offers[offer_key]['place_id']);

    $('#inpQuantityMin').val(offers[offer_key]['quantity_min']);
    $('#inpQuantityMax').val(offers[offer_key]['quantity_max']);
    $('#inpDescription').val(offers[offer_key]['description']);

    $("#divOffer_"+offer_key).attr( "class", "list-group-item  list-group-item-warning" );
    $("#divCreateOffer").attr( "class", "alert alert-warning" );
    $("#txtCaption").html( "<b>Редактировать предложение</b>" );

    $("#bgDraft").css("display", "");
    if( published == 1 ) {
        $("#btnAdd").html('Сохранить изменения');
        $("#bgDraft").html("Опубликовано");
    } else {
        $("#bgDraft").html("Черновик");
    }

    getOffersPrice();
    getOfferImages();

}



function Clear() {
    // очистка формы
    Id = 0;
    published = 0;
    $("#divOffer_"+key_prev).attr( "class", "list-group-item " );
    $("#frmOffer")[0].reset();
    $("#divCreateOffer").attr( "class", "alert alert-primary" );
    $("#txtCaption").html( "<b>Сформировать предложение</b>" );
    key_prev = -1;

    $( ".price" ).each(function( index ) {
        if(index > 0) {
            $(this).remove();
        }
    });

    $( ".galleryImage" ).each(function() {
            $(this).remove();
    });

    $('#inpPlace').data('placeId', '0');
    $('#inpPlace').data('placeName', '');
    $("#inpRestBegin").prop("disabled", false);
    $("#inpRestEnd").prop("disabled", false);
    $("#inpPrice").prop('disabled', false);
    $("#inpPriceAllYear").css('display', 'none');
    $("#btnPlus").css('display', '');
    $("#bgDraft").css("display", "none");
    $("#btnAdd").html('Опубликовать');
}


function offerDelete(offer_key) {
    var offerId = offers[offer_key]['id'];

    //if(offerId == Id) {
        Clear();
    // }

    var objParams = {
        'action' : 'offer_delete',
        'offerId' : offerId
    };
    sendData(objParams);
}



function offerRelate(Id) {

    var $form = $('<form>', {
        'action': CTRL_URL,
        'method': 'POST'
    }).append($('<input>', {
        'type' : 'hidden',
        'name' : 'action',
        'value' : 'relates_tenders'
    })).append($('<input>', {
        'type' : 'hidden',
        'name' : 'offerId',
        'value' : Id
    }));

    $("#offer_list").append($form);
    $form.submit();
}
