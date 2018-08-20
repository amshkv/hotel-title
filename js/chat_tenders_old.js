
function tenders($div, action, offerId, rqId, touristId, type, view ) {
    var requisitions;


    function getRequisitions() {
        var objParams = {
            'action': action,
            'offerId': offerId,
            'rqId': rqId,
            'touristId': touristId,
            'type': type // 0- все, 1-туристы, 2- заявки
        };

        $.ajax({
            url: CTRL_URL,
            type: "POST",
            data: objParams,
            dataType: 'json',
            success:function(data){
                // console.log(data);
                showRequisitions(data);
            }
        });

    }


    function showRequisitions(data) {
        var htmlRequisition;
        var btn;
        var msg, color;


        requisitions = data;

        $div.html('');

        if (requisitions === null) {
            return;
        }


        for (var key in requisitions) {
            var rqId = requisitions[key]['rqId'];
            var header = requisitions[key]['header'];
            var place = requisitions[key]['place'];
            var quantity_tourist = requisitions[key]['quantity_tourist'];
            var quantity_children = requisitions[key]['quantity_children'];
            var quantity_baby = requisitions[key]['quantity_baby'];
            var rest_begin = phpToCal(requisitions[key]['rest_begin']);
            var rest_end = phpToCal(requisitions[key]['rest_end']);
            var description = requisitions[key]['description'];
            var name = requisitions[key]['name']; // имя туриста
            var theme = requisitions[key]['theme'];
            var rq_published = requisitions[key]['rq_published'];
            var rq_deleted = requisitions[key]['rq_deleted'];
            var tourist_messages = requisitions[key]['tourist_messages'];
            // var price = offers[key]['price'];
            var message = requisitions[key]['message'];
            var msg_date = requisitions[key]['msg_date'];
            var msg_time = requisitions[key]['msg_time'];


            color = "";
            if(rq_deleted === 1) {
                header += " (снято с публикации)";
                color = 'style="color: #b7b7b7;"';
            }

            msg = ( tourist_messages > 0) ? tourist_messages + ' новых сообщений' : 'все сообщения' ;

            if( rqId > 0 ) {
                htmlRequisition =
                    '<div class="block-main">'+
                    '<div class="col col-1">'+
                    '<h2 '+color+'>' + header + '</h2>'+
                    '<p>'+ place +'</p>'+
                    '<p class="field-item">Взрослые: '+ quantity_tourist +'</p>'+
                    '<p class="field-item">дети (7-14 лет): '+quantity_children+'</p>'+
                    '<p class="field-item"><span>дети до 7 лет: '+quantity_baby+'</span></p>'+
                    '</div>'+
                    '<div class="col col-2">'+
                    '<p class="field-item-1"><span>с</span> '+ rest_begin + ' <span>по</span> '+ rest_end +'</p>'+
                    '<p>'+ description +'</p>'+
                    '</div>'+
                    '<div class="col col-3">'+
                        '<div class="left">'+
                        '<p>Тендер</p>'+
                        '<div class="number">'+ rqId +'</div>'+
                        '</div>'+
                        '<div class="right">'+
                        '<a class="mail chat_mail_tender'+offerId+'" href="#" data-key="'+ offerId +'_'+ key +'">'+ msg +'</a>'+
                    '</div>'+
                    '</div>'+
                    '</div>'
                ;


                var act = (tourist_messages > 0) ? 'active' : '' ;

                message = (message == '') ? '' : '<p class="name">' + message + '</p>';




                htmlRequisition +=
                    '<div class="block-chats hidden '+act+' " id="tender_user_'+ offerId +'_'+ key +'">'+
                        '<a href="#" class="chat chat_tender'+ offerId +'" data-key="' + key + '">'+
                            '<div class="panel-heading">'+
                            '<p class="name">'+name+'</p>'+
                                message +
                            '</div>'+
                            '<div class="panel-body">' +
                                '<div class="col"><p></p></div>' +
                                '<div class="col"><p>'+ date_short(msg_date, msg_time) +'</p></div>' +
                                '<div class="col"><p></p></div>' +
                            '</div>' +
                        '</a>'+
                    '</div>';

                $div.append(htmlRequisition);



            }


        }

        $('.chat_mail_tender' + offerId).click(function(e) {
            e.preventDefault();
            $('#tender_user_' + $(this).data('key')).toggleClass("hidden");
        });

        $('.chat_tender'+offerId).click(function(e) {
            e.preventDefault();
            relate($(this).data('key'), 'chat_offer_rq');
        });


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
            'value' : requisitions[key]['offerId']
        })).append($('<input>', {
            'type' : 'hidden',
            'name' : 'rqId',
            'value': requisitions[key]['rqId']
        })).append($('<input>', {
            'type' : 'hidden',
            'name' : 'relationId',
            'value' : requisitions[key]['relationId']
        })).append($('<input>', {
            'type' : 'hidden',
            'name' : 'tourist_id',
            'value': requisitions[key]['tourist_id']
        }));

        $div.append($form);
        $form.submit();
    }

    getRequisitions();
}