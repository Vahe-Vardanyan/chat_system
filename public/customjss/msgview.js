//
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
let ddv = null;
var contact = null;
var selectedUser = {
    name: '',
    lname: '',
    prp: '',
    id: ''
};
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
    contact = $(".contacts")[1];

    //   let contact0 = $(".contacts")[0];
    // //   console.log(contact0.innerHTML);
});
//
$('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
});
//
$("#userfind").focus(() => {
    let pop = $("#userfind").val();
    if (pop == '') {
        $('#chatuser').css('display', 'block');
        $('#finduser').css('display', 'none');
        while (contact.firstChild) {
            contact.removeChild(contact.lastChild);
        }
    } else {
        $('#chatuser').css('display', 'none');
        $('#finduser').css('display', 'block');
    }
});
//
$("#userfind").focusout(() => {
    let pop = $("#userfind").val();
    if (pop != "") return;
    $('#chatuser').css('display', 'block');
    $('#finduser').css('display', 'none');
    while (contact.firstChild) {
        contact.removeChild(contact.lastChild);
    }
});
//
function fndduser(_fu, _section, _rid) {
    var fuimg = document.createElement("img");
    fuimg.setAttribute("src", _fu.prp);
    fuimg.classList.add("rounded-circle", "user_img");
    var fuvspn = document.createElement("span");
    fuvspn.classList.add("online_icon");
    //
    var fuipdiv = document.createElement("div");
    fuipdiv.classList.add("img_cont");
    fuipdiv.appendChild(fuvspn);
    fuipdiv.appendChild(fuimg);
    //
    var fuspan = document.createElement("span");
    fuspan.innerHTML = _fu.name + " " + _fu.lname;
    var fudiv = document.createElement("div");
    fudiv.classList.add("user_info");
    fudiv.appendChild(fuspan);
    var fudiv1 = document.createElement("div");
    fudiv1.classList.add("d-flex", "bd-highlight", "line");
    fudiv1.setAttribute("onclick", "selectforchat('" + _fu.id + "')");
    fudiv1.setAttribute("data-ustat", _rid);
    fudiv1.setAttribute("data-userid", _fu.id);
    fudiv1.appendChild(fuipdiv);
    fudiv1.appendChild(fudiv);
    var fuli = document.createElement("li");
    fuli.classList.add("frinfo");
    fuli.appendChild(fudiv1);
    var fuul = document.getElementsByClassName("contacts");
    fuul[_section].insertBefore(fuli,fuul[_section].childNodes[0]);
}
//
$("#userfind").on('keyup', (e) => {
    let pop = $("#userfind").val();
    $("#userfind").prop('disabled', false);
    while (contact.firstChild) {
        contact.removeChild(contact.lastChild);
    }
    if (pop == "") {
        $('#finduser').css('display', 'none');
        $('#chatuser').css('display', 'block');
        $("#userfind").focus();
    } else {
        $.ajax({
            method: 'GET',
            url: '/users/usrfind/' + pop
        }).done((msg) => {
            let fdus = JSON.parse(msg);
            fdus.forEach(element => {
                fndduser(element, 1, '');
            });
            $("#userfind").focus();
            // console.log(fdus);
        }).fail((jqXHR, status) => {
            console.log("ajax fail");
        });
    }
});
//
function selectforchat(usid) {
    ddv = $('*[data-userid="' + usid + '"]');
    let fullname = ddv.children()[1].innerText;
    console.log(ddv.children()[1].innerText);
    selectedUser.name = ddv.children()[1].innerText.split(' ')[0];
    selectedUser.lname = ddv.children()[1].innerText.split(' ')[1];
    selectedUser.id = usid;
    selectedUser.prp = ddv.children()[0].children[1].attributes[0].value;
    console.log(selectedUser);
    to_uid = usid;
    $('iframe').attr('src', "/chat/msgviewer/" + usid);
    $('.d-flex').removeClass('active');
    $(this).addClass('active');
    $('.bottom-content').css("display", "block");
}
//


function msgSend() {

    console.log(to_uid + '--' + ddv[0].dataset.ustat);
    if (ddv[0].dataset.ustat == '') {
        $.ajax({
            method: 'POST',
            url: '/chat/roomp2p',
            data: { me: me, to: to_uid }
        }).done((msg) => {
            let rid = JSON.parse(msg);
            msgView(rid.r);
            ddv[0].dataset.ustat = rid.r;
            console.log(ddv[0].dataset.ustat);

            // ADD TO FRENDLIST
            fndduser(selectedUser, 0, rid.r);

        }).fail((jqXHR, status) => {
            alert('room is not created');
        });
    } else {
        msgView(ddv[0].dataset.ustat);
    }
    // $("input:text").val("");
    // $("#userfind").focusout();

}
//
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












