

function inputsearch( $inp, url, action ) {

    var currentFocus;
    /*execute a function when someone writes in the text field:*/

    $inp.on('input', function(){
        var val = $(this).val();

        closeAllLists();
        if (!val) { return false;}

        currentFocus = -1;
        citySearch(val);
    });

    // inp.addEventListener("input", function(e) {
    //     var val = this.value;
    //
    //     closeAllLists();
    //     if (!val) { return false;}
    //
    //     currentFocus = -1;
    //     citySearch(val);
    //
    // });

    /*execute a function presses a key on the keyboard:*/
    $inp.keydown(function(e){
        var x = document.getElementById(this.id + "autocomplete-list");

        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });


    // inp.addEventListener("keydown", function(e) {
    //     var x = document.getElementById(this.id + "autocomplete-list");
    //     console.log(x);
    //     if (x) x = x.getElementsByTagName("div");
    //     if (e.keyCode == 40) {
    //         /*If the arrow DOWN key is pressed,
    //         increase the currentFocus variable:*/
    //         currentFocus++;
    //         /*and and make the current item more visible:*/
    //         addActive(x);
    //     } else if (e.keyCode == 38) { //up
    //         /*If the arrow UP key is pressed,
    //         decrease the currentFocus variable:*/
    //         currentFocus--;
    //         /*and and make the current item more visible:*/
    //         addActive(x);
    //     } else if (e.keyCode == 13) {
    //         /*If the ENTER key is pressed, prevent the form from being submitted,*/
    //         e.preventDefault();
    //         if (currentFocus > -1) {
    //             /*and simulate a click on the "active" item:*/
    //             if (x) x[currentFocus].click();
    //         }
    //     }
    // });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/

        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != $inp.get(0)) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    function citySearch(val) {

        var objParams = {
            'action' : action,
            'searchString' : val
        };

        $.ajax({
            url: url,
            type: "POST",
            data: objParams,
            dataType: 'json',
            success:function(data){
                fillCities(data);
            }
        });

    }

    function fillCities(arr) {
        var a, b;

        // console.log(arr);

        a = document.createElement("DIV");
        a.setAttribute("id", $inp.prop('id') + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        // inp.parentNode.appendChild(a);
        $inp.parent().append(a);

        for (var key in arr) {

            b = document.createElement("DIV");
            b.innerHTML = arr[key]['title'];
            b.innerHTML += "<input type='hidden' id='"+ arr[key]['id'] +"' value='" + arr[key]['title'] + "'>";

            b.addEventListener("click", function(e) {
                $inp.val( this.getElementsByTagName("input")[0].value );
                $inp.data( 'placeId', this.getElementsByTagName("input")[0].id );
                $inp.data( 'placeName', this.getElementsByTagName("input")[0].value );

                closeAllLists();
                $inp.trigger('change');

            });
            a.appendChild(b);
        }
    }
}


