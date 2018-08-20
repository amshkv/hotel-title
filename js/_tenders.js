
function tenders($div, action, offerId, rqId, touristId, type, view ) {
    var requisitions;
    getRequisitions();

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
            var name = requisitions[key]['name'];
            var theme = requisitions[key]['theme'];
            // var price = offers[key]['price'];

            btn = (view == 'chat') ? '' :
                $('<button>', {
                    class: 'btn btn-primary chat',
                    'data-key': key,
                    text: 'Чат',
                    on : {
                        click: function (event) {
                            relate($(this).data('key'), 'chat_offer_rq');
                        }
                    }
                });

            if( rqId > 0 ) {
                htmlRequisition =
                    '<div class="alert alert-success requisition tender" role="alert" >' +
                    '<h4 class="alert-heading">' + header + '</h4>' +
                    '<div class="clearfix" >' +
                    '<div class="float-left">' +
                    '<p class="mb-0">Куда: <b>' + place + '</b></p>' +
                    '<p class="mb-0">Количество взрослых: <b>' + quantity_tourist + '</b>; детей: <b>' + quantity_children + '</b>; младенцев: <b>' + quantity_baby + '</b></p>' +
                    '<p class="mb-0">Дата начала отдыха: <b>' + rest_begin + '</b></p>' +
                    '<p class="mb-0">Дата окончания отдыха: <b>' + rest_end + '</b></p>' +
                    '<p class="mb-0">Пожелания: <b>' + description + '</b></p>' +
                    '</div>' +
                    '<div class="float-right " id="off'+offerId + '_rq' + key+ '" style="text-align: right">' +
                    '<p class="mb-0">№ <b>' + rqId + '</b></p>' +
                    '<p class="mb-0">Турист: <b>' + name + '</b></p>'
                    ;


                htmlRequisition +=
                    '</div>' +
                    '</div>' +
                    '</div>';

            } else {

                htmlRequisition =
                $('<div>', {
                    class: 'alert alert-warning requisition user',
                    role : 'alert'
                }).append($('<p>', {
                    html : theme,
                    append: btn
                })).append($('<p >', {
                    html : 'Турист: <b>' + name + '</b>  ',
                    id : 'off' + offerId + '_rq' + key
                    // append: btn
                }));

            }

            $div.append(htmlRequisition);
            $('#off'+offerId + '_rq' + key).append(btn);


        }
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


}