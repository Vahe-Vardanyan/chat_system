

var me = '';
var to_uid = '';
var socket;
//
var mto = {
    tid: { usid: '' },
    text: ''
};
var last20 = {
    frid: ''
};

let userarr = [{
    name: "hjjh",
    lname: "dsfd",
    uid: "id1"
},
{
    name: "hjmnjh",
    lname: "dsnmfd",
    uid: "id2"
}
];


//id,name, sername,profpic
//
// var msgMap = Map();
//
$(document).ready(function () {
    me = $('.user_info').data('me');
    socket = new WebSocket("ws://localhost:9030/?me=" + me);
    socket.onmessage = function (event) {
        let message = event.data;
        console.log(message);
        let newmsg = {
            crtime: Date.now(),
            msgtext: message,
            picpath: '../imgdata/profimg/prof.png',
            ismy: false
        };
        myFunction(newmsg);
    }
    //
    socket.onerror = function (event) {
        let message = event.data;
        alert(message);
    }
    //
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
});
$("#userfind").focus(() => {
    for (let i = 0; i < userarr.length; i++) {
        fndduser(userarr[i]);
    }
});
function fndduser(_fu) {
    var fuspan = document.createElement("span");
    fuspan.innerHTML = _fu.name + " " + _fu.lname;
    var fudiv = document.createElement("div");
    fudiv.classList.add("user_info");
    fudiv.appendChild(fuspan);
    var fudiv1 = document.createElement("div");
    fudiv1.classList.add("d-flex", "bd-highlight", "line");
    fudiv1.setAttribute("data-ustat", "");
    fudiv1.setAttribute("data-userid", _fu.uid);
    fudiv1.appendChild(fudiv);
    var fuli = document.createElement("li");
    fuli.classList.add("frinfo");
    fuli.appendChild(fudiv1);
    var fuul = document.getElementsByClassName("contacts");
    fuul[0].appendChild(fuli);
}



let pop = "";
$("#userfind").on('keyup', (e) => {
    $("#userfind").prop('disabled', true);
    e.stopPropagation();
    pop = $("#userfind").val();
    console.log(pop);//aystex petq e lini ajax vor@ petq e ka
    if (pop == "") {
        $("#userfind").prop('disabled', false);
        $("#userfind").focus();
        return;
    }
    $.ajax({
        method: 'GET',
        url: '/users/usrfind/' + pop
        // data: { me: me, to: to_uid }
    }).done((msg) => {
        // let rid = JSON.parse(msg);
        // msgView(rid.r);
        // $(this).data('ustat', rid.r);
        $("#userfind").prop('disabled', false);
        $("#userfind").focus();
        console.log(msg);
    }).fail((jqXHR, status) => {
        console.log("ajax fail");
    });

});
//
$('.line').click(function (ev) {
    to_uid = $(this).data('userid');
    // to_uid = $(this).children().find('img').data('userid');
    $('iframe').attr('src', "/chat/msgviewer/" + to_uid);
    // get my missed msgs
    //last20.frid = to_uid;
    //socket.send(JSON.stringify(last20.frid));
    //
    $('.d-flex').removeClass('active');
    $(this).addClass('active');
    $('.bottom-content').css("display", "block");

    // alert(me+" "+to_uid )
});

// send message from the form
function msgSend() {
    let ustat = $(this).data('ustat');
    if (ustat == undefined) {
        //ajax call, create room
        $.ajax({
            method: 'POST',
            url: '/chat/roomp2p',
            data: { me: me, to: to_uid }
        }).done((msg) => {
            let rid = JSON.parse(msg);
            msgView(rid.r);
            $(this).data('ustat', rid.r);
        }).fail((jqXHR, status) => {
            alert('room is not created');
        });
    } else {

    }

    // return false;
};

function msgView(rum) {
    let outgoingMessage = document.getElementsByName('message')[0].value;
    mto.tid.usid = rum;
    mto.text = outgoingMessage;
    console.log('outgoingMessage ' + outgoingMessage);
    socket.send(JSON.stringify(mto));
    let newmsg = {
        crtime: Date.now(),
        msgtext: outgoingMessage,
        picpath: '../imgdata/profimg/prof.png',
        ismy: true
    };
    myFunction(newmsg);
    //
    var myDiv = document.getElementById('msgframe').contentWindow.document.getElementById("msg");
    if (myDiv != null && myDiv != undefined) {
        myDiv.scrollTop = myDiv.scrollHeight;
    }
}
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
    let mdiv = document.getElementById('msgframe').contentWindow.document.getElementById('msg');
    if (mdiv != null && mdiv != undefined) {
        mdiv.appendChild(dflex);
    }
}

var myDiv = document.getElementById('msgframe').contentWindow.document.getElementById("msg");
if (myDiv != null && myDiv != undefined) {
    myDiv.scrollTop = myDiv.scrollHeight;
}












