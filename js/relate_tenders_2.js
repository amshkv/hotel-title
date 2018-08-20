
function tenders($div, action, offerId, rqId, touristId, type, view) {
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
            success: function (data) {
                // console.log(data);
                showRequisitions(data);
            }
        });
    }


    function showRequisitions(data) {
        var htmlRequisition;
        var btn;

        requisitions = data;

        // $div.html('');

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

            var notActive = 'class="chat-toggle__people--no-active"';
            var notTourist = '';
            var notChildren = '';
            var notBaby = '';
            if (quantity_tourist <= 0) {
                notTourist = notActive
            }
            if (quantity_children <= 0) {
                notChildren = notActive
            }
            if (quantity_baby <= 0) {
                notBaby = notActive
            }

            if (rqId > 0) {
                htmlRequisition =
                    '<div id="requisitions" class="chat-toggle__item chat-toggle__item--tender">' +
                    '<div class="chat-toggle__button chat-toggle__button--tender">' +
                    '<span>Тендер</span >' +
                    '</div>' +
                    '<div class="chat-toggle__item-inner">' +
                    '<div class="chat-toggle__line">' +
                    '<h2 class="chat-toggle__title">' + header + '</h2>' +
                    '<div class="chat-toggle__address">' + place + '</div>' +
                    '<div class="chat-toggle__people">' +
                    '<span ' + notTourist +
                    '>Взрослые: ' + quantity_tourist + ',&ensp;</span>' +
                    '<span ' + notChildren +
                    '>дети (7-14 лет): ' + quantity_children + ',&ensp;</span>' +
                    '<span ' + notBaby +
                    '>дети до 7 лет: ' + quantity_baby + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="chat-toggle__line chat-toggle__line--pb">' +
                    '<div class="offers__item">' +
                    '<span class="offers__text-def">с</span> ' + rest_begin + ' <span class="offers__text-def">по</span> ' + rest_end +
                    // '<span class="offers__text-def offers__text-def--price">Стоимость:' +
                    // price +
                    // ' руб.</span>' +
                    '</div>' +
                    '<div class="chat-toggle__user-text">' + description +
                    '</div>' +
                    '</div>' +
                    '<div class="chat-toggle__info">' +
                    '<div class="chat-toggle__info-number">' + rqId +
                    '</div>' +
                    '<div class="chat-toggle__info-button"></div>' +
                    '<div class="chat-toggle__info-name">Тендер</div>' +
                    '</div>' +
                    '</div> ';

            }

            $div.append(htmlRequisition);

        }
    }



}