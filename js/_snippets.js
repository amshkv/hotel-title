
// ***********************************************
// снипеты
// ***********************************************
var requisitions;
var username = '';
var reqId = 0;

$(document).ready(function(){
    // getRequisitions('get_requisitions',0,'1900-01-01','1900-01-01');

    $( document ).ajaxComplete(function( event, request, settings ) {
        console.log( event, request, settings );
        if(settings.data === null) {
            return;
        }
        if(settings.data.indexOf('get_requisitions') >= 0 ) {
            showRequisitions(request.responseJSON);
        }

    });

});




function getRequisitions(action, place_id, d1, d2) {
    var objParams = {
        'action': action,
        'PlaceId' : place_id,
        'dateFrom' : d1,
        'dateTo' : d2,
        'reqId' : reqId
    };

    sendData(objParams);
}


function showRequisitions(data) {
    var favoriteColor;

    requisitions = data;

    if( requisitions === null ) {
        return;
    }





    $( ".requisition" ).each(function() {
        $(this).remove();
    });

    for (var key in requisitions) {
        var rqId = requisitions[key]['id'];
        var header = requisitions[key]['header'];
        var place = requisitions[key]['place'];
        var quantity_tourist = requisitions[key]['quantity_tourist'];
        var quantity_children = requisitions[key]['quantity_children'];
        var quantity_baby = requisitions[key]['quantity_baby'];
        var rest_begin = phpToCal(requisitions[key]['rest_begin']);
        var rest_end = phpToCal(requisitions[key]['rest_end']);
        var description = requisitions[key]['description'];
        var name = requisitions[key]['name'];
        // var price = offers[key]['price'];
        var favorite_id = requisitions[key]['favorite_id'];

        var htmlRequisition =

            '<div class="alert alert-primary requisition" role="alert" >' +
                '<h4 class="alert-heading">'+header+'</h4>' +
                '<div class="clearfix" >' +
                    '<div class="float-left">' +
                        '<p class="mb-0">Куда: <b>'+place+'</b></p>' +
                        '<p class="mb-0">Количество взрослых: <b>'+quantity_tourist+'</b>; детей: <b>'+quantity_children+'</b>; младенцев: <b>'+quantity_baby+'</b></p>' +
                        '<p class="mb-0">Дата начала отдыха: <b>'+rest_begin+'</b></p>' +
                        '<p class="mb-0">Дата окончания отдыха: <b>'+rest_end+'</b></p>' +
                        '<p class="mb-0">Пожелания: <b>'+description+'</b></p>' +
                    '</div>' +
                    '<div class="float-right" style="text-align: right">' +
                        '<p class="mb-0">№ <b>'+rqId+'</b></p>' +
                        '<p class="mb-0">Турист: <b>' + name + '</b></p>';

        if(reqId === 0) {
            favoriteColor = ( favorite_id > 0 ) ? "btn-danger" : "btn-warning";

            htmlRequisition +=
            '<div class="btn-group  float-right" role="group">' +
            '<button type="button" data-rq-id="' + rqId + '" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            'Предложить' +
            '</button>' +
            '<div class="dropdown-menu"></div>' +
            '</div>' +
            '<button data-rq-id="' + rqId + '" class="btn float-right favorites '+ favoriteColor +'">+</button>';
        }

        htmlRequisition +=
                    '</div>' +
                '</div>' +
            '</div>';

        $("#rqBottom").before(htmlRequisition);

    }

    $('.dropdown-toggle').on( "click", function() {
        if(username == '' || username == null) {
            var scrollTop = $('#frmLogin').offset().top;
            $(document).scrollTop(scrollTop);
            return;
        }
        offerListShow($(this).parent().find('.dropdown-menu'), offers, $(this).data('rqId'));
    });

    $('.favorites').on( "click", function() {
        if(username == '' || username == null) {
            var scrollTop = $('#frmLogin').offset().top;
            $(document).scrollTop(scrollTop);
            return;
        }


        changeFavorites($(this));
    });







}


function offerListShow($div, arr, rqId) {
    var key;

    $div.empty();
    for (key in arr) {

        var id = offers[key]['id'];
        var header = offers[key]['header'];
        var published = offers[key]['published'];

        if( published == 0 ) {
            continue;
        }

        $div.append($('<button>', {
            class: "dropdown-item",
            text: header,
            'data-offer-id': id,
            on: {
                click: function(event){
                    relateOffer($(this).data('offerId'), rqId);
                }
            }
        }));

    }


}

function relateOffer(offerId, rqId) {

    var $form = $('<form>', {
        action : CTRL_URL,
        method : 'POST'
    }).append($('<input>', {
        type : 'hidden',
        name : 'action',
        value : 'relate_offer'
    })).append($('<input>', {
        type : 'hidden',
        name : 'offerId',
        value : offerId
    })).append($('<input>', {
        type : 'hidden',
        name : 'rqId',
        value : rqId
    }));

    $("#rqBottom").before($form);
    $form.submit();
}



function changeFavorites($elem) {

    var rqId = $elem.data('rqId');
    var objParams = {
        'action': 'favorites_change',
        'tenderId': rqId
    };

    $.ajax({
        url: CTRL_URL,
        type: "POST",
        data: objParams,
        dataType: 'json',
        success:function(data){
            btnFavorites($elem, data[0][0]);
        }
    });
}


function btnFavorites($elem, id) {
    if( id == 0 ) {
        $elem.removeClass( "btn-danger" ).addClass( "btn-warning" );
    } else {
        $elem.removeClass( "btn-warning" ).addClass( "btn-danger" );
    }
}

