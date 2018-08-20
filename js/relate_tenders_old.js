
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

            if( rqId > 0 ) {
                htmlRequisition =
                    '<div style="background-color: #5bc0de">&nbsp;</div>'+
                    '<div class="block-main">' +
                        '<div class="col col-1">' +
                            '<h2>' + header + '</h2>' +
                            '<p>' + place + '</p>' +
                            '<p class="field-item">Взрослые: '+ quantity_tourist +',</p>' +
                            '<p class="field-item">дети (7-14 лет): '+ quantity_children +',</p>' +
                            '<p class="field-item"><span>дети до 7 лет: '+ quantity_baby +'</span></p>' +
                        '</div>' +
                        '<div class="col col-2">' +
                            '<p class="field-item-1"><span>с</span> '+ rest_begin + ' <span>по</span> '+ rest_end +'</p>'+
                            '<p>'+ description +'</p>'+
                        '</div>'+
                        '<div class="col col-3">'+
                            '<div class="left">'+
                                '<p>Тендер</p>'+
                            '</div>'+
                            '<div class="center">'+
                                '<img class="img-responsive" src="design/images/arrow-up.png"/>'+
                            '</div>'+
                            '<div class="right">'+
                                '<div class="number">'+ rqId +'</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

            }

            $div.append(htmlRequisition);

        }
    }



}