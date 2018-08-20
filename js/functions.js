
var CTRL_URL = "controller.php";
var IMAGE_URL = "https://h-dev.8h.ru/";

function sendData(objParams) {

    $.ajax({
        url: CTRL_URL,
        type: "POST",
        data: objParams,
        dataType: 'json',
        success:function(data){
            //alert(data[0][0]);
        }
    });
}


function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}



