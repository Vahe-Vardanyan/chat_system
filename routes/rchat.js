var express = require('express');
var app=require('../app');
var router = express.Router();
var User = require('../models/user');
var Roomp2p = require('../models/room');
var Participant = require('../models/participant');
var upicture = require('../models/proflastpic');
const { json } = require('body-parser');
const participant = require('../models/participant');
//const umap = new Map();
//

// app.param('uid', function (req, res, next, id) {
//     console.log('CALLED ONLY ONCE');
//     next();
//   });
router.post('/roomp2p', isLoggedIn, function (req, res){
    let data=req.body;
    let room=new Roomp2p();
    room.name='';
    room.isGroup=false;
    room.save(function (err) {
        if (err)
        res.end(JSON.stringify({r:null}));
        else {
            let rid={
                r:room._id
            };
            let p2p1=new Participant();
            let p2p2=new Participant();
            p2p1.userId=data.me;
            p2p1.roomp2p=p2p2.roomp2p=rid.r;
            p2p2.userId=data.to;
            Participant.insertMany([p2p1,p2p2]).then(function(){
                res.end(JSON.stringify(rid));  // Success 
            }).catch(function(error){ 
                res.end(JSON.stringify({r:null}));      // Failure 
            }); 
          
        }
    });
});



router.get('/', isLoggedIn, function (req, res) {
    
    res.render('chatroom.html', { user: req.user.local });
});

router.get('/msgviewer/:uid', isLoggedIn, function (req, res) {
    User.findById(req.params.uid).populate('ppic').exec( (err, users) => {
        if (err) {
            next(err);
        } else {           
            let _pp='';
             upicture.findOne({ usId: req.params.uid }).sort({ addDate: -1 }).limit(1).exec(function (err, data) {
                if (data) {
                    _pp='/imgdata/'+ req.params.uid + '/' + data.picPath;
                }else {
                    _pp= '/imgdata/profimg/prof.png';
                    }
             
                  res.render('msgviewer.html', { user: users, ppat:_pp });
            });   
        }
    });


    // console.log(req.params.uid);
});

router.get('/welcomechat', isLoggedIn, function (req, res) {
  
    res.render('welcomechat.html');
});
//
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
//
module.exports = router;