$(document).ready(function () {
    let me = $('#msg').data('msgs');
    let rid= $('#msg').data('msgr');
    console.log(me);
    console.log(rid);


    $.ajax({
        method: 'GET',
        url: '/chat/lastfort/' + rid
    }).done((msg) => {
        let fdus = JSON.parse(msg);
        fdus.forEach(element => {
            console.log("element -- "+element);
            myFunction(element);
        });
        $("#userfind").focus();
        console.log(msg);
    }).fail((jqXHR, status) => {
        console.log("ajax fail");
    });
});

//

function myFunction(msg) {
    var dflex = document.createElement("div");
    var msgtext = document.createElement("div");
    msgtext.classList.add("msg_text");
    msgtext.innerHTML = msg.msgtext;
    if (msg.ismy == true) {
        dflex.classList.add("d-flex", "justify-content-end", "line");
        var mystyleContright = document.createElement("div");
        mystyleContright.classList.add("mystyle", "contright");
        mystyleContright.appendChild(msgtext);
        dflex.appendChild(mystyleContright);
    } else {
        dflex.classList.add("d-flex", "line");
        var mystyleContleft = document.createElement("div");
        mystyleContleft.classList.add("mystyle", "contleft");
        var imgcontmsg = document.createElement("div");
        imgcontmsg.classList.add("img_cont_msg");
        var imguser = document.createElement("img");
        imguser.src = "/imgdata/profimg/prof.png";
        imguser.style.width = "100%";
        imguser.classList.add("rounded-circle", "user_img_msg");
        imgcontmsg.appendChild(imguser);
        mystyleContleft.appendChild(msgtext);
        mystyleContleft.appendChild(imgcontmsg);
        dflex.appendChild(mystyleContleft);
    }
    let mdiv = document.getElementById('msg');
    if (mdiv != null && mdiv != undefined) {
        mdiv.appendChild(dflex);
    }
}