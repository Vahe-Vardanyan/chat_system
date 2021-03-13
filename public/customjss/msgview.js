const room = require("../../models/room");

var me='';
var to_uid='';
var socket;
//
var mto = {
    tid: { usid: '' },
    text: ''
};
var last20 = {
    frid: ''
};

//id,name, sername,profpic
//
// var msgMap = Map();
//
$(document).ready(function () {   
    me= $('.user_info').data('me');
    socket = new WebSocket("ws://localhost:9030/?me=" + me);
    socket.onmessage = function(event) {
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
    $('#action_menu_btn').click(function() {
        $('.action_menu').toggle();
    });
});
//
$('.line').click(function (ev) {
    
    to_uid = $(this).children().find('img').data('userid');
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
    if(ustat==undefined){
        //ajax call, create room
        $.ajax({
            method:'POST',
            url:'/chat/roomp2p',
            data:{me:me,to:to_uid}
        }).done((msg)=>{
            let rid=JSON.parse(msg);
            msgView(rid.r);
            $(this).data('ustat', rid.r);
        }).fail((jqXHR,status)=>{
            alert('room is not created');
        });
    }else{

    }
    
       // return false;
};

function msgView(rum){
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












