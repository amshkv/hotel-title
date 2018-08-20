
var uid;

$(document).ready(function(){

    $("button#btnNext").click(function(){
        next();
    });

});

function next() {

    var pass1 = $("#inpPass1").val();
    var pass2 = $("#inpPass2").val();

    if(pass1 !== pass2){
        $("#divPass").html("Пароли не совпадают.");
        return;
    }


    // var objParams = {
    //     'action' : 'tourist_setPassword',
    //     'uid' : uid,
    //     'password' : pass1
    // };
    // sendData(objParams);

    $("#frmMain").submit();
}